# Laptop Portability and Project-Context Handoff

This workspace is a dedicated, review-only document processor for the NAIC
Valuation Manual Course and related valuation-regulation source families.
Nothing in this repo is learner-facing, app-ready, RAG-ready, or promoted.

## 1. Current Repo Checkpoint

- Repo path: `C:\Users\David\OneDrive\Documents\Document Processor`
- Branch: `main`
- Latest commit: `0b7d065`
- Git status requirement: start from a clean tree before resuming a new source
  wave
- Latest completed source unit: `Practice Notes/AAA - C3 Phase 2 - Sep 2006 - life_c3.8.pdf`
- Latest completed batch range: `batch-222` through `batch-230`
- Latest review-index count: `74 review indexes`
- Latest validated batch count: `227`
- Validation runner used: persistent Node runner via `mcp__node_repl`
- Normal validation command: `npm run check`
- Shell wrapper note: the direct npm / pnpm wrappers may still hit
  `CreateProcessAsUserW failed: 5` in this environment, so the persistent
  Node runner is the approved fallback when that happens

## 2. What Is In Git

Tracked content in this repo includes:

- `README.md` and the project brief / state docs
- processor plans for VM, AG, regulatory, practice-note, and educational-note waves
- JSON schemas for inventories, extraction outputs, review packets, and source manifests
- JSON templates and review-packet templates
- config files that define batch plans and source families
- extraction and runner scripts
- validation scripts
- tracked review indexes and self-review notes
- project-state docs under `docs/project-state/`
- portable Codex skills under `docs/codex/skills/`
- the lightweight remaining-source inventory intake workflow docs
- the portability handoff docs created for cross-laptop resume support

## 3. What Is Intentionally Outside Git

These items stay out of Git on purpose:

- raw source PDFs and other raw source documents
- ignored working-batch outputs under `data/work/batches/`
- `data/manual-input/remaining-source-inventory.received.json`
- temporary package-manager artifacts such as `.pnpm-store/` and
  `pnpm-lock.yaml`
- environment-specific files and local caches
- any local-only generated inventories or scratch exports

Why they stay out:

- raw source files are external inputs, not repository artifacts
- ignored working batches are disposable review workspaces, not source truth
- the received inventory can contain local paths, file sizes, and timestamps
- temporary package-manager files are validation side effects, not project
  content

## 4. Raw Source Library

Known raw source root:

`D:\Work\AI Projects\NAIC Valuation Manual Course`

This path may differ on a new laptop. Do not guess source files if the path is
different or unavailable.

To resume safely on a new laptop, either:

- copy the raw source folder to the same path; or
- place it elsewhere and regenerate the received inventory file

## 5. Manual Inventory Workflow

Local received inventory file:

`data/manual-input/remaining-source-inventory.received.json`

Why it is ignored:

- it is a local intake artifact
- it can contain local paths, file sizes, and timestamps
- it is selection input, not source content

How to use it:

- compare the inventory against the tracked review indexes and the POC
  summary
- select exactly one next safe source unit at a time
- do not infer unlisted files
- do not start extraction until the inventory is available and the repo is
  clean
- keep the inventory local and uncommitted

Read-only PowerShell example to regenerate a source inventory:

```powershell
$root = "D:\Work\AI Projects\NAIC Valuation Manual Course"
$out = "C:\Users\David\OneDrive\Documents\Document Processor\data\manual-input\remaining-source-inventory.received.json"

$items = Get-ChildItem -Path $root -File -Recurse | ForEach-Object {
  [PSCustomObject]@{
    filename = $_.Name
    relative_path = $_.FullName.Substring($root.Length + 1)
    extension = $_.Extension
    size_bytes = $_.Length
    last_modified_time = $_.LastWriteTimeUtc.ToString("o")
    source_family = ""
    jurisdiction = ""
    page_count = $null
    status_hint = "unclear"
    already_processed_hint = $false
    notes = ""
    safe_to_process_hint = $null
    defer_reason = ""
    priority_hint = ""
  }
}

[PSCustomObject]@{
  inventory_created_at = (Get-Date).ToUniversalTime().ToString("o")
  inventory_created_by = "human"
  raw_source_root = $root
  source_items = $items
} | ConvertTo-Json -Depth 6 | Set-Content -Path $out -Encoding UTF8
```

## 6. Validation Setup On The New Laptop

Preferred validation:

- `npm run check`
- `git diff --check`

Fallback when shell wrappers fail:

- use the persistent Node runner / direct scaffold validation path that has
  already been used successfully in this project
- do not commit temporary package-manager artifacts created only for
  validation

## 7. Active Skills And Durable Codex Instructions

Tracked skill files in `docs/codex/skills/`:

- `README.md` - index of the reusable processor skills
- `SOURCE_BOUND_EXTRACTION_SKILL.md` - keep outputs traceable to source docs
  and chunk IDs
- `LEARNER_FACING_PROMOTION_GATE_SKILL.md` - keep outputs as draft candidates
  until promotion gates are cleared
- `RAG_READINESS_SKILL.md` - structure approved material so future RAG use is
  possible
- `EXCEPTION_FIRST_REVIEW_SKILL.md` - focus human review on exceptions and
  promotion candidates
- `LOW_QUALITY_PDF_TEXT_LAYER_SKILL.md` - handle noisy OCR, page-image wording
  backstops, and cautious review states
- `CROSS_DOMAIN_PORTABILITY_SKILL.md` - keep the processor reusable across
  actuarial / regulatory source families
- `PRIVACY_AND_DATA_HYGIENE_SKILL.md` - protect sensitive material and keep Git
  clean
- `APP_EXPORT_CONTRACT_SKILL.md` - keep app-ready exports contract-driven
- `SESSION_HANDOFF_SKILL.md` - preserve context across Codex sessions

Skills already cover the portability and handoff problem space, so no new skill
file is required for this checkpoint.

## 8. Resume Prompt For The New Laptop

Paste this into Codex on the new laptop:

> Inspect `git status --short --branch`, read
> `docs/project-state/LAPTOP_PORTABILITY_HANDOFF.md`,
> `docs/project-state/CURRENT_STATE.md`, and
> `docs/project-state/NEXT_ACTIONS.md`, confirm the raw source path or
> regenerate `data/manual-input/remaining-source-inventory.received.json`, run
> validation, confirm the received inventory stays ignored and uncommitted,
> and do not start extraction unless the repo is clean and the inventory is
> available. Keep everything review-only.

## 9. Next Source Caution

Next safe candidate to inspect later:

- `Practice Notes/AAA - C3 Phase 2 and AG 43 - March 2011.pdf`

It appears to be a 122-page practice note update and should be treated as a
larger wave with careful page-window boundaries. Do not start it until this
portability checkpoint is committed and the repo is clean.

## 10. Risks And Checks

- Do not commit raw source files
- Do not commit ignored batch outputs
- Do not commit the received inventory file
- Do not promote review-only material
- Confirm validation before starting a new extraction wave
- Keep page/line-locator limitations visible for noisy PDFs
- Avoid over-processing low-value companion material without coverage review
- Use human review before promotion

## Resume Rule

If the repo is not clean, or the inventory is missing, stop before starting a
new source unit.
