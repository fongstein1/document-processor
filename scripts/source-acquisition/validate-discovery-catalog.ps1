[CmdletBinding()]
param(
    [string]$CatalogPath = 'C:\Dev\Document Processor Sources\2026-09-02 Intake\_discovery\regulatory-source-discovery-candidates.json'
)

$ErrorActionPreference = 'Stop'
$emDash = [char]0x2014
$eligibleDispositions = @(
    'CURRENT AUTHORITY ' + $emDash + ' DOWNLOAD'
    'CURRENT SUPPORT ' + $emDash + ' DOWNLOAD'
)
$parsedCatalog = Get-Content -Raw -LiteralPath $CatalogPath | ConvertFrom-Json
$catalog = @($parsedCatalog | ForEach-Object { $_ })

function Get-UrlFileName([string]$Url) {
    if ([string]::IsNullOrWhiteSpace($Url)) { return '' }
    try { return [Uri]::UnescapeDataString(((($Url -split '\?')[0]) -split '/')[-1]) } catch { return '' }
}

if ($catalog.Count -eq 0) { throw 'Discovery catalog is empty.' }
$ids = @($catalog | ForEach-Object { $_.candidateId })
if ($ids | Where-Object { [string]::IsNullOrWhiteSpace($_) }) { throw 'Discovery catalog contains an empty candidate ID.' }
if ((@($ids | Select-Object -Unique).Count) -ne $ids.Count) { throw 'Discovery catalog contains duplicate candidate IDs.' }

$eligible = [System.Collections.Generic.List[object]]::new()
foreach ($candidate in $catalog) {
    if ($eligibleDispositions -contains [string]$candidate.disposition) { [void]$eligible.Add($candidate) }
}
$compound = [System.Collections.Generic.List[object]]::new()
foreach ($candidate in $catalog) {
    $payloadCount = [int]$candidate.payloadCount
    $fileType = [string]$candidate.expectedFileType
    if (($payloadCount -gt 1) -or ($fileType -match '/')) { [void]$compound.Add($candidate) }
}
$eligibleNonDeterministic = [System.Collections.Generic.List[object]]::new()
foreach ($candidate in $eligible) {
    $payloadCount = [int]$candidate.payloadCount
    $fileType = [string]$candidate.expectedFileType
    if (($payloadCount -ne 1) -or
        [string]::IsNullOrWhiteSpace([string]$candidate.directDownloadUrl) -or
        [string]::IsNullOrWhiteSpace([string]$candidate.expectedFileName) -or
        ($fileType -match '/')) {
        [void]$eligibleNonDeterministic.Add($candidate)
    }
}
if ($eligibleNonDeterministic.Count -gt 0) {
    $eligibleNonDeterministic | Select-Object candidateId, disposition, payloadCount, expectedFileType, expectedFileName, directDownloadUrl | Format-List
    throw 'Acquisition-eligible candidate does not represent one deterministic physical payload.'
}

$urls = @($eligible | ForEach-Object { $_.directDownloadUrl.ToLowerInvariant() })
if ((@($urls | Select-Object -Unique).Count) -ne $urls.Count) { throw 'Acquisition-eligible candidates contain duplicate direct URLs.' }

$byId = @{}
foreach ($candidate in $catalog) {
    $byId[$candidate.candidateId] = $candidate
    if ($null -eq $candidate.payloadCount -or $null -eq $candidate.isAcquisitionEligible -or $null -eq $candidate.expectedFileName) { throw "Candidate lacks payload metadata: $($candidate.candidateId)" }
}
foreach ($candidate in $catalog) {
    if ($candidate.parentCandidateId) {
        if (-not $byId.ContainsKey($candidate.parentCandidateId)) { throw "Candidate parent is missing: $($candidate.candidateId)" }
    }
}
foreach ($candidate in $eligible) {
    if ($candidate.isAcquisitionEligible -ne $true) { throw "Eligible disposition has false eligibility flag: $($candidate.candidateId)" }
    $payloadCount = [int]$candidate.payloadCount
    if ($payloadCount -ne 1) { throw "Eligible candidate payload count is not 1: $($candidate.candidateId)" }
    if ([string]::IsNullOrWhiteSpace([string]$candidate.expectedFileType) -or ([string]$candidate.expectedFileType -match '/')) { throw "Eligible candidate file type is not singular: $($candidate.candidateId)" }
    if ([string]$candidate.expectedFileName -ne (Get-UrlFileName $candidate.directDownloadUrl)) { throw "Expected filename does not deterministically derive from URL: $($candidate.candidateId)" }
    if ($candidate.parentCandidateId -and $byId[$candidate.parentCandidateId].isAcquisitionEligible) { throw "Payload child has an acquisition-eligible parent grouping record: $($candidate.candidateId)" }
}

$deterministic = [System.Collections.Generic.List[object]]::new()
foreach ($candidate in $eligible) {
    if (([int]$candidate.payloadCount) -eq 1) { [void]$deterministic.Add($candidate) }
}
Write-Output ('Validated discovery catalog: {0} total records, {1} acquisition-eligible deterministic payload candidates, {2} grouping/compound records, {3} acquisition-eligible non-deterministic records.' -f $catalog.Count, $deterministic.Count, $compound.Count, $eligibleNonDeterministic.Count)
