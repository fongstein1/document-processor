const rawSourceFile = 'lhmanual26.pdf'
const sourceFamilyId = 'valuation_manual_pdfs'
const sourceTitle = 'Life & Health Valuation Law Manual'
const sourceReference =
  'American Academy of Actuaries Life & Health Valuation Law Manual, Thirty-second Edition 2026'
const defaultNonLearnerNotes =
  'The manual is a compiled reference source. Keep page locators primary, treat the opening pages as review-only, and do not promote any item.'

const makeBatch = (spec) => {
  const sourceId = spec.sourceId
  const pageStart = spec.pageWindow[0]
  const pageEnd = spec.pageWindow[1]
  const titleLower = spec.batchTitle.toLowerCase()
  const itemId = `item-${spec.sourceId}-${spec.batchSlug}`

  return {
    batchName: `Life & Health Valuation Law Manual batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'lhmanual26_opening_sections',
    processingIntentText:
      spec.processingIntentText ??
      `Capture ${spec.batchTitle} as a review-only manual slice so the opening pages stay narrow and reviewable.`,
    processingIntentNotes:
      'Reference-manual workflow proof only. This batch stays review-only, source-bound, and excluded from learner-facing or app-ready outputs.',
    batchSummaryText:
      spec.batchSummaryText ?? `Batch ${spec.plannedBatchId} remains review-only. ${spec.summaryLead} stays unpromoted.`,
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This manual slice is intentionally limited to ${spec.batchTitle} and is retained for review-only analysis.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Manual batch only. Keep the work review-first, preserve the page locator, treat the source as a reference compilation, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${spec.sourceId}`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'page_locator_primary',
        message:
          'The manual should stay page-locator anchored because the opening pages are the source of record for exact wording.',
        notes: 'Keep review-only and do not promote.',
      },
      {
        flagId: `flag-${spec.sourceId}-page-image-backstop`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'page_image_wording_backstop',
        message:
          'The wording should be confirmed against the page image before anyone treats the text as exact.',
        notes: 'Keep the page-image backstop visible as a review note.',
      },
      {
        flagId: `flag-${spec.sourceId}-topic`,
        severity: 'low',
        sourceId,
        itemId,
        flagType: spec.flagType,
        message: spec.flagMessage,
        notes: 'Keep the topic boundary explicit and review-only.',
      },
    ],
    reviewPacketCitationIssues: [
      {
        issueId: `citation-${spec.sourceId}-page-locator-primary`,
        sourceId,
        itemId,
        issueType: 'page_locator_primary',
        details:
          'Page locators should remain the primary anchor for the manual because the source is a large reference PDF.',
        recommendedAction:
          'Keep the planned page window together and preserve the locator in the review packet.',
      },
      {
        issueId: `citation-${spec.sourceId}-page-image-backstop`,
        sourceId,
        itemId,
        issueType: 'page_image_wording_backstop',
        details:
          'The wording should be confirmed against the page image before anyone treats the text as exact.',
        recommendedAction:
          'Keep the page image wording backstop visible and avoid overclaiming exact wording from the text layer.',
      },
      {
        issueId: `citation-${spec.sourceId}-topic-boundary`,
        sourceId,
        itemId,
        issueType: spec.topicIssueType,
        details: spec.topicIssueDetails,
        recommendedAction: spec.topicRecommendedAction,
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: `decision-${sourceId}-indexing-disposition`,
        decisionType: 'indexing_choice',
        question:
          'Should the opening manual sections remain indexed as a stand-alone reference-manual source, or should later cleanup group them with other valuation-law material?',
        whyItMatters: 'The indexing choice affects future review and promotion decisions.',
        recommendedOwner: 'processor owner',
        priority: 'high',
      },
    ],
    unresolvedIssues: [
      {
        issueId: `issue-${sourceId}-page-locator-primary`,
        severity: 'medium',
        issueType: 'page_locator_primary',
        sourceId,
        itemId,
        message:
          'The manual slice should remain anchored by a page locator because the opening pages are the source of record for exact wording.',
        recommendedAction: 'Keep the page locator visible instead of overclaiming exact wording.',
        evidence:
          'The source is a 1,486-page reference manual and the controlled runner should preserve page-level references for this source family.',
      },
      {
        issueId: `issue-${sourceId}-page-image-backstop`,
        severity: 'medium',
        issueType: 'page_image_wording_backstop',
        sourceId,
        itemId,
        message:
          'The wording should be confirmed against the page image before anyone treats the text as exact.',
        recommendedAction:
          'Keep the page-image backstop visible and avoid overclaiming exact wording from the text layer.',
        evidence: 'The manual is a text-based PDF with page-image wording available as the backstop.',
      },
      {
        issueId: `issue-${sourceId}-topic-boundary`,
        severity: 'medium',
        issueType: spec.topicIssueType,
        sourceId,
        itemId,
        message: spec.topicIssueMessage,
        recommendedAction: spec.topicRecommendedAction,
        evidence: spec.topicIssueEvidence,
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Controlled manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: spec.validationCheckId,
        status: 'passed',
        details: spec.validationCheckDetails,
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The selected page carries a source reference and a page locator.',
      },
      {
        checkId: 'page-image-backstop-tracked',
        status: 'passed',
        details:
          'The review packet keeps the page-image wording backstop visible because the manual text can still wrap awkwardly.',
      },
      {
        checkId: 'reference-manual-status-tracked',
        status: 'passed',
        details:
          'The review packet keeps the reference-manual status visible so the source is not mistaken for binding text.',
      },
      {
        checkId: 'no-promotion-output',
        status: 'passed',
        details: 'No approved-promoted or app-ready export was produced for the batch.',
      },
      {
        checkId: 'review-only-guardrails',
        status: 'passed',
        details: 'Review packet stays not approved and unresolved issues remain visible for human review.',
      },
    ],
    sourceSelections: [
      {
        sourceId,
        relativePath: rawSourceFile,
        sourceFamilyId,
        documentType: 'reference_manual',
        sourceTitle,
        sourceReference,
        versionDate: '2026-01',
        pageWindow: spec.pageWindow,
        sectionReference: spec.sectionReference,
        citationText: spec.citationText,
        confidence: 'high',
        reviewFlags: spec.reviewFlags,
        reviewStatus: 'needs_human_review',
        itemKind: 'review_note',
        notes: spec.notes,
        summary: spec.summary,
        keywords: spec.keywords,
        sourceNotes: spec.sourceNotes,
        artifactProcessingStatus: 'inventoried',
        inventoryProcessingStatus: 'inventoried',
        authorityLevel: 'guidance',
        reviewPacketNotes: spec.reviewPacketNotes,
        reviewPacketIssueCount: 3,
        reviewPacketProcessingStatus: 'inventoried',
        nonLearnerFacingNotes: defaultNonLearnerNotes,
      },
    ],
  }
}

const lhmanual26BatchSpecs = [
  {
    plannedBatchId: 'batch-251',
    batchSlug: 'lhmanual26-front-matter',
    sourceId: 'lhmanual26-front-matter',
    batchTitle: 'front matter and preface heading',
    summaryLead:
      'The title page, copyright notice, TOC, and preface heading keep the manual framed as a review-only reference compilation',
    pageWindow: [1, 8],
    sectionReference: 'Title page, copyright notice, table of contents, and preface heading',
    citationText: 'LIFE & HEALTH VALUATION LAW MANUAL',
    summary:
      'The opening pages frame the manual as a copyrighted Academy / NAIC reference compilation and keep the preface review-only.',
    keywords: ['life & health valuation law manual', 'copyright', 'table of contents', 'preface'],
    notes:
      'Title page, copyright notice, TOC, and preface heading retained as review-only reference material.',
    sourceNotes: 'Pages 1-8 only; title page, copyright notice, TOC, and Section 1 heading.',
    reviewFlags: ['background_content', 'documentation_expectation', 'boundary_control_window'],
    flagType: 'reference_manual_opening',
    flagMessage:
      'Keep the opening pages review-only while the manual-compilation wording and TOC stay visible.',
    topicIssueType: 'manual_opening_boundary',
    topicIssueDetails:
      'The opening pages should stay separate from Section 2 and later manual sections.',
    topicRecommendedAction: 'Preserve the page 1-8 front matter boundary and stop before Section 2 begins.',
    topicIssueMessage:
      'The front matter should remain separate from the later annual-filings section and not be widened.',
    topicIssueEvidence: 'Pages 1-8 cover the title page, copyright notice, TOC, and Section 1 heading.',
    validationCheckId: 'lhmanual26-front-matter-coverage',
    validationCheckDetails:
      'The front matter stayed confined to the planned page-1-through-8 window and kept the manual framing visible.',
    reviewStatus: 'needs_human_review',
  },
  {
    plannedBatchId: 'batch-252',
    batchSlug: 'lhmanual26-annual-filings',
    sourceId: 'lhmanual26-annual-filings',
    batchTitle: 'annual filings and state contact information',
    summaryLead:
      'The RAAIS filing guide and opening state-contact list keep the annual-filings section review-only',
    pageWindow: [9, 20],
    sectionReference: 'Section 2 annual filings and opening state contact information',
    citationText: 'Section 2 - Annual Filings',
    summary:
      'The annual-filings section remains review-only reference material and keeps the RAAIS filing guide and state contacts source-bound.',
    keywords: ['annual filings', 'RAAIS filing guide', 'state contact information', 'NAIC filing webpage'],
    notes:
      'Annual-filings guidance and opening state-contact list retained as review-only reference material.',
    sourceNotes: 'Pages 9-20 only; Section 2 annual filings and the first half of the state-contact list.',
    reviewFlags: [
      'documentation_expectation',
      'jurisdiction_specific_requirement',
      'cross_reference_mapping',
      'boundary_control_window',
    ],
    flagType: 'annual_filings_reference',
    flagMessage:
      'Keep the annual-filings guidance review-only while the state-contact list remains visible.',
    topicIssueType: 'annual_filings_boundary',
    topicIssueDetails:
      'The annual-filings guidance should stay separate from the valuation-letter section.',
    topicRecommendedAction: 'Preserve the page 9-20 boundary and stop before the valuation-letter section begins.',
    topicIssueMessage:
      'The annual-filings guidance should remain separate from the downstream valuation letters.',
    topicIssueEvidence: 'Pages 9-20 cover the RAAIS filing guide and the opening state-contact list.',
    validationCheckId: 'lhmanual26-annual-filings-coverage',
    validationCheckDetails:
      'The annual-filings material stayed confined to the planned page-9-through-20 window and kept the guidance visible.',
    reviewStatus: 'needs_human_review',
  },
  {
    plannedBatchId: 'batch-253',
    batchSlug: 'lhmanual26-valuation-letters',
    sourceId: 'lhmanual26-valuation-letters',
    batchTitle: 'valuation-related letters',
    summaryLead:
      'The remaining state-contact entries and valuation-related letters keep the manual review-only before Section 3 begins',
    pageWindow: [21, 30],
    sectionReference: 'Section 2 valuation-related letters issued by various states',
    citationText: 'Valuation Related Letters Issued by Various States',
    summary:
      'The valuation-related letters remain review-only reference material and keep the state guidance source-bound.',
    keywords: ['valuation-related letters', 'California', 'New York', 'Rhode Island', 'state guidance'],
    notes:
      'State guidance references and valuation-related letters retained as review-only reference material.',
    sourceNotes: 'Pages 21-30 only; the remainder of Section 2 and the valuation-related letters.',
    reviewFlags: [
      'jurisdiction_specific_requirement',
      'documentation_expectation',
      'cross_reference_mapping',
      'boundary_control_window',
      'requires_human_interpretation',
    ],
    flagType: 'state_guidance_reference',
    flagMessage:
      'Keep the state guidance references review-only while the valuation-letter wording remains visible.',
    topicIssueType: 'valuation_letters_boundary',
    topicIssueDetails:
      'The state guidance letters should stay separate from Section 3 and later manual sections.',
    topicRecommendedAction: 'Preserve the page 21-30 boundary and do not widen into Section 3.',
    topicIssueMessage:
      'The valuation-related letters should remain separate from the Valuation Manual section that begins on page 31.',
    topicIssueEvidence: 'Pages 21-30 cover the remainder of Section 2 and the valuation-related letters.',
    validationCheckId: 'lhmanual26-valuation-letters-coverage',
    validationCheckDetails:
      'The valuation-related letters stayed confined to the planned page-21-through-30 window and kept the state guidance visible.',
    reviewStatus: 'needs_human_review',
  },
]

export const lhmanual26BatchDefinitions = Object.fromEntries(
  lhmanual26BatchSpecs.map((spec) => {
    const batch = makeBatch(spec)
    return [spec.plannedBatchId, batch]
  }),
)
