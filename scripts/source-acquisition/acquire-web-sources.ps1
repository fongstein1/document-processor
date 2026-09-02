[CmdletBinding()]
param(
    [string]$Site,
    [int]$Year,
    [switch]$DryRun,
    [switch]$Download,
    [switch]$ListSites,
    [string]$OutputRoot,
    [string]$ConfigPath,
    [string]$DiscoveryHtmlPath,
    [switch]$LibraryMode
)

Set-StrictMode -Version Latest

if ([string]::IsNullOrWhiteSpace($ConfigPath)) { $ConfigPath = Join-Path $PSScriptRoot 'source-sites.json' }

function Read-SourceConfiguration {
    param([Parameter(Mandatory)][string]$Path)

    if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) {
        throw "Source-site configuration was not found: $Path"
    }

    try {
        $configuration = Get-Content -LiteralPath $Path -Raw -Encoding UTF8 | ConvertFrom-Json
    }
    catch {
        throw "Source-site configuration is not valid JSON: $Path. $($_.Exception.Message)"
    }

    if (-not $configuration.sites -or @($configuration.sites).Count -eq 0) {
        throw "Source-site configuration must contain at least one site."
    }

    return $configuration
}

function Get-SiteConfiguration {
    param(
        [Parameter(Mandatory)]$Configuration,
        [Parameter(Mandatory)][string]$SiteId
    )

    $site = @($Configuration.sites) | Where-Object { $_.siteId -ieq $SiteId } | Select-Object -First 1
    if (-not $site) {
        $available = (@($Configuration.sites) | ForEach-Object { $_.siteId }) -join ', '
        throw "Unknown site ID '$SiteId'. Configured sites: $available"
    }

    return $site
}

function ConvertTo-PlainText {
    param([AllowNull()][string]$Html)

    if ($null -eq $Html) { return '' }
    $withoutComments = [regex]::Replace($Html, '(?is)<!--.*?-->', ' ')
    $withoutTags = [regex]::Replace($withoutComments, '(?is)<[^>]+>', ' ')
    $decoded = [System.Net.WebUtility]::HtmlDecode($withoutTags)
    return ([regex]::Replace($decoded, '\s+', ' ')).Trim()
}

function Get-AttributeValue {
    param(
        [Parameter(Mandatory)][string]$Attributes,
        [Parameter(Mandatory)][string]$Name
    )

    $pattern = '(?is)\b' + [regex]::Escape($Name) + '\s*=\s*([''"])(?<value>.*?)\1'
    $match = [regex]::Match($Attributes, $pattern)
    if ($match.Success) { return [System.Net.WebUtility]::HtmlDecode($match.Groups['value'].Value) }
    return $null
}

function Get-AnchorRecords {
    param([Parameter(Mandatory)][string]$Html)

    $records = [System.Collections.Generic.List[object]]::new()
    foreach ($match in [regex]::Matches($Html, '(?is)<a\b(?<attributes>[^>]*)>(?<inner>.*?)</a>')) {
        $href = Get-AttributeValue -Attributes $match.Groups['attributes'].Value -Name 'href'
        if ([string]::IsNullOrWhiteSpace($href)) { continue }
        $records.Add([pscustomobject]@{
            Start = $match.Index
            End = $match.Index + $match.Length
            Href = $href.Trim()
            Text = ConvertTo-PlainText $match.Groups['inner'].Value
            Html = $match.Value
        })
    }
    return $records
}

function Get-SectionHtml {
    param(
        [Parameter(Mandatory)][string]$Html,
        [Parameter(Mandatory)][string]$StartPattern,
        [AllowEmptyString()][string]$EndPattern
    )

    $startMatch = [regex]::Match($Html, $StartPattern, [Text.RegularExpressions.RegexOptions]::IgnoreCase -bor [Text.RegularExpressions.RegexOptions]::Singleline)
    if (-not $startMatch.Success) { throw "Configured discovery section start was not found: $StartPattern" }

    $sectionStart = $startMatch.Index + $startMatch.Length
    $tail = $Html.Substring($sectionStart)
    if ([string]::IsNullOrWhiteSpace($EndPattern)) {
        return [pscustomobject]@{ Html = $tail; StartIndex = $sectionStart; EndIndex = $Html.Length }
    }

    $endMatch = [regex]::Match($tail, $EndPattern, [Text.RegularExpressions.RegexOptions]::IgnoreCase -bor [Text.RegularExpressions.RegexOptions]::Singleline)
    if (-not $endMatch.Success) { throw "Configured discovery section end was not found: $EndPattern" }
    return [pscustomobject]@{
        Html = $tail.Substring(0, $endMatch.Index)
        StartIndex = $sectionStart
        EndIndex = $sectionStart + $endMatch.Index
    }
}

function Resolve-AbsoluteUrl {
    param(
        [Parameter(Mandatory)][string]$BaseUrl,
        [Parameter(Mandatory)][string]$Href
    )

    try {
        $base = [Uri]::new($BaseUrl)
        $resolved = [Uri]::new($base, $Href)
        if ($resolved.Scheme -notin @('http', 'https')) { return $null }
        return $resolved.AbsoluteUri
    }
    catch { return $null }
}

function Test-ApprovedHost {
    param(
        [Parameter(Mandatory)]$SiteConfiguration,
        [Parameter(Mandatory)][string]$Url
    )

    $uri = [Uri]::new($Url)
    return @($SiteConfiguration.allowedHosts) -contains $uri.Host.ToLowerInvariant()
}

function Get-FileNameFromUrl {
    param([Parameter(Mandatory)][string]$Url)
    $uri = [Uri]::new($Url)
    $pathName = [IO.Path]::GetFileName([Uri]::UnescapeDataString($uri.AbsolutePath))
    if ([string]::IsNullOrWhiteSpace($pathName)) { return 'downloaded-source' }
    return $pathName
}

function ConvertTo-SafeFileName {
    param([Parameter(Mandatory)][string]$FileName)

    $invalid = [regex]::Escape((-join [IO.Path]::GetInvalidFileNameChars()))
    $safe = [regex]::Replace($FileName, "[$invalid]", '-')
    $safe = [regex]::Replace($safe, '\s+', ' ').Trim().TrimEnd('.')
    if ([string]::IsNullOrWhiteSpace($safe) -or $safe -in @('.', '..')) { $safe = 'downloaded-source' }
    if ($safe.Length -gt 180) { $safe = $safe.Substring(0, 180).TrimEnd('.') }
    return $safe
}

function Get-ProposedFileName {
    param(
        [Parameter(Mandatory)]$SiteConfiguration,
        [Parameter(Mandatory)][string]$Url,
        [AllowEmptyString()][string]$ReferenceId
    )

    $fileName = ConvertTo-SafeFileName (Get-FileNameFromUrl $Url)
    if ($SiteConfiguration.prefixReferenceId -and -not [string]::IsNullOrWhiteSpace($ReferenceId)) {
        $base = [IO.Path]::GetFileNameWithoutExtension($fileName)
        $extension = [IO.Path]::GetExtension($fileName)
        if ($base -notmatch [regex]::Escape($ReferenceId)) {
            $fileName = ConvertTo-SafeFileName ("$ReferenceId--$base$extension")
        }
    }
    return $fileName
}

function Get-ReferenceId {
    param(
        [Parameter(Mandatory)][string]$Text,
        [Parameter(Mandatory)][string]$Href,
        [Parameter(Mandatory)]$SiteConfiguration
    )

    if ($SiteConfiguration.PSObject.Properties.Name -contains 'referenceIdPattern' -and $SiteConfiguration.referenceIdPattern) {
        $textMatch = [regex]::Match($Text, $SiteConfiguration.referenceIdPattern, [Text.RegularExpressions.RegexOptions]::IgnoreCase)
        if ($textMatch.Success) { return $textMatch.Value.ToUpperInvariant() }
    }
    $referencePatterns = if ($SiteConfiguration.PSObject.Properties.Name -contains 'referenceIdPatterns') { @($SiteConfiguration.referenceIdPatterns) } else { @() }
    foreach ($pattern in $referencePatterns) {
        $textMatch = [regex]::Match($Text, $pattern, [Text.RegularExpressions.RegexOptions]::IgnoreCase)
        if ($textMatch.Success) { return $textMatch.Value.ToUpperInvariant() }
        $urlMatch = [regex]::Match($Href, $pattern, [Text.RegularExpressions.RegexOptions]::IgnoreCase)
        if ($urlMatch.Success) { return $urlMatch.Value.ToUpperInvariant() }
    }
    return $null
}

function Test-ExpectedExtension {
    param(
        [Parameter(Mandatory)][string]$Url,
        [Parameter(Mandatory)]$SiteConfiguration
    )

    $extension = [IO.Path]::GetExtension(([Uri]::new($Url)).AbsolutePath).ToLowerInvariant()
    return @($SiteConfiguration.expectedFileExtensions | ForEach-Object { $_.ToLowerInvariant() }) -contains $extension
}

function Get-ModelLawCandidates {
    param(
        [Parameter(Mandatory)][string]$Html,
        [Parameter(Mandatory)]$SiteConfiguration,
        [Parameter(Mandatory)][string]$DiscoveryUrl,
        [Parameter(Mandatory)][string]$DiscoverySection,
        [Parameter(Mandatory)][string]$DiscoveredAt
    )

    $section = Get-SectionHtml -Html $Html -StartPattern $SiteConfiguration.sectionStartPattern -EndPattern $SiteConfiguration.sectionEndPattern
    $seen = [System.Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
    $candidates = [System.Collections.Generic.List[object]]::new()
    foreach ($anchor in Get-AnchorRecords $section.Html) {
        $url = Resolve-AbsoluteUrl -BaseUrl $DiscoveryUrl -Href $anchor.Href
        if (-not $url -or -not (Test-ExpectedExtension -Url $url -SiteConfiguration $SiteConfiguration)) { continue }
        if (-not $seen.Add($url)) { continue }

        $referenceId = Get-ReferenceId -Text $anchor.Text -Href $anchor.Href -SiteConfiguration $SiteConfiguration
        $approvedHost = Test-ApprovedHost -SiteConfiguration $SiteConfiguration -Url $url
        $beforeAnchor = $section.Html.Substring(0, $anchor.Start)
        $titleMatch = [regex]::Match($beforeAnchor, '(?is)<h[1-6]\b[^>]*>(?<title>.*?)</h[1-6]>\s*(?:<!--.*?-->\s*)*$')
        if (-not $titleMatch.Success) {
            $titleMatches = [regex]::Matches($beforeAnchor, '(?is)<h[1-6]\b[^>]*>(?<title>.*?)</h[1-6]>')
            if ($titleMatches.Count -gt 0) { $titleMatch = $titleMatches[$titleMatches.Count - 1] }
        }
        $title = if ($titleMatch.Success) { ConvertTo-PlainText $titleMatch.Groups['title'].Value } else { ConvertTo-PlainText $anchor.Text }
        $excluded = $false
        $exclusionReason = $null
        foreach ($pattern in @($SiteConfiguration.excludedDocumentPatterns)) {
            if ($url -match $pattern -or $anchor.Text -match $pattern) {
                $excluded = $true
                $exclusionReason = 'Excluded by configured state-adoption/project-history/unrelated-link rule.'
                break
            }
        }
        if (-not $approvedHost) {
            $excluded = $true
            $exclusionReason = 'Candidate URL host is not in the configured approved-host list.'
        }
        $selected = (-not $excluded) -and ($null -ne $referenceId) -and (@($SiteConfiguration.allowedReferenceIds) -contains $referenceId) -and ($url -match $SiteConfiguration.allowedDocumentPattern)
        if (-not $selected -and -not $exclusionReason) {
            $exclusionReason = if ($null -eq $referenceId) { 'No configured model-law reference identifier was recognized.' } else { 'Reference is not in the configured desired model-law set.' }
        }
        $reason = if ($selected) { 'Configured desired model-law reference and direct PDF link.' } else { $null }
        $candidates.Add([ordered]@{
            siteId = $SiteConfiguration.siteId
            publisher = $SiteConfiguration.publisher
            discoveryPage = $DiscoveryUrl
            discoverySection = $DiscoverySection
            referenceId = $referenceId
            documentTitle = $title
            candidateUrl = $url
            proposedFileName = Get-ProposedFileName -SiteConfiguration $SiteConfiguration -Url $url -ReferenceId $referenceId
            documentType = $SiteConfiguration.documentType
            authorityClassification = $SiteConfiguration.defaultAuthorityClassification
            selectionReason = $reason
            exclusionReason = $exclusionReason
            discoveredAt = $DiscoveredAt
            selectedForDownload = $selected
        })
    }
    return $candidates
}

function Get-TableCellHtml {
    param([Parameter(Mandatory)][string]$RowHtml)
    return @([regex]::Matches($RowHtml, '(?is)<td\b[^>]*>(?<cell>.*?)</td>') | ForEach-Object { $_.Groups['cell'].Value })
}

function Get-SapwgCandidates {
    param(
        [Parameter(Mandatory)][string]$Html,
        [Parameter(Mandatory)]$SiteConfiguration,
        [Parameter(Mandatory)][string]$DiscoveryUrl,
        [Parameter(Mandatory)][int]$Year,
        [Parameter(Mandatory)][string]$DiscoveredAt
    )

    $startPattern = $SiteConfiguration.sectionStartPattern.Replace('{year}', $Year.ToString())
    $endPattern = $SiteConfiguration.sectionEndPattern.Replace('{year}', $Year.ToString()).Replace('{previousYear}', ($Year - 1).ToString())
    $section = Get-SectionHtml -Html $Html -StartPattern $startPattern -EndPattern $endPattern
    $discoverySection = "$Year ADOPTIONS"
    $seen = [System.Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
    $candidates = [System.Collections.Generic.List[object]]::new()
    foreach ($rowMatch in [regex]::Matches($section.Html, '(?is)<tr\b[^>]*>(?<row>.*?)</tr>')) {
        $cells = @(Get-TableCellHtml $rowMatch.Groups['row'].Value)
        if ($cells.Count -lt 4) { continue }
        $firstCell = $cells[0]
        $agendaAnchor = $null
        foreach ($anchor in Get-AnchorRecords $firstCell) {
            $referenceId = Get-ReferenceId -Text $anchor.Text -Href $anchor.Href -SiteConfiguration $SiteConfiguration
            if ($referenceId) { $agendaAnchor = [pscustomobject]@{ Anchor = $anchor; ReferenceId = $referenceId }; break }
        }
        if (-not $agendaAnchor) { continue }
        $url = Resolve-AbsoluteUrl -BaseUrl $DiscoveryUrl -Href $agendaAnchor.Anchor.Href
        if (-not $url -or -not (Test-ExpectedExtension -Url $url -SiteConfiguration $SiteConfiguration)) { continue }
        if (-not $seen.Add($url)) { continue }

        $excluded = $false
        $exclusionReason = $null
        if (-not (Test-ApprovedHost -SiteConfiguration $SiteConfiguration -Url $url)) {
            $excluded = $true
            $exclusionReason = 'Candidate URL host is not in the configured approved-host list.'
        }
        elseif ($url -notmatch $SiteConfiguration.allowedDocumentPattern) {
            $excluded = $true
            $exclusionReason = 'Agenda-item link does not match the configured adopted-document URL rule.'
        }
        $selected = -not $excluded
        $title = ConvertTo-PlainText $cells[3]
        $candidates.Add([ordered]@{
            siteId = $SiteConfiguration.siteId
            publisher = $SiteConfiguration.publisher
            discoveryPage = $DiscoveryUrl
            discoverySection = $discoverySection
            referenceId = $agendaAnchor.ReferenceId
            documentTitle = $title
            candidateUrl = $url
            proposedFileName = Get-ProposedFileName -SiteConfiguration $SiteConfiguration -Url $url -ReferenceId $agendaAnchor.ReferenceId
            documentType = $SiteConfiguration.documentType
            authorityClassification = $SiteConfiguration.defaultAuthorityClassification
            selectionReason = if ($selected) { 'Agenda-item PDF link found in the configured year section; referenced SSAP/INT links were not followed.' } else { $null }
            exclusionReason = $exclusionReason
            discoveredAt = $DiscoveredAt
            selectedForDownload = $selected
        })
    }
    return $candidates
}

function Get-CandidatesFromHtml {
    param(
        [Parameter(Mandatory)][string]$Html,
        [Parameter(Mandatory)]$SiteConfiguration,
        [Parameter(Mandatory)][string]$DiscoveryUrl,
        [int]$Year,
        [string]$DiscoveredAt = ([DateTime]::UtcNow.ToString('o'))
    )

    switch ($SiteConfiguration.parser) {
        'model-law-list' { return Get-ModelLawCandidates -Html $Html -SiteConfiguration $SiteConfiguration -DiscoveryUrl $DiscoveryUrl -DiscoverySection $SiteConfiguration.discoverySection -DiscoveredAt $DiscoveredAt }
        'section-table' {
            if ($Year -le 0) { throw "Site '$($SiteConfiguration.siteId)' requires -Year." }
            return Get-SapwgCandidates -Html $Html -SiteConfiguration $SiteConfiguration -DiscoveryUrl $DiscoveryUrl -Year $Year -DiscoveredAt $DiscoveredAt
        }
        default { throw "Unsupported configured parser '$($SiteConfiguration.parser)' for site '$($SiteConfiguration.siteId)'." }
    }
}

function Get-FileSha256 {
    param([Parameter(Mandatory)][string]$Path)
    return (Get-FileHash -LiteralPath $Path -Algorithm SHA256).Hash.ToLowerInvariant()
}

function Get-BytesSha256 {
    param([Parameter(Mandatory)][byte[]]$Bytes)
    $sha = [Security.Cryptography.SHA256]::Create()
    try { return ([BitConverter]::ToString($sha.ComputeHash($Bytes))).Replace('-', '').ToLowerInvariant() }
    finally { $sha.Dispose() }
}

function Test-DownloadedPayload {
    param(
        [Parameter(Mandatory)][byte[]]$Bytes,
        [AllowEmptyString()][string]$ContentType,
        [Parameter(Mandatory)][string]$ExpectedExtension,
        [int]$MinimumBytes = 512
    )

    if ($Bytes.Length -lt $MinimumBytes) { return [pscustomobject]@{ Valid = $false; Reason = "Response was only $($Bytes.Length) bytes; below the $MinimumBytes-byte safety threshold." } }
    if ($ExpectedExtension.ToLowerInvariant() -eq '.pdf') {
        $prefixLength = [Math]::Min(8, $Bytes.Length)
        $prefix = [Text.Encoding]::ASCII.GetString($Bytes, 0, $prefixLength)
        if (-not $prefix.StartsWith('%PDF-', [StringComparison]::Ordinal)) { return [pscustomobject]@{ Valid = $false; Reason = 'Expected PDF did not begin with a PDF signature; likely HTML or another error response.' } }
        if ($ContentType -match '(?i)text/html|application/xhtml') { return [pscustomobject]@{ Valid = $false; Reason = "Response content type '$ContentType' is HTML for an expected PDF." } }
    }
    return [pscustomobject]@{ Valid = $true; Reason = $null }
}

function Get-ExistingFileDisposition {
    param(
        [Parameter(Mandatory)][string]$TargetPath,
        [Parameter(Mandatory)][string]$IncomingSha256,
        [object[]]$PriorRecords = @()
    )

    if (-not (Test-Path -LiteralPath $TargetPath -PathType Leaf)) { return 'new_file' }
    $existingHash = Get-FileSha256 $TargetPath
    if ($existingHash -eq $IncomingSha256.ToLowerInvariant()) { return 'already_present_identical' }
    return 'same_filename_changed_content'
}

function Invoke-SourceHttpRequest {
    param(
        [Parameter(Mandatory)][string]$Uri,
        [Parameter(Mandatory)]$Configuration,
        [switch]$AsBytes
    )

    $maxAttempts = [int]$Configuration.request.retryCount + 1
    for ($attempt = 1; $attempt -le $maxAttempts; $attempt++) {
        try {
            $response = Invoke-WebRequest -Uri $Uri -UseBasicParsing -MaximumRedirection 5 -TimeoutSec ([int]$Configuration.request.timeoutSeconds) -UserAgent ([string]$Configuration.request.userAgent)
            $stream = if ($response.PSObject.Properties.Name -contains 'RawContentStream') { $response.RawContentStream } else { $null }
            $bytes = if ($stream -and $stream -is [IO.MemoryStream]) { $stream.ToArray() } else { [Text.Encoding]::UTF8.GetBytes([string]$response.Content) }
            $finalUrl = $Uri
            if ($response.PSObject.Properties.Name -contains 'BaseResponse' -and $response.BaseResponse.ResponseUri) { $finalUrl = $response.BaseResponse.ResponseUri.AbsoluteUri }
            $status = [int]$response.StatusCode
            $result = [pscustomobject]@{ StatusCode = $status; ContentType = $response.Headers['Content-Type']; Bytes = $bytes; FinalUrl = $finalUrl; IsSuccess = ($status -ge 200 -and $status -lt 300) }
            if ($result.IsSuccess -or $attempt -eq $maxAttempts -or $status -notin @(408, 429, 500, 502, 503, 504)) { return $result }
        }
        catch {
            $status = 0
            $webResponse = $_.Exception.Response
            if ($webResponse) {
                try { $status = [int]$webResponse.StatusCode.value__ } catch { $status = 0 }
            }
            if ($attempt -eq $maxAttempts -or ($status -ne 0 -and $status -notin @(408, 429, 500, 502, 503, 504))) {
                throw "HTTP request failed after $attempt attempt(s) (status $status): $Uri. $($_.Exception.Message)"
            }
        }
        Start-Sleep -Seconds ([int]$Configuration.request.retryDelaySeconds)
    }
}

function Assert-SafeOutputRoot {
    param([Parameter(Mandatory)][string]$Path)

    if (-not [IO.Path]::IsPathRooted($Path)) { throw '-OutputRoot must be an absolute path outside the repository.' }
    $root = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..\..'))
    $fullPath = [IO.Path]::GetFullPath($Path).TrimEnd('\')
    $rootWithSlash = $root.TrimEnd('\') + '\'
    if ($fullPath -ieq $root.TrimEnd('\') -or $fullPath.StartsWith($rootWithSlash, [StringComparison]::OrdinalIgnoreCase)) {
        throw "-OutputRoot must be outside the repository so downloaded regulatory files cannot enter Git: $fullPath"
    }
    return $fullPath
}

function Assert-SafeChildPath {
    param(
        [Parameter(Mandatory)][string]$Root,
        [Parameter(Mandatory)][string]$Child
    )

    $fullRoot = [IO.Path]::GetFullPath($Root).TrimEnd('\')
    $fullChild = [IO.Path]::GetFullPath($Child).TrimEnd('\')
    if (-not ($fullChild.StartsWith($fullRoot + '\', [StringComparison]::OrdinalIgnoreCase))) { throw "Configured destination escapes -OutputRoot: $Child" }
    return $fullChild
}

function Get-PriorAcquisitionRecords {
    param([Parameter(Mandatory)][string]$OutputRoot)
    $records = [System.Collections.Generic.List[object]]::new()
    if (-not (Test-Path -LiteralPath $OutputRoot -PathType Container)) { return $records }
    foreach ($manifestPath in Get-ChildItem -LiteralPath $OutputRoot -Recurse -File -Filter 'acquisition-manifest.json' -ErrorAction SilentlyContinue) {
        try {
            $manifest = Get-Content -LiteralPath $manifestPath.FullName -Raw -Encoding UTF8 | ConvertFrom-Json
            foreach ($record in @($manifest.acquisitions)) { $records.Add($record) }
        }
        catch { Write-Warning "Ignoring unreadable prior acquisition manifest: $($manifestPath.FullName)" }
    }
    return $records
}

function Get-UniqueConflictPath {
    param(
        [Parameter(Mandatory)][string]$Directory,
        [Parameter(Mandatory)][string]$FileName,
        [Parameter(Mandatory)][string]$RunStamp
    )
    $base = [IO.Path]::GetFileNameWithoutExtension($FileName)
    $extension = [IO.Path]::GetExtension($FileName)
    $candidate = Join-Path $Directory (ConvertTo-SafeFileName ("$base--retrieved-$RunStamp$extension"))
    $counter = 2
    while (Test-Path -LiteralPath $candidate) {
        $candidate = Join-Path $Directory (ConvertTo-SafeFileName ("$base--retrieved-$RunStamp-$counter$extension"))
        $counter++
    }
    return $candidate
}

function New-DownloadFailureRecord {
    param(
        [Parameter(Mandatory)]$Candidate,
        [AllowNull()]$Response,
        [Parameter(Mandatory)][string]$Reason
    )
    return [ordered]@{
        publisher = $Candidate.publisher
        siteId = $Candidate.siteId
        discoveryPage = $Candidate.discoveryPage
        directDownloadUrl = if ($Response) { $Response.FinalUrl } else { $Candidate.candidateUrl }
        documentTitle = $Candidate.documentTitle
        referenceId = $Candidate.referenceId
        originalFilename = Get-FileNameFromUrl $Candidate.candidateUrl
        storedFilename = $null
        localPath = $null
        retrievedAt = [DateTime]::UtcNow.ToString('o')
        contentType = if ($Response) { $Response.ContentType } else { $null }
        sizeBytes = if ($Response) { $Response.Bytes.Length } else { 0 }
        SHA256 = $null
        'HTTP status' = if ($Response) { $Response.StatusCode } else { 0 }
        authorityClassification = $Candidate.authorityClassification
        acquisitionStatus = 'download_failure'
        conflictReason = $Reason
    }
}

function Write-ManifestFiles {
    param(
        [Parameter(Mandatory)][string]$ManifestDirectory,
        [Parameter(Mandatory)]$Manifest,
        [Parameter(Mandatory)][object[]]$Candidates,
        [object[]]$Acquisitions = @()
    )

    New-Item -ItemType Directory -Path $ManifestDirectory -Force | Out-Null
    $candidateManifestPath = Join-Path $ManifestDirectory 'candidate-manifest.json'
    $candidateCsvPath = Join-Path $ManifestDirectory 'candidate-manifest.csv'
    $Manifest.candidates = @($Candidates)
    $Manifest.selectionSummary = [ordered]@{
        discovered = @($Candidates).Count
        selected = @($Candidates | Where-Object selectedForDownload).Count
        excluded = @($Candidates | Where-Object { -not $_.selectedForDownload }).Count
    }
    $Manifest | ConvertTo-Json -Depth 12 | Set-Content -LiteralPath $candidateManifestPath -Encoding UTF8
    $candidateColumns = @('siteId','publisher','discoveryPage','discoverySection','referenceId','documentTitle','candidateUrl','proposedFileName','documentType','authorityClassification','selectionReason','exclusionReason','discoveredAt','selectedForDownload')
    @($Candidates | Select-Object $candidateColumns) | Export-Csv -LiteralPath $candidateCsvPath -NoTypeInformation -Encoding UTF8

    if ($Acquisitions.Count -gt 0) {
        $acquisitionManifest = [ordered]@{
            schemaVersion = '1.0'
            manifestType = 'regulatory-source-acquisition'
            generatedAt = [DateTime]::UtcNow.ToString('o')
            acquisitionBoundary = 'Acquisition metadata only; no canonical promotion, indexing, chunking, or retrieval eligibility is implied.'
            siteId = $Manifest.siteId
            publisher = $Manifest.publisher
            discoveryPage = $Manifest.discoveryPage
            discoverySection = $Manifest.discoverySection
            acquisitions = @($Acquisitions)
        }
        $acquisitionManifestPath = Join-Path $ManifestDirectory 'acquisition-manifest.json'
        $acquisitionCsvPath = Join-Path $ManifestDirectory 'acquisition-manifest.csv'
        $acquisitionManifest | ConvertTo-Json -Depth 12 | Set-Content -LiteralPath $acquisitionManifestPath -Encoding UTF8
        $acquisitionColumns = @('publisher','siteId','discoveryPage','directDownloadUrl','documentTitle','referenceId','originalFilename','storedFilename','localPath','retrievedAt','contentType','sizeBytes','SHA256','HTTP status','authorityClassification','acquisitionStatus','conflictReason')
        @($Acquisitions | Select-Object $acquisitionColumns) | Export-Csv -LiteralPath $acquisitionCsvPath -NoTypeInformation -Encoding UTF8
    }

    return [pscustomobject]@{ CandidateJson = $candidateManifestPath; CandidateCsv = $candidateCsvPath; AcquisitionJson = if ($Acquisitions.Count -gt 0) { Join-Path $ManifestDirectory 'acquisition-manifest.json' } else { $null } }
}

function Invoke-SourceAcquisition {
    param(
        [Parameter(Mandatory)]$SiteConfiguration,
        [Parameter(Mandatory)]$Configuration,
        [Parameter(Mandatory)][string]$OutputRootPath,
        [Parameter(Mandatory)][string]$Html,
        [int]$Year,
        [switch]$IsDownload,
        [string]$InputHtmlSource = 'HTTP response'
    )

    $discoveredAt = [DateTime]::UtcNow.ToString('o')
    $candidates = @(Get-CandidatesFromHtml -Html $Html -SiteConfiguration $SiteConfiguration -DiscoveryUrl $SiteConfiguration.discoveryUrl -Year $Year -DiscoveredAt $discoveredAt)
    $runStamp = Get-Date -Format 'yyyyMMdd-HHmmss-fff'
    $manifestDirectory = Join-Path $OutputRootPath (Join-Path '_acquisition-manifests' (Join-Path $SiteConfiguration.siteId $runStamp))
    $manifest = [ordered]@{
        schemaVersion = '1.0'
        manifestType = 'regulatory-source-candidate'
        generatedAt = [DateTime]::UtcNow.ToString('o')
        inputHtmlSource = $InputHtmlSource
        acquisitionBoundary = 'Discovery/acquisition only; review is required before any Document Processor ingestion or canonical promotion.'
        siteId = $SiteConfiguration.siteId
        publisher = $SiteConfiguration.publisher
        discoveryPage = $SiteConfiguration.discoveryUrl
        discoverySection = if ($SiteConfiguration.parser -eq 'section-table') { "$Year ADOPTIONS" } else { $SiteConfiguration.discoverySection }
        candidates = @()
    }
    $priorRecords = @(Get-PriorAcquisitionRecords -OutputRoot $OutputRootPath)
    $acquisitions = [System.Collections.Generic.List[object]]::new()

    if ($IsDownload) {
        $destinationSubdirectory = [string]$SiteConfiguration.destinationSubdirectory
        if ($Year -gt 0) { $destinationSubdirectory = $destinationSubdirectory.Replace('{year}', $Year.ToString()) }
        $destination = Assert-SafeChildPath -Root $OutputRootPath -Child (Join-Path $OutputRootPath $destinationSubdirectory)
        New-Item -ItemType Directory -Path $destination -Force | Out-Null
        foreach ($candidate in @($candidates | Where-Object selectedForDownload)) {
            $proposedPath = Join-Path $destination $candidate.proposedFileName
            $prior = @($priorRecords | Where-Object { $_.siteId -ieq $candidate.siteId -and (($_.directDownloadUrl -eq $candidate.candidateUrl) -or ($_.candidateUrl -eq $candidate.candidateUrl)) -and $_.localPath -and (Test-Path -LiteralPath $_.localPath -PathType Leaf) } | Select-Object -First 1)
            if ($prior) {
                $priorHash = [string]$prior.SHA256
                $localHash = Get-FileSha256 $prior.localPath
                if ($priorHash -and $priorHash.ToLowerInvariant() -eq $localHash) {
                    $acquisitions.Add([ordered]@{
                        publisher = $candidate.publisher; siteId = $candidate.siteId; discoveryPage = $candidate.discoveryPage; directDownloadUrl = $prior.directDownloadUrl
                        documentTitle = $candidate.documentTitle; referenceId = $candidate.referenceId; originalFilename = $prior.originalFilename
                        storedFilename = $prior.storedFilename; localPath = [IO.Path]::GetFullPath($prior.localPath); retrievedAt = $prior.retrievedAt
                        contentType = $prior.contentType; sizeBytes = (Get-Item -LiteralPath $prior.localPath).Length; SHA256 = $localHash; 'HTTP status' = $prior.'HTTP status'
                        authorityClassification = $candidate.authorityClassification; acquisitionStatus = 'already_present_identical'; conflictReason = $null
                    })
                    continue
                }
            }

            try { $response = Invoke-SourceHttpRequest -Uri $candidate.candidateUrl -Configuration $Configuration -AsBytes }
            catch {
                $acquisitions.Add((New-DownloadFailureRecord -Candidate $candidate -Response $null -Reason $_.Exception.Message))
                continue
            }
            if (-not (Test-ApprovedHost -SiteConfiguration $SiteConfiguration -Url $response.FinalUrl)) {
                $acquisitions.Add((New-DownloadFailureRecord -Candidate $candidate -Response $response -Reason "Redirected final URL host is not in the configured approved-host list: $($response.FinalUrl)"))
                continue
            }
            $extension = [IO.Path]::GetExtension($candidate.proposedFileName)
            $payloadCheck = Test-DownloadedPayload -Bytes $response.Bytes -ContentType $response.ContentType -ExpectedExtension $extension -MinimumBytes ([int]$Configuration.request.minimumDownloadBytes)
            if (-not $response.IsSuccess) {
                $acquisitions.Add((New-DownloadFailureRecord -Candidate $candidate -Response $response -Reason "HTTP status $($response.StatusCode)."))
                continue
            }
            if (-not $payloadCheck.Valid) {
                $acquisitions.Add((New-DownloadFailureRecord -Candidate $candidate -Response $response -Reason $payloadCheck.Reason))
                continue
            }

            $incomingHash = Get-BytesSha256 $response.Bytes
            $disposition = Get-ExistingFileDisposition -TargetPath $proposedPath -IncomingSha256 $incomingHash -PriorRecords $priorRecords
            $storedPath = $proposedPath
            if ($disposition -eq 'same_filename_changed_content') {
                $storedPath = Get-UniqueConflictPath -Directory $destination -FileName $candidate.proposedFileName -RunStamp $runStamp
            }
            else {
                $storedPath = $proposedPath
            }
            if ($disposition -ne 'already_present_identical') {
                [IO.File]::WriteAllBytes($storedPath, $response.Bytes)
            }
            $acquisitions.Add([ordered]@{ publisher = $candidate.publisher; siteId = $candidate.siteId; discoveryPage = $candidate.discoveryPage; directDownloadUrl = $response.FinalUrl; documentTitle = $candidate.documentTitle; referenceId = $candidate.referenceId; originalFilename = Get-FileNameFromUrl $candidate.candidateUrl; storedFilename = [IO.Path]::GetFileName($storedPath); localPath = [IO.Path]::GetFullPath($storedPath); retrievedAt = [DateTime]::UtcNow.ToString('o'); contentType = $response.ContentType; sizeBytes = $response.Bytes.Length; SHA256 = $incomingHash; 'HTTP status' = $response.StatusCode; authorityClassification = $candidate.authorityClassification; acquisitionStatus = if ($disposition -in @('already_present_identical', 'same_filename_changed_content')) { $disposition } else { 'new_file' }; conflictReason = if ($disposition -eq 'same_filename_changed_content') { 'Existing apparent filename was retained and new content was stored under a conflict-safe filename.' } else { $null } })
        }
    }

    $written = Write-ManifestFiles -ManifestDirectory $manifestDirectory -Manifest $manifest -Candidates $candidates -Acquisitions @($acquisitions)
    Write-Output "Site: $($SiteConfiguration.siteId)"
    Write-Output "Section: $($manifest.discoverySection)"
    Write-Output " $(@($candidates).Count) candidate document(s) discovered"
    Write-Output " $(@($candidates | Where-Object selectedForDownload).Count) selected"
    Write-Output " $(@($candidates | Where-Object { -not $_.selectedForDownload }).Count) excluded"
    Write-Output " $(if ($IsDownload) { @($acquisitions | Where-Object { $_.acquisitionStatus -eq 'new_file' }).Count } else { 0 }) downloaded ($(if ($IsDownload) { 'Download' } else { 'DryRun' }))"
    Write-Output "Candidate manifest JSON: $($written.CandidateJson)"
    Write-Output "Candidate manifest CSV: $($written.CandidateCsv)"
    if ($IsDownload) { Write-Output "Acquisition manifest JSON: $($written.AcquisitionJson)" }
    return [pscustomobject]@{ Candidates = $candidates; Acquisitions = @($acquisitions); ManifestDirectory = $manifestDirectory }
}

function Invoke-Main {
    if ($ListSites) {
        $configuration = Read-SourceConfiguration $ConfigPath
        @($configuration.sites) | Select-Object siteId, displayName, discoveryUrl, publisher, sourceFamily, defaultAuthorityClassification, destinationSubdirectory | Format-Table -AutoSize
        return
    }
    if ([string]::IsNullOrWhiteSpace($Site)) { throw 'Specify -Site or use -ListSites.' }
    if ($DryRun -and $Download) { throw '-DryRun and -Download are mutually exclusive.' }
    if (-not $DryRun -and -not $Download) { $DryRun = $true }
    if ([string]::IsNullOrWhiteSpace($OutputRoot)) {
        $OutputRoot = [Environment]::GetEnvironmentVariable('DOCUMENT_PROCESSOR_SOURCE_ROOT')
    }
    if ([string]::IsNullOrWhiteSpace($OutputRoot)) { throw 'No safe output root was provided. Specify -OutputRoot or set DOCUMENT_PROCESSOR_SOURCE_ROOT to an external source root outside the repository.' }
    $safeRoot = Assert-SafeOutputRoot $OutputRoot
    $configuration = Read-SourceConfiguration $ConfigPath
    $siteConfiguration = Get-SiteConfiguration -Configuration $configuration -SiteId $Site
    if ($siteConfiguration.parser -eq 'section-table' -and $Year -le 0) { throw "Site '$Site' requires -Year (for example, -Year 2026)." }
    if ($DiscoveryHtmlPath) {
        if (-not (Test-Path -LiteralPath $DiscoveryHtmlPath -PathType Leaf)) { throw "Discovery HTML fixture was not found: $DiscoveryHtmlPath" }
        $html = Get-Content -LiteralPath $DiscoveryHtmlPath -Raw -Encoding UTF8
        $source = "fixture: $DiscoveryHtmlPath"
    }
    else {
        $pageResponse = Invoke-SourceHttpRequest -Uri $siteConfiguration.discoveryUrl -Configuration $configuration
        if (-not $pageResponse.IsSuccess) { throw "Discovery page returned HTTP status $($pageResponse.StatusCode): $($siteConfiguration.discoveryUrl)" }
        if (-not (Test-ApprovedHost -SiteConfiguration $siteConfiguration -Url $pageResponse.FinalUrl)) { throw "Discovery page redirected to an unapproved host: $($pageResponse.FinalUrl)" }
        if ($pageResponse.ContentType -and $pageResponse.ContentType -notmatch '(?i)text/html|application/xhtml') { throw "Discovery page returned unexpected content type '$($pageResponse.ContentType)'." }
        $html = [Text.Encoding]::UTF8.GetString($pageResponse.Bytes)
        $source = "HTTP $($pageResponse.StatusCode): $($pageResponse.FinalUrl)"
    }
    $runOutput = @(Invoke-SourceAcquisition -SiteConfiguration $siteConfiguration -Configuration $configuration -OutputRootPath $safeRoot -Html $html -Year $Year -IsDownload:$Download -InputHtmlSource $source)
    $runOutput | Where-Object { $_ -is [string] } | Write-Output
}

if (-not $LibraryMode) {
    try { Invoke-Main } catch { Write-Error $_.Exception.Message; exit 1 }
}
