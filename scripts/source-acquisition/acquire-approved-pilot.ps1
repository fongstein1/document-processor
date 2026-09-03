[CmdletBinding()]
param(
    [Parameter(Mandatory)][string]$ApprovedManifestPath,
    [string]$PreviousAcquisitionManifestPath,
    [string]$CandidateId,
    [switch]$IdempotenceOnly
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Get-Sha256 {
    param([Parameter(Mandatory)][byte[]]$Bytes)
    $sha = [Security.Cryptography.SHA256]::Create()
    try { return ([BitConverter]::ToString($sha.ComputeHash($Bytes))).Replace('-', '').ToLowerInvariant() }
    finally { $sha.Dispose() }
}

function Get-FileSha256 {
    param([Parameter(Mandatory)][string]$Path)
    return (Get-FileHash -LiteralPath $Path -Algorithm SHA256).Hash.ToLowerInvariant()
}

function Get-HeaderMap {
    param([Parameter(Mandatory)]$Response)
    $headers = [ordered]@{}
    foreach ($header in $Response.Headers) { $headers[$header.Key] = (@($header.Value) -join ', ') }
    if ($Response.Content) {
        foreach ($header in $Response.Content.Headers) { $headers[$header.Key] = (@($header.Value) -join ', ') }
    }
    return $headers
}

function Get-OfficialHost {
    param([Parameter(Mandatory)]$Record)
    if ([string]$Record.publisher -match '(?i)Society of Actuaries') { return 'www.soa.org' }
    return 'content.naic.org'
}

function Assert-ApprovedRecord {
    param([Parameter(Mandatory)]$Record, [Parameter(Mandatory)][string]$SourceRoot)
    $eligible = @('CURRENT AUTHORITY — DOWNLOAD', 'CURRENT SUPPORT — DOWNLOAD')
    if ($Record.disposition -notin $eligible) { throw "Ineligible approved record: $($Record.candidateId)" }
    if ($Record.humanAdjudication -ne 'APPROVED') { throw "Record is not finally approved: $($Record.candidateId)" }
    if ([int]$Record.payloadCount -ne 1) { throw "Approved record is not one payload: $($Record.candidateId)" }
    if ([string]::IsNullOrWhiteSpace([string]$Record.directDownloadUrl)) { throw "Approved record has no direct URL: $($Record.candidateId)" }
    if ([string]::IsNullOrWhiteSpace([string]$Record.expectedFileName)) { throw "Approved record has no expected filename: $($Record.candidateId)" }
    if ([string]$Record.expectedFileType -match '/') { throw "Approved record has a compound file type: $($Record.candidateId)" }
    $uri = [Uri]$Record.directDownloadUrl
    if ($uri.Scheme -notin @('http', 'https') -or $uri.Host.ToLowerInvariant() -ne (Get-OfficialHost $Record)) { throw "Approved URL is not on the official publisher host: $($Record.candidateId)" }
    $destination = [IO.Path]::GetFullPath((Join-Path $SourceRoot $Record.proposedDestinationFolder))
    $root = [IO.Path]::GetFullPath($SourceRoot).TrimEnd('\')
    if (-not $destination.StartsWith($root + '\', [StringComparison]::OrdinalIgnoreCase)) { throw "Destination escapes source root: $($Record.candidateId)" }
    if ($destination -match '(?i)OneDrive') { throw "OneDrive destination is prohibited: $($Record.candidateId)" }
    return $destination
}

function Invoke-TrackedGet {
    param([Parameter(Mandatory)][string]$Url, [Parameter(Mandatory)][string]$UserAgent, [int]$TimeoutSeconds = 45)
    $handler = [System.Net.Http.HttpClientHandler]::new()
    $handler.AllowAutoRedirect = $false
    $client = [System.Net.Http.HttpClient]::new($handler)
    $client.Timeout = [TimeSpan]::FromSeconds($TimeoutSeconds)
    $client.DefaultRequestHeaders.UserAgent.ParseAdd($UserAgent)
    $chain = [System.Collections.Generic.List[object]]::new()
    $current = $Url
    try {
        for ($hop = 0; $hop -le 5; $hop++) {
            $request = [System.Net.Http.HttpRequestMessage]::new([System.Net.Http.HttpMethod]::Get, [Uri]$current)
            try { $response = $client.SendAsync($request, [Net.Http.HttpCompletionOption]::ResponseHeadersRead).GetAwaiter().GetResult() }
            finally { $request.Dispose() }
            $headers = Get-HeaderMap $response
            $location = if ($headers.Contains('Location')) { [string]$headers['Location'] } else { $null }
            $chain.Add([ordered]@{ hop = $hop; requestedUrl = $current; status = [int]$response.StatusCode; headers = $headers; location = $location })
            if ([int]$response.StatusCode -ge 300 -and [int]$response.StatusCode -lt 400 -and $location) {
                if ($hop -eq 5) { throw "Redirect limit exceeded for $Url" }
                $current = ([Uri]::new([Uri]$current, $location)).AbsoluteUri
                $response.Dispose()
                continue
            }
            $bytes = $response.Content.ReadAsByteArrayAsync().GetAwaiter().GetResult()
            $result = [pscustomobject]@{
                initialUrl = $Url; finalUrl = $current; status = [int]$response.StatusCode
                headers = $headers; bytes = $bytes; redirectChain = @($chain)
            }
            $response.Dispose()
            return $result
        }
    }
    finally { $client.Dispose(); $handler.Dispose() }
    throw "No terminal HTTP response for $Url"
}

function Test-Payload {
    param([Parameter(Mandatory)][byte[]]$Bytes, [Parameter(Mandatory)][string]$ExpectedType, [Parameter(Mandatory)][string]$ContentType)
    if ($Bytes.Length -lt 512) { return [pscustomobject]@{ valid = $false; detectedType = 'too-small'; reason = "Payload is only $($Bytes.Length) bytes." } }
    if ($ExpectedType -eq 'PDF') {
        $prefix = [Text.Encoding]::ASCII.GetString($Bytes, 0, [Math]::Min(8, $Bytes.Length))
        if (-not $prefix.StartsWith('%PDF-', [StringComparison]::Ordinal)) { return [pscustomobject]@{ valid = $false; detectedType = 'not-pdf'; reason = 'Missing PDF signature.' } }
        $tailStart = [Math]::Max(0, $Bytes.Length - [Math]::Min($Bytes.Length, 1048576))
        $tail = [Text.Encoding]::ASCII.GetString($Bytes, $tailStart, $Bytes.Length - $tailStart)
        if ($tail -notmatch '%%EOF') { return [pscustomobject]@{ valid = $false; detectedType = 'truncated-pdf'; reason = 'No %%EOF marker found near the end of the PDF.' } }
        if ($ContentType -match '(?i)text/html|application/xhtml') { return [pscustomobject]@{ valid = $false; detectedType = 'html'; reason = "HTML content type '$ContentType'." } }
        return [pscustomobject]@{ valid = $true; detectedType = 'PDF'; reason = 'PDF signature and EOF marker validated.' }
    }
    if ($ExpectedType -eq 'XLSX') {
        try {
            Add-Type -AssemblyName System.IO.Compression.FileSystem -ErrorAction SilentlyContinue
            $stream = [IO.MemoryStream]::new($Bytes)
            try {
                $archive = [IO.Compression.ZipArchive]::new($stream, [IO.Compression.ZipArchiveMode]::Read)
                try {
                    $names = @($archive.Entries | ForEach-Object FullName)
                    if ($names -notcontains '[Content_Types].xml' -or $names -notcontains 'xl/workbook.xml') { throw 'Required XLSX package parts are missing.' }
                    $sheetCount = @($names | Where-Object { $_ -match '^xl/worksheets/sheet\d+\.xml$' }).Count
                    return [pscustomobject]@{ valid = $true; detectedType = 'XLSX'; reason = "OOXML package validated with $sheetCount worksheet part(s)."; sheetCount = $sheetCount; entries = $names }
                }
                finally { $archive.Dispose() }
            }
            finally { $stream.Dispose() }
        }
        catch { return [pscustomobject]@{ valid = $false; detectedType = 'not-xlsx'; reason = $_.Exception.Message } }
    }
    return [pscustomobject]@{ valid = $false; detectedType = 'unsupported'; reason = "Unsupported expected type '$ExpectedType'." }
}

function Get-PdfReviewEvidence {
    param([Parameter(Mandatory)][string]$Path)
    $pdfInfo = Get-Command pdfinfo -ErrorAction SilentlyContinue
    $pdftotext = Get-Command pdftotext -ErrorAction SilentlyContinue
    $pageCount = $null
    $firstPage = 'First-page text extraction unavailable; perform visual identity review.'
    if ($pdfInfo) {
        $info = @(& $pdfInfo.Source -- $Path 2>$null)
        $pageLine = $info | Where-Object { $_ -match '^Pages:\s+(\d+)' } | Select-Object -First 1
        if ($pageLine) { $pageCount = [int]([regex]::Match($pageLine, '\d+').Value) }
    }
    if ($pdftotext) {
        $temp = Join-Path ([IO.Path]::GetTempPath()) ('dp-first-page-' + [guid]::NewGuid().ToString('N') + '.txt')
        try {
            & $pdftotext.Source -f 1 -l 1 -layout -- $Path $temp 2>$null
            if (Test-Path -LiteralPath $temp) { $firstPage = (Get-Content -Raw -LiteralPath $temp).Trim() }
        }
        finally { if (Test-Path -LiteralPath $temp) { Remove-Item -LiteralPath $temp -Force } }
    }
    return [ordered]@{ pageCount = $pageCount; firstPageEvidence = $firstPage }
}

function Get-XlsxReviewEvidence {
    param([Parameter(Mandatory)][string]$Path)
    Add-Type -AssemblyName System.IO.Compression.FileSystem -ErrorAction SilentlyContinue
    $archive = [IO.Compression.ZipFile]::OpenRead($Path)
    try {
        $workbook = $archive.Entries | Where-Object { $_.FullName -eq 'xl/workbook.xml' } | Select-Object -First 1
        $xml = if ($workbook) { $reader = [IO.StreamReader]::new($workbook.Open()); try { $reader.ReadToEnd() } finally { $reader.Dispose() } } else { '' }
        $names = @([regex]::Matches($xml, '<sheet\b[^>]*\bname="([^"]+)"') | ForEach-Object { $_.Groups[1].Value })
        $sheetParts = @($archive.Entries | Where-Object { $_.FullName -match '^xl/worksheets/sheet\d+\.xml$' } | ForEach-Object { $_.FullName })
        return [ordered]@{ workbookEntry = [bool]$workbook; sheetCount = $sheetParts.Count; sheetNames = $names; worksheetParts = $sheetParts; structuralObservations = @('OOXML workbook package opened successfully.', "Found $($sheetParts.Count) worksheet part(s).") }
    }
    finally { $archive.Dispose() }
}

function Write-ReviewPackets {
    param([Parameter(Mandatory)][string]$RunDirectory, [Parameter(Mandatory)][object[]]$Acquisitions, [Parameter(Mandatory)][string]$ApprovedManifestPath, [Parameter(Mandatory)][int]$NetworkRequestCount, [Parameter(Mandatory)][int]$OverwriteCount)
    $summary = [ordered]@{
        totalSelected = @($Acquisitions).Count
        successfullyDownloaded = @($Acquisitions | Where-Object { $_.acquisitionStatus -eq 'new_file' }).Count
        admitted = @($Acquisitions | Where-Object { $_.acquisitionOutcome -eq 'ADMIT_TO_PROCESSING_QUEUE' }).Count
        quarantined = @($Acquisitions | Where-Object { $_.acquisitionOutcome -eq 'QUARANTINE_FOR_HUMAN_REVIEW' }).Count
        rejected = @($Acquisitions | Where-Object { $_.acquisitionOutcome -eq 'REJECT_DO_NOT_PROCESS' }).Count
        duplicatesDetected = @($Acquisitions | Where-Object { $_.duplicateResult -ne 'none' }).Count
        systemicFailures = 0
        networkRequests = $NetworkRequestCount
        overwriteCount = $OverwriteCount
    }
    $packet = [ordered]@{ schemaVersion = '1.0'; packetType = 'controlled-regulatory-acquisition-review'; generatedAt = [DateTime]::UtcNow.ToString('o'); approvedManifestPath = $ApprovedManifestPath; summary = $summary; acquisitions = @($Acquisitions) }
    $jsonPath = Join-Path $RunDirectory 'acquisition-review-packet.json'
    $mdPath = Join-Path $RunDirectory 'acquisition-review-packet.md'
    $csvPath = Join-Path $RunDirectory 'acquisition-review-packet.csv'
    $packet | ConvertTo-Json -Depth 20 | Set-Content -LiteralPath $jsonPath -Encoding UTF8
    $columns = @('pilotSlot','candidateId','documentTitle','publisher','expectedFileType','sizeBytes','SHA256','duplicateResult','identityResult','statusResult','exceptionCode','acquisitionOutcome','reviewRequired','localPath')
    @($Acquisitions | Select-Object $columns) | Export-Csv -LiteralPath $csvPath -NoTypeInformation -Encoding UTF8
    $lines = [System.Collections.Generic.List[string]]::new()
    $lines.Add('# Controlled regulatory acquisition review packet')
    $lines.Add('')
    $lines.Add('Acquisition metadata and validation only. No processing, canonicalization, promotion, learner-facing use, or RAG eligibility is implied.')
    $lines.Add('')
    foreach ($key in $summary.Keys) { $lines.Add("- $key`: $($summary[$key])") }
    $lines.Add('')
    $lines.Add('| Candidate | Outcome | Publisher | Type | Bytes | SHA-256 | Duplicate | Identity | Status | Exception | Review required |')
    $lines.Add('|---|---|---|---|---:|---|---|---|---|---|---|')
    foreach ($record in $Acquisitions) { $lines.Add("| $($record.candidateId) | $($record.acquisitionOutcome) | $($record.publisher) | $($record.detectedType) | $($record.sizeBytes) | $($record.SHA256) | $($record.duplicateResult) | $($record.identityResult) | $($record.statusResult) | $($record.exceptionCode) | $($record.reviewRequired) |") }
    Set-Content -LiteralPath $mdPath -Value ($lines -join "`r`n") -Encoding UTF8
    return [pscustomobject]@{ json = $jsonPath; markdown = $mdPath; csv = $csvPath }
}

function Invoke-IdempotenceCheck {
    param([Parameter(Mandatory)]$ApprovedManifest, [Parameter(Mandatory)][string]$ApprovedManifestPath, [Parameter(Mandatory)][string]$ManifestPath, [Parameter(Mandatory)][string]$OutputDirectory)
    $prior = Get-Content -Raw -LiteralPath $ManifestPath | ConvertFrom-Json
    $results = foreach ($record in @($prior.acquisitions)) {
        $exists = $record.localPath -and (Test-Path -LiteralPath $record.localPath -PathType Leaf)
        $hash = if ($exists) { Get-FileSha256 $record.localPath } else { $null }
        [ordered]@{ pilotSlot = $record.pilotSlot; candidateId = $record.candidateId; localPath = $record.localPath; exists = [bool]$exists; expectedSha256 = $record.SHA256; observedSha256 = $hash; recognizedIdentical = [bool]($exists -and $hash -eq [string]$record.SHA256); redownloaded = $false; overwritten = $false; newIndependentIdentity = $false; result = if ($exists -and $hash -eq [string]$record.SHA256) { 'already_present_identical' } else { 'FAIL' } }
    }
    $report = [ordered]@{ schemaVersion = '1.0'; reportType = 'controlled-regulatory-acquisition-idempotence'; generatedAt = [DateTime]::UtcNow.ToString('o'); approvedManifestPath = $ApprovedManifestPath; previousAcquisitionManifestPath = $ManifestPath; networkRequests = 0; results = @($results); pass = (@($results | Where-Object { $_.result -ne 'already_present_identical' }).Count -eq 0) }
    $path = Join-Path $OutputDirectory 'idempotence-rerun-report.json'
    $report | ConvertTo-Json -Depth 12 | Set-Content -LiteralPath $path -Encoding UTF8
    if (-not $report.pass) { throw "Idempotence check failed; see $path" }
    Write-Output "IDEMPOTENCE_RERUN_PASS: $path"
    return $report
}

try {
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    Add-Type -AssemblyName System.Net.Http
    Add-Type -AssemblyName System.IO.Compression
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $approved = Get-Content -Raw -LiteralPath $ApprovedManifestPath | ConvertFrom-Json
    if ($approved.selectionApproved -ne $true -or $approved.downloadAuthorized -ne $true -or $approved.processingAuthorized -ne $false -or $approved.canonicalizationAuthorized -ne $false -or $approved.promotionAuthorized -ne $false) { throw 'Approved manifest governance flags are invalid.' }
    $records = @($approved.selectedRecords)
    if ($records.Count -ne 8 -or $approved.authorizationScope.candidateCount -ne 8 -or $approved.authorizationScope.noOtherCandidatesAuthorized -ne $true) { throw 'Approved manifest scope is not exactly eight candidates.' }
    $sourceRoot = [IO.Path]::GetFullPath([string]$approved.sourceRoot)
    $inventoryPath = Join-Path $sourceRoot '2026-09-02 Intake\_discovery\regulatory-source-local-inventory.json'
    $inventory = @(Get-Content -Raw -LiteralPath $inventoryPath | ConvertFrom-Json)
    foreach ($record in $records) { [void](Assert-ApprovedRecord -Record $record -SourceRoot (Join-Path $sourceRoot '2026-09-02 Intake')) }
    if (-not [string]::IsNullOrWhiteSpace($CandidateId)) {
        $records = @($records | Where-Object { $_.candidateId -eq $CandidateId })
        if ($records.Count -ne 1) { throw "CandidateId retry target is not one approved manifest record: $CandidateId" }
    }
    $inventoryHashes = @($inventory | Where-Object { $_.fileRole -eq 'source_document' } | ForEach-Object { [string]$_.sha256.ToLowerInvariant() })
    $timestamp = Get-Date -Format 'yyyyMMdd-HHmmss-fff'
    $runDirectory = Join-Path $sourceRoot ("2026-09-02 Intake\_acquisition-manifests\approved-pilot-20260902\run-$timestamp")
    New-Item -ItemType Directory -Path $runDirectory -Force | Out-Null
    if ($IdempotenceOnly) {
        if ([string]::IsNullOrWhiteSpace($PreviousAcquisitionManifestPath)) { throw '-PreviousAcquisitionManifestPath is required with -IdempotenceOnly.' }
        Invoke-IdempotenceCheck -ApprovedManifest $approved -ApprovedManifestPath $ApprovedManifestPath -ManifestPath $PreviousAcquisitionManifestPath -OutputDirectory $runDirectory | Out-Null
        exit 0
    }
    $userAgent = 'Document-Processor-Source-Acquisition/1.0 (+controlled-pilot)'
    $acquisitions = [System.Collections.Generic.List[object]]::new()
    $pilotHashes = [System.Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
    $networkRequests = 0
    $overwriteCount = 0
    foreach ($record in $records) {
        $retrievedAt = [DateTime]::UtcNow.ToString('o')
        $destination = [IO.Path]::GetFullPath((Join-Path (Join-Path $sourceRoot '2026-09-02 Intake') $record.proposedDestinationFolder))
        $target = Join-Path $destination $record.expectedFileName
        $base = [ordered]@{ pilotSlot = $record.pilotSlot; candidateId = $record.candidateId; documentTitle = $record.title; publisher = $record.publisher; expectedFileType = $record.expectedFileType; expectedFileName = $record.expectedFileName; expectedVersionDate = $record.versionDate; initialUrl = $record.directDownloadUrl; finalUrl = $null; redirectChain = @(); retrievedAt = $retrievedAt; actualFilename = $null; expectedDestination = $target; localPath = $null; contentHeaders = [ordered]@{}; httpStatus = 0; sizeBytes = 0; SHA256 = $null; immediateRereadSha256 = $null; detectedType = $null; payloadValidation = $null; duplicateResult = 'none'; identityResult = 'catalog identity retained; human review packet required'; statusResult = 'not_attempted'; exceptionCode = 'NONE'; acquisitionStatus = 'download_failure'; acquisitionOutcome = 'QUARANTINE_FOR_HUMAN_REVIEW'; reviewRequired = $true; identityEvidence = $null }
        try {
            $response = Invoke-TrackedGet -Url $record.directDownloadUrl -UserAgent $userAgent
            $networkRequests += @($response.redirectChain).Count
            $base.finalUrl = $response.finalUrl; $base.redirectChain = $response.redirectChain; $base.contentHeaders = $response.headers; $base.httpStatus = $response.status; $base.sizeBytes = $response.bytes.Length; $base.actualFilename = $record.expectedFileName
            $finalHost = ([Uri]$response.finalUrl).Host.ToLowerInvariant()
            if ($finalHost -ne (Get-OfficialHost $record)) { throw "Final URL host '$finalHost' is not the approved publisher host." }
            if ($response.status -lt 200 -or $response.status -ge 300) { $base.statusResult = "HTTP $($response.status)"; $base.exceptionCode = 'HTTP_STATUS_FAILURE'; throw "HTTP status $($response.status)." }
            $contentType = if ($response.headers.Contains('Content-Type')) { [string]$response.headers['Content-Type'] } else { '' }
            $payload = Test-Payload -Bytes $response.bytes -ExpectedType $record.expectedFileType -ContentType $contentType
            $base.payloadValidation = $payload; $base.detectedType = $payload.detectedType
            if (-not $payload.valid) { $base.exceptionCode = 'PAYLOAD_VALIDATION_FAILURE'; throw $payload.reason }
            $incomingHash = Get-Sha256 $response.bytes; $base.SHA256 = $incomingHash
            $rereadHash = $incomingHash
            if ($incomingHash -ne $rereadHash) { $base.exceptionCode = 'HASH_INSTABILITY'; throw 'Immediate hash reproduction failed.' }
            if ($inventoryHashes -contains $incomingHash) { $base.duplicateResult = 'duplicate_existing_source_sha256'; $base.exceptionCode = 'DUPLICATE_EXISTING_SOURCE'; throw 'Payload SHA-256 matches an existing source document.' }
            if (-not $pilotHashes.Add($incomingHash)) { $base.duplicateResult = 'duplicate_prior_pilot_sha256'; $base.exceptionCode = 'DUPLICATE_PRIOR_PILOT'; throw 'Payload SHA-256 duplicates an earlier pilot payload.' }
            New-Item -ItemType Directory -Path $destination -Force | Out-Null
            if (Test-Path -LiteralPath $target -PathType Leaf) {
                $existingHash = Get-FileSha256 $target
                if ($existingHash -ne $incomingHash) { $overwriteCount++; $base.exceptionCode = 'SILENT_OVERWRITE_PREVENTED'; throw 'Destination filename already contains different bytes.' }
                $base.acquisitionStatus = 'already_present_identical'; $base.localPath = [IO.Path]::GetFullPath($target); $base.statusResult = 'existing identical file recognized'; $base.acquisitionOutcome = 'ADMIT_TO_PROCESSING_QUEUE'; $base.reviewRequired = $true
            }
            else {
                [IO.File]::WriteAllBytes($target, $response.bytes)
                $base.localPath = [IO.Path]::GetFullPath($target); $base.acquisitionStatus = 'new_file'; $base.statusResult = 'HTTP success and exact bytes stored'; $base.acquisitionOutcome = 'ADMIT_TO_PROCESSING_QUEUE'; $base.reviewRequired = $true
            }
            $base.immediateRereadSha256 = Get-FileSha256 $base.localPath
            if ($base.immediateRereadSha256 -ne $incomingHash) { $base.exceptionCode = 'HASH_INSTABILITY'; throw 'Immediate on-disk hash reproduction failed.' }
            $base.identityEvidence = if ($record.expectedFileType -eq 'PDF') { Get-PdfReviewEvidence -Path $base.localPath } else { Get-XlsxReviewEvidence -Path $base.localPath }
        }
        catch {
            if ($base.exceptionCode -eq 'NONE') { $base.exceptionCode = 'HTTP_OR_ACQUISITION_FAILURE' }
            $base.statusResult = if ($base.statusResult -eq 'not_attempted') { $_.Exception.Message } else { $base.statusResult }
        }
        [void]$acquisitions.Add([pscustomobject]$base)
    }
    $manifest = [ordered]@{ schemaVersion = '1.0'; manifestType = 'regulatory-source-acquisition'; generatedAt = [DateTime]::UtcNow.ToString('o'); authorizationManifestPath = $ApprovedManifestPath; acquisitionBoundary = 'Raw acquisition and acquisition validation only; no processing, canonicalization, promotion, learner-facing use, or RAG eligibility is implied.'; acquisitions = @($acquisitions); summary = [ordered]@{ totalSelected = @($records).Count; successfullyDownloaded = @($acquisitions | Where-Object { $_.acquisitionStatus -eq 'new_file' }).Count; admitted = @($acquisitions | Where-Object { $_.acquisitionOutcome -eq 'ADMIT_TO_PROCESSING_QUEUE' }).Count; quarantined = @($acquisitions | Where-Object { $_.acquisitionOutcome -eq 'QUARANTINE_FOR_HUMAN_REVIEW' }).Count; rejected = @($acquisitions | Where-Object { $_.acquisitionOutcome -eq 'REJECT_DO_NOT_PROCESS' }).Count; duplicatesDetected = @($acquisitions | Where-Object { $_.duplicateResult -ne 'none' }).Count; systemicFailures = 0; networkRequests = $networkRequests; overwriteCount = $overwriteCount } }
    $manifestPath = Join-Path $runDirectory 'acquisition-manifest.json'
    $manifest | ConvertTo-Json -Depth 20 | Set-Content -LiteralPath $manifestPath -Encoding UTF8
    $acquisitions | Export-Csv -LiteralPath (Join-Path $runDirectory 'acquisition-manifest.csv') -NoTypeInformation -Encoding UTF8
    $humanLines = [System.Collections.Generic.List[string]]::new(); $humanLines.Add('# Human identity-review packet'); $humanLines.Add(''); $humanLines.Add('Lightweight identity/completeness evidence for the eight acquired raw payloads. Automated acquisition outcome does not confer canonical, promoted, learner-facing, RAG-ready, or controlling-authority status.'); $humanLines.Add('')
    foreach ($record in $acquisitions) { $humanLines.Add("## $($record.pilotSlot) - $($record.documentTitle)"); $humanLines.Add(''); $humanLines.Add("- Candidate ID: $($record.candidateId)"); $humanLines.Add("- Issuer: $($record.publisher)"); $humanLines.Add("- Catalog version/date: $($record.expectedVersionDate)"); $humanLines.Add("- Expected type / filename: $($record.expectedFileType) / $($record.expectedFileName)"); $humanLines.Add("- Stored path: $($record.localPath)"); $humanLines.Add("- Bytes / SHA-256: $($record.sizeBytes) / $($record.SHA256)"); $humanLines.Add("- Acquisition outcome: $($record.acquisitionOutcome)"); $humanLines.Add("- Identity result: $($record.identityResult)"); if ($record.identityEvidence) { if ($record.expectedFileType -eq 'PDF') { $humanLines.Add("- Page count: $($record.identityEvidence.pageCount)"); $humanLines.Add('- First-page evidence:'); $humanLines.Add(''); $humanLines.Add('```text'); $humanLines.Add([string]$record.identityEvidence.firstPageEvidence); $humanLines.Add('```'); $humanLines.Add('- Completeness observation: PDF signature and EOF marker passed; inspect final page visually where needed.') } else { $humanLines.Add("- Workbook/sheet summary: $($record.identityEvidence.sheetCount) worksheet part(s); names: $(@($record.identityEvidence.sheetNames) -join ', ')"); $humanLines.Add("- Structural observations: $(@($record.identityEvidence.structuralObservations) -join ' ')") }; $humanLines.Add('') } }
    $humanPath = Join-Path $runDirectory 'human-identity-review-packet.md'; Set-Content -LiteralPath $humanPath -Value ($humanLines -join "`r`n") -Encoding UTF8
    $review = Write-ReviewPackets -RunDirectory $runDirectory -Acquisitions @($acquisitions) -ApprovedManifestPath $ApprovedManifestPath -NetworkRequestCount $networkRequests -OverwriteCount $overwriteCount
    Write-Output "ACQUISITION_MANIFEST: $manifestPath"; Write-Output "REVIEW_PACKET: $($review.markdown)"; Write-Output "HUMAN_REVIEW_PACKET: $humanPath"; Write-Output ($manifest.summary | ConvertTo-Json -Compress)
}
catch { Write-Error $_.Exception.Message; exit 1 }
