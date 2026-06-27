const rawSourceFile = 'pbr_data_valuation_manual_2026.pdf'
const sourceFamilyId = 'valuation_manual_pdfs'
const sourceTitle = 'Valuation Manual'
const sourceReference = '2026 NAIC Valuation Manual'
const defaultNonLearnerNotes =
  'Controlled VM-21 slice retained as review-only until the wave is explicitly expanded.'

const makeVm21Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`
  return {
    batchName: `Controlled VM-21 batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'vm21_controlled',
    processingIntentText:
      spec.processingIntentText ??
      `Capture ${spec.batchTitle} as a review-only VM-21 slice so the chapter boundary stays narrow and reviewable.`,
    processingIntentNotes:
      'Controlled VM-21 workflow proof only. This batch stays review-only, source-bound, and excluded from learner-facing or app-ready outputs.',
    batchSummaryText: `Batch ${spec.plannedBatchId} remains review-only. ${spec.summaryLead} stays unpromoted.`,
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This controlled VM-21 batch is intentionally limited to ${spec.batchTitle} and is retained for review-only analysis.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small controlled VM-21 batch only. Keep the work review-first, preserve source-bound locators, and do not promote any item.',
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

const vm21BatchSpecs = [
  {
    plannedBatchId: 'batch-022',
    batchSlug: 'vm21-022-background',
    sourceId: 'vm21-background-principles',
    batchTitle: 'VM-21 background and principles',
    summaryLead: 'VM-21 background and principles establish the chapter frame and preserve the high-level principles as review-only',
    pageWindow: [143, 147],
    sectionReference: 'VM-21: Background',
    citationText: 'VM-21: Requirements for Principle-Based Reserves for Variable Annuities',
    summary:
      'VM-21 introduces the chapter, lists the background principles that guide the projection methodology, and keeps the chapter frame review-only.',
    keywords: ['VM-21', 'background', 'principles', 'chapter frame', 'supporting chapter'],
    notes: 'VM-21 background slice retained as a review-only controlled batch.',
    sourceNotes: 'Pages 143-147 only; background and principle slice.',
    reviewFlags: ['background_content', 'cross_reference_mapping', 'requires_human_interpretation'],
    flagType: 'background_slice',
    flagMessage:
      'The VM-21 background slice establishes the chapter frame and should remain review-only until the operational sections are captured.',
    citationDetails:
      'The VM-21 chapter begins on page 143 and the background/principles material stays narrow enough for exception-first review.',
    citationAction: 'Keep VM-21 background material review-only and do not treat it as the operational projection text.',
    decisionType: 'scope_split',
    decisionQuestion:
      'Should the VM-21 background and principles stay as one review-only slice, or should the principles be split again before later mechanics batches?',
    decisionWhy: 'The chapter frame should stay narrow until the scope and effective-date slices are added.',
    issueType: 'cross_reference_mapping',
    issueMessage:
      'The background slice points into later SR, hedging, and assumption sections, so it should stay review-only until the operational text is captured.',
    issueAction: 'Keep the background slice out of learner-facing output until later VM-21 sections are available.',
    issueEvidence: 'Pages 143-147 cover the chapter background and principles only.',
    validationCheckId: 'vm21-background-coverage',
    validationCheckDetails: 'The selected pages capture the VM-21 background and principles slice.',
    nextStep: 'Confirm whether batch-023 should start directly at the scope and effective-date opener on page 148.',
  },
  {
    plannedBatchId: 'batch-023',
    batchSlug: 'vm21-023-scope',
    sourceId: 'vm21-scope-phase-in',
    batchTitle: 'VM-21 scope and effective date',
    summaryLead: 'VM-21 scope and effective date establish applicability and phase-in boundaries as review-only',
    pageWindow: [148, 151],
    sectionReference: 'VM-21: Scope and Effective Date',
    citationText: 'These requirements apply for valuation dates on or after Jan. 1, 2020.',
    summary:
      'VM-21 defines the contracts in scope, states the effective date, and describes the phase-in rules that govern when the chapter applies.',
    keywords: ['VM-21', 'scope', 'effective date', 'phase-in', 'applicability'],
    notes: 'VM-21 scope slice retained as a review-only controlled batch.',
    sourceNotes: 'Pages 148-151 only; scope and effective-date slice.',
    reviewFlags: ['regulatory_requirement', 'boundary_control_window', 'cross_reference_mapping'],
    flagType: 'applicability_boundary',
    flagMessage:
      'The scope and effective-date slice is intentionally narrow and should remain review-only until the later reserve sections are added.',
    citationDetails:
      'The chapter applies by valuation date and phase-in election, so the boundary should remain visible in review.',
    citationAction: 'Keep the applicability slice review-only and do not merge it into reserve mechanics.',
    decisionType: 'scope_split',
    decisionQuestion:
      'Should the scope and phase-in language stay together as one batch, or should the phase-in rules be split out later?',
    decisionWhy: 'The applicability boundary should remain easy to review before the mechanics batches start.',
    issueType: 'boundary_control_window',
    issueMessage:
      'The scope pages contain both applicability and phase-in language, which should remain review-only until the mechanics batches are built.',
    issueAction: 'Keep the applicability boundary separate from later projection mechanics.',
    issueEvidence: 'Pages 148-151 cover scope, effective date, and phase-in language.',
    validationCheckId: 'vm21-scope-coverage',
    validationCheckDetails: 'The selected pages capture the VM-21 scope and effective-date slice.',
    nextStep: 'Confirm whether batch-024 should begin at the Section 3 reserve-methodology opener on page 151.',
  },
  {
    plannedBatchId: 'batch-024',
    batchSlug: 'vm21-024-reserve-methodology',
    sourceId: 'vm21-reserve-methodology',
    batchTitle: 'VM-21 reserve methodology',
    summaryLead: 'VM-21 reserve methodology defines the aggregate reserve structure and the alternative-method boundary',
    pageWindow: [151, 152],
    sectionReference: 'VM-21: Reserve Methodology',
    citationText: 'The aggregate reserve for contracts falling within the scope of these requirements shall equal the SR...',
    summary:
      'VM-21 defines how the aggregate reserve is assembled from the SR, the additional standard projection amount, and the alternative methodology reserve, then stops at the next mechanics boundary.',
    keywords: ['VM-21', 'reserve methodology', 'aggregate reserve', 'alternative methodology', 'boundary'],
    notes: 'VM-21 reserve-method slice retained as a review-only controlled batch.',
    sourceNotes: 'Pages 151-152 only; reserve methodology and aggregate reserve boundary slice.',
    reviewFlags: ['reserve_method_structure', 'calculation_structure', 'cross_reference_mapping'],
    flagType: 'reserve_method_structure',
    flagMessage:
      'The reserve methodology slice establishes the aggregate reserve structure and should remain review-only until the later mechanics are added.',
    citationDetails:
      'The section introduces the aggregate reserve structure and the reserve-method split without completing the later detail blocks.',
    citationAction: 'Keep the reserve methodology slice review-only and preserve the boundary to the later mechanics.',
    decisionType: 'scope_split',
    decisionQuestion:
      'Should the aggregate-reserve language stay grouped with the alternative-method boundary, or should the next batch split them apart?',
    decisionWhy: 'The reserve-method structure should stay narrow enough to review without absorbing later mechanics.',
    issueType: 'reserve_method_structure',
    issueMessage:
      'The reserve methodology slice contains the chapter-level aggregate reserve rule and the alternative-method boundary, which should stay review-only.',
    issueAction: 'Keep the reserve-method structure separate from later SR mechanics.',
    issueEvidence: 'Pages 151-152 introduce the aggregate reserve structure and the boundary to later methods.',
    validationCheckId: 'vm21-reserve-method-coverage',
    validationCheckDetails: 'The selected pages capture the VM-21 reserve methodology slice.',
    nextStep: 'Confirm whether batch-025 should start at the Section 4 SR projection opener on page 153.',
  },
  {
    plannedBatchId: 'batch-025',
    batchSlug: 'vm21-025-sr-projection',
    sourceId: 'vm21-sr-projection-entry',
    batchTitle: 'VM-21 SR projection entry',
    summaryLead: 'VM-21 Section 4 opens the projection of accumulated deficiencies and the starting-asset context',
    pageWindow: [153, 159],
    sectionReference: 'VM-21: Determination of the SR (projection entry)',
    citationText: 'The projection of accumulated deficiencies shall be made ignoring federal income tax in both cash flows and discount rates.',
    summary:
      'VM-21 starts the SR projection mechanics by defining accumulated deficiencies, starting-asset requirements, discount-rate treatment, hedging/revenue-sharing context, and the first NAER references.',
    keywords: ['VM-21', 'SR', 'projection', 'accumulated deficiencies', 'starting assets', 'NAER'],
    notes: 'VM-21 SR projection slice retained as a review-only controlled batch.',
    sourceNotes: 'Pages 153-159 only; SR projection and starting-asset context slice.',
    reviewFlags: ['calculation_structure', 'formula_context', 'cross_reference_mapping', 'requires_human_interpretation'],
    flagType: 'calculation_structure',
    flagMessage:
      'The SR projection entry is formula-heavy and should remain review-only until the asset and iteration context is captured.',
    citationDetails:
      'The projection rules introduce the accumulation mechanics, discount-rate treatment, and the first hedge-related references.',
    citationAction: 'Keep the projection entry review-only and preserve the formula context for later batches.',
    decisionType: 'scope_split',
    decisionQuestion:
      'Should the SR projection entry stay grouped with the starting-asset context, or should the hedge and revenue-sharing references be split later?',
    decisionWhy: 'The projection layer should remain narrow enough to separate calculation structure from the later asset mechanics.',
    issueType: 'calculation_structure',
    issueMessage:
      'The SR projection entry contains the first mechanics layer and depends on later asset and hedge treatment, so it should stay review-only.',
    issueAction: 'Keep the projection mechanics separate from the later asset and iteration batch.',
    issueEvidence: 'Pages 153-159 cover the projection of accumulated deficiencies and the NAER entry context.',
    validationCheckId: 'vm21-sr-projection-coverage',
    validationCheckDetails: 'The selected pages capture the VM-21 SR projection entry slice.',
    nextStep: 'Confirm whether batch-026 should begin at the NAER and direct-iteration pages on 160.',
  },
  {
    plannedBatchId: 'batch-026',
    batchSlug: 'vm21-026-sr-assets-iteration',
    sourceId: 'vm21-sr-asset-and-iteration',
    batchTitle: 'VM-21 SR asset and iteration mechanics',
    summaryLead: 'VM-21 adds NAER, direct iteration, annuitization, and ASOP compliance language to the SR mechanics',
    pageWindow: [160, 165],
    sectionReference: 'VM-21: Determination of the SR (NAER, direct iteration, annuitization, ASOPs)',
    citationText: 'The company shall use an additional invested asset portfolio...',
    summary:
      'VM-21 continues the SR mechanics with the additional-invested-asset portfolio, NAER construction, direct iteration, annuitization assumptions, and ASOP compliance language.',
    keywords: ['VM-21', 'NAER', 'direct iteration', 'annuitization', 'ASOPs', 'asset mechanics'],
    notes: 'VM-21 SR asset-mechanics slice retained as a review-only controlled batch.',
    sourceNotes: 'Pages 160-165 only; NAER, direct iteration, and annuitization slice.',
    reviewFlags: ['asset_modeling_judgment', 'formula_context', 'requires_human_interpretation', 'cross_reference_mapping'],
    flagType: 'asset_modeling_judgment',
    flagMessage:
      'The SR asset and iteration mechanics depend on asset choices, annuitization treatment, and ASOP compliance, so they should remain review-only.',
    citationDetails:
      'The pages add the asset portfolio and iteration mechanics without separating them from the annuitization and ASOP context.',
    citationAction: 'Keep the SR asset and iteration slice review-only and do not promote it separately from the projection entry.',
    decisionType: 'scope_split',
    decisionQuestion:
      'Should the NAER / direct-iteration material stay grouped with the annuitization and ASOP language, or should any part be split into another batch?',
    decisionWhy: 'The asset and iteration layer is broad enough that the reviewer may want a later split before any promotion discussion.',
    issueType: 'asset_modeling_judgment',
    issueMessage:
      'The SR mechanics at this point include asset and annuitization judgments that require human review before any promotion can be considered.',
    issueAction: 'Keep the asset and iteration mechanics out of learner-facing output.',
    issueEvidence: 'Pages 160-165 cover NAER, direct iteration, annuitization, and ASOP compliance.',
    validationCheckId: 'vm21-sr-assets-coverage',
    validationCheckDetails: 'The selected pages capture the VM-21 SR asset and iteration slice.',
    nextStep: 'Confirm whether batch-027 should start at the reinsurance ceded opener on page 166.',
  },
  {
    plannedBatchId: 'batch-027',
    batchSlug: 'vm21-027-reinsurance-section6-entry',
    sourceId: 'vm21-reinsurance-and-section6-entry',
    batchTitle: 'VM-21 reinsurance ceded and Section 6 entry',
    summaryLead: 'VM-21 reinsurance ceded language opens the Additional Standard Projection Amount section',
    pageWindow: [166, 170],
    sectionReference: 'VM-21: Reinsurance Ceded and Section 6 opener',
    citationText: 'Where reinsurance is ceded, the additional standard projection amount shall be calculated as described in Section 6...',
    summary:
      'VM-21 ties reinsurance ceded treatment into the additional standard projection amount and then opens Section 6 with the prescribed projection method.',
    keywords: ['VM-21', 'reinsurance', 'Section 6', 'additional standard projection amount', 'prescribed projection'],
    notes: 'VM-21 reinsurance and Section 6 entry slice retained as a review-only controlled batch.',
    sourceNotes: 'Pages 166-170 only; reinsurance opener and Section 6 entry slice.',
    reviewFlags: ['reinsurance', 'cross_reference_mapping', 'reporting_requirement', 'requires_human_interpretation'],
    flagType: 'reinsurance_slice',
    flagMessage:
      'The reinsurance opener is tied to Section 6 and should remain review-only until the downstream projection treatment is captured.',
    citationDetails:
      'The reinsurance text immediately opens the Section 6 projection requirements, so the boundary should remain visible in review.',
    citationAction: 'Keep the reinsurance opener separate from later prescribed-projection details.',
    decisionType: 'scope_split',
    decisionQuestion:
      'Should the reinsurance opener remain grouped with the Section 6 entry text, or should the next batch separate the prescribed projection language further?',
    decisionWhy: 'The reinsurance treatment and the Section 6 opener should stay reviewable without becoming a single broad slice.',
    issueType: 'cross_reference_mapping',
    issueMessage:
      'This slice relies on Section 6 for the actual prescribed projection treatment, so it should remain review-only until that section is added.',
    issueAction: 'Keep the reinsurance opener out of learner-facing output until the Section 6 mechanics are present.',
    issueEvidence: 'Pages 166-170 cover reinsurance ceded and the opening of Section 6.',
    validationCheckId: 'vm21-reinsurance-entry-coverage',
    validationCheckDetails: 'The selected pages capture the VM-21 reinsurance opener and Section 6 entry slice.',
    nextStep: 'Confirm whether batch-028 should begin at the maintenance-expense assumptions on page 171.',
  },
  {
    plannedBatchId: 'batch-028',
    batchSlug: 'vm21-028-section6-assumptions',
    sourceId: 'vm21-section6-assumptions',
    batchTitle: 'VM-21 Section 6 assumptions and cohort mechanics',
    summaryLead: 'VM-21 Section 6 adds prescribed assumptions, withdrawal treatment, and annuitization cohort mechanics',
    pageWindow: [171, 175],
    sectionReference: 'VM-21: Section 6 assumptions and withdrawal/annuitization cohorts',
    citationText: 'Maintenance expense assumptions shall be determined as the sum of (a) plus (b) if the company is responsible for the administration...',
    summary:
      'VM-21 Section 6 moves into prescribed assumptions for expenses, account value growth, market indices, withdrawal amounts, RMD handling, and cohort simplification.',
    keywords: ['VM-21', 'Section 6', 'prescribed assumptions', 'withdrawal', 'annuitization cohorts', 'RMD'],
    notes: 'VM-21 Section 6 assumptions slice retained as a review-only controlled batch.',
    sourceNotes: 'Pages 171-175 only; assumptions and cohort-mechanics slice.',
    reviewFlags: ['prescribed_assumption', 'company_or_prudent_estimate_assumption', 'formula_context', 'requires_human_interpretation'],
    flagType: 'prescribed_assumption',
    flagMessage:
      'The Section 6 assumptions are prescribed and implementation-heavy, so they should stay review-only until the factor tables are also captured.',
    citationDetails:
      'The section mixes expense, withdrawal, and cohort assumptions, which should remain visible as a distinct assumptions slice.',
    citationAction: 'Keep the assumptions and cohort mechanics separate from the later factor-table pages.',
    decisionType: 'scope_split',
    decisionQuestion:
      'Should the prescribed-assumption language stay grouped with the cohort mechanics, or should a later batch isolate the simplification rules?',
    decisionWhy: 'The assumptions and cohort mechanics are review-heavy enough to merit a narrow boundary.',
    issueType: 'prescribed_assumption',
    issueMessage:
      'The Section 6 assumptions involve prescribed values and cohort simplification rules that should remain review-only.',
    issueAction: 'Keep the prescribed assumptions out of learner-facing output until the later tables are reviewed.',
    issueEvidence: 'Pages 171-175 cover maintenance expenses, withdrawal rules, and cohort mechanics.',
    validationCheckId: 'vm21-section6-assumptions-coverage',
    validationCheckDetails: 'The selected pages capture the VM-21 Section 6 assumptions slice.',
    nextStep: 'Confirm whether batch-029 should begin at the ITM / factor-table pages on 176.',
  },
  {
    plannedBatchId: 'batch-029',
    batchSlug: 'vm21-029-section6-tables',
    sourceId: 'vm21-section6-factor-tables',
    batchTitle: 'VM-21 Section 6 factor tables and look-ups',
    summaryLead: 'VM-21 Section 6 finishes with ITM calculations, factor tables, and look-up structure before Section 7 begins',
    pageWindow: [176, 181],
    sectionReference: 'VM-21: Section 6 ITM tables and factor look-ups',
    citationText: `The ITM of a contract's guaranteed benefit shall be calculated based on the ratio of the guaranteed benefit's GAPV to the termination value of the contract.`,
    summary:
      'VM-21 completes Section 6 with the ITM calculation rules, annuitization and surrender tables, and the factor look-up structure that feeds the next chapter.',
    keywords: ['VM-21', 'ITM', 'factor tables', 'look-up', 'Section 6', 'boundary'],
    notes: 'VM-21 Section 6 factor-table slice retained as a review-only controlled batch.',
    sourceNotes: 'Pages 176-181 only; factor-table and boundary slice.',
    reviewFlags: ['formula_context', 'calculation_structure', 'boundary_control_window', 'requires_human_interpretation'],
    flagType: 'formula_context',
    flagMessage:
      'The factor-table material is formula-heavy and should remain review-only as the boundary into Section 7.',
    citationDetails:
      'The ITM and factor tables close Section 6 and lead directly into the alternative-methodology section.',
    citationAction: 'Keep the factor-table material review-only and do not absorb the Section 7 opener.',
    decisionType: 'boundary_confirmation',
    decisionQuestion:
      'Should the ITM tables stay with the Section 6 assumptions batch, or should the boundary to Section 7 remain explicit in a separate batch?',
    decisionWhy: 'The factor-table pages are the last Section 6 layer and should not bleed into Section 7.',
    issueType: 'boundary_control_window',
    issueMessage:
      'The Section 6 tables sit directly on the Section 7 boundary, so the slice should remain review-only.',
    issueAction: 'Keep the Section 6 tables separate from the Section 7 alternative-methodology material.',
    issueEvidence: 'Pages 176-181 cover the ITM tables and close Section 6 before Section 7 begins.',
    validationCheckId: 'vm21-section6-tables-coverage',
    validationCheckDetails: 'The selected pages capture the VM-21 Section 6 factor-table slice.',
    nextStep: 'Confirm whether batch-030 should begin at the Section 7 alternative-methodology opener on page 182.',
  },
  {
    plannedBatchId: 'batch-030',
    batchSlug: 'vm21-030-alt-method-general',
    sourceId: 'vm21-alt-method-general',
    batchTitle: 'VM-21 alternative methodology general layer',
    summaryLead: 'VM-21 Section 7 opens the alternative methodology and the contract-by-contract application rules',
    pageWindow: [182, 188],
    sectionReference: 'VM-21: Alternative Methodology (general and contract-by-contract application)',
    citationText: 'The reserve determined using the Alternative Methodology for a group of contracts that contain no guaranteed benefits shall be determined using an application of AG 33 in VM-C...',
    summary:
      'VM-21 starts Section 7 with the general alternative-methodology rule, the AG 33 in VM-C cross-reference, and the contract-by-contract application framework.',
    keywords: ['VM-21', 'alternative methodology', 'VM-C', 'AG 33', 'contract-by-contract', 'reserve method'],
    notes: 'VM-21 alternative-methodology general slice retained as a review-only controlled batch.',
    sourceNotes: 'Pages 182-188 only; general alternative-methodology slice.',
    reviewFlags: ['calculation_structure', 'definition_or_terminology', 'cross_reference_mapping', 'requires_human_interpretation'],
    flagType: 'calculation_structure',
    flagMessage:
      'The alternative-methodology opener depends on VM-C and should remain review-only until the later factor tables are captured.',
    citationDetails:
      'The section introduces the alternative method and immediately points to AG 33 in VM-C, so the cross-reference must remain visible.',
    citationAction: 'Keep the alternative-methodology opener review-only and do not collapse the VM-C reference into a standalone rule.',
    decisionType: 'scope_split',
    decisionQuestion:
      'Should the general alternative-methodology rule stay grouped with the contract-by-contract application text, or should the next batch split those ideas apart?',
    decisionWhy: 'The general section is review-heavy enough to stay narrow before the factor tables appear.',
    issueType: 'cross_reference_mapping',
    issueMessage:
      'The alternative-methodology opener depends on VM-C cross-references and should stay review-only until the factor tables are added.',
    issueAction: 'Keep the VM-C reference and the alternative-methodology boundary separate from later tables.',
    issueEvidence: 'Pages 182-188 cover the alternative-methodology opener and contract-by-contract rules.',
    validationCheckId: 'vm21-alt-method-general-coverage',
    validationCheckDetails: 'The selected pages capture the VM-21 alternative-methodology general slice.',
    nextStep: 'Confirm whether batch-031 should start at the factor-table pages on 189.',
  },
  {
    plannedBatchId: 'batch-031',
    batchSlug: 'vm21-031-alt-method-tables',
    sourceId: 'vm21-alt-method-tables',
    batchTitle: 'VM-21 alternative methodology tables and product characteristics',
    summaryLead: 'VM-21 Section 7 adds the factor tables, product characteristics, and table look-up mechanics',
    pageWindow: [189, 198],
    sectionReference: 'VM-21: Alternative Methodology factor tables and product characteristics',
    citationText: 'Tables of factors for F, G, beta1 and beta2 values reflecting a 65% confidence interval and ignoring federal income tax are available from the NAIC.',
    summary:
      'VM-21 Section 7 finishes the alternative methodology with GC factor tables, liability-modeling assumptions, asset-class tables, correlation matrices, and the lookup key.',
    keywords: ['VM-21', 'GC factors', 'product characteristics', 'asset classes', 'correlation matrix', 'tables'],
    notes: 'VM-21 alternative-methodology tables slice retained as a review-only controlled batch.',
    sourceNotes: 'Pages 189-198 only; factor tables and product-characteristics slice.',
    reviewFlags: ['formula_context', 'asset_modeling_judgment', 'requires_human_interpretation', 'cross_reference_mapping'],
    flagType: 'factor_table_slice',
    flagMessage:
      'The factor tables and product-characteristic tables are calibration-heavy and should remain review-only.',
    citationDetails:
      'The section contains the factor tables and correlation matrices that should stay visible for human review.',
    citationAction: 'Keep the factor-table material review-only and do not treat it as a standalone learner-facing rule set.',
    decisionType: 'scope_split',
    decisionQuestion:
      'Should the product-characteristic tables stay grouped with the factor look-ups, or should the next batch split the tables further?',
    decisionWhy: 'The factor-table layer is dense enough to merit a separate review-only batch.',
    issueType: 'asset_modeling_judgment',
    issueMessage:
      'The factor tables rely on calibration and model judgments that should stay review-only until the surrounding section context is reviewed.',
    issueAction: 'Keep the factor tables out of learner-facing output.',
    issueEvidence: 'Pages 189-198 cover the GC factor tables, asset classes, and lookup data.',
    validationCheckId: 'vm21-alt-method-tables-coverage',
    validationCheckDetails: 'The selected pages capture the VM-21 alternative-methodology table slice.',
    nextStep: 'Confirm whether batch-032 should begin at the scenario-generation opener on page 199.',
  },
  {
    plannedBatchId: 'batch-032',
    batchSlug: 'vm21-032-scenario-generation',
    sourceId: 'vm21-scenario-generation',
    batchTitle: 'VM-21 scenario generation',
    summaryLead: 'VM-21 Section 8 defines the stochastic scenario generation framework',
    pageWindow: [199, 201],
    sectionReference: 'VM-21: Scenario Generation',
    citationText: 'This section outlines the requirements for the stochastic cash-flow models used to simulate interest rates, fund returns, and implied volatility...',
    summary:
      'VM-21 Section 8 prescribes stochastic scenario generation, including interest rates, fund returns, implied volatility, and scenario consistency requirements.',
    keywords: ['VM-21', 'scenario generation', 'stochastic', 'interest rates', 'fund returns', 'implied volatility'],
    notes: 'VM-21 scenario-generation slice retained as a review-only controlled batch.',
    sourceNotes: 'Pages 199-201 only; scenario-generation opener slice.',
    reviewFlags: ['scenario_or_stochastic_requirement', 'formula_context', 'cross_reference_mapping', 'requires_human_interpretation'],
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
    issueEvidence: 'Pages 199-201 cover the Section 8 scenario-generation opener.',
    validationCheckId: 'vm21-scenario-generation-coverage',
    validationCheckDetails: 'The selected pages capture the VM-21 scenario-generation slice.',
    nextStep: 'Confirm whether batch-033 should begin at the hedging opener on page 202.',
  },
  {
    plannedBatchId: 'batch-033',
    batchSlug: 'vm21-033-hedging',
    sourceId: 'vm21-hedging-cdhs',
    batchTitle: 'VM-21 hedging under a future non-index credit hedging strategy',
    summaryLead: 'VM-21 Section 9 maps hedging strategy, error-factor treatment, and documentation expectations',
    pageWindow: [202, 208],
    sectionReference: 'VM-21: Modeling of Hedges Under a Future Non-Index Credit Hedging Strategy',
    citationText: 'The hedging strategy is the hedging asset holdings at all points in time in all scenarios.',
    summary:
      'VM-21 Section 9 explains how hedging strategies are modeled, how the error factor is set, and why documentation of the hedge program matters for the reserve.',
    keywords: ['VM-21', 'hedging', 'risk mitigation', 'error factor', 'documentation', 'CDHS'],
    notes: 'VM-21 hedging slice retained as a review-only controlled batch.',
    sourceNotes: 'Pages 202-208 only; hedging and error-factor slice.',
    reviewFlags: ['hedging_or_risk_mitigation', 'documentation_expectation', 'requires_human_interpretation', 'cross_reference_mapping'],
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
    issueEvidence: 'Pages 202-208 cover hedging strategy, error factor, and discontinuous-hedge considerations.',
    validationCheckId: 'vm21-hedging-coverage',
    validationCheckDetails: 'The selected pages capture the VM-21 hedging slice.',
    nextStep: 'Confirm whether batch-034 should begin at the behavior-assumption opener on page 209.',
  },
  {
    plannedBatchId: 'batch-034',
    batchSlug: 'vm21-034-behavior',
    sourceId: 'vm21-behavior-assumptions',
    batchTitle: 'VM-21 contract holder behavior assumptions',
    summaryLead: 'VM-21 Section 10 defines behavior assumptions and sensitivity expectations',
    pageWindow: [209, 212],
    sectionReference: 'VM-21: Contract Holder Behavior Assumptions',
    citationText: 'Contract holder behavior assumptions encompass actions such as lapses, withdrawals, transfers, recurring deposits, benefit utilization, option election...',
    summary:
      'VM-21 Section 10 sets the behavior-assumption framework, explains prudent-estimate expectations, and requires sensitivity thinking for the stochastic reserve.',
    keywords: ['VM-21', 'behavior assumptions', 'lapses', 'withdrawals', 'option election', 'prudent estimate'],
    notes: 'VM-21 behavior-assumption slice retained as a review-only controlled batch.',
    sourceNotes: 'Pages 209-212 only; behavior-assumption slice.',
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
    issueEvidence: 'Pages 209-212 cover contract holder behavior assumptions and sensitivity concepts.',
    validationCheckId: 'vm21-behavior-coverage',
    validationCheckDetails: 'The selected pages capture the VM-21 behavior-assumption slice.',
    nextStep: 'Confirm whether batch-035 should begin at the mortality-assumption opener on page 213.',
  },
  {
    plannedBatchId: 'batch-035',
    batchSlug: 'vm21-035-mortality',
    sourceId: 'vm21-mortality-assumptions',
    batchTitle: 'VM-21 mortality assumptions',
    summaryLead: 'VM-21 Section 11 establishes prudent-estimate mortality assumptions and credibility treatment',
    pageWindow: [213, 218],
    sectionReference: 'VM-21: Guidance and Requirements for Setting Prudent Estimate Mortality Assumptions',
    citationText: 'The company shall establish anticipated experience assumptions for the risk factor by combining relevant company experience with industry experience data...',
    summary:
      'VM-21 Section 11 covers mortality credibility, data adjustments, future mortality improvement, and the margin treatment needed for prudent estimate assumptions.',
    keywords: ['VM-21', 'mortality', 'prudent estimate', 'credibility', 'margin', 'mortality improvement'],
    notes: 'VM-21 mortality slice retained as a review-only controlled batch.',
    sourceNotes: 'Pages 213-218 only; mortality-assumption slice.',
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
    issueEvidence: 'Pages 213-218 cover mortality credibility and improvement guidance.',
    validationCheckId: 'vm21-mortality-coverage',
    validationCheckDetails: 'The selected pages capture the VM-21 mortality-assumption slice.',
    nextStep: 'Confirm whether batch-036 should begin at the other-assumptions opener on page 218.',
  },
  {
    plannedBatchId: 'batch-036',
    batchSlug: 'vm21-036-other-assumptions',
    sourceId: 'vm21-other-assumptions',
    batchTitle: 'VM-21 other guidance and requirements for assumptions',
    summaryLead: 'VM-21 Section 12 closes the assumption guidance with margins, sensitivity, and expense handling',
    pageWindow: [218, 221],
    sectionReference: 'VM-21: Other Guidance and Requirements for Assumptions',
    citationText: 'A margin is permitted, but not required, for assumptions that do not represent material risks.',
    summary:
      'VM-21 Section 12 handles the remaining assumption guidance, including sensitivity testing, margins, expense allocation, and general modeling prudence.',
    keywords: ['VM-21', 'assumptions', 'margins', 'sensitivity testing', 'expenses', 'prudence'],
    notes: 'VM-21 other-assumptions slice retained as a review-only controlled batch.',
    sourceNotes: 'Pages 218-221 only; other-assumptions slice.',
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
    issueEvidence: 'Pages 218-221 cover the final assumption guidance and sensitivity considerations.',
    validationCheckId: 'vm21-other-assumptions-coverage',
    validationCheckDetails: 'The selected pages capture the VM-21 other-assumptions slice.',
    nextStep: 'Confirm whether batch-037 should begin at the allocation opener on page 222.',
  },
  {
    plannedBatchId: 'batch-037',
    batchSlug: 'vm21-037-allocation',
    sourceId: 'vm21-allocation',
    batchTitle: 'VM-21 allocation of aggregate reserves and closing boundary',
    summaryLead: 'VM-21 Section 13 allocates the aggregate reserve to the contract level and closes the chapter before VM-22',
    pageWindow: [222, 225],
    sectionReference: 'VM-21: Allocation of the Aggregate Reserves to the Contract Level',
    citationText: 'The contract-level reserve for each contract shall be the sum of the following: A. The contract’s cash surrender value. B. An allocated portion of the excess of the aggregate reserve over the aggregate cash surrender value.',
    summary:
      'VM-21 closes by allocating the aggregate reserve to the contract level and ending cleanly before VM-22 starts on the following chapter pages.',
    keywords: ['VM-21', 'allocation', 'aggregate reserve', 'contract level', 'closing boundary'],
    notes: 'VM-21 allocation and closing-boundary slice retained as a review-only controlled batch.',
    sourceNotes: 'Pages 222-225 only; allocation and closing-boundary slice.',
    reviewFlags: ['regulatory_requirement', 'cross_reference_mapping', 'boundary_control_window'],
    flagType: 'boundary_control_window',
    flagMessage:
      'The closing VM-21 pages allocate reserves at the contract level and then stop before VM-22, so the boundary must remain explicit.',
    citationDetails:
      'The final VM-21 pages allocate reserves and then end the chapter before the next chapter begins.',
    citationAction: 'Keep the closing boundary review-only and do not merge VM-22 into the controlled VM-21 wave.',
    decisionType: 'boundary_confirmation',
    decisionQuestion:
      'Should the allocation pages stay as the final VM-21 batch, or should a later cleanup pass separate any last cross-reference notes?',
    decisionWhy: 'The final boundary needs to remain clear so VM-22 stays out of scope.',
    issueType: 'boundary_control_window',
    issueMessage:
      'The chapter ends immediately after the allocation language, so the closing boundary should stay review-only.',
    issueAction: 'Keep VM-22 out of the VM-21 sequence and preserve the closing boundary in the review packet.',
    issueEvidence: 'Pages 222-225 cover contract-level allocation and the chapter end before VM-22 begins later.',
    validationCheckId: 'vm21-allocation-coverage',
    validationCheckDetails: 'The selected pages capture the VM-21 allocation and closing boundary slice.',
    nextStep: 'If a reviewer wants a follow-up, confirm VM-22 remains a separate future plan and not part of this wave.',
  },
]

export const vm21BatchDefinitions = Object.fromEntries(
  vm21BatchSpecs.map((spec) => [spec.plannedBatchId, makeVm21Batch(spec)]),
)
