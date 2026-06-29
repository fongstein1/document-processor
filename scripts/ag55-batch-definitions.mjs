const rawSourceFolder = 'Actuarial Guidelines'
const sourceFamilyId = 'actuarial_guidelines'
const defaultNonLearnerNotes =
  'AG 55 stays review-only. Keep paragraph locators and line references primary, and do not promote any item.'

const makeAg55Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`

  return {
    batchName: `AG 55 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ag55_reinsurance_aat',
    processingIntentText:
      spec.processingIntentText ??
      'Small AG 55 review-only batch: capture the reinsurance AAT guidance and keep later sections outside the batch.',
    processingIntentNotes: spec.processingIntentNotes ?? defaultNonLearnerNotes,
    batchSummaryText:
      spec.batchSummaryText ??
      'Batch remains review-only. AG 55 is retained as review-only guidance and is not approved for promotion.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This AG 55 guideline slice is intentionally limited to ${spec.batchTitle} and keeps the next section outside the batch.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small AG 55 guideline batch. Keep the work review-first, preserve paragraph locators and line references, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'paragraph_locator_primary',
        message:
          'AG 55 should stay paragraph-locator anchored because the runner is expected to preserve line references for this text source.',
        notes: 'Keep review-only and do not promote.',
      },
      {
        flagId: `flag-${sourceId}-line-reference`,
        severity: 'low',
        sourceId,
        itemId,
        flagType: 'line_references_expected',
        message:
          'Line references should be preserved for this Word source path; paragraph locators remain the primary anchor.',
        notes: 'Keep the paragraph-locator anchor visible as a review note.',
      },
      {
        flagId: `flag-${sourceId}-topic`,
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
        issueId: `citation-${sourceId}-paragraph-locator-primary`,
        sourceId,
        itemId,
        issueType: 'paragraph_locator_primary',
        details:
          'Paragraph locators should remain the primary anchor for AG 55 because the source is a text-based Word draft and the runner should preserve line references.',
        recommendedAction:
          'Keep the planned paragraph window together and preserve the locator in the review packet.',
      },
      {
        issueId: `citation-${sourceId}-line-reference-gap`,
        sourceId,
        itemId,
        issueType: 'line_references_expected',
        details:
          'Line references should be preserved for this text source, so paragraph locators remain the practical review anchor.',
        recommendedAction:
          'Keep the paragraph locator visible and avoid overclaiming exact line wording.',
      },
      {
        issueId: `citation-${sourceId}-topic-boundary`,
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
          'Should AG 55 remain indexed as active review-only guidance, or should it later be linked only as a context note once future guidance supersedes it?',
        whyItMatters: 'The indexing choice affects future review and promotion decisions.',
        recommendedOwner: 'processor owner',
        priority: 'high',
      },
      {
        decisionId: `decision-${sourceId}-paragraph-window-split`,
        decisionType: 'boundary_check',
        question:
          'Should the current paragraph-window split remain the canonical regeneration boundary, or should later cleanup rebalance the reporting and appendix sections?',
        whyItMatters: 'The paragraph window controls how much context is exposed in the review packet.',
        recommendedOwner: 'source reviewer',
        priority: 'medium',
      },
    ],
    unresolvedIssues: [
      {
        issueId: `issue-${sourceId}-paragraph-locator-primary`,
        severity: 'medium',
        issueType: 'paragraph_locator_primary',
        sourceId,
        itemId,
        message:
          'The AG 55 slice should remain anchored by paragraph locators because the runner is expected to preserve line references.',
        recommendedAction:
          'Keep the paragraph locator visible instead of overclaiming exact line wording.',
        evidence:
          'The source is a Word document and the controlled runner should preserve line-level references for this source family.',
      },
      {
        issueId: `issue-${sourceId}-line-reference-gap`,
        severity: 'medium',
        issueType: 'line_references_expected',
        sourceId,
        itemId,
        message:
          'Line references should be preserved for this text source, so the paragraph locator should remain the review anchor.',
        recommendedAction:
          'Keep the paragraph locator visible and avoid overclaiming exact line wording.',
        evidence:
          'AG 55 is a text-based Word source and the controlled runner should preserve line-level references for this source family.',
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
        details: 'Pilot manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: 'ag55-paragraph-window-coverage',
        status: 'passed',
        details: `The selected paragraph window captures the planned AG 55 ${spec.batchTitle}.`,
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The AG 55 slice carries a source reference and a paragraph locator.',
      },
      {
        checkId: 'line-reference-gap-tracked',
        status: 'passed',
        details: 'The review packet keeps paragraph locators primary because line references should be preserved.',
      },
      {
        checkId: 'topic-context-tracked',
        status: 'passed',
        details: spec.topicValidationDetails,
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
        relativePath: `${rawSourceFolder}/${spec.filename}`,
        sourceFamilyId,
        documentType: 'actuarial_guideline',
        sourceTitle: spec.sourceTitle,
        sourceReference: spec.sourceReference,
        versionDate: null,
        paragraphWindow: spec.paragraphWindow,
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
        nonLearnerFacingNotes:
          'AG 55 slice retained as review-only guidance until the wording and boundary are confirmed.',
      },
    ],
  }
}

const ag55BatchSpecs = [
  {
    plannedBatchId: 'batch-171',
    batchSlug: 'ag55-171-opening-effective-date',
    sourceId: 'ag55-opening-effective-date',
    filename: 'AG 55-Reinsurance AAT as adopted by LATF-20250610.docx',
    sourceTitle:
      'Application of the Valuation Manual for Testing the Adequacy of Reserves Related to Certain Life Reinsurance Treaties',
    sourceReference: 'Actuarial Guideline LV',
    paragraphWindow: [1, 18],
    sectionReference: 'Background / effective date',
    citationText:
      'Disclaimer: Actuarial Guideline 55 (AG ReAAT) has not been adopted by the NAIC’s Life Insurance and Annuities (A) Committee or the Executive (EX) Committee and Plenary and is thus subject to change or to non-adoption.',
    notes:
      'Opening disclaimer, background, and effective-date slice; keep the pending committee-adoption caveat visible.',
    summary:
      'Opening guidance explains why the guideline exists, notes pending committee adoption, and sets the effective date for asset adequacy analysis of reinsurance-related reserves.',
    keywords: ['AG 55', 'reinsurance', 'asset adequacy analysis', 'effective date', 'disclaimer'],
    sourceNotes: 'First 18 paragraphs only; disclaimer and effective-date window.',
    reviewPacketNotes: 'Pending committee-adoption disclaimer stays visible as a review-only caveat.',
    nextStep:
      'Move to scope and applicability at paragraphs 19-38 while keeping the LATF-adopted-draft caveat visible.',
    flagType: 'pending_committee_adoption',
    flagMessage:
      'This AG 55 slice contains the pending committee-adoption disclaimer and should remain review-only.',
    topicIssueType: 'opening_boundary',
    topicIssueDetails:
      'The opening guidance should stay separate from the scope and definitions windows.',
    topicRecommendedAction: 'Preserve the opening window and do not let it absorb the scope section.',
    topicIssueMessage:
      'The opening disclaimer and background slice should remain separate from the scope section.',
    topicIssueEvidence: 'Paragraphs 1-18 are limited to the opening disclaimer, background, and effective date.',
    topicValidationDetails:
      'The opening disclaimer, background, and effective-date slice stayed confined to the planned paragraph window.',
    reviewFlags: ['text_source', 'paragraph_locator_primary', 'pending_committee_adoption'],
  },
  {
    plannedBatchId: 'batch-172',
    batchSlug: 'ag55-172-scope-applicability',
    sourceId: 'ag55-scope-applicability',
    filename: 'AG 55-Reinsurance AAT as adopted by LATF-20250610.docx',
    sourceTitle:
      'Application of the Valuation Manual for Testing the Adequacy of Reserves Related to Certain Life Reinsurance Treaties',
    sourceReference: 'Actuarial Guideline LV',
    paragraphWindow: [19, 38],
    sectionReference: 'Scope',
    citationText: '2.Scope',
    notes: 'Scope and applicability refinement slice; keep the definitions section for a later batch.',
    summary:
      'Scope language identifies the treaties and reserve-credit conditions that bring a reinsurance arrangement within the guideline, including exemption pathways.',
    keywords: ['AG 55', 'scope', 'applicability', 'reinsurance treaty', 'reserve credit'],
    sourceNotes: 'Scope section only; stop before definitions begin.',
    reviewPacketNotes: 'Scope language should not absorb the definitions section.',
    nextStep: 'Move to definitions at paragraphs 39-75 while keeping the scope window tight.',
    flagType: 'scope_boundary',
    flagMessage: 'Scope and applicability should stay separate from the definitions section.',
    topicIssueType: 'scope_boundary',
    topicIssueDetails: 'The scope section identifies applicability and exemption criteria, but should not widen into definitions.',
    topicRecommendedAction: 'Keep the scope window narrow and stop at the definitions heading.',
    topicIssueMessage: 'Scope and applicability should remain review-only and stop before definitions begin.',
    topicIssueEvidence: 'Paragraphs 19-38 cover the scope and applicability refinement only.',
    topicValidationDetails: 'The scope window stayed confined to the planned paragraph range and did not absorb definitions.',
    reviewFlags: ['text_source', 'paragraph_locator_primary', 'scope_boundary'],
  },
  {
    plannedBatchId: 'batch-173',
    batchSlug: 'ag55-173-definitions-core-terms',
    sourceId: 'ag55-definitions-core-terms',
    filename: 'AG 55-Reinsurance AAT as adopted by LATF-20250610.docx',
    sourceTitle:
      'Application of the Valuation Manual for Testing the Adequacy of Reserves Related to Certain Life Reinsurance Treaties',
    sourceReference: 'Actuarial Guideline LV',
    paragraphWindow: [39, 75],
    sectionReference: 'Definitions',
    citationText: '3.Definitions',
    notes: 'Definitions and core terms slice; keep the risk-identification section for later.',
    summary:
      'Definitions establish the guideline’s key reserve and reinsurance terms, including Alternative Run, Deficient Block, Excess Capital, Guideline Excluded Assets, and reserve definitions.',
    keywords: ['AG 55', 'definitions', 'reserve terms', 'reinsurance', 'Guideline Excluded Assets'],
    sourceNotes: 'Definitions section only; stop before risk identification begins.',
    reviewPacketNotes: 'Definitions should stay separate from the risk-identification and documentation section.',
    nextStep: 'Move to risk identification and documentation expectations at paragraphs 76-114.',
    flagType: 'definitions_boundary',
    flagMessage: 'Definitions should remain separated from the later risk-identification section.',
    topicIssueType: 'definitions_boundary',
    topicIssueDetails: 'This slice includes the core term set that should not be blended into later modeling guidance.',
    topicRecommendedAction: 'Preserve the definitions window and keep the risk-identification section out of this batch.',
    topicIssueMessage:
      'Definitions and core terms should remain review-only and stop before the risk-identification section begins.',
    topicIssueEvidence: 'Paragraphs 39-75 contain the guideline term set and reserve definitions.',
    topicValidationDetails:
      'The definitions window stayed confined to the planned paragraph range and did not absorb the risk-identification section.',
    reviewFlags: ['text_source', 'paragraph_locator_primary', 'definitions_boundary'],
  },
  {
    plannedBatchId: 'batch-174',
    batchSlug: 'ag55-174-risk-identification-analysis-documentation',
    sourceId: 'ag55-risk-identification-analysis-documentation',
    filename: 'AG 55-Reinsurance AAT as adopted by LATF-20250610.docx',
    sourceTitle:
      'Application of the Valuation Manual for Testing the Adequacy of Reserves Related to Certain Life Reinsurance Treaties',
    sourceReference: 'Actuarial Guideline LV',
    paragraphWindow: [76, 114],
    sectionReference: 'Risk Identification / analysis expectations',
    citationText: '4.Risk Identification for Purposes of Establishing Analysis and Documentation Expectations',
    notes:
      'Risk identification and analysis/documentation expectations slice; keep the cash-flow testing details for a later batch.',
    summary:
      'Risk identification identifies the circumstances that drive more rigorous analysis and documentation, including collectability risk, excluded assets, and domestic regulator discretion.',
    keywords: ['AG 55', 'risk identification', 'documentation', 'collectability', 'reinsurance'],
    sourceNotes: 'Risk identification and analysis expectations only; stop before cash-flow testing details.',
    reviewPacketNotes:
      'Risk-identification language should stay separate from the later cash-flow testing details.',
    nextStep:
      'Move to cash-flow testing details at paragraphs 115-161 while keeping the risk-identification slice tight.',
    flagType: 'risk_identification_boundary',
    flagMessage: 'Risk identification should remain separate from the later cash-flow testing details.',
    topicIssueType: 'risk_identification_boundary',
    topicIssueDetails:
      'The risk-identification slice sets the rigor and documentation context but should not absorb the modeling details.',
    topicRecommendedAction:
      'Keep the risk-identification and documentation window separate from the cash-flow testing section.',
    topicIssueMessage:
      'Risk identification and documentation expectations should remain review-only and stop before cash-flow testing details begin.',
    topicIssueEvidence:
      'Paragraphs 76-114 cover the risk-identification and analysis/documentation expectations.',
    topicValidationDetails:
      'The risk-identification window stayed confined to the planned paragraph range and did not absorb the cash-flow testing details.',
    reviewFlags: ['text_source', 'paragraph_locator_primary', 'risk_identification_boundary'],
  },
  {
    plannedBatchId: 'batch-175',
    batchSlug: 'ag55-175-cash-flow-testing-details',
    sourceId: 'ag55-cash-flow-testing-details',
    filename: 'AG 55-Reinsurance AAT as adopted by LATF-20250610.docx',
    sourceTitle:
      'Application of the Valuation Manual for Testing the Adequacy of Reserves Related to Certain Life Reinsurance Treaties',
    sourceReference: 'Actuarial Guideline LV',
    paragraphWindow: [115, 161],
    sectionReference: 'Cash-flow testing details',
    citationText: '6.Cash-flow Testing Details',
    notes:
      'Cash-flow testing details slice; keep the attribution and aggregation sections for later batches.',
    summary:
      'Cash-flow testing details establish the starting asset amount rules, alternative-run principles, scenario documentation, and modeling expectations for assets and assumptions.',
    keywords: ['AG 55', 'cash-flow testing', 'starting asset amount', 'alternative run', 'New York 7'],
    sourceNotes: 'Cash-flow testing details only; stop before attribution analysis begins.',
    reviewPacketNotes: 'Modeling guidance should stay separate from attribution and aggregation.',
    nextStep:
      'Move to attribution analysis and aggregation at paragraphs 162-188 while keeping the cash-flow testing window tight.',
    flagType: 'cash_flow_testing_boundary',
    flagMessage: 'Cash-flow testing details should remain separate from attribution and aggregation.',
    topicIssueType: 'cash_flow_testing_boundary',
    topicIssueDetails:
      'This slice includes the modeling details and should not be widened to cover later reporting sections.',
    topicRecommendedAction: 'Preserve the modeling details window and keep attribution analysis out of this batch.',
    topicIssueMessage:
      'Cash-flow testing details should remain review-only and stop before attribution analysis begins.',
    topicIssueEvidence:
      'Paragraphs 115-161 cover the Starting Asset Amount, alternative-run, and modeling expectations.',
    topicValidationDetails:
      'The cash-flow testing window stayed confined to the planned paragraph range and did not absorb attribution analysis.',
    reviewFlags: ['text_source', 'paragraph_locator_primary', 'cash_flow_testing_boundary'],
  },
  {
    plannedBatchId: 'batch-176',
    batchSlug: 'ag55-176-attribution-aggregation',
    sourceId: 'ag55-attribution-aggregation',
    filename: 'AG 55-Reinsurance AAT as adopted by LATF-20250610.docx',
    sourceTitle:
      'Application of the Valuation Manual for Testing the Adequacy of Reserves Related to Certain Life Reinsurance Treaties',
    sourceReference: 'Actuarial Guideline LV',
    paragraphWindow: [162, 188],
    sectionReference: 'Attribution analysis / aggregation',
    citationText: '7.Attribution Analysis',
    notes:
      'Attribution analysis and aggregation slice; keep the reporting section for a later batch.',
    summary:
      'Attribution analysis explains reserve-decrease drivers and aggregation considerations before the reporting section begins.',
    keywords: ['AG 55', 'attribution analysis', 'aggregation', 'reserve decrease', 'deficient block'],
    sourceNotes: 'Attribution analysis and aggregation only; stop before reporting begins.',
    reviewPacketNotes: 'Attribution and aggregation should stay separate from the reporting section.',
    nextStep:
      'Move to reporting and treaty documentation at paragraphs 190-224 while keeping the attribution window tight.',
    flagType: 'attribution_boundary',
    flagMessage: 'Attribution analysis should remain separate from the reporting section.',
    topicIssueType: 'attribution_boundary',
    topicIssueDetails:
      'The attribution and aggregation slice should not absorb the reporting and template materials.',
    topicRecommendedAction:
      'Keep attribution analysis and aggregation together and stop before the reporting section begins.',
    topicIssueMessage:
      'Attribution analysis and aggregation should remain review-only and stop before reporting begins.',
    topicIssueEvidence:
      'Paragraphs 162-188 cover attribution analysis and aggregation considerations.',
    topicValidationDetails:
      'The attribution and aggregation window stayed confined to the planned paragraph range and did not absorb reporting.',
    reviewFlags: ['text_source', 'paragraph_locator_primary', 'attribution_boundary'],
  },
  {
    plannedBatchId: 'batch-177',
    batchSlug: 'ag55-177-reporting-documentation-assumptions',
    sourceId: 'ag55-reporting-documentation-assumptions',
    filename: 'AG 55-Reinsurance AAT as adopted by LATF-20250610.docx',
    sourceTitle:
      'Application of the Valuation Manual for Testing the Adequacy of Reserves Related to Certain Life Reinsurance Treaties',
    sourceReference: 'Actuarial Guideline LV',
    paragraphWindow: [190, 224],
    sectionReference: 'Reporting / documentation / assumptions',
    citationText: '9.Reporting, Review, and Templates',
    notes:
      'Reporting, treaty documentation, and assumption-information slice; keep the results / template-window for a later batch.',
    summary:
      'Reporting and documentation requirements identify how the actuarial memorandum, treaty data, and assumption details should be presented for review.',
    keywords: ['AG 55', 'reporting', 'documentation', 'VM-30 memorandum', 'assumptions'],
    sourceNotes: 'Reporting, treaty documentation, and assumptions only; stop before cash-flow results and templates.',
    reviewPacketNotes:
      'Reporting and treaty documentation should stay separate from the results/template window.',
    nextStep:
      'Move to the results, attribution, and template-window material at paragraphs 225-255.',
    flagType: 'reporting_boundary',
    flagMessage:
      'Reporting and documentation should remain separate from the results and templates window.',
    topicIssueType: 'reporting_boundary',
    topicIssueDetails:
      'This slice includes the memorandum and assumption details but should not absorb the results or templates.',
    topicRecommendedAction:
      'Preserve the reporting and documentation window and keep the results/template material out of this batch.',
    topicIssueMessage:
      'Reporting, treaty documentation, and assumption information should remain review-only and stop before the results window begins.',
    topicIssueEvidence:
      'Paragraphs 190-224 cover the reporting, treaty documentation, and assumption-information requirements.',
    topicValidationDetails:
      'The reporting window stayed confined to the planned paragraph range and did not absorb the results/template material.',
    reviewFlags: ['text_source', 'paragraph_locator_primary', 'reporting_boundary'],
  },
  {
    plannedBatchId: 'batch-178',
    batchSlug: 'ag55-178-results-attribution-risk-identification',
    sourceId: 'ag55-results-attribution-risk-identification',
    filename: 'AG 55-Reinsurance AAT as adopted by LATF-20250610.docx',
    sourceTitle:
      'Application of the Valuation Manual for Testing the Adequacy of Reserves Related to Certain Life Reinsurance Treaties',
    sourceReference: 'Actuarial Guideline LV',
    paragraphWindow: [225, 255],
    sectionReference: 'Results / attribution / risk identification / templates',
    citationText: 'iii.Cash-flow testing results',
    notes:
      'Cash-flow results, attribution, risk identification, and template worksheet slice; keep the appendix scenario excerpt separate.',
    summary:
      'Results and template material identify the numerical outputs, sensitivity tests, attribution analysis, risk-identification items, and template worksheets for review.',
    keywords: ['AG 55', 'results', 'attribution', 'risk identification', 'templates'],
    sourceNotes: 'Results, attribution, risk identification, and templates only; stop before the appendix excerpt.',
    reviewPacketNotes:
      'Results and templates should stay separate from the appendix scenario excerpt.',
    nextStep:
      'Move to the appendix New York 7 scenarios at paragraphs 258-268 and keep the closing boundary explicit.',
    flagType: 'results_boundary',
    flagMessage:
      'Results and template material should remain separate from the appendix scenario excerpt.',
    topicIssueType: 'results_boundary',
    topicIssueDetails:
      'This slice combines results and templates but should not absorb the appendix scenario material.',
    topicRecommendedAction: 'Keep the results/template window tight and stop before the appendix heading.',
    topicIssueMessage:
      'Results, attribution, risk identification, and templates should remain review-only and stop before the appendix excerpt begins.',
    topicIssueEvidence:
      'Paragraphs 225-255 cover the results, attribution, risk-identification, and template worksheet material.',
    topicValidationDetails:
      'The results/template window stayed confined to the planned paragraph range and did not absorb the appendix.',
    reviewFlags: ['text_source', 'paragraph_locator_primary', 'results_boundary'],
  },
  {
    plannedBatchId: 'batch-179',
    batchSlug: 'ag55-179-appendix-new-york-7-scenarios',
    sourceId: 'ag55-appendix-new-york-7-scenarios',
    filename: 'AG 55-Reinsurance AAT as adopted by LATF-20250610.docx',
    sourceTitle:
      'Application of the Valuation Manual for Testing the Adequacy of Reserves Related to Certain Life Reinsurance Treaties',
    sourceReference: 'Actuarial Guideline LV',
    paragraphWindow: [258, 268],
    sectionReference: 'Appendix 1 / New York 7 scenarios',
    citationText: 'Appendix 1 – New York 7 Interest Rate Scenarios',
    notes: 'Appendix 1 scenario excerpt and closing boundary; keep the appendix separate from the main body.',
    summary:
      'The appendix lists the New York 7 interest-rate scenarios and the treasury-yield floor guidance that supports the review of cash-flow testing results.',
    keywords: ['AG 55', 'appendix', 'New York 7', 'interest rate scenarios', 'closing boundary'],
    sourceNotes: 'Appendix only; keep the appendix separate from the main body and stop at the closing boundary.',
    reviewPacketNotes:
      'Appendix scenario excerpt stays separate from the main body so the closing boundary remains explicit.',
    nextStep:
      'No later AG source was selected in this wave; confirm whether any other safe source unit remains after the appendix boundary.',
    flagType: 'appendix_boundary',
    flagMessage: 'The appendix scenario excerpt should remain separate from the main body.',
    topicIssueType: 'appendix_boundary',
    topicIssueDetails:
      'This appendix slice closes the source and should not be widened into a new review window.',
    topicRecommendedAction: 'Keep the appendix separate and treat the closing boundary as final for this source.',
    topicIssueMessage: 'The appendix and closing boundary should remain review-only and end the AG 55 wave.',
    topicIssueEvidence: 'Paragraphs 258-268 contain the New York 7 appendix excerpt and closing boundary.',
    topicValidationDetails:
      'The appendix window stayed confined to the planned paragraph range and remained separate from the main body.',
    reviewFlags: ['text_source', 'paragraph_locator_primary', 'appendix_boundary'],
  },
]

export const ag55BatchDefinitions = Object.fromEntries(
  ag55BatchSpecs.map((spec) => {
    const batch = makeAg55Batch(spec)
    return [spec.plannedBatchId, batch]
  }),
)
