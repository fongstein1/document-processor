const rawSourceFile = 'pbr_data_valuation_manual_2026.pdf'
const sourceFamilyId = 'valuation_manual_pdfs'
const sourceTitle = 'Valuation Manual'
const sourceReference = '2026 NAIC Valuation Manual'
const defaultNonLearnerNotes =
  'Controlled VM-22 slice retained as review-only until the wave is explicitly expanded.'

const makeVm22Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`
  return {
    batchName: `Controlled VM-22 batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'vm22_controlled',
    processingIntentText:
      spec.processingIntentText ??
      `Capture ${spec.batchTitle} as a review-only VM-22 slice so the chapter boundary stays narrow and reviewable.`,
    processingIntentNotes:
      'Controlled VM-22 workflow proof only. This batch stays review-only, source-bound, and excluded from learner-facing or app-ready outputs.',
    batchSummaryText: `Batch ${spec.plannedBatchId} remains review-only. ${spec.summaryLead} stays unpromoted.`,
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This controlled VM-22 batch is intentionally limited to ${spec.batchTitle} and is retained for review-only analysis.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small controlled VM-22 batch only. Keep the work review-first, preserve source-bound locators, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: spec.flagSeverity ?? 'medium',
        sourceId,
        itemId,
        flagType: spec.flagType,
        message: spec.flagMessage,
        notes: 'Keep review-only and do not promote.',
      },
    ],
    reviewPacketCitationIssues: [
      {
        issueId: `citation-${sourceId}`,
        sourceId,
        itemId,
        issueType: spec.citationIssueType ?? 'boundary_control_window',
        details: spec.citationDetails,
        recommendedAction: spec.citationAction,
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: `decision-${sourceId}`,
        decisionType: spec.decisionType,
        question: spec.decisionQuestion,
        whyItMatters: spec.decisionWhy,
        recommendedOwner: spec.recommendedOwner ?? 'source reviewer',
        priority: spec.decisionPriority ?? 'medium',
      },
    ],
    unresolvedIssues: [
      {
        issueId: `issue-${sourceId}`,
        severity: spec.issueSeverity ?? 'medium',
        issueType: spec.issueType,
        sourceId,
        itemId,
        message: spec.issueMessage,
        recommendedAction: spec.issueAction,
        evidence: spec.issueEvidence,
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
        details: 'The selected pages carry a source reference and a page locator.',
      },
      {
        checkId: 'unresolved-issues-tracked',
        status: 'passed',
        details: 'The review packet and unresolved-issues summary both capture the open review items.',
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
        documentType: 'valuation_manual_section',
        sourceTitle,
        sourceReference,
        versionDate: null,
        pageWindow: spec.pageWindow,
        sectionReference: spec.sectionReference,
        citationText: spec.citationText,
        confidence: 'high',
        reviewFlags: ['core_vm_course', ...spec.reviewFlags],
        reviewStatus: spec.reviewStatus ?? 'needs_human_review',
        itemKind: spec.itemKind ?? 'review_note',
        notes: spec.notes,
        summary: spec.summary,
        keywords: spec.keywords,
        sourceNotes: spec.sourceNotes,
        artifactProcessingStatus: 'inventoried',
        inventoryProcessingStatus: 'inventoried',
        authorityLevel: spec.authorityLevel ?? 'core_manual_section',
        reviewPacketNotes: spec.reviewPacketNotes,
        reviewPacketIssueCount: 1,
        reviewPacketProcessingStatus: 'inventoried',
        nonLearnerFacingNotes: spec.nonLearnerFacingNotes ?? defaultNonLearnerNotes,
      },
    ],
  }
}

const vm22BatchSpecs = [
  {
    plannedBatchId: 'batch-038',
    batchSlug: 'vm22-038-background-scope',
    sourceId: 'vm22-background-scope',
    batchTitle: 'VM-22 background, risks, and scope',
    summaryLead:
      'VM-22 background, risks, and scope establish the chapter frame and preserve the early applicability rules as review-only',
    pageWindow: [227, 231],
    sectionReference: 'VM-22: Background and Scope',
    citationText: 'VM-22: Requirements for Principle-Based Reserves For Non-Variable Annuities',
    summary:
      'VM-22 introduces the chapter, explains the risk categories reflected and not reflected in the reserve calculation, and closes the slice at the scope / effective-date boundary.',
    keywords: ['VM-22', 'background', 'scope', 'effective date', 'risk categories', 'chapter frame'],
    notes: 'VM-22 background and scope slice retained as a review-only controlled batch.',
    sourceNotes: 'Pages 227-231 only; background, risk, and scope slice.',
    reviewFlags: ['background_content', 'regulatory_requirement', 'cross_reference_mapping', 'boundary_control_window'],
    flagType: 'background_slice',
    flagMessage:
      'The VM-22 background and scope slice establishes the chapter frame and should remain review-only until the mechanics sections are captured.',
    citationDetails:
      'The chapter begins on page 227 and the background, risk, and scope material stays narrow enough for exception-first review.',
    citationAction: 'Keep the VM-22 background and scope material review-only and do not treat it as the operational projection text.',
    decisionType: 'scope_split',
    decisionQuestion:
      'Should the VM-22 background and scope stay as one review-only slice, or should the scope language be split again before the reserve-methodology batch?',
    decisionWhy: 'The chapter frame should stay narrow until the reserve-methodology batch is captured.',
    issueType: 'cross_reference_mapping',
    issueMessage:
      'The background slice points into later reserve, hedging, and assumption sections, so it should stay review-only until the operational text is captured.',
    issueAction: 'Keep the background slice out of learner-facing output until later VM-22 sections are available.',
    issueEvidence: 'Pages 227-231 cover the chapter background, risk categories, and scope / effective-date language.',
    validationCheckId: 'vm22-background-scope-coverage',
    validationCheckDetails: 'The selected pages capture the VM-22 background, risk, and scope slice.',
    nextStep: 'Confirm whether batch-039 should start directly at the reserve-methodology opener on page 232.',
  },
  {
    plannedBatchId: 'batch-039',
    batchSlug: 'vm22-039-reserve-methodology',
    sourceId: 'vm22-reserve-methodology',
    batchTitle: 'VM-22 reserve methodology',
    summaryLead:
      'VM-22 reserve methodology defines the aggregate reserve structure, the reinsurance basis, and the additional standard projection amount boundary',
    pageWindow: [232, 237],
    sectionReference: 'VM-22: Reserve Methodology',
    citationText: 'The aggregate reserve for contracts falling within the scope of these requirements shall equal the SR...',
    summary:
      'VM-22 defines the aggregate reserve structure, states how reinsurance and the additional standard projection amount fit into that structure, and keeps the three-month timing limit as review-only boundary context.',
    keywords: ['VM-22', 'reserve methodology', 'aggregate reserve', 'additional standard projection amount', 'boundary'],
    notes: 'VM-22 reserve-method slice retained as a review-only controlled batch.',
    sourceNotes: 'Pages 232-237 only; reserve methodology and boundary slice.',
    reviewFlags: ['reserve_method_structure', 'calculation_structure', 'cross_reference_mapping', 'boundary_control_window'],
    flagType: 'reserve_method_structure',
    flagMessage:
      'The reserve methodology slice establishes the aggregate reserve structure and should remain review-only until the later projection mechanics are added.',
    citationDetails:
      'The section introduces the aggregate reserve structure and the timing limit without completing the later detail blocks.',
    citationAction: 'Keep the reserve methodology slice review-only and preserve the boundary to the later mechanics.',
    decisionType: 'scope_split',
    decisionQuestion:
      'Should the aggregate-reserve language stay grouped with the reinsurance and timing boundary text, or should the next batch split them apart?',
    decisionWhy: 'The reserve-method structure should stay narrow enough to review without absorbing later mechanics.',
    issueType: 'reserve_method_structure',
    issueMessage:
      'The reserve methodology slice contains the chapter-level aggregate reserve rule and timing limit, which should stay review-only.',
    issueAction: 'Keep the reserve-method structure separate from later Section 4 mechanics.',
    issueEvidence: 'Pages 232-237 introduce the aggregate reserve structure and the three-month timing boundary.',
    validationCheckId: 'vm22-reserve-methodology-coverage',
    validationCheckDetails: 'The selected pages capture the VM-22 reserve methodology slice.',
    nextStep: 'Confirm whether batch-040 should begin at the Section 4 projection opener on page 238.',
  },
  {
    plannedBatchId: 'batch-040',
    batchSlug: 'vm22-040-projection-entry',
    sourceId: 'vm22-projection-entry',
    batchTitle: 'VM-22 Section 4 projection entry',
    summaryLead:
      'VM-22 Section 4 opens the accumulated-deficiency projection and the initial cash-flow setup for the reserve calculation',
    pageWindow: [238, 242],
    sectionReference: 'VM-22: Determination of the DR and SR (projection entry)',
    citationText: 'The projection of accumulated deficiencies shall be made ignoring federal income tax in both cash flows and discount rates.',
    summary:
      'VM-22 starts the Section 4 projection mechanics by defining accumulated deficiencies, starting cash flows, discount-rate treatment, and the initial liability / asset setup.',
    keywords: ['VM-22', 'projection', 'accumulated deficiencies', 'starting assets', 'cash flows', 'discount rates'],
    notes: 'VM-22 projection-entry slice retained as a review-only controlled batch.',
    sourceNotes: 'Pages 238-242 only; projection-entry slice.',
    reviewFlags: ['calculation_structure', 'formula_context', 'cross_reference_mapping', 'requires_human_interpretation'],
    flagType: 'calculation_structure',
    flagMessage:
      'The projection entry is formula-heavy and should remain review-only until the later asset mechanics are captured.',
    citationDetails:
      'The projection rules introduce the accumulation mechanics and the cash-flow directions without completing the later asset and iteration details.',
    citationAction: 'Keep the projection entry review-only and preserve the formula context for later batches.',
    decisionType: 'scope_split',
    decisionQuestion:
      'Should the projection entry stay grouped with the cash-flow setup, or should the asset and discount-rate context be split later?',
    decisionWhy: 'The projection layer should remain narrow enough to separate calculation structure from the later asset mechanics.',
    issueType: 'calculation_structure',
    issueMessage:
      'The Section 4 projection entry contains the first mechanics layer and depends on later asset treatment, so it should stay review-only.',
    issueAction: 'Keep the projection mechanics separate from the later asset and iteration batch.',
    issueEvidence: 'Pages 238-242 cover the projection of accumulated deficiencies and the initial cash-flow setup.',
    validationCheckId: 'vm22-projection-entry-coverage',
    validationCheckDetails: 'The selected pages capture the VM-22 Section 4 projection-entry slice.',
    nextStep: 'Confirm whether batch-041 should begin at the asset-projection pages on 243.',
  },
  {
    plannedBatchId: 'batch-041',
    batchSlug: 'vm22-041-asset-projection',
    sourceId: 'vm22-asset-projection',
    batchTitle: 'VM-22 Section 4 asset projection and NAER',
    summaryLead:
      'VM-22 adds the additional invested asset portfolio, NAER, borrowing, and annuitization context to the Section 4 mechanics',
    pageWindow: [243, 247],
    sectionReference: 'VM-22: Determination of the DR and SR (asset projection and NAER)',
    citationText: 'To determine the NAER on additional invested assets for a given scenario...',
    summary:
      'VM-22 continues the Section 4 mechanics with the additional invested asset portfolio, the NAER calculation, reinvestment behavior, and annuitization assumptions.',
    keywords: ['VM-22', 'NAER', 'asset projection', 'annuitization', 'borrowing', 'reinvestment'],
    notes: 'VM-22 asset-projection slice retained as a review-only controlled batch.',
    sourceNotes: 'Pages 243-247 only; asset-projection and NAER slice.',
    reviewFlags: ['asset_modeling_judgment', 'formula_context', 'requires_human_interpretation', 'cross_reference_mapping'],
    flagType: 'asset_modeling_judgment',
    flagMessage:
      'The asset and iteration mechanics depend on asset choices, borrowing, and annuitization judgments, so they should remain review-only.',
    citationDetails:
      'The pages add the asset portfolio and iteration mechanics without separating them from the annuitization and borrowing context.',
    citationAction: 'Keep the Section 4 asset and iteration slice review-only and do not promote it separately from the projection entry.',
    decisionType: 'scope_split',
    decisionQuestion:
      'Should the NAER / asset-projection material stay grouped with the annuitization context, or should any part be split into another batch?',
    decisionWhy: 'The asset and iteration layer is broad enough that the reviewer may want a later split before any promotion discussion.',
    issueType: 'asset_modeling_judgment',
    issueMessage:
      'The Section 4 mechanics at this point include asset and annuitization judgments that require human review before any promotion can be considered.',
    issueAction: 'Keep the asset and iteration mechanics out of learner-facing output.',
    issueEvidence: 'Pages 243-247 cover NAER, borrowing, annuitization, and the additional invested asset portfolio.',
    validationCheckId: 'vm22-asset-projection-coverage',
    validationCheckDetails: 'The selected pages capture the VM-22 Section 4 asset-projection slice.',
    nextStep: 'Confirm whether batch-042 should begin at the reinsurance opener on page 248.',
  },
  {
    plannedBatchId: 'batch-042',
    batchSlug: 'vm22-042-reinsurance',
    sourceId: 'vm22-reinsurance',
    batchTitle: 'VM-22 reinsurance',
    summaryLead:
      'VM-22 reinsurance defines the ceded and pre-ceded reserve treatment before the Section 6 standard projection amount begins',
    pageWindow: [248, 250],
    sectionReference: 'VM-22: Reinsurance',
    citationText: 'In order to determine the aggregate reserve post-reinsurance ceded, accumulated deficiencies, scenario reserves, and the resulting DR and/or SR shall be determined reflecting the effects of reinsurance treaties...',
    summary:
      'VM-22 explains how reinsurance affects the aggregate reserve, the ceded cash flows, and the pre-reinsurance versus post-reinsurance reserve view.',
    keywords: ['VM-22', 'reinsurance', 'ceded cash flows', 'post-reinsurance', 'pre-reinsurance'],
    notes: 'VM-22 reinsurance slice retained as a review-only controlled batch.',
    sourceNotes: 'Pages 248-250 only; reinsurance slice.',
    reviewFlags: ['reinsurance', 'cross_reference_mapping', 'requires_human_interpretation'],
    flagType: 'reinsurance_slice',
    flagMessage:
      'The reinsurance treatment is intentionally isolated and should remain review-only until the downstream projection treatment is captured.',
    citationDetails:
      'The reinsurance text immediately affects the aggregate reserve, so the boundary should remain visible in review.',
    citationAction: 'Keep the reinsurance slice separate from the later standard-projection details.',
    decisionType: 'scope_split',
    decisionQuestion:
      'Should the reinsurance treatment remain grouped with the ceded-cash-flow language, or should the next batch separate the reserve adjustment details further?',
    decisionWhy: 'The reinsurance treatment and the later projection mechanics should stay reviewable without becoming a single broad slice.',
    issueType: 'reinsurance',
    issueMessage:
      'The reinsurance language depends on assumptions and should stay review-only until a human confirms the treatment.',
    issueAction: 'Keep the reinsurance language out of learner-facing output until the boundary is confirmed.',
    issueEvidence: 'Pages 248-250 cover the ceded cash-flow treatment and the pre-/post-reinsurance reserve view.',
    validationCheckId: 'vm22-reinsurance-coverage',
    validationCheckDetails: 'The selected pages capture the VM-22 reinsurance slice.',
    nextStep: 'Confirm whether batch-043 should begin at the Section 6 opener on page 251.',
  },
  {
    plannedBatchId: 'batch-043',
    batchSlug: 'vm22-043-standard-projection-overview',
    sourceId: 'vm22-standard-projection-overview',
    batchTitle: 'VM-22 standard projection amount overview',
    summaryLead:
      'VM-22 Section 6 opens the standard projection amount with the CTEPA overview and the aggregation framing',
    pageWindow: [251, 253],
    sectionReference: 'VM-22: Requirements for the Standard Projection Amount (overview)',
    citationText: 'The company shall determine the Prescribed Projections Amount by following the CTEPA Method below.',
    summary:
      'VM-22 introduces the standard projection amount, explains the CTEPA framework, and keeps the aggregation and reduction language as review-only boundary context.',
    keywords: ['VM-22', 'CTEPA', 'standard projection amount', 'aggregation', 'DR', 'SR'],
    notes: 'VM-22 standard-projection overview slice retained as a review-only controlled batch.',
    sourceNotes: 'Pages 251-253 only; CTEPA overview and boundary slice.',
    reviewFlags: ['calculation_structure', 'formula_context', 'cross_reference_mapping'],
    flagType: 'calculation_structure',
    flagMessage:
      'The CTEPA overview is calculation-heavy and should remain review-only until the contract mechanics are added.',
    citationDetails:
      'The section introduces the standard projection framework and the aggregation effect without completing the later mechanics.',
    citationAction: 'Keep the CTEPA overview review-only and do not collapse it into the later contract-specific rules.',
    decisionType: 'scope_split',
    decisionQuestion:
      'Should the standard-projection overview stay grouped with the reduction framing, or should the next batch split the details further?',
    decisionWhy: 'The Section 6 overview should stay narrow enough to review without absorbing the contract mechanics.',
    issueType: 'calculation_structure',
    issueMessage:
      'The overview slice contains the chapter-level standard projection amount rule and should stay review-only.',
    issueAction: 'Keep the standard-projection overview separate from later contract mechanics.',
    issueEvidence: 'Pages 251-253 introduce the CTEPA framework and the aggregation framing.',
    validationCheckId: 'vm22-standard-projection-overview-coverage',
    validationCheckDetails: 'The selected pages capture the VM-22 standard-projection overview slice.',
    nextStep: 'Confirm whether batch-044 should begin at the GAPV and partial-withdrawal pages on 254.',
  },
  {
    plannedBatchId: 'batch-044',
    batchSlug: 'vm22-044-standard-projection-contract-mechanics',
    sourceId: 'vm22-standard-projection-contract-mechanics',
    batchTitle: 'VM-22 standard projection contract mechanics',
    summaryLead:
      'VM-22 adds GAPV, partial withdrawals, and the contract-type mechanics used by the additional projection amount',
    pageWindow: [254, 257],
    sectionReference: 'VM-22: Requirements for the Standard Projection Amount (contract mechanics)',
    citationText: 'The Guarantee Actuarial Present Value (GAPV) is used in the determination of the full surrender rates...',
    summary:
      'VM-22 continues Section 6 with GAPV, partial withdrawals, and the contract-type mechanics used to project the standard amount.',
    keywords: ['VM-22', 'GAPV', 'partial withdrawals', 'contract mechanics', 'surrender rates'],
    notes: 'VM-22 standard-projection contract-mechanics slice retained as a review-only controlled batch.',
    sourceNotes: 'Pages 254-257 only; contract mechanics slice.',
    reviewFlags: ['prescribed_assumption', 'company_or_prudent_estimate_assumption', 'reinsurance', 'requires_human_interpretation'],
    flagType: 'contract_mechanics_slice',
    flagMessage:
      'The contract mechanics rely on assumptions and should remain review-only until the later table-heavy pages are captured.',
    citationDetails:
      'The pages introduce GAPV, partial withdrawals, and contract-type mechanics without separating them from later table references.',
    citationAction: 'Keep the contract mechanics review-only and preserve the boundary to the later lapse / mortality tables.',
    decisionType: 'scope_split',
    decisionQuestion:
      'Should the GAPV and partial-withdrawal language stay grouped with the contract-type mechanics, or should the next batch split the contract logic further?',
    decisionWhy: 'The Section 6 contract-mechanics layer should stay narrow enough for exception-first review.',
    issueType: 'company_or_prudent_estimate_assumption',
    issueMessage:
      'The Section 6 contract mechanics use assumption-heavy language and should stay review-only.',
    issueAction: 'Keep the contract mechanics out of learner-facing output.',
    issueEvidence: 'Pages 254-257 cover GAPV, partial withdrawals, and the additional projection mechanics.',
    validationCheckId: 'vm22-standard-projection-contract-mechanics-coverage',
    validationCheckDetails: 'The selected pages capture the VM-22 contract-mechanics slice.',
    nextStep: 'Confirm whether batch-045 should begin at the lapse / rate-factor pages on 258.',
  },
  {
    plannedBatchId: 'batch-045',
    batchSlug: 'vm22-045-standard-projection-lapse-rates',
    sourceId: 'vm22-standard-projection-lapse-rates',
    batchTitle: 'VM-22 standard projection lapse and rate factors',
    summaryLead:
      'VM-22 adds the base lapse rules, MVA and GMIR factors, and the rate-factor tables used in the standard projection amount',
    pageWindow: [258, 261],
    sectionReference: 'VM-22: Requirements for the Standard Projection Amount (lapse and rate factors)',
    citationText: 'Base Lapse = Determined using the following tables:',
    summary:
      'VM-22 continues Section 6 with base lapse rules, MVA and GMIR factors, and the rate-factor table logic that feeds the projection amount.',
    keywords: ['VM-22', 'lapse', 'MVA', 'GMIR', 'rate factors', 'tables'],
    notes: 'VM-22 lapse-and-rate-factor slice retained as a review-only controlled batch.',
    sourceNotes: 'Pages 258-261 only; lapse and factor slice.',
    reviewFlags: ['prescribed_assumption', 'formula_context', 'boundary_control_window'],
    flagType: 'lapse_and_factor_slice',
    flagMessage:
      'The lapse and rate-factor material is table-heavy and should remain review-only until the mortality tables are captured.',
    citationDetails:
      'The section introduces the lapse and rate-factor logic without completing the mortality tables that follow.',
    citationAction: 'Keep the lapse and factor material review-only and separate from the mortality tables.',
    decisionType: 'scope_split',
    decisionQuestion:
      'Should the lapse rules stay grouped with the factor tables, or should the next batch isolate any of the factor logic further?',
    decisionWhy: 'The lapse and factor layer should stay narrow enough to review before the mortality pages begin.',
    issueType: 'prescribed_assumption',
    issueMessage:
      'The lapse and rate-factor language is prescribed-assumption material and should stay review-only.',
    issueAction: 'Keep the lapse and rate-factor material out of learner-facing output.',
    issueEvidence: 'Pages 258-261 cover base lapse rules, MVA, GMIR, and the rate-factor tables.',
    validationCheckId: 'vm22-standard-projection-lapse-rates-coverage',
    validationCheckDetails: 'The selected pages capture the VM-22 lapse and rate-factor slice.',
    nextStep: 'Confirm whether batch-046 should begin at the first mortality-table page on 262.',
  },
  {
    plannedBatchId: 'batch-046',
    batchSlug: 'vm22-046-standard-projection-mortality-tables-1',
    sourceId: 'vm22-standard-projection-mortality-tables-1',
    batchTitle: 'VM-22 standard projection mortality tables I',
    summaryLead:
      'VM-22 begins the mortality-table block for the standard projection amount and keeps the structured-settlement formula context nearby',
    pageWindow: [262, 267],
    sectionReference: 'VM-22: Requirements for the Standard Projection Amount (mortality tables I)',
    citationText: 'The mortality rate for a contract holder with age x in year (2012 + n) shall be calculated using the following formula...',
    summary:
      'VM-22 starts the mortality-table block with the individual-annuity mortality guidance and the structured-settlement formula context.',
    keywords: ['VM-22', 'mortality tables', 'structured settlement', 'formula context', 'annuity mortality'],
    notes: 'VM-22 mortality-table slice I retained as a review-only controlled batch.',
    sourceNotes: 'Pages 262-267 only; mortality-table slice I.',
    reviewFlags: ['prescribed_assumption', 'formula_context', 'cross_reference_mapping'],
    flagType: 'mortality_table_slice',
    flagMessage:
      'The first mortality-table block is table-heavy and should remain review-only until the remaining mortality pages are captured.',
    citationDetails:
      'The section introduces mortality rates, age-based factors, and the structured-settlement formula context.',
    citationAction: 'Keep the first mortality-table block review-only and preserve the formula context for the second mortality batch.',
    decisionType: 'scope_split',
    decisionQuestion:
      'Should the first mortality-table block stay grouped with the structured-settlement formula, or should that formula context be split later?',
    decisionWhy: 'The first mortality batch should stay narrow enough to review before the remaining table-heavy pages.',
    issueType: 'formula_context',
    issueMessage:
      'The mortality-table block contains formula-context language that should stay review-only.',
    issueAction: 'Keep the mortality-table material out of learner-facing output.',
    issueEvidence: 'Pages 262-267 cover the individual-annuity mortality guidance and structured-settlement formula context.',
    validationCheckId: 'vm22-standard-projection-mortality-tables-1-coverage',
    validationCheckDetails: 'The selected pages capture the VM-22 mortality-table slice I.',
    nextStep: 'Confirm whether batch-047 should begin at the next mortality-table page on 268.',
  },
  {
    plannedBatchId: 'batch-047',
    batchSlug: 'vm22-047-standard-projection-mortality-tables-2',
    sourceId: 'vm22-standard-projection-mortality-tables-2',
    batchTitle: 'VM-22 standard projection mortality tables II and closing boundary',
    summaryLead:
      'VM-22 finishes the standard projection mortality tables, adds group-annuity guidance, and ends at the Section 7 boundary',
    pageWindow: [268, 279],
    sectionReference: 'VM-22: Requirements for the Standard Projection Amount (mortality tables II and boundary)',
    citationText: 'Group annuities (except for those contracts owned or purchased by retirement plans...) shall use the 1994 GAM Table...',
    summary:
      'VM-22 completes the Section 6 mortality-table block, then closes the section with group-annuity guidance and elective provisions that lead to the Section 7 boundary.',
    keywords: ['VM-22', 'mortality tables', 'group annuities', 'boundary', 'elective provisions'],
    notes: 'VM-22 mortality-table slice II retained as a review-only controlled batch.',
    sourceNotes: 'Pages 268-279 only; mortality-table slice II and boundary.',
    reviewFlags: ['prescribed_assumption', 'formula_context', 'boundary_control_window', 'requires_human_interpretation'],
    flagType: 'mortality_table_slice',
    flagMessage:
      'The remaining mortality tables and group-annuity guidance are boundary-heavy and should remain review-only until Section 7 begins.',
    citationDetails:
      'The section finishes the mortality-table material and then transitions into the Section 7 boundary.',
    citationAction: 'Keep the mortality-table closing slice review-only and preserve the boundary to Section 7.',
    decisionType: 'boundary_confirmation',
    decisionQuestion:
      'Should the mortality tables and group-annuity guidance stay together in one batch, or should the elective-provisions boundary be split again later?',
    decisionWhy: 'The closing Section 6 boundary needs to remain visible so Section 7 stays separate.',
    issueType: 'boundary_control_window',
    issueMessage:
      'The mortality-table and group-annuity material ends right at the Section 7 boundary and should stay review-only.',
    issueAction: 'Keep the Section 6 closing boundary explicit and do not merge Section 7 into this slice.',
    issueEvidence: 'Pages 268-279 cover the remaining mortality tables, group-annuity guidance, and the transition into Section 7.',
    validationCheckId: 'vm22-standard-projection-mortality-tables-2-coverage',
    validationCheckDetails: 'The selected pages capture the VM-22 mortality-table slice II and the closing boundary.',
    nextStep: 'Confirm whether batch-048 should begin at the Section 7 stochastic-exclusion opener on page 280.',
  },
  {
    plannedBatchId: 'batch-048',
    batchSlug: 'vm22-048-stochastic-exclusion',
    sourceId: 'vm22-stochastic-exclusion',
    batchTitle: 'VM-22 stochastic exclusion tests',
    summaryLead:
      'VM-22 Section 7 defines the stochastic exclusion and single scenario testing framework',
    pageWindow: [280, 286],
    sectionReference: 'VM-22: Stochastic Exclusion and Single Scenario Testing',
    citationText: 'The company may elect to exclude one or more groups of contracts from the stochastic reserve calculation...',
    summary:
      'VM-22 begins Section 7 with the stochastic exclusion test, single scenario testing, and the reserve adjustments that determine whether DR or the standard projection amount is used.',
    keywords: ['VM-22', 'stochastic exclusion', 'single scenario testing', 'DR', 'section 7'],
    notes: 'VM-22 stochastic-exclusion slice retained as a review-only controlled batch.',
    sourceNotes: 'Pages 280-286 only; stochastic-exclusion slice.',
    reviewFlags: ['scenario_or_stochastic_requirement', 'formula_context', 'cross_reference_mapping', 'requires_human_interpretation'],
    flagType: 'stochastic_exclusion_slice',
    flagMessage:
      'The stochastic exclusion rules are model-heavy and should remain review-only until scenario generation is captured.',
    citationDetails:
      'The section opens the stochastic exclusion logic and the single-scenario test with material cross-references.',
    citationAction: 'Keep the stochastic exclusion slice review-only and separate from the scenario-generation section.',
    decisionType: 'scope_split',
    decisionQuestion:
      'Should the stochastic exclusion opener stay grouped with the single-scenario test, or should the next batch split the test logic further?',
    decisionWhy: 'The Section 7 exclusion layer should stay narrow enough for exception-first review.',
    issueType: 'scenario_or_stochastic_requirement',
    issueMessage:
      'The stochastic exclusion section is the chapter entry point for stochastic testing and should remain review-only.',
    issueAction: 'Keep the stochastic exclusion material out of learner-facing output.',
    issueEvidence: 'Pages 280-286 cover the stochastic exclusion test and single-scenario testing.',
    validationCheckId: 'vm22-stochastic-exclusion-coverage',
    validationCheckDetails: 'The selected pages capture the VM-22 stochastic-exclusion slice.',
    nextStep: 'Confirm whether batch-049 should begin at the scenario-generation opener on page 287.',
  },
  {
    plannedBatchId: 'batch-049',
    batchSlug: 'vm22-049-scenario-generation',
    sourceId: 'vm22-scenario-generation',
    batchTitle: 'VM-22 scenario generation',
    summaryLead:
      'VM-22 Section 8 defines the prescribed scenario generators and the non-prescribed generator option',
    pageWindow: [287, 290],
    sectionReference: 'VM-22: Scenario Generation',
    citationText: 'This section outlines the requirements for the stochastic cash-flow models used to simulate interest rates, fund returns, and implied volatility...',
    summary:
      'VM-22 Section 8 prescribes the stochastic scenario generation framework, including interest rates, fund returns, implied volatility, and the option to use a non-prescribed generator.',
    keywords: ['VM-22', 'scenario generation', 'stochastic', 'interest rates', 'fund returns', 'implied volatility'],
    notes: 'VM-22 scenario-generation slice retained as a review-only controlled batch.',
    sourceNotes: 'Pages 287-290 only; scenario-generation slice.',
    reviewFlags: ['scenario_or_stochastic_requirement', 'formula_context', 'cross_reference_mapping'],
    flagType: 'scenario_generation_slice',
    flagMessage:
      'The scenario-generation opener is stochastic-model heavy and should remain review-only until the hedging section is added.',
    citationDetails:
      'The section opens the stochastic modeling requirements and points forward to the hedging material.',
    citationAction: 'Keep the scenario-generation slice review-only and preserve the stochastic-model context.',
    decisionType: 'scope_split',
    decisionQuestion:
      'Should the scenario-generation opener stay grouped with the scenario-consistency notes, or should the next batch split those rules further?',
    decisionWhy: 'The stochastic modeling layer should stay narrow enough to review without absorbing hedging detail.',
    issueType: 'scenario_or_stochastic_requirement',
    issueMessage:
      'The scenario-generation slice is the chapter entry point for stochastic modeling and should remain review-only.',
    issueAction: 'Keep the stochastic scenario-generation material out of learner-facing output.',
    issueEvidence: 'Pages 287-290 cover the Section 8 scenario-generation opener.',
    validationCheckId: 'vm22-scenario-generation-coverage',
    validationCheckDetails: 'The selected pages capture the VM-22 scenario-generation slice.',
    nextStep: 'Confirm whether batch-050 should begin at the hedging opener on page 291.',
  },
  {
    plannedBatchId: 'batch-050',
    batchSlug: 'vm22-050-hedging-strategy',
    sourceId: 'vm22-hedging-strategy',
    batchTitle: 'VM-22 hedging under a future non-index credit hedging strategy',
    summaryLead:
      'VM-22 Section 9 maps the hedging strategy, error-factor treatment, and documentation expectations',
    pageWindow: [291, 297],
    sectionReference: 'VM-22: Modeling Hedges under a Future Non-Index Credit Hedging Strategy',
    citationText: 'The hedging strategy is the hedging asset holdings at all points in time in all scenarios.',
    summary:
      'VM-22 Section 9 explains how hedging strategies are modeled, how the error factor is set, and why documentation of the hedge program matters for the reserve.',
    keywords: ['VM-22', 'hedging', 'risk mitigation', 'error factor', 'documentation', 'future strategy'],
    notes: 'VM-22 hedging slice retained as a review-only controlled batch.',
    sourceNotes: 'Pages 291-297 only; hedging and error-factor slice.',
    reviewFlags: ['hedging_or_risk_mitigation', 'documentation_expectation', 'requires_human_interpretation'],
    flagType: 'hedging_slice',
    flagMessage:
      'The hedging section depends on future strategy, documentation, and error-factor judgments, so it should remain review-only.',
    citationDetails:
      'The hedging section requires the reviewer to track future hedging strategies and the related documentation limits.',
    citationAction: 'Keep the hedging section review-only and do not collapse the error-factor language into a simple rule.',
    decisionType: 'scope_split',
    decisionQuestion:
      'Should the hedging opener stay grouped with the error-factor language, or should the documentation and discontinuity notes be split later?',
    decisionWhy: 'The hedging material is high-caution and should stay narrow enough for exception-first review.',
    issueType: 'hedging_or_risk_mitigation',
    issueMessage:
      'The hedging section contains risk-mitigation judgment and documentation expectations that should remain review-only.',
    issueAction: 'Keep the hedging strategy material out of learner-facing output.',
    issueEvidence: 'Pages 291-297 cover hedging strategy, error factor, and discontinuous-hedge considerations.',
    validationCheckId: 'vm22-hedging-strategy-coverage',
    validationCheckDetails: 'The selected pages capture the VM-22 hedging slice.',
    nextStep: 'Confirm whether batch-051 should begin at the behavior-assumption opener on page 298.',
  },
  {
    plannedBatchId: 'batch-051',
    batchSlug: 'vm22-051-behavior-assumptions',
    sourceId: 'vm22-behavior-assumptions',
    batchTitle: 'VM-22 contract holder behavior assumptions',
    summaryLead:
      'VM-22 Section 10 defines the behavior-assumption framework and the eligibility / termination logic',
    pageWindow: [298, 304],
    sectionReference: 'VM-22: Guidance and Requirements for Setting Contract Holder Behavior Prudent Estimate Assumptions',
    citationText: 'Contract holder behavior assumptions encompass actions such as lapses, withdrawals, transfers, recurring deposits, benefit utilization, option election...',
    summary:
      'VM-22 Section 10 sets the behavior-assumption framework, explains prudent-estimate expectations, and requires sensitivity thinking for the stochastic reserve.',
    keywords: ['VM-22', 'behavior assumptions', 'lapses', 'withdrawals', 'option election', 'prudent estimate'],
    notes: 'VM-22 behavior-assumption slice retained as a review-only controlled batch.',
    sourceNotes: 'Pages 298-304 only; behavior-assumption slice.',
    reviewFlags: ['company_or_prudent_estimate_assumption', 'requires_human_interpretation', 'cross_reference_mapping'],
    flagType: 'behavior_assumption_slice',
    flagMessage:
      'The behavior assumptions depend on prudent-estimate judgment and should remain review-only.',
    citationDetails:
      'The section highlights behavior assumptions and the need for sensitivity analysis, so the review boundary should remain visible.',
    citationAction: 'Keep the behavior-assumption material review-only and separate from the mortality section.',
    decisionType: 'scope_split',
    decisionQuestion:
      'Should the behavior assumptions stay grouped with the sensitivity notes, or should the sensitivity material be split into a later cleanup batch?',
    decisionWhy: 'The behavior-assumption layer should stay narrow enough for human actuarial review.',
    issueType: 'company_or_prudent_estimate_assumption',
    issueMessage:
      'The behavior assumptions depend on prudent-estimate judgment and sensitivity analysis and should stay review-only.',
    issueAction: 'Keep the behavior assumptions out of learner-facing output.',
    issueEvidence: 'Pages 298-304 cover contract holder behavior assumptions and sensitivity concepts.',
    validationCheckId: 'vm22-behavior-assumptions-coverage',
    validationCheckDetails: 'The selected pages capture the VM-22 behavior-assumption slice.',
    nextStep: 'Confirm whether batch-052 should begin at the mortality-assumption opener on page 305.',
  },
  {
    plannedBatchId: 'batch-052',
    batchSlug: 'vm22-052-mortality-assumptions',
    sourceId: 'vm22-mortality-assumptions',
    batchTitle: 'VM-22 mortality assumptions',
    summaryLead:
      'VM-22 Section 11 establishes prudent-estimate mortality assumptions and credibility treatment',
    pageWindow: [305, 308],
    sectionReference: 'VM-22: Guidance and Requirement for Setting Prudent Estimate Mortality Assumptions',
    citationText: 'The company shall establish anticipated experience assumptions for the risk factor by combining relevant company experience with industry experience data...',
    summary:
      'VM-22 Section 11 covers mortality credibility, data adjustments, future mortality improvement, and the margin treatment needed for prudent estimate assumptions.',
    keywords: ['VM-22', 'mortality', 'prudent estimate', 'credibility', 'margin', 'mortality improvement'],
    notes: 'VM-22 mortality-assumption slice retained as a review-only controlled batch.',
    sourceNotes: 'Pages 305-308 only; mortality-assumption slice.',
    reviewFlags: ['prescribed_assumption', 'company_or_prudent_estimate_assumption', 'requires_human_interpretation'],
    flagType: 'mortality_assumption_slice',
    flagMessage:
      'The mortality assumption section is judgment-heavy and should remain review-only until the later assumption guidance is captured.',
    citationDetails:
      'The section requires credibility and improvement judgments, so it should stay visible as a distinct assumptions batch.',
    citationAction: 'Keep the mortality assumptions review-only and separate from the later assumptions cleanup batch.',
    decisionType: 'scope_split',
    decisionQuestion:
      'Should the mortality section stay together with the credibility material, or should the improvement guidance be split later?',
    decisionWhy: 'The mortality section is one of the higher-risk assumption layers and should stay narrow.',
    issueType: 'prescribed_assumption',
    issueMessage:
      'The mortality section relies on credibility and prescribed assumption judgments that should stay review-only.',
    issueAction: 'Keep the mortality assumption material out of learner-facing output.',
    issueEvidence: 'Pages 305-308 cover mortality credibility and improvement guidance.',
    validationCheckId: 'vm22-mortality-assumptions-coverage',
    validationCheckDetails: 'The selected pages capture the VM-22 mortality-assumption slice.',
    nextStep: 'Confirm whether batch-053 should begin at the other-assumptions opener on page 309.',
  },
  {
    plannedBatchId: 'batch-053',
    batchSlug: 'vm22-053-other-assumptions',
    sourceId: 'vm22-other-assumptions',
    batchTitle: 'VM-22 other assumptions',
    summaryLead:
      'VM-22 Section 12 closes the assumption guidance with margins, sensitivity, and expense handling',
    pageWindow: [309, 313],
    sectionReference: 'VM-22: Other Guidance and Requirements for Assumptions',
    citationText: 'A margin is permitted, but not required, for assumptions that do not represent material risks.',
    summary:
      'VM-22 Section 12 handles the remaining assumption guidance, including sensitivity testing, margins, expense allocation, and general modeling prudence.',
    keywords: ['VM-22', 'assumptions', 'margins', 'sensitivity testing', 'expenses', 'prudence'],
    notes: 'VM-22 other-assumptions slice retained as a review-only controlled batch.',
    sourceNotes: 'Pages 309-313 only; other-assumptions slice.',
    reviewFlags: ['company_or_prudent_estimate_assumption', 'documentation_expectation', 'requires_human_interpretation'],
    flagType: 'assumption_margin_slice',
    flagMessage:
      'The remaining assumption guidance includes margins, sensitivity testing, and allocation language that should stay review-only.',
    citationDetails:
      'The section is the cleanup layer for assumptions and should remain visible as a distinct review slice.',
    citationAction: 'Keep the other-assumptions section review-only and do not merge it into the allocation batch.',
    decisionType: 'scope_split',
    decisionQuestion:
      'Should the margin and sensitivity language stay grouped with the expense guidance, or should a future cleanup batch split those items?',
    decisionWhy: 'The final assumption guidance is review-heavy enough to keep separate from the closing allocation section.',
    issueType: 'documentation_expectation',
    issueMessage:
      'The remaining assumption guidance mixes margin, sensitivity, and expense treatment, so it should stay review-only.',
    issueAction: 'Keep the assumption cleanup material out of learner-facing output.',
    issueEvidence: 'Pages 309-313 cover the final assumption guidance and sensitivity considerations.',
    validationCheckId: 'vm22-other-assumptions-coverage',
    validationCheckDetails: 'The selected pages capture the VM-22 other-assumptions slice.',
    nextStep: 'Confirm whether batch-054 should begin at the allocation opener on page 314.',
  },
  {
    plannedBatchId: 'batch-054',
    batchSlug: 'vm22-054-allocation',
    sourceId: 'vm22-allocation',
    batchTitle: 'VM-22 allocation of aggregate reserves and closing boundary',
    summaryLead:
      'VM-22 Section 13 allocates the aggregate reserve to the contract level and closes the chapter before VM-25 begins',
    pageWindow: [314, 318],
    sectionReference: 'VM-22: Allocation of Aggregate Reserves to the Contract Level',
    citationText: 'The contract-level reserve for each contract shall be the sum of the following...',
    summary:
      'VM-22 closes by allocating the aggregate reserve to the contract level and ending cleanly before VM-25 starts on the following chapter pages.',
    keywords: ['VM-22', 'allocation', 'aggregate reserve', 'contract level', 'closing boundary'],
    notes: 'VM-22 allocation and closing-boundary slice retained as a review-only controlled batch.',
    sourceNotes: 'Pages 314-318 only; allocation and closing-boundary slice.',
    reviewFlags: ['regulatory_requirement', 'cross_reference_mapping', 'boundary_control_window'],
    flagType: 'boundary_control_window',
    flagMessage:
      'The closing VM-22 pages allocate reserves at the contract level and then stop before VM-25, so the boundary must remain explicit.',
    citationDetails:
      'The final VM-22 pages allocate reserves and then end the chapter before the next chapter begins.',
    citationAction: 'Keep the closing boundary review-only and do not merge VM-25 into the controlled VM-22 wave.',
    decisionType: 'boundary_confirmation',
    decisionQuestion:
      'Should the allocation pages stay as the final VM-22 batch, or should a later cleanup pass separate any last cross-reference notes?',
    decisionWhy: 'The final boundary needs to remain clear so VM-25 stays out of scope.',
    issueType: 'boundary_control_window',
    issueMessage:
      'The chapter ends immediately after the allocation language, so the closing boundary should stay review-only.',
    issueAction: 'Keep VM-25 out of the VM-22 sequence and preserve the closing boundary in the review packet.',
    issueEvidence: 'Pages 314-318 cover contract-level allocation and the chapter end before VM-25 begins on page 319.',
    validationCheckId: 'vm22-allocation-coverage',
    validationCheckDetails: 'The selected pages capture the VM-22 allocation and closing boundary slice.',
    nextStep: 'If a reviewer wants a follow-up, confirm VM-25 remains a separate future plan and not part of this wave.',
  },
]

export const vm22BatchDefinitions = Object.fromEntries(
  vm22BatchSpecs.map((spec) => [spec.plannedBatchId, makeVm22Batch(spec)]),
)
