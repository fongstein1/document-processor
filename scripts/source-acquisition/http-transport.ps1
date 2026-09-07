Set-StrictMode -Version Latest

function Get-TransportHeaderMap {
    param([Parameter(Mandatory)][string]$HeaderText)
    $blocks = [regex]::Split($HeaderText.Trim(), "\r?\n\r?\n") | Where-Object { $_ -match '(?m)^HTTP/\S+\s+\d{3}\b' }
    $block = @($blocks) | Select-Object -Last 1
    if ([string]::IsNullOrWhiteSpace([string]$block)) { throw 'curl did not return a parseable HTTP response header block.' }
    $lines = @($block -split "\r?\n")
    $statusLine = [string]$lines[0]
    $statusMatch = [regex]::Match($statusLine, '^HTTP/\S+\s+(\d{3})\b')
    if (-not $statusMatch.Success) { throw "Unrecognized curl HTTP status line: $statusLine" }
    $headers = [ordered]@{}
    foreach ($line in @($lines | Select-Object -Skip 1)) {
        if ($line -match '^([^:]+):\s*(.*)$') {
            $name = $matches[1]
            $value = $matches[2]
            if ($headers.Contains($name)) { $headers[$name] = "$($headers[$name]), $value" } else { $headers[$name] = $value }
        }
    }
    return [pscustomobject]@{ status = [int]$statusMatch.Groups[1].Value; headers = $headers }
}

function Invoke-TrackedHttpGet {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)][string]$Url,
        [Parameter(Mandatory)][string]$UserAgent,
        [string]$Accept = '*/*',
        [int]$TimeoutSeconds = 45,
        [int]$MaxRedirects = 5
    )
    $curl = Get-Command curl.exe -ErrorAction SilentlyContinue
    if (-not $curl) { throw 'curl.exe is required for the standards-compliant acquisition transport.' }
    $tempRoot = Join-Path ([IO.Path]::GetTempPath()) ('document-processor-http-' + [guid]::NewGuid().ToString('N'))
    New-Item -ItemType Directory -Path $tempRoot -Force | Out-Null
    $chain = [System.Collections.Generic.List[object]]::new()
    $current = $Url
    try {
        for ($hop = 0; $hop -le $MaxRedirects; $hop++) {
            $headerPath = Join-Path $tempRoot ("headers-$hop.txt")
            $bodyPath = Join-Path $tempRoot ("body-$hop.bin")
            $curlArgs = @(
                '--silent', '--show-error', '--request', 'GET', '--dump-header', $headerPath,
                '--output', $bodyPath, '--max-redirs', '0', '--connect-timeout', '20',
                '--max-time', [string]$TimeoutSeconds, '--user-agent', $UserAgent,
                '--header', "Accept: $Accept", $current
            )
            $curlOutput = @(& $curl.Source @curlArgs 2>&1)
            $exitCode = $LASTEXITCODE
            if ($exitCode -ne 0) { throw "curl.exe failed with exit code $exitCode for ${current}: $($curlOutput -join ' ')" }
            $parsed = Get-TransportHeaderMap -HeaderText ([IO.File]::ReadAllText($headerPath))
            $headers = $parsed.headers
            $location = if ($headers.Contains('Location')) { [string]$headers['Location'] } else { $null }
            $requestHeaders = [ordered]@{ 'User-Agent' = $UserAgent; Accept = $Accept }
            $chain.Add([ordered]@{ hop = $hop; requestedUrl = $current; method = 'GET'; requestHeaders = $requestHeaders; status = $parsed.status; headers = $headers; location = $location; transportClient = 'curl.exe' })
            if ($parsed.status -ge 300 -and $parsed.status -lt 400 -and $location) {
                if ($hop -eq $MaxRedirects) { throw "Redirect limit exceeded for $Url" }
                $current = ([Uri]::new([Uri]$current, $location)).AbsoluteUri
                continue
            }
            $bytes = if (Test-Path -LiteralPath $bodyPath -PathType Leaf) { [IO.File]::ReadAllBytes($bodyPath) } else { [byte[]]::new(0) }
            return [pscustomobject]@{
                initialUrl = $Url; finalUrl = $current; status = $parsed.status
                headers = $headers; bytes = $bytes; redirectChain = @($chain)
                transportClient = 'curl.exe'
            }
        }
    }
    finally { if (Test-Path -LiteralPath $tempRoot) { Remove-Item -LiteralPath $tempRoot -Recurse -Force } }
    throw "No terminal HTTP response for $Url"
}
