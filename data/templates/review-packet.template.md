# Review Packet: {{packetId}}

## Batch Summary

- Batch ID: {{batchId}}
- Review mode: exception_first
- Batch name: {{batchName}}
- Source families: {{sourceFamilies}}
- Processing intent: {{processingIntent}}
- Source file count: {{sourceFileCount}}
- Extracted item count: {{extractedItemCount}}
- Exception count: {{exceptionCount}}

## Source Files Processed

{{sourceFilesTable}}

## Extracted Items

{{extractedItemsList}}

## Required Human Decisions

{{requiredHumanDecisionsList}}

## Exceptions/Flags

{{exceptionsAndFlagsList}}

## Citation/Source-Reference Issues

{{citationIssuesList}}

## Promotion Recommendation

- Status: {{promotionRecommendation.status}}
- Reason: {{promotionRecommendation.reason}}
- Recommended next step: {{promotionRecommendation.recommendedNextStep}}
- Target export: {{promotionRecommendation.targetExport}}

## RAG Readiness

- Ready: {{ragReadiness.ready}}
- Indexable item count: {{ragReadiness.indexableItemCount}}
- Notes: {{ragReadiness.notes}}

## App Export Readiness

- Ready: {{appExportReadiness.ready}}
- Notes: {{appExportReadiness.notes}}

## Not Approved / Learner-facing Status

- Learner-facing status: not approved
- Learner-facing ready: {{learnerFacingStatus.ready}}
- Reason: {{learnerFacingStatus.reason}}
- Status text: {{learnerFacingStatus.statusText}}

## Reviewer Notes

{{reviewerNotes}}
