const rawSourceFolder = 'Actuarial Guidelines'
const sourceFamilyId = 'actuarial_guidelines'
const defaultNonLearnerNotes =
  'AG 43 stays review-only. Keep the page-image wording backstop visible, prefer page locators when line references are unavailable, and do not promote any item.'

const makeAg43Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`

  return {
    batchName: `AG 43 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ag43_variable_annuity_guidance',
    processingIntentText:
      spec.processingIntentText ??
      'Tiny AG 43 review-only batch: capture the CARVM variable-annuity slice and keep AG 44 outside the batch.',
    processingIntentNotes: spec.processingIntentNotes ?? defaultNonLearnerNotes,
    batchSummaryText:
      spec.batchSummaryText ??
      'Batch remains review-only. AG 43 is retained as review-only guidance and is not approved for promotion.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This AG 43 guideline slice is intentionally limited to ${spec.batchTitle} and keeps AG 44 outside the batch.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small AG 43 guideline batch. Keep the work review-first, preserve the page locator, treat the page image as the wording backstop, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'ocr_text_layer',
        message:
          'AG 43 has an encoding-noisy text layer, so the text should stay review-only until the page image is confirmed.',
        notes: 'Keep review-only and do not promote.',
      },
      {
        flagId: `flag-${sourceId}-page-image`,
        severity: 'low',
        sourceId,
        itemId,
        flagType: 'page_image_backstop',
        message:
          'The page image should remain the wording backstop because the guideline text is encoding-noisy and line references are not expected.',
        notes: 'Keep the image backstop visible as a review note.',
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
        issueId: `citation-${sourceId}-page-image-confirmation`,
        sourceId,
        itemId,
        issueType: 'page_image_confirmation',
        details:
          'The page-image wording should be confirmed before anyone treats AG 43 as an indexing candidate.',
        recommendedAction:
          'Keep the planned page window together and preserve the page-image backstop note.',
      },
      {
        issueId: `citation-${sourceId}-line-reference-unavailable`,
        sourceId,
        itemId,
        issueType: 'line_reference_unavailable',
        details:
          'Stable line references are not expected for the encoded AG 43 text layer, so page locators should remain the primary anchor.',
        recommendedAction:
          'Keep the page locator and page-image wording backstop visible instead of overclaiming exact line wording.',
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
          'Should AG 43 remain indexed as review-only variable-annuity guidance, or should it be linked only as a context note?',
        whyItMatters: 'The indexing choice affects future review and promotion decisions.',
        recommendedOwner: 'processor owner',
        priority: 'high',
      },
      {
        decisionId: `decision-${sourceId}-page-window-split`,
        decisionType: 'boundary_check',
        question:
          'Should the current page window remain a single review-only slice, or should a later cleanup split the background from the mechanics/material boundary?',
        whyItMatters: 'The page window controls how much context is exposed in the review packet.',
        recommendedOwner: 'source reviewer',
        priority: 'medium',
      },
    ],
    unresolvedIssues: [
      {
        issueId: `issue-${sourceId}-page-image-confirmation`,
        severity: 'medium',
        issueType: 'page_image_confirmation',
        sourceId,
        itemId,
        message:
          'The AG 43 text layer is encoded, and the page-image wording should remain a visible review note.',
        recommendedAction:
          'Keep the planned page window together and preserve the page-image backstop note.',
        evidence:
          'The OCR/text layer is encoding-noisy, so the page image should be checked against the extracted wording.',
      },
      {
        issueId: `issue-${sourceId}-line-reference-unavailable`,
        severity: 'low',
        issueType: 'line_reference_unavailable',
        sourceId,
        itemId,
        message:
          'Stable line references are not expected, so page locators should remain the primary review anchor.',
        recommendedAction:
          'Keep the page locator and page-image wording backstop visible instead of overclaiming exact line wording.',
        evidence:
          'The source is an encoded 71-page PDF and the text layer does not support stable line mapping.',
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
        checkId: 'ag43-page-window-coverage',
        status: 'passed',
        details: 'The selected page window captures the planned AG 43 slice.',
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The AG 43 slice carries a source reference and a page locator.',
      },
      {
        checkId: 'page-image-backstop-tracked',
        status: 'passed',
        details: 'The review packet and unresolved-issues summary both capture the encoded-text caveat.',
      },
      {
        checkId: 'line-reference-unavailable',
        status: 'passed',
        details: 'The review packet keeps page locators primary because line references are not expected.',
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
        reviewPacketIssueCount: spec.reviewPacketIssueCount ?? 3,
        reviewPacketProcessingStatus: 'inventoried',
        nonLearnerFacingNotes:
          'AG 43 slices retained as review-only guidance until the wording and AG 44 boundary are confirmed.',
      },
    ],
  }
}

const ag43BatchSpecs = [
  {
    plannedBatchId: 'batch-140',
    batchSlug: 'ag43-140-background-scope-definitions',
    sourceId: 'ag43-background-scope-definitions',
    filename: 'AG 43 - CARVM for Variable Annuities.pdf',
    sourceTitle: 'AG 43 - CARVM for Variable Annuities',
    sourceReference: 'Actuarial Guideline XLIII',
    batchTitle: 'background, scope, definitions, and opening principles slice',
    pageWindow: [1, 5],
    sectionReference:
      'AG 43 pages 1-5: background, scope, definitions, and the opening reserve-methodology principles.',
    citationText:
      'The purpose of this Actuarial Guideline is to interpret the standards for the valuation of reserves for variable annuities and other contracts involving certain guaranteed benefits similar to those offered with variable annuities.',
    summary:
      'AG 43 opens with the CARVM interpretation, scope, and definitions that frame the later reserve methodology for variable annuity guarantees.',
    keywords: [
      'AG 43',
      'Actuarial Guideline XLIII',
      'CARVM',
      'variable annuities',
      'scope',
      'definitions',
      'opening principles',
      'reserve methodology',
    ],
    notes:
      'Opening background / scope / definitions window; the text layer is noisy / encoded, so the page image should remain the wording backstop.',
    sourceNotes: 'Active guidance; AG 44 remains out of scope.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop', 'scope_definitions', 'reserve_method_context'],
    reviewPacketNotes: 'Background, scope, and opening-principles slice remains review-only.',
    reviewPacketIssueCount: 3,
    nextStep:
      'Confirm the page-image wording and whether the reserve-methodology opener should remain split from the opening background.',
    flagType: 'scope_definitions_caveat',
    flagMessage:
      'The opening CARVM interpretation, scope, and definitions should remain review-only context until the page image is confirmed.',
    topicIssueType: 'scope_boundary',
    topicIssueDetails:
      'The opening AG 43 slice should stay separate from the later reserve-methodology appendix windows.',
    topicRecommendedAction:
      'Keep the page 1-5 slice review-only and do not widen it into Appendix 1 material.',
    topicIssueMessage:
      'The opening background and scope language should not absorb the appendix mechanics.',
    topicIssueEvidence:
      'Pages 1-5 contain the opening background, scope, definitions, and reserve-principle material.',
    topicValidationDetails:
      'The selected pages capture the opening AG 43 background and scope slice.',
  },
  {
    plannedBatchId: 'batch-141',
    batchSlug: 'ag43-141-reserve-methodology-core',
    sourceId: 'ag43-reserve-methodology-core',
    filename: 'AG 43 - CARVM for Variable Annuities.pdf',
    sourceTitle: 'AG 43 - CARVM for Variable Annuities',
    sourceReference: 'Actuarial Guideline XLIII',
    batchTitle: 'reserve methodology continuation and effective-date slice',
    pageWindow: [6, 9],
    sectionReference:
      'AG 43 pages 6-9: reserve methodology continuation, aggregate reserve description, alternative methodology summary, and effective-date language.',
    citationText:
      'The Aggregate Reserve for contracts falling within the scope of the Guideline shall equal the Conditional Tail Expectation Amount but not less than the Standard Scenario Amount.',
    summary:
      'AG 43 continues the reserve-methodology framework, including the aggregate-reserve floor, standard scenario link, and effective-date language.',
    keywords: [
      'AG 43',
      'reserve methodology',
      'aggregate reserve',
      'standard scenario amount',
      'conditional tail expectation',
      'effective date',
      'variable annuities',
    ],
    notes:
      'Reserve-methodology continuation window; the text layer is noisy / encoded, so the page image should remain the wording backstop.',
    sourceNotes: 'Active guidance; AG 44 remains out of scope.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop', 'reserve_methodology', 'effective_date_caveat'],
    reviewPacketNotes: 'Reserve-methodology continuation slice remains review-only.',
    reviewPacketIssueCount: 3,
    nextStep:
      'Confirm the methodology opener and effective-date language before moving to Appendix 1.',
    flagType: 'reserve_method_caveat',
    flagMessage:
      'The reserve-methodology continuation and effective-date language should remain review-only until the page image is confirmed.',
    topicIssueType: 'methodology_boundary',
    topicIssueDetails:
      'The reserve-methodology continuation should stay separate from Appendix 1 CTE and reinsurance material.',
    topicRecommendedAction:
      'Keep the page 6-9 slice review-only and do not widen it into Appendix 1.',
    topicIssueMessage:
      'The methodology continuation should not absorb the Appendix 1 projection mechanics.',
    topicIssueEvidence:
      'Pages 6-9 include the aggregate reserve description, the standard scenario linkage, and the effective-date language.',
    topicValidationDetails:
      'The selected pages capture the reserve-methodology continuation and effective-date slice.',
  },
  {
    plannedBatchId: 'batch-142',
    batchSlug: 'ag43-142-cte-reinsurance-reporting',
    sourceId: 'ag43-cte-reinsurance-reporting',
    filename: 'AG 43 - CARVM for Variable Annuities.pdf',
    sourceTitle: 'AG 43 - CARVM for Variable Annuities',
    sourceReference: 'Actuarial Guideline XLIII',
    batchTitle: 'CTE, reinsurance, and statutory reporting slice',
    pageWindow: [10, 19],
    sectionReference:
      'AG 43 pages 10-19: Appendix 1 CTE guidance, Appendix 2 reinsurance and statutory reporting issues, and memorandum / certification cross-references.',
    citationText:
      'The projection of Accumulated Deficiencies shall be made ignoring Federal Income Tax and reflect the dynamics of the expected cash flows for the entire group of contracts.',
    summary:
      'AG 43 Appendix 1 and Appendix 2 explain the projection basis for the CTE amount and the reinsurance / reporting issues that follow from the reserve calculation.',
    keywords: [
      'AG 43',
      'appendix 1',
      'conditional tail expectation',
      'reinsurance',
      'statutory reporting',
      'actuarial memorandum',
      'projection',
    ],
    notes:
      'CTE and reinsurance/reporting window; the text layer is noisy / encoded, so the page image should remain the wording backstop.',
    sourceNotes: 'Active guidance; AG 44 remains out of scope.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop', 'cte_projection', 'reinsurance_reporting'],
    reviewPacketNotes: 'CTE, reinsurance, and reporting slice remains review-only.',
    reviewPacketIssueCount: 4,
    nextStep:
      'Confirm the CTE projection wording and the reinsurance / reporting boundary before Appendix 3.',
    flagType: 'reinsurance_reporting_caveat',
    flagMessage:
      'The CTE projection, reinsurance, and statutory reporting language should remain review-only until the page image is confirmed.',
    topicIssueType: 'reinsurance_reporting_boundary',
    topicIssueDetails:
      'The Appendix 1 and Appendix 2 slice should stay separate from Appendix 3 standard scenario requirements.',
    topicRecommendedAction:
      'Keep the page 10-19 slice review-only and do not widen it into Appendix 3.',
    topicIssueMessage:
      'The CTE projection and reinsurance/reporting language should not absorb the standard scenario appendix.',
    topicIssueEvidence:
      'Pages 10-19 include Appendix 1 CTE projection language and Appendix 2 reinsurance / statutory reporting issues.',
    topicValidationDetails:
      'The selected pages capture the CTE, reinsurance, and reporting slice.',
  },
  {
    plannedBatchId: 'batch-143',
    batchSlug: 'ag43-143-standard-scenario',
    sourceId: 'ag43-standard-scenario',
    filename: 'AG 43 - CARVM for Variable Annuities.pdf',
    sourceTitle: 'AG 43 - CARVM for Variable Annuities',
    sourceReference: 'Actuarial Guideline XLIII',
    batchTitle: 'standard scenario requirements slice',
    pageWindow: [20, 28],
    sectionReference:
      'AG 43 pages 20-28: Appendix 3 standard scenario requirements, projection requirements, and reporting instructions.',
    citationText:
      'A Standard Scenario Reserve shall be determined for each of the contracts falling under the scope of the Guideline by applying section A3.3.',
    summary:
      'AG 43 Appendix 3 sets out the standard scenario requirements and reporting items that sit between the CTE material and the later alternative methodology.',
    keywords: [
      'AG 43',
      'appendix 3',
      'standard scenario',
      'scenario requirements',
      'projection requirements',
      'reporting',
      'variable annuities',
    ],
    notes:
      'Standard-scenario window; the text layer is noisy / encoded, so the page image should remain the wording backstop.',
    sourceNotes: 'Active guidance; AG 44 remains out of scope.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop', 'standard_scenario', 'scenario_requirement'],
    reviewPacketNotes: 'Standard scenario slice remains review-only.',
    reviewPacketIssueCount: 3,
    nextStep:
      'Confirm the standard scenario requirements before moving to the alternative-methodology and calibration appendix.',
    flagType: 'scenario_requirement_caveat',
    flagMessage:
      'The standard scenario requirements should remain review-only until the page image is confirmed.',
    topicIssueType: 'scenario_boundary',
    topicIssueDetails:
      'The standard-scenario material should stay separate from the alternative-methodology appendix.',
    topicRecommendedAction:
      'Keep the page 20-28 slice review-only and do not widen it into Appendix 4.',
    topicIssueMessage:
      'The standard scenario requirements should not absorb alternative-methodology material.',
    topicIssueEvidence:
      'Pages 20-28 contain Appendix 3 standard scenario requirements and reporting instructions.',
    topicValidationDetails:
      'The selected pages capture the standard scenario requirements slice.',
  },
  {
    plannedBatchId: 'batch-144',
    batchSlug: 'ag43-144-alternative-methodology-calibration',
    sourceId: 'ag43-alternative-methodology-and-calibration',
    filename: 'AG 43 - CARVM for Variable Annuities.pdf',
    sourceTitle: 'AG 43 - CARVM for Variable Annuities',
    sourceReference: 'Actuarial Guideline XLIII',
    batchTitle: 'alternative methodology and calibration slice',
    pageWindow: [29, 43],
    sectionReference:
      'AG 43 pages 29-43: Appendix 4 alternative methodology and Appendix 5 scenario calibration criteria.',
    citationText:
      'For variable deferred annuity contracts that either contain no guaranteed benefits or only GMDBs, the Conditional Tail Expectation Amount may be determined by using the method outlined below rather than by using the approach described in Section IV.D.',
    summary:
      'AG 43 Appendix 4 and Appendix 5 cover the alternative methodology and the scenario calibration criteria that govern the more calibration-heavy mechanics.',
    keywords: [
      'AG 43',
      'appendix 4',
      'appendix 5',
      'alternative methodology',
      'scenario calibration',
      'GMDB',
      'variable deferred annuity',
    ],
    notes:
      'Alternative-methodology / calibration window; the text layer is noisy / encoded, so the page image should remain the wording backstop.',
    sourceNotes: 'Active guidance; AG 44 remains out of scope.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop', 'alternative_methodology', 'calibration'],
    reviewPacketNotes: 'Alternative methodology and calibration slice remains review-only.',
    reviewPacketIssueCount: 4,
    nextStep:
      'Confirm the alternative-methodology and calibration wording before moving to aggregate-reserve allocation.',
    flagType: 'calibration_caveat',
    flagMessage:
      'The alternative-methodology and scenario-calibration language should remain review-only until the page image is confirmed.',
    topicIssueType: 'calibration_boundary',
    topicIssueDetails:
      'The alternative-methodology and calibration material should stay separate from aggregate-reserve allocation.',
    topicRecommendedAction:
      'Keep the page 29-43 slice review-only and do not widen it into Appendix 6.',
    topicIssueMessage:
      'The calibration-heavy material should not absorb the allocation appendix.',
    topicIssueEvidence:
      'Pages 29-43 contain Appendix 4 alternative methodology and Appendix 5 scenario calibration criteria.',
    topicValidationDetails:
      'The selected pages capture the alternative-methodology and calibration slice.',
  },
  {
    plannedBatchId: 'batch-145',
    batchSlug: 'ag43-145-allocation-aggregation',
    sourceId: 'ag43-allocation-and-aggregation',
    filename: 'AG 43 - CARVM for Variable Annuities.pdf',
    sourceTitle: 'AG 43 - CARVM for Variable Annuities',
    sourceReference: 'Actuarial Guideline XLIII',
    batchTitle: 'allocation of aggregate reserves to the contract level slice',
    pageWindow: [44, 50],
    sectionReference:
      'AG 43 pages 44-50: Appendix 6 allocation of the aggregate reserves to the contract level and example allocation language.',
    citationText:
      'The Aggregate Reserve shall be allocated to the contracts falling within the scope of the Guideline using the method outlined in Appendix 6.',
    summary:
      'AG 43 Appendix 6 isolates the allocation of aggregate reserves to the contract level without pulling in the later hedge and certification requirements.',
    keywords: [
      'AG 43',
      'appendix 6',
      'aggregate reserve',
      'allocation',
      'contract level',
      'reserve method',
    ],
    notes:
      'Aggregate-reserve allocation window; the text layer is noisy / encoded, so the page image should remain the wording backstop.',
    sourceNotes: 'Active guidance; AG 44 remains out of scope.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop', 'allocation', 'aggregation'],
    reviewPacketNotes: 'Aggregate-reserve allocation slice remains review-only.',
    reviewPacketIssueCount: 3,
    nextStep:
      'Confirm the allocation mechanics before moving to the hedge modeling and certification appendices.',
    flagType: 'allocation_caveat',
    flagMessage:
      'The aggregate-reserve allocation language should remain review-only until the page image is confirmed.',
    topicIssueType: 'allocation_boundary',
    topicIssueDetails:
      'The allocation language should stay separate from the hedge modeling and certification appendices.',
    topicRecommendedAction:
      'Keep the page 44-50 slice review-only and do not widen it into Appendix 7.',
    topicIssueMessage:
      'The allocation appendix should not absorb hedge or certification material.',
    topicIssueEvidence:
      'Pages 44-50 contain Appendix 6 allocation of aggregate reserves to the contract level.',
    topicValidationDetails:
      'The selected pages capture the aggregate-reserve allocation slice.',
  },
  {
    plannedBatchId: 'batch-146',
    batchSlug: 'ag43-146-hedges-certification',
    sourceId: 'ag43-hedges-and-certification',
    filename: 'AG 43 - CARVM for Variable Annuities.pdf',
    sourceTitle: 'AG 43 - CARVM for Variable Annuities',
    sourceReference: 'Actuarial Guideline XLIII',
    batchTitle: 'hedge modeling and certification slice',
    pageWindow: [51, 58],
    sectionReference:
      'AG 43 pages 51-58: Appendix 7 modeling of hedges and Appendix 8 certification requirements.',
    citationText:
      'The appropriate costs and benefits of hedging instruments that are currently held by the company in support of the contracts falling under the scope of the Guideline shall be included in the calculation of the Conditional Tail Expectation Amount.',
    summary:
      'AG 43 Appendix 7 and Appendix 8 cover hedge modeling and certification requirements, keeping the hedge-risk treatment separate from the later behavior and mortality guidance.',
    keywords: [
      'AG 43',
      'appendix 7',
      'appendix 8',
      'hedges',
      'certification',
      'risk mitigation',
      'documentation',
    ],
    notes:
      'Hedge-modeling / certification window; the text layer is noisy / encoded, so the page image should remain the wording backstop.',
    sourceNotes: 'Active guidance; AG 44 remains out of scope.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop', 'hedging', 'certification'],
    reviewPacketNotes: 'Hedge modeling and certification slice remains review-only.',
    reviewPacketIssueCount: 4,
    nextStep:
      'Confirm the hedge-modeling and certification wording before moving to contractholder behavior and mortality assumptions.',
    flagType: 'hedging_caveat',
    flagMessage:
      'The hedge-modeling and certification language should remain review-only until the page image is confirmed.',
    topicIssueType: 'hedge_boundary',
    topicIssueDetails:
      'The hedge-modeling and certification material should stay separate from contractholder behavior and mortality.',
    topicRecommendedAction:
      'Keep the page 51-58 slice review-only and do not widen it into Appendix 9.',
    topicIssueMessage:
      'The hedge and certification appendices should not absorb behavior or mortality guidance.',
    topicIssueEvidence:
      'Pages 51-58 contain Appendix 7 modeling of hedges and Appendix 8 certification requirements.',
    topicValidationDetails:
      'The selected pages capture the hedge modeling and certification slice.',
  },
  {
    plannedBatchId: 'batch-147',
    batchSlug: 'ag43-147-behavior-mortality',
    sourceId: 'ag43-behavior-and-mortality',
    filename: 'AG 43 - CARVM for Variable Annuities.pdf',
    sourceTitle: 'AG 43 - CARVM for Variable Annuities',
    sourceReference: 'Actuarial Guideline XLIII',
    batchTitle: 'contractholder behavior and mortality guidance slice',
    pageWindow: [59, 67],
    sectionReference:
      'AG 43 pages 59-67: Appendix 9 contractholder behavior and Appendix 10 prudent-estimate mortality guidance opener.',
    citationText:
      'Contractholder behavior assumptions encompass actions such as lapses, withdrawals, transfers, recurring deposits, benefit utilization, option election, etc.',
    summary:
      'AG 43 Appendix 9 and the opening of Appendix 10 cover contractholder behavior and prudent-estimate mortality guidance, staying in the assumption layer before the mortality tables.',
    keywords: [
      'AG 43',
      'appendix 9',
      'contractholder behavior',
      'mortality',
      'prudent estimate',
      'assumptions',
      'credibility',
    ],
    notes:
      'Behavior / mortality opening window; the text layer is noisy / encoded, so the page image should remain the wording backstop.',
    sourceNotes: 'Active guidance; AG 44 remains out of scope.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop', 'behavior_assumption', 'mortality_assumption'],
    reviewPacketNotes: 'Behavior and mortality slice remains review-only.',
    reviewPacketIssueCount: 4,
    nextStep:
      'Confirm the behavior and mortality assumption wording before moving to the mortality-table tail and AG 44 boundary.',
    flagType: 'behavior_mortality_caveat',
    flagMessage:
      'The contractholder behavior and mortality guidance should remain review-only until the page image is confirmed.',
    topicIssueType: 'behavior_mortality_boundary',
    topicIssueDetails:
      'The behavior and mortality material should stay separate from the mortality-table and closing-boundary pages.',
    topicRecommendedAction:
      'Keep the page 59-67 slice review-only and do not widen it into Appendix 10 table material.',
    topicIssueMessage:
      'The behavior guidance should not absorb the mortality tables or closing boundary.',
    topicIssueEvidence:
      'Pages 59-67 contain Appendix 9 contractholder behavior and the Appendix 10 mortality guidance opener.',
    topicValidationDetails:
      'The selected pages capture the contractholder behavior and mortality guidance slice.',
  },
  {
    plannedBatchId: 'batch-148',
    batchSlug: 'ag43-148-mortality-table-closing-boundary',
    sourceId: 'ag43-mortality-table-and-closing-boundary',
    filename: 'AG 43 - CARVM for Variable Annuities.pdf',
    sourceTitle: 'AG 43 - CARVM for Variable Annuities',
    sourceReference: 'Actuarial Guideline XLIII',
    batchTitle: 'mortality table and closing boundary slice',
    pageWindow: [68, 71],
    sectionReference:
      'AG 43 pages 68-71: Appendix 10 mortality-table continuation, Appendix 11 mortality table material, and the closing AG 44 boundary.',
    citationText:
      'The 1994 Variable Annuity MGDB Mortality Table is shown in Appendix 11.',
    summary:
      'AG 43 closes with the Appendix 10 continuation, the Appendix 11 mortality table material, and the clean boundary before AG 44.',
    keywords: [
      'AG 43',
      'appendix 10',
      'appendix 11',
      'mortality table',
      'closing boundary',
      'AG 44',
      'variable annuity',
    ],
    notes:
      'Mortality-table / closing-boundary window; the text layer is noisy / encoded, so the page image should remain the wording backstop.',
    sourceNotes: 'Active guidance; AG 44 remains out of scope.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop', 'mortality_table', 'closing_boundary'],
    reviewPacketNotes: 'Mortality table and closing boundary slice remains review-only.',
    reviewPacketIssueCount: 4,
    nextStep:
      'Confirm the mortality-table wording and stop cleanly at the AG 44 boundary.',
    flagType: 'mortality_boundary_caveat',
    flagMessage:
      'The mortality-table material and closing boundary should remain review-only until the page image is confirmed.',
    topicIssueType: 'closing_boundary',
    topicIssueDetails:
      'The mortality-table material should stop cleanly before AG 44 begins.',
    topicRecommendedAction:
      'Keep the page 68-71 slice review-only and do not widen it beyond the AG 44 boundary.',
    topicIssueMessage:
      'The mortality-table tail should not bleed into AG 44.',
    topicIssueEvidence:
      'Pages 68-71 contain the mortality table continuation and the closing boundary before AG 44.',
    topicValidationDetails:
      'The selected pages capture the mortality-table tail and closing boundary slice.',
  },
]

export const ag43BatchDefinitions = Object.fromEntries(
  ag43BatchSpecs.map((spec) => [spec.plannedBatchId, makeAg43Batch(spec)]),
)
