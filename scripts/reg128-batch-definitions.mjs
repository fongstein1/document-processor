const sourceReference = 'New York Regulation 128 / 11 CRR-NY Part 97'
const reviewOnlyNote =
  'Regulation 128 stays review-only. Keep page locators primary, preserve the page-image wording backstop, and do not promote any item.'

const makeReg128Batch = (spec) => ({
  batchId: spec.plannedBatchId,
  batchName: `Regulation 128 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
  sourceFamily: 'ny_regulations',
  sourceReference,
  reviewMode: 'exception_first',
  processingIntent:
    'Capture the full 19-page Regulation 128 slice while keeping the noisy OCR-like text layer caveat visible.',
  prompt:
    'Small NY Regulation 128 review-only batch: capture the purpose, plan of operations, asset maintenance requirements, reserve valuation, and severability while keeping the page-image wording backstop visible.',
  batchNotes: [
    'Batch remains review-only. Regulation 128 is retained as active NY regulation text and is not approved for promotion.',
    'The 19-page slice is intentionally limited to the complete regulation so later cleanup stays outside the batch.',
    'Keep the page-image backstop visible because the text layer is noisy / OCR-like.',
  ],
  reviewPacketReason: `This Regulation 128 slice is intentionally limited to ${spec.batchTitle} and keeps the later sections outside the batch.`,
  chunkDefinitions: [
    {
      stableId: `chunk-${spec.sourceId}-${spec.plannedBatchId}-${spec.batchSlug}`,
      sourceId: spec.sourceId,
      sourceFile: spec.sourceFile,
      sourceReference,
      pageRange: spec.pageRange,
      title: spec.chunkTitle,
      summary: spec.chunkSummary,
      reviewFlags: spec.reviewFlags,
      confidence: 'high',
      learnerFacing: false,
      appReady: false,
    },
  ],
  extractionOutput: [
    {
      itemId: `item-${spec.sourceId}-${spec.plannedBatchId}-${spec.batchSlug}`,
      sourceId: spec.sourceId,
      sourceFile: spec.sourceFile,
      sourceReference,
      pageRange: spec.pageRange,
      category: 'state_regulation',
      summary: spec.extractionSummary,
      details: spec.extractionDetails,
      confidence: 'high',
      learnerFacing: false,
      appReady: false,
    },
  ],
  reviewPacket: {
    summary: spec.reviewSummary,
    unresolvedIssues: [
      {
        issueId: `issue-${spec.sourceId}`,
        severity: 'medium',
        summary: 'The opening and closing pages need page-image confirmation because the text layer is noisy / OCR-like.',
        category: 'requires_human_interpretation',
      },
    ],
    promotionRecommendation: 'not_recommended',
    reviewerNotes: reviewOnlyNote,
  },
  validationChecks: [
    {
      checkId: 'reg128-nineteen-page-coverage',
      details: 'The selected page window captures the full 19-page Regulation 128 slice.',
    },
    {
      checkId: 'reg128-source-reference',
      details: 'The source reference and page locator remain visible in the batch outputs.',
    },
  ],
  note: spec.note,
})

const reg128BatchSpecs = [
  {
    plannedBatchId: 'batch-268',
    batchSlug: 'reg128-268-purpose-plan-operations-asset-maintenance',
    sourceId: 'reg128-purpose-plan-operations-asset-maintenance',
    sourceFile:
      '2021 VLM Report_DRAFT-(1-27-2020) with academy Updates V1-Reg-128-11-NYCRR-S097.pdf',
    pageRange: [1, 19],
    batchTitle:
      'Regulation 128 purpose, plan of operations, asset maintenance requirements, reserve valuation, and severability',
    chunkTitle:
      'Regulation 128 purpose, plan of operations, asset maintenance requirements, reserve valuation, and severability',
    chunkSummary:
      'Capture the full 19-page regulation as one review-only slice, including the title page, the plan-of-operations discussion, the table-based asset deductions, the reserve-valuation rules, and the severability closeout.',
    extractionSummary:
      'Regulation 128 keeps the separate-account and reserve-valuation rules together as a single review-only regulatory unit.',
    extractionDetails:
      'The title page identifies New York Regulation 128, the body moves through purpose, background, plan-of-operations, asset maintenance, reserve valuation, and severability, and the page-image wording backstop should stay visible for exact phrasing.',
    reviewSummary:
      'Regulation 128 is an active NY regulation slice with a clear 19-page boundary and a single review-only batch.',
    reviewFlags: [
      'state_regulation',
      'jurisdiction_specific_requirement',
      'regulatory_requirement',
      'reporting_requirement',
      'documentation_expectation',
      'governance_or_control_expectation',
      'asset_modeling_judgment',
      'calculation_structure',
      'cross_reference_mapping',
      'boundary_control_window',
      'requires_human_interpretation',
    ],
    note:
      'Regulation 128 is a 19-page NY regulation. Keep the opening title page, the middle asset-maintenance table, and the closing severability language in one review-only slice, and preserve the page-image backstop.',
  },
]

export const reg128BatchDefinitions = Object.fromEntries(
  reg128BatchSpecs.map((spec) => [spec.plannedBatchId, makeReg128Batch(spec)]),
)
