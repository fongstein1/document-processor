[CmdletBinding()]
param(
    [string]$IntakeRoot = 'C:\Dev\Document Processor Sources\2026-09-02 Intake',
    [string]$RepositoryRoot = 'C:\Dev\Document Processor'
)

$ErrorActionPreference = 'Stop'
$discoveryRoot = Join-Path $IntakeRoot '_discovery'
$inventoryPath = Join-Path $discoveryRoot 'regulatory-source-local-inventory.json'
$inventory = @(Get-Content -Raw -LiteralPath $inventoryPath | ConvertFrom-Json)
$candidates = [System.Collections.Generic.List[object]]::new()
$currentBranch = (& git -C $RepositoryRoot branch --show-current).Trim()
$currentHead = (& git -C $RepositoryRoot rev-parse HEAD).Trim()

function New-StableCandidateId([string]$Family, [string]$ReferenceId) {
    return ('{0}-{1}' -f ($Family -replace '[^A-Za-z0-9]+', '-').Trim('-').ToLowerInvariant(), ($ReferenceId -replace '[^A-Za-z0-9]+', '-').Trim('-').ToLowerInvariant())
}

function Get-ExpectedFileName([string]$DirectDownloadUrl) {
    if ([string]::IsNullOrWhiteSpace($DirectDownloadUrl)) { return '' }
    try {
        $withoutQuery = ($DirectDownloadUrl -split '\?')[0]
        return [Uri]::UnescapeDataString(($withoutQuery -split '/')[-1])
    } catch {
        return ''
    }
}

function Add-Candidate {
    param(
        [string]$Family, [string]$Title, [string]$ReferenceId, [string]$Disposition,
        [string]$DiscoveryPage = '', [string]$DirectDownloadUrl = '',
        [string]$Publisher = '', [string]$VersionDate = '', [string]$ExpectedFileType = '',
        [string]$Destination = '', [string]$LocalMatchType = '', [string]$LocalPath = '',
        [string]$LocalSha256 = '', [string]$Reason = '', [string]$Notes = '',
        [string]$SourceOfDiscovery = 'official publisher page', [string]$ExpectedFileName = '',
        [int]$PayloadCount = 1, [string]$ParentCandidateId = ''
    )
    $id = New-StableCandidateId $Family $ReferenceId
    $resolvedFileName = if ([string]::IsNullOrWhiteSpace($ExpectedFileName)) { Get-ExpectedFileName $DirectDownloadUrl } else { $ExpectedFileName }
    [void]$candidates.Add([pscustomobject][ordered]@{
        candidateId = $id; family = $Family; title = $Title; referenceId = $ReferenceId
        disposition = $Disposition; discoveryPage = $DiscoveryPage; directDownloadUrl = $DirectDownloadUrl
        publisher = $Publisher; versionDate = $VersionDate; expectedFileType = $ExpectedFileType
        expectedFileName = $resolvedFileName; payloadCount = $PayloadCount
        parentCandidateId = $ParentCandidateId; isAcquisitionEligible = ($Disposition -in @('CURRENT AUTHORITY — DOWNLOAD', 'CURRENT SUPPORT — DOWNLOAD'))
        proposedDestinationFolder = $Destination; localMatchType = $LocalMatchType
        localPath = $LocalPath; localSha256 = $LocalSha256; reason = $Reason; notes = $Notes
        sourceOfDiscovery = $SourceOfDiscovery
    })
}

function Add-PayloadCandidates {
    param(
        [string]$Family, [string]$ParentTitle, [string]$ParentReferenceId,
        [string]$Disposition, [string]$DiscoveryPage, [string]$Publisher,
        [string]$VersionDate, [string]$Destination, [string]$Reason,
        [string]$Notes, [string]$SourceOfDiscovery, [object[]]$Payloads
    )
    $parentId = New-StableCandidateId $Family $ParentReferenceId
    if ($Payloads.Count -le 1) {
        $payload = $Payloads[0]
        Add-Candidate $Family $payload.title $ParentReferenceId $Disposition $DiscoveryPage $payload.url $Publisher $VersionDate $payload.fileType $Destination '' '' '' $Reason $Notes $SourceOfDiscovery $payload.fileName 1 ''
        return
    }
    Add-Candidate $Family $ParentTitle $ParentReferenceId 'NOT NEEDED' $DiscoveryPage '' $Publisher $VersionDate '' $Destination '' '' '' 'Grouping record only; individual payload children are acquisition candidates.' ("Compound source-family context retained. {0}" -f $Notes) $SourceOfDiscovery '' $Payloads.Count ''
    foreach ($payload in $Payloads) {
        $childReferenceId = "$ParentReferenceId-$($payload.key)"
        $childNotes = "Payload child of $parentId. Sibling payloads are not interchangeable. $Notes"
        Add-Candidate $Family $payload.title $childReferenceId $Disposition $DiscoveryPage $payload.url $Publisher $VersionDate $payload.fileType $Destination '' '' '' $Reason $childNotes $SourceOfDiscovery $payload.fileName 1 $parentId
    }
}

function Get-LocalEvidence([string]$ReferenceId, [string]$Family) {
    $record = $inventory | Where-Object { $_.fileRole -eq 'source_document' -and $_.fileName -like "$ReferenceId--*" } | Select-Object -First 1
    if (-not $record -and $Family -eq 'NAIC Model Laws') {
        $record = $inventory | Where-Object { $_.fileRole -eq 'source_document' -and $_.fileName -eq ("model-law-{0}.pdf" -f ($ReferenceId -replace '^MO-', '')) } | Select-Object -First 1
    }
    return $record
}

$modelDir = Join-Path $IntakeRoot '01_NAIC_Current_Authority\Model_Laws'
$sapDir = Join-Path $IntakeRoot '01_NAIC_Current_Authority\SAPWG_2026_Adoptions'
$modelManifest = Get-ChildItem -LiteralPath (Join-Path $IntakeRoot '_acquisition-manifests\NAIC-Model-Laws') -Directory | Sort-Object Name | Select-Object -Last 1 | ForEach-Object { Get-Content -Raw (Join-Path $_.FullName 'candidate-manifest.json') | ConvertFrom-Json }
$sapManifest = Get-ChildItem -LiteralPath (Join-Path $IntakeRoot '_acquisition-manifests\NAIC-SAPWG-Adoptions') -Directory | Sort-Object Name | Select-Object -Last 1 | ForEach-Object { Get-Content -Raw (Join-Path $_.FullName 'candidate-manifest.json') | ConvertFrom-Json }
$modelPage = 'https://content.naic.org/model-laws'
$sapPage = 'https://content.naic.org/committees/e/statutory-accounting-principles-wg/adoptions'
$naic = 'National Association of Insurance Commissioners'

foreach ($row in $modelManifest.candidates) {
    $evidence = Get-LocalEvidence $row.referenceId 'NAIC Model Laws'
    if ($row.selectedForDownload -and $evidence) {
        Add-Candidate 'NAIC Model Laws' $row.documentTitle $row.referenceId 'ALREADY HAVE' $modelPage $row.candidateUrl $naic '' 'PDF' '01_NAIC_Current_Authority\Model_Laws' 'exact reference and filename' $evidence.fullWindowsPath $evidence.sha256 'Selected by the configured dry-run and already present in the external source library.' 'No download performed.' 'configured utility dry-run'
    } else {
        Add-Candidate 'NAIC Model Laws' $row.documentTitle $row.referenceId 'NOT NEEDED' $modelPage $row.candidateUrl $naic '' 'PDF' '01_NAIC_Current_Authority\Model_Laws' 'excluded by configured section/reference scope' '' '' 'Discovered by dry-run but excluded from the requested Standard Nonforfeiture and Valuation target set.' $row.exclusionReason 'configured utility dry-run'
    }
}
foreach ($row in $sapManifest.candidates) {
    $evidence = Get-LocalEvidence $row.referenceId 'NAIC SAPWG Adoptions'
    if ($evidence) {
        Add-Candidate 'NAIC SAPWG Adoptions' $row.documentTitle $row.referenceId 'ALREADY HAVE' $sapPage $row.candidateUrl $naic '' 'PDF' '01_NAIC_Current_Authority\SAPWG_2026_Adoptions' 'exact reference prefix' $evidence.fullWindowsPath $evidence.sha256 'Found by the configured 2026 ADOPTIONS dry-run and already present in the external source library.' 'Agenda/reference numbering is retained; do not infer scope from the reference-year prefix.' 'configured utility dry-run'
    } else {
        Add-Candidate 'NAIC SAPWG Adoptions' $row.documentTitle $row.referenceId 'AMBIGUOUS — HUMAN REVIEW' $sapPage $row.candidateUrl $naic '' 'PDF' '01_NAIC_Current_Authority\SAPWG_2026_Adoptions' 'no exact local match' '' '' 'Dry-run candidate has no exact local inventory match.' 'Do not download until identity is confirmed.' 'configured utility dry-run'
    }
}

$pbrPage = 'https://content.naic.org/pbr_data.htm'
Add-Candidate 'NAIC PBR / VM-20 / VM-31 / VM-51' 'Current PBR Valuation Manual, clean edition' 'PBR-VM-CURRENT' 'NOT NEEDED' $pbrPage 'https://content.naic.org/sites/default/files/pbr_data_valuation_manual_current_edition.pdf' $naic '' 'PDF' '01_NAIC_Current_Authority\PBR' '' '' '' 'Already represented in the repository corpus; not a new acquisition requirement.' 'Current clean manual is not flagged for reacquisition.' 'official NAIC PBR Data page'
Add-Candidate 'NAIC PBR / VM-20 / VM-31 / VM-51' 'Current PBR Valuation Manual, redline edition' 'PBR-VM-CURRENT-REDLINE' 'CURRENT SUPPORT — DOWNLOAD' $pbrPage 'https://content.naic.org/sites/default/files/pbr_data_valuation_manual_current_edition_redline.pdf' $naic '' 'PDF' '02_NAIC_Current_Support\PBR' '' '' '' 'Change-review support paired with the current clean manual.' 'Keep separate from current authority.' 'official NAIC PBR Data page'
Add-Candidate 'NAIC PBR / VM-20 / VM-31 / VM-51' 'PBR plenary adopted amendments, current edition' 'PBR-PLENARY-AMENDMENTS-CURRENT' 'CURRENT AUTHORITY — DOWNLOAD' $pbrPage 'https://content.naic.org/sites/default/files/pbr_data_plenary_amendments_current_edition.pdf' $naic '' 'PDF' '01_NAIC_Current_Authority\PBR' '' '' '' 'Adopted amendment layer listed on the current NAIC PBR page.' 'Retain adoption/effective metadata.' 'official NAIC PBR Data page'
Add-Candidate 'NAIC PBR / VM-20 / VM-31 / VM-51' 'VM Maintenance Agenda, 2026-04-28' 'VM-MAINTENANCE-AGENDA-2026-04-28' 'CURRENT SUPPORT — DOWNLOAD' $pbrPage 'https://content.naic.org/sites/default/files/inline-files/VM%20Maintenance%20Agenda%20042826%20%281%29.xlsx' $naic '2026-04-28' 'XLSX' '02_NAIC_Current_Support\PBR' '' '' '' 'Operational maintenance support.' 'Preserve native XLSX.' 'official NAIC PBR Data page'
Add-PayloadCandidates 'NAIC PBR / VM-20 / VM-31 / VM-51' 'VM-20 Tables F/G, H/I, J, and K, 2026' 'VM20-TABLES-2026' 'CURRENT SUPPORT — DOWNLOAD' $pbrPage $naic '2026' '02_NAIC_Current_Support\PBR' 'Current PBR supporting tables listed on the NAIC PBR page.' 'Preserve each native workbook; sibling payloads are not interchangeable.' 'official NAIC PBR Data page' @(
    [ordered]@{ key='F-G'; title='VM-20 Table F/G current spreads, 2026'; url='https://content.naic.org/sites/default/files/pbr-2026-vm20-table-f-g-current-spreads.xlsx'; fileType='XLSX'; fileName='pbr-2026-vm20-table-f-g-current-spreads.xlsx' },
    [ordered]@{ key='H-I'; title='VM-20 Table H/I long-term spreads, 2026'; url='https://content.naic.org/sites/default/files/pbr-2026-vm20-table-h-i-long-term-spreads.xlsx'; fileType='XLSX'; fileName='pbr-2026-vm20-table-h-i-long-term-spreads.xlsx' },
    [ordered]@{ key='J'; title='VM-20 Table J swaps, 2026'; url='https://content.naic.org/sites/default/files/pbr-2026-vm20-table-j-swaps.xlsx'; fileType='XLSX'; fileName='pbr-2026-vm20-table-j-swaps.xlsx' },
    [ordered]@{ key='K'; title='VM-20 Table K conversion'; url='https://content.naic.org/sites/default/files/inline-files/pbr_data_table_k_conversion.xlsx'; fileType='XLSX'; fileName='pbr_data_table_k_conversion.xlsx' }
)
Add-Candidate 'NAIC PBR / VM-20 / VM-31 / VM-51' 'VM-V nonjumbo and jumbo valuation rates, 2026' 'VMV-RATES-2026' 'CURRENT AUTHORITY — DOWNLOAD' $pbrPage 'https://content.naic.org/sites/default/files/pbr-2026-vmv-nonjumbo-jumbo-valuation-rates.xlsx' $naic '2026' 'XLSX' '01_NAIC_Current_Authority\PBR' '' '' '' 'Current VM-V valuation-rate support published by NAIC.' 'Source-bound review only.' 'official NAIC PBR Data page'
Add-PayloadCandidates 'NAIC PBR / VM-20 / VM-31 / VM-51' 'VM-31 actuarial reports and sample templates' 'VM31-TEMPLATES' 'CURRENT SUPPORT — DOWNLOAD' $pbrPage $naic '' '02_NAIC_Current_Support\PBR' 'Current VM-31 reporting/template support.' 'The source page lists distinct report-template and assumptions workbooks; preserve native XLSX files.' 'official NAIC PBR Data page' @(
    [ordered]@{ key='REPORTS'; title='VM-31 actuarial reports templates'; url='https://content.naic.org/sites/default/files/inline-files/pbr_data_actuarial_reports_templates_0.xlsx'; fileType='XLSX'; fileName='pbr_data_actuarial_reports_templates_0.xlsx' },
    [ordered]@{ key='SAMPLE-REPORTS'; title='VM-31 sample PBR report templates'; url='https://content.naic.org/sites/default/files/inline-files/pbr_data_sample_pbr_report_templates_0.xlsx'; fileType='XLSX'; fileName='pbr_data_sample_pbr_report_templates_0.xlsx' },
    [ordered]@{ key='SAMPLE-ASSUMPTIONS'; title='PBR sample assumptions summary'; url='https://content.naic.org/sites/default/files/inline-files/pbr_data_sample_assumptions_summary_0.xlsx'; fileType='XLSX'; fileName='pbr_data_sample_assumptions_summary_0.xlsx' }
)
Add-PayloadCandidates 'NAIC PBR / VM-20 / VM-31 / VM-51' 'VM-51 kickoff, data dictionary, validations, and questionnaires' 'VM51-SUPPORT-2026' 'CURRENT SUPPORT — DOWNLOAD' $pbrPage $naic '2026' '02_NAIC_Current_Support\PBR' 'Current VM-51 implementation support.' 'Preserve each native payload; the source page lists distinct PDF, XLSX, and DOCX components.' 'official NAIC PBR Data page' @(
    [ordered]@{ key='KICKOFF'; title='VM-51 kickoff webinar, 2026'; url='https://content.naic.org/sites/default/files/pbr-kick-off-webinar-2026.pdf'; fileType='PDF'; fileName='pbr-kick-off-webinar-2026.pdf' },
    [ordered]@{ key='DATA-DICTIONARY'; title='VM-51 data dictionary, 2026'; url='https://content.naic.org/sites/default/files/pbr-vm51-data-dictionary-2026.pdf'; fileType='PDF'; fileName='pbr-vm51-data-dictionary-2026.pdf' },
    [ordered]@{ key='DATA-VALIDATIONS'; title='VM-51 data validations, 2026'; url='https://content.naic.org/sites/default/files/pbr-vm51-2026-data-validations.xlsx'; fileType='XLSX'; fileName='pbr-vm51-2026-data-validations.xlsx' },
    [ordered]@{ key='APPENDIX-1'; title='VM-51 Appendix 1 questionnaire'; url='https://content.naic.org/sites/default/files/inline-files/VM51_Appendix1_Questionnaire_0.docx'; fileType='DOCX'; fileName='VM51_Appendix1_Questionnaire_0.docx' },
    [ordered]@{ key='APPENDIX-2'; title='VM-51 Appendix 2 questionnaire'; url='https://content.naic.org/sites/default/files/inline-files/VM51_Appendix2_Questionnaire.docx'; fileType='DOCX'; fileName='VM51_Appendix2_Questionnaire.docx' },
    [ordered]@{ key='APPENDIX-3'; title='VM-51 Appendix 3 questionnaire'; url='https://content.naic.org/sites/default/files/inline-files/VM51_Appendix3_Questionnaire.docx'; fileType='DOCX'; fileName='VM51_Appendix3_Questionnaire.docx' }
)
Add-PayloadCandidates 'NAIC PBR / VM-20 / VM-31 / VM-51' 'RDC instructions, administrator guide, A/E methodology, and templates' 'RDC-PBR-OPS-SUPPORT' 'CURRENT SUPPORT — DOWNLOAD' $pbrPage $naic '' '02_NAIC_Current_Support\PBR' 'Operational PBR/RDC support identified on the NAIC PBR page.' 'Preserve each native payload; the source page lists distinct PDF, DOCX, and XLSX components.' 'official NAIC PBR Data page' @(
    [ordered]@{ key='SUBMISSION-INSTRUCTIONS'; title='RDC file submission instructions'; url='https://content.naic.org/sites/default/files/pbr_data_rdc_file_submission_0.pdf'; fileType='PDF'; fileName='pbr_data_rdc_file_submission_0.pdf' },
    [ordered]@{ key='ADMIN-GUIDE'; title='RDC Company Administrator User Guide'; url='https://content.naic.org/sites/default/files/rdc-2024-company-administrator-users-guide.pdf'; fileType='PDF'; fileName='rdc-2024-company-administrator-users-guide.pdf' },
    [ordered]@{ key='AE-METHODOLOGY'; title='A/E calculation methodology'; url='https://content.naic.org/sites/default/files/pbr-a-to-e-calculations.docx'; fileType='DOCX'; fileName='pbr-a-to-e-calculations.docx' },
    [ordered]@{ key='CONTROL-TOTALS'; title='Control Totals Template'; url='https://content.naic.org/sites/default/files/inline-files/Control%20Totals%20Template_0.xlsx'; fileType='XLSX'; fileName='Control Totals Template_0.xlsx' },
    [ordered]@{ key='RECONCILIATION'; title='Reconciliation Template'; url='https://content.naic.org/sites/default/files/inline-files/Reconciliation%20Template%202022.xlsx'; fileType='XLSX'; fileName='Reconciliation Template 2022.xlsx' }
)
Add-Candidate 'NAIC PBR / VM-20 / VM-31 / VM-51' 'Economic scenarios resource' 'PBR-ECONOMIC-SCENARIOS' 'AMBIGUOUS — HUMAN REVIEW' $pbrPage '' $naic '' 'varies' '02_NAIC_Current_Support\PBR' '' '' '' 'The NAIC page points to an external resource without a safely resolved current direct URL in this pass.' 'Do not acquire until publisher, version, and destination are confirmed.' 'official NAIC PBR Data page' '' 0

Add-Candidate 'NAIC Accounting Publications' '2026 Accounting Practices and Procedures Manual' 'APPM-2026' 'CURRENT AUTHORITY — DOWNLOAD' 'https://content.naic.org/publications?field_publication_category_target_id=All&name=accounting' 'https://content.naic.org/sites/default/files/publication-app-manual.pdf' $naic '2026' 'PDF' '01_NAIC_Current_Authority\Accounting' '' '' '' 'Current NAIC accounting manual identified on the official accounting publication listing.' 'No document download performed.'
Add-Candidate 'NAIC Accounting Publications' '2026 States Prescribed Differences' 'SPD-2026' 'CURRENT SUPPORT — DOWNLOAD' 'https://content.naic.org/publications?field_publication_category_target_id=All&name=accounting' 'https://content.naic.org/sites/default/files/spd-ops.pdf' $naic '2026' 'PDF' '02_NAIC_Current_Support\Accounting' '' '' '' 'Current accounting reference identified on the official listing.' 'Underlying state laws and regulations remain the authority.'

$lifePub = 'https://content.naic.org/publications?field_publication_category_target_id=All&name=statement+blanks'
$lifeInstr = 'https://content.naic.org/es/node/5319'
Add-Candidate 'NAIC Life / Fraternal Reporting' '2025 Annual Statement Blank, Life/Fraternal' 'ASB-LIFE-2025' 'CURRENT SUPPORT — DOWNLOAD' $lifePub 'https://content.naic.org/sites/default/files/publication-asb-life.pdf' $naic '2025' 'PDF' '02_NAIC_Current_Support\Life_Fraternal_Reporting' '' '' '' 'Latest annual Life/Fraternal blank listed; 2026 annual blank was not listed.' 'Do not infer a missing 2026 annual blank.'
Add-Candidate 'NAIC Life / Fraternal Reporting' '2026 Quarterly Statement Blank, Life/Fraternal' 'QSB-LIFE-2026' 'CURRENT SUPPORT — DOWNLOAD' $lifePub 'https://content.naic.org/sites/default/files/publication-quarterly-statement-blanks-life-frat.pdf' $naic '2026' 'PDF' '02_NAIC_Current_Support\Life_Fraternal_Reporting' '' '' '' 'Current quarterly Life/Fraternal blank listed.' ''
Add-Candidate 'NAIC Life / Fraternal Reporting' '2025 Annual Statement Instructions, Life/Fraternal' 'ASI-LIFE-2025' 'AMBIGUOUS — HUMAN REVIEW' $lifeInstr '' $naic '2025' 'PDF' '02_NAIC_Current_Support\Life_Fraternal_Reporting' '' '' '' 'Latest annual instructions listed; 2026 annual instructions were not listed, and a deterministic direct payload was not resolved in this pass.' 'Do not infer a missing 2026 annual instruction set or acquire until the exact payload is confirmed.' 'official NAIC Life / Fraternal instructions page' '' 0
Add-Candidate 'NAIC Life / Fraternal Reporting' '2026 Quarterly Statement Instructions, Life/Fraternal' 'QSI-LIFE-2026' 'CURRENT SUPPORT — DOWNLOAD' $lifeInstr 'https://content.naic.org/sites/default/files/publication-quarterly-statement-instructions-life-frat.pdf' $naic '2026' 'PDF' '02_NAIC_Current_Support\Life_Fraternal_Reporting' '' '' '' 'Current quarterly instructions listed.' ''
Add-Candidate 'NAIC Life / Fraternal Reporting' '2026-03BWG Modified Blanks' '2026-03BWG' 'CURRENT AUTHORITY — DOWNLOAD' 'https://content.naic.org/cmte_e_app_blanks_related_adopted_mods.htm' 'https://content.naic.org/sites/default/files/inline-files/2026-03BWG_Modified.pdf' $naic '2026-05-28' 'PDF' '01_NAIC_Current_Authority\Life_Fraternal_Reporting' '' '' '' 'Adopted 2026 blanks modification identified on the official adopted-modifications page.' 'Reporting authority/change layer.'

$latf = 'https://content.naic.org/committees/a/life-actuarial-tf'
foreach ($row in @(
    @('Appointed Actuary Knowledge Statement','LATF-AA-KNOWLEDGE-STATEMENT','AMBIGUOUS — HUMAN REVIEW'),
    @('FAQ on Qualifications and PBR','LATF-FAQ-QUALIFICATIONS-PBR','AMBIGUOUS — HUMAN REVIEW'),
    @('AG 53 Templates and Guidance, 2025 year-end','LATF-AG53-2025YE','AMBIGUOUS — HUMAN REVIEW'),
    @('AG 55 Templates, 2025 year-end','LATF-AG55-2025YE','AMBIGUOUS — HUMAN REVIEW'),
    @('PBR Company Pilot Project Report','LATF-PBR-PILOT-REPORT','AMBIGUOUS — HUMAN REVIEW'),
    @('GRET 2025 Factors and Life Knowledge Statements','LATF-LIFE-SUPPORT-2025','AMBIGUOUS — HUMAN REVIEW'),
    @('VM-20 HMI/FMI recommendation exposure item','LATF-VM20-HMI-FMI-RECOMMENDATION','PROPOSED / FUTURE — QUARANTINE')
)) { Add-Candidate 'NAIC LATF' $row[0] $row[1] $row[2] $latf '' $naic '' 'varies' '02_NAIC_Current_Support\LATF' '' '' '' 'Listed on the current LATF page; a safely resolved direct download URL was not established in this pass.' 'Support remains review-only; no deterministic payload candidate was emitted.' 'official NAIC LATF page' '' 0 }

$asop = 'https://actuary.org/practice-area/life/asop/'
foreach ($row in @(
    @('ASOP No. 7, Life or Health Cash Flow Analysis','ASOP-7'), @('ASOP No. 22, Asset Adequacy Analysis','ASOP-22'),
    @('ASOP No. 25, Credibility Procedures','ASOP-25'), @('ASOP No. 41, Actuarial Communications','ASOP-41'),
    @('ASOP No. 52, Principle-Based Reserves under VM-20','ASOP-52')
)) { Add-Candidate 'Actuarial Standards Board' $row[0] $row[1] 'AMBIGUOUS — HUMAN REVIEW' $asop '' 'Actuarial Standards Board' '2026' 'PDF' '03_Professional_Support\ASOPs' '' '' '' 'Current standalone file, version, and direct download URL require human confirmation.' 'No standalone ASOP source file was found in the external inventory; do not reacquire automatically.' 'official ASB life ASOP page' }

$soaVbt = 'https://www.soa.org/resources/experience-studies/2015/2015-valuation-basic-tables'
Add-PayloadCandidates 'Society of Actuaries Experience Studies' '2015 VBT report and native tables/workbooks' 'SOA-2015-VBT' 'CURRENT SUPPORT — DOWNLOAD' $soaVbt 'Society of Actuaries' '2015 / published 2018' '03_Professional_Support\SOA_Experience_Studies' 'Historical support identified on the official SOA page and absent from the current external inventory.' 'Preserve the report and each native workbook as separate payload candidates; do not infer equivalence among sibling tables.' 'official SOA experience-study page' @(
    [ordered]@{ key='REPORT'; title='2015 Valuation Basic Table Report'; url='https://www.soa.org/globalassets/assets/files/resources/experience-studies/2018/2015-vbt-report.pdf'; fileType='PDF'; fileName='2015-vbt-report.pdf' },
    [ordered]@{ key='PREFERRED-WEAROFF'; title='2015 VBT preferred wearoff factors'; url='https://www.soa.org/globalassets/assets/files/resources/experience-studies/2018/2015-vbt-preferred-wearoff-factors.xlsx'; fileType='XLSX'; fileName='2015-vbt-preferred-wearoff-factors.xlsx' },
    [ordered]@{ key='IMPROVEMENT'; title='2015 VBT mortality improvement factors'; url='https://www.soa.org/globalassets/assets/files/resources/experience-studies/2018/2015-vbt-improvement-factors.xlsx'; fileType='XLSX'; fileName='2015-vbt-improvement-factors.xlsx' },
    [ordered]@{ key='UNISMOKE'; title='2015 VBT unismoke ALB/ANB tables'; url='https://www.soa.org/globalassets/assets/files/research/exp-study/2015-vbt-unismoke-alb-anb.xlsx'; fileType='XLSX'; fileName='2015-vbt-unismoke-alb-anb.xlsx' },
    [ordered]@{ key='SMOKER-DISTINCT'; title='2015 VBT smoker-distinct ALB/ANB tables'; url='https://www.soa.org/globalassets/assets/files/research/exp-study/2015-vbt-smoker-distinct-alb-anb.xlsx'; fileType='XLSX'; fileName='2015-vbt-smoker-distinct-alb-anb.xlsx' },
    [ordered]@{ key='MALE-NON-RR-ANB'; title='2015 VBT male non-RR ANB table'; url='https://www.soa.org/globalassets/assets/files/research/exp-study/2015-vbt-male-non-rr-anb.xlsx'; fileType='XLSX'; fileName='2015-vbt-male-non-rr-anb.xlsx' },
    [ordered]@{ key='FEMALE-NON-RR-ANB'; title='2015 VBT female non-RR ANB table'; url='https://www.soa.org/globalassets/assets/files/research/exp-study/2015-vbt-female-non-rr-anb.xlsx'; fileType='XLSX'; fileName='2015-vbt-female-non-rr-anb.xlsx' },
    [ordered]@{ key='MALE-NON-RR-ALB'; title='2015 VBT male non-RR ALB table'; url='https://www.soa.org/globalassets/assets/files/research/exp-study/2015-vbt-male-non-rr-alb.xlsx'; fileType='XLSX'; fileName='2015-vbt-male-non-rr-alb.xlsx' },
    [ordered]@{ key='FEMALE-NON-RR-ALB'; title='2015 VBT female non-RR ALB table'; url='https://www.soa.org/globalassets/assets/files/research/exp-study/2015-vbt-female-non-rr-alb.xlsx'; fileType='XLSX'; fileName='2015-vbt-female-non-rr-alb.xlsx' },
    [ordered]@{ key='MALE-SMOKER-RR-ANB'; title='2015 VBT male smoker RR ANB table'; url='https://www.soa.org/globalassets/assets/files/research/exp-study/2015-vbt-male-smoker-rr-anb.xlsx'; fileType='XLSX'; fileName='2015-vbt-male-smoker-rr-anb.xlsx' },
    [ordered]@{ key='FEMALE-SMOKER-RR-ANB'; title='2015 VBT female smoker RR ANB table'; url='https://www.soa.org/globalassets/assets/files/research/exp-study/2015-vbt-female-smoker-rr-anb.xlsx'; fileType='XLSX'; fileName='2015-vbt-female-smoker-rr-anb.xlsx' },
    [ordered]@{ key='MALE-SMOKER-RR-ALB'; title='2015 VBT male smoker RR ALB table'; url='https://www.soa.org/globalassets/assets/files/research/exp-study/2015-vbt-male-smoker-rr-alb.xlsx'; fileType='XLSX'; fileName='2015-vbt-male-smoker-rr-alb.xlsx' },
    [ordered]@{ key='FEMALE-SMOKER-RR-ALB'; title='2015 VBT female smoker RR ALB table'; url='https://www.soa.org/globalassets/assets/files/research/exp-study/2015-vbt-female-smoker-rr-alb.xlsx'; fileType='XLSX'; fileName='2015-vbt-female-smoker-rr-alb.xlsx' }
)
Add-Candidate 'Society of Actuaries Experience Studies' '2017 Group Insurance Mortality Table report and supporting tables' 'SOA-2017-GI-MORTALITY' 'AMBIGUOUS — HUMAN REVIEW' 'https://www.soa.org/resources/experience-studies/2016/2017-gi-mortality-tables/' '' 'Society of Actuaries' '2017' 'PDF/XLSX' '03_Professional_Support\SOA_Experience_Studies' '' '' '' 'Historical support is identified on the official SOA page, but component direct URLs are not represented in the current builder evidence.' 'No deterministic payload candidate emitted.' 'official SOA experience-study page' '' 0
Add-Candidate 'Society of Actuaries Experience Studies' '2018 mortality improvement recommendation for AG 38 / VM-20' 'SOA-2018-MORTALITY-IMPROVEMENT' 'AMBIGUOUS — HUMAN REVIEW' 'https://www.soa.org/resources/experience-studies/2018/2018-mortality-improvement/' '' 'Society of Actuaries' '2018' 'PDF/XLSX' '03_Professional_Support\SOA_Experience_Studies' '' '' '' 'Historical recommendation/support is identified on the official SOA page, but component direct URLs are not represented in the current builder evidence.' 'Support only; not a standard or primary authority; no deterministic payload candidate emitted.' 'official SOA experience-study page' '' 0

foreach ($row in @(
    @('VM-20 practice-note repository evidence','REPO-VM20-PRACTICE-NOTE','POSSIBLE DUPLICATE — REVIEW',(Join-Path $RepositoryRoot 'docs\processor\vm20_practice_note_extraction_plan.md')),
    @('AG-38 repository evidence','REPO-AG38-SUPPORT','POSSIBLE DUPLICATE — REVIEW',(Join-Path $RepositoryRoot 'docs\processor\ag38_extraction_plan.md')),
    @('AG-53 repository evidence','REPO-AG53-SUPPORT','POSSIBLE DUPLICATE — REVIEW',(Join-Path $RepositoryRoot 'docs\processor\ag53_extraction_plan.md')),
    @('AG-55 repository evidence','REPO-AG55-SUPPORT','POSSIBLE DUPLICATE — REVIEW',(Join-Path $RepositoryRoot 'docs\processor\ag55_extraction_plan.md'))
)) { Add-Candidate 'Repository Professional Support Evidence' $row[0] $row[1] $row[2] '' '' 'Document Processor repository' '' 'repository evidence' '03_Professional_Support\Repository_Review' 'repository evidence path' $row[3] '' 'Related repository support evidence exists, but raw external source bytes are not asserted present.' 'Compare source identity and provenance before any future acquisition.' 'repository targeted file inventory' }

Add-Candidate 'NAIC Proposed / Future Materials' '2027 Valuation Manual LATF Amendments, not yet adopted' 'VM-2027-LATF-AMENDMENTS' 'PROPOSED / FUTURE — QUARANTINE' $pbrPage 'https://content.naic.org/sites/default/files/inline-files/2027%20Valuation%20Manual%20LATF%20Amendments%20Not%20Yet%20Adopted%20by%20Executive%20Committee%20and%20Plenary.pdf' $naic '2027' 'PDF' '04_Proposed_Future\Quarantine' '' '' '' 'Explicitly identified as not yet adopted on the official NAIC PBR page.' 'Do not process, canonicalize, promote, or treat as current authority.'
Add-Candidate 'NAIC Proposed / Future Materials' 'GOES governance and model-change exposure materials' 'GOES-2026-EXPOSURE' 'PROPOSED / FUTURE — QUARANTINE' 'https://content.naic.org/committees/a-e/generator-economic-scenarios-sg' '' $naic '2026' 'varies' '04_Proposed_Future\Quarantine' '' '' '' 'Current GOES page lists exposure/model-change materials.' 'Exposure/proposed materials remain outside current authority.'

# Windows PowerShell may decode a UTF-8-without-BOM script through the active
# legacy code page. Normalize the em-dash dispositions from those code-page
# mojibake sequences before writing UTF-8 discovery artifacts.
$emDash = [char]0x2014
$mojibakeDash = ([char]0x00e2) + ([char]0x20ac) + ([char]0x201d)
foreach ($candidate in $candidates) {
    if ($candidate.disposition.Contains($mojibakeDash)) {
        $candidate.disposition = $candidate.disposition.Replace($mojibakeDash, $emDash)
    }
}

$jsonPath = Join-Path $discoveryRoot 'regulatory-source-discovery-candidates.json'
$csvPath = Join-Path $discoveryRoot 'regulatory-source-discovery-candidates.csv'
$candidates.ToArray() | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $jsonPath -Encoding UTF8
$candidates.ToArray() | Export-Csv -LiteralPath $csvPath -NoTypeInformation -Encoding UTF8
$counts = $candidates.ToArray() | Group-Object disposition | Sort-Object Name
$families = $candidates.ToArray() | Group-Object family | Sort-Object Name
$countMarkdown = ($counts | ForEach-Object { '- **{0}**: {1}' -f $_.Name, $_.Count }) -join "`r`n"
$familyMarkdown = ($families | ForEach-Object { '- **{0}**: {1}' -f $_.Name, $_.Count }) -join "`r`n"
$downloadCount = @($candidates | Where-Object disposition -match 'DOWNLOAD').Count
$ambiguousCount = @($candidates | Where-Object { $_.disposition -like '*HUMAN REVIEW' }).Count
$deterministicEligibleCount = @($candidates | Where-Object { $_.isAcquisitionEligible -and $_.payloadCount -eq 1 }).Count
$compoundCount = @($candidates | Where-Object { $_.payloadCount -gt 1 -or $_.expectedFileType -match '/' }).Count
$eligibleNonDeterministicCount = @($candidates | Where-Object {
    $_.isAcquisitionEligible -and (
        $_.payloadCount -ne 1 -or
        [string]::IsNullOrWhiteSpace($_.directDownloadUrl) -or
        [string]::IsNullOrWhiteSpace($_.expectedFileName) -or
        $_.expectedFileType -match '/'
    )
}).Count
$summary = @"
# Regulatory source discovery summary — 2026-09-02

## Boundary

Discovery and inventory only. No new regulatory document was downloaded, processed, canonicalized, promoted, or added to the repository. The existing external inventory and source files under `C:\Dev\Document Processor Sources\2026-09-02 Intake` were not modified, renamed, moved, or deleted; only the generated discovery catalog artifacts were regenerated. The authoritative repository is `C:\Dev\Document Processor`; the authoritative external source root is `C:\Dev\Document Processor Sources`. Historical OneDrive paths remain historical provenance only and were not used for new work.

## Branch and baseline

- Branch: $currentBranch
- Repository SHA at generation: $currentHead
- Configured dry-run pages: [NAIC Model Laws](https://content.naic.org/model-laws) and [NAIC SAPWG adoptions](https://content.naic.org/committees/e/statutory-accounting-principles-wg/adoptions)

## Existing external inventory

- Inventory JSON: `C:\Dev\Document Processor Sources\2026-09-02 Intake\_discovery\regulatory-source-local-inventory.json`
- Inventory CSV: `C:\Dev\Document Processor Sources\2026-09-02 Intake\_discovery\regulatory-source-local-inventory.csv`
- 48 non-discovery records: 23 source PDFs and 25 acquisition metadata files.
- Duplicate source-PDF SHA-256 groups: 0; duplicate extra-file SHA-256 groups: 0.
- The inventory scan excludes `_discovery` so the report does not count itself.

## Configured dry-run results

- NAIC Model Laws — Standard Nonforfeiture and Valuation, model numbers 805–830: 37 discovered, 5 selected, 32 excluded, 0 downloaded. Existing selected files: MO-805, MO-808, MO-820, MO-822, MO-830.
- NAIC SAPWG — 2026 ADOPTIONS: 18 discovered, 18 selected, 0 downloaded. All 18 selected PDFs are already present, including `2023-14` and `2025-22` because they appear in the 2026 adoption section.

## Candidate catalog

- Candidate JSON: `C:\Dev\Document Processor Sources\2026-09-02 Intake\_discovery\regulatory-source-discovery-candidates.json`
- Candidate CSV: `C:\Dev\Document Processor Sources\2026-09-02 Intake\_discovery\regulatory-source-discovery-candidates.csv`
- Total candidates: $($candidates.Count)
- Future download dispositions: $downloadCount
- Ambiguous candidates requiring human review: $ambiguousCount
- Acquisition-eligible deterministic one-payload candidates: $deterministicEligibleCount
- Grouping/compound records retained for provenance: $compoundCount
- Acquisition-eligible non-deterministic records: $eligibleNonDeterministicCount

### Disposition counts

$countMarkdown

### Candidate counts by family

$familyMarkdown

## Requested family adjudications

- AP&P / SPD: AP&P 2026 is cataloged as current NAIC authority; SPD 2026 as current supporting reference. Neither was downloaded.
- PBR / VM-20 / VM-31 / VM-51: the clean VM is not flagged for reacquisition; redline, adopted amendments, current tables/rates, templates, and VM-51 support are cataloged. No documents were downloaded.
- Life / Fraternal reporting: official listings exposed 2025 annual and 2026 quarterly blanks/instructions, plus adopted 2026-03BWG material. 2026 annual blank/instructions were not inferred. No documents were downloaded.
- LATF: current support items are cataloged; recommendation/exposure material is quarantined. No documents were downloaded.
- ASOPs: ASOP 7, 22, 25, 41, and 52 were not found as standalone files in the external inventory. Direct current-file resolution and version confirmation remain human-review items; no automatic reacquisition occurred. The [ASB announcement for revised ASOP No. 7](https://actuary.org/asb-adopts-revisions-of-asop-nos-7-and-20/) provides the revision/effective-date context.
- SOA experience studies: 2015 VBT, 2017 GI mortality, and 2018 mortality-improvement support are cataloged with native XLSX preservation noted. No documents were downloaded. See the [SOA 2015 VBT page](https://www.soa.org/resources/experience-studies/2015/2015-valuation-basic-tables), [SOA 2017 GI page](https://www.soa.org/resources/experience-studies/2016/2017-gi-mortality-tables/), and [SOA mortality-improvement page](https://www.soa.org/resources/experience-studies/2018/2018-mortality-improvement/).
- Proposed/future materials: 2027 not-yet-adopted VM amendments and GOES exposure/model-change materials are quarantined and are not current authority.

## Repository change in this discovery pass

The catalog builder and the source-acquisition HTTP compatibility guard are tooling-only changes. No canonical regulatory content, processed artifacts, promoted packages, validators, expected hashes, or `.gitattributes` were changed.

## Validation boundary

Final validation covers PowerShell parse, focused source-acquisition tests, `npm run check`, `git diff --check`, changed-path review, and final Git status after the tooling-only commit.
"@
Set-Content -LiteralPath (Join-Path $discoveryRoot 'regulatory-source-discovery-summary.md') -Value $summary -Encoding UTF8
Write-Output ("Generated {0} candidates" -f $candidates.Count)
$counts | Select-Object Name, Count | Format-Table -AutoSize
Write-Output $jsonPath
Write-Output $csvPath
