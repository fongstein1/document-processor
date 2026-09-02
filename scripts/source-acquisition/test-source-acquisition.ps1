[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$scriptPath = Join-Path $PSScriptRoot 'acquire-web-sources.ps1'
$configPath = Join-Path $PSScriptRoot 'source-sites.json'
$modelFixture = Join-Path $PSScriptRoot 'fixtures\model-laws.html'
$sapwgFixture = Join-Path $PSScriptRoot 'fixtures\sapwg-adoptions.html'
$testRoot = Join-Path ([IO.Path]::GetTempPath()) ("document-processor-source-acquisition-" + [guid]::NewGuid().ToString('N'))

function Assert-Condition {
    param([Parameter(Mandatory)][bool]$Condition, [Parameter(Mandatory)][string]$Message)
    if (-not $Condition) { throw "FAIL: $Message" }
}

. $scriptPath -LibraryMode -ConfigPath $configPath
$configuration = Read-SourceConfiguration $configPath
Assert-Condition (@($configuration.sites).Count -eq 2) 'configuration loads both configured sites'
$modelSite = Get-SiteConfiguration $configuration 'NAIC-Model-Laws'
$sapwgSite = Get-SiteConfiguration $configuration 'NAIC-SAPWG-Adoptions'

$unknownFailed = $false
try { Get-SiteConfiguration $configuration 'missing-site' | Out-Null } catch { $unknownFailed = $_.Exception.Message -match 'Unknown site ID' }
Assert-Condition $unknownFailed 'unknown site IDs fail clearly'

$modelCandidates = @(Get-CandidatesFromHtml -Html (Get-Content $modelFixture -Raw) -SiteConfiguration $modelSite -DiscoveryUrl $modelSite.discoveryUrl -DiscoveredAt '2026-09-02T00:00:00Z')
$selectedModelIds = @($modelCandidates | Where-Object selectedForDownload | ForEach-Object referenceId)
Assert-Condition (($selectedModelIds -join ',') -eq 'MO-805,MO-808,MO-820,MO-822,MO-830') 'Model Law filtering selects exactly 805/808/820/822/830'
Assert-Condition (@($modelCandidates | Where-Object { $_.referenceId -in @('ST-805','PH-805','MO-999') -and -not $_.selectedForDownload }).Count -eq 3) 'Model Law filtering excludes ST, PH, and unrelated model candidates'

$sapwgCandidates = @(Get-CandidatesFromHtml -Html (Get-Content $sapwgFixture -Raw) -SiteConfiguration $sapwgSite -DiscoveryUrl $sapwgSite.discoveryUrl -Year 2026 -DiscoveredAt '2026-09-02T00:00:00Z')
Assert-Condition (@($sapwgCandidates).Count -eq 4) 'SAPWG parser isolates four 2026 fixture agenda rows'
Assert-Condition (@($sapwgCandidates | Where-Object { $_.discoverySection -eq '2025 ADOPTIONS' }).Count -eq 0) 'SAPWG parser does not pull the 2025 section'
$priorYearReference = @($sapwgCandidates | Where-Object referenceId -eq '2025-22')
Assert-Condition ($priorYearReference.Count -eq 1 -and $priorYearReference[0].selectedForDownload -and $priorYearReference[0].discoverySection -eq '2026 ADOPTIONS') '2025-22 is recognized as a 2026 adoption by section location'
Assert-Condition (@($sapwgCandidates | Where-Object { $_.candidateUrl -match 'ssap-61|23-14-int' }).Count -eq 0) 'SAPWG parser does not follow referenced SSAP or INT links'

$dryRunRoot = Join-Path $testRoot 'dry-run'
$dryOutput = @(& $scriptPath -Site 'NAIC-Model-Laws' -OutputRoot $dryRunRoot -DryRun -DiscoveryHtmlPath $modelFixture 2>&1 | Out-String)
Assert-Condition (@(Get-ChildItem -LiteralPath $dryRunRoot -Recurse -File -ErrorAction SilentlyContinue | Where-Object Extension -eq '.pdf').Count -eq 0) 'DryRun creates no source-file downloads'
Assert-Condition (@(Get-ChildItem -LiteralPath $dryRunRoot -Recurse -Filter 'candidate-manifest.json' -File).Count -eq 1) 'DryRun writes a JSON candidate manifest'
Assert-Condition (@(Get-ChildItem -LiteralPath $dryRunRoot -Recurse -Filter 'candidate-manifest.csv' -File).Count -eq 1) 'DryRun writes a CSV candidate manifest'

$envRoot = Join-Path $testRoot 'environment-root'
$previousSourceRoot = $env:DOCUMENT_PROCESSOR_SOURCE_ROOT
try {
    $env:DOCUMENT_PROCESSOR_SOURCE_ROOT = $envRoot
    & $scriptPath -Site 'NAIC-Model-Laws' -DryRun -DiscoveryHtmlPath $modelFixture | Out-Null
    Assert-Condition (@(Get-ChildItem -LiteralPath $envRoot -Recurse -Filter 'candidate-manifest.json' -File).Count -eq 1) 'environment-variable source root is used when -OutputRoot is omitted'
}
finally {
    if ($null -eq $previousSourceRoot) { Remove-Item Env:DOCUMENT_PROCESSOR_SOURCE_ROOT -ErrorAction SilentlyContinue } else { $env:DOCUMENT_PROCESSOR_SOURCE_ROOT = $previousSourceRoot }
}

$existingDir = Join-Path $testRoot 'duplicate'
New-Item -ItemType Directory -Path $existingDir -Force | Out-Null
$existingPath = Join-Path $existingDir 'same.pdf'
[IO.File]::WriteAllBytes($existingPath, [Text.Encoding]::ASCII.GetBytes('%PDF-same-content'))
$sameHash = Get-FileSha256 $existingPath
Assert-Condition ((Get-ExistingFileDisposition -TargetPath $existingPath -IncomingSha256 $sameHash) -eq 'already_present_identical') 'duplicate handling identifies identical existing content'
Assert-Condition ((Get-ExistingFileDisposition -TargetPath $existingPath -IncomingSha256 ('0' * 64)) -eq 'same_filename_changed_content') 'duplicate handling identifies changed same-name content'

$fakeHtml = [Text.Encoding]::UTF8.GetBytes('<html><body>access denied</body></html>')
$fakePdfCheck = Test-DownloadedPayload -Bytes $fakeHtml -ContentType 'application/pdf' -ExpectedExtension '.pdf' -MinimumBytes 10
Assert-Condition (-not $fakePdfCheck.Valid -and $fakePdfCheck.Reason -match 'PDF signature|HTML') 'invalid HTML masquerading as PDF is rejected'

$serialized = Get-Content (Get-ChildItem -LiteralPath $dryRunRoot -Recurse -Filter 'candidate-manifest.json' -File | Select-Object -First 1).FullName -Raw | ConvertFrom-Json
Assert-Condition ($serialized.manifestType -eq 'regulatory-source-candidate' -and @($serialized.candidates).Count -gt 0) 'candidate manifest serializes and reloads successfully'

Remove-Item -LiteralPath $testRoot -Recurse -Force
Write-Output 'PASS: source acquisition focused validation (config, unknown site, dry run, filtering, section isolation, prior-year reference, duplicate safety, PDF validation, manifests)'
