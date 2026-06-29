# Remaining Source Inventory Intake Workflow

This workflow exists for the case where the raw source folder cannot be
accessed safely from the workspace. It gives the processor a structured way to
accept a human-supplied inventory list instead of guessing the next source from
memory or from filenames that are not visible in the current workspace.

## Why this exists

The review-only extraction pipeline must never guess a next source unit when
the raw source root cannot be inventoried directly. When raw-folder access is
blocked, the processor should stop at inventory intake and wait for a human to
provide the remaining-source list.

## Hard rule

Missing inventory means no new extraction should start.

The processor must not infer unlisted files, must not guess the next source
unit, and must not continue into extraction until a valid inventory file is
available.

## What the human provides

The human should generate a read-only file inventory outside the sandbox and
save or paste it into a tracked intake file under `data/manual-input/`.

Recommended intake file name for a received inventory:

- `data/manual-input/remaining-source-inventory.received.json`

The tracked `data/manual-input/remaining-source-inventory.pending.json` file is
only a blank stub. It is a safe placeholder and should not contain assumed real
source filenames.

## Human inventory fields

The intake schema supports these fields:

- `inventory_created_at`
- `inventory_created_by`
- `raw_source_root`
- `source_items[]`
  - `source_id`
  - `filename`
  - `relative_path`
  - `source_family`
  - `jurisdiction`
  - `page_count`
  - `file_size_bytes`
  - `status_hint`
  - `already_processed_hint`
  - `notes`
  - `safe_to_process_hint`
  - `defer_reason`
  - `priority_hint`

Suggested status hints:

- `active`
- `historical`
- `withdrawn`
- `repealed`
- `superseded`
- `companion-only`
- `non-binding practice note`
- `regulation`
- `unclear`

## Safe inventory generation outside the sandbox

Use PowerShell only. No external dependencies are required.

CSV example:

```powershell
$root = 'D:\Work\AI Projects\NAIC Valuation Manual Course'
Get-ChildItem -Path $root -Recurse -File |
  Select-Object @{
    Name = 'filename'; Expression = { $_.Name }
  }, @{
    Name = 'relative_path'; Expression = { $_.FullName.Substring($root.Length + 1) }
  }, @{
    Name = 'extension'; Expression = { $_.Extension }
  }, @{
    Name = 'size_bytes'; Expression = { $_.Length }
  }, @{
    Name = 'last_modified_time'; Expression = { $_.LastWriteTime.ToString('o') }
  } |
  Export-Csv -Path .\remaining-source-inventory.csv -NoTypeInformation
```

JSON example:

```powershell
$root = 'D:\Work\AI Projects\NAIC Valuation Manual Course'
Get-ChildItem -Path $root -Recurse -File |
  Select-Object @{
    Name = 'filename'; Expression = { $_.Name }
  }, @{
    Name = 'relative_path'; Expression = { $_.FullName.Substring($root.Length + 1) }
  }, @{
    Name = 'extension'; Expression = { $_.Extension }
  }, @{
    Name = 'size_bytes'; Expression = { $_.Length }
  }, @{
    Name = 'last_modified_time'; Expression = { $_.LastWriteTime.ToString('o') }
  } |
  ConvertTo-Json -Depth 3 |
  Set-Content -Path .\remaining-source-inventory.json
```

These commands are read-only against the raw source root. They only enumerate
files and write the exported inventory outside the raw folder.

## How the processor should compare inventory against existing review indexes

1. Load the human inventory file and validate it against
   `data/schemas/remaining-source-inventory.schema.json`.
2. Compare each `source_items[]` entry against the tracked review indexes and
   project-state handoff notes in `docs/review/`.
3. Treat `source_id`, `filename`, `relative_path`, `source_family`, and
   `jurisdiction` as the first-pass matching keys.
4. Mark items as already processed when the inventory clearly matches an
   existing review index or batch handoff.
5. Mark items as safe-to-process candidates only when they are visible in the
   inventory, not already processed, and have a clear source family and safe
   boundary.
6. Mark unclear or deferred items for human review instead of promoting them
   into extraction.

The review indexes are the processed-source ledger. They are evidence of what
has already been handled, but they do not authorize the processor to infer
unlisted files.

## How to select the next source safely

1. Start from the human inventory file, not memory.
2. Filter out any item already represented in the review indexes.
3. Sort remaining items by `priority_hint`, then by source family, then by
   boundary safety.
4. Pick exactly one next safe source unit.
5. If the inventory is incomplete, contradictory, or missing, stop and report
   the limitation.

## Review-only rule

Everything remains review-only unless and until a separate promotion decision
is made later. Inventory intake does not promote content, create learner-facing
output, or create app-ready output.

## What not to do

- Do not guess the next source unit from memory.
- Do not infer unlisted files.
- Do not start new extraction when the inventory is missing.
- Do not treat the placeholder intake file as a processed inventory.
- Do not promote anything from the intake step.
