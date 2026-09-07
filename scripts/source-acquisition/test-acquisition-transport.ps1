[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$runner = Join-Path $PSScriptRoot 'acquire-approved-pilot.ps1'
$server = Join-Path $PSScriptRoot 'fixtures\transport-fixture-server.ps1'
$tempRoot = Join-Path ([IO.Path]::GetTempPath()) ('document-processor-transport-test-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $tempRoot -Force | Out-Null
$stdout = Join-Path $tempRoot 'server.stdout.txt'
$stderr = Join-Path $tempRoot 'server.stderr.txt'
$port = 18080 + (Get-Random -Minimum 0 -Maximum 500)
$process = $null

function Assert-Condition {
    param([Parameter(Mandatory)][bool]$Condition, [Parameter(Mandatory)][string]$Message)
    if (-not $Condition) { throw "FAIL: $Message" }
}

try {
    $process = Start-Process -FilePath 'powershell.exe' -WindowStyle Hidden -PassThru -RedirectStandardOutput $stdout -RedirectStandardError $stderr -ArgumentList @('-NoProfile','-ExecutionPolicy','Bypass','-File',('"' + $server + '"'),'-Port',$port)
    $ready = $false
    for ($attempt = 0; $attempt -lt 40; $attempt++) {
        if ((Test-Path -LiteralPath $stdout -PathType Leaf) -and ((Get-Content -Raw -LiteralPath $stdout) -match 'READY')) { $ready = $true; break }
        Start-Sleep -Milliseconds 100
    }
    if (-not $ready) {
        $serverError = if (Test-Path -LiteralPath $stderr) { Get-Content -Raw -LiteralPath $stderr } else { '' }
        throw "FAIL: local fixture server starts; stderr=$serverError"
    }
    . $runner -LibraryMode
    $ua = 'Document-Processor-Source-Acquisition/1.0 (+controlled-pilot)'
    $base = "http://127.0.0.1:$port"

    $denied = Invoke-TrackedGet -Url "$base/always-403" -UserAgent $ua
    Assert-Condition ($denied.status -eq 403) 'genuine 403 remains a failure response'
    Assert-Condition ($denied.transportClient -eq 'curl.exe') 'curl transport is used explicitly'

    $direct = Invoke-TrackedGet -Url "$base/requires-accept" -UserAgent $ua
    Assert-Condition ($direct.status -eq 200 -and $direct.headers['Content-Type'] -match 'application/pdf') 'standard Accept header is sent and valid MIME is accepted'

    $redirect = Invoke-TrackedGet -Url "$base/redirect" -UserAgent $ua
    Assert-Condition ($redirect.status -eq 200 -and $redirect.finalUrl -eq "$base/payload" -and @($redirect.redirectChain).Count -eq 2) 'allowed redirect is followed and recorded'
    Assert-Condition ((Test-Payload -Bytes $redirect.bytes -ExpectedType 'PDF' -ContentType ([string]$redirect.headers['Content-Type'])).valid) 'valid binary PDF fixture passes payload validation'

    $html = Invoke-TrackedGet -Url "$base/html" -UserAgent $ua
    $htmlCheck = Test-Payload -Bytes $html.bytes -ExpectedType 'PDF' -ContentType ([string]$html.headers['Content-Type'])
    Assert-Condition (-not $htmlCheck.valid -and $htmlCheck.detectedType -in @('html','not-pdf','too-small')) 'HTML/error body is rejected as a PDF payload'

    Write-Output 'PASS: acquisition transport validation (curl interoperability, genuine 403 quarantine signal, standard headers, redirects, MIME/signature, HTML rejection)'
}
finally {
    if ($process -and -not $process.HasExited) { Stop-Process -Id $process.Id -Force }
    if ($process) { $process.WaitForExit() }
    if (Test-Path -LiteralPath $tempRoot) { Remove-Item -LiteralPath $tempRoot -Recurse -Force }
}
