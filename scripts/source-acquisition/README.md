# Regulatory source acquisition utility

This self-contained PowerShell utility discovers known regulator/professional
source documents, writes a reviewable candidate manifest, and—only when
`-Download` is explicit—retrieves selected files with provenance and SHA-256
metadata.

It stops at source acquisition. It does not ingest, extract, chunk, index,
promote, or change retrieval eligibility. The classifications in the
configuration are acquisition metadata only.

## Safety boundary

- `-DryRun` is the default and never downloads source files.
- `-DryRun` and `-Download` cannot be combined.
- `-OutputRoot` may be explicit or supplied through
  `DOCUMENT_PROCESSOR_SOURCE_ROOT`; the resolved path must be absolute and
  outside this Git repository. There is no hidden storage default and no
  OneDrive fallback.
- Only links discovered on the configured page are considered. There is no
  recursive crawl.
- Downloads are restricted to the configured `allowedHosts`.
- Redirects are followed by normal HTTP handling; the final URL is retained.
- The utility does not bypass authentication, CAPTCHAs, robots controls, or
  access restrictions, and never executes downloaded files.
- Expected PDFs must have a PDF signature, an acceptable response, and at
  least the configured minimum byte count. HTML error pages masquerading as
  PDFs are rejected.
- Existing files are not silently overwritten. Identical files are reused;
  changed content is preserved under a conflict-safe filename.

## Commands

List configured sites:

```powershell
.\scripts\source-acquisition\acquire-web-sources.ps1 -ListSites
```

Model Laws dry run:

```powershell
.\scripts\source-acquisition\acquire-web-sources.ps1 `
  -Site "NAIC-Model-Laws" `
  -OutputRoot "C:\Dev\Document Processor Sources\2026-09-02 Intake" `
  -DryRun
```

The configured Model Laws set selects MO-805, MO-808, MO-820, MO-822, and
MO-830. ST-* state adoption tables, PH-* project histories, and unrelated
model laws are retained as excluded candidate rows where they are discovered.

SAPWG 2026 dry run:

```powershell
.\scripts\source-acquisition\acquire-web-sources.ps1 `
  -Site "NAIC-SAPWG-Adoptions" `
  -Year 2026 `
  -OutputRoot "C:\Dev\Document Processor Sources\2026-09-02 Intake" `
  -DryRun
```

The SAPWG parser bounds discovery from the `2026 ADOPTIONS` heading to the
`2025 ADOPTIONS` heading. It recognizes the reference text in the first cell
of each row, including a prior-year-looking reference such as `2025-22`, and
only follows that agenda-item PDF. Referenced SSAP, appendix, and INT links in
other cells are deliberately not candidates.

Explicit acquisition:

```powershell
.\scripts\source-acquisition\acquire-web-sources.ps1 `
  -Site "NAIC-SAPWG-Adoptions" `
  -Year 2026 `
  -OutputRoot "C:\Dev\Document Processor Sources\2026-09-02 Intake" `
  -Download
```

For repeated local use, set the external source root once and omit
`-OutputRoot`:

```powershell
$env:DOCUMENT_PROCESSOR_SOURCE_ROOT = "C:\Dev\Document Processor Sources"
```

The utility never falls back to the retired OneDrive locations.

Review the candidate manifest before using `-Download`. For a deterministic
offline parser check, the optional `-DiscoveryHtmlPath` reads a saved HTML
fixture while preserving the configured discovery URL in the manifest; it is
used by the focused harness and is useful when a site is unavailable.

## Outputs

Each run creates an external directory like:

```text
<OutputRoot>\_acquisition-manifests\<siteId>\<run timestamp>\
  candidate-manifest.json
  candidate-manifest.csv
  acquisition-manifest.json       # Download runs only
  acquisition-manifest.csv        # Download runs only
<OutputRoot>\01_NAIC_Current_Authority\...
  acquired source files            # Download runs only
```

Candidate manifests contain the discovery page/section, reference, title,
URL, proposed filename, selection/exclusion reason, timestamp, and selection
flag. Acquisition manifests additionally contain the direct/final URL,
publisher filename, stored filename, absolute local path, retrieval time,
content type, size, SHA-256, HTTP status, classification, and disposition.

## Configuration and adding a site

`source-sites.json` is the only site registry. Each site expresses an ID,
display name, discovery URL, publisher, source family, approved hosts,
parser/section rules, link/reference patterns, expected extensions,
destination subdirectory, authority classification, and document type. Add a
site using one of the existing parser types (`model-law-list` or
`section-table`) when its page shape fits. If a genuinely different page shape
is required, add a narrowly scoped parser function and configuration value;
do not turn this utility into an unrestricted crawler.

Future classifications may include `secondary_regulatory_guidance`,
`professional_standard`, `implementation_support`,
`proposed_noncontrolling`, and `historical_superseded`. They remain metadata
until a separate review and ingestion decision.

## Validation and troubleshooting

Run the deterministic harness from the repository root:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass `
  -File .\scripts\source-acquisition\test-source-acquisition.ps1
```

If discovery fails, first run `-ListSites`, confirm the site URL and host
allowlist, and inspect the generated candidate manifest. A page structure
change will usually cause a configured section-bound failure, which is safer
than silently collecting unrelated links. HTTP failures are retried
conservatively for transient statuses only. Access controls or a required
browser session are intentionally not bypassed.
