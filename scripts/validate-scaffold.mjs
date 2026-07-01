import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { batchDefinitions } from './batch-definitions.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')
const workBatchesRoot = path.join(repoRoot, 'data', 'work', 'batches')

const paths = {
  config: path.join(repoRoot, 'config', 'source-families.json'),
  batchManifestSchema: path.join(
    repoRoot,
    'data',
    'schemas',
    'batch-manifest.schema.json',
  ),
  sourceInventorySchema: path.join(
    repoRoot,
    'data',
    'schemas',
    'source-inventory.schema.json',
  ),
  extractionOutputSchema: path.join(
    repoRoot,
    'data',
    'schemas',
    'extraction-output.schema.json',
  ),
  reviewPacketSchema: path.join(
    repoRoot,
    'data',
    'schemas',
    'review-packet.schema.json',
  ),
  batchManifestTemplate: path.join(
    repoRoot,
    'data',
    'templates',
    'batch-manifest.template.json',
  ),
  reviewPacketTemplateJson: path.join(
    repoRoot,
    'data',
    'templates',
    'review-packet.template.json',
  ),
  reviewPacketTemplateMd: path.join(
    repoRoot,
    'data',
    'templates',
    'review-packet.template.md',
  ),
  sampleRoot: path.join(repoRoot, 'data', 'samples', 'contract-demo'),
  sampleBatchManifest: path.join(
    repoRoot,
    'data',
    'samples',
    'contract-demo',
    'batch-manifest.sample.json',
  ),
  sampleSourceInventory: path.join(
    repoRoot,
    'data',
    'samples',
    'contract-demo',
    'source-inventory.sample.json',
  ),
  sampleExtractionOutput: path.join(
    repoRoot,
    'data',
    'samples',
    'contract-demo',
    'extraction-output.sample.json',
  ),
  sampleReviewPacketJson: path.join(
    repoRoot,
    'data',
    'samples',
    'contract-demo',
    'review-packet.sample.json',
  ),
  sampleReviewPacketMd: path.join(
    repoRoot,
    'data',
    'samples',
    'contract-demo',
    'review-packet.sample.md',
  ),
  sampleReadme: path.join(
    repoRoot,
    'data',
    'samples',
    'contract-demo',
    'README.md',
  ),
  remainingSourceInventorySchema: path.join(
    repoRoot,
    'data',
    'schemas',
    'remaining-source-inventory.schema.json',
  ),
  remainingSourceInventoryTemplate: path.join(
    repoRoot,
    'data',
    'templates',
    'remaining-source-inventory.template.json',
  ),
  remainingSourceInventoryPending: path.join(
    repoRoot,
    'data',
    'manual-input',
    'remaining-source-inventory.pending.json',
  ),
  remainingSourceInventoryWorkflowMd: path.join(
    repoRoot,
    'docs',
    'processor',
    'remaining_source_inventory_workflow.md',
  ),
  vm20BatchPlanJson: path.join(repoRoot, 'config', 'vm20-batch-plan.json'),
  vm20ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'vm20_extraction_plan.md'),
  vm20ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'vm20_review_index.md'),
  supportingVmReviewIndexMd: path.join(
    repoRoot,
    'docs',
    'review',
    'supporting_vm_review_index.md',
  ),
  vm21ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'vm21_review_index.md'),
  vm22ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'vm22_review_index.md'),
  pocStatusSummaryMd: path.join(
    repoRoot,
    'docs',
    'review',
    'valuation_regulation_repository_poc_status.md',
  ),
  supportingVmBatchPlanJson: path.join(repoRoot, 'config', 'supporting-vm-batch-plan.json'),
  supportingVmExtractionPlanMd: path.join(
    repoRoot,
    'docs',
    'processor',
    'supporting_vm_chapters_extraction_plan.md',
  ),
  vm21BatchPlanJson: path.join(repoRoot, 'config', 'vm21-batch-plan.json'),
  vm21ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'vm21_extraction_plan.md'),
  vm22BatchPlanJson: path.join(repoRoot, 'config', 'vm22-batch-plan.json'),
  vm22ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'vm22_extraction_plan.md'),
  ag01BatchPlanJson: path.join(repoRoot, 'config', 'ag01-batch-plan.json'),
  ag01ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag01_extraction_plan.md'),
  ag04BatchPlanJson: path.join(repoRoot, 'config', 'ag04-batch-plan.json'),
  ag04ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag04_extraction_plan.md'),
  ag05BatchPlanJson: path.join(repoRoot, 'config', 'ag05-batch-plan.json'),
  ag05ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag05_extraction_plan.md'),
  ag05ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag05_review_index.md'),
  ag05SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag05_self_review.md'),
  ag06BatchPlanJson: path.join(repoRoot, 'config', 'ag06-batch-plan.json'),
  ag06ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag06_extraction_plan.md'),
  ag06ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag06_review_index.md'),
  ag06SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag06_self_review.md'),
  ag07BatchPlanJson: path.join(repoRoot, 'config', 'ag07-batch-plan.json'),
  ag07ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag07_extraction_plan.md'),
  ag07ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag07_review_index.md'),
  ag07SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag07_self_review.md'),
  ag08ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag08_review_index.md'),
  ag08SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag08_self_review.md'),
  ag08BatchPlanJson: path.join(repoRoot, 'config', 'ag08-batch-plan.json'),
  ag08ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag08_extraction_plan.md'),
  ag09ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag09_review_index.md'),
  ag09SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag09_self_review.md'),
  ag10ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag10_review_index.md'),
  ag10SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag10_self_review.md'),
  ag11ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag11_review_index.md'),
  ag11SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag11_self_review.md'),
  ag11BatchPlanJson: path.join(repoRoot, 'config', 'ag11-batch-plan.json'),
  ag11ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag11_extraction_plan.md'),
  ag12BatchPlanJson: path.join(repoRoot, 'config', 'ag12-batch-plan.json'),
  ag12ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag12_extraction_plan.md'),
  ag13BatchPlanJson: path.join(repoRoot, 'config', 'ag13-batch-plan.json'),
  ag13ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag13_extraction_plan.md'),
  ag14BatchPlanJson: path.join(repoRoot, 'config', 'ag14-batch-plan.json'),
  ag14ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag14_extraction_plan.md'),
  ag15BatchPlanJson: path.join(repoRoot, 'config', 'ag15-batch-plan.json'),
  ag15ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag15_extraction_plan.md'),
  ag16BatchPlanJson: path.join(repoRoot, 'config', 'ag16-batch-plan.json'),
  ag16ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag16_extraction_plan.md'),
  ag17BatchPlanJson: path.join(repoRoot, 'config', 'ag17-batch-plan.json'),
  ag17ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag17_extraction_plan.md'),
  ag18BatchPlanJson: path.join(repoRoot, 'config', 'ag18-batch-plan.json'),
  ag18ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag18_extraction_plan.md'),
  ag19BatchPlanJson: path.join(repoRoot, 'config', 'ag19-batch-plan.json'),
  ag19ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag19_extraction_plan.md'),
  ag20BatchPlanJson: path.join(repoRoot, 'config', 'ag20-batch-plan.json'),
  ag20ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag20_extraction_plan.md'),
  ag21BatchPlanJson: path.join(repoRoot, 'config', 'ag21-batch-plan.json'),
  ag21ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag21_extraction_plan.md'),
  ag22BatchPlanJson: path.join(repoRoot, 'config', 'ag22-batch-plan.json'),
  ag22ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag22_extraction_plan.md'),
  ag23BatchPlanJson: path.join(repoRoot, 'config', 'ag23-batch-plan.json'),
  ag23ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag23_extraction_plan.md'),
  ag24BatchPlanJson: path.join(repoRoot, 'config', 'ag24-batch-plan.json'),
  ag24ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag24_extraction_plan.md'),
  ag25BatchPlanJson: path.join(repoRoot, 'config', 'ag25-batch-plan.json'),
  ag25ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag25_extraction_plan.md'),
  ag26BatchPlanJson: path.join(repoRoot, 'config', 'ag26-batch-plan.json'),
  ag26ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag26_extraction_plan.md'),
  ag27BatchPlanJson: path.join(repoRoot, 'config', 'ag27-batch-plan.json'),
  ag27ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag27_extraction_plan.md'),
  ag27ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag27_review_index.md'),
  ag27SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag27_self_review.md'),
  ag28BatchPlanJson: path.join(repoRoot, 'config', 'ag28-batch-plan.json'),
  ag28ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag28_extraction_plan.md'),
  ag28ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag28_review_index.md'),
  ag28SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag28_self_review.md'),
  ag29BatchPlanJson: path.join(repoRoot, 'config', 'ag29-batch-plan.json'),
  ag29ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag29_extraction_plan.md'),
  ag29ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag29_review_index.md'),
  ag29SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag29_self_review.md'),
  ag30BatchPlanJson: path.join(repoRoot, 'config', 'ag30-batch-plan.json'),
  ag30ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag30_extraction_plan.md'),
  ag30ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag30_review_index.md'),
  ag30SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag30_self_review.md'),
  ag31BatchPlanJson: path.join(repoRoot, 'config', 'ag31-batch-plan.json'),
  ag31ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag31_extraction_plan.md'),
  ag31ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag31_review_index.md'),
  ag31SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag31_self_review.md'),
  ag32ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag32_review_index.md'),
  ag32SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag32_self_review.md'),
  ag32BatchPlanJson: path.join(repoRoot, 'config', 'ag32-batch-plan.json'),
  ag32ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag32_extraction_plan.md'),
  ag33ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag33_review_index.md'),
  ag33SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag33_self_review.md'),
  ag33BatchPlanJson: path.join(repoRoot, 'config', 'ag33-batch-plan.json'),
  ag33ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag33_extraction_plan.md'),
  ag34ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag34_review_index.md'),
  ag34SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag34_self_review.md'),
  ag34BatchPlanJson: path.join(repoRoot, 'config', 'ag34-batch-plan.json'),
  ag34ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag34_extraction_plan.md'),
  ag35ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag35_review_index.md'),
  ag35SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag35_self_review.md'),
  ag35BatchPlanJson: path.join(repoRoot, 'config', 'ag35-batch-plan.json'),
  ag35ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag35_extraction_plan.md'),
  ag36ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag36_review_index.md'),
  ag36SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag36_self_review.md'),
  ag36BatchPlanJson: path.join(repoRoot, 'config', 'ag36-batch-plan.json'),
  ag36ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag36_extraction_plan.md'),
    ag37BatchPlanJson: path.join(repoRoot, 'config', 'ag37-batch-plan.json'),
    ag37ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag37_extraction_plan.md'),
    ag37ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag37_review_index.md'),
    ag37SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag37_self_review.md'),
  ag38BatchPlanJson: path.join(repoRoot, 'config', 'ag38-batch-plan.json'),
  ag38ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag38_extraction_plan.md'),
  ag38ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag38_review_index.md'),
  ag38SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag38_self_review.md'),
  ag39BatchPlanJson: path.join(repoRoot, 'config', 'ag39-batch-plan.json'),
  ag39ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag39_extraction_plan.md'),
  ag39ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag39_review_index.md'),
  ag39SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag39_self_review.md'),
  ag40BatchPlanJson: path.join(repoRoot, 'config', 'ag40-batch-plan.json'),
  ag40ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag40_extraction_plan.md'),
  ag40ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag40_review_index.md'),
  ag40SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag40_self_review.md'),
  ag41BatchPlanJson: path.join(repoRoot, 'config', 'ag41-batch-plan.json'),
  ag41ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag41_extraction_plan.md'),
  ag41ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag41_review_index.md'),
  ag41SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag41_self_review.md'),
  ag42BatchPlanJson: path.join(repoRoot, 'config', 'ag42-batch-plan.json'),
  ag42ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag42_extraction_plan.md'),
  ag42ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag42_review_index.md'),
  ag42SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag42_self_review.md'),
  ag43BatchPlanJson: path.join(repoRoot, 'config', 'ag43-batch-plan.json'),
  ag43ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag43_extraction_plan.md'),
  ag43ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag43_review_index.md'),
  ag43SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag43_self_review.md'),
  ag44BatchPlanJson: path.join(repoRoot, 'config', 'ag44-batch-plan.json'),
  ag44ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag44_extraction_plan.md'),
  ag44ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag44_review_index.md'),
  ag44SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag44_self_review.md'),
  ag45BatchPlanJson: path.join(repoRoot, 'config', 'ag45-batch-plan.json'),
  ag45ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag45_extraction_plan.md'),
  ag45ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag45_review_index.md'),
  ag45SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag45_self_review.md'),
  ag46BatchPlanJson: path.join(repoRoot, 'config', 'ag46-batch-plan.json'),
  ag46ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag46_extraction_plan.md'),
  ag46ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag46_review_index.md'),
  ag46SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag46_self_review.md'),
  ag47BatchPlanJson: path.join(repoRoot, 'config', 'ag47-batch-plan.json'),
  ag47ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag47_extraction_plan.md'),
  ag47ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag47_review_index.md'),
  ag47SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag47_self_review.md'),
  ag48BatchPlanJson: path.join(repoRoot, 'config', 'ag48-batch-plan.json'),
  ag48ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag48_extraction_plan.md'),
  ag48ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag48_review_index.md'),
  ag48SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag48_self_review.md'),
  ag49BatchPlanJson: path.join(repoRoot, 'config', 'ag49-batch-plan.json'),
  ag49ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag49_extraction_plan.md'),
  ag49ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag49_review_index.md'),
  ag49SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag49_self_review.md'),
  ag50BatchPlanJson: path.join(repoRoot, 'config', 'ag50-batch-plan.json'),
  ag50ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag50_extraction_plan.md'),
  ag50ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag50_review_index.md'),
  ag50SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag50_self_review.md'),
  ag51BatchPlanJson: path.join(repoRoot, 'config', 'ag51-batch-plan.json'),
  ag51ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag51_extraction_plan.md'),
  ag51ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag51_review_index.md'),
  ag51SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag51_self_review.md'),
  ag52ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag52_review_index.md'),
  ag52SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag52_self_review.md'),
  ag53BatchPlanJson: path.join(repoRoot, 'config', 'ag53-batch-plan.json'),
  ag53ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag53_extraction_plan.md'),
  ag53ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag53_review_index.md'),
  ag53SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag53_self_review.md'),
  ag54BatchPlanJson: path.join(repoRoot, 'config', 'ag54-batch-plan.json'),
  ag54ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag54_extraction_plan.md'),
  ag54ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag54_review_index.md'),
  ag54SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag54_self_review.md'),
  ag55BatchPlanJson: path.join(repoRoot, 'config', 'ag55-batch-plan.json'),
  ag55ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag55_extraction_plan.md'),
  ag55ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag55_review_index.md'),
  ag55SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag55_self_review.md'),
  reg141BatchPlanJson: path.join(repoRoot, 'config', 'reg141-batch-plan.json'),
  reg141ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'reg141_extraction_plan.md'),
  reg141ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'reg141_review_index.md'),
  reg141SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'reg141_self_review.md'),
  reg102BatchPlanJson: path.join(repoRoot, 'config', 'reg102-batch-plan.json'),
  reg102ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'reg102_extraction_plan.md'),
  reg102ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'reg102_review_index.md'),
  reg102SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'reg102_self_review.md'),
  reg128BatchPlanJson: path.join(repoRoot, 'config', 'reg128-batch-plan.json'),
  reg128ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'reg128_extraction_plan.md'),
  reg128ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'reg128_review_index.md'),
  reg128SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'reg128_self_review.md'),
  reg127BatchPlanJson: path.join(repoRoot, 'config', 'reg127-batch-plan.json'),
  reg127ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'reg127_extraction_plan.md'),
  reg127ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'reg127_review_index.md'),
  reg127SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'reg127_self_review.md'),
  reg192BatchPlanJson: path.join(repoRoot, 'config', 'reg192-batch-plan.json'),
  reg192ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'reg192_extraction_plan.md'),
  reg192ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'reg192_review_index.md'),
  reg192SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'reg192_self_review.md'),
  reg210BatchPlanJson: path.join(repoRoot, 'config', 'reg210-batch-plan.json'),
  reg210ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'reg210_extraction_plan.md'),
  reg210ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'reg210_review_index.md'),
  reg210SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'reg210_self_review.md'),
  reg213BatchPlanJson: path.join(repoRoot, 'config', 'reg213-batch-plan.json'),
  reg213ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'reg213_extraction_plan.md'),
  reg213ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'reg213_review_index.md'),
  reg213SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'reg213_self_review.md'),
  reg213Amendment2ReviewIndexMd: path.join(
    repoRoot,
    'docs',
    'review',
    'reg213_amendment2_review_index.md',
  ),
  reg213Amendment2SelfReviewMd: path.join(
    repoRoot,
    'docs',
    'review',
    'reg213_amendment2_self_review.md',
  ),
  reg213Amendment1FaqBatchPlanJson: path.join(
    repoRoot,
    'config',
    'reg213-amendment1-faq-batch-plan.json',
  ),
  reg213Amendment1TextBatchPlanJson: path.join(
    repoRoot,
    'config',
    'reg213-amendment1-text-batch-plan.json',
  ),
  reg213Amendment2BatchPlanJson: path.join(
    repoRoot,
    'config',
    'reg213-amendment2-batch-plan.json',
  ),
  reg213Amendment3BatchPlanJson: path.join(
    repoRoot,
    'config',
    'reg213-amendment3-batch-plan.json',
  ),
  reg213Amendment4BatchPlanJson: path.join(
    repoRoot,
    'config',
    'reg213-amendment4-batch-plan.json',
  ),
  reg213Amendment6BatchPlanJson: path.join(
    repoRoot,
    'config',
    'reg213-amendment6-batch-plan.json',
  ),
  reg213Amendment5BatchPlanJson: path.join(
    repoRoot,
    'config',
    'reg213-amendment5-batch-plan.json',
  ),
  reg213Amendment1FaqExtractionPlanMd: path.join(
    repoRoot,
    'docs',
    'processor',
    'reg213_amendment1_faq_extraction_plan.md',
  ),
  reg213Amendment1TextExtractionPlanMd: path.join(
    repoRoot,
    'docs',
    'processor',
    'reg213_amendment1_text_extraction_plan.md',
  ),
  reg213Amendment2ExtractionPlanMd: path.join(
    repoRoot,
    'docs',
    'processor',
    'reg213_amendment2_extraction_plan.md',
  ),
  reg213Amendment3ExtractionPlanMd: path.join(
    repoRoot,
    'docs',
    'processor',
    'reg213_amendment3_extraction_plan.md',
  ),
  reg213Amendment4ExtractionPlanMd: path.join(
    repoRoot,
    'docs',
    'processor',
    'reg213_amendment4_extraction_plan.md',
  ),
  reg213Amendment6ExtractionPlanMd: path.join(
    repoRoot,
    'docs',
    'processor',
    'reg213_amendment6_extraction_plan.md',
  ),
  reg213Amendment5ExtractionPlanMd: path.join(
    repoRoot,
    'docs',
    'processor',
    'reg213_amendment5_extraction_plan.md',
  ),
  reg213Amendment6ReviewIndexMd: path.join(
    repoRoot,
    'docs',
    'review',
    'reg213_amendment6_review_index.md',
  ),
  reg213Amendment6SelfReviewMd: path.join(
    repoRoot,
    'docs',
    'review',
    'reg213_amendment6_self_review.md',
  ),
  reg213Amendment5ReviewIndexMd: path.join(
    repoRoot,
    'docs',
    'review',
    'reg213_amendment5_review_index.md',
  ),
  reg213Amendment5SelfReviewMd: path.join(
    repoRoot,
    'docs',
    'review',
    'reg213_amendment5_self_review.md',
  ),
  reg213Amendment3ReviewIndexMd: path.join(
    repoRoot,
    'docs',
    'review',
    'reg213_amendment3_review_index.md',
  ),
  reg213Amendment3SelfReviewMd: path.join(
    repoRoot,
    'docs',
    'review',
    'reg213_amendment3_self_review.md',
  ),
  reg213Amendment4ReviewIndexMd: path.join(
    repoRoot,
    'docs',
    'review',
    'reg213_amendment4_review_index.md',
  ),
  reg213Amendment4SelfReviewMd: path.join(
    repoRoot,
    'docs',
    'review',
    'reg213_amendment4_self_review.md',
  ),
  lhmanual26BatchPlanJson: path.join(repoRoot, 'config', 'lhmanual26-batch-plan.json'),
  lhmanual26ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'lhmanual26_extraction_plan.md'),
  lhmanual26ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'lhmanual26_review_index.md'),
  lhmanual26SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'lhmanual26_self_review.md'),
  reg213Amendment1FaqReviewIndexMd: path.join(
    repoRoot,
    'docs',
    'review',
    'reg213_amendment1_faq_review_index.md',
  ),
  reg213Amendment1FaqSelfReviewMd: path.join(
    repoRoot,
    'docs',
    'review',
    'reg213_amendment1_faq_self_review.md',
  ),
  reg213Amendment1TextReviewIndexMd: path.join(
    repoRoot,
    'docs',
    'review',
    'reg213_amendment1_text_review_index.md',
  ),
  reg213Amendment1TextSelfReviewMd: path.join(
    repoRoot,
    'docs',
    'review',
    'reg213_amendment1_text_self_review.md',
  ),
  modelGovernancePracticeNoteBatchPlanJson: path.join(
    repoRoot,
    'config',
    'model-governance-practice-note-batch-plan.json',
  ),
  modelGovernancePracticeNoteExtractionPlanMd: path.join(
    repoRoot,
    'docs',
    'processor',
    'model_governance_practice_note_extraction_plan.md',
  ),
  modelGovernancePracticeNoteReviewIndexMd: path.join(
    repoRoot,
    'docs',
    'review',
    'model_governance_practice_note_review_index.md',
  ),
  modelGovernancePracticeNoteSelfReviewMd: path.join(
    repoRoot,
    'docs',
    'review',
    'model_governance_practice_note_self_review.md',
  ),
  actuarialMemorandumPracticeNoteBatchPlanJson: path.join(
    repoRoot,
    'config',
    'actuarial-memorandum-practice-note-batch-plan.json',
  ),
  actuarialMemorandumPracticeNoteExtractionPlanMd: path.join(
    repoRoot,
    'docs',
    'processor',
    'actuarial_memorandum_practice_note_extraction_plan.md',
  ),
  actuarialMemorandumPracticeNoteReviewIndexMd: path.join(
    repoRoot,
    'docs',
    'review',
    'actuarial_memorandum_practice_note_review_index.md',
  ),
  actuarialMemorandumPracticeNoteSelfReviewMd: path.join(
    repoRoot,
    'docs',
    'review',
    'actuarial_memorandum_practice_note_self_review.md',
  ),
  c3Phase2PracticeNoteBatchPlanJson: path.join(
    repoRoot,
    'config',
    'c3-phase-2-practice-note-batch-plan.json',
  ),
  c3Phase2PracticeNoteExtractionPlanMd: path.join(
    repoRoot,
    'docs',
    'processor',
    'c3_phase_2_practice_note_extraction_plan.md',
  ),
  c3Phase2PracticeNoteReviewIndexMd: path.join(
    repoRoot,
    'docs',
    'review',
    'c3_phase_2_practice_note_review_index.md',
  ),
  c3Phase2PracticeNoteSelfReviewMd: path.join(
    repoRoot,
    'docs',
    'review',
    'c3_phase_2_practice_note_self_review.md',
  ),
  c3Phase2Ag43March2011PracticeNoteBatchPlanJson: path.join(
    repoRoot,
    'config',
    'c3-phase-2-ag43-2011-practice-note-batch-plan.json',
  ),
  c3Phase2Ag43March2011PracticeNoteExtractionPlanMd: path.join(
    repoRoot,
    'docs',
    'processor',
    'c3_phase_2_ag43_2011_practice_note_extraction_plan.md',
  ),
  c3Phase2Ag43March2011PracticeNoteReviewIndexMd: path.join(
    repoRoot,
    'docs',
    'review',
    'c3_phase_2_ag43_2011_practice_note_review_index.md',
  ),
  c3Phase2Ag43March2011PracticeNoteSelfReviewMd: path.join(
    repoRoot,
    'docs',
    'review',
    'c3_phase_2_ag43_2011_practice_note_self_review.md',
  ),
  modelRegulationXXXPracticeNoteBatchPlanJson: path.join(
    repoRoot,
    'config',
    'model-regulation-xxx-practice-note-batch-plan.json',
  ),
  modelRegulationXXXPracticeNoteExtractionPlanMd: path.join(
    repoRoot,
    'docs',
    'processor',
    'model_regulation_xxx_practice_note_extraction_plan.md',
  ),
  modelRegulationXXXPracticeNoteReviewIndexMd: path.join(
    repoRoot,
    'docs',
    'review',
    'model_regulation_xxx_practice_note_review_index.md',
  ),
  modelRegulationXXXPracticeNoteSelfReviewMd: path.join(
    repoRoot,
    'docs',
    'review',
    'model_regulation_xxx_practice_note_self_review.md',
  ),
  lifeReinsuranceReserveCreditPracticeNoteBatchPlanJson: path.join(
    repoRoot,
    'config',
    'life-reinsurance-reserve-credit-practice-note-batch-plan.json',
  ),
  lifeReinsuranceReserveCreditPracticeNoteExtractionPlanMd: path.join(
    repoRoot,
    'docs',
    'processor',
    'life_reinsurance_reserve_credit_practice_note_extraction_plan.md',
  ),
  lifeReinsuranceReserveCreditPracticeNoteReviewIndexMd: path.join(
    repoRoot,
    'docs',
    'review',
    'life_reinsurance_reserve_credit_practice_note_review_index.md',
  ),
  lifeReinsuranceReserveCreditPracticeNoteSelfReviewMd: path.join(
    repoRoot,
    'docs',
    'review',
    'life_reinsurance_reserve_credit_practice_note_self_review.md',
  ),
  assetAdequacyAnalysisPracticeNoteBatchPlanJson: path.join(
    repoRoot,
    'config',
    'asset-adequacy-analysis-batch-plan.json',
  ),
  assetAdequacyAnalysisPracticeNoteExtractionPlanMd: path.join(
    repoRoot,
    'docs',
    'processor',
    'asset_adequacy_analysis_extraction_plan.md',
  ),
  assetAdequacyAnalysisPracticeNoteReviewIndexMd: path.join(
    repoRoot,
    'docs',
    'review',
    'asset_adequacy_analysis_review_index.md',
  ),
  assetAdequacyAnalysisPracticeNoteSelfReviewMd: path.join(
    repoRoot,
    'docs',
    'review',
    'asset_adequacy_analysis_self_review.md',
  ),
  cia2022CapitalFCTEducationalNoteBatchPlanJson: path.join(
    repoRoot,
    'config',
    'cia-2022-capital-fct-educational-note-batch-plan.json',
  ),
  cia2022CapitalFCTEducationalNoteExtractionPlanMd: path.join(
    repoRoot,
    'docs',
    'processor',
    'cia_2022_capital_fct_educational_note_extraction_plan.md',
  ),
  cia2022CapitalFCTEducationalNoteReviewIndexMd: path.join(
    repoRoot,
    'docs',
    'review',
    'cia_2022_capital_fct_educational_note_review_index.md',
  ),
  cia2022CapitalFCTEducationalNoteSelfReviewMd: path.join(
    repoRoot,
    'docs',
    'review',
    'cia_2022_capital_fct_educational_note_self_review.md',
  ),
  cia2023FinancialConditionTestingEducationalNoteBatchPlanJson: path.join(
    repoRoot,
    'config',
    'cia-2023-financial-condition-testing-educational-note-batch-plan.json',
  ),
  cia2023FinancialConditionTestingEducationalNoteExtractionPlanMd: path.join(
    repoRoot,
    'docs',
    'processor',
    'cia_2023_financial_condition_testing_educational_note_extraction_plan.md',
  ),
  cia2023FinancialConditionTestingEducationalNoteReviewIndexMd: path.join(
    repoRoot,
    'docs',
    'review',
    'cia_2023_financial_condition_testing_educational_note_review_index.md',
  ),
  cia2023FinancialConditionTestingEducationalNoteSelfReviewMd: path.join(
    repoRoot,
    'docs',
    'review',
    'cia_2023_financial_condition_testing_educational_note_self_review.md',
  ),
  ltciPracticeNoteBatchPlanJson: path.join(
    repoRoot,
    'config',
    'ltci-practice-note-batch-plan.json',
  ),
  ltciPracticeNoteExtractionPlanMd: path.join(
    repoRoot,
    'docs',
    'processor',
    'ltci_practice_note_extraction_plan.md',
  ),
  ltciPracticeNoteReviewIndexMd: path.join(
    repoRoot,
    'docs',
    'review',
    'ltci_practice_note_review_index.md',
  ),
  ltciPracticeNoteSelfReviewMd: path.join(
    repoRoot,
    'docs',
    'review',
    'ltci_practice_note_self_review.md',
  ),
  ag26ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag26_review_index.md'),
  ag26SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag26_self_review.md'),
  ag23ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag23_review_index.md'),
  ag23SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag23_self_review.md'),
  ag24ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag24_review_index.md'),
  ag24SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag24_self_review.md'),
  ag25ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag25_review_index.md'),
  ag25SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag25_self_review.md'),
  ag22ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag22_review_index.md'),
  ag22SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag22_self_review.md'),
  ag21ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag21_review_index.md'),
  ag21SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag21_self_review.md'),
  ag12ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag12_review_index.md'),
  ag12SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag12_self_review.md'),
  ag13ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag13_review_index.md'),
  ag13SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag13_self_review.md'),
  ag14ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag14_review_index.md'),
  ag14SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag14_self_review.md'),
  ag15ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag15_review_index.md'),
  ag15SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag15_self_review.md'),
  ag16ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag16_review_index.md'),
  ag16SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag16_self_review.md'),
  ag17ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag17_review_index.md'),
  ag17SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag17_self_review.md'),
  ag18ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag18_review_index.md'),
  ag18SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag18_self_review.md'),
  ag19ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag19_review_index.md'),
  ag19SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag19_self_review.md'),
  ag20ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag20_review_index.md'),
  ag20SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag20_self_review.md'),
  ag09BatchPlanJson: path.join(repoRoot, 'config', 'ag09-batch-plan.json'),
  ag09ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag09_extraction_plan.md'),
  ag10BatchPlanJson: path.join(repoRoot, 'config', 'ag10-batch-plan.json'),
  ag10ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag10_extraction_plan.md'),
  practiceNoteReviewIndexMd: path.join(
    repoRoot,
    'docs',
    'review',
    'vm20_practice_note_review_index.md',
  ),
  practiceNoteSelfReviewMd: path.join(
    repoRoot,
    'docs',
    'review',
    'vm20_practice_note_self_review.md',
  ),
  ag03ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag03_review_index.md'),
  ag03SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag03_self_review.md'),
  ag04ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag04_review_index.md'),
  ag04SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag04_self_review.md'),
  ag01ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag01_review_index.md'),
  ag01SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag01_self_review.md'),
  ag02ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag02_review_index.md'),
  ag02SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag02_self_review.md'),
  ag02BatchPlanJson: path.join(repoRoot, 'config', 'ag02-batch-plan.json'),
  ag02ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag02_extraction_plan.md'),
  practiceNoteBatchPlanJson: path.join(
    repoRoot,
    'config',
    'vm20-practice-note-batch-plan.json',
  ),
  practiceNoteExtractionPlanMd: path.join(
    repoRoot,
    'docs',
    'processor',
    'vm20_practice_note_extraction_plan.md',
  ),
  ag03BatchPlanJson: path.join(repoRoot, 'config', 'ag03-batch-plan.json'),
  ag03ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag03_extraction_plan.md'),
}

const requiredFiles = [
  'README.md',
  'package.json',
  'config/source-families.json',
  'data/README.md',
  'data/templates/batch-manifest.template.json',
  'data/templates/review-packet.template.json',
  'data/templates/review-packet.template.md',
  'data/schemas/batch-manifest.schema.json',
  'data/schemas/source-inventory.schema.json',
  'data/schemas/extraction-output.schema.json',
  'data/schemas/review-packet.schema.json',
  'data/samples/contract-demo/README.md',
  'data/samples/contract-demo/batch-manifest.sample.json',
  'data/samples/contract-demo/source-inventory.sample.json',
  'data/samples/contract-demo/extraction-output.sample.json',
  'data/samples/contract-demo/review-packet.sample.json',
  'data/samples/contract-demo/review-packet.sample.md',
  'docs/processor/PROJECT_BRIEF.md',
  'docs/processor/supporting_vm_chapters_extraction_plan.md',
  'docs/processor/vm21_extraction_plan.md',
  'docs/codex/skills/README.md',
  'docs/codex/skills/SOURCE_BOUND_EXTRACTION_SKILL.md',
  'docs/codex/skills/LEARNER_FACING_PROMOTION_GATE_SKILL.md',
  'docs/codex/skills/RAG_READINESS_SKILL.md',
  'docs/codex/skills/EXCEPTION_FIRST_REVIEW_SKILL.md',
  'docs/codex/skills/LOW_QUALITY_PDF_TEXT_LAYER_SKILL.md',
  'docs/codex/skills/CROSS_DOMAIN_PORTABILITY_SKILL.md',
  'docs/codex/skills/PRIVACY_AND_DATA_HYGIENE_SKILL.md',
  'docs/codex/skills/APP_EXPORT_CONTRACT_SKILL.md',
  'docs/codex/skills/SESSION_HANDOFF_SKILL.md',
  'docs/project-state/CURRENT_STATE.md',
  'docs/project-state/HANDOFF_PROCESS.md',
  'docs/project-state/SOURCE_GUARDRAILS.md',
  'docs/project-state/DECISIONS.md',
  'docs/project-state/NEXT_ACTIONS.md',
  'docs/project-state/SESSION_LOG.md',
  'docs/processor/vm20_extraction_plan.md',
  'docs/processor/vm20_practice_note_extraction_plan.md',
  'docs/processor/ag03_extraction_plan.md',
  'docs/processor/ag01_extraction_plan.md',
  'docs/processor/ag04_extraction_plan.md',
  'docs/processor/ag05_extraction_plan.md',
  'docs/processor/ag06_extraction_plan.md',
  'docs/processor/ag07_extraction_plan.md',
  'docs/processor/ag08_extraction_plan.md',
  'docs/processor/ag41_extraction_plan.md',
  'docs/processor/ag43_extraction_plan.md',
  'config/ag43-batch-plan.json',
  'scripts/ag43-batch-definitions.mjs',
  'docs/processor/vm22_extraction_plan.md',
  'docs/review/vm20_review_index.md',
  'docs/review/supporting_vm_review_index.md',
  'docs/review/vm21_review_index.md',
  'docs/review/vm22_review_index.md',
  'docs/review/vm20_practice_note_review_index.md',
  'docs/review/vm20_practice_note_self_review.md',
  'docs/review/ag03_review_index.md',
  'docs/review/ag03_self_review.md',
  'docs/review/ag01_review_index.md',
  'docs/review/ag01_self_review.md',
  'docs/review/ag02_review_index.md',
  'docs/review/ag02_self_review.md',
  'docs/review/ag04_review_index.md',
  'docs/review/ag04_self_review.md',
  'docs/review/ag05_review_index.md',
  'docs/review/ag05_self_review.md',
  'docs/review/ag06_review_index.md',
  'docs/review/ag06_self_review.md',
  'docs/review/ag07_review_index.md',
  'docs/review/ag07_self_review.md',
  'docs/review/ag08_review_index.md',
  'docs/review/ag08_self_review.md',
  'docs/review/ag09_review_index.md',
  'docs/review/ag09_self_review.md',
  'docs/review/ag10_review_index.md',
  'docs/review/ag10_self_review.md',
  'docs/review/ag11_review_index.md',
  'docs/review/ag11_self_review.md',
  'docs/review/ag12_review_index.md',
  'docs/review/ag12_self_review.md',
  'docs/review/ag13_review_index.md',
  'docs/review/ag13_self_review.md',
  'docs/review/ag14_review_index.md',
  'docs/review/ag14_self_review.md',
  'docs/processor/ag11_extraction_plan.md',
  'config/ag11-batch-plan.json',
  'scripts/ag11-batch-definitions.mjs',
  'docs/processor/ag12_extraction_plan.md',
  'config/ag12-batch-plan.json',
  'scripts/ag12-batch-definitions.mjs',
  'docs/processor/ag13_extraction_plan.md',
  'config/ag13-batch-plan.json',
  'scripts/ag13-batch-definitions.mjs',
  'docs/processor/ag14_extraction_plan.md',
  'config/ag14-batch-plan.json',
  'scripts/ag14-batch-definitions.mjs',
  'docs/review/ag15_review_index.md',
  'docs/review/ag15_self_review.md',
  'docs/review/ag16_review_index.md',
  'docs/review/ag16_self_review.md',
  'docs/review/ag17_review_index.md',
  'docs/review/ag17_self_review.md',
  'docs/review/ag18_review_index.md',
  'docs/review/ag18_self_review.md',
  'docs/review/ag19_review_index.md',
  'docs/review/ag19_self_review.md',
  'docs/review/ag20_review_index.md',
  'docs/review/ag20_self_review.md',
  'docs/processor/ag20_extraction_plan.md',
  'config/ag20-batch-plan.json',
  'scripts/ag20-batch-definitions.mjs',
  'docs/processor/ag21_extraction_plan.md',
  'config/ag21-batch-plan.json',
  'scripts/ag21-batch-definitions.mjs',
  'docs/processor/ag22_extraction_plan.md',
  'config/ag22-batch-plan.json',
  'scripts/ag22-batch-definitions.mjs',
  'docs/processor/ag23_extraction_plan.md',
  'config/ag23-batch-plan.json',
  'scripts/ag23-batch-definitions.mjs',
  'docs/processor/ag24_extraction_plan.md',
  'config/ag24-batch-plan.json',
  'scripts/ag24-batch-definitions.mjs',
  'docs/processor/ag25_extraction_plan.md',
  'config/ag25-batch-plan.json',
  'scripts/ag25-batch-definitions.mjs',
  'docs/processor/ag26_extraction_plan.md',
  'config/ag26-batch-plan.json',
  'scripts/ag26-batch-definitions.mjs',
  'docs/processor/ag27_extraction_plan.md',
  'config/ag27-batch-plan.json',
  'scripts/ag27-batch-definitions.mjs',
  'docs/processor/ag28_extraction_plan.md',
  'config/ag28-batch-plan.json',
  'scripts/ag28-batch-definitions.mjs',
  'docs/processor/ag29_extraction_plan.md',
  'config/ag29-batch-plan.json',
  'scripts/ag29-batch-definitions.mjs',
  'docs/processor/ag30_extraction_plan.md',
  'config/ag30-batch-plan.json',
  'scripts/ag30-batch-definitions.mjs',
  'docs/review/ag30_review_index.md',
  'docs/review/ag30_self_review.md',
  'docs/processor/ag31_extraction_plan.md',
  'config/ag31-batch-plan.json',
  'scripts/ag31-batch-definitions.mjs',
  'docs/processor/ag32_extraction_plan.md',
  'config/ag32-batch-plan.json',
  'scripts/ag32-batch-definitions.mjs',
  'docs/review/ag31_review_index.md',
  'docs/review/ag31_self_review.md',
  'docs/review/ag27_review_index.md',
  'docs/review/ag27_self_review.md',
  'docs/review/ag28_review_index.md',
  'docs/review/ag28_self_review.md',
  'docs/review/ag29_review_index.md',
  'docs/review/ag29_self_review.md',
  'docs/review/ag26_review_index.md',
  'docs/review/ag26_self_review.md',
  'docs/review/ag25_review_index.md',
  'docs/review/ag25_self_review.md',
  'docs/review/ag23_review_index.md',
  'docs/review/ag23_self_review.md',
  'docs/review/ag24_review_index.md',
  'docs/review/ag24_self_review.md',
  'docs/review/ag22_review_index.md',
  'docs/review/ag22_self_review.md',
  'docs/review/ag21_review_index.md',
  'docs/review/ag21_self_review.md',
  'docs/processor/ag15_extraction_plan.md',
  'config/ag15-batch-plan.json',
  'scripts/ag15-batch-definitions.mjs',
  'docs/processor/ag16_extraction_plan.md',
  'config/ag16-batch-plan.json',
  'scripts/ag16-batch-definitions.mjs',
  'docs/processor/ag17_extraction_plan.md',
  'config/ag17-batch-plan.json',
  'scripts/ag17-batch-definitions.mjs',
  'docs/processor/ag18_extraction_plan.md',
  'config/ag18-batch-plan.json',
  'scripts/ag18-batch-definitions.mjs',
  'docs/processor/ag19_extraction_plan.md',
  'config/ag19-batch-plan.json',
  'scripts/ag19-batch-definitions.mjs',
  'docs/processor/ag10_extraction_plan.md',
  'config/ag10-batch-plan.json',
  'scripts/ag10-batch-definitions.mjs',
  'docs/processor/ag09_extraction_plan.md',
  'config/ag09-batch-plan.json',
  'scripts/ag09-batch-definitions.mjs',
  'docs/processor/ag02_extraction_plan.md',
  'docs/review/valuation_regulation_repository_poc_status.md',
  'docs/review/reg213_review_index.md',
  'docs/review/reg213_self_review.md',
  'config/reg213-amendment1-text-batch-plan.json',
  'docs/processor/reg213_amendment1_text_extraction_plan.md',
  'scripts/reg213-amendment1-text-batch-definitions.mjs',
  'config/reg213-amendment2-batch-plan.json',
  'docs/processor/reg213_amendment2_extraction_plan.md',
  'scripts/reg213-amendment2-batch-definitions.mjs',
  'docs/review/reg213_amendment1_faq_review_index.md',
  'docs/review/reg213_amendment1_faq_self_review.md',
  'docs/review/reg213_amendment3_review_index.md',
  'docs/review/reg213_amendment3_self_review.md',
  'docs/review/reg213_amendment5_review_index.md',
  'docs/review/reg213_amendment5_self_review.md',
  'docs/review/reg213_amendment6_review_index.md',
  'docs/review/reg213_amendment6_self_review.md',
  'docs/processor/lhmanual26_extraction_plan.md',
  'config/lhmanual26-batch-plan.json',
  'scripts/lhmanual26-batch-definitions.mjs',
  'docs/review/lhmanual26_review_index.md',
  'docs/review/lhmanual26_self_review.md',
  'docs/processor/reg213_amendment1_faq_extraction_plan.md',
  'docs/processor/reg213_amendment3_extraction_plan.md',
  'docs/processor/reg213_amendment6_extraction_plan.md',
  'docs/processor/reg213_amendment5_extraction_plan.md',
  'config/reg213-amendment1-faq-batch-plan.json',
  'config/reg213-amendment3-batch-plan.json',
  'config/reg213-amendment6-batch-plan.json',
  'config/reg213-amendment5-batch-plan.json',
  'scripts/reg213-amendment1-faq-batch-definitions.mjs',
  'scripts/reg213-amendment3-batch-definitions.mjs',
  'scripts/reg213-amendment6-batch-definitions.mjs',
  'scripts/reg213-amendment5-batch-definitions.mjs',
  'config/supporting-vm-batch-plan.json',
  'config/vm21-batch-plan.json',
  'config/vm20-batch-plan.json',
  'config/vm20-practice-note-batch-plan.json',
  'config/ag03-batch-plan.json',
  'config/ag01-batch-plan.json',
  'config/ag04-batch-plan.json',
  'config/ag05-batch-plan.json',
  'config/ag06-batch-plan.json',
  'config/ag07-batch-plan.json',
  'config/ag08-batch-plan.json',
  'config/ag02-batch-plan.json',
  'config/vm22-batch-plan.json',
  'scripts/vm21-batch-definitions.mjs',
  'scripts/vm22-batch-definitions.mjs',
  'scripts/vm20-practice-note-batch-definitions.mjs',
  'scripts/ag03-batch-definitions.mjs',
  'scripts/ag01-batch-definitions.mjs',
  'scripts/ag04-batch-definitions.mjs',
  'scripts/ag05-batch-definitions.mjs',
  'scripts/ag06-batch-definitions.mjs',
  'scripts/ag07-batch-definitions.mjs',
  'scripts/ag08-batch-definitions.mjs',
  'scripts/ag02-batch-definitions.mjs',
  'scripts/bootstrap-small-batch.mjs',
  'scripts/validate-scaffold.mjs',
  'scripts/run-pilot-batch.mjs',
]

const requiredReviewHeadings = [
  '## Batch Summary',
  '## Source Files Processed',
  '## Extracted Items',
  '## Required Human Decisions',
  '## Exceptions/Flags',
  '## Citation/Source-Reference Issues',
  '## Unresolved Issues',
  '## Promotion Recommendation',
  '## RAG Readiness',
  '## App Export Readiness',
  '## Not Approved / Learner-facing Status',
  '## Reviewer Notes',
]

const problems = []
const warnings = []

const isObject = (value) =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
const hasString = (value) => typeof value === 'string' && value.trim().length > 0
const isBoolean = (value) => typeof value === 'boolean'
const isIntegerOrNull = (value) =>
  value === null || Number.isInteger(value)

const readText = async (filePath) => fs.readFile(filePath, 'utf8')
const readJson = async (filePath) => JSON.parse(await readText(filePath))

const exists = async (filePath) => {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

const getBatchPaths = (batchId) => {
  const batchRoot = path.join(workBatchesRoot, batchId)
  const reviewRoot = path.join(batchRoot, 'review')
  return {
    batchRoot,
    reviewRoot,
    batchManifest: path.join(batchRoot, 'batch-manifest.json'),
    sourceInventory: path.join(batchRoot, 'source-inventory.json'),
    chunkManifest: path.join(batchRoot, 'chunk-manifest.json'),
    extractionOutput: path.join(batchRoot, 'extraction-output.json'),
    reviewPacketJson: path.join(reviewRoot, 'review-packet.json'),
    reviewPacketMd: path.join(reviewRoot, 'review-packet.md'),
    validationReport: path.join(batchRoot, 'validation-report.json'),
    unresolvedIssuesSummary: path.join(batchRoot, 'unresolved-issues-summary.md'),
  }
}

const requireFile = async (relativePath) => {
  const fullPath = path.join(repoRoot, relativePath)
  if (!(await exists(fullPath))) {
    problems.push(`Missing required file: ${relativePath}`)
  }
}

const expectArray = (value, label, allowEmpty = true) => {
  if (!Array.isArray(value)) {
    problems.push(`${label} must be an array`)
    return false
  }
  if (!allowEmpty && value.length === 0) {
    problems.push(`${label} must not be empty`)
    return false
  }
  return true
}

const expectObject = (value, label) => {
  if (!isObject(value)) {
    problems.push(`${label} must be an object`)
    return false
  }
  return true
}

const validateSchemaEnvelope = (schema, label) => {
  expectObject(schema, label)
  if (!schema) return
  if (schema.$schema !== 'https://json-schema.org/draft/2020-12/schema') {
    problems.push(`${label}: unexpected $schema`)
  }
  if (!hasString(schema.$id)) {
    problems.push(`${label}: missing $id`)
  }
  if (!hasString(schema.title)) {
    problems.push(`${label}: missing title`)
  }
  if (schema.type !== 'object') {
    problems.push(`${label}: top-level type must be object`)
  }
  if (!isObject(schema.properties)) {
    problems.push(`${label}: missing properties object`)
  }
  if (!Array.isArray(schema.required)) {
    problems.push(`${label}: missing required array`)
  }
  if (schema.properties?.schemaVersion?.const !== '1.0') {
    problems.push(`${label}: schemaVersion const must be 1.0`)
  }
}

const expectedBatchOutputs = [
  'source_inventory',
  'chunk_manifest',
  'review_packet',
  'approved_promoted_export',
  'app_ready_export',
  'validation_report',
  'unresolved_issues_summary',
]

const pilotExpectedOutputs = [
  'source_inventory',
  'chunk_manifest',
  'review_packet',
  'validation_report',
  'unresolved_issues_summary',
]

const validateBatchManifestLike = (manifest, label, options = {}) => {
  const { mode = 'template' } = options
  const isPilot = mode === 'pilot'
  const isScaffold = mode === 'scaffold'

  if (!expectObject(manifest, label)) return

  const sourceFamilies = manifest.sourceFamilies
  const sourceFiles = manifest.sourceFiles
  const processingIntent = manifest.processingIntent
  const boundaries = manifest.boundaries
  const reviewStatus = manifest.reviewStatus

  if (manifest.schemaVersion !== '1.0') {
    problems.push(`${label}: schemaVersion must be 1.0`)
  }
  if (!hasString(manifest.batchId)) {
    problems.push(`${label}: missing batchId`)
  }
  if (!hasString(manifest.projectName)) {
    problems.push(`${label}: missing projectName`)
  }
  if (!hasString(manifest.projectPurpose)) {
    problems.push(`${label}: missing projectPurpose`)
  }
  if (
    !['draft', 'queued', 'processing', 'review_pending', 'complete', 'blocked'].includes(
      manifest.status,
    )
  ) {
    problems.push(`${label}: invalid status`)
  }
  if (!expectArray(sourceFamilies, `${label}.sourceFamilies`, false)) return
  if (!expectArray(sourceFiles, `${label}.sourceFiles`)) return
  if (!expectObject(processingIntent, `${label}.processingIntent`)) return
  if (!expectObject(boundaries, `${label}.boundaries`)) return
  if (!expectObject(reviewStatus, `${label}.reviewStatus`)) return

  if (isPilot && sourceFiles.length === 0) {
    problems.push(`${label}: pilot batch must include at least one source file`)
  }
  if (isPilot && manifest.status !== 'review_pending' && manifest.status !== 'complete') {
    problems.push(`${label}: pilot batch status must be review_pending or complete`)
  }
  if (isPilot && boundaries.noRealProcessing !== false) {
    problems.push(`${label}.boundaries: noRealProcessing must be false for a real pilot batch`)
  }
  if (isScaffold && boundaries.noRealProcessing !== true) {
    problems.push(`${label}.boundaries: noRealProcessing must be true for scaffold validation`)
  }
  if (isPilot && processingIntent.appExportRequested !== false) {
    problems.push(`${label}.processingIntent: appExportRequested must be false for the pilot batch`)
  }
  if (!isPilot && processingIntent.appExportRequested !== true) {
    problems.push(`${label}.processingIntent: appExportRequested must be true for scaffold validation`)
  }
  if (isPilot && !sourceFiles.every((sourceFile) => sourceFile.processingStatus === 'selected')) {
    problems.push(`${label}.sourceFiles: pilot source files must be marked selected`)
  }
  if (isPilot && !sourceFiles.every((sourceFile) => hasString(sourceFile.sourceReference))) {
    problems.push(`${label}.sourceFiles: pilot source files must include sourceReference values`)
  }

  sourceFamilies.forEach((family, index) => {
    const familyLabel = `${label}.sourceFamilies[${index}]`
    if (!expectObject(family, familyLabel)) return
    if (!hasString(family.sourceFamilyId)) {
      problems.push(`${familyLabel}: missing sourceFamilyId`)
    }
    if (!hasString(family.label)) {
      problems.push(`${familyLabel}: missing label`)
    }
    if (!hasString(family.domainId)) {
      problems.push(`${familyLabel}: missing domainId`)
    }
  })

  sourceFiles.forEach((sourceFile, index) => {
    const sourceLabel = `${label}.sourceFiles[${index}]`
    if (!expectObject(sourceFile, sourceLabel)) return
    ;['sourceId', 'filename', 'sourceFamilyId', 'documentType', 'processingStatus'].forEach(
      (field) => {
        if (!hasString(sourceFile[field])) {
          problems.push(`${sourceLabel}: missing ${field}`)
        }
      },
    )
    if (sourceFile.versionDate !== undefined && sourceFile.versionDate !== null && !hasString(sourceFile.versionDate)) {
      problems.push(`${sourceLabel}: versionDate must be a date string or null`)
    }
    if (!isIntegerOrNull(sourceFile.pageCount)) {
      problems.push(`${sourceLabel}: pageCount must be an integer or null`)
    }
  })

  if (!hasString(processingIntent.mode)) {
    problems.push(`${label}.processingIntent: missing mode`)
  }
  if (!expectArray(processingIntent.targetDomains, `${label}.processingIntent.targetDomains`, false)) {
    return
  }
  if (!expectArray(processingIntent.pipelineStages, `${label}.processingIntent.pipelineStages`, false)) {
    return
  }
  if (!isBoolean(processingIntent.smallPilot)) {
    problems.push(`${label}.processingIntent: smallPilot must be boolean`)
  }
  if (processingIntent.learnerFacingBlocked !== true) {
    problems.push(`${label}.processingIntent: learnerFacingBlocked must be true`)
  }
  if (processingIntent.ragReadinessRequested !== true) {
    problems.push(`${label}.processingIntent: ragReadinessRequested must be true`)
  }
  if (processingIntent.reviewStrategy !== 'exception_first') {
    problems.push(`${label}.processingIntent: reviewStrategy must be exception_first`)
  }
  if (isPilot) {
    ;['inventory', 'extraction', 'chunking', 'labeling', 'review', 'validation'].forEach((stage) => {
      if (!processingIntent.pipelineStages.includes(stage)) {
        problems.push(`${label}.processingIntent: pilot batch must include pipeline stage ${stage}`)
      }
    })
    if (processingIntent.pipelineStages.includes('promotion')) {
      problems.push(`${label}.processingIntent: pilot batch must not include promotion stage`)
    }
    if (processingIntent.pipelineStages.includes('export')) {
      problems.push(`${label}.processingIntent: pilot batch must not include export stage`)
    }
  }

  if (boundaries.rawMaterialExternal !== true) {
    problems.push(`${label}.boundaries: rawMaterialExternal must be true`)
  }
  if (boundaries.gitExcludesRawFiles !== true) {
    problems.push(`${label}.boundaries: gitExcludesRawFiles must be true`)
  }
  if (boundaries.noLearnerFacingPromotion !== true) {
    problems.push(`${label}.boundaries: noLearnerFacingPromotion must be true`)
  }
  if (!hasString(boundaries.rawSourceRoot)) {
    problems.push(`${label}.boundaries: missing rawSourceRoot`)
  }
  if (!hasString(boundaries.domainConfigPath)) {
    problems.push(`${label}.boundaries: missing domainConfigPath`)
  }

  if (!Array.isArray(manifest.expectedOutputs)) {
    problems.push(`${label}: expectedOutputs must be an array`)
  } else {
    const requiredOutputs = isPilot ? pilotExpectedOutputs : expectedBatchOutputs
    requiredOutputs.forEach((output) => {
      if (!manifest.expectedOutputs.includes(output)) {
        problems.push(`${label}: expectedOutputs missing ${output}`)
      }
    })
    if (isPilot) {
      ['approved_promoted_export', 'app_ready_export'].forEach((output) => {
        if (manifest.expectedOutputs.includes(output)) {
          problems.push(`${label}: pilot batch must not expect ${output}`)
        }
      })
    }
  }

  if (reviewStatus.defaultStatus !== 'draft_candidate') {
    problems.push(`${label}.reviewStatus: defaultStatus must be draft_candidate`)
  }
  if (reviewStatus.reviewStrategy !== 'exception_first') {
    problems.push(`${label}.reviewStatus: reviewStrategy must be exception_first`)
  }
  if (reviewStatus.reviewFocus !== 'exceptions_only') {
    problems.push(`${label}.reviewStatus: reviewFocus must be exceptions_only`)
  }
  if (reviewStatus.learnerFacingAllowed !== false) {
    problems.push(`${label}.reviewStatus: learnerFacingAllowed must be false`)
  }
  if (reviewStatus.appReadyAllowed !== false) {
    problems.push(`${label}.reviewStatus: appReadyAllowed must be false`)
  }
  if (reviewStatus.reviewPacketRequired !== true) {
    problems.push(`${label}.reviewStatus: reviewPacketRequired must be true`)
  }
}

const validateChunkManifestLike = (chunkManifest, label) => {
  if (!expectObject(chunkManifest, label)) return
  if (chunkManifest.schemaVersion !== '1.0') {
    problems.push(`${label}: schemaVersion must be 1.0`)
  }
  ;['chunkManifestId', 'batchId', 'generatedAt', 'processingStatus'].forEach((field) => {
    if (!hasString(chunkManifest[field])) {
      problems.push(`${label}: missing ${field}`)
    }
  })
  if (!expectArray(chunkManifest.sourceFiles, `${label}.sourceFiles`, false)) return
  if (!expectArray(chunkManifest.chunks, `${label}.chunks`, false)) return
  chunkManifest.sourceFiles.forEach((item, index) => {
    const itemLabel = `${label}.sourceFiles[${index}]`
    if (!expectObject(item, itemLabel)) return
    ;['sourceId', 'filename', 'sourceFamilyId', 'domainId', 'documentType', 'processingStatus', 'notes'].forEach(
      (field) => {
        if (!hasString(item[field])) {
          problems.push(`${itemLabel}: missing ${field}`)
        }
      },
    )
    if (!hasString(item.sourceReference)) {
      problems.push(`${itemLabel}: missing sourceReference`)
    }
  })
  chunkManifest.chunks.forEach((chunk, index) => {
    const chunkLabel = `${label}.chunks[${index}]`
    if (!expectObject(chunk, chunkLabel)) return
    ;[
      'stableId',
      'chunkId',
      'sourceId',
      'sourceFamilyId',
      'domainId',
      'documentType',
      'sourceReference',
      'sourcePath',
      'chunkText',
      'summary',
      'confidence',
      'reviewStatus',
      'nonLearnerFacingNotes',
    ].forEach((field) => {
      if (!hasString(chunk[field])) {
        problems.push(`${chunkLabel}: missing ${field}`)
      }
    })
    if (!expectArray(chunk.keywords, `${chunkLabel}.keywords`, false)) return
    if (!expectArray(chunk.citations, `${chunkLabel}.citations`, false)) return
    if (!expectArray(chunk.reviewFlags, `${chunkLabel}.reviewFlags`, false)) return
    if (!hasString(chunk.pageReference) && !hasString(chunk.sectionReference) && !hasString(chunk.lineReference)) {
      problems.push(`${chunkLabel}: missing pageReference, sectionReference, or lineReference`)
    }
    if (chunk.learnerFacingEligible !== false) {
      problems.push(`${chunkLabel}: learnerFacingEligible must be false`)
    }
    if (chunk.appReadyEligible !== false) {
      problems.push(`${chunkLabel}: appReadyEligible must be false`)
    }
  })
}

const validateSourceInventoryLike = (inventory, label) => {
  if (!expectObject(inventory, label)) return
  if (inventory.schemaVersion !== '1.0') {
    problems.push(`${label}: schemaVersion must be 1.0`)
  }
  ;['inventoryId', 'batchId', 'generatedAt', 'sourceRoot'].forEach((field) => {
    if (!hasString(inventory[field])) {
      problems.push(`${label}: missing ${field}`)
    }
  })
  if (!expectArray(inventory.sourceFamilies, `${label}.sourceFamilies`, false)) return
  if (!expectArray(inventory.items, `${label}.items`)) return

  inventory.sourceFamilies.forEach((family, index) => {
    const familyLabel = `${label}.sourceFamilies[${index}]`
    if (!expectObject(family, familyLabel)) return
    if (!hasString(family.sourceFamilyId)) {
      problems.push(`${familyLabel}: missing sourceFamilyId`)
    }
    if (!hasString(family.label)) {
      problems.push(`${familyLabel}: missing label`)
    }
    if (!hasString(family.domainId)) {
      problems.push(`${familyLabel}: missing domainId`)
    }
  })

  inventory.items.forEach((item, index) => {
    const itemLabel = `${label}.items[${index}]`
    if (!expectObject(item, itemLabel)) return
    ;['sourceId', 'filename', 'filePath', 'sourceFamilyId', 'domainId', 'documentType', 'processingStatus', 'sourceReference', 'notes'].forEach(
      (field) => {
        if (!hasString(item[field])) {
          problems.push(`${itemLabel}: missing ${field}`)
        }
      },
    )
    if (
      ![
        'discovered',
        'inventoried',
        'selected',
        'excluded',
        'queued_for_processing',
        'needs_human_review',
        'processed',
        'error',
      ].includes(item.processingStatus)
    ) {
      problems.push(`${itemLabel}: invalid processingStatus`)
    }
    if (item.pageCount !== undefined && !isIntegerOrNull(item.pageCount)) {
      problems.push(`${itemLabel}: pageCount must be an integer or null`)
    }
    if (item.versionDate !== undefined && item.versionDate !== null && !hasString(item.versionDate)) {
      problems.push(`${itemLabel}: versionDate must be a date string or null`)
    }
  })
}

const validateRemainingSourceInventoryTemplateLike = (inventory, label) => {
  if (!expectObject(inventory, label)) return
  ;['inventory_created_at', 'inventory_created_by', 'raw_source_root'].forEach((field) => {
    if (!hasString(inventory[field])) {
      problems.push(`${label}: missing ${field}`)
    }
  })
  if (!expectArray(inventory.source_items, `${label}.source_items`)) return
  if (inventory.source_items.length < 1) {
    problems.push(`${label}: source_items should include one example item`)
  }
  inventory.source_items.forEach((item, index) => {
    const itemLabel = `${label}.source_items[${index}]`
    if (!expectObject(item, itemLabel)) return
    ;['source_id', 'filename', 'relative_path', 'source_family', 'notes', 'defer_reason'].forEach(
      (field) => {
        if (!hasString(item[field])) {
          problems.push(`${itemLabel}: missing ${field}`)
        }
      },
    )
    if (!['active', 'historical', 'withdrawn', 'repealed', 'superseded', 'companion-only', 'non-binding practice note', 'regulation', 'unclear'].includes(item.status_hint)) {
      problems.push(`${itemLabel}: invalid status_hint`)
    }
    if (!['yes', 'no', 'unclear'].includes(item.already_processed_hint)) {
      problems.push(`${itemLabel}: invalid already_processed_hint`)
    }
    if (!['yes', 'no', 'unclear'].includes(item.safe_to_process_hint)) {
      problems.push(`${itemLabel}: invalid safe_to_process_hint`)
    }
    if (!['highest', 'high', 'medium', 'low', 'hold', 'unspecified'].includes(item.priority_hint)) {
      problems.push(`${itemLabel}: invalid priority_hint`)
    }
  })
}

const validateRemainingSourceInventoryPendingLike = (inventory, label) => {
  if (!expectObject(inventory, label)) return
  ;['inventory_created_at', 'inventory_created_by', 'raw_source_root'].forEach((field) => {
    if (typeof inventory[field] !== 'string') {
      problems.push(`${label}: missing ${field}`)
    }
  })
  if (!expectArray(inventory.source_items, `${label}.source_items`)) return
  if (inventory.source_items.length !== 0) {
    problems.push(`${label}: source_items must stay empty in the tracked pending placeholder`)
  }
}

const validateRemainingSourceInventoryWorkflowMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredPhrases = [
    'Missing inventory means no new extraction should start.',
    'Do not guess the next source unit from memory.',
    'Do not infer unlisted files.',
    'review-only',
  ]
  const missingPhrases = requiredPhrases.filter((phrase) => !text.includes(phrase))
  if (missingPhrases.length > 0) {
    throw new Error(`${label}:\n- missing required phrase: ${missingPhrases.join('\n- missing required phrase: ')}`)
  }
}

const validateExtractionOutputLike = (output, label) => {
  if (!expectObject(output, label)) return
  if (output.schemaVersion !== '1.0') {
    problems.push(`${label}: schemaVersion must be 1.0`)
  }
  ;['extractionRunId', 'batchId', 'generatedAt', 'extractionMethod'].forEach((field) => {
    if (!hasString(output[field])) {
      problems.push(`${label}: missing ${field}`)
    }
  })
  if (output.processingStatus !== 'extracted' && output.processingStatus !== 'review_pending' && output.processingStatus !== 'draft') {
    problems.push(`${label}: invalid processingStatus`)
  }
  if (!expectArray(output.sourceGroups, `${label}.sourceGroups`, false)) return

  output.sourceGroups.forEach((group, groupIndex) => {
    const groupLabel = `${label}.sourceGroups[${groupIndex}]`
    if (!expectObject(group, groupLabel)) return
    ;['sourceId', 'filename', 'filePath', 'sourceFamilyId', 'domainId', 'documentType', 'processingStatus', 'sourceReference'].forEach(
      (field) => {
        if (!hasString(group[field])) {
          problems.push(`${groupLabel}: missing ${field}`)
        }
      },
    )
    if (!expectArray(group.extractedItems, `${groupLabel}.extractedItems`, false)) return

    group.extractedItems.forEach((item, itemIndex) => {
      const itemLabel = `${groupLabel}.extractedItems[${itemIndex}]`
      if (!expectObject(item, itemLabel)) return
      ;[
        'stableId',
        'extractedItemId',
        'itemKind',
        'sourceId',
        'sourceFamilyId',
        'domainId',
        'documentType',
        'sourceReference',
        'sourcePath',
        'chunkText',
        'summary',
        'nonLearnerFacingNotes',
      ].forEach((field) => {
        if (!hasString(item[field])) {
          problems.push(`${itemLabel}: missing ${field}`)
        }
      })
      if (!hasString(item.pageReference) && !hasString(item.sectionReference) && !hasString(item.lineReference)) {
        problems.push(`${itemLabel}: missing pageReference, sectionReference, or lineReference`)
      }
      if (!expectArray(item.keywords, `${itemLabel}.keywords`, false)) return
      if (!expectArray(item.citations, `${itemLabel}.citations`, false)) return
      if (!expectArray(item.reviewFlags, `${itemLabel}.reviewFlags`, false)) return
      if (item.confidence !== 'low' && item.confidence !== 'medium' && item.confidence !== 'high') {
        problems.push(`${itemLabel}: invalid confidence`)
      }
      if (item.reviewStatus === undefined || item.reviewStatus === null) {
        problems.push(`${itemLabel}: missing reviewStatus`)
      }
      if (item.learnerFacingEligible !== false) {
        problems.push(`${itemLabel}: learnerFacingEligible must be false`)
      }
      if (item.appReadyEligible !== false) {
        problems.push(`${itemLabel}: appReadyEligible must be false`)
      }
      if (item.citations.length === 0) {
        problems.push(`${itemLabel}: citations must not be empty`)
      }
      item.citations.forEach((citation, citationIndex) => {
        const citationLabel = `${itemLabel}.citations[${citationIndex}]`
        if (!expectObject(citation, citationLabel)) return
        if (!hasString(citation.citationText)) {
          problems.push(`${citationLabel}: missing citationText`)
        }
      })
    })
  })
}

const validateReviewPacketLike = (packet, label) => {
  if (!expectObject(packet, label)) return
  if (packet.schemaVersion !== '1.0') {
    problems.push(`${label}: schemaVersion must be 1.0`)
  }
  ;['packetId', 'batchId', 'generatedAt'].forEach((field) => {
    if (!hasString(packet[field])) {
      problems.push(`${label}: missing ${field}`)
    }
  })
  if (packet.reviewMode !== 'exception_first') {
    problems.push(`${label}: reviewMode must be exception_first`)
  }
  if (!expectObject(packet.batchSummary, `${label}.batchSummary`)) return
  if (!expectArray(packet.sourceFilesProcessed, `${label}.sourceFilesProcessed`)) return
  if (!expectArray(packet.extractedItems, `${label}.extractedItems`)) return
  if (!expectArray(packet.requiredHumanDecisions, `${label}.requiredHumanDecisions`)) return
  if (!expectArray(packet.exceptionsAndFlags, `${label}.exceptionsAndFlags`)) return
  if (!expectArray(packet.citationIssues, `${label}.citationIssues`)) return
  if (!expectArray(packet.unresolvedIssues, `${label}.unresolvedIssues`)) return
  if (!expectObject(packet.promotionRecommendation, `${label}.promotionRecommendation`)) return
  if (!expectObject(packet.learnerFacingStatus, `${label}.learnerFacingStatus`)) return
  if (!expectObject(packet.ragReadiness, `${label}.ragReadiness`)) return
  if (!expectObject(packet.appExportReadiness, `${label}.appExportReadiness`)) return

  if (!hasString(packet.batchSummary.batchName)) {
    problems.push(`${label}.batchSummary: missing batchName`)
  }
  if (!expectArray(packet.batchSummary.sourceFamilies, `${label}.batchSummary.sourceFamilies`)) return
  if (!hasString(packet.batchSummary.processingIntent)) {
    problems.push(`${label}.batchSummary: missing processingIntent`)
  }
  if (!Number.isInteger(packet.batchSummary.sourceFileCount)) {
    problems.push(`${label}.batchSummary: sourceFileCount must be an integer`)
  }
  if (!Number.isInteger(packet.batchSummary.extractedItemCount)) {
    problems.push(`${label}.batchSummary: extractedItemCount must be an integer`)
  }
  if (!hasString(packet.batchSummary.summary)) {
    problems.push(`${label}.batchSummary: missing summary`)
  }

  if (!['not_recommended', 'review_candidate', 'approved_for_promotion', 'blocked'].includes(packet.promotionRecommendation.status)) {
    problems.push(`${label}.promotionRecommendation: invalid status`)
  }
  if (packet.learnerFacingStatus.ready !== false) {
    problems.push(`${label}.learnerFacingStatus: ready must be false`)
  }
  if (!hasString(packet.learnerFacingStatus.reason)) {
    problems.push(`${label}.learnerFacingStatus: missing reason`)
  }
  if (packet.appExportReadiness.ready !== false) {
    problems.push(`${label}.appExportReadiness: ready must be false`)
  }
  if (!hasString(packet.appExportReadiness.reason)) {
    problems.push(`${label}.appExportReadiness: missing reason`)
  }
  if (packet.ragReadiness.ready !== false) {
    problems.push(`${label}.ragReadiness: ready must be false`)
  }
  if (!hasString(packet.ragReadiness.reason)) {
    problems.push(`${label}.ragReadiness: missing reason`)
  }

  if (packet.sourceFilesProcessed.length !== packet.batchSummary.sourceFileCount) {
    problems.push(`${label}: sourceFileCount does not match sourceFilesProcessed length`)
  }
  if (packet.extractedItems.length !== packet.batchSummary.extractedItemCount) {
    problems.push(`${label}: extractedItemCount does not match extractedItems length`)
  }
  if (packet.exceptionsAndFlags.length !== packet.batchSummary.exceptionCount) {
    problems.push(`${label}: exceptionCount does not match exceptionsAndFlags length`)
  }

  packet.sourceFilesProcessed.forEach((item, index) => {
    const itemLabel = `${label}.sourceFilesProcessed[${index}]`
    if (!expectObject(item, itemLabel)) return
    ;['sourceId', 'filename', 'sourceReference', 'sourceFamilyId', 'documentType', 'processingStatus', 'notes'].forEach((field) => {
      if (!hasString(item[field])) {
        problems.push(`${itemLabel}: missing ${field}`)
      }
    })
  })

  packet.extractedItems.forEach((item, index) => {
    const itemLabel = `${label}.extractedItems[${index}]`
    if (!expectObject(item, itemLabel)) return
    ;['stableId', 'sourceId', 'sourceFamilyId', 'documentType', 'sourceReference', 'sourcePath', 'summary', 'notes'].forEach((field) => {
      if (!hasString(item[field])) {
        problems.push(`${itemLabel}: missing ${field}`)
      }
    })
    if (!expectArray(item.reviewFlags, `${itemLabel}.reviewFlags`, false)) return
    if (!hasString(item.pageReference) && !hasString(item.sectionReference) && !hasString(item.lineReference)) {
      problems.push(`${itemLabel}: missing pageReference, sectionReference, or lineReference`)
    }
    if (item.learnerFacingEligible !== false) {
      problems.push(`${itemLabel}: learnerFacingEligible must be false`)
    }
    if (item.appReadyEligible !== false) {
      problems.push(`${itemLabel}: appReadyEligible must be false`)
    }
  })

  packet.requiredHumanDecisions.forEach((item, index) => {
    const itemLabel = `${label}.requiredHumanDecisions[${index}]`
    if (!expectObject(item, itemLabel)) return
    ;['decisionId', 'decisionType', 'question', 'whyItMatters', 'recommendedOwner'].forEach((field) => {
      if (!hasString(item[field])) {
        problems.push(`${itemLabel}: missing ${field}`)
      }
    })
  })

  packet.exceptionsAndFlags.forEach((item, index) => {
    const itemLabel = `${label}.exceptionsAndFlags[${index}]`
    if (!expectObject(item, itemLabel)) return
    ;['flagId', 'severity', 'flagType', 'message'].forEach((field) => {
      if (!hasString(item[field])) {
        problems.push(`${itemLabel}: missing ${field}`)
      }
    })
  })

  packet.citationIssues.forEach((item, index) => {
    const itemLabel = `${label}.citationIssues[${index}]`
    if (!expectObject(item, itemLabel)) return
    ;['issueId', 'issueType', 'details', 'recommendedAction'].forEach((field) => {
      if (!hasString(item[field])) {
        problems.push(`${itemLabel}: missing ${field}`)
      }
    })
  })

  packet.unresolvedIssues.forEach((item, index) => {
    const itemLabel = `${label}.unresolvedIssues[${index}]`
    if (!expectObject(item, itemLabel)) return
    ;['issueId', 'severity', 'issueType', 'message', 'recommendedAction'].forEach((field) => {
      if (!hasString(item[field])) {
        problems.push(`${itemLabel}: missing ${field}`)
      }
    })
    if (['high', 'critical'].includes(item.severity) && !hasString(item.sourceId) && !hasString(item.itemId)) {
      problems.push(`${itemLabel}: high-severity unresolved issues should identify a source or item`)
    }
  })
}

const validateReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  requiredReviewHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  if (!text.includes('not approved')) {
    problems.push(`${label}: must state not approved`)
  }
}

const validateValidationReportLike = (report, label) => {
  if (!expectObject(report, label)) return
  if (report.schemaVersion !== '1.0') {
    problems.push(`${label}: schemaVersion must be 1.0`)
  }
  ;['reportId', 'batchId', 'generatedAt', 'status'].forEach((field) => {
    if (!hasString(report[field])) {
      problems.push(`${label}: missing ${field}`)
    }
  })
  if (report.status !== 'passed') {
    problems.push(`${label}: status must be passed`)
  }
  if (!expectObject(report.checkedArtifacts, `${label}.checkedArtifacts`)) return
  if (!expectArray(report.checks, `${label}.checks`, false)) return
  if (!expectObject(report.pilotSummary, `${label}.pilotSummary`)) return
  if (!Array.isArray(report.notes) || report.notes.length === 0) {
    problems.push(`${label}: notes must be a non-empty array`)
  }
  ;['batchManifest', 'sourceInventory', 'chunkManifest', 'extractionOutput', 'reviewPacketJson', 'reviewPacketMd', 'unresolvedIssuesSummary'].forEach(
    (field) => {
      if (!hasString(report.checkedArtifacts[field])) {
        problems.push(`${label}.checkedArtifacts: missing ${field}`)
      }
    },
  )
  ;['selectedSourceCount', 'extractedItemCount', 'reviewOnlyItemCount', 'exceptionCount'].forEach((field) => {
    if (!Number.isInteger(report.pilotSummary[field])) {
      problems.push(`${label}.pilotSummary: ${field} must be an integer`)
    }
  })
  report.checks.forEach((check, index) => {
    const checkLabel = `${label}.checks[${index}]`
    if (!expectObject(check, checkLabel)) return
    ;['checkId', 'status', 'details'].forEach((field) => {
      if (!hasString(check[field])) {
        problems.push(`${checkLabel}: missing ${field}`)
      }
    })
    if (!['passed', 'needs_review', 'failed'].includes(check.status)) {
      problems.push(`${checkLabel}: invalid status`)
    }
  })
}

const validateUnresolvedIssuesSummary = async (filePath, label, unresolvedIssues = []) => {
  const text = await readText(filePath)
  if (!text.trim()) {
    problems.push(`${label}: must not be empty`)
  }
  if (!text.includes('review-only')) {
    problems.push(`${label}: must mention review-only handling`)
  }
  if (!text.includes('No app-ready export')) {
    problems.push(`${label}: must mention the app-ready export status`)
  }
  for (const issue of unresolvedIssues) {
    if (issue?.issueId && !text.includes(issue.issueId)) {
      problems.push(`${label}: must mention unresolved issue ${issue.issueId}`)
    }
  }
}

const validateVm20PlanLike = (plan, label) => {
  if (!expectObject(plan, label)) return
  if (plan.planVersion !== '1.0') {
    problems.push(`${label}: planVersion must be 1.0`)
  }
  if (!hasString(plan.planId)) {
    problems.push(`${label}: missing planId`)
  }
  if (plan.status !== 'planned') {
    problems.push(`${label}: status must be planned`)
  }
  if (!expectObject(plan.sourceScope, `${label}.sourceScope`)) return
  if (!hasString(plan.sourceScope.primarySourceFile)) {
    problems.push(`${label}.sourceScope: missing primarySourceFile`)
  }
  if (!hasString(plan.sourceScope.sourceFamilyId)) {
    problems.push(`${label}.sourceScope: missing sourceFamilyId`)
  }
  if (!hasString(plan.sourceScope.sourceTitle)) {
    problems.push(`${label}.sourceScope: missing sourceTitle`)
  }
  if (!hasString(plan.sourceScope.sourceReference)) {
    problems.push(`${label}.sourceScope: missing sourceReference`)
  }
  if (!hasString(plan.sourceScope.domainId)) {
    problems.push(`${label}.sourceScope: missing domainId`)
  }
  if (!hasString(plan.sourceScope.rawSourceRoot)) {
    problems.push(`${label}.sourceScope: missing rawSourceRoot`)
  }
  if (!expectObject(plan.sourceScope.knownObservedWindow, `${label}.sourceScope.knownObservedWindow`)) return
  if (!expectArray(plan.sourceScope.knownObservedWindow.pageRange, `${label}.sourceScope.knownObservedWindow.pageRange`, false)) return
  if (plan.sourceScope.knownObservedWindow.pageRange.length !== 2) {
    problems.push(`${label}.sourceScope.knownObservedWindow.pageRange must contain exactly two page bounds`)
  }
  if (!expectArray(plan.sourceScope.boundaries, `${label}.sourceScope.boundaries`, false)) return
  if (!expectArray(plan.sourceScope.exclusions, `${label}.sourceScope.exclusions`, false)) return
  if (!expectArray(plan.topicMap, `${label}.topicMap`, false)) return
  if (!expectArray(plan.proposedBatches, `${label}.proposedBatches`, false)) return
  if (!expectObject(plan.reviewStandards, `${label}.reviewStandards`)) return
  if (!expectObject(plan.promotionGates, `${label}.promotionGates`)) return
  if (!expectObject(plan.validationImplications, `${label}.validationImplications`)) return

  const topicIds = new Set()
  plan.topicMap.forEach((topic, index) => {
    const topicLabel = `${label}.topicMap[${index}]`
    if (!expectObject(topic, topicLabel)) return
    ;['topicId', 'label', 'reviewComplexity'].forEach((field) => {
      if (!hasString(topic[field])) {
        problems.push(`${topicLabel}: missing ${field}`)
      }
    })
    if (!expectArray(topic.expectedIssueTypes, `${topicLabel}.expectedIssueTypes`, false)) return
    if (!expectArray(topic.crossReferenceWatchlist, `${topicLabel}.crossReferenceWatchlist`, false)) return
    topicIds.add(topic.topicId)
  })

  plan.proposedBatches.forEach((batch, index) => {
    const batchLabel = `${label}.proposedBatches[${index}]`
    if (!expectObject(batch, batchLabel)) return
    ;['plannedBatchId', 'title', 'reviewComplexity', 'rationale'].forEach((field) => {
      if (!hasString(batch[field])) {
        problems.push(`${batchLabel}: missing ${field}`)
      }
    })
    if (!expectArray(batch.topicIds, `${batchLabel}.topicIds`, false)) return
    if (!expectArray(batch.expectedIssueTypes, `${batchLabel}.expectedIssueTypes`, false)) return
    if (!expectObject(batch.pageTarget, `${batchLabel}.pageTarget`)) return
    if (batch.reviewOnlyByDefault !== true) {
      problems.push(`${batchLabel}: reviewOnlyByDefault must be true`)
    }
    batch.topicIds.forEach((topicId) => {
      if (!topicIds.has(topicId)) {
        problems.push(`${batchLabel}: unknown topicId ${topicId}`)
      }
    })
    if (!expectArray(batch.pageTarget.knownWindow, `${batchLabel}.pageTarget.knownWindow`, false)) return
    if (batch.pageTarget.knownWindow.length !== 2) {
      problems.push(`${batchLabel}.pageTarget.knownWindow must contain exactly two page bounds`)
    }
  })

  if (!hasString(plan.reviewStandards.regulatoryRequirement)) {
    problems.push(`${label}.reviewStandards: missing regulatoryRequirement`)
  }
  if (!hasString(plan.reviewStandards.backgroundContent)) {
    problems.push(`${label}.reviewStandards: missing backgroundContent`)
  }
  if (!hasString(plan.reviewStandards.actuarialJudgment)) {
    problems.push(`${label}.reviewStandards: missing actuarialJudgment`)
  }
  if (!hasString(plan.reviewStandards.crossReferenceHandling)) {
    problems.push(`${label}.reviewStandards: missing crossReferenceHandling`)
  }
  if (!hasString(plan.reviewStandards.staleOrCompanionGuidance)) {
    problems.push(`${label}.reviewStandards: missing staleOrCompanionGuidance`)
  }

  if (!expectArray(plan.promotionGates.learnerFacing, `${label}.promotionGates.learnerFacing`, false)) return
  if (!expectArray(plan.promotionGates.appReady, `${label}.promotionGates.appReady`, false)) return
  if (!expectArray(plan.promotionGates.ragReady, `${label}.promotionGates.ragReady`, false)) return
  if (!expectArray(plan.validationImplications.currentChecksNeeded, `${label}.validationImplications.currentChecksNeeded`, false)) return
  if (!expectArray(plan.validationImplications.futureChecksSuggested, `${label}.validationImplications.futureChecksSuggested`, false)) return
  if (!expectArray(plan.validationImplications.scriptImplications, `${label}.validationImplications.scriptImplications`, false)) return
}

const validateVm20PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Batch-002 Lesson',
    '## Section / Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  if (!text.includes('review-only')) {
    problems.push(`${label}: must mention review-only handling`)
  }
  if (!text.includes('pages 45-51')) {
    problems.push(`${label}: must mention the observed batch-002 window`)
  }
  if (!text.includes('pbr_data_valuation_manual_2026.pdf')) {
    problems.push(`${label}: must mention the primary source file`)
  }
}

const validateVm20ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall VM-20 Extraction Status',
    '## Batch Table',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Known Caution Areas',
    '## Recommended Review Order',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
  ;[
    'batch-003',
    'batch-004',
    'batch-005',
    'batch-006',
    'batch-007',
    'batch-008',
    'batch-009',
    'batch-010',
    'batch-011',
    'batch-012',
  ].forEach((batchId) => {
    if (!text.includes(batchId)) {
      problems.push(`${label}: must reference ${batchId}`)
    }
  })
}

const validateSupportingVmPlanLike = (plan, label) => {
  if (!expectObject(plan, label)) return
  if (plan.planVersion !== '1.0') {
    problems.push(`${label}: planVersion must be 1.0`)
  }
  if (!hasString(plan.planId)) {
    problems.push(`${label}: missing planId`)
  }
  if (plan.status !== 'planned') {
    problems.push(`${label}: status must be planned`)
  }
  if (!expectObject(plan.sourceScope, `${label}.sourceScope`)) return
  if (!hasString(plan.sourceScope.primarySourceFile)) {
    problems.push(`${label}.sourceScope: missing primarySourceFile`)
  }
  if (plan.sourceScope.primarySourceFile !== 'pbr_data_valuation_manual_2026.pdf') {
    problems.push(`${label}.sourceScope: unexpected primarySourceFile`)
  }
  if (!hasString(plan.sourceScope.sourceFamilyId)) {
    problems.push(`${label}.sourceScope: missing sourceFamilyId`)
  }
  if (!hasString(plan.sourceScope.sourceTitle)) {
    problems.push(`${label}.sourceScope: missing sourceTitle`)
  }
  if (!hasString(plan.sourceScope.sourceReference)) {
    problems.push(`${label}.sourceScope: missing sourceReference`)
  }
  if (!hasString(plan.sourceScope.domainId)) {
    problems.push(`${label}.sourceScope: missing domainId`)
  }
  if (!hasString(plan.sourceScope.rawSourceRoot)) {
    problems.push(`${label}.sourceScope: missing rawSourceRoot`)
  }
  if (!expectArray(plan.sourceScope.observedChapterWindows, `${label}.sourceScope.observedChapterWindows`, false)) return
  if (!expectArray(plan.sourceScope.boundaries, `${label}.sourceScope.boundaries`, false)) return
  if (!expectArray(plan.sourceScope.exclusions, `${label}.sourceScope.exclusions`, false)) return
  if (!plan.sourceScope.boundaries.some((entry) => typeof entry === 'string' && entry.includes('VM-21') && entry.includes('VM-22'))) {
    problems.push(`${label}.sourceScope.boundaries: must mention VM-21 and VM-22 out-of-scope handling`)
  }
  if (!plan.sourceScope.exclusions.some((entry) => typeof entry === 'string' && entry.includes('learner-facing'))) {
    problems.push(`${label}.sourceScope.exclusions: must mention learner-facing exclusion`)
  }

  if (!expectArray(plan.chapterMap, `${label}.chapterMap`, false)) return
  if (!expectArray(plan.proposedBatches, `${label}.proposedBatches`, false)) return
  if (!expectObject(plan.reviewStandards, `${label}.reviewStandards`)) return
  if (!expectObject(plan.promotionGates, `${label}.promotionGates`)) return
  if (!expectObject(plan.validationImplications, `${label}.validationImplications`)) return

  const chapterIds = new Set()
  plan.chapterMap.forEach((chapter, index) => {
    const chapterLabel = `${label}.chapterMap[${index}]`
    if (!expectObject(chapter, chapterLabel)) return
    ;['chapterId', 'label', 'reviewComplexity', 'boundaryNote'].forEach((field) => {
      if (!hasString(chapter[field])) {
        problems.push(`${chapterLabel}: missing ${field}`)
      }
    })
    if (!expectArray(chapter.pageRange, `${chapterLabel}.pageRange`, false)) return
    if (chapter.pageRange.length !== 2) {
      problems.push(`${chapterLabel}.pageRange must contain exactly two page bounds`)
    }
    if (!expectArray(chapter.expectedIssueTypes, `${chapterLabel}.expectedIssueTypes`, false)) return
    if (!expectArray(chapter.crossReferenceWatchlist, `${chapterLabel}.crossReferenceWatchlist`, false)) return
    chapterIds.add(chapter.chapterId)
  })

  const observedChapterIds = new Set()
  plan.sourceScope.observedChapterWindows.forEach((window, index) => {
    const windowLabel = `${label}.sourceScope.observedChapterWindows[${index}]`
    if (!expectObject(window, windowLabel)) return
    ;['chapterId', 'note'].forEach((field) => {
      if (!hasString(window[field])) {
        problems.push(`${windowLabel}: missing ${field}`)
      }
    })
    if (!expectArray(window.pageRange, `${windowLabel}.pageRange`, false)) return
    if (window.pageRange.length !== 2) {
      problems.push(`${windowLabel}.pageRange must contain exactly two page bounds`)
    }
    observedChapterIds.add(window.chapterId)
    if (!chapterIds.has(window.chapterId)) {
      problems.push(`${windowLabel}: unknown chapterId ${window.chapterId}`)
    }
  })

  chapterIds.forEach((chapterId) => {
    if (!observedChapterIds.has(chapterId)) {
      problems.push(`${label}.sourceScope.observedChapterWindows: missing chapterId ${chapterId}`)
    }
  })

  plan.proposedBatches.forEach((batch, index) => {
    const batchLabel = `${label}.proposedBatches[${index}]`
    if (!expectObject(batch, batchLabel)) return
    ;['plannedBatchId', 'title', 'reviewComplexity', 'rationale', 'automationFit'].forEach((field) => {
      if (!hasString(batch[field])) {
        problems.push(`${batchLabel}: missing ${field}`)
      }
    })
    if (!expectArray(batch.chapterIds, `${batchLabel}.chapterIds`, false)) return
    if (!expectArray(batch.expectedIssueTypes, `${batchLabel}.expectedIssueTypes`, false)) return
    if (!expectObject(batch.pageTarget, `${batchLabel}.pageTarget`)) return
    if (batch.reviewOnlyByDefault !== true) {
      problems.push(`${batchLabel}: reviewOnlyByDefault must be true`)
    }
    if (batch.sameStopConditionsAsVm20 !== true) {
      problems.push(`${batchLabel}: sameStopConditionsAsVm20 must be true`)
    }
    batch.chapterIds.forEach((chapterId) => {
      if (!chapterIds.has(chapterId)) {
        problems.push(`${batchLabel}: unknown chapterId ${chapterId}`)
      }
    })
    if (!expectArray(batch.pageTarget.knownWindow, `${batchLabel}.pageTarget.knownWindow`, false)) return
    if (batch.pageTarget.knownWindow.length !== 2) {
      problems.push(`${batchLabel}.pageTarget.knownWindow must contain exactly two page bounds`)
    }
  })

  ;[
    'regulatoryRequirement',
    'definitionOrTerminology',
    'reportingRequirement',
    'documentationExpectation',
    'governanceControlExpectation',
    'crossReferenceMapping',
    'explanatoryBackground',
    'staleSupersededCompanionGuidance',
    'requiresHumanInterpretation',
  ].forEach((field) => {
    if (!hasString(plan.reviewStandards[field])) {
      problems.push(`${label}.reviewStandards: missing ${field}`)
    }
  })

  if (plan.promotionGates.defaultState !== 'review_only') {
    problems.push(`${label}.promotionGates.defaultState must be review_only`)
  }
  if (!expectArray(plan.promotionGates.learnerFacing, `${label}.promotionGates.learnerFacing`, false)) return
  if (!expectArray(plan.promotionGates.appReady, `${label}.promotionGates.appReady`, false)) return
  if (!expectArray(plan.promotionGates.ragReady, `${label}.promotionGates.ragReady`, false)) return
  if (!expectArray(plan.validationImplications.currentChecksNeeded, `${label}.validationImplications.currentChecksNeeded`, false)) return
  if (!expectArray(plan.validationImplications.futureChecksSuggested, `${label}.validationImplications.futureChecksSuggested`, false)) return
  if (!expectArray(plan.validationImplications.scriptImplications, `${label}.validationImplications.scriptImplications`, false)) return
}

const validateSupportingVmPlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Chapter / Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'VM-21',
    'VM-22',
    'VM-01',
    'VM-02',
    'VM-25',
    'VM-26',
    'VM-30',
    'VM-31',
    'batch-013',
    'batch-014',
    'batch-015',
    'batch-016',
    'batch-017',
    'batch-018',
    'batch-019',
    'batch-020',
    'batch-021',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateVm21PlanLike = (plan, label) => {
  if (!expectObject(plan, label)) return
  if (plan.planVersion !== '1.0') {
    problems.push(`${label}: planVersion must be 1.0`)
  }
  if (!hasString(plan.planId)) {
    problems.push(`${label}: missing planId`)
  }
  if (plan.status !== 'planned') {
    problems.push(`${label}: status must be planned`)
  }
  if (!expectObject(plan.sourceScope, `${label}.sourceScope`)) return
  if (plan.sourceScope.primarySourceFile !== 'pbr_data_valuation_manual_2026.pdf') {
    problems.push(`${label}.sourceScope: unexpected primarySourceFile`)
  }
  if (!hasString(plan.sourceScope.sourceFamilyId)) {
    problems.push(`${label}.sourceScope: missing sourceFamilyId`)
  }
  if (!hasString(plan.sourceScope.sourceTitle)) {
    problems.push(`${label}.sourceScope: missing sourceTitle`)
  }
  if (!hasString(plan.sourceScope.sourceReference)) {
    problems.push(`${label}.sourceScope: missing sourceReference`)
  }
  if (!hasString(plan.sourceScope.domainId)) {
    problems.push(`${label}.sourceScope: missing domainId`)
  }
  if (!hasString(plan.sourceScope.rawSourceRoot)) {
    problems.push(`${label}.sourceScope: missing rawSourceRoot`)
  }
  if (!expectArray(plan.sourceScope.confirmedPageRange, `${label}.sourceScope.confirmedPageRange`, false)) return
  if (plan.sourceScope.confirmedPageRange.length !== 2) {
    problems.push(`${label}.sourceScope.confirmedPageRange must contain exactly two page bounds`)
  }
  if (
    plan.sourceScope.confirmedPageRange[0] !== 143 ||
    plan.sourceScope.confirmedPageRange[1] !== 225
  ) {
    problems.push(`${label}.sourceScope.confirmedPageRange must be [143, 225]`)
  }
  if (!expectArray(plan.sourceScope.boundaries, `${label}.sourceScope.boundaries`, false)) return
  if (!expectArray(plan.sourceScope.exclusions, `${label}.sourceScope.exclusions`, false)) return
  if (
    !plan.sourceScope.boundaries.some(
      (entry) =>
        typeof entry === 'string' && entry.includes('VM-22') && entry.includes('out of scope'),
    )
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention VM-22 out-of-scope handling`)
  }
  if (
    !plan.sourceScope.exclusions.some(
      (entry) => typeof entry === 'string' && entry.includes('learner-facing'),
    )
  ) {
    problems.push(`${label}.sourceScope.exclusions: must mention learner-facing exclusion`)
  }

  if (!expectArray(plan.topicMap, `${label}.topicMap`, false)) return
  if (!expectArray(plan.proposedBatches, `${label}.proposedBatches`, false)) return
  if (!expectObject(plan.reviewStandards, `${label}.reviewStandards`)) return
  if (!expectObject(plan.promotionGates, `${label}.promotionGates`)) return
  if (!expectObject(plan.validationImplications, `${label}.validationImplications`)) return

  const topicIds = new Set()
  plan.topicMap.forEach((topic, index) => {
    const topicLabel = `${label}.topicMap[${index}]`
    if (!expectObject(topic, topicLabel)) return
    ;['topicId', 'label', 'reviewComplexity', 'boundaryNote'].forEach((field) => {
      if (!hasString(topic[field])) {
        problems.push(`${topicLabel}: missing ${field}`)
      }
    })
    if (!expectArray(topic.pageRange, `${topicLabel}.pageRange`, false)) return
    if (topic.pageRange.length !== 2) {
      problems.push(`${topicLabel}.pageRange must contain exactly two page bounds`)
    }
    if (!expectArray(topic.expectedIssueTypes, `${topicLabel}.expectedIssueTypes`, false)) return
    if (!expectArray(topic.crossReferenceWatchlist, `${topicLabel}.crossReferenceWatchlist`, false)) return
    topicIds.add(topic.topicId)
  })

  const observedTopicIds = new Set()
  plan.proposedBatches.forEach((batch, index) => {
    const batchLabel = `${label}.proposedBatches[${index}]`
    if (!expectObject(batch, batchLabel)) return
    ;['plannedBatchId', 'title', 'reviewComplexity', 'rationale', 'automationFit'].forEach((field) => {
      if (!hasString(batch[field])) {
        problems.push(`${batchLabel}: missing ${field}`)
      }
    })
    if (!expectArray(batch.topicIds, `${batchLabel}.topicIds`, false)) return
    if (!expectArray(batch.expectedIssueTypes, `${batchLabel}.expectedIssueTypes`, false)) return
    if (!expectObject(batch.pageTarget, `${batchLabel}.pageTarget`)) return
    if (batch.reviewOnlyByDefault !== true) {
      problems.push(`${batchLabel}: reviewOnlyByDefault must be true`)
    }
    if (batch.sameStopConditionsAsVm20 !== true) {
      problems.push(`${batchLabel}: sameStopConditionsAsVm20 must be true`)
    }
    batch.topicIds.forEach((topicId) => {
      if (!topicIds.has(topicId)) {
        problems.push(`${batchLabel}: unknown topicId ${topicId}`)
      }
      observedTopicIds.add(topicId)
    })
    if (!expectArray(batch.pageTarget.knownWindow, `${batchLabel}.pageTarget.knownWindow`, false)) return
    if (batch.pageTarget.knownWindow.length !== 2) {
      problems.push(`${batchLabel}.pageTarget.knownWindow must contain exactly two page bounds`)
    }
    if (batch.pageTarget.knownWindow[0] < 143 || batch.pageTarget.knownWindow[1] > 225) {
      problems.push(`${batchLabel}.pageTarget.knownWindow must stay within the confirmed VM-21 page range`)
    }
  })

  topicIds.forEach((topicId) => {
    if (!observedTopicIds.has(topicId)) {
      problems.push(`${label}.proposedBatches: missing batch coverage for topicId ${topicId}`)
    }
  })

  ;[
    'regulatoryRequirement',
    'definitionOrTerminology',
    'reserveMethodStructure',
    'calculationStructure',
    'formulaContext',
    'prescribedAssumption',
    'companyOrPrudentEstimateAssumption',
    'scenarioOrStochasticRequirement',
    'assetModelingJudgment',
    'hedgingOrRiskMitigation',
    'reportingRequirement',
    'documentationExpectation',
    'crossReferenceMapping',
    'backgroundContent',
    'boundaryControlWindow',
    'requiresHumanInterpretation',
    'staleSupersededCompanionGuidance',
  ].forEach((field) => {
    if (!hasString(plan.reviewStandards[field])) {
      problems.push(`${label}.reviewStandards: missing ${field}`)
    }
  })

  if (plan.promotionGates.defaultState !== 'review_only') {
    problems.push(`${label}.promotionGates.defaultState must be review_only`)
  }
  if (!expectArray(plan.promotionGates.learnerFacing, `${label}.promotionGates.learnerFacing`, false)) return
  if (!expectArray(plan.promotionGates.appReady, `${label}.promotionGates.appReady`, false)) return
  if (!expectArray(plan.promotionGates.ragReady, `${label}.promotionGates.ragReady`, false)) return
  if (!expectArray(plan.validationImplications.currentChecksNeeded, `${label}.validationImplications.currentChecksNeeded`, false)) return
  if (!expectArray(plan.validationImplications.futureChecksSuggested, `${label}.validationImplications.futureChecksSuggested`, false)) return
  if (!expectArray(plan.validationImplications.scriptImplications, `${label}.validationImplications.scriptImplications`, false)) return
}

const validateVm21PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Chapter / Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'VM-21',
    'VM-22',
    'batch-022',
    'batch-023',
    'batch-024',
    'batch-025',
    'batch-026',
    'batch-027',
    'batch-028',
    'batch-029',
    'batch-030',
    'batch-031',
    'batch-032',
    'batch-033',
    'batch-034',
    'batch-035',
    'batch-036',
    'batch-037',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateVm22PlanLike = (plan, label) => {
  if (!expectObject(plan, label)) return

  if (plan.planId !== 'vm22-control-plan') {
    problems.push(`${label}: planId must be vm22-control-plan`)
  }
  if (plan.planVersion !== '1.0') {
    problems.push(`${label}: planVersion must be 1.0`)
  }
  if (plan.status !== 'planned') {
    problems.push(`${label}: status must be planned`)
  }
  if (!expectObject(plan.sourceScope, `${label}.sourceScope`)) return
  if (plan.sourceScope.sourceFamilyId !== 'valuation_manual_pdfs') {
    problems.push(`${label}.sourceScope: sourceFamilyId must be valuation_manual_pdfs`)
  }
  if (plan.sourceScope.primarySourceFile !== 'pbr_data_valuation_manual_2026.pdf') {
    problems.push(`${label}.sourceScope: primarySourceFile must be pbr_data_valuation_manual_2026.pdf`)
  }
  if (!hasString(plan.sourceScope.sourceTitle)) {
    problems.push(`${label}.sourceScope: missing sourceTitle`)
  }
  if (!hasString(plan.sourceScope.sourceReference)) {
    problems.push(`${label}.sourceScope: missing sourceReference`)
  }
  if (!hasString(plan.sourceScope.domainId)) {
    problems.push(`${label}.sourceScope: missing domainId`)
  }
  if (!hasString(plan.sourceScope.rawSourceRoot)) {
    problems.push(`${label}.sourceScope: missing rawSourceRoot`)
  }
  if (!expectArray(plan.sourceScope.confirmedPageRange, `${label}.sourceScope.confirmedPageRange`, false)) return
  if (plan.sourceScope.confirmedPageRange.length !== 2) {
    problems.push(`${label}.sourceScope.confirmedPageRange must contain exactly two page bounds`)
  }
  if (plan.sourceScope.confirmedPageRange[0] !== 227 || plan.sourceScope.confirmedPageRange[1] !== 318) {
    problems.push(`${label}.sourceScope.confirmedPageRange must be [227, 318]`)
  }
  if (!expectArray(plan.sourceScope.boundaries, `${label}.sourceScope.boundaries`, false)) return
  if (!expectArray(plan.sourceScope.exclusions, `${label}.sourceScope.exclusions`, false)) return
  if (
    !plan.sourceScope.boundaries.some(
      (entry) => typeof entry === 'string' && entry.includes('VM-20') && entry.includes('out of scope'),
    )
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention VM-20 out-of-scope handling`)
  }
  if (
    !plan.sourceScope.boundaries.some(
      (entry) => typeof entry === 'string' && entry.includes('VM-21') && entry.includes('out of scope'),
    )
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention VM-21 out-of-scope handling`)
  }
  if (
    !plan.sourceScope.boundaries.some(
      (entry) => typeof entry === 'string' && entry.includes('VM-25') && entry.includes('page 319'),
    )
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention the VM-25 boundary on page 319`)
  }
  ;['VM-30', 'VM-31', 'VM-G', 'VM-C', 'VM-M'].forEach((chapterId) => {
    if (
      !plan.sourceScope.boundaries.some(
        (entry) => typeof entry === 'string' && entry.includes(chapterId) && entry.includes('review-only'),
      )
    ) {
      problems.push(`${label}.sourceScope.boundaries: must mention ${chapterId} review-only handling`)
    }
  })
  if (
    !plan.sourceScope.exclusions.some(
      (entry) => typeof entry === 'string' && entry.includes('learner-facing'),
    )
  ) {
    problems.push(`${label}.sourceScope.exclusions: must mention learner-facing exclusion`)
  }

  if (!expectArray(plan.topicMap, `${label}.topicMap`, false)) return
  if (!expectArray(plan.proposedBatches, `${label}.proposedBatches`, false)) return
  if (!expectObject(plan.reviewStandards, `${label}.reviewStandards`)) return
  if (!expectObject(plan.promotionGates, `${label}.promotionGates`)) return
  if (!expectObject(plan.validationImplications, `${label}.validationImplications`)) return

  const topicIds = new Set()
  plan.topicMap.forEach((topic, index) => {
    const topicLabel = `${label}.topicMap[${index}]`
    if (!expectObject(topic, topicLabel)) return
    ;['topicId', 'label', 'reviewComplexity', 'boundaryNote'].forEach((field) => {
      if (!hasString(topic[field])) {
        problems.push(`${topicLabel}: missing ${field}`)
      }
    })
    if (!expectArray(topic.pageRange, `${topicLabel}.pageRange`, false)) return
    if (topic.pageRange.length !== 2) {
      problems.push(`${topicLabel}.pageRange must contain exactly two page bounds`)
    }
    if (topic.pageRange[0] < 227 || topic.pageRange[1] > 318) {
      problems.push(`${topicLabel}.pageRange must stay within the confirmed VM-22 page range`)
    }
    if (!expectArray(topic.expectedIssueTypes, `${topicLabel}.expectedIssueTypes`, false)) return
    if (!expectArray(topic.crossReferenceWatchlist, `${topicLabel}.crossReferenceWatchlist`, false)) return
    topicIds.add(topic.topicId)
  })

  const observedTopicIds = new Set()
  plan.proposedBatches.forEach((batch, index) => {
    const batchLabel = `${label}.proposedBatches[${index}]`
    if (!expectObject(batch, batchLabel)) return
    ;['plannedBatchId', 'title', 'reviewComplexity', 'rationale', 'automationFit'].forEach((field) => {
      if (!hasString(batch[field])) {
        problems.push(`${batchLabel}: missing ${field}`)
      }
    })
    if (!expectArray(batch.topicIds, `${batchLabel}.topicIds`, false)) return
    if (!expectArray(batch.expectedIssueTypes, `${batchLabel}.expectedIssueTypes`, false)) return
    if (!expectObject(batch.pageTarget, `${batchLabel}.pageTarget`)) return
    if (batch.reviewOnlyByDefault !== true) {
      problems.push(`${batchLabel}: reviewOnlyByDefault must be true`)
    }
    if (batch.sameStopConditionsAsVm20 !== true) {
      problems.push(`${batchLabel}: sameStopConditionsAsVm20 must be true`)
    }
    batch.topicIds.forEach((topicId) => {
      if (!topicIds.has(topicId)) {
        problems.push(`${batchLabel}: unknown topicId ${topicId}`)
      }
      observedTopicIds.add(topicId)
    })
    if (!expectArray(batch.pageTarget.knownWindow, `${batchLabel}.pageTarget.knownWindow`, false)) return
    if (batch.pageTarget.knownWindow.length !== 2) {
      problems.push(`${batchLabel}.pageTarget.knownWindow must contain exactly two page bounds`)
    }
    if (batch.pageTarget.knownWindow[0] < 227 || batch.pageTarget.knownWindow[1] > 318) {
      problems.push(`${batchLabel}.pageTarget.knownWindow must stay within the confirmed VM-22 page range`)
    }
  })

  topicIds.forEach((topicId) => {
    if (!observedTopicIds.has(topicId)) {
      problems.push(`${label}.proposedBatches: missing batch coverage for topicId ${topicId}`)
    }
  })

  ;[
    'regulatoryRequirement',
    'definitionOrTerminology',
    'reserveMethodStructure',
    'calculationStructure',
    'formulaContext',
    'prescribedAssumption',
    'companyOrPrudentEstimateAssumption',
    'scenarioOrStochasticRequirement',
    'assetModelingJudgment',
    'hedgingOrRiskMitigation',
    'reinsurance',
    'reportingRequirement',
    'documentationExpectation',
    'crossReferenceMapping',
    'backgroundContent',
    'boundaryControlWindow',
    'requiresHumanInterpretation',
    'staleSupersededCompanionGuidance',
  ].forEach((field) => {
    if (!hasString(plan.reviewStandards[field])) {
      problems.push(`${label}.reviewStandards: missing ${field}`)
    }
  })

  if (plan.promotionGates.defaultState !== 'review_only') {
    problems.push(`${label}.promotionGates.defaultState must be review_only`)
  }
  if (!expectArray(plan.promotionGates.learnerFacing, `${label}.promotionGates.learnerFacing`, false)) return
  if (!expectArray(plan.promotionGates.appReady, `${label}.promotionGates.appReady`, false)) return
  if (!expectArray(plan.promotionGates.ragReady, `${label}.promotionGates.ragReady`, false)) return
  if (!expectArray(plan.validationImplications.currentChecksNeeded, `${label}.validationImplications.currentChecksNeeded`, false)) return
  if (!expectArray(plan.validationImplications.futureChecksSuggested, `${label}.validationImplications.futureChecksSuggested`, false)) return
  if (!expectArray(plan.validationImplications.scriptImplications, `${label}.validationImplications.scriptImplications`, false)) return
}

const validatePracticeNotePlanLike = (plan, label) => {
  if (!expectObject(plan, label)) return

  if (plan.planId !== 'vm20-practice-note-control-plan') {
    problems.push(`${label}: planId must be vm20-practice-note-control-plan`)
  }
  if (plan.planVersion !== '1.0') {
    problems.push(`${label}: planVersion must be 1.0`)
  }
  if (plan.status !== 'planned') {
    problems.push(`${label}: status must be planned`)
  }
  if (!expectObject(plan.sourceScope, `${label}.sourceScope`)) return
  if (plan.sourceScope.sourceFamilyId !== 'practice_notes') {
    problems.push(`${label}.sourceScope: sourceFamilyId must be practice_notes`)
  }
  if (plan.sourceScope.primarySourceFile !== 'AAA - VM-20_PN_2020_Version.pdf') {
    problems.push(
      `${label}.sourceScope: primarySourceFile must be AAA - VM-20_PN_2020_Version.pdf`,
    )
  }
  if (!hasString(plan.sourceScope.sourceFolder)) {
    problems.push(`${label}.sourceScope: missing sourceFolder`)
  }
  if (!hasString(plan.sourceScope.sourceTitle)) {
    problems.push(`${label}.sourceScope: missing sourceTitle`)
  }
  if (!hasString(plan.sourceScope.sourceReference)) {
    problems.push(`${label}.sourceScope: missing sourceReference`)
  }
  if (!hasString(plan.sourceScope.domainId)) {
    problems.push(`${label}.sourceScope: missing domainId`)
  }
  if (!hasString(plan.sourceScope.rawSourceRoot)) {
    problems.push(`${label}.sourceScope: missing rawSourceRoot`)
  }
  if (!expectArray(plan.sourceScope.confirmedPageRange, `${label}.sourceScope.confirmedPageRange`, false)) return
  if (plan.sourceScope.confirmedPageRange.length !== 2) {
    problems.push(`${label}.sourceScope.confirmedPageRange must contain exactly two page bounds`)
  }
  if (plan.sourceScope.confirmedPageRange[0] !== 1 || plan.sourceScope.confirmedPageRange[1] !== 115) {
    problems.push(`${label}.sourceScope.confirmedPageRange must be [1, 115]`)
  }
  if (!expectArray(plan.sourceScope.observedSectionWindows, `${label}.sourceScope.observedSectionWindows`, false)) return
  if (!expectArray(plan.sourceScope.boundaries, `${label}.sourceScope.boundaries`, false)) return
  if (!expectArray(plan.sourceScope.exclusions, `${label}.sourceScope.exclusions`, false)) return
  if (
    !plan.sourceScope.boundaries.some(
      (entry) => typeof entry === 'string' && entry.includes('single practice note file'),
    )
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention the single practice-note file`)
  }
  if (
    !plan.sourceScope.boundaries.some(
      (entry) => typeof entry === 'string' && entry.includes('other Practice Notes files'),
    )
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention the other Practice Notes files`)
  }
  if (
    !plan.sourceScope.boundaries.some(
      (entry) => typeof entry === 'string' && entry.includes('non-binding') && entry.includes('companion-guidance'),
    )
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention non-binding companion-guidance posture`)
  }
  if (
    !plan.sourceScope.exclusions.some(
      (entry) => typeof entry === 'string' && entry.includes('learner-facing'),
    )
  ) {
    problems.push(`${label}.sourceScope.exclusions: must mention learner-facing exclusion`)
  }
  if (
    !plan.sourceScope.exclusions.some(
      (entry) => typeof entry === 'string' && entry.includes('other Practice Notes files'),
    )
  ) {
    problems.push(`${label}.sourceScope.exclusions: must mention other Practice Notes file exclusion`)
  }

  if (!expectArray(plan.topicMap, `${label}.topicMap`, false)) return
  if (!expectArray(plan.proposedBatches, `${label}.proposedBatches`, false)) return
  if (!expectObject(plan.reviewStandards, `${label}.reviewStandards`)) return
  if (!expectObject(plan.promotionGates, `${label}.promotionGates`)) return
  if (!expectObject(plan.validationImplications, `${label}.validationImplications`)) return

  const topicIds = new Set()
  plan.topicMap.forEach((topic, index) => {
    const topicLabel = `${label}.topicMap[${index}]`
    if (!expectObject(topic, topicLabel)) return
    ;['topicId', 'label', 'reviewComplexity', 'boundaryNote'].forEach((field) => {
      if (!hasString(topic[field])) {
        problems.push(`${topicLabel}: missing ${field}`)
      }
    })
    if (!expectArray(topic.pageRange, `${topicLabel}.pageRange`, false)) return
    if (topic.pageRange.length !== 2) {
      problems.push(`${topicLabel}.pageRange must contain exactly two page bounds`)
    }
    if (topic.pageRange[0] < 1 || topic.pageRange[1] > 115) {
      problems.push(`${topicLabel}.pageRange must stay within the confirmed practice-note page range`)
    }
    if (!expectArray(topic.expectedIssueTypes, `${topicLabel}.expectedIssueTypes`, false)) return
    if (!expectArray(topic.crossReferenceWatchlist, `${topicLabel}.crossReferenceWatchlist`, false)) return
    topicIds.add(topic.topicId)
  })

  const observedTopicIds = new Set()
  plan.proposedBatches.forEach((batch, index) => {
    const batchLabel = `${label}.proposedBatches[${index}]`
    if (!expectObject(batch, batchLabel)) return
    ;['plannedBatchId', 'title', 'reviewComplexity', 'rationale', 'automationFit'].forEach((field) => {
      if (!hasString(batch[field])) {
        problems.push(`${batchLabel}: missing ${field}`)
      }
    })
    if (!expectArray(batch.topicIds, `${batchLabel}.topicIds`, false)) return
    if (!expectArray(batch.expectedIssueTypes, `${batchLabel}.expectedIssueTypes`, false)) return
    if (!expectObject(batch.pageTarget, `${batchLabel}.pageTarget`)) return
    if (batch.reviewOnlyByDefault !== true) {
      problems.push(`${batchLabel}: reviewOnlyByDefault must be true`)
    }
    if (batch.sameStopConditionsAsVm20 !== true) {
      problems.push(`${batchLabel}: sameStopConditionsAsVm20 must be true`)
    }
    batch.topicIds.forEach((topicId) => {
      if (!topicIds.has(topicId)) {
        problems.push(`${batchLabel}: unknown topicId ${topicId}`)
      }
      observedTopicIds.add(topicId)
    })
    if (!expectArray(batch.pageTarget.knownWindow, `${batchLabel}.pageTarget.knownWindow`, false)) return
    if (batch.pageTarget.knownWindow.length !== 2) {
      problems.push(`${batchLabel}.pageTarget.knownWindow must contain exactly two page bounds`)
    }
    if (batch.pageTarget.knownWindow[0] < 1 || batch.pageTarget.knownWindow[1] > 115) {
      problems.push(`${batchLabel}.pageTarget.knownWindow must stay within the confirmed practice-note page range`)
    }
  })

  topicIds.forEach((topicId) => {
    if (!observedTopicIds.has(topicId)) {
      problems.push(`${label}.proposedBatches: missing batch coverage for topicId ${topicId}`)
    }
  })

  ;[
    'regulatoryRequirement',
    'implementationGuidance',
    'companionGuidance',
    'nonBindingGuidance',
    'definitionOrTerminology',
    'reserveMethodStructure',
    'calculationStructure',
    'formulaContext',
    'prescribedAssumption',
    'companyOrPrudentEstimateAssumption',
    'scenarioOrStochasticRequirement',
    'assetModelingJudgment',
    'hedgingOrRiskMitigation',
    'reinsurance',
    'reportingRequirement',
    'documentationExpectation',
    'crossReferenceMapping',
    'backgroundContent',
    'boundaryControlWindow',
    'requiresHumanInterpretation',
    'staleSupersededCompanionGuidance',
  ].forEach((field) => {
    if (!hasString(plan.reviewStandards[field])) {
      problems.push(`${label}.reviewStandards: missing ${field}`)
    }
  })

  if (plan.promotionGates.defaultState !== 'review_only') {
    problems.push(`${label}.promotionGates.defaultState must be review_only`)
  }
  if (!expectArray(plan.promotionGates.learnerFacing, `${label}.promotionGates.learnerFacing`, false)) return
  if (!expectArray(plan.promotionGates.appReady, `${label}.promotionGates.appReady`, false)) return
  if (!expectArray(plan.promotionGates.ragReady, `${label}.promotionGates.ragReady`, false)) return
  if (!expectArray(plan.validationImplications.currentChecksNeeded, `${label}.validationImplications.currentChecksNeeded`, false)) return
  if (!expectArray(plan.validationImplications.futureChecksSuggested, `${label}.validationImplications.futureChecksSuggested`, false)) return
  if (!expectArray(plan.validationImplications.scriptImplications, `${label}.validationImplications.scriptImplications`, false)) return
}

const validatePracticeNotePlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Section / Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AAA - VM-20_PN_2020_Version.pdf',
    'Practice Notes',
    'non-binding',
    'companion guidance',
    'VM-20',
    'VM-21',
    'VM-22',
    'VM-A',
    'VM-C',
    'VM-G',
    'VM-M',
    'VM-30',
    'VM-31',
    'pages 1-115',
    'batch-055',
    'batch-056',
    'batch-057',
    'batch-058',
    'batch-059',
    'batch-060',
    'batch-061',
    'batch-062',
    'batch-063',
    'batch-064',
    'batch-065',
    'batch-066',
    'batch-067',
    'batch-068',
    'batch-069',
    'batch-070',
    'batch-071',
    'batch-072',
    'batch-073',
    'batch-074',
    'batch-075',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateModelGovernancePracticeNotePlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Section / Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AAA - Model_Governance_PN_042017.pdf',
    'Practice Notes',
    'Model Governance: Some Considerations for Practicing Life Actuaries',
    'non-binding',
    'companion guidance',
    'model governance',
    'pages 1-18',
    'batch-183',
    'batch-184',
    'batch-185',
    'VM-20',
    'VM-21',
    'VM-22',
    'VM-A',
    'VM-C',
    'VM-G',
    'VM-M',
    'VM-30',
    'VM-31',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateModelGovernancePracticeNotePlanLike = (plan, label) => {
  if (!expectObject(plan, label)) return

  if (plan.planId !== 'model-governance-practice-note-control-plan') {
    problems.push(`${label}: planId must be model-governance-practice-note-control-plan`)
  }
  if (plan.planVersion !== '1.0') {
    problems.push(`${label}: planVersion must be 1.0`)
  }
  if (plan.status !== 'planned') {
    problems.push(`${label}: status must be planned`)
  }
  if (!expectObject(plan.sourceScope, `${label}.sourceScope`)) return

  if (plan.sourceScope.sourceFamilyId !== 'practice_notes') {
    problems.push(`${label}.sourceScope.sourceFamilyId: must be practice_notes`)
  }
  if (plan.sourceScope.primarySourceFile !== 'Practice Notes/AAA - Model_Governance_PN_042017.pdf') {
    problems.push(
      `${label}.sourceScope.primarySourceFile: must be Practice Notes/AAA - Model_Governance_PN_042017.pdf`,
    )
  }
  if (plan.sourceScope.sourceTitle !== 'Model Governance: Some Considerations for Practicing Life Actuaries') {
    problems.push(
      `${label}.sourceScope.sourceTitle: must be Model Governance: Some Considerations for Practicing Life Actuaries`,
    )
  }
  if (plan.sourceScope.sourceReference !== 'American Academy of Actuaries practice note, April 2017') {
    problems.push(`${label}.sourceScope.sourceReference: must be American Academy of Actuaries practice note, April 2017`)
  }
  if (plan.sourceScope.domainId !== 'naic_regulatory') {
    problems.push(`${label}.sourceScope.domainId: must be naic_regulatory`)
  }
  if (plan.sourceScope.sourceStatus !== 'active') {
    problems.push(`${label}.sourceScope.sourceStatus: must be active`)
  }
  if (
    !Array.isArray(plan.sourceScope.confirmedPageRange) ||
    plan.sourceScope.confirmedPageRange.length !== 2 ||
    plan.sourceScope.confirmedPageRange[0] !== 1 ||
    plan.sourceScope.confirmedPageRange[1] !== 18
  ) {
    problems.push(`${label}.sourceScope.confirmedPageRange: must be [1, 18]`)
  }
  if (
    !Array.isArray(plan.sourceScope.observedSectionWindows) ||
    plan.sourceScope.observedSectionWindows.length !== 3
  ) {
    problems.push(`${label}.sourceScope.observedSectionWindows: must describe three section windows`)
  }
  if (
    !Array.isArray(plan.sourceScope.boundaries) ||
    !plan.sourceScope.boundaries.some(
      (entry) => typeof entry === 'string' && entry.includes('single practice note file'),
    )
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention the single practice-note file`)
  }
  if (
    !Array.isArray(plan.sourceScope.boundaries) ||
    !plan.sourceScope.boundaries.some(
      (entry) => typeof entry === 'string' && entry.includes('other Practice Notes files'),
    )
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention the other Practice Notes files`)
  }
  if (
    !Array.isArray(plan.sourceScope.boundaries) ||
    !plan.sourceScope.boundaries.some(
      (entry) => typeof entry === 'string' && entry.includes('non-binding') && entry.includes('companion-guidance'),
    )
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention the non-binding companion-guidance posture`)
  }
  if (
    !Array.isArray(plan.sourceScope.exclusions) ||
    !plan.sourceScope.exclusions.some(
      (entry) => typeof entry === 'string' && entry.includes('No other Practice Notes files'),
    )
  ) {
    problems.push(`${label}.sourceScope.exclusions: must mention the other Practice Notes file exclusion`)
  }

  if (!expectArray(plan.topicMap, `${label}.topicMap`, false)) return
  if (plan.topicMap.length !== 3) {
    problems.push(`${label}.topicMap: expected exactly three topic windows`)
  }
  if (!expectArray(plan.proposedBatches, `${label}.proposedBatches`, false)) return
  if (plan.proposedBatches.length !== 3) {
    problems.push(`${label}.proposedBatches: expected exactly three planned batches`)
  }
  const expectedBatchIds = ['batch-183', 'batch-184', 'batch-185']
  for (const batchId of expectedBatchIds) {
    if (!plan.proposedBatches.some((batch) => batch?.plannedBatchId === batchId)) {
      problems.push(`${label}.proposedBatches: missing planned batch ${batchId}`)
    }
  }

  if (!expectObject(plan.reviewStandards, `${label}.reviewStandards`)) return
  if (!expectObject(plan.promotionGates, `${label}.promotionGates`)) return
  if (!expectObject(plan.validationImplications, `${label}.validationImplications`)) return
}

const validateAg03PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 03',
    'Standard Nonforfeiture Law',
    'maturity value',
    'cash surrender value',
    'page 1',
    'batch-076',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg04PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 04',
    'batch-079',
    'Actuarial Guideline IV',
    'page 1',
    'page 2',
    'term life insurance',
    'Standard Valuation Law',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg05PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 05',
    'batch-080',
    'Actuarial Guideline V',
    'page 1',
    'page 2',
    'continuous functions',
    'formula context',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg06PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 06',
    'batch-081',
    'Actuarial Guideline VI',
    'page 1',
    'page 2',
    'single or joint life',
    'mortality tables',
    'expense allowance',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg01PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 01',
    'batch-077',
    'Actuarial Guideline I',
    'page 1 only',
    'Standard Valuation Law',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateVm22PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Chapter / Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'VM-22',
    'VM-20',
    'VM-21',
    'VM-30',
    'VM-31',
    'VM-G',
    'VM-C',
    'VM-M',
    'VM-25',
    'page 318',
    'page 319',
    'batch-038',
    'batch-039',
    'batch-040',
    'batch-041',
    'batch-042',
    'batch-043',
    'batch-044',
    'batch-045',
    'batch-046',
    'batch-047',
    'batch-048',
    'batch-049',
    'batch-050',
    'batch-051',
    'batch-052',
    'batch-053',
    'batch-054',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

for (const relativePath of requiredFiles) {
  await requireFile(relativePath)
}

const config = await readJson(paths.config)
const batchManifestSchema = await readJson(paths.batchManifestSchema)
const sourceInventorySchema = await readJson(paths.sourceInventorySchema)
const extractionOutputSchema = await readJson(paths.extractionOutputSchema)
const reviewPacketSchema = await readJson(paths.reviewPacketSchema)
const batchManifestTemplate = await readJson(paths.batchManifestTemplate)
const reviewPacketTemplateJson = await readJson(paths.reviewPacketTemplateJson)
const sampleBatchManifest = await readJson(paths.sampleBatchManifest)
const sampleSourceInventory = await readJson(paths.sampleSourceInventory)
const sampleExtractionOutput = await readJson(paths.sampleExtractionOutput)
const sampleReviewPacketJson = await readJson(paths.sampleReviewPacketJson)
const remainingSourceInventorySchema = await readJson(paths.remainingSourceInventorySchema)
const remainingSourceInventoryTemplate = await readJson(paths.remainingSourceInventoryTemplate)
const remainingSourceInventoryPending = await readJson(paths.remainingSourceInventoryPending)
const vm20BatchPlan = await readJson(paths.vm20BatchPlanJson)
const supportingVmBatchPlan = await readJson(paths.supportingVmBatchPlanJson)
const vm21BatchPlan = await readJson(paths.vm21BatchPlanJson)
const vm22BatchPlan = await readJson(paths.vm22BatchPlanJson)
const practiceNoteBatchPlan = await readJson(paths.practiceNoteBatchPlanJson)
const ag03BatchPlan = await readJson(paths.ag03BatchPlanJson)
const ag01BatchPlan = await readJson(paths.ag01BatchPlanJson)
const ag02BatchPlan = await readJson(paths.ag02BatchPlanJson)
const ag04BatchPlan = await readJson(paths.ag04BatchPlanJson)
const ag05BatchPlan = await readJson(paths.ag05BatchPlanJson)
const ag06BatchPlan = await readJson(paths.ag06BatchPlanJson)
const ag07BatchPlan = await readJson(paths.ag07BatchPlanJson)
const ag08BatchPlan = await readJson(paths.ag08BatchPlanJson)
const ag09BatchPlan = await readJson(paths.ag09BatchPlanJson)
const ag10BatchPlan = await readJson(paths.ag10BatchPlanJson)
const ag11BatchPlan = await readJson(paths.ag11BatchPlanJson)
const ag12BatchPlan = await readJson(paths.ag12BatchPlanJson)
const ag13BatchPlan = await readJson(paths.ag13BatchPlanJson)
const ag14BatchPlan = await readJson(paths.ag14BatchPlanJson)
const ag15BatchPlan = await readJson(paths.ag15BatchPlanJson)
const ag16BatchPlan = await readJson(paths.ag16BatchPlanJson)
const ag17BatchPlan = await readJson(paths.ag17BatchPlanJson)
const ag18BatchPlan = await readJson(paths.ag18BatchPlanJson)
const ag19BatchPlan = await readJson(paths.ag19BatchPlanJson)
const ag20BatchPlan = await readJson(paths.ag20BatchPlanJson)
const ag21BatchPlan = await readJson(paths.ag21BatchPlanJson)
const ag22BatchPlan = await readJson(paths.ag22BatchPlanJson)
const ag23BatchPlan = await readJson(paths.ag23BatchPlanJson)
const ag24BatchPlan = await readJson(paths.ag24BatchPlanJson)
const ag26BatchPlan = await readJson(paths.ag26BatchPlanJson)
const ag29BatchPlan = await readJson(paths.ag29BatchPlanJson)
const ag30BatchPlan = await readJson(paths.ag30BatchPlanJson)
const ag31BatchPlan = await readJson(paths.ag31BatchPlanJson)
const ag32BatchPlan = await readJson(paths.ag32BatchPlanJson)
const ag33BatchPlan = await readJson(paths.ag33BatchPlanJson)
const ag34BatchPlan = await readJson(paths.ag34BatchPlanJson)
const ag35BatchPlan = await readJson(paths.ag35BatchPlanJson)
  const ag36BatchPlan = await readJson(paths.ag36BatchPlanJson)
  const ag37BatchPlan = await readJson(paths.ag37BatchPlanJson)
  const ag38BatchPlan = await readJson(paths.ag38BatchPlanJson)
  const ag39BatchPlan = await readJson(paths.ag39BatchPlanJson)
  const ag40BatchPlan = await readJson(paths.ag40BatchPlanJson)
  const ag41BatchPlan = await readJson(paths.ag41BatchPlanJson)
  const ag42BatchPlan = await readJson(paths.ag42BatchPlanJson)
  const ag43BatchPlan = await readJson(paths.ag43BatchPlanJson)
  const ag44BatchPlan = await readJson(paths.ag44BatchPlanJson)
const ag45BatchPlan = await readJson(paths.ag45BatchPlanJson)
const ag46BatchPlan = await readJson(paths.ag46BatchPlanJson)
const ag47BatchPlan = await readJson(paths.ag47BatchPlanJson)
const ag48BatchPlan = await readJson(paths.ag48BatchPlanJson)
const ag49BatchPlan = await readJson(paths.ag49BatchPlanJson)
const ag50BatchPlan = await readJson(paths.ag50BatchPlanJson)
const ag51BatchPlan = await readJson(paths.ag51BatchPlanJson)
const ag53BatchPlan = await readJson(paths.ag53BatchPlanJson)
const ag54BatchPlan = await readJson(paths.ag54BatchPlanJson)
  const ag55BatchPlan = await readJson(paths.ag55BatchPlanJson)
  const reg141BatchPlan = await readJson(paths.reg141BatchPlanJson)
  const modelGovernancePracticeNoteBatchPlan = await readJson(
    paths.modelGovernancePracticeNoteBatchPlanJson,
  )

validateSchemaEnvelope(batchManifestSchema, 'batch-manifest.schema.json')
validateSchemaEnvelope(sourceInventorySchema, 'source-inventory.schema.json')
validateSchemaEnvelope(extractionOutputSchema, 'extraction-output.schema.json')
validateSchemaEnvelope(reviewPacketSchema, 'review-packet.schema.json')
validateSchemaEnvelope(
  remainingSourceInventorySchema,
  'remaining-source-inventory.schema.json',
)

validateBatchManifestLike(batchManifestTemplate, 'batch-manifest.template.json')
validateBatchManifestLike(sampleBatchManifest, 'batch-manifest.sample.json')

validateSourceInventoryLike(sampleSourceInventory, 'source-inventory.sample.json')
validateExtractionOutputLike(sampleExtractionOutput, 'extraction-output.sample.json')
validateReviewPacketLike(reviewPacketTemplateJson, 'review-packet.template.json')
validateReviewPacketLike(sampleReviewPacketJson, 'review-packet.sample.json')
validateRemainingSourceInventoryTemplateLike(
  remainingSourceInventoryTemplate,
  'remaining-source-inventory.template.json',
)
validateRemainingSourceInventoryPendingLike(
  remainingSourceInventoryPending,
  'data/manual-input/remaining-source-inventory.pending.json',
)
validateVm20PlanLike(vm20BatchPlan, 'config/vm20-batch-plan.json')
validateSupportingVmPlanLike(supportingVmBatchPlan, 'config/supporting-vm-batch-plan.json')
validateVm21PlanLike(vm21BatchPlan, 'config/vm21-batch-plan.json')
validateVm22PlanLike(vm22BatchPlan, 'config/vm22-batch-plan.json')
validatePracticeNotePlanLike(practiceNoteBatchPlan, 'config/vm20-practice-note-batch-plan.json')
validateModelGovernancePracticeNotePlanLike(
  modelGovernancePracticeNoteBatchPlan,
  'config/model-governance-practice-note-batch-plan.json',
)
validateAg43PlanLike(ag43BatchPlan, 'config/ag43-batch-plan.json')
validateAg44PlanLike(ag44BatchPlan, 'config/ag44-batch-plan.json')
validateAg46PlanLike(ag46BatchPlan, 'config/ag46-batch-plan.json')
validateAg47PlanLike(ag47BatchPlan, 'config/ag47-batch-plan.json')
validateAg48PlanLike(ag48BatchPlan, 'config/ag48-batch-plan.json')
validateAg49PlanLike(ag49BatchPlan, 'config/ag49-batch-plan.json')
validateAg50PlanLike(ag50BatchPlan, 'config/ag50-batch-plan.json')
await validateAg01PlanMarkdown(paths.ag01ExtractionPlanMd, 'docs/processor/ag01_extraction_plan.md')
await validateAg04PlanMarkdown(paths.ag04ExtractionPlanMd, 'docs/processor/ag04_extraction_plan.md')
if (!Array.isArray(ag03BatchPlan.proposedBatches) || ag03BatchPlan.proposedBatches.length !== 1) {
  problems.push('config/ag03-batch-plan.json: expected exactly one proposed batch')
}
if (ag01BatchPlan.status !== 'planned') {
  problems.push('config/ag01-batch-plan.json: status must be planned')
}
if (!Array.isArray(ag01BatchPlan.proposedBatches) || ag01BatchPlan.proposedBatches.length !== 1) {
  problems.push('config/ag01-batch-plan.json: expected exactly one proposed batch')
}
if (
  ag01BatchPlan.sourceScope?.confirmedPageRange?.[0] !== 1 ||
  ag01BatchPlan.sourceScope?.confirmedPageRange?.[1] !== 1
) {
  problems.push('config/ag01-batch-plan.json: confirmedPageRange must be [1, 1]')
}

const plannedAg01BatchIds = Array.isArray(ag01BatchPlan.proposedBatches)
  ? ag01BatchPlan.proposedBatches
      .map((batch) => batch?.plannedBatchId)
      .filter((batchId) => typeof batchId === 'string' && batchId.length > 0)
  : []
for (const plannedBatchId of plannedAg01BatchIds) {
  if (!batchDefinitions[plannedBatchId]) {
    problems.push(`scripts/batch-definitions.mjs: missing batch definition for ${plannedBatchId}`)
  }
}

const validateReg213PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'NY Regulations/2021 VLM Report_DRAFT-(1-27-2020) with academy Updates V1-Reg-213-11-NYCRR-S103.pdf',
    'NY Regulations',
    '11 NYCRR Part 103',
    'Insurance Regulation 213',
    'state regulation',
    'New York',
    'pages 1-27',
    'batch-189',
    'batch-190',
    'batch-191',
    'page-image wording backstop',
    'line references are not expected',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateReg213Amendment1FaqPlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'NY Regulations/Reg-213-11-NYCRR-S103-Amendment-1-FAQ.pdf',
    'NY Regulations',
    'Regulation 213 Amendment No. 1 FAQ',
    'New York State Department of Financial Services',
    'July 21, 2020',
    'companion-only',
    'non-binding',
    'pages 1-3',
    'batch-245',
    'batch-246',
    'batch-247',
    'page-image wording backstop',
    'line references are not expected',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateReg192PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'NY Regulations/2021 VLM Report_DRAFT-(1-27-2020) with academy Updates V1-Reg-192-11-NYCRR-S102.pdf',
    'NY Regulations',
    'New York Regulation 192',
    '11 CRR-NY Part 102',
    'state regulation',
    'New York',
    'pages 1-3',
    'batch-266',
    'page-image wording backstop',
    'line references are not expected',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateReg102PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'NY Regulations/2021 VLM Report_DRAFT-(1-27-2020) with academy Updates V1-Reg-102-11-NYCRR-S127.pdf',
    'NY Regulations',
    'New York Regulation 102',
    '11 CRR-NY Part 127',
    'state regulation',
    'New York',
    'pages 1-8',
    'batch-267',
    'page-image wording backstop',
    'line references are not expected',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateReg213Amendment2PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'NY Regulations/Reg-213-11-NYCRR-S103-Amendment-2-nstext-reg213.pdf',
    'NY Regulations',
    'Regulation 213 Second Amendment',
    'New York State Department of Financial Services',
    'certified',
    'section 103.6',
    'batch-257',
    'batch-258',
    'batch-259',
    'page-image wording backstop',
    'line references are not expected',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateReg213Amendment1TextPlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'NY Regulations/Reg-213-11-NYCRR-S103-Amendment-1-rf213a1text.pdf',
    'NY Regulations',
    'Regulation 213 First Amendment',
    'New York State Department of Financial Services',
    'certified',
    'section 103.6',
    'section 103.7',
    'section 103.8',
    'batch-260',
    'batch-261',
    'batch-262',
    'batch-263',
    'batch-264',
    'batch-265',
    'certification page',
    'page-image wording backstop',
    'line references are not expected',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateReg213Amendment3PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'NY Regulations/Reg-213-amend3_txt.pdf',
    'NY Regulations',
    'Regulation 213 Third Amendment',
    'New York State Department of Financial Services',
    'final adoption text',
    'footnote revision',
    'batch-254',
    'page-image wording backstop',
    'line references are not expected',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateReg213Amendment4PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'NY Regulations/Reg-213-amend4_text.pdf',
    'NY Regulations',
    'Regulation 213 Fourth Amendment',
    'New York State Department of Financial Services',
    'certified',
    'section updates',
    'batch-255',
    'batch-256',
    'page-image wording backstop',
    'line references are not expected',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateReg213Amendment6PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'NY Regulations/Reg-213-amend6_text.pdf',
    'NY Regulations',
    'Regulation 213 Sixth Amendment',
    'New York State Department of Financial Services',
    'proposed',
    'footnote revision',
    'batch-248',
    'page-image wording backstop',
    'line references are not expected',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateReg213Amendment5PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'NY Regulations/Reg-213-amend5_text.pdf',
    'NY Regulations',
    'Regulation 213 Fifth Amendment',
    'New York State Department of Financial Services',
    'certified',
    'page 1',
    'page 2',
    'batch-249',
    'batch-250',
    'page-image wording backstop',
    'line references are not expected',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateLhmanual26PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Section / Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Risk Notes',
    '## Cross-Reference Handling',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'lhmanual26.pdf',
    'Life & Health Valuation Law Manual',
    'American Academy of Actuaries',
    'reference manual',
    'non-binding compilation',
    'pages 1-30',
    'batch-251',
    'batch-252',
    'batch-253',
    'page-image wording backstop',
    'line references are not expected',
    'Section 3 begins on page 31',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}
if (!plannedAg01BatchIds.includes('batch-077')) {
  problems.push('config/ag01-batch-plan.json: expected batch-077 to be planned')
}

if (ag02BatchPlan.status !== 'planned') {
  problems.push('config/ag02-batch-plan.json: status must be planned')
}
if (!Array.isArray(ag02BatchPlan.proposedBatches) || ag02BatchPlan.proposedBatches.length !== 1) {
  problems.push('config/ag02-batch-plan.json: expected exactly one proposed batch')
}
if (
  ag02BatchPlan.sourceScope?.confirmedPageRange?.[0] !== 1 ||
  ag02BatchPlan.sourceScope?.confirmedPageRange?.[1] !== 2
) {
  problems.push('config/ag02-batch-plan.json: confirmedPageRange must be [1, 2]')
}

const plannedAg02BatchIds = Array.isArray(ag02BatchPlan.proposedBatches)
  ? ag02BatchPlan.proposedBatches
      .map((batch) => batch?.plannedBatchId)
      .filter((batchId) => typeof batchId === 'string' && batchId.length > 0)
  : []
for (const plannedBatchId of plannedAg02BatchIds) {
  if (!batchDefinitions[plannedBatchId]) {
    problems.push(`scripts/batch-definitions.mjs: missing batch definition for ${plannedBatchId}`)
  }
}
if (!plannedAg02BatchIds.includes('batch-078')) {
  problems.push('config/ag02-batch-plan.json: expected batch-078 to be planned')
}

const plannedVm20BatchIds = Array.isArray(vm20BatchPlan.proposedBatches)
  ? vm20BatchPlan.proposedBatches
      .map((batch) => batch?.plannedBatchId)
      .filter((batchId) => typeof batchId === 'string' && batchId.length > 0)
  : []
for (const plannedBatchId of plannedVm20BatchIds) {
  if (!batchDefinitions[plannedBatchId]) {
    problems.push(`scripts/batch-definitions.mjs: missing batch definition for ${plannedBatchId}`)
  }
}

const validateSupportingVmReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall Supporting-Wave Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to VM-20',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'VM-21',
    'VM-22',
    'VM-01',
    'VM-02',
    'VM-25',
    'VM-26',
    'VM-30',
    'VM-31',
    'batch-013',
    'batch-014',
    'batch-015',
    'batch-016',
    'batch-017',
    'batch-018',
    'batch-019',
    'batch-020',
    'batch-021',
    'docs/review/vm20_review_index.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateVm21ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall VM-21 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'VM-21',
    'VM-22',
    'docs/review/vm20_review_index.md',
    'docs/review/supporting_vm_review_index.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
  ;[
    'batch-022',
    'batch-023',
    'batch-024',
    'batch-025',
    'batch-026',
    'batch-027',
    'batch-028',
    'batch-029',
    'batch-030',
    'batch-031',
    'batch-032',
    'batch-033',
    'batch-034',
    'batch-035',
    'batch-036',
    'batch-037',
  ].forEach((batchId) => {
    if (!text.includes(batchId)) {
      problems.push(`${label}: must reference ${batchId}`)
    }
  })
}

const validateVm22ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall VM-22 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'VM-22',
    'VM-20',
    'VM-21',
    'docs/review/vm20_review_index.md',
    'docs/review/supporting_vm_review_index.md',
    'docs/review/vm21_review_index.md',
    'batch-038',
    'batch-039',
    'batch-040',
    'batch-041',
    'batch-042',
    'batch-043',
    'batch-044',
    'batch-045',
    'batch-046',
    'batch-047',
    'batch-048',
    'batch-049',
    'batch-050',
    'batch-051',
    'batch-052',
    'batch-053',
    'batch-054',
    'VM-25',
    'page 319',
    'page 318',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validatePracticeNoteReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall Practice-Note Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
    '## Self-Review Note',
    '## Review Notes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'Non-binding companion guidance',
    'VM-20',
    'AAA - VM-20_PN_2020_Version.pdf',
    'Practice Notes',
    'batch-055',
    'batch-056',
    'batch-057',
    'batch-058',
    'batch-059',
    'batch-060',
    'batch-061',
    'batch-062',
    'batch-063',
    'batch-064',
    'batch-065',
    'batch-066',
    'batch-067',
    'batch-068',
    'batch-069',
    'batch-070',
    'batch-071',
    'batch-072',
    'batch-073',
    'batch-074',
    'batch-075',
    'docs/review/vm20_review_index.md',
    'docs/review/supporting_vm_review_index.md',
    'docs/review/vm21_review_index.md',
    'docs/review/vm22_review_index.md',
    'docs/review/vm20_practice_note_self_review.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validatePracticeNoteSelfReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classifications',
    '## Recurring Observations',
    '## Skill-Hardening Note',
    '## Review Outcome',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-055',
    'batch-075',
    'companion-guidance',
    'no tracked skill file update was necessary',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateModelGovernancePracticeNoteReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall Model Governance Practice-Note Extraction Status',
    '## Batch Table',
    '## Higher-Caution Areas',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Artifacts',
    '## Self-Review Note',
    '## Review Notes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'Model Governance: Some Considerations for Practicing Life Actuaries',
    'AAA - Model_Governance_PN_042017.pdf',
    'Practice Notes',
    'companion guidance',
    'non-binding',
    'batch-183',
    'batch-184',
    'batch-185',
    'docs/review/vm20_review_index.md',
    'docs/review/supporting_vm_review_index.md',
    'docs/review/vm21_review_index.md',
    'docs/review/vm22_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
    'docs/review/model_governance_practice_note_self_review.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateModelGovernancePracticeNoteSelfReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classifications',
    '## Recurring Observations',
    '## Skill-Hardening Note',
    '## Review Outcome',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-183',
    'batch-184',
    'batch-185',
    'companion-guidance',
    'page locators',
    'No tracked skill file update was necessary',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg03ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 03 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
    '## Self-Review Note',
    '## Review Notes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 03',
    'batch-076',
    'single-page',
    'maturity value',
    'cash surrender value',
    'docs/review/vm20_review_index.md',
    'docs/review/supporting_vm_review_index.md',
    'docs/review/vm21_review_index.md',
    'docs/review/vm22_review_index.md',
    'docs/review/vm20_practice_note_review_index.md',
    'docs/review/ag03_self_review.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg03SelfReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classifications',
    '## Recurring Observations',
    '## Skill-Hardening Note',
    '## Review Outcome',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-076',
    'encoded text layer',
    'No tracked skill file update was necessary',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg04ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 04 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
    '## Self-Review Note',
    '## Review Notes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 04',
    'batch-079',
    'pages 1-2',
    'term life insurance',
    'Actuarial Guideline IV',
    '1958 CSO',
    'Standard Valuation Law',
    'docs/review/vm20_review_index.md',
    'docs/review/supporting_vm_review_index.md',
    'docs/review/vm21_review_index.md',
    'docs/review/vm22_review_index.md',
    'docs/review/vm20_practice_note_review_index.md',
    'docs/review/ag03_review_index.md',
    'docs/review/ag01_review_index.md',
    'docs/review/ag02_review_index.md',
    'docs/review/ag04_self_review.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg04SelfReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classifications',
    '## Recurring Observations',
    '## Skill-Hardening Note',
    '## Review Outcome',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-079',
    'encoded text layer',
    'No tracked skill file update was necessary',
    'batch-definition cleanup',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg05ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 05 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
    '## Self-Review Note',
    '## Review Notes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 05',
    'batch-080',
    'pages 1-2',
    'continuous functions',
    'Actuarial Guideline V',
    'docs/review/vm20_review_index.md',
    'docs/review/supporting_vm_review_index.md',
    'docs/review/vm21_review_index.md',
    'docs/review/vm22_review_index.md',
    'docs/review/vm20_practice_note_review_index.md',
    'docs/review/ag04_review_index.md',
    'docs/review/ag03_review_index.md',
    'docs/review/ag01_review_index.md',
    'docs/review/ag02_review_index.md',
    'docs/review/ag05_self_review.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg05SelfReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classifications',
    '## Recurring Observations',
    '## Skill-Hardening Note',
    '## Review Outcome',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-080',
    'encoded text layer',
    'No tracked skill file update was necessary',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg06ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 06 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
    '## Self-Review Note',
    '## Review Notes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 06',
    'batch-081',
    'page 1',
    'page 2',
    'single or joint life',
    'Actuarial Guideline VI',
    'docs/review/vm20_review_index.md',
    'docs/review/supporting_vm_review_index.md',
    'docs/review/vm21_review_index.md',
    'docs/review/vm22_review_index.md',
    'docs/review/vm20_practice_note_review_index.md',
    'docs/review/ag05_review_index.md',
    'docs/review/ag04_review_index.md',
    'docs/review/ag03_review_index.md',
    'docs/review/ag01_review_index.md',
    'docs/review/ag02_review_index.md',
    'docs/review/ag06_self_review.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg06SelfReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classifications',
    '## Recurring Observations',
    '## Skill-Hardening Note',
    '## Review Outcome',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-081',
    'encoded text layer',
    'No tracked skill file update was necessary',
    'single or joint life',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg07ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 07 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
    '## Self-Review Note',
    '## Review Notes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 07',
    'batch-082',
    'page 1',
    'page 2',
    'equivalent level amounts',
    'Actuarial Guideline VII',
    'docs/review/vm20_review_index.md',
    'docs/review/supporting_vm_review_index.md',
    'docs/review/vm21_review_index.md',
    'docs/review/vm22_review_index.md',
    'docs/review/vm20_practice_note_review_index.md',
    'docs/review/ag06_review_index.md',
    'docs/review/ag05_review_index.md',
    'docs/review/ag04_review_index.md',
    'docs/review/ag03_review_index.md',
    'docs/review/ag01_review_index.md',
    'docs/review/ag02_review_index.md',
    'docs/review/ag07_self_review.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg07SelfReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classifications',
    '## Recurring Observations',
    '## Skill-Hardening Note',
    '## Review Outcome',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-082',
    'encoded text layer',
    'No tracked skill file update was necessary',
    'equivalent level amounts',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg08ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 08 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
    '## Self-Review Note',
    '## Review Notes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 08',
    'batch-083',
    'page 1',
    'discounted values',
    'cash surrender values',
    'Actuarial Guideline VIII',
    'docs/review/vm20_review_index.md',
    'docs/review/supporting_vm_review_index.md',
    'docs/review/vm21_review_index.md',
    'docs/review/vm22_review_index.md',
    'docs/review/vm20_practice_note_review_index.md',
    'docs/review/ag07_review_index.md',
    'docs/review/ag06_review_index.md',
    'docs/review/ag05_review_index.md',
    'docs/review/ag04_review_index.md',
    'docs/review/ag03_review_index.md',
    'docs/review/ag02_review_index.md',
    'docs/review/ag01_review_index.md',
    'docs/review/ag08_self_review.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg08SelfReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classifications',
    '## Recurring Observations',
    '## Skill-Hardening Note',
    '## Review Outcome',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-083',
    'encoded text layer',
    'No tracked skill file update was necessary',
    'discounted-value',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg09ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 09 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
    '## Self-Review Note',
    '## Review Notes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 09',
    'batch-084',
    'batch-085',
    'batch-086',
    'batch-087',
    'page 4',
    'structured settlements',
    'immediate annuities',
    'substandard annuity mortality tables',
    'OCR/title mismatch',
    'Actuarial Guideline IX',
    'Actuarial Guideline IX-A',
    'Actuarial Guideline IX-B',
    'Actuarial Guideline IX-C',
    'docs/review/vm20_review_index.md',
    'docs/review/supporting_vm_review_index.md',
    'docs/review/vm21_review_index.md',
    'docs/review/vm22_review_index.md',
    'docs/review/vm20_practice_note_review_index.md',
    'docs/review/ag08_review_index.md',
    'docs/review/ag07_review_index.md',
    'docs/review/ag06_review_index.md',
    'docs/review/ag05_review_index.md',
    'docs/review/ag04_review_index.md',
    'docs/review/ag03_review_index.md',
    'docs/review/ag02_review_index.md',
    'docs/review/ag01_review_index.md',
    'docs/review/ag09_self_review.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg09SelfReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classifications',
    '## Recurring Observations',
    '## Skill-Hardening Note',
    '## Review Outcome',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-084',
    'batch-085',
    'batch-086',
    'batch-087',
    'encoded text layer',
    'No tracked skill file update was necessary',
    'title / OCR mismatch',
    'mortality-table interpretation',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg10ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 10 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
    '## Self-Review Note',
    '## Review Notes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 10',
    'batch-088',
    'page 1',
    'cash surrender benefits',
    'additional amounts',
    'maturity values',
    'Actuarial Guideline X',
    'noisy text layer',
    'docs/review/ag10_self_review.md',
    'docs/review/vm20_review_index.md',
    'docs/review/supporting_vm_review_index.md',
    'docs/review/vm21_review_index.md',
    'docs/review/vm22_review_index.md',
    'docs/review/ag09_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg10SelfReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classifications',
    '## Recurring Observations',
    '## Skill-Hardening Note',
    '## Review Outcome',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-088',
    'encoded/noisy',
    'No tracked skill file update was necessary',
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg11ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 11 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
    '## Self-Review Note',
    '## Review Notes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 11',
    'batch-089',
    'page 1',
    'operative date',
    'like plans',
    'generic form',
    'Actuarial Guideline XI',
    'noisy text layer',
    'docs/review/ag11_self_review.md',
    'docs/review/vm20_review_index.md',
    'docs/review/supporting_vm_review_index.md',
    'docs/review/vm21_review_index.md',
    'docs/review/vm22_review_index.md',
    'docs/review/ag10_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg11SelfReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classifications',
    '## Recurring Observations',
    '## Skill-Hardening Note',
    '## Review Outcome',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-089',
    'encoded/noisy',
    'No tracked skill file update was necessary',
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg12ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 12 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
    '## Self-Review Note',
    '## Review Notes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 12',
    'batch-090',
    'withdrawn',
    'Actuarial Guideline XII',
    'page 1',
    'historical note',
    'valuation and nonforfeiture interest rates',
    'docs/review/ag12_self_review.md',
    'docs/review/vm20_review_index.md',
    'docs/review/supporting_vm_review_index.md',
    'docs/review/vm21_review_index.md',
    'docs/review/vm22_review_index.md',
    'docs/review/ag10_review_index.md',
    'docs/review/ag11_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg12SelfReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classifications',
    '## Recurring Observations',
    '## Skill-Hardening Note',
    '## Review Outcome',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-090',
    'withdrawn',
    'historical',
    'No tracked skill file update was necessary',
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg13ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 13 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
    '## Self-Review Note',
    '## Review Notes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 13',
    'batch-091',
    'historical',
    'Actuarial Guideline XIII',
    'historical CARVM',
    'contingent surrender charges',
    'bail-out rates',
    'page-image',
    'docs/review/ag13_self_review.md',
    'docs/review/ag12_review_index.md',
    'docs/review/vm20_review_index.md',
    'docs/review/supporting_vm_review_index.md',
    'docs/review/vm21_review_index.md',
    'docs/review/vm22_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg13SelfReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classifications',
    '## Recurring Observations',
    '## Skill-Hardening Note',
    '## Review Outcome',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-091',
    'historical',
    'page-image backstop',
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg14ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 14 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
    '## Self-Review Note',
    '## Review Notes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 14',
    'batch-092',
    'historical',
    'Actuarial Guideline XIV',
    'surveillance procedure',
    'actuarial opinion',
    'page-image',
    'docs/review/ag14_self_review.md',
    'docs/review/ag13_review_index.md',
    'docs/review/vm20_review_index.md',
    'docs/review/supporting_vm_review_index.md',
    'docs/review/vm21_review_index.md',
    'docs/review/vm22_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg14SelfReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classifications',
    '## Recurring Observations',
    '## Skill-Hardening Note',
    '## Review Outcome',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-092',
    'historical',
    'page-image backstop',
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'No new tracked skill file update was necessary',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg15ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 15 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
    '## Self-Review Note',
    '## Review Notes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 15',
    'batch-093',
    'Actuarial Guideline XV',
    'page 1',
    'historical',
    'illustration',
    'variable life insurance',
    'page-image',
    'docs/review/ag15_self_review.md',
    'docs/review/ag14_review_index.md',
    'docs/review/ag13_review_index.md',
    'docs/review/vm20_review_index.md',
    'docs/review/supporting_vm_review_index.md',
    'docs/review/vm21_review_index.md',
    'docs/review/vm22_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg15SelfReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classifications',
    '## Recurring Observations',
    '## Skill-Hardening Note',
    '## Review Outcome',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-093',
    'historical',
    'page-image backstop',
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'no new tracked skill file update was necessary',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg16ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 16 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
    '## Self-Review Note',
    '## Review Notes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 16',
    'batch-094',
    'Actuarial Guideline XVI',
    'page 1',
    'historical',
    'select mortality',
    'split interest',
    '19P[x]+1',
    '1980 CSO Table',
    'page-image',
    'docs/review/ag16_self_review.md',
    'docs/review/ag15_review_index.md',
    'docs/review/ag14_review_index.md',
    'docs/review/ag13_review_index.md',
    'docs/review/vm20_review_index.md',
    'docs/review/supporting_vm_review_index.md',
    'docs/review/vm21_review_index.md',
    'docs/review/vm22_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg16SelfReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classifications',
    '## Recurring Observations',
    '## Skill-Hardening Note',
    '## Review Outcome',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-094',
    'historical',
    'page-image backstop',
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'no new tracked skill file update was necessary',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg17ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 17 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
    '## Self-Review Note',
    '## Review Notes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 17',
    'batch-095',
    'Actuarial Guideline XVII',
    'page 1',
    'historical',
    'non-level death benefits',
    'equivalent level renewal amount',
    'average amount of insurance',
    'Standard Valuation Law',
    'Section 5-c',
    '1980 CSO Table',
    'page-image',
    'docs/review/ag17_self_review.md',
    'docs/review/ag16_review_index.md',
    'docs/review/ag15_review_index.md',
    'docs/review/ag14_review_index.md',
    'docs/review/ag12_review_index.md',
    'docs/review/vm20_review_index.md',
    'docs/review/supporting_vm_review_index.md',
    'docs/review/vm21_review_index.md',
    'docs/review/vm22_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg17SelfReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classifications',
    '## Recurring Observations',
    '## Skill-Hardening Note',
    '## Review Outcome',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-095',
    'historical',
    'page-image backstop',
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'No new tracked skill file update was necessary',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg18ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 18 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
    '## Self-Review Note',
    '## Review Notes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 18',
    'batch-096',
    'Actuarial Guideline XVIII',
    'page 1',
    'active',
    'semi-continuous',
    'fully continuous',
    'discounted continuous',
    'modified net premiums',
    'initial expense allowance',
    'curtate functions',
    'page-image',
    'docs/review/ag18_self_review.md',
    'docs/review/ag17_review_index.md',
    'docs/review/ag16_review_index.md',
    'docs/review/ag15_review_index.md',
    'docs/review/vm20_review_index.md',
    'docs/review/supporting_vm_review_index.md',
    'docs/review/vm21_review_index.md',
    'docs/review/vm22_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg18SelfReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classifications',
    '## Recurring Observations',
    '## Skill-Hardening Note',
    '## Review Outcome',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-096',
    'active',
    'page-image backstop',
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'No new tracked skill file update was necessary',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg19ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 19 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
    '## Self-Review Note',
    '## Review Notes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 19',
    'batch-097',
    'Actuarial Guideline XIX',
    'page 1',
    'active',
    '1980 CSO',
    'Ten-Year Select Mortality Factors',
    'page-image',
    'docs/review/ag19_self_review.md',
    'docs/review/ag18_review_index.md',
    'docs/review/vm20_review_index.md',
    'docs/review/supporting_vm_review_index.md',
    'docs/review/vm21_review_index.md',
    'docs/review/vm22_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg19SelfReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classifications',
    '## Recurring Observations',
    '## Skill-Hardening Note',
    '## Review Outcome',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-097',
    'active',
    'page-image backstop',
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'No new tracked skill file update was necessary',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg20ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 20 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
    '## Self-Review Note',
    '## Review Notes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 20',
    'batch-098',
    'Actuarial Guideline XX',
    'page 1',
    'page 3',
    'active',
    '1980 CSO',
    'joint-life-functions',
    'blank separator',
    'Ultimate 1xx Tables',
    'A5-1',
    'A5-6',
    'A5-7',
    'equivalent equal ages',
    'docs/review/ag20_self_review.md',
    'docs/review/ag19_review_index.md',
    'docs/review/vm20_review_index.md',
    'docs/review/supporting_vm_review_index.md',
    'docs/review/vm21_review_index.md',
    'docs/review/vm22_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg20SelfReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classifications',
    '## Recurring Observations',
    '## Skill-Hardening Note',
    '## Review Outcome',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-098',
    'active',
    'blank separator page',
    'table continuity',
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'No new tracked skill file update was necessary',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg21ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 21 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
    '## Self-Review Note',
    '## Review Notes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 21',
    'batch-099',
    'Actuarial Guideline XXI',
    'page 1',
    'active',
    'CRVM reserve-comparison',
    'page-image',
    'noisy',
    'Standard Valuation Law',
    '1980 CSO Tables',
    'modified net premiums',
    'net level premium',
    'full preliminary term method',
    'docs/review/ag21_self_review.md',
    'docs/review/ag20_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg21SelfReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classifications',
    '## Recurring Observations',
    '## Skill-Hardening Note',
    '## Review Outcome',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-099',
    'active',
    'noisy OCR layer',
    'page-image backstop',
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'No new tracked skill file update was necessary',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg22ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 22 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
    '## Self-Review Note',
    '## Review Notes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 22',
    'batch-100',
    'Actuarial Guideline XXII',
    'page 1',
    'active',
    'indeterminate premiums',
    'maximum gross premiums',
    'page-image',
    'noisy',
    'Standard Nonforfeiture Law',
    'Section 5',
    'Section 5-c',
    'Section 6',
    'docs/review/ag22_self_review.md',
    'docs/review/ag21_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg22SelfReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classifications',
    '## Recurring Observations',
    '## Skill-Hardening Note',
    '## Review Outcome',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-100',
    'active',
    'noisy OCR layer',
    'page-image backstop',
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'No new tracked skill file update was necessary',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg23ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 23 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
    '## Self-Review Note',
    '## Review Notes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 23',
    'batch-101',
    'Actuarial Guideline XXIII',
    'page 1',
    'active',
    'page-image',
    'noisy',
    'placeholder statutory reference',
    'readily marketable assets',
    'net investment income',
    '15%',
    '10%',
    'docs/review/ag23_self_review.md',
    'docs/review/ag22_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg23SelfReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classifications',
    '## Recurring Observations',
    '## Skill-Hardening Note',
    '## Review Outcome',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-101',
    'active',
    'noisy OCR layer',
    'page-image backstop',
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'No new tracked skill file update was necessary',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg01ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 01 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
    '## Self-Review Note',
    '## Review Notes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 01',
    'batch-077',
    'page 1',
    'valuation net premium',
    'gross premium',
    'Actuarial Guideline I',
    'docs/review/vm20_review_index.md',
    'docs/review/supporting_vm_review_index.md',
    'docs/review/vm21_review_index.md',
    'docs/review/vm22_review_index.md',
    'docs/review/vm20_practice_note_review_index.md',
    'docs/review/ag03_review_index.md',
    'docs/review/ag01_self_review.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg01SelfReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classifications',
    '## Recurring Observations',
    '## Skill-Hardening Note',
    '## Review Outcome',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-077',
    'encoded text layer',
    'No tracked skill file update was necessary',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg07PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 07',
    'batch-082',
    'Actuarial Guideline VII',
    'page 1',
    'page 2',
    'equivalent level amounts',
    'pure endowments',
    'expense allowances',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg08PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 08',
    'batch-083',
    'Actuarial Guideline VIII',
    'page 1',
    'single premium deferred annuities',
    'discounted values',
    'cash surrender values',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg09PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 09',
    'batch-084',
    'batch-085',
    'batch-086',
    'batch-087',
    'Actuarial Guideline IX',
    'Actuarial Guideline IX-A',
    'Actuarial Guideline IX-B',
    'Actuarial Guideline IX-C',
    'page 1',
    'page 4',
    'single premium annuities',
    'structured settlements',
    'immediate annuities',
    'substandard annuity mortality tables',
    'OCR/title mismatch',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg10PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 10',
    'batch-088',
    'Actuarial Guideline X',
    'page 1',
    'cash surrender benefits',
    'additional amounts',
    'maturity values',
    'NAIC Standard Nonforfeiture Law',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg11PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 11',
    'batch-089',
    'Actuarial Guideline XI',
    'page 1',
    'operative date',
    'like plans',
    'generic form',
    'Section 5-C',
    'Standard Nonforfeiture Law for Life Insurance',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg12PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 12',
    'batch-090',
    'Actuarial Guideline XII',
    'withdrawn',
    'page 1',
    'valuation and nonforfeiture interest rates',
    'historical',
    'caveat-only',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg13PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 13',
    'batch-091',
    'Actuarial Guideline XIII',
    'page 1',
    'page 2',
    'historical',
    'caveat-first',
    'CARVM',
    'contingent surrender charges',
    'bail-out rates',
    'docs/review/vm20_review_index.md',
    'docs/review/supporting_vm_review_index.md',
    'docs/review/vm21_review_index.md',
    'docs/review/vm22_review_index.md',
    'docs/review/ag12_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg14PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 14',
    'batch-092',
    'Actuarial Guideline XIV',
    'page 1',
    'page 2',
    'historical',
    'interim procedure',
    'actuarial opinion',
    'life and health insurers',
    'page-image',
    'docs/review/ag13_review_index.md',
    'docs/review/vm20_review_index.md',
    'docs/review/supporting_vm_review_index.md',
    'docs/review/vm21_review_index.md',
    'docs/review/vm22_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg15PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 15',
    'batch-093',
    'Actuarial Guideline XV',
    'page 1',
    'historical',
    'illustration',
    'variable life insurance',
    'page-image',
    'docs/review/ag14_review_index.md',
    'docs/review/ag13_review_index.md',
    'docs/review/vm20_review_index.md',
    'docs/review/supporting_vm_review_index.md',
    'docs/review/vm21_review_index.md',
    'docs/review/vm22_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg16PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 16',
    'batch-094',
    'Actuarial Guideline XVI',
    'page 1',
    'historical',
    'select mortality',
    'split interest',
    '19P[x]+1',
    '1980 CSO Table',
    'Standard Valuation Law',
    'page-image',
    'docs/review/ag15_review_index.md',
    'docs/review/ag14_review_index.md',
    'docs/review/ag13_review_index.md',
    'docs/review/vm20_review_index.md',
    'docs/review/supporting_vm_review_index.md',
    'docs/review/vm21_review_index.md',
    'docs/review/vm22_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg17PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 17',
    'batch-095',
    'Actuarial Guideline XVII',
    'page 1',
    'historical',
    'non-level death benefits',
    'equivalent level renewal amount',
    'average amount of insurance',
    'Standard Valuation Law',
    'Section 5-c',
    'page-image',
    'docs/review/ag16_review_index.md',
    'docs/review/ag15_review_index.md',
    'docs/review/ag14_review_index.md',
    'docs/review/vm20_review_index.md',
    'docs/review/supporting_vm_review_index.md',
    'docs/review/vm21_review_index.md',
    'docs/review/vm22_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg18PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 18',
    'batch-096',
    'Actuarial Guideline XVIII',
    'page 1',
    'active',
    'semi-continuous',
    'fully continuous',
    'discounted continuous',
    'modified net premiums',
    'initial expense allowance',
    'curtate functions',
    'page-image',
    'AG 17',
    'docs/review/ag17_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
    'docs/review/vm20_review_index.md',
    'docs/review/supporting_vm_review_index.md',
    'docs/review/vm21_review_index.md',
    'docs/review/vm22_review_index.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg19PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 19',
    'batch-097',
    'Actuarial Guideline XIX',
    'page 1',
    'active',
    '1980 CSO',
    'Ten-Year Select Mortality Factors',
    'Standard Valuation Law',
    'Standard Nonforfeiture Law',
    'page-image',
    'mortality-table',
    'docs/review/ag18_review_index.md',
    'docs/review/vm20_review_index.md',
    'docs/review/supporting_vm_review_index.md',
    'docs/review/vm21_review_index.md',
    'docs/review/vm22_review_index.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg20PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 20',
    'batch-098',
    'Actuarial Guideline XX',
    'page 1',
    'page 3',
    'page 7',
    'active',
    'joint life',
    'uniform seniority',
    'Ultimate 1xx Tables',
    'A5-1',
    'A5-6',
    'A5-7',
    'equivalent equal ages',
    'docs/review/ag19_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg21PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 21',
    'batch-099',
    'Actuarial Guideline XXI',
    'page 1',
    'active',
    'CRVM reserves',
    '(b) is greater than (a)',
    'page image',
    'noisy',
    'Standard Valuation Law',
    'full preliminary term method',
    'docs/review/ag20_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg22PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 22',
    'batch-100',
    'Actuarial Guideline XXII',
    'page 1',
    'active',
    'indeterminate premiums',
    'maximum gross premiums',
    'page image',
    'noisy',
    'Standard Nonforfeiture Law',
    'Section 5',
    'Section 5-c',
    'Section 6',
    'docs/review/ag21_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg23PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 23',
    'batch-101',
    'Actuarial Guideline XXIII',
    'page 1',
    'active',
    'separate account investments',
    'readily marketable assets',
    '15%',
    '10%',
    'page image',
    'placeholder statutory reference',
    'noisy',
    'docs/review/ag22_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg24PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 24',
    'batch-102',
    'batch-103',
    'batch-104',
    'Actuarial Guideline XXIV',
    'page 1',
    'page 6',
    'active',
    'variable life nonforfeiture values',
    'retrospective method',
    'prospective method',
    'maximum allowable surrender charge',
    'paid-up nonforfeiture benefit',
    'page image',
    'noisy',
    'AG 23',
    'AG 25',
    'separate account investments',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg25PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 25',
    'batch-105',
    'Actuarial Guideline XXV',
    'pages 1-3',
    'page-image',
    'active',
    'Consumer Price Index',
    'cash value accumulation test',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateCia2023FinancialConditionTestingEducationalNotePlanMarkdown = async (
  filePath,
  label,
) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Section / Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'Practice Notes/223010e.pdf',
    'Educational Note',
    'educational note',
    'non-binding practice note',
    'companion guidance',
    'financial condition testing',
    'pages 1-59',
    'batch-210',
    'batch-211',
    'batch-212',
    'batch-213',
    'batch-214',
    'batch-215',
    'OSFI',
    'AMF',
    'IFRS 17',
    'climate',
    'ORSA',
    'reinsurance',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateCia2023FinancialConditionTestingEducationalNotePlanLike = (plan, label) => {
  if (!expectObject(plan, label)) return

  if (plan.planId !== 'cia-2023-financial-condition-testing-educational-note-control-plan') {
    problems.push(
      `${label}: planId must be cia-2023-financial-condition-testing-educational-note-control-plan`,
    )
  }
  if (plan.planVersion !== '1.0') {
    problems.push(`${label}: planVersion must be 1.0`)
  }
  if (plan.status !== 'planned') {
    problems.push(`${label}: status must be planned`)
  }
  if (!expectObject(plan.sourceScope, `${label}.sourceScope`)) return

  if (plan.sourceScope.sourceFamilyId !== 'practice_notes') {
    problems.push(`${label}.sourceScope: sourceFamilyId must be practice_notes`)
  }
  if (plan.sourceScope.primarySourceFile !== 'Practice Notes/223010e.pdf') {
    problems.push(
      `${label}.sourceScope: primarySourceFile must be Practice Notes/223010e.pdf`,
    )
  }
  if (!hasString(plan.sourceScope.sourceFolder)) {
    problems.push(`${label}.sourceScope: missing sourceFolder`)
  }
  if (!hasString(plan.sourceScope.sourceTitle)) {
    problems.push(`${label}.sourceScope: missing sourceTitle`)
  }
  if (!hasString(plan.sourceScope.sourceReference)) {
    problems.push(`${label}.sourceScope: missing sourceReference`)
  }
  if (!hasString(plan.sourceScope.domainId)) {
    problems.push(`${label}.sourceScope: missing domainId`)
  }
  if (!hasString(plan.sourceScope.rawSourceRoot)) {
    problems.push(`${label}.sourceScope: missing rawSourceRoot`)
  }
  if (!expectArray(plan.sourceScope.confirmedPageRange, `${label}.sourceScope.confirmedPageRange`, false)) return
  if (plan.sourceScope.confirmedPageRange.length !== 2) {
    problems.push(`${label}.sourceScope.confirmedPageRange must contain exactly two page bounds`)
  }
  if (plan.sourceScope.confirmedPageRange[0] !== 1 || plan.sourceScope.confirmedPageRange[1] !== 59) {
    problems.push(`${label}.sourceScope.confirmedPageRange must be [1, 59]`)
  }
  if (!expectArray(plan.sourceScope.observedSectionWindows, `${label}.sourceScope.observedSectionWindows`, false)) return
  if (!expectArray(plan.sourceScope.boundaries, `${label}.sourceScope.boundaries`, false)) return
  if (!expectArray(plan.sourceScope.exclusions, `${label}.sourceScope.exclusions`, false)) return
  if (
    !plan.sourceScope.boundaries.some(
      (entry) => typeof entry === 'string' && entry.includes('single educational note file'),
    )
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention the single educational-note file`)
  }
  if (
    !plan.sourceScope.boundaries.some(
      (entry) => typeof entry === 'string' && entry.includes('other practice notes'),
    )
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention other practice-notes files`)
  }
  if (
    !plan.sourceScope.boundaries.some(
      (entry) => typeof entry === 'string' && entry.includes('non-binding') && entry.includes('companion-guidance'),
    )
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention non-binding companion-guidance posture`)
  }
  if (
    !plan.sourceScope.exclusions.some(
      (entry) => typeof entry === 'string' && entry.includes('learner-facing'),
    )
  ) {
    problems.push(`${label}.sourceScope.exclusions: must mention learner-facing exclusion`)
  }
  if (
    !plan.sourceScope.exclusions.some(
      (entry) => typeof entry === 'string' && entry.includes('other practice notes'),
    )
  ) {
    problems.push(`${label}.sourceScope.exclusions: must mention other practice-notes file exclusion`)
  }
  if (
    !plan.sourceScope.exclusions.some(
      (entry) => typeof entry === 'string' && entry.includes('app-ready'),
    )
  ) {
    problems.push(`${label}.sourceScope.exclusions: must mention app-ready exclusion`)
  }
  if (
    !plan.sourceScope.exclusions.some(
      (entry) => typeof entry === 'string' && entry.includes('RAG-ready'),
    )
  ) {
    problems.push(`${label}.sourceScope.exclusions: must mention RAG-ready exclusion`)
  }
}

const validateModelRegulationXXXPracticeNotePlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Section / Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AAA - Model Regulation XXX - Dec 2006.pdf',
    'Practice Notes',
    'Model Regulation XXX practice note',
    'non-binding',
    'companion guidance',
    'Model Regulation XXX',
    'pages 1-18',
    'batch-192',
    'batch-193',
    'batch-194',
    'ASOP 40',
    'AG XXXVIII',
    'X factors',
    'reinsurance',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateModelRegulationXXXPracticeNotePlanLike = (plan, label) => {
  if (!expectObject(plan, label)) return

  if (plan.planId !== 'model-regulation-xxx-practice-note-control-plan') {
    problems.push(`${label}: planId must be model-regulation-xxx-practice-note-control-plan`)
  }
  if (plan.planVersion !== '1.0') {
    problems.push(`${label}: planVersion must be 1.0`)
  }
  if (plan.status !== 'planned') {
    problems.push(`${label}: status must be planned`)
  }
  if (!expectObject(plan.sourceScope, `${label}.sourceScope`)) return

  if (plan.sourceScope.sourceFamilyId !== 'practice_notes') {
    problems.push(`${label}.sourceScope.sourceFamilyId: must be practice_notes`)
  }
  if (plan.sourceScope.primarySourceFile !== 'Practice Notes/AAA - Model Regulation XXX - Dec 2006.pdf') {
    problems.push(
      `${label}.sourceScope.primarySourceFile: must be Practice Notes/AAA - Model Regulation XXX - Dec 2006.pdf`,
    )
  }
  if (plan.sourceScope.sourceTitle !== 'Model Regulation XXX practice note') {
    problems.push(`${label}.sourceScope.sourceTitle: must be Model Regulation XXX practice note`)
  }
  if (
    plan.sourceScope.sourceReference !==
    'American Academy of Actuaries practice note, December 2006'
  ) {
    problems.push(
      `${label}.sourceScope.sourceReference: must be American Academy of Actuaries practice note, December 2006`,
    )
  }
  if (plan.sourceScope.domainId !== 'naic_regulatory') {
    problems.push(`${label}.sourceScope.domainId: must be naic_regulatory`)
  }
  if (plan.sourceScope.sourceStatus !== 'active') {
    problems.push(`${label}.sourceScope.sourceStatus: must be active`)
  }
  if (
    !Array.isArray(plan.sourceScope.confirmedPageRange) ||
    plan.sourceScope.confirmedPageRange.length !== 2 ||
    plan.sourceScope.confirmedPageRange[0] !== 1 ||
    plan.sourceScope.confirmedPageRange[1] !== 18
  ) {
    problems.push(`${label}.sourceScope.confirmedPageRange: must be [1, 18]`)
  }
  if (
    !Array.isArray(plan.sourceScope.observedSectionWindows) ||
    plan.sourceScope.observedSectionWindows.length !== 3
  ) {
    problems.push(`${label}.sourceScope.observedSectionWindows: must describe three section windows`)
  }
  if (
    !Array.isArray(plan.sourceScope.boundaries) ||
    !plan.sourceScope.boundaries.some((entry) => typeof entry === 'string' && entry.includes('single practice note file'))
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention the single practice-note file`)
  }
  if (
    !Array.isArray(plan.sourceScope.boundaries) ||
    !plan.sourceScope.boundaries.some((entry) => typeof entry === 'string' && entry.includes('other Practice Notes files'))
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention the other Practice Notes files`)
  }
  if (
    !Array.isArray(plan.sourceScope.boundaries) ||
    !plan.sourceScope.boundaries.some(
      (entry) =>
        typeof entry === 'string' &&
        entry.includes('non-binding') &&
        entry.includes('companion-guidance'),
    )
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention the non-binding companion-guidance posture`)
  }
  if (
    !Array.isArray(plan.sourceScope.boundaries) ||
    !plan.sourceScope.boundaries.some((entry) => typeof entry === 'string' && entry.includes('page locators'))
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention page locators`)
  }
  if (
    !Array.isArray(plan.sourceScope.exclusions) ||
    !plan.sourceScope.exclusions.some((entry) => typeof entry === 'string' && entry.includes('No other Practice Notes files'))
  ) {
    problems.push(`${label}.sourceScope.exclusions: must mention the other Practice Notes file exclusion`)
  }

  if (!expectArray(plan.topicMap, `${label}.topicMap`, false)) return
  if (plan.topicMap.length !== 3) {
    problems.push(`${label}.topicMap: expected exactly three topic windows`)
  }
  if (!expectArray(plan.proposedBatches, `${label}.proposedBatches`, false)) return
  if (plan.proposedBatches.length !== 3) {
    problems.push(`${label}.proposedBatches: expected exactly three batches`)
  }
  ;['batch-192', 'batch-193', 'batch-194'].forEach((batchId) => {
    if (!plan.proposedBatches.some((entry) => entry.plannedBatchId === batchId)) {
      problems.push(`${label}.proposedBatches: missing ${batchId}`)
    }
  })
  if (!expectObject(plan.reviewStandards, `${label}.reviewStandards`)) return
  if (
    !Array.isArray(plan.reviewStandards.categories) ||
    !plan.reviewStandards.categories.includes('non_binding_practice_note')
  ) {
    problems.push(`${label}.reviewStandards.categories: must include non_binding_practice_note`)
  }
  if (!expectObject(plan.promotionGates, `${label}.promotionGates`)) return
  if (plan.promotionGates.reviewOnlyByDefault !== true) {
    problems.push(`${label}.promotionGates.reviewOnlyByDefault: must be true`)
  }
  if (!expectObject(plan.validationImplications, `${label}.validationImplications`)) return
  if (
    plan.validationImplications.planFile !==
    'config/model-regulation-xxx-practice-note-batch-plan.json'
  ) {
    problems.push(
      `${label}.validationImplications.planFile: must be config/model-regulation-xxx-practice-note-batch-plan.json`,
    )
  }
}

const validateAssetAdequacyAnalysisPracticeNotePlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Section / Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'Practice Notes/2017-Sep-AAA_Asset_Adequacy_Analysis.pdf',
    'Practice Notes',
    'Asset Adequacy Analysis practice note',
    'non-binding',
    'companion guidance',
    'asset adequacy analysis',
    'pages 1-91',
    'batch-216',
    'batch-217',
    'batch-218',
    'batch-219',
    'batch-220',
    'batch-221',
    'AOMR',
    'ASOP 7',
    'ASOP 11',
    'ASOP 22',
    'ASOP 23',
    'ASOP 41',
    'AG43 / VM-21',
    'AG38',
    'IMR',
    'AVR',
    'reinsurance',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAssetAdequacyAnalysisPracticeNotePlanLike = (plan, label) => {
  if (!expectObject(plan, label)) return

  if (plan.planId !== 'asset-adequacy-analysis-practice-note-control-plan') {
    problems.push(`${label}: planId must be asset-adequacy-analysis-practice-note-control-plan`)
  }
  if (plan.planVersion !== '1.0') {
    problems.push(`${label}: planVersion must be 1.0`)
  }
  if (plan.status !== 'planned') {
    problems.push(`${label}: status must be planned`)
  }
  if (!expectObject(plan.sourceScope, `${label}.sourceScope`)) return

  if (plan.sourceScope.sourceFamilyId !== 'practice_notes') {
    problems.push(`${label}.sourceScope.sourceFamilyId: must be practice_notes`)
  }
  if (
    plan.sourceScope.primarySourceFile !==
    'Practice Notes/2017-Sep-AAA_Asset_Adequacy_Analysis.pdf'
  ) {
    problems.push(
      `${label}.sourceScope.primarySourceFile: must be Practice Notes/2017-Sep-AAA_Asset_Adequacy_Analysis.pdf`,
    )
  }
  if (plan.sourceScope.sourceTitle !== 'Asset Adequacy Analysis practice note') {
    problems.push(`${label}.sourceScope.sourceTitle: must be Asset Adequacy Analysis practice note`)
  }
  if (
    plan.sourceScope.sourceReference !==
    'American Academy of Actuaries practice note, September 2017'
  ) {
    problems.push(
      `${label}.sourceScope.sourceReference: must be American Academy of Actuaries practice note, September 2017`,
    )
  }
  if (plan.sourceScope.domainId !== 'naic_regulatory') {
    problems.push(`${label}.sourceScope.domainId: must be naic_regulatory`)
  }
  if (plan.sourceScope.issuingBody !== 'American Academy of Actuaries') {
    problems.push(`${label}.sourceScope.issuingBody: must be American Academy of Actuaries`)
  }
  if (plan.sourceScope.sourceStatus !== 'active') {
    problems.push(`${label}.sourceScope.sourceStatus: must be active`)
  }
  if (
    !Array.isArray(plan.sourceScope.confirmedPageRange) ||
    plan.sourceScope.confirmedPageRange.length !== 2 ||
    plan.sourceScope.confirmedPageRange[0] !== 1 ||
    plan.sourceScope.confirmedPageRange[1] !== 91
  ) {
    problems.push(`${label}.sourceScope.confirmedPageRange: must be [1, 91]`)
  }
  if (
    !Array.isArray(plan.sourceScope.observedSectionWindows) ||
    plan.sourceScope.observedSectionWindows.length !== 6
  ) {
    problems.push(`${label}.sourceScope.observedSectionWindows: must describe six section windows`)
  }
  if (
    !Array.isArray(plan.sourceScope.boundaries) ||
    !plan.sourceScope.boundaries.some((entry) => typeof entry === 'string' && entry.includes('single practice note file'))
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention the single practice-note file`)
  }
  if (
    !Array.isArray(plan.sourceScope.boundaries) ||
    !plan.sourceScope.boundaries.some((entry) => typeof entry === 'string' && entry.includes('other Practice Notes files'))
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention the other Practice Notes files`)
  }
  if (
    !Array.isArray(plan.sourceScope.boundaries) ||
    !plan.sourceScope.boundaries.some(
      (entry) =>
        typeof entry === 'string' &&
        entry.includes('non-binding') &&
        entry.includes('companion-guidance'),
    )
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention the non-binding companion-guidance posture`)
  }
  if (
    !Array.isArray(plan.sourceScope.boundaries) ||
    !plan.sourceScope.boundaries.some((entry) => typeof entry === 'string' && entry.includes('page locators'))
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention page locators`)
  }
  if (
    !Array.isArray(plan.sourceScope.exclusions) ||
    !plan.sourceScope.exclusions.some((entry) => typeof entry === 'string' && entry.includes('No other Practice Notes files'))
  ) {
    problems.push(`${label}.sourceScope.exclusions: must mention the other Practice Notes file exclusion`)
  }

  if (!expectArray(plan.topicMap, `${label}.topicMap`, false)) return
  if (plan.topicMap.length !== 6) {
    problems.push(`${label}.topicMap: expected exactly six topic windows`)
  }
  if (!expectArray(plan.proposedBatches, `${label}.proposedBatches`, false)) return
  if (plan.proposedBatches.length !== 6) {
    problems.push(`${label}.proposedBatches: expected exactly six batches`)
  }
  ;['batch-216', 'batch-217', 'batch-218', 'batch-219', 'batch-220', 'batch-221'].forEach((batchId) => {
    if (!plan.proposedBatches.some((entry) => entry.plannedBatchId === batchId)) {
      problems.push(`${label}.proposedBatches: missing ${batchId}`)
    }
  })
  if (!expectObject(plan.reviewStandards, `${label}.reviewStandards`)) return
  if (plan.reviewStandards.reviewOnlyByDefault !== true) {
    problems.push(`${label}.reviewStandards.reviewOnlyByDefault: must be true`)
  }
  if (
    !Array.isArray(plan.reviewStandards.categories) ||
    !plan.reviewStandards.categories.includes('non_binding_practice_note')
  ) {
    problems.push(`${label}.reviewStandards.categories: must include non_binding_practice_note`)
  }
  if (!expectObject(plan.promotionGates, `${label}.promotionGates`)) return
  if (plan.promotionGates.reviewOnlyByDefault !== true) {
    problems.push(`${label}.promotionGates.reviewOnlyByDefault: must be true`)
  }
  if (!expectObject(plan.validationImplications, `${label}.validationImplications`)) return
  if (plan.validationImplications.planFile !== 'config/asset-adequacy-analysis-batch-plan.json') {
    problems.push(`${label}.validationImplications.planFile: must reference the asset adequacy analysis plan file`)
  }
  if (plan.validationImplications.checkScript !== 'npm run check') {
    problems.push(`${label}.validationImplications.checkScript: must be npm run check`)
  }
  if (
    !Array.isArray(plan.validationImplications.futureChecks) ||
    !plan.validationImplications.futureChecks.some(
      (entry) => typeof entry === 'string' && entry.includes('batch-216'),
    )
  ) {
    problems.push(`${label}.validationImplications.futureChecks: must mention the new batch IDs`)
  }
  if (
    !plan.validationImplications.portabilityNote ||
    !plan.validationImplications.portabilityNote.includes('portable across source families')
  ) {
    problems.push(`${label}.validationImplications.portabilityNote: must mention portability across source families`)
  }
}

const validateAssetAdequacyAnalysisPracticeNoteReviewIndexMd = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall Status',
    '## Source Summary',
    '## Batch Table',
    '## Higher-Caution Areas',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Relationship to Other Review Indexes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'non-binding practice note / companion guidance',
    'Practice Notes/2017-Sep-AAA_Asset_Adequacy_Analysis.pdf',
    'pages 1-91',
    'batch-216',
    'batch-217',
    'batch-218',
    'batch-219',
    'batch-220',
    'batch-221',
    'AOMR',
    'ASOP 7',
    'ASOP 11',
    'ASOP 22',
    'ASOP 23',
    'ASOP 41',
    'AG43 / VM-21',
    'AG38',
    'IMR',
    'AVR',
    'reinsurance',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAssetAdequacyAnalysisPracticeNoteSelfReviewMd = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch-by-Batch Review',
    '## Recurring Findings',
    '## Overall Classification',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;['batch-216', 'batch-217', 'batch-218', 'batch-219', 'batch-220', 'batch-221'].forEach((batchId) => {
    if (!text.includes(batchId)) {
      problems.push(`${label}: must mention ${batchId}`)
    }
  })
  if (!text.includes('reasonable_with_minor_cautions')) {
    problems.push(`${label}: must mention reasonable_with_minor_cautions`)
  }
  if (!text.includes('page locators')) {
    problems.push(`${label}: must mention page locators`)
  }
  if (!text.includes('non-binding practice-note caveat')) {
    problems.push(`${label}: must mention the non-binding practice-note caveat`)
  }
}

const validateLifeReinsuranceReserveCreditPracticeNotePlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Section / Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AAA - Life_Reinsurance_Reserve_Credit_Practice_Note_Feb_2018.pdf',
    'Practice Notes',
    'Credit for Life Reinsurance practice note',
    'non-binding',
    'companion guidance',
    'Credit for Life Reinsurance',
    'pages 1-41',
    'batch-198',
    'batch-199',
    'batch-200',
    'batch-201',
    'AG 48',
    'reinsurance model law',
    'valuation',
    'asset adequacy',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateCia2022CapitalFCTEducationalNotePlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Section / Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'Practice Notes/222030e.pdf',
    'Educational Note',
    'non-binding practice note',
    'companion guidance',
    'capital and financial condition testing',
    'pages 1-20',
    'batch-206',
    'batch-207',
    'batch-208',
    'batch-209',
    'OSFI',
    'AMF',
    'IFRS 17',
    'climate',
    'ORSA',
    'reinsurance',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateCia2022CapitalFCTEducationalNotePlanLike = (plan, label) => {
  if (!expectObject(plan, label)) return

  if (plan.planId !== 'cia-2022-capital-fct-educational-note-control-plan') {
    problems.push(`${label}: planId must be cia-2022-capital-fct-educational-note-control-plan`)
  }
  if (plan.planVersion !== '1.0') {
    problems.push(`${label}: planVersion must be 1.0`)
  }
  if (plan.status !== 'planned') {
    problems.push(`${label}: status must be planned`)
  }
  if (!expectObject(plan.sourceScope, `${label}.sourceScope`)) return

  if (plan.sourceScope.sourceFamilyId !== 'practice_notes') {
    problems.push(`${label}.sourceScope.sourceFamilyId: must be practice_notes`)
  }
  if (plan.sourceScope.primarySourceFile !== 'Practice Notes/222030e.pdf') {
    problems.push(
      `${label}.sourceScope.primarySourceFile: must be Practice Notes/222030e.pdf`,
    )
  }
  if (
    plan.sourceScope.sourceTitle !==
    'Educational Note: Guidance for the 2022 Reporting on Capital and Financial Condition Testing for Life, P&C, and Mortgage Insurers'
  ) {
    problems.push(
      `${label}.sourceScope.sourceTitle: unexpected educational note title`,
    )
  }
  if (
    plan.sourceScope.sourceReference !==
    'Canadian Institute of Actuaries educational note, February 2022'
  ) {
    problems.push(
      `${label}.sourceScope.sourceReference: unexpected educational note reference`,
    )
  }
  if (plan.sourceScope.sourceStatus !== 'non-binding practice note') {
    problems.push(
      `${label}.sourceScope.sourceStatus: must be non-binding practice note`,
    )
  }
  if (JSON.stringify(plan.sourceScope.confirmedPageRange) !== JSON.stringify([1, 20])) {
    problems.push(`${label}.sourceScope.confirmedPageRange: must be [1, 20]`)
  }

  if (!Array.isArray(plan.proposedBatches) || plan.proposedBatches.length !== 4) {
    problems.push(`${label}.proposedBatches: must contain 4 batches`)
  }
  const expectedBatchIds = ['batch-206', 'batch-207', 'batch-208', 'batch-209']
  expectedBatchIds.forEach((batchId) => {
    const batch = plan.proposedBatches?.find((candidate) => candidate.plannedBatchId === batchId)
    if (!batch) {
      problems.push(`${label}.proposedBatches: missing ${batchId}`)
    }
  })
}

const validateLifeReinsuranceReserveCreditPracticeNotePlanLike = (plan, label) => {
  if (!expectObject(plan, label)) return

  if (plan.planId !== 'life-reinsurance-reserve-credit-practice-note-control-plan') {
    problems.push(`${label}: planId must be life-reinsurance-reserve-credit-practice-note-control-plan`)
  }
  if (plan.planVersion !== '1.0') {
    problems.push(`${label}: planVersion must be 1.0`)
  }
  if (plan.status !== 'planned') {
    problems.push(`${label}: status must be planned`)
  }
  if (!expectObject(plan.sourceScope, `${label}.sourceScope`)) return

  if (plan.sourceScope.sourceFamilyId !== 'practice_notes') {
    problems.push(`${label}.sourceScope.sourceFamilyId: must be practice_notes`)
  }
  if (
    plan.sourceScope.primarySourceFile !==
    'Practice Notes/AAA - Life_Reinsurance_Reserve_Credit_Practice_Note_Feb_2018.pdf'
  ) {
    problems.push(
      `${label}.sourceScope.primarySourceFile: must be Practice Notes/AAA - Life_Reinsurance_Reserve_Credit_Practice_Note_Feb_2018.pdf`,
    )
  }
  if (plan.sourceScope.sourceTitle !== 'Credit for Life Reinsurance practice note') {
    problems.push(
      `${label}.sourceScope.sourceTitle: must be Credit for Life Reinsurance practice note`,
    )
  }
  if (
    plan.sourceScope.sourceReference !==
    'American Academy of Actuaries practice note, February 2018'
  ) {
    problems.push(
      `${label}.sourceScope.sourceReference: must be American Academy of Actuaries practice note, February 2018`,
    )
  }
  if (plan.sourceScope.domainId !== 'naic_regulatory') {
    problems.push(`${label}.sourceScope.domainId: must be naic_regulatory`)
  }
  if (plan.sourceScope.sourceStatus !== 'active') {
    problems.push(`${label}.sourceScope.sourceStatus: must be active`)
  }
  if (
    !Array.isArray(plan.sourceScope.confirmedPageRange) ||
    plan.sourceScope.confirmedPageRange.length !== 2 ||
    plan.sourceScope.confirmedPageRange[0] !== 1 ||
    plan.sourceScope.confirmedPageRange[1] !== 41
  ) {
    problems.push(`${label}.sourceScope.confirmedPageRange: must be [1, 41]`)
  }
  if (
    !Array.isArray(plan.sourceScope.observedSectionWindows) ||
    plan.sourceScope.observedSectionWindows.length !== 4
  ) {
    problems.push(`${label}.sourceScope.observedSectionWindows: must describe four section windows`)
  }
  if (
    !Array.isArray(plan.sourceScope.boundaries) ||
    !plan.sourceScope.boundaries.some((entry) => typeof entry === 'string' && entry.includes('single practice note file'))
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention the single practice-note file`)
  }
  if (
    !Array.isArray(plan.sourceScope.boundaries) ||
    !plan.sourceScope.boundaries.some((entry) => typeof entry === 'string' && entry.includes('other Practice Notes files'))
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention the other Practice Notes files`)
  }
  if (
    !Array.isArray(plan.sourceScope.boundaries) ||
    !plan.sourceScope.boundaries.some(
      (entry) =>
        typeof entry === 'string' &&
        entry.includes('non-binding') &&
        entry.includes('companion-guidance'),
    )
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention the non-binding companion-guidance posture`)
  }
  if (
    !Array.isArray(plan.sourceScope.boundaries) ||
    !plan.sourceScope.boundaries.some((entry) => typeof entry === 'string' && entry.includes('page locators'))
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention page locators`)
  }
  if (
    !Array.isArray(plan.sourceScope.exclusions) ||
    !plan.sourceScope.exclusions.some((entry) => typeof entry === 'string' && entry.includes('No other Practice Notes files'))
  ) {
    problems.push(`${label}.sourceScope.exclusions: must mention the other Practice Notes file exclusion`)
  }

  if (!expectArray(plan.topicMap, `${label}.topicMap`, false)) return
  if (plan.topicMap.length !== 4) {
    problems.push(`${label}.topicMap: expected exactly four topic windows`)
  }
  if (!expectArray(plan.proposedBatches, `${label}.proposedBatches`, false)) return
  if (plan.proposedBatches.length !== 4) {
    problems.push(`${label}.proposedBatches: expected exactly four batches`)
  }
  ;['batch-198', 'batch-199', 'batch-200', 'batch-201'].forEach((batchId) => {
    if (!plan.proposedBatches.some((entry) => entry.plannedBatchId === batchId)) {
      problems.push(`${label}.proposedBatches: missing ${batchId}`)
    }
  })
  if (!expectObject(plan.reviewStandards, `${label}.reviewStandards`)) return
  if (
    !Array.isArray(plan.reviewStandards.categories) ||
    !plan.reviewStandards.categories.includes('non_binding_practice_note')
  ) {
    problems.push(`${label}.reviewStandards.categories: must include non_binding_practice_note`)
  }
  if (!expectObject(plan.promotionGates, `${label}.promotionGates`)) return
  if (plan.promotionGates.reviewOnlyByDefault !== true) {
    problems.push(`${label}.promotionGates.reviewOnlyByDefault: must be true`)
  }
  if (!expectObject(plan.validationImplications, `${label}.validationImplications`)) return
  if (
    plan.validationImplications.planFile !==
    'config/life-reinsurance-reserve-credit-practice-note-batch-plan.json'
  ) {
    problems.push(
      `${label}.validationImplications.planFile: must be config/life-reinsurance-reserve-credit-practice-note-batch-plan.json`,
    )
  }
}

const validateLtciPracticeNotePlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Section / Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AAA-LTCI_Practice_Note_5.21.pdf',
    'Practice Notes',
    'Long-Term Care Insurance practice note',
    'non-binding',
    'companion guidance',
    'Long-Term Care Insurance',
    'pages 1-31',
    'batch-195',
    'batch-196',
    'batch-197',
    'ASOP 5',
    'ASOP 18',
    'ASOP 23',
    'FASB ASC 944-40',
    'persistency',
    'valuation',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateLtciPracticeNotePlanLike = (plan, label) => {
  if (!expectObject(plan, label)) return

  if (plan.planId !== 'ltci-practice-note-control-plan') {
    problems.push(`${label}: planId must be ltci-practice-note-control-plan`)
  }
  if (plan.planVersion !== '1.0') {
    problems.push(`${label}: planVersion must be 1.0`)
  }
  if (plan.status !== 'planned') {
    problems.push(`${label}: status must be planned`)
  }
  if (!expectObject(plan.sourceScope, `${label}.sourceScope`)) return

  if (plan.sourceScope.sourceFamilyId !== 'practice_notes') {
    problems.push(`${label}.sourceScope.sourceFamilyId: must be practice_notes`)
  }
  if (plan.sourceScope.primarySourceFile !== 'Practice Notes/AAA-LTCI_Practice_Note_5.21.pdf') {
    problems.push(
      `${label}.sourceScope.primarySourceFile: must be Practice Notes/AAA-LTCI_Practice_Note_5.21.pdf`,
    )
  }
  if (plan.sourceScope.sourceTitle !== 'Long-Term Care Insurance practice note') {
    problems.push(`${label}.sourceScope.sourceTitle: must be Long-Term Care Insurance practice note`)
  }
  if (plan.sourceScope.sourceReference !== 'American Academy of Actuaries practice note, May 2021') {
    problems.push(
      `${label}.sourceScope.sourceReference: must be American Academy of Actuaries practice note, May 2021`,
    )
  }
  if (plan.sourceScope.domainId !== 'naic_regulatory') {
    problems.push(`${label}.sourceScope.domainId: must be naic_regulatory`)
  }
  if (plan.sourceScope.sourceStatus !== 'active') {
    problems.push(`${label}.sourceScope.sourceStatus: must be active`)
  }
  if (
    !Array.isArray(plan.sourceScope.confirmedPageRange) ||
    plan.sourceScope.confirmedPageRange.length !== 2 ||
    plan.sourceScope.confirmedPageRange[0] !== 1 ||
    plan.sourceScope.confirmedPageRange[1] !== 31
  ) {
    problems.push(`${label}.sourceScope.confirmedPageRange: must be [1, 31]`)
  }
  if (
    !Array.isArray(plan.sourceScope.observedSectionWindows) ||
    plan.sourceScope.observedSectionWindows.length !== 3
  ) {
    problems.push(`${label}.sourceScope.observedSectionWindows: must describe three section windows`)
  }
  if (
    !Array.isArray(plan.sourceScope.boundaries) ||
    !plan.sourceScope.boundaries.some((entry) => typeof entry === 'string' && entry.includes('single practice note file'))
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention the single practice-note file`)
  }
  if (
    !Array.isArray(plan.sourceScope.boundaries) ||
    !plan.sourceScope.boundaries.some((entry) => typeof entry === 'string' && entry.includes('other Practice Notes files'))
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention the other Practice Notes files`)
  }
  if (
    !Array.isArray(plan.sourceScope.boundaries) ||
    !plan.sourceScope.boundaries.some(
      (entry) =>
        typeof entry === 'string' &&
        entry.includes('non-binding') &&
        entry.includes('companion-guidance'),
    )
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention the non-binding companion-guidance posture`)
  }
  if (
    !Array.isArray(plan.sourceScope.boundaries) ||
    !plan.sourceScope.boundaries.some((entry) => typeof entry === 'string' && entry.includes('page locators'))
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention page locators`)
  }
  if (
    !Array.isArray(plan.sourceScope.exclusions) ||
    !plan.sourceScope.exclusions.some((entry) => typeof entry === 'string' && entry.includes('No other Practice Notes files'))
  ) {
    problems.push(`${label}.sourceScope.exclusions: must mention the other Practice Notes file exclusion`)
  }

  if (!expectArray(plan.topicMap, `${label}.topicMap`, false)) return
  if (plan.topicMap.length !== 3) {
    problems.push(`${label}.topicMap: expected exactly three topic windows`)
  }
  if (!expectArray(plan.proposedBatches, `${label}.proposedBatches`, false)) return
  if (plan.proposedBatches.length !== 3) {
    problems.push(`${label}.proposedBatches: expected exactly three batches`)
  }
  ;['batch-195', 'batch-196', 'batch-197'].forEach((batchId) => {
    if (!plan.proposedBatches.some((entry) => entry.plannedBatchId === batchId)) {
      problems.push(`${label}.proposedBatches: missing ${batchId}`)
    }
  })
  if (!expectObject(plan.reviewStandards, `${label}.reviewStandards`)) return
  if (
    !Array.isArray(plan.reviewStandards.categories) ||
    !plan.reviewStandards.categories.includes('reporting_requirement')
  ) {
    problems.push(`${label}.reviewStandards.categories: must include reporting_requirement`)
  }
  if (!expectObject(plan.promotionGates, `${label}.promotionGates`)) return
  if (plan.promotionGates.reviewOnlyByDefault !== true) {
    problems.push(`${label}.promotionGates.reviewOnlyByDefault: must be true`)
  }
  if (!expectObject(plan.validationImplications, `${label}.validationImplications`)) return
  if (
    plan.validationImplications.planFile !==
    'config/ltci-practice-note-batch-plan.json'
  ) {
    problems.push(
      `${label}.validationImplications.planFile: must be config/ltci-practice-note-batch-plan.json`,
    )
  }
}

const validateAg26PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 26',
    'batch-106',
    'Actuarial Guideline XXVI',
    'page 1',
    'page-image',
    'active',
    'Standard Valuation Law',
    'Standard Non-Forfeiture Law',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg27PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 27',
    'batch-107',
    'Actuarial Guideline XXVII',
    'pages 1-5',
    'page-image',
    'active',
    'non-discounted acceleration',
    'actuarially discounted acceleration',
    'interest accrual',
    'benefit payment lien',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg28PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 28',
    'batch-110',
    'Actuarial Guideline XXVIII',
    'page 1',
    'page-image',
    'active',
    'survivor income benefit',
    'group long-term disability',
    'AG 29 remains out of scope',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg29PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 29',
    'batch-111',
    'Actuarial Guideline XXIX',
    'pages 1-2',
    'page-image',
    'active',
    'rehabilitation',
    'court-ordered restructuring',
    'AG 30 remains out of scope',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg30PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 30',
    'batch-112',
    'Actuarial Guideline XXX',
    'pages 1-2',
    'page-image',
    'active',
    'plan type',
    'C-3 risk',
    'AG 31 remains out of scope',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg30ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 30 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
    '## Review Notes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 30',
    'batch-112',
    'Actuarial Guideline XXX',
    'pages 1-2',
    'page-image',
    'active',
    'plan type',
    'C-3 risk',
    'AG 31 explicitly remains out of scope',
    'docs/review/ag30_self_review.md',
    'docs/review/ag29_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg30SelfReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classification',
    '## Recurring Observations',
    '## Batch-by-Batch Checks',
    '## Review Outcome',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-112',
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'page-image backstop',
    'no new skill file update was necessary',
    'plan-type',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg31PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 31',
    'batch-113',
    'Actuarial Guideline XXXI',
    'page 1',
    'page-image',
    'active',
    'policy form',
    'annual statement',
    'AG 32 remains out of scope',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg32PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 32',
    'batch-114',
    'Actuarial Guideline XXXII',
    'page 1',
    'page 2',
    'page-image',
    'active',
    'immediate payment of claims',
    'AG 33 remains out of scope',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg33ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 33 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
    '## Review Notes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 33',
    'batch-115',
    'batch-116',
    'Actuarial Guideline XXXIII',
    'pp. 1-3',
    'pp. 4-6',
    'page-image',
    'active',
    'AG 34 remains out of scope',
    'line references were not available',
    'docs/review/ag33_self_review.md',
    'docs/review/ag32_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg33SelfReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classification',
    '## Recurring Observations',
    '## Batch-by-Batch Checks',
    '## Review Outcome',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-115',
    'batch-116',
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'page-image backstop',
    'line references were not available',
    'no new skill file update was necessary',
    'elective-benefit',
    'AG 34 boundary',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg33PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 33',
    'batch-115',
    'batch-116',
    'Actuarial Guideline XXXIII',
    'page 1',
    'page 4',
    'page 6',
    'page-image',
    'active',
    'Annuity Contracts With Elective Benefits',
    'AG 34 remains out of scope',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg34ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 34 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
    '## Review Notes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 34',
    'batch-117',
    'batch-118',
    'batch-119',
    'Actuarial Guideline XXXIV',
    'pp. 1-3',
    'pp. 4-6',
    'pp. 7-11',
    'page-image',
    'active',
    'AG 35 remains out of scope',
    'line references were not available',
    'docs/review/ag34_self_review.md',
    'docs/review/ag33_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg34SelfReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classification',
    '## Recurring Observations',
    '## Batch-by-Batch Checks',
    '## Review Outcome',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-117',
    'batch-118',
    'batch-119',
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'page-image backstop',
    'line references were not available',
    'no new skill file update was necessary',
    'mortality basis',
    'AG 35 boundary',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg34PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 34',
    'batch-117',
    'batch-118',
    'batch-119',
    'Actuarial Guideline XXXIV',
    'page 1',
    'page 4',
    'page 7',
    'page-image',
    'active',
    'Variable Annuity Minimum Guaranteed Death Benefit Reserves',
    'AG 35 remains out of scope',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg35ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 35 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
    '## Review Notes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 35',
    'batch-120',
    'batch-121',
    'batch-122',
    'Actuarial Guideline XXXV',
    'pp. 1-3',
    'pp. 4-6',
    'pp. 7-9',
    'page-image',
    'active',
    'AG 36 remains out of scope',
    'line references were not available',
    'docs/review/ag35_self_review.md',
    'docs/review/ag34_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg35SelfReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classification',
    '## Recurring Observations',
    '## Batch-by-Batch Checks',
    '## Review Outcome',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-120',
    'batch-121',
    'batch-122',
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'page-image backstop',
    'line references were not available',
    'no new skill file update was necessary',
    'hedged as required',
    'AG 36 boundary',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg36ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 36 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
    '## Review Notes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 36',
    'batch-123',
    'batch-124',
    'batch-125',
    'batch-126',
    'Actuarial Guideline XXXVI',
    'pp. 1-3',
    'pp. 4-6',
    'pp. 7-8',
    'pp. 9-11',
    'page-image',
    'active',
    'line references were not available',
    'AG 37 remains out of scope',
    'docs/review/ag36_self_review.md',
    'docs/review/ag35_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg36SelfReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classification',
    '## Recurring Observations',
    '## Batch-by-Batch Checks',
    '## Review Outcome',
    '## Batch-124 Addendum',
    '## Batch-125 Addendum',
    '## Batch-126 Addendum',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-123',
    'batch-124',
    'batch-125',
    'batch-126',
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'page-image backstop',
    'line references were not available',
    'no new skill file update was necessary',
    'AG 37 boundary',
    'wave complete',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg37ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 37 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
    '## Review Notes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 37',
    'batch-127',
    'batch-128',
    'batch-129',
    'Actuarial Guideline XXXVII',
    'pp. 1-3',
    'pp. 4-5',
    'p. 6',
    'page-image',
    'active',
    'line references were not available',
    'AG 38 remains out of scope',
    'docs/review/ag37_self_review.md',
    'docs/review/ag36_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
    '2021 Law Manual reprint',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg37SelfReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classification',
    '## Recurring Observations',
    '## Batch-by-Batch Checks',
    '## Review Outcome',
    '## Batch-128 Addendum',
    '## Batch-129 Addendum',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-127',
    'batch-128',
    'batch-129',
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'page-image backstop',
    'line references were not available',
    'AG 38 boundary',
    'wave complete',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
      }
    })
  }

const validateAg38PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 38',
    'batch-130',
    'batch-131',
    'batch-132',
    'batch-133',
    'Actuarial Guideline XXXVIII',
    'pages 1-3',
    'pages 4-6',
    'pages 7-10',
    'pages 11-13',
    'page-image',
    'active',
    'AG 39 remains out of scope',
    '2021 Law Manual reprint',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg38ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 38 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
    '## Review Notes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 38',
    'batch-130',
    'batch-131',
    'batch-132',
    'batch-133',
    'Actuarial Guideline XXXVIII',
    'pp. 1-3',
    'pp. 4-6',
    'pp. 7-10',
    'pp. 11-13',
    'page-image',
    'active',
    'line references were not available',
    'AG 39 remains out of scope',
    'docs/review/ag38_self_review.md',
    'docs/review/ag37_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
    '2021 Law Manual reprint',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg38SelfReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classification',
    '## Recurring Observations',
    '## Batch-by-Batch Checks',
    '## Review Outcome',
    '## Batch-131 Addendum',
    '## Batch-132 Addendum',
    '## Batch-133 Addendum',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-130',
    'batch-131',
    'batch-132',
    'batch-133',
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'page-image backstop',
    'line references were not available',
    'AG 39 boundary',
    'wave complete',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg39PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 39',
    'batch-134',
    'Actuarial Guideline XXXIX',
    'pages 1-2',
    'page-image wording backstop',
    'active',
    'VAGLBs',
    'AG 40 remains out of scope',
    'stable line references are not expected',
    'Line-reference availability checks.',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg39ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 39 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
    '## Review Notes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 39',
    'batch-134',
    'Actuarial Guideline XXXIX',
    'pp. 1-2',
    'page-image wording backstop',
    'active',
    'line references were not available',
    'AG 40 remains out of scope',
    'docs/review/ag39_self_review.md',
    'docs/review/ag38_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
    'VAGLBs',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg39SelfReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classification',
    '## Recurring Observations',
    '## Batch-by-Batch Checks',
    '## Review Outcome',
    '## Batch-134 Addendum',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-134',
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'page-image backstop',
    'line references were not available',
    'AG 40 boundary',
    'wave complete',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg35PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 35',
    'batch-120',
    'batch-121',
    'batch-122',
    'Actuarial Guideline XXXV',
    'page 1',
    'page 4',
    'page 7',
    'page-image',
    'active',
    "The Application of the Commissioners' Annuity Reserve Method to Equity Indexed Annuities",
    'AG 36 remains out of scope',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg36PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 36',
    'batch-123',
    'batch-124',
    'batch-125',
    'batch-126',
    'Actuarial Guideline XXXVI',
    'page 1',
    'page 4',
    'page 7',
    'page-image',
    'active',
    'The Application of the Commissioners’ Reserve Valuation Method to Equity Indexed Life Insurance Policies',
    'AG 37 remains out of scope',
    '2021 Law Manual reprint',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg37PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 37',
    'batch-127',
    'batch-128',
    'batch-129',
    'Actuarial Guideline XXXVII',
    'pages 1-3',
    'pages 4-5',
    'page 6',
    'page-image',
    'active',
    'Variable Life Insurance Reserves for Guaranteed Minimum Death Benefits',
    'AG 38 remains out of scope',
    '2021 Law Manual reprint',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg31ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 31 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
    '## Review Notes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 31',
    'batch-113',
    'Actuarial Guideline XXXI',
    'page 1',
    'page-image',
    'active',
    'policy form',
    'annual statement',
    'AG 32 explicitly remains out of scope',
    'docs/review/ag31_self_review.md',
    'docs/review/ag30_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg31SelfReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classification',
    '## Recurring Observations',
    '## Batch-by-Batch Checks',
    '## Review Outcome',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-113',
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'page-image backstop',
    'no new skill file update was necessary',
    'policy-form',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg32ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 32 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
    '## Review Notes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 32',
    'batch-114',
    'Actuarial Guideline XXXII',
    'pp. 1-2',
    'page-image',
    'active',
    'immediate-payment',
    'AG 33 remains out of scope',
    'line references were not available',
    'docs/review/ag32_self_review.md',
    'docs/review/ag31_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg32SelfReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classification',
    '## Recurring Observations',
    '## Batch-by-Batch Checks',
    '## Review Outcome',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-114',
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'page-image backstop',
    'line references were not available',
    'no new skill file update was necessary',
    'immediate-payment',
    'AG 33 boundary',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg27ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 27 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
    '## Review Notes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 27',
    'batch-107',
    'batch-108',
    'batch-109',
    'Actuarial Guideline XXVII',
    'pages 1-2',
    'page 3',
    'pages 4-5',
    'page-image',
    'active',
    'AG 28 explicitly remains out of scope',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg27SelfReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classification',
    '## Recurring Observations',
    '## Batch-by-Batch Checks',
    '## Review Outcome',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'page-image backstop',
    'no new skill file update was necessary',
    'batch-107',
    'batch-108',
    'batch-109',
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg28ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 28 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
    '## Review Notes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 28',
    'batch-110',
    'Actuarial Guideline XXVIII',
    'page 1',
    'page-image',
    'active',
    'survivor income benefit',
    'group long-term disability',
    'AG 29 explicitly remains out of scope',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg28SelfReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classification',
    '## Recurring Observations',
    '## Batch-by-Batch Checks',
    '## Review Outcome',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'page-image backstop',
    'no new skill file update was necessary',
    'batch-110',
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg29ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 29 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
    '## Review Notes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 29',
    'batch-111',
    'Actuarial Guideline XXIX',
    'pages 1-2',
    'page-image',
    'active',
    'rehabilitation',
    'court-ordered restructuring',
    'AG 30 explicitly remains out of scope',
    'docs/review/ag29_self_review.md',
    'docs/review/ag28_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg29SelfReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classification',
    '## Recurring Observations',
    '## Batch-by-Batch Checks',
    '## Review Outcome',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-111',
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'page-image backstop',
    'no new skill file update was necessary',
    'rehabilitation',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg02PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 02',
    'batch-078',
    'Actuarial Guideline II',
    'page 1',
    'page 2',
    'group annuity contracts',
    'Standard Valuation Law',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg02ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 02 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
    '## Self-Review Note',
    '## Review Notes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 02',
    'batch-078',
    'page 1',
    'page 2',
    'group annuity contracts',
    'Actuarial Guideline II',
    'docs/review/vm20_review_index.md',
    'docs/review/supporting_vm_review_index.md',
    'docs/review/vm21_review_index.md',
    'docs/review/vm22_review_index.md',
    'docs/review/vm20_practice_note_review_index.md',
    'docs/review/ag03_review_index.md',
    'docs/review/ag01_review_index.md',
    'docs/review/ag02_self_review.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg02SelfReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classifications',
    '## Recurring Observations',
    '## Skill-Hardening Note',
    '## Review Outcome',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-078',
    'encoded text layer',
    'No tracked skill file update was necessary',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg24ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 24 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
    '## Self-Review Note',
    '## Review Notes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 24',
    'batch-102',
    'batch-103',
    'batch-104',
    'Actuarial Guideline XXIV',
    'page 1',
    'page 6',
    'page-image',
    'noisy',
    'formula context',
    'maximum allowable surrender charge',
    'variable life nonforfeiture values',
    'docs/review/ag24_self_review.md',
    'docs/review/ag23_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg24SelfReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classifications',
    '## Recurring Observations',
    '## Skill-Hardening Note',
    '## Review Outcome',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-102',
    'batch-103',
    'batch-104',
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'noisy OCR layer',
    'page-image backstop',
    'formula context',
    'No tracked skill file update was necessary',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg25ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 25 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
    '## Self-Review Note',
    '## Review Notes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 25',
    'batch-105',
    'Actuarial Guideline XXV',
    'page 1',
    'page 3',
    'page-image',
    'formula context',
    'Consumer Price Index',
    'cash value accumulation test',
    'docs/review/ag25_self_review.md',
    'docs/review/ag24_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg25SelfReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classifications',
    '## Recurring Observations',
    '## Skill-Hardening Note',
    '## Review Outcome',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-105',
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'page-image backstop',
    'noisy OCR / page-image backstop',
    'No new skill file update was necessary',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg26ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 26 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
    '## Self-Review Note',
    '## Review Notes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 26',
    'batch-106',
    'Actuarial Guideline XXVI',
    'page 1',
    'page-image',
    'dynamic interest-rate boundary',
    'Standard Valuation Law',
    'Standard Non-Forfeiture Law',
    'docs/review/ag26_self_review.md',
    'docs/review/ag25_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg26SelfReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classifications',
    '## Recurring Observations',
    '## Skill-Hardening Note',
    '## Review Outcome',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-106',
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'page-image backstop',
    'noisy OCR / page-image backstop',
    'No new skill file update was necessary',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg40PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 40',
    'batch-135',
    'batch-136',
    'Actuarial Guideline XL',
    'pages 1-4',
    'page-image wording backstop',
    'active',
    'bailout-provision',
    'AG 41 remains out of scope',
    'stable line references are not expected',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg40ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 40 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
    '## Review Notes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 40',
    'batch-135',
    'batch-136',
    'Actuarial Guideline XL',
    'pp. 1-4',
    'page-image wording backstop',
    'active',
    'line references were not available',
    'AG 41 remains out of scope',
    'docs/review/ag40_self_review.md',
    'docs/review/ag39_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
    'bailout-provision',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg40SelfReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classification',
    '## Recurring Observations',
    '## Batch-by-Batch Checks',
    '## Review Outcome',
    '## Batch-135 Addendum',
    '## Batch-136 Addendum',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-135',
    'batch-136',
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'page-image backstop',
    'line references were not available',
    'AG 41 boundary',
    'wave complete',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg41PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 41',
    'batch-137',
    'Actuarial Guideline XLI',
    'pages 1-2',
    'page-image wording backstop',
    'active',
    'line references are not expected',
    'later guideline files',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg41ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 41 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
    '## Review Notes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 41',
    'batch-137',
    'Actuarial Guideline XLI',
    'pp. 1-2',
    'page-image wording backstop',
    'active',
    'line references were not available',
    'later guideline files remain out of scope',
    'docs/review/ag41_self_review.md',
    'docs/review/ag40_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg41SelfReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classification',
    '## Recurring Observations',
    '## Batch-by-Batch Checks',
    '## Review Outcome',
    '## Batch-137 Addendum',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-137',
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'page-image backstop',
    'line references were not available',
    'later guideline boundary',
    'wave complete',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg42PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 42',
    'batch-138',
    'batch-139',
    'Actuarial Guideline XLII',
    'pages 1-2',
    'pages 3-4',
    'page-image wording backstop',
    'active',
    'line references are not expected',
    'later guideline files',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg42ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 42 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
    '## Review Notes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 42',
    'batch-138',
    'batch-139',
    'Actuarial Guideline XLII',
    'pp. 1-4',
    'page-image wording backstop',
    'active',
    'line references were not available',
    'later guideline files remain out of scope',
    'docs/review/ag42_self_review.md',
    'docs/review/ag41_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg42SelfReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classification',
    '## Recurring Observations',
    '## Batch-by-Batch Checks',
    '## Review Outcome',
    '## Batch-138 Addendum',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-138',
    'batch-139',
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'page-image backstop',
    'line references were not available',
    'later guideline boundary',
    'wave complete',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg43ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 43 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
    '## Review Notes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 43',
    'batch-140',
    'batch-148',
    'Actuarial Guideline XLIII',
    '71-page',
    'page-image wording backstop',
    'active',
    'line references were not available',
    'AG 44 remains out of scope',
    'docs/review/ag43_self_review.md',
    'docs/review/ag42_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg43SelfReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classification',
    '## Recurring Observations',
    '## Batch-by-Batch Checks',
    '## Review Outcome',
    '## Batch-140 Addendum',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-140',
    'batch-148',
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'page-image backstop',
    'line references were not available',
    'AG 44 boundary',
    'wave complete',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

function validateAg43PlanLike(plan, label) {
  if (!expectObject(plan, label)) return
  if (plan.planId !== 'ag43-carvm-for-variable-annuities-plan') {
    problems.push(`${label}: planId must be ag43-carvm-for-variable-annuities-plan`)
  }
  if (plan.planVersion !== '1.0') {
    problems.push(`${label}: planVersion must be 1.0`)
  }
  if (plan.status !== 'planned') {
    problems.push(`${label}: status must be planned`)
  }
  if (!expectObject(plan.sourceScope, `${label}.sourceScope`)) return
  if (plan.sourceScope.sourceFamilyId !== 'actuarial_guidelines') {
    problems.push(`${label}.sourceScope: sourceFamilyId must be actuarial_guidelines`)
  }
  if (plan.sourceScope.primarySourceFile !== 'AG 43 - CARVM for Variable Annuities.pdf') {
    problems.push(`${label}.sourceScope: unexpected primarySourceFile`)
  }
  if (!hasString(plan.sourceScope.sourceTitle)) {
    problems.push(`${label}.sourceScope: missing sourceTitle`)
  }
  if (!hasString(plan.sourceScope.sourceReference)) {
    problems.push(`${label}.sourceScope: missing sourceReference`)
  }
  if (!hasString(plan.sourceScope.domainId)) {
    problems.push(`${label}.sourceScope: missing domainId`)
  }
  if (!hasString(plan.sourceScope.rawSourceRoot)) {
    problems.push(`${label}.sourceScope: missing rawSourceRoot`)
  }
  if (!expectArray(plan.sourceScope.confirmedPageRange, `${label}.sourceScope.confirmedPageRange`, false)) return
  if (plan.sourceScope.confirmedPageRange.length !== 2) {
    problems.push(`${label}.sourceScope.confirmedPageRange must contain exactly two page bounds`)
  }
  if (plan.sourceScope.confirmedPageRange[0] !== 1 || plan.sourceScope.confirmedPageRange[1] !== 71) {
    problems.push(`${label}.sourceScope.confirmedPageRange must be [1, 71]`)
  }
  if (!expectArray(plan.sourceScope.observedSectionWindows, `${label}.sourceScope.observedSectionWindows`, false)) return
  if (!expectArray(plan.sourceScope.boundaries, `${label}.sourceScope.boundaries`, false)) return
  if (!expectArray(plan.sourceScope.exclusions, `${label}.sourceScope.exclusions`, false)) return
  if (
    !plan.sourceScope.boundaries.some(
      (entry) => typeof entry === 'string' && entry.includes('AG 44') && entry.includes('out of scope'),
    )
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention AG 44 out-of-scope handling`)
  }
  if (
    !plan.sourceScope.boundaries.some(
      (entry) => typeof entry === 'string' && entry.includes('page-image wording backstop'),
    )
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention the page-image wording backstop`)
  }
  if (
    !plan.sourceScope.boundaries.some(
      (entry) => typeof entry === 'string' && entry.includes('page locators'),
    )
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention page locator handling`)
  }
  if (!plan.sourceScope.exclusions.some((entry) => typeof entry === 'string' && entry.includes('learner-facing'))) {
    problems.push(`${label}.sourceScope.exclusions: must mention learner-facing exclusion`)
  }

  if (!expectArray(plan.topicMap, `${label}.topicMap`, false)) return
  if (!expectArray(plan.proposedBatches, `${label}.proposedBatches`, false)) return
  if (!expectObject(plan.reviewStandards, `${label}.reviewStandards`)) return
  if (!expectObject(plan.promotionGates, `${label}.promotionGates`)) return
  if (!expectObject(plan.validationImplications, `${label}.validationImplications`)) return

  const topicIds = new Set()
  plan.topicMap.forEach((topic, index) => {
    const topicLabel = `${label}.topicMap[${index}]`
    if (!expectObject(topic, topicLabel)) return
    ;['topicId', 'label', 'reviewComplexity', 'boundaryNote'].forEach((field) => {
      if (!hasString(topic[field])) {
        problems.push(`${topicLabel}: missing ${field}`)
      }
    })
    if (!expectArray(topic.pageRange, `${topicLabel}.pageRange`, false)) return
    if (topic.pageRange.length !== 2) {
      problems.push(`${topicLabel}.pageRange must contain exactly two page bounds`)
    }
    if (topic.pageRange[0] < 1 || topic.pageRange[1] > 71) {
      problems.push(`${topicLabel}.pageRange must stay within the confirmed AG 43 page range`)
    }
    if (!expectArray(topic.expectedIssueTypes, `${topicLabel}.expectedIssueTypes`, false)) return
    if (!expectArray(topic.crossReferenceWatchlist, `${topicLabel}.crossReferenceWatchlist`, false)) return
    topicIds.add(topic.topicId)
  })

  const observedTopicIds = new Set()
  plan.proposedBatches.forEach((batch, index) => {
    const batchLabel = `${label}.proposedBatches[${index}]`
    if (!expectObject(batch, batchLabel)) return
    ;['plannedBatchId', 'title', 'reviewComplexity', 'rationale', 'automationFit'].forEach((field) => {
      if (!hasString(batch[field])) {
        problems.push(`${batchLabel}: missing ${field}`)
      }
    })
    if (!expectArray(batch.topicIds, `${batchLabel}.topicIds`, false)) return
    if (!expectArray(batch.expectedIssueTypes, `${batchLabel}.expectedIssueTypes`, false)) return
    if (!expectObject(batch.pageTarget, `${batchLabel}.pageTarget`)) return
    if (batch.reviewOnlyByDefault !== true) {
      problems.push(`${batchLabel}: reviewOnlyByDefault must be true`)
    }
    if (batch.sameStopConditionsAsVm20 !== true) {
      problems.push(`${batchLabel}: sameStopConditionsAsVm20 must be true`)
    }
    batch.topicIds.forEach((topicId) => {
      if (!topicIds.has(topicId)) {
        problems.push(`${batchLabel}: unknown topicId ${topicId}`)
      }
      observedTopicIds.add(topicId)
    })
    if (!expectArray(batch.pageTarget.knownWindow, `${batchLabel}.pageTarget.knownWindow`, false)) return
    if (batch.pageTarget.knownWindow.length !== 2) {
      problems.push(`${batchLabel}.pageTarget.knownWindow must contain exactly two page bounds`)
    }
    if (batch.pageTarget.knownWindow[0] < 1 || batch.pageTarget.knownWindow[1] > 71) {
      problems.push(`${batchLabel}.pageTarget.knownWindow must stay within the confirmed AG 43 page range`)
    }
  })

  topicIds.forEach((topicId) => {
    if (!observedTopicIds.has(topicId)) {
      problems.push(`${label}.proposedBatches: missing batch coverage for topicId ${topicId}`)
    }
  })

  ;[
    'regulatoryRequirement',
    'definitionOrTerminology',
    'reserveMethodStructure',
    'calculationStructure',
    'formulaContext',
    'prescribedAssumption',
    'companyOrPrudentEstimateAssumption',
    'scenarioOrStochasticRequirement',
    'assetModelingJudgment',
    'hedgingOrRiskMitigation',
    'reportingRequirement',
    'documentationExpectation',
    'crossReferenceMapping',
    'backgroundContent',
    'boundaryControlWindow',
    'requiresHumanInterpretation',
  ].forEach((field) => {
    if (!hasString(plan.reviewStandards[field])) {
      problems.push(`${label}.reviewStandards: missing ${field}`)
    }
  })

  if (plan.promotionGates.defaultState !== 'review_only') {
    problems.push(`${label}.promotionGates.defaultState must be review_only`)
  }
  if (!expectArray(plan.promotionGates.learnerFacing, `${label}.promotionGates.learnerFacing`, false)) return
  if (!expectArray(plan.promotionGates.appReady, `${label}.promotionGates.appReady`, false)) return
  if (!expectArray(plan.promotionGates.ragReady, `${label}.promotionGates.ragReady`, false)) return
  if (!expectArray(plan.validationImplications.currentChecksNeeded, `${label}.validationImplications.currentChecksNeeded`, false)) return
  if (!expectArray(plan.validationImplications.futureChecksSuggested, `${label}.validationImplications.futureChecksSuggested`, false)) return
  if (!expectArray(plan.validationImplications.scriptImplications, `${label}.validationImplications.scriptImplications`, false)) return
}

function validateAg44PlanLike(plan, label) {
  if (!expectObject(plan, label)) return
  if (plan.planId !== 'ag44-group-term-life-waiver-of-premium-disabled-lives-reserves-plan') {
    problems.push(`${label}: planId must be ag44-group-term-life-waiver-of-premium-disabled-lives-reserves-plan`)
  }
  if (plan.planVersion !== '1.0') {
    problems.push(`${label}: planVersion must be 1.0`)
  }
  if (plan.status !== 'planned') {
    problems.push(`${label}: status must be planned`)
  }
  if (!expectObject(plan.sourceScope, `${label}.sourceScope`)) return
  if (plan.sourceScope.sourceFamilyId !== 'actuarial_guidelines') {
    problems.push(`${label}.sourceScope: sourceFamilyId must be actuarial_guidelines`)
  }
  if (
    plan.sourceScope.primarySourceFile !==
    'AG 44 - Group Term Life Waiver of Premium Disabled Lives Reserves.pdf'
  ) {
    problems.push(`${label}.sourceScope: unexpected primarySourceFile`)
  }
  if (!hasString(plan.sourceScope.sourceTitle)) {
    problems.push(`${label}.sourceScope: missing sourceTitle`)
  }
  if (!hasString(plan.sourceScope.sourceReference)) {
    problems.push(`${label}.sourceScope: missing sourceReference`)
  }
  if (!hasString(plan.sourceScope.domainId)) {
    problems.push(`${label}.sourceScope: missing domainId`)
  }
  if (!hasString(plan.sourceScope.rawSourceRoot)) {
    problems.push(`${label}.sourceScope: missing rawSourceRoot`)
  }
  if (!expectArray(plan.sourceScope.confirmedPageRange, `${label}.sourceScope.confirmedPageRange`, false)) return
  if (plan.sourceScope.confirmedPageRange.length !== 2) {
    problems.push(`${label}.sourceScope.confirmedPageRange must contain exactly two page bounds`)
  }
  if (plan.sourceScope.confirmedPageRange[0] !== 1 || plan.sourceScope.confirmedPageRange[1] !== 7) {
    problems.push(`${label}.sourceScope.confirmedPageRange must be [1, 7]`)
  }
  if (!expectArray(plan.sourceScope.observedSectionWindows, `${label}.sourceScope.observedSectionWindows`, false)) return
  if (!expectArray(plan.sourceScope.boundaries, `${label}.sourceScope.boundaries`, false)) return
  if (!expectArray(plan.sourceScope.exclusions, `${label}.sourceScope.exclusions`, false)) return
  if (
    !plan.sourceScope.boundaries.some(
      (entry) => typeof entry === 'string' && entry.includes('AG 45') && entry.includes('out of scope'),
    )
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention AG 45 out-of-scope handling`)
  }
  if (
    !plan.sourceScope.boundaries.some(
      (entry) => typeof entry === 'string' && entry.includes('page-image wording backstop'),
    )
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention the page-image wording backstop`)
  }
  if (
    !plan.sourceScope.boundaries.some(
      (entry) => typeof entry === 'string' && entry.includes('page locators'),
    )
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention page locator handling`)
  }
  if (!plan.sourceScope.exclusions.some((entry) => typeof entry === 'string' && entry.includes('learner-facing'))) {
    problems.push(`${label}.sourceScope.exclusions: must mention learner-facing exclusion`)
  }

  if (!expectArray(plan.topicMap, `${label}.topicMap`, false)) return
  if (!expectArray(plan.proposedBatches, `${label}.proposedBatches`, false)) return
  if (!expectObject(plan.reviewStandards, `${label}.reviewStandards`)) return
  if (!expectObject(plan.promotionGates, `${label}.promotionGates`)) return
  if (!expectObject(plan.validationImplications, `${label}.validationImplications`)) return

  const topicIds = new Set()
  plan.topicMap.forEach((topic, index) => {
    const topicLabel = `${label}.topicMap[${index}]`
    if (!expectObject(topic, topicLabel)) return
    ;['topicId', 'label', 'reviewComplexity', 'boundaryNote'].forEach((field) => {
      if (!hasString(topic[field])) {
        problems.push(`${topicLabel}: missing ${field}`)
      }
    })
    if (!expectArray(topic.pageRange, `${topicLabel}.pageRange`, false)) return
    if (topic.pageRange.length !== 2) {
      problems.push(`${topicLabel}.pageRange must contain exactly two page bounds`)
    }
    if (topic.pageRange[0] < 1 || topic.pageRange[1] > 7) {
      problems.push(`${topicLabel}.pageRange must stay within the confirmed AG 44 page range`)
    }
    if (!expectArray(topic.expectedIssueTypes, `${topicLabel}.expectedIssueTypes`, false)) return
    if (!expectArray(topic.crossReferenceWatchlist, `${topicLabel}.crossReferenceWatchlist`, false)) return
    topicIds.add(topic.topicId)
  })

  const observedTopicIds = new Set()
  plan.proposedBatches.forEach((batch, index) => {
    const batchLabel = `${label}.proposedBatches[${index}]`
    if (!expectObject(batch, batchLabel)) return
    ;['plannedBatchId', 'title', 'reviewComplexity', 'rationale', 'automationFit'].forEach((field) => {
      if (!hasString(batch[field])) {
        problems.push(`${batchLabel}: missing ${field}`)
      }
    })
    if (!expectArray(batch.topicIds, `${batchLabel}.topicIds`, false)) return
    if (!expectArray(batch.expectedIssueTypes, `${batchLabel}.expectedIssueTypes`, false)) return
    if (!expectObject(batch.pageTarget, `${batchLabel}.pageTarget`)) return
    if (batch.reviewOnlyByDefault !== true) {
      problems.push(`${batchLabel}: reviewOnlyByDefault must be true`)
    }
    if (batch.sameStopConditionsAsVm20 !== true) {
      problems.push(`${batchLabel}: sameStopConditionsAsVm20 must be true`)
    }
    batch.topicIds.forEach((topicId) => {
      if (!topicIds.has(topicId)) {
        problems.push(`${batchLabel}: unknown topicId ${topicId}`)
      }
      observedTopicIds.add(topicId)
    })
    if (!expectArray(batch.pageTarget.knownWindow, `${batchLabel}.pageTarget.knownWindow`, false)) return
    if (batch.pageTarget.knownWindow.length !== 2) {
      problems.push(`${batchLabel}.pageTarget.knownWindow must contain exactly two page bounds`)
    }
    if (batch.pageTarget.knownWindow[0] < 1 || batch.pageTarget.knownWindow[1] > 7) {
      problems.push(`${batchLabel}.pageTarget.knownWindow must stay within the confirmed AG 44 page range`)
    }
  })

  topicIds.forEach((topicId) => {
    if (!observedTopicIds.has(topicId)) {
      problems.push(`${label}.proposedBatches: missing batch coverage for topicId ${topicId}`)
    }
  })

  ;[
    'regulatoryRequirement',
    'definitionOrTerminology',
    'reserveMethodStructure',
    'calculationStructure',
    'formulaContext',
    'prescribedAssumption',
    'companyOrPrudentEstimateAssumption',
    'scenarioOrStochasticRequirement',
    'assetModelingJudgment',
    'hedgingOrRiskMitigation',
    'reportingRequirement',
    'documentationExpectation',
    'crossReferenceMapping',
    'backgroundContent',
    'boundaryControlWindow',
    'requiresHumanInterpretation',
  ].forEach((field) => {
    if (!hasString(plan.reviewStandards[field])) {
      problems.push(`${label}.reviewStandards: missing ${field}`)
    }
  })

  if (plan.promotionGates.defaultState !== 'review_only') {
    problems.push(`${label}.promotionGates.defaultState must be review_only`)
  }
  if (!expectArray(plan.promotionGates.learnerFacing, `${label}.promotionGates.learnerFacing`, false)) return
  if (!expectArray(plan.promotionGates.appReady, `${label}.promotionGates.appReady`, false)) return
  if (!expectArray(plan.promotionGates.ragReady, `${label}.promotionGates.ragReady`, false)) return
  if (!expectArray(plan.validationImplications.currentChecksNeeded, `${label}.validationImplications.currentChecksNeeded`, false)) return
  if (!expectArray(plan.validationImplications.futureChecksSuggested, `${label}.validationImplications.futureChecksSuggested`, false)) return
  if (!expectArray(plan.validationImplications.scriptImplications, `${label}.validationImplications.scriptImplications`, false)) return
}

function validateAg46PlanLike(plan, label) {
  if (!expectObject(plan, label)) return
  if (plan.planId !== 'ag46-segment-length-change-in-valuation-mortality-rates-plan') {
    problems.push(`${label}: planId must be ag46-segment-length-change-in-valuation-mortality-rates-plan`)
  }
  if (plan.planVersion !== '1.0') {
    problems.push(`${label}: planVersion must be 1.0`)
  }
  if (plan.status !== 'planned') {
    problems.push(`${label}: status must be planned`)
  }
  if (!expectObject(plan.sourceScope, `${label}.sourceScope`)) return
  if (plan.sourceScope.sourceFamilyId !== 'actuarial_guidelines') {
    problems.push(`${label}.sourceScope: sourceFamilyId must be actuarial_guidelines`)
  }
  if (
    plan.sourceScope.primarySourceFile !==
    'AG 46 - Interpretation of the Calculation of the Segment Length with Respect to the Life Insurance Policies Model Regulation Upon a Change in the Valu.pdf'
  ) {
    problems.push(`${label}.sourceScope: unexpected primarySourceFile`)
  }
  if (!hasString(plan.sourceScope.sourceTitle)) {
    problems.push(`${label}.sourceScope: missing sourceTitle`)
  }
  if (!hasString(plan.sourceScope.sourceReference)) {
    problems.push(`${label}.sourceScope: missing sourceReference`)
  }
  if (!hasString(plan.sourceScope.domainId)) {
    problems.push(`${label}.sourceScope: missing domainId`)
  }
  if (!hasString(plan.sourceScope.rawSourceRoot)) {
    problems.push(`${label}.sourceScope: missing rawSourceRoot`)
  }
  if (!expectArray(plan.sourceScope.confirmedPageRange, `${label}.sourceScope.confirmedPageRange`, false)) return
  if (plan.sourceScope.confirmedPageRange.length !== 2) {
    problems.push(`${label}.sourceScope.confirmedPageRange must contain exactly two page bounds`)
  }
  if (plan.sourceScope.confirmedPageRange[0] !== 1 || plan.sourceScope.confirmedPageRange[1] !== 2) {
    problems.push(`${label}.sourceScope.confirmedPageRange must be [1, 2]`)
  }
  if (!expectArray(plan.sourceScope.observedSectionWindows, `${label}.sourceScope.observedSectionWindows`, false)) return
  if (!expectArray(plan.sourceScope.boundaries, `${label}.sourceScope.boundaries`, false)) return
  if (!expectArray(plan.sourceScope.exclusions, `${label}.sourceScope.exclusions`, false)) return
  if (
    !plan.sourceScope.boundaries.some(
      (entry) => typeof entry === 'string' && entry.includes('AG 47') && entry.includes('out of scope'),
    )
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention AG 47 out-of-scope handling`)
  }
  if (
    !plan.sourceScope.boundaries.some(
      (entry) => typeof entry === 'string' && entry.includes('page-image wording backstop'),
    )
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention the page-image wording backstop`)
  }
  if (
    !plan.sourceScope.boundaries.some(
      (entry) => typeof entry === 'string' && entry.includes('page locators'),
    )
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention page locator handling`)
  }
  if (!plan.sourceScope.exclusions.some((entry) => typeof entry === 'string' && entry.includes('learner-facing'))) {
    problems.push(`${label}.sourceScope.exclusions: must mention learner-facing exclusion`)
  }

  if (!expectArray(plan.topicMap, `${label}.topicMap`, false)) return
  if (!expectArray(plan.proposedBatches, `${label}.proposedBatches`, false)) return
  if (!expectObject(plan.reviewStandards, `${label}.reviewStandards`)) return
  if (!expectObject(plan.promotionGates, `${label}.promotionGates`)) return
  if (!expectObject(plan.validationImplications, `${label}.validationImplications`)) return

  const topicIds = new Set()
  plan.topicMap.forEach((topic, index) => {
    const topicLabel = `${label}.topicMap[${index}]`
    if (!expectObject(topic, topicLabel)) return
    ;['topicId', 'label', 'boundaryNote'].forEach((field) => {
      if (!hasString(topic[field])) {
        problems.push(`${topicLabel}: missing ${field}`)
      }
    })
    if (!expectArray(topic.pageRange, `${topicLabel}.pageRange`, false)) return
    if (!expectArray(topic.expectedIssueTypes, `${topicLabel}.expectedIssueTypes`, false)) return
    if (!expectArray(topic.crossReferenceWatchlist, `${topicLabel}.crossReferenceWatchlist`, false)) return
    topicIds.add(topic.topicId)
  })

  const observedTopicIds = new Set()
  plan.proposedBatches.forEach((batch, index) => {
    const batchLabel = `${label}.proposedBatches[${index}]`
    if (!expectObject(batch, batchLabel)) return
    ;['plannedBatchId', 'title', 'reviewComplexity', 'rationale', 'automationFit'].forEach((field) => {
      if (!hasString(batch[field])) {
        problems.push(`${batchLabel}: missing ${field}`)
      }
    })
    if (!expectArray(batch.topicIds, `${batchLabel}.topicIds`, false)) return
    if (!expectArray(batch.expectedIssueTypes, `${batchLabel}.expectedIssueTypes`, false)) return
    if (!expectObject(batch.pageTarget, `${batchLabel}.pageTarget`)) return
    if (batch.reviewOnlyByDefault !== true) {
      problems.push(`${batchLabel}: reviewOnlyByDefault must be true`)
    }
    if (batch.sameStopConditionsAsVm20 !== true) {
      problems.push(`${batchLabel}: sameStopConditionsAsVm20 must be true`)
    }
    batch.topicIds.forEach((topicId) => {
      if (!topicIds.has(topicId)) {
        problems.push(`${batchLabel}: unknown topicId ${topicId}`)
      }
      observedTopicIds.add(topicId)
    })
    if (!expectArray(batch.pageTarget.knownWindow, `${batchLabel}.pageTarget.knownWindow`, false)) return
    if (batch.pageTarget.knownWindow.length !== 2) {
      problems.push(`${batchLabel}.pageTarget.knownWindow must contain exactly two page bounds`)
    }
    if (batch.pageTarget.knownWindow[0] < 1 || batch.pageTarget.knownWindow[1] > 2) {
      problems.push(`${batchLabel}.pageTarget.knownWindow must stay within the confirmed AG 46 page range`)
    }
  })

  topicIds.forEach((topicId) => {
    if (!observedTopicIds.has(topicId)) {
      problems.push(`${label}.proposedBatches: missing batch coverage for topicId ${topicId}`)
    }
  })

  ;[
    'regulatoryRequirement',
    'definitionOrTerminology',
    'reserveMethodStructure',
    'calculationStructure',
    'formulaContext',
    'prescribedAssumption',
    'companyOrPrudentEstimateAssumption',
    'scenarioOrStochasticRequirement',
    'assetModelingJudgment',
    'hedgingOrRiskMitigation',
    'reportingRequirement',
    'documentationExpectation',
    'crossReferenceMapping',
    'backgroundContent',
    'boundaryControlWindow',
    'requiresHumanInterpretation',
  ].forEach((field) => {
    if (!hasString(plan.reviewStandards[field])) {
      problems.push(`${label}.reviewStandards: missing ${field}`)
    }
  })

  if (plan.promotionGates.defaultState !== 'review_only') {
    problems.push(`${label}.promotionGates.defaultState must be review_only`)
  }
  if (!expectArray(plan.promotionGates.learnerFacing, `${label}.promotionGates.learnerFacing`, false)) return
  if (!expectArray(plan.promotionGates.appReady, `${label}.promotionGates.appReady`, false)) return
  if (!expectArray(plan.promotionGates.ragReady, `${label}.promotionGates.ragReady`, false)) return
  if (!expectArray(plan.validationImplications.currentChecksNeeded, `${label}.validationImplications.currentChecksNeeded`, false)) return
  if (!expectArray(plan.validationImplications.futureChecksSuggested, `${label}.validationImplications.futureChecksSuggested`, false)) return
  if (!expectArray(plan.validationImplications.scriptImplications, `${label}.validationImplications.scriptImplications`, false)) return
}

function validateAg47PlanLike(plan, label) {
  if (!expectObject(plan, label)) return
  if (plan.planId !== 'ag47-group-long-term-disability-claim-reserve-company-experience-plan') {
    problems.push(`${label}: planId must be ag47-group-long-term-disability-claim-reserve-company-experience-plan`)
  }
  if (plan.planVersion !== '1.0') {
    problems.push(`${label}: planVersion must be 1.0`)
  }
  if (plan.status !== 'planned') {
    problems.push(`${label}: status must be planned`)
  }
  if (!expectObject(plan.sourceScope, `${label}.sourceScope`)) return
  if (plan.sourceScope.sourceFamilyId !== 'actuarial_guidelines') {
    problems.push(`${label}.sourceScope: sourceFamilyId must be actuarial_guidelines`)
  }
  if (
    plan.sourceScope.primarySourceFile !==
    'AG 47 - The Application of Company Experience in the Calculation of Claim Reserves Under the 2012 Group Long-Term Disability Valuation Table.pdf'
  ) {
    problems.push(`${label}.sourceScope: unexpected primarySourceFile`)
  }
  if (!hasString(plan.sourceScope.sourceTitle)) {
    problems.push(`${label}.sourceScope: missing sourceTitle`)
  }
  if (!hasString(plan.sourceScope.sourceReference)) {
    problems.push(`${label}.sourceScope: missing sourceReference`)
  }
  if (!hasString(plan.sourceScope.domainId)) {
    problems.push(`${label}.sourceScope: missing domainId`)
  }
  if (!hasString(plan.sourceScope.rawSourceRoot)) {
    problems.push(`${label}.sourceScope: missing rawSourceRoot`)
  }
  if (!expectArray(plan.sourceScope.confirmedPageRange, `${label}.sourceScope.confirmedPageRange`, false)) return
  if (plan.sourceScope.confirmedPageRange.length !== 2) {
    problems.push(`${label}.sourceScope.confirmedPageRange must contain exactly two page bounds`)
  }
  if (plan.sourceScope.confirmedPageRange[0] !== 1 || plan.sourceScope.confirmedPageRange[1] !== 4) {
    problems.push(`${label}.sourceScope.confirmedPageRange must be [1, 4]`)
  }
  if (!expectArray(plan.sourceScope.observedSectionWindows, `${label}.sourceScope.observedSectionWindows`, false)) return
  if (!expectArray(plan.sourceScope.boundaries, `${label}.sourceScope.boundaries`, false)) return
  if (!expectArray(plan.sourceScope.exclusions, `${label}.sourceScope.exclusions`, false)) return
  if (
    !plan.sourceScope.boundaries.some(
      (entry) => typeof entry === 'string' && entry.includes('AG 48') && entry.includes('out of scope'),
    )
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention AG 48 out-of-scope handling`)
  }
  if (
    !plan.sourceScope.boundaries.some(
      (entry) => typeof entry === 'string' && entry.includes('page-image wording backstop'),
    )
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention the page-image wording backstop`)
  }
  if (
    !plan.sourceScope.boundaries.some(
      (entry) => typeof entry === 'string' && entry.includes('page locators'),
    )
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention page locator handling`)
  }
  if (!plan.sourceScope.exclusions.some((entry) => typeof entry === 'string' && entry.includes('learner-facing'))) {
    problems.push(`${label}.sourceScope.exclusions: must mention learner-facing exclusion`)
  }

  if (!expectArray(plan.topicMap, `${label}.topicMap`, false)) return
  if (!expectArray(plan.proposedBatches, `${label}.proposedBatches`, false)) return
  if (!expectObject(plan.reviewStandards, `${label}.reviewStandards`)) return
  if (!expectObject(plan.promotionGates, `${label}.promotionGates`)) return
  if (!expectObject(plan.validationImplications, `${label}.validationImplications`)) return

  const topicIds = new Set()
  plan.topicMap.forEach((topic, index) => {
    const topicLabel = `${label}.topicMap[${index}]`
    if (!expectObject(topic, topicLabel)) return
    ;['topicId', 'label', 'boundaryNote'].forEach((field) => {
      if (!hasString(topic[field])) {
        problems.push(`${topicLabel}: missing ${field}`)
      }
    })
    if (!expectArray(topic.pageRange, `${topicLabel}.pageRange`, false)) return
    if (!expectArray(topic.expectedIssueTypes, `${topicLabel}.expectedIssueTypes`, false)) return
    if (!expectArray(topic.crossReferenceWatchlist, `${topicLabel}.crossReferenceWatchlist`, false)) return
    topicIds.add(topic.topicId)
  })

  const observedTopicIds = new Set()
  plan.proposedBatches.forEach((batch, index) => {
    const batchLabel = `${label}.proposedBatches[${index}]`
    if (!expectObject(batch, batchLabel)) return
    ;['plannedBatchId', 'title', 'reviewComplexity', 'rationale', 'automationFit'].forEach((field) => {
      if (!hasString(batch[field])) {
        problems.push(`${batchLabel}: missing ${field}`)
      }
    })
    if (!expectArray(batch.topicIds, `${batchLabel}.topicIds`, false)) return
    if (!expectArray(batch.expectedIssueTypes, `${batchLabel}.expectedIssueTypes`, false)) return
    if (!expectObject(batch.pageTarget, `${batchLabel}.pageTarget`)) return
    if (batch.reviewOnlyByDefault !== true) {
      problems.push(`${batchLabel}: reviewOnlyByDefault must be true`)
    }
    if (batch.sameStopConditionsAsVm20 !== true) {
      problems.push(`${batchLabel}: sameStopConditionsAsVm20 must be true`)
    }
    batch.topicIds.forEach((topicId) => {
      if (!topicIds.has(topicId)) {
        problems.push(`${batchLabel}: unknown topicId ${topicId}`)
      }
      observedTopicIds.add(topicId)
    })
    if (!expectArray(batch.pageTarget.knownWindow, `${batchLabel}.pageTarget.knownWindow`, false)) return
    if (batch.pageTarget.knownWindow.length !== 2) {
      problems.push(`${batchLabel}.pageTarget.knownWindow must contain exactly two page bounds`)
    }
    if (batch.pageTarget.knownWindow[0] < 1 || batch.pageTarget.knownWindow[1] > 4) {
      problems.push(`${batchLabel}.pageTarget.knownWindow must stay within the confirmed AG 47 page range`)
    }
  })

  topicIds.forEach((topicId) => {
    if (!observedTopicIds.has(topicId)) {
      problems.push(`${label}.proposedBatches: missing batch coverage for topicId ${topicId}`)
    }
  })

  ;[
    'regulatoryRequirement',
    'definitionOrTerminology',
    'reserveMethodStructure',
    'calculationStructure',
    'formulaContext',
    'prescribedAssumption',
    'companyOrPrudentEstimateAssumption',
    'scenarioOrStochasticRequirement',
    'assetModelingJudgment',
    'hedgingOrRiskMitigation',
    'reportingRequirement',
    'documentationExpectation',
    'crossReferenceMapping',
    'backgroundContent',
    'boundaryControlWindow',
    'requiresHumanInterpretation',
  ].forEach((field) => {
    if (!hasString(plan.reviewStandards[field])) {
      problems.push(`${label}.reviewStandards: missing ${field}`)
    }
  })

  if (plan.promotionGates.defaultState !== 'review_only') {
    problems.push(`${label}.promotionGates.defaultState must be review_only`)
  }
  if (!expectArray(plan.promotionGates.learnerFacing, `${label}.promotionGates.learnerFacing`, false)) return
  if (!expectArray(plan.promotionGates.appReady, `${label}.promotionGates.appReady`, false)) return
  if (!expectArray(plan.promotionGates.ragReady, `${label}.promotionGates.ragReady`, false)) return
  if (!expectArray(plan.validationImplications.currentChecksNeeded, `${label}.validationImplications.currentChecksNeeded`, false)) return
  if (!expectArray(plan.validationImplications.futureChecksSuggested, `${label}.validationImplications.futureChecksSuggested`, false)) return
  if (!expectArray(plan.validationImplications.scriptImplications, `${label}.validationImplications.scriptImplications`, false)) return
}

function validateAg48PlanLike(plan, label) {
  if (!expectObject(plan, label)) return
  if (plan.planId !== 'ag48-reinsurance-opinion-memorandum-requirements-plan') {
    problems.push(`${label}: planId must be ag48-reinsurance-opinion-memorandum-requirements-plan`)
  }
  if (plan.planVersion !== '1.0') {
    problems.push(`${label}: planVersion must be 1.0`)
  }
  if (plan.status !== 'planned') {
    problems.push(`${label}: status must be planned`)
  }
  if (!expectObject(plan.sourceScope, `${label}.sourceScope`)) return
  if (plan.sourceScope.sourceFamilyId !== 'actuarial_guidelines') {
    problems.push(`${label}.sourceScope: sourceFamilyId must be actuarial_guidelines`)
  }
  if (
    plan.sourceScope.primarySourceFile !==
    'AG 48 - Actuarial Opinion and Memorandum Requirements for the Reinsurance of Policies Required to be Valued under Sections 6 and 7 of the NAIC Valuati.pdf'
  ) {
    problems.push(`${label}.sourceScope: unexpected primarySourceFile`)
  }
  if (!hasString(plan.sourceScope.sourceTitle)) {
    problems.push(`${label}.sourceScope: missing sourceTitle`)
  }
  if (!hasString(plan.sourceScope.sourceReference)) {
    problems.push(`${label}.sourceScope: missing sourceReference`)
  }
  if (!hasString(plan.sourceScope.domainId)) {
    problems.push(`${label}.sourceScope: missing domainId`)
  }
  if (!hasString(plan.sourceScope.rawSourceRoot)) {
    problems.push(`${label}.sourceScope: missing rawSourceRoot`)
  }
  if (!expectArray(plan.sourceScope.confirmedPageRange, `${label}.sourceScope.confirmedPageRange`, false)) return
  if (plan.sourceScope.confirmedPageRange.length !== 2) {
    problems.push(`${label}.sourceScope.confirmedPageRange must contain exactly two page bounds`)
  }
  if (plan.sourceScope.confirmedPageRange[0] !== 1 || plan.sourceScope.confirmedPageRange[1] !== 12) {
    problems.push(`${label}.sourceScope.confirmedPageRange must be [1, 12]`)
  }
  if (!expectArray(plan.sourceScope.observedSectionWindows, `${label}.sourceScope.observedSectionWindows`, false)) return
  if (!expectArray(plan.sourceScope.boundaries, `${label}.sourceScope.boundaries`, false)) return
  if (!expectArray(plan.sourceScope.exclusions, `${label}.sourceScope.exclusions`, false)) return
  if (
    !plan.sourceScope.boundaries.some(
      (entry) => typeof entry === 'string' && entry.includes('AG 48') && entry.includes('out of scope'),
    )
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention AG 48 out-of-scope handling`)
  }
  if (
    !plan.sourceScope.boundaries.some(
      (entry) => typeof entry === 'string' && entry.includes('page-image wording backstop'),
    )
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention the page-image wording backstop`)
  }
  if (
    !plan.sourceScope.boundaries.some(
      (entry) => typeof entry === 'string' && entry.includes('page locators'),
    )
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention page locator handling`)
  }
  if (
    !plan.sourceScope.exclusions.some(
      (entry) => typeof entry === 'string' && entry.includes('2021 Law Manual reprint'),
    )
  ) {
    problems.push(`${label}.sourceScope.exclusions: must mention the 2021 Law Manual reprint exclusion`)
  }

  if (!expectArray(plan.topicMap, `${label}.topicMap`, false)) return
  if (!expectArray(plan.proposedBatches, `${label}.proposedBatches`, false)) return
  if (!expectObject(plan.reviewStandards, `${label}.reviewStandards`)) return
  if (!expectObject(plan.promotionGates, `${label}.promotionGates`)) return
  if (!expectObject(plan.validationImplications, `${label}.validationImplications`)) return

  const topicIds = new Set()
  plan.topicMap.forEach((topic, index) => {
    const topicLabel = `${label}.topicMap[${index}]`
    if (!expectObject(topic, topicLabel)) return
    ;['topicId', 'label', 'boundaryNote'].forEach((field) => {
      if (!hasString(topic[field])) {
        problems.push(`${topicLabel}: missing ${field}`)
      }
    })
    if (!expectArray(topic.pageRange, `${topicLabel}.pageRange`, false)) return
    if (!expectArray(topic.expectedIssueTypes, `${topicLabel}.expectedIssueTypes`, false)) return
    if (!expectArray(topic.crossReferenceWatchlist, `${topicLabel}.crossReferenceWatchlist`, false)) return
    topicIds.add(topic.topicId)
  })

  const observedTopicIds = new Set()
  plan.proposedBatches.forEach((batch, index) => {
    const batchLabel = `${label}.proposedBatches[${index}]`
    if (!expectObject(batch, batchLabel)) return
    ;['plannedBatchId', 'title', 'reviewComplexity', 'rationale', 'automationFit'].forEach((field) => {
      if (!hasString(batch[field])) {
        problems.push(`${batchLabel}: missing ${field}`)
      }
    })
    if (!expectArray(batch.topicIds, `${batchLabel}.topicIds`, false)) return
    if (!expectArray(batch.expectedIssueTypes, `${batchLabel}.expectedIssueTypes`, false)) return
    if (!expectObject(batch.pageTarget, `${batchLabel}.pageTarget`)) return
    if (batch.reviewOnlyByDefault !== true) {
      problems.push(`${batchLabel}: reviewOnlyByDefault must be true`)
    }
    if (batch.sameStopConditionsAsVm20 !== true) {
      problems.push(`${batchLabel}: sameStopConditionsAsVm20 must be true`)
    }
    batch.topicIds.forEach((topicId) => {
      if (!topicIds.has(topicId)) {
        problems.push(`${batchLabel}: unknown topicId ${topicId}`)
      }
      observedTopicIds.add(topicId)
    })
    if (!expectArray(batch.pageTarget.knownWindow, `${batchLabel}.pageTarget.knownWindow`, false)) return
    if (batch.pageTarget.knownWindow.length !== 2) {
      problems.push(`${batchLabel}.pageTarget.knownWindow must contain exactly two page bounds`)
    }
    if (batch.pageTarget.knownWindow[0] < 1 || batch.pageTarget.knownWindow[1] > 12) {
      problems.push(`${batchLabel}.pageTarget.knownWindow must stay within the confirmed AG 48 page range`)
    }
  })

  topicIds.forEach((topicId) => {
    if (!observedTopicIds.has(topicId)) {
      problems.push(`${label}.proposedBatches: missing batch coverage for topicId ${topicId}`)
    }
  })

  ;[
    'regulatoryRequirement',
    'definitionOrTerminology',
    'reserveMethodStructure',
    'calculationStructure',
    'formulaContext',
    'prescribedAssumption',
    'companyOrPrudentEstimateAssumption',
    'scenarioOrStochasticRequirement',
    'assetModelingJudgment',
    'hedgingOrRiskMitigation',
    'reportingRequirement',
    'documentationExpectation',
    'crossReferenceMapping',
    'backgroundContent',
    'boundaryControlWindow',
    'requiresHumanInterpretation',
  ].forEach((field) => {
    if (!hasString(plan.reviewStandards[field])) {
      problems.push(`${label}.reviewStandards: missing ${field}`)
    }
  })

  if (plan.promotionGates.defaultState !== 'review_only') {
    problems.push(`${label}.promotionGates.defaultState must be review_only`)
  }
  if (!expectArray(plan.promotionGates.learnerFacing, `${label}.promotionGates.learnerFacing`, false)) return
  if (!expectArray(plan.promotionGates.appReady, `${label}.promotionGates.appReady`, false)) return
  if (!expectArray(plan.promotionGates.ragReady, `${label}.promotionGates.ragReady`, false)) return
  if (!expectArray(plan.validationImplications.currentChecksNeeded, `${label}.validationImplications.currentChecksNeeded`, false)) return
  if (!expectArray(plan.validationImplications.futureChecksSuggested, `${label}.validationImplications.futureChecksSuggested`, false)) return
  if (!expectArray(plan.validationImplications.scriptImplications, `${label}.validationImplications.scriptImplications`, false)) return
}

const validateAg43PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 43',
    'batch-140',
    'batch-148',
    'Actuarial Guideline XLIII',
    'pages 1-71',
    'page-image wording backstop',
    'active',
    'line references are not expected',
    'AG 44 remains out of scope',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg44PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 44',
    'batch-149',
    'batch-150',
    'Actuarial Guideline XLIV',
    'pages 1-7',
    'page-image wording backstop',
    'page locators',
    'active',
    'line references are not expected',
    'AG 45 remains out of scope',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg44ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 44 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 44',
    'batch-149',
    'batch-150',
    'Actuarial Guideline XLIV',
    '7-page',
    'page-image wording backstop',
    'line references were not available',
    'AG 45 remains out of scope',
    'docs/review/ag44_self_review.md',
    'docs/review/ag43_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg44SelfReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classification',
    '## Recurring Observations',
    '## Batch-by-Batch Checks',
    '## Review Outcome',
    '## Batch-149 Addendum',
    '## Batch-150 Addendum',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-149',
    'batch-150',
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'page-image backstop',
    'line references were not available',
    'AG 45 boundary',
    'wave complete',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg45PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 45',
    'batch-151',
    'Actuarial Guideline XLV',
    'pages 1-3',
    'page-image wording backstop',
    'page locators',
    'active',
    'line references are not expected',
    'AG 46 remains out of scope',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg45ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 45 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 45',
    'batch-151',
    'Actuarial Guideline XLV',
    'pages 1-3',
    'page-image wording backstop',
    'page locators',
    'line references were not available',
    'AG 46 remains out of scope',
    'docs/review/ag45_self_review.md',
    'docs/review/ag44_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg45SelfReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classification',
    '## Recurring Observations',
    '## Batch-by-Batch Checks',
    '## Review Outcome',
    '## Batch-151 Addendum',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-151',
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'page-image backstop',
    'line references were not available',
    'AG 46 boundary',
    'human reviewer should confirm the wording against the page image',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg47PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 47',
    'batch-153',
    'Actuarial Guideline XLVII',
    'pages 1-4',
    'page-image wording backstop',
    'page locators',
    'active',
    'line references are not expected',
    'AG 48 remains out of scope',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg47ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 47 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 47',
    'batch-153',
    'Actuarial Guideline XLVII',
    'pages 1-4',
    'page-image wording backstop',
    'page locators',
    'line references were not available',
    'AG 48 remains out of scope',
    'docs/review/ag47_self_review.md',
    'docs/review/ag46_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg47SelfReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classification',
    '## Recurring Observations',
    '## Batch-by-Batch Checks',
    '## Review Outcome',
    '## Batch-153 Addendum',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-153',
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'page-image backstop',
    'line references were not available',
    'AG 48 boundary',
    'human reviewer should confirm the wording against the page image',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg48PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 48',
    'batch-154',
    'batch-156',
    'Actuarial Guideline XLVIII',
    'pages 1-12',
    'page-image wording backstop',
    'page locators',
    'active',
    'line references are not expected',
    '2021 Law Manual reprint',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg48ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 48 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 48',
    'batch-154',
    'batch-156',
    'Actuarial Guideline XLVIII',
    'pages 1-4',
    'pages 5-8',
    'pages 9-12',
    'page-image wording backstop',
    'page locators',
    'line references were not available',
    '2021 Law Manual reprint',
    'docs/review/ag48_self_review.md',
    'docs/review/ag47_review_index.md',
    'docs/review/ag46_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg48SelfReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classification',
    '## Recurring Observations',
    '## Batch-by-Batch Checks',
    '## Review Outcome',
    '## Batch-154 Addendum',
    '## Batch-155 Addendum',
    '## Batch-156 Addendum',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-154',
    'batch-155',
    'batch-156',
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'page-image backstop',
    'line references were not available',
    'AG 49 boundary',
    'human reviewer should confirm the wording against the page image',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

function validateAg49PlanLike(plan, label) {
  if (!expectObject(plan, label)) return
  if (plan.planId !== 'ag49-life-illustrations-index-based-interest-plan') {
    problems.push(`${label}: planId must be ag49-life-illustrations-index-based-interest-plan`)
  }
  if (plan.planVersion !== '1.0') {
    problems.push(`${label}: planVersion must be 1.0`)
  }
  if (plan.status !== 'planned') {
    problems.push(`${label}: status must be planned`)
  }
  if (!expectObject(plan.sourceScope, `${label}.sourceScope`)) return
  if (plan.sourceScope.sourceFamilyId !== 'actuarial_guidelines') {
    problems.push(`${label}.sourceScope: sourceFamilyId must be actuarial_guidelines`)
  }
  if (
    plan.sourceScope.primarySourceFile !==
    'AG 49 - The Application of the Life Illustrations Model Regulation to Policies With Index-Based Interest.pdf'
  ) {
    problems.push(`${label}.sourceScope: unexpected primarySourceFile`)
  }
  if (!hasString(plan.sourceScope.sourceTitle)) {
    problems.push(`${label}.sourceScope: missing sourceTitle`)
  }
  if (!hasString(plan.sourceScope.sourceReference)) {
    problems.push(`${label}.sourceScope: missing sourceReference`)
  }
  if (!hasString(plan.sourceScope.domainId)) {
    problems.push(`${label}.sourceScope: missing domainId`)
  }
  if (!hasString(plan.sourceScope.rawSourceRoot)) {
    problems.push(`${label}.sourceScope: missing rawSourceRoot`)
  }
  if (!expectArray(plan.sourceScope.confirmedPageRange, `${label}.sourceScope.confirmedPageRange`, false)) return
  if (plan.sourceScope.confirmedPageRange.length !== 2) {
    problems.push(`${label}.sourceScope.confirmedPageRange must contain exactly two page bounds`)
  }
  if (plan.sourceScope.confirmedPageRange[0] !== 1 || plan.sourceScope.confirmedPageRange[1] !== 4) {
    problems.push(`${label}.sourceScope.confirmedPageRange must be [1, 4]`)
  }
  if (!expectArray(plan.sourceScope.observedSectionWindows, `${label}.sourceScope.observedSectionWindows`, false)) return
  if (plan.sourceScope.observedSectionWindows.length !== 3) {
    problems.push(`${label}.sourceScope.observedSectionWindows must contain exactly three windows`)
  }
  if (!expectArray(plan.sourceScope.boundaries, `${label}.sourceScope.boundaries`, false)) return
  if (!expectArray(plan.sourceScope.exclusions, `${label}.sourceScope.exclusions`, false)) return
  if (
    !plan.sourceScope.boundaries.some(
      (entry) => typeof entry === 'string' && entry.includes('AG 49') && entry.includes('out of scope'),
    )
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention AG 49 out-of-scope handling`)
  }
  if (
    !plan.sourceScope.boundaries.some(
      (entry) => typeof entry === 'string' && entry.includes('page-image wording backstop'),
    )
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention the page-image wording backstop`)
  }
  if (
    !plan.sourceScope.boundaries.some(
      (entry) => typeof entry === 'string' && entry.includes('page locators'),
    )
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention page locator handling`)
  }
  if (
    !plan.sourceScope.exclusions.some(
      (entry) => typeof entry === 'string' && entry.includes('AG 50 remains out of scope'),
    )
  ) {
    problems.push(`${label}.sourceScope.exclusions: must mention the AG 50 out-of-scope exclusion`)
  }
  if (!expectArray(plan.topicMap, `${label}.topicMap`, false)) return
  if (plan.topicMap.length !== 3) {
    problems.push(`${label}.topicMap must contain exactly three topics`)
  }
  if (!expectArray(plan.proposedBatches, `${label}.proposedBatches`, false)) return
  if (plan.proposedBatches.length !== 3) {
    problems.push(`${label}.proposedBatches must contain exactly three proposed batches`)
  }
  if (!expectObject(plan.reviewStandards, `${label}.reviewStandards`)) return
  if (!expectObject(plan.promotionGates, `${label}.promotionGates`)) return
  if (!expectObject(plan.validationImplications, `${label}.validationImplications`)) return
}

async function validateAg49PlanMarkdown(filePath, label) {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 49',
    'batch-157',
    'batch-159',
    'Actuarial Guideline XLIX',
    'pages 1-4',
    'page-image wording backstop',
    'page locators',
    'active',
    'line references are not expected',
    'AG 50',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

async function validateAg49ReviewIndexMarkdown(filePath, label) {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 49 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 49',
    'batch-157',
    'batch-159',
    'Actuarial Guideline XLIX',
    'pages 1',
    'pages 2-3',
    'pages 4',
    'page-image wording backstop',
    'page locators',
    'line references were not available',
    'AG 50',
    'docs/review/ag49_self_review.md',
    'docs/review/ag48_review_index.md',
    'docs/review/ag47_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

async function validateAg49SelfReviewMarkdown(filePath, label) {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classification',
    '## Recurring Observations',
    '## Batch-by-Batch Checks',
    '## Review Outcome',
    '## Batch-157 Addendum',
    '## Batch-158 Addendum',
    '## Batch-159 Addendum',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-157',
    'batch-158',
    'batch-159',
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'page-image backstop',
    'line references were not available',
    'AG 50 boundary',
    'human reviewer should confirm the wording against the page image',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

function validateAg50PlanLike(plan, label) {
  if (!expectObject(plan, label)) return
  if (plan.planId !== 'ag50-company-experience-idi-claim-reserve-plan') {
    problems.push(`${label}: planId must be ag50-company-experience-idi-claim-reserve-plan`)
  }
  if (plan.planVersion !== '1.0') {
    problems.push(`${label}: planVersion must be 1.0`)
  }
  if (plan.status !== 'planned') {
    problems.push(`${label}: status must be planned`)
  }
  if (!expectObject(plan.sourceScope, `${label}.sourceScope`)) return
  if (plan.sourceScope.sourceFamilyId !== 'actuarial_guidelines') {
    problems.push(`${label}.sourceScope: sourceFamilyId must be actuarial_guidelines`)
  }
  if (
    plan.sourceScope.primarySourceFile !==
    'AG 50 - The Application of Company Experience in the Calculation of Claim Reserves Under the 2013 Individual Disability Income Valuation Table.pdf'
  ) {
    problems.push(`${label}.sourceScope: unexpected primarySourceFile`)
  }
  if (!hasString(plan.sourceScope.sourceTitle)) {
    problems.push(`${label}.sourceScope: missing sourceTitle`)
  }
  if (!hasString(plan.sourceScope.sourceReference)) {
    problems.push(`${label}.sourceScope: missing sourceReference`)
  }
  if (!hasString(plan.sourceScope.domainId)) {
    problems.push(`${label}.sourceScope: missing domainId`)
  }
  if (!hasString(plan.sourceScope.rawSourceRoot)) {
    problems.push(`${label}.sourceScope: missing rawSourceRoot`)
  }
  if (!expectArray(plan.sourceScope.confirmedPageRange, `${label}.sourceScope.confirmedPageRange`, false)) return
  if (plan.sourceScope.confirmedPageRange.length !== 2) {
    problems.push(`${label}.sourceScope.confirmedPageRange must contain exactly two page bounds`)
  }
  if (plan.sourceScope.confirmedPageRange[0] !== 1 || plan.sourceScope.confirmedPageRange[1] !== 4) {
    problems.push(`${label}.sourceScope.confirmedPageRange must be [1, 4]`)
  }
  if (!expectArray(plan.sourceScope.observedSectionWindows, `${label}.sourceScope.observedSectionWindows`, false)) return
  if (plan.sourceScope.observedSectionWindows.length !== 3) {
    problems.push(`${label}.sourceScope.observedSectionWindows must contain exactly three windows`)
  }
  if (!expectArray(plan.sourceScope.boundaries, `${label}.sourceScope.boundaries`, false)) return
  if (!expectArray(plan.sourceScope.exclusions, `${label}.sourceScope.exclusions`, false)) return
  if (
    !plan.sourceScope.boundaries.some(
      (entry) => typeof entry === 'string' && entry.includes('AG 50') && entry.includes('out of scope'),
    )
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention AG 50 out-of-scope handling`)
  }
  if (
    !plan.sourceScope.boundaries.some(
      (entry) => typeof entry === 'string' && entry.includes('page-image wording backstop'),
    )
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention the page-image wording backstop`)
  }
  if (
    !plan.sourceScope.boundaries.some(
      (entry) => typeof entry === 'string' && entry.includes('page locators'),
    )
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention page locator handling`)
  }
  if (
    !plan.sourceScope.exclusions.some(
      (entry) => typeof entry === 'string' && entry.includes('later guideline files'),
    )
  ) {
    problems.push(`${label}.sourceScope.exclusions: must mention later guideline files out of scope`)
  }
  if (!expectArray(plan.topicMap, `${label}.topicMap`, false)) return
  if (plan.topicMap.length !== 3) {
    problems.push(`${label}.topicMap must contain exactly three topics`)
  }
  if (!expectArray(plan.proposedBatches, `${label}.proposedBatches`, false)) return
  if (plan.proposedBatches.length !== 3) {
    problems.push(`${label}.proposedBatches must contain exactly three proposed batches`)
  }
  if (!expectObject(plan.reviewStandards, `${label}.reviewStandards`)) return
  if (!expectObject(plan.promotionGates, `${label}.promotionGates`)) return
  if (!expectObject(plan.validationImplications, `${label}.validationImplications`)) return
}

async function validateAg50PlanMarkdown(filePath, label) {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 50',
    'batch-160',
    'batch-162',
    'Actuarial Guideline L',
    'pages 1-4',
    'page-image wording backstop',
    'page locators',
    'active',
    'line references are not expected',
    'later guideline files',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

async function validateAg50ReviewIndexMarkdown(filePath, label) {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 50 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 50',
    'batch-160',
    'batch-162',
    'Actuarial Guideline L',
    'pages 1',
    'pages 2-3',
    'pages 4',
    'page-image wording backstop',
    'page locators',
    'line references were not available',
    'AG 51 boundary',
    'docs/review/ag50_self_review.md',
    'docs/review/ag49_review_index.md',
    'docs/review/ag48_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

async function validateAg50SelfReviewMarkdown(filePath, label) {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classification',
    '## Recurring Observations',
    '## Batch-by-Batch Checks',
    '## Review Outcome',
    '## Batch-160 Addendum',
    '## Batch-161 Addendum',
    '## Batch-162 Addendum',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-160',
    'batch-161',
    'batch-162',
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'page-image backstop',
    'line references were not available',
    'AG 51 boundary',
    'human reviewer should confirm the wording against the page image',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

async function validateAg51PlanMarkdown(filePath, label) {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 51',
    'batch-163',
    'batch-164',
    'Actuarial Guideline LI',
    'pages 1-5',
    'page locators',
    'active',
    'line references are not expected',
    'VM-30',
    'AG 52',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

async function validateAg51ReviewIndexMarkdown(filePath, label) {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 51 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 51',
    'batch-163',
    'batch-164',
    'Actuarial Guideline LI',
    'pages 1-3',
    'pages 4-5',
    'page locators',
    'line references are not expected',
    'future VM-30 incorporation note',
    'AG 52 remains out of scope',
    'docs/review/ag51_self_review.md',
    'docs/review/ag50_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

async function validateAg51SelfReviewMarkdown(filePath, label) {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classification',
    '## Recurring Observations',
    '## Batch-by-Batch Checks',
    '## Review Outcome',
    '## Batch-163 Addendum',
    '## Batch-164 Addendum',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-163',
    'batch-164',
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'page locators',
    'line references were not available',
    'future VM-30 incorporation note',
    'AG 52 boundary',
    'human reviewer should confirm the wording against the page image',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

async function validateAg52ReviewIndexMarkdown(filePath, label) {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 52 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 52',
    'batch-001',
    'Actuarial Guidelines',
    'lines 1-15',
    'line locators',
    'line references are the primary anchor',
    'no longer applicable as of 2020',
    'mixed pilot batch',
    'docs/review/ag52_self_review.md',
    'docs/review/ag51_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

async function validateAg52SelfReviewMarkdown(filePath, label) {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classification',
    '## Recurring Observations',
    '## Batch-001 Addendum',
    '## Review Outcome',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-001',
    'AG 52',
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'line locators',
    'no longer applicable as of 2020',
    'mixed pilot batch-001',
    'A human reviewer may confirm the wording against the original text',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

async function validateAg53PlanMarkdown(filePath, label) {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 53',
    'batch-165',
    'batch-166',
    'batch-167',
    'Actuarial Guideline AAT',
    'pages 1-7',
    'page locators',
    'line references are not expected',
    'active',
    'VM-30',
    'AG 54',
    'AG 55',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

async function validateAg53ReviewIndexMarkdown(filePath, label) {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 53 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 53',
    'batch-165',
    'batch-166',
    'batch-167',
    'Actuarial Guideline AAT',
    'pages 1-2',
    'pages 3-5',
    'pages 6-7',
    'page locators',
    'line references are not expected',
    'docs/review/ag53_self_review.md',
    'docs/review/ag51_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
    'AG 54',
    'AG 55',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

async function validateAg53SelfReviewMarkdown(filePath, label) {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classification',
    '## Recurring Observations',
    '## Batch-by-Batch Checks',
    '## Review Outcome',
    '## Batch-165 Addendum',
    '## Batch-166 Addendum',
    '## Batch-167 Addendum',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-165',
    'batch-166',
    'batch-167',
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'page locators',
    'line references were not available',
    'page-image wording backstop',
    'AG 54 boundary',
    'AG 55 boundary',
    'human reviewer should confirm the wording against the page image',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

async function validateAg54PlanMarkdown(filePath, label) {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 54',
    'batch-168',
    'batch-169',
    'batch-170',
    'Actuarial Guideline LIV',
    'paragraphs 1-56',
    'paragraph locators',
    'line references',
    'active',
    'Model 805',
    'Model 250',
    'AG 53',
    'AG 55',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

async function validateAg54ReviewIndexMarkdown(filePath, label) {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 54 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 54',
    'batch-168',
    'batch-169',
    'batch-170',
    'Actuarial Guideline LIV',
    'paragraphs 1-18',
    'paragraphs 19-40',
    'paragraphs 41-56',
    'paragraph locators',
    'line references',
    'docs/review/ag54_self_review.md',
    'docs/review/ag53_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
    'AG 55',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

async function validateAg54SelfReviewMarkdown(filePath, label) {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classification',
    '## Recurring Observations',
    '## Batch-by-Batch Checks',
    '## Review Outcome',
    '## Batch-168 Addendum',
    '## Batch-169 Addendum',
    '## Batch-170 Addendum',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-168',
    'batch-169',
    'batch-170',
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'paragraph locators',
    'line references were preserved',
    'AG 53 boundary',
    'AG 55 boundary',
    'human reviewer should confirm the wording against the source text',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

async function validateAg55PlanMarkdown(filePath, label) {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 55',
    'batch-171',
    'batch-172',
    'batch-173',
    'batch-174',
    'batch-175',
    'batch-176',
    'batch-177',
    'batch-178',
    'batch-179',
    'Actuarial Guideline LV',
    'paragraphs 1-18',
    'paragraphs 19-38',
    'paragraphs 39-75',
    'paragraphs 76-114',
    'paragraphs 115-161',
    'paragraphs 162-188',
    'paragraphs 190-224',
    'paragraphs 225-255',
    'paragraphs 258-268',
    'paragraph locators',
    'line references',
    'active',
    'pending committee adoption',
    'AG 54',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

async function validateAg55ReviewIndexMarkdown(filePath, label) {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 55 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 55',
    'batch-171',
    'batch-172',
    'batch-173',
    'batch-174',
    'batch-175',
    'batch-176',
    'batch-177',
    'batch-178',
    'batch-179',
    'Actuarial Guideline LV',
    'paragraphs 1-18',
    'paragraphs 19-38',
    'paragraphs 39-75',
    'paragraphs 76-114',
    'paragraphs 115-161',
    'paragraphs 162-188',
    'paragraphs 190-224',
    'paragraphs 225-255',
    'paragraphs 258-268',
    'paragraph locators',
    'line references',
    'docs/review/ag55_self_review.md',
    'docs/review/ag54_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
    'pending committee adoption',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

async function validateAg55SelfReviewMarkdown(filePath, label) {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classification',
    '## Recurring Observations',
    '## Batch-by-Batch Checks',
    '## Review Outcome',
    '## Batch-171 Addendum',
    '## Batch-172 Addendum',
    '## Batch-173 Addendum',
    '## Batch-174 Addendum',
    '## Batch-175 Addendum',
    '## Batch-176 Addendum',
    '## Batch-177 Addendum',
    '## Batch-178 Addendum',
    '## Batch-179 Addendum',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-171',
    'batch-172',
    'batch-173',
    'batch-174',
    'batch-175',
    'batch-176',
    'batch-177',
    'batch-178',
    'batch-179',
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'paragraph locators',
    'line references',
    'AG 54',
    'AG 55',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg46PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 46',
    'batch-152',
    'Actuarial Guideline XLVI',
    'pages 1-2',
    'page-image wording backstop',
    'page locators',
    'active',
    'line references are not expected',
    'AG 47 remains out of scope',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg46ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 46 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 46',
    'batch-152',
    'Actuarial Guideline XLVI',
    'pages 1-2',
    'page-image wording backstop',
    'page locators',
    'line references were not available',
    'AG 47 remains out of scope',
    'docs/review/ag46_self_review.md',
    'docs/review/ag45_review_index.md',
    'docs/review/valuation_regulation_repository_poc_status.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg46SelfReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classification',
    '## Recurring Observations',
    '## Batch-by-Batch Checks',
    '## Review Outcome',
    '## Batch-152 Addendum',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-152',
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'page-image backstop',
    'line references were not available',
    'AG 47 boundary',
    'human reviewer should confirm the wording against the page image',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validatePocStatusSummaryMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const ag34ReviewArtifactsPresent =
    (await exists(paths.ag34ReviewIndexMd)) && (await exists(paths.ag34SelfReviewMd))
  const ag40ReviewArtifactsPresent =
    (await exists(paths.ag40ReviewIndexMd)) && (await exists(paths.ag40SelfReviewMd))
  const ag43ReviewArtifactsPresent =
    (await exists(paths.ag43ReviewIndexMd)) && (await exists(paths.ag43SelfReviewMd))
  const ag44ReviewArtifactsPresent =
    (await exists(paths.ag44ReviewIndexMd)) && (await exists(paths.ag44SelfReviewMd))
  const ag45ReviewArtifactsPresent =
    (await exists(paths.ag45ReviewIndexMd)) && (await exists(paths.ag45SelfReviewMd))
  const ag46ReviewArtifactsPresent =
    (await exists(paths.ag46ReviewIndexMd)) && (await exists(paths.ag46SelfReviewMd))
  const reg213Amendment1TextReviewArtifactsPresent =
    (await exists(paths.reg213Amendment1TextReviewIndexMd)) &&
    (await exists(paths.reg213Amendment1TextSelfReviewMd))
  const reg213Amendment2ReviewArtifactsPresent =
    (await exists(paths.reg213Amendment2ReviewIndexMd)) && (await exists(paths.reg213Amendment2SelfReviewMd))
  const reg213Amendment4ReviewArtifactsPresent =
    (await exists(paths.reg213Amendment4ReviewIndexMd)) && (await exists(paths.reg213Amendment4SelfReviewMd))
  const requiredHeadings = [
    '## Executive Status',
    '## Coverage Table',
    '## Completed Assets',
    '## Validation Posture',
    '## Human Review Posture',
    '## Promotion Gates',
    '## Remaining Work',
    '## Recommended Next Step',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'VM-20',
    'VM-01',
    'VM-02',
    'VM-25',
    'VM-26',
    'VM-30',
    'VM-31',
    'VM-21',
    'VM-22',
    'docs/review/vm20_review_index.md',
    'docs/review/supporting_vm_review_index.md',
    'docs/review/vm21_review_index.md',
    'docs/review/vm22_review_index.md',
    'docs/review/vm20_practice_note_review_index.md',
    ...(reg213Amendment1TextReviewArtifactsPresent
      ? [
          'docs/review/reg213_amendment1_text_review_index.md',
          'docs/review/reg213_amendment1_text_self_review.md',
          'Regulation 213 First Amendment',
          'batch-260',
          'batch-261',
          'batch-262',
          'batch-263',
          'batch-264',
          'batch-265',
        ]
      : []),
    ...(reg213Amendment2ReviewArtifactsPresent
      ? [
          'docs/review/reg213_amendment2_review_index.md',
          'docs/review/reg213_amendment2_self_review.md',
          'Regulation 213 Second Amendment',
          'batch-257',
          'batch-258',
          'batch-259',
        ]
      : []),
    ...(reg213Amendment4ReviewArtifactsPresent
      ? [
          'docs/review/reg213_amendment4_review_index.md',
          'docs/review/reg213_amendment4_self_review.md',
          'Regulation 213 Fourth Amendment',
          'batch-255',
          'batch-256',
        ]
      : []),
    'docs/review/ag03_review_index.md',
    'docs/review/ag03_self_review.md',
    'docs/review/ag01_review_index.md',
    'docs/review/ag01_self_review.md',
    'docs/review/ag02_review_index.md',
    'docs/review/ag02_self_review.md',
    'docs/review/ag04_review_index.md',
    'docs/review/ag04_self_review.md',
    'docs/review/ag05_review_index.md',
    'docs/review/ag05_self_review.md',
    'docs/review/ag06_review_index.md',
    'docs/review/ag06_self_review.md',
    'docs/review/ag07_review_index.md',
    'docs/review/ag07_self_review.md',
    'docs/review/ag08_review_index.md',
    'docs/review/ag08_self_review.md',
    'docs/review/ag09_review_index.md',
    'docs/review/ag09_self_review.md',
    'docs/review/ag10_review_index.md',
    'docs/review/ag10_self_review.md',
    'docs/review/ag11_review_index.md',
    'docs/review/ag11_self_review.md',
    'docs/review/ag12_review_index.md',
    'docs/review/ag12_self_review.md',
    'docs/review/ag13_review_index.md',
    'docs/review/ag13_self_review.md',
    'docs/review/ag14_review_index.md',
    'docs/review/ag14_self_review.md',
    'docs/review/ag15_review_index.md',
    'docs/review/ag15_self_review.md',
    'docs/review/ag16_review_index.md',
    'docs/review/ag16_self_review.md',
    'docs/review/ag17_review_index.md',
    'docs/review/ag17_self_review.md',
    'docs/review/ag18_review_index.md',
    'docs/review/ag18_self_review.md',
    'docs/review/ag19_review_index.md',
    'docs/review/ag19_self_review.md',
    'docs/review/ag20_review_index.md',
    'docs/review/ag20_self_review.md',
    'docs/review/ag21_review_index.md',
    'docs/review/ag21_self_review.md',
    'docs/review/ag22_review_index.md',
    'docs/review/ag22_self_review.md',
    'docs/review/ag23_review_index.md',
    'docs/review/ag23_self_review.md',
    'docs/review/ag24_review_index.md',
    'docs/review/ag24_self_review.md',
    'docs/review/ag25_review_index.md',
    'docs/review/ag25_self_review.md',
    'docs/review/ag26_review_index.md',
    'docs/review/ag26_self_review.md',
    'docs/review/ag27_review_index.md',
    'docs/review/ag27_self_review.md',
    'docs/review/ag28_review_index.md',
    'docs/review/ag28_self_review.md',
    'docs/review/ag29_review_index.md',
    'docs/review/ag29_self_review.md',
    'docs/review/ag30_review_index.md',
    'docs/review/ag30_self_review.md',
    'docs/review/ag31_review_index.md',
    'docs/review/ag31_self_review.md',
    'docs/review/ag32_review_index.md',
    'docs/review/ag32_self_review.md',
    'docs/review/ag33_review_index.md',
    'docs/review/ag33_self_review.md',
    ...(ag34ReviewArtifactsPresent
      ? ['docs/review/ag34_review_index.md', 'docs/review/ag34_self_review.md', 'AG 34', 'batch-117', 'batch-118', 'batch-119']
      : []),
    ...(ag40ReviewArtifactsPresent
      ? ['docs/review/ag40_review_index.md', 'docs/review/ag40_self_review.md', 'AG 40', 'batch-135', 'batch-136']
      : []),
    ...(ag43ReviewArtifactsPresent
      ? [
          'docs/review/ag43_review_index.md',
          'docs/review/ag43_self_review.md',
          'AG 43',
          'batch-140',
          'batch-141',
          'batch-142',
          'batch-143',
          'batch-144',
          'batch-145',
          'batch-146',
          'batch-147',
          'batch-148',
        ]
      : []),
    ...(ag44ReviewArtifactsPresent
      ? [
          'docs/review/ag44_review_index.md',
          'docs/review/ag44_self_review.md',
          'AG 44',
          'batch-149',
          'batch-150',
        ]
      : []),
    ...(ag46ReviewArtifactsPresent
      ? [
          'docs/review/ag46_review_index.md',
          'docs/review/ag46_self_review.md',
          'AG 46',
          'batch-152',
        ]
      : []),
    'npm run check',
    'git diff --check',
    ag46ReviewArtifactsPresent
      ? '152 batches validated'
      : ag45ReviewArtifactsPresent
        ? '151 batches validated'
      : ag44ReviewArtifactsPresent
        ? '150 batches validated'
      : ag43ReviewArtifactsPresent
        ? '148 batches validated'
      : '116 batches validated',
    ag46ReviewArtifactsPresent
      ? '51 review indexes'
      : ag45ReviewArtifactsPresent
        ? '50 review indexes'
      : ag44ReviewArtifactsPresent
        ? '49 review indexes'
        : ag43ReviewArtifactsPresent
          ? '48 review indexes'
          : reg213Amendment1TextReviewArtifactsPresent
          ? '84 review indexes'
        : reg213Amendment2ReviewArtifactsPresent
          ? '82 review indexes'
        : reg213Amendment4ReviewArtifactsPresent
          ? '81 review indexes'
        : ag40ReviewArtifactsPresent
          ? '45 review indexes'
          : ag34ReviewArtifactsPresent
            ? '39 review indexes'
            : '38 review indexes',
    'AG 18',
    'batch-096',
    'AG 19',
    'batch-097',
    'AG 20',
    'batch-098',
    'AG 21',
    'batch-099',
    'AG 22',
    'batch-100',
    'AG 23',
    'batch-101',
    'AG 24',
    'batch-102',
    'batch-103',
    'batch-104',
    'AG 25',
    'batch-105',
    'AG 26',
    'batch-106',
    'AG 27',
    'batch-107',
    'batch-108',
    'batch-109',
    'AG 28',
    'batch-110',
    'AG 29',
    'batch-111',
    'AG 30',
    'batch-112',
    'AG 31',
    'batch-113',
    'plan type',
    'C-3 risk',
    'policy form',
    'annual statement',
    'five-page accelerated-benefits guideline',
    'accelerated-benefits',
    'interest-accrual disclosure',
    'lien mechanics',
    'AG 28 closing boundary',
    'operative-date',
    'dynamic interest-rate',
    'three-page indexed increasing death-benefits',
    'threshold amount',
    'low-amount exception',
    'CPI-based annual increase',
    'page-image',
    'ignored working storage',
    'future pricing',
    'future liability-modeling',
    'AG 01',
    'AG 02',
    'AG 04',
    'AG 05',
    'AG 06',
    'AG 07',
    'AG 10',
    'AG 11',
    'AG 12',
    'AG 13',
    'AG 14',
    'AG 15',
    'AG 16',
    'AG 17',
    'historical CARVM',
    'historical surveillance',
    'historical CRVM',
    'historical illustration',
    'CRVM reserve-comparison',
    'indeterminate premiums',
    'maximum gross premiums',
    'gross-premium schedules',
    'separate account investments',
    'readily marketable assets',
    'net investment income',
    'placeholder statutory reference',
    '15%',
    '10%',
    'page-image',
    'Standard Valuation Law',
    '1980 CSO Tables',
    'modified net premiums',
    'full preliminary term method',
    'noisy',
    'joint-life-functions',
    'blank separator',
    'page 3',
    'Actuarial Guideline XX',
    'A5-1',
    'A5-6',
    'A5-7',
    'equivalent equal ages',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const plannedSupportingBatchIds = Array.isArray(supportingVmBatchPlan.proposedBatches)
  ? supportingVmBatchPlan.proposedBatches
      .map((batch) => batch?.plannedBatchId)
      .filter((batchId) => typeof batchId === 'string' && batchId.length > 0)
  : []
for (const plannedBatchId of plannedSupportingBatchIds) {
  if (!batchDefinitions[plannedBatchId]) {
    problems.push(`scripts/batch-definitions.mjs: missing batch definition for ${plannedBatchId}`)
  }
}

const plannedVm21BatchIds = Array.isArray(vm21BatchPlan.proposedBatches)
  ? vm21BatchPlan.proposedBatches
      .map((batch) => batch?.plannedBatchId)
      .filter((batchId) => typeof batchId === 'string' && batchId.length > 0)
  : []
for (const plannedBatchId of plannedVm21BatchIds) {
  if (!batchDefinitions[plannedBatchId]) {
    problems.push(`scripts/batch-definitions.mjs: missing batch definition for ${plannedBatchId}`)
  }
}

const plannedPracticeNoteBatchIds = Array.isArray(practiceNoteBatchPlan.proposedBatches)
  ? practiceNoteBatchPlan.proposedBatches
      .map((batch) => batch?.plannedBatchId)
      .filter((batchId) => typeof batchId === 'string' && batchId.length > 0)
  : []
for (const plannedBatchId of plannedPracticeNoteBatchIds) {
  if (!batchDefinitions[plannedBatchId]) {
    problems.push(`scripts/batch-definitions.mjs: missing batch definition for ${plannedBatchId}`)
  }
}

if (ag03BatchPlan.status !== 'planned') {
  problems.push('config/ag03-batch-plan.json: status must be planned')
}
if (!Array.isArray(ag03BatchPlan.proposedBatches) || ag03BatchPlan.proposedBatches.length !== 1) {
  problems.push('config/ag03-batch-plan.json: expected exactly one proposed batch')
}
if (
  ag03BatchPlan.sourceScope?.confirmedPageRange?.[0] !== 1 ||
  ag03BatchPlan.sourceScope?.confirmedPageRange?.[1] !== 1
) {
  problems.push('config/ag03-batch-plan.json: confirmedPageRange must be [1, 1]')
}

const plannedAg03BatchIds = Array.isArray(ag03BatchPlan.proposedBatches)
  ? ag03BatchPlan.proposedBatches
      .map((batch) => batch?.plannedBatchId)
      .filter((batchId) => typeof batchId === 'string' && batchId.length > 0)
  : []
for (const plannedBatchId of plannedAg03BatchIds) {
  if (!batchDefinitions[plannedBatchId]) {
    problems.push(`scripts/batch-definitions.mjs: missing batch definition for ${plannedBatchId}`)
  }
}
if (!plannedAg03BatchIds.includes('batch-076')) {
  problems.push('config/ag03-batch-plan.json: expected batch-076 to be planned')
}

if (ag04BatchPlan.status !== 'planned') {
  problems.push('config/ag04-batch-plan.json: status must be planned')
}
if (!Array.isArray(ag04BatchPlan.proposedBatches) || ag04BatchPlan.proposedBatches.length !== 1) {
  problems.push('config/ag04-batch-plan.json: expected exactly one proposed batch')
}
if (
  ag04BatchPlan.sourceScope?.confirmedPageRange?.[0] !== 1 ||
  ag04BatchPlan.sourceScope?.confirmedPageRange?.[1] !== 2
) {
  problems.push('config/ag04-batch-plan.json: confirmedPageRange must be [1, 2]')
}

const plannedAg04BatchIds = Array.isArray(ag04BatchPlan.proposedBatches)
  ? ag04BatchPlan.proposedBatches
      .map((batch) => batch?.plannedBatchId)
      .filter((batchId) => typeof batchId === 'string' && batchId.length > 0)
  : []
for (const plannedBatchId of plannedAg04BatchIds) {
  if (!batchDefinitions[plannedBatchId]) {
    problems.push(`scripts/batch-definitions.mjs: missing batch definition for ${plannedBatchId}`)
  }
}
if (!plannedAg04BatchIds.includes('batch-079')) {
  problems.push('config/ag04-batch-plan.json: expected batch-079 to be planned')
}

if (ag05BatchPlan.status !== 'planned') {
  problems.push('config/ag05-batch-plan.json: status must be planned')
}
if (!Array.isArray(ag05BatchPlan.proposedBatches) || ag05BatchPlan.proposedBatches.length !== 1) {
  problems.push('config/ag05-batch-plan.json: expected exactly one proposed batch')
}
if (
  ag05BatchPlan.sourceScope?.confirmedPageRange?.[0] !== 1 ||
  ag05BatchPlan.sourceScope?.confirmedPageRange?.[1] !== 2
) {
  problems.push('config/ag05-batch-plan.json: confirmedPageRange must be [1, 2]')
}

const plannedAg05BatchIds = Array.isArray(ag05BatchPlan.proposedBatches)
  ? ag05BatchPlan.proposedBatches
      .map((batch) => batch?.plannedBatchId)
      .filter((batchId) => typeof batchId === 'string' && batchId.length > 0)
  : []
for (const plannedBatchId of plannedAg05BatchIds) {
  if (!batchDefinitions[plannedBatchId]) {
    problems.push(`scripts/batch-definitions.mjs: missing batch definition for ${plannedBatchId}`)
  }
}
if (!plannedAg05BatchIds.includes('batch-080')) {
  problems.push('config/ag05-batch-plan.json: expected batch-080 to be planned')
}

if (ag06BatchPlan.status !== 'planned') {
  problems.push('config/ag06-batch-plan.json: status must be planned')
}
if (!Array.isArray(ag06BatchPlan.proposedBatches) || ag06BatchPlan.proposedBatches.length !== 1) {
  problems.push('config/ag06-batch-plan.json: expected exactly one proposed batch')
}
if (
  ag06BatchPlan.sourceScope?.confirmedPageRange?.[0] !== 1 ||
  ag06BatchPlan.sourceScope?.confirmedPageRange?.[1] !== 2
) {
  problems.push('config/ag06-batch-plan.json: confirmedPageRange must be [1, 2]')
}

const plannedAg06BatchIds = Array.isArray(ag06BatchPlan.proposedBatches)
  ? ag06BatchPlan.proposedBatches
      .map((batch) => batch?.plannedBatchId)
      .filter((batchId) => typeof batchId === 'string' && batchId.length > 0)
  : []
for (const plannedBatchId of plannedAg06BatchIds) {
  if (!batchDefinitions[plannedBatchId]) {
    problems.push(`scripts/batch-definitions.mjs: missing batch definition for ${plannedBatchId}`)
  }
}
if (!plannedAg06BatchIds.includes('batch-081')) {
  problems.push('config/ag06-batch-plan.json: expected batch-081 to be planned')
}

if (ag07BatchPlan.status !== 'planned') {
  problems.push('config/ag07-batch-plan.json: status must be planned')
}
if (!Array.isArray(ag07BatchPlan.proposedBatches) || ag07BatchPlan.proposedBatches.length !== 1) {
  problems.push('config/ag07-batch-plan.json: expected exactly one proposed batch')
}
if (
  ag07BatchPlan.sourceScope?.confirmedPageRange?.[0] !== 1 ||
  ag07BatchPlan.sourceScope?.confirmedPageRange?.[1] !== 2
) {
  problems.push('config/ag07-batch-plan.json: confirmedPageRange must be [1, 2]')
}

const plannedAg07BatchIds = Array.isArray(ag07BatchPlan.proposedBatches)
  ? ag07BatchPlan.proposedBatches
      .map((batch) => batch?.plannedBatchId)
      .filter((batchId) => typeof batchId === 'string' && batchId.length > 0)
  : []
for (const plannedBatchId of plannedAg07BatchIds) {
  if (!batchDefinitions[plannedBatchId]) {
    problems.push(`scripts/batch-definitions.mjs: missing batch definition for ${plannedBatchId}`)
  }
}
if (!plannedAg07BatchIds.includes('batch-082')) {
  problems.push('config/ag07-batch-plan.json: expected batch-082 to be planned')
}

if (ag09BatchPlan.status !== 'planned') {
  problems.push('config/ag09-batch-plan.json: status must be planned')
}
if (!Array.isArray(ag09BatchPlan.proposedBatches) || ag09BatchPlan.proposedBatches.length !== 4) {
  problems.push('config/ag09-batch-plan.json: expected exactly four proposed batches')
}
if (!Array.isArray(ag09BatchPlan.sourceScope?.sourceFiles) || ag09BatchPlan.sourceScope.sourceFiles.length !== 4) {
  problems.push('config/ag09-batch-plan.json: expected exactly four source files')
}
const ag09ExpectedPageRanges = [
  [1, 1],
  [1, 2],
  [1, 4],
  [1, 3],
]
ag09ExpectedPageRanges.forEach((expectedRange, index) => {
  const actualRange = ag09BatchPlan.sourceScope?.sourceFiles?.[index]?.pageRange
  if (actualRange?.[0] !== expectedRange[0] || actualRange?.[1] !== expectedRange[1]) {
    problems.push(
      `config/ag09-batch-plan.json: source file ${index + 1} pageRange must be [${expectedRange[0]}, ${expectedRange[1]}]`,
    )
  }
})
const plannedAg09BatchIds = Array.isArray(ag09BatchPlan.proposedBatches)
  ? ag09BatchPlan.proposedBatches
      .map((batch) => batch?.plannedBatchId)
      .filter((batchId) => typeof batchId === 'string' && batchId.length > 0)
  : []
for (const plannedBatchId of plannedAg09BatchIds) {
  if (!batchDefinitions[plannedBatchId]) {
    problems.push(`scripts/batch-definitions.mjs: missing batch definition for ${plannedBatchId}`)
  }
}
;['batch-084', 'batch-085', 'batch-086', 'batch-087'].forEach((batchId) => {
  if (!plannedAg09BatchIds.includes(batchId)) {
    problems.push(`config/ag09-batch-plan.json: expected ${batchId} to be planned`)
  }
})

if (ag10BatchPlan.status !== 'planned') {
  problems.push('config/ag10-batch-plan.json: status must be planned')
}
if (!Array.isArray(ag10BatchPlan.proposedBatches) || ag10BatchPlan.proposedBatches.length !== 1) {
  problems.push('config/ag10-batch-plan.json: expected exactly one proposed batch')
}
if (
  ag10BatchPlan.sourceScope?.confirmedPageRange?.[0] !== 1 ||
  ag10BatchPlan.sourceScope?.confirmedPageRange?.[1] !== 1
) {
  problems.push('config/ag10-batch-plan.json: confirmedPageRange must be [1, 1]')
}
const plannedAg10BatchIds = Array.isArray(ag10BatchPlan.proposedBatches)
  ? ag10BatchPlan.proposedBatches
      .map((batch) => batch?.plannedBatchId)
      .filter((batchId) => typeof batchId === 'string' && batchId.length > 0)
  : []
for (const plannedBatchId of plannedAg10BatchIds) {
  if (!batchDefinitions[plannedBatchId]) {
    problems.push(`scripts/batch-definitions.mjs: missing batch definition for ${plannedBatchId}`)
  }
}
if (!plannedAg10BatchIds.includes('batch-088')) {
  problems.push('config/ag10-batch-plan.json: expected batch-088 to be planned')
}

if (ag11BatchPlan.status !== 'planned') {
  problems.push('config/ag11-batch-plan.json: status must be planned')
}
if (!Array.isArray(ag11BatchPlan.proposedBatches) || ag11BatchPlan.proposedBatches.length !== 1) {
  problems.push('config/ag11-batch-plan.json: expected exactly one proposed batch')
}
if (
  ag11BatchPlan.sourceScope?.confirmedPageRange?.[0] !== 1 ||
  ag11BatchPlan.sourceScope?.confirmedPageRange?.[1] !== 1
) {
  problems.push('config/ag11-batch-plan.json: confirmedPageRange must be [1, 1]')
}
const plannedAg11BatchIds = Array.isArray(ag11BatchPlan.proposedBatches)
  ? ag11BatchPlan.proposedBatches
      .map((batch) => batch?.plannedBatchId)
      .filter((batchId) => typeof batchId === 'string' && batchId.length > 0)
  : []
for (const plannedBatchId of plannedAg11BatchIds) {
  if (!batchDefinitions[plannedBatchId]) {
    problems.push(`scripts/batch-definitions.mjs: missing batch definition for ${plannedBatchId}`)
  }
}
if (!plannedAg11BatchIds.includes('batch-089')) {
  problems.push('config/ag11-batch-plan.json: expected batch-089 to be planned')
}

if (ag12BatchPlan.status !== 'planned') {
  problems.push('config/ag12-batch-plan.json: status must be planned')
}
if (!Array.isArray(ag12BatchPlan.proposedBatches) || ag12BatchPlan.proposedBatches.length !== 1) {
  problems.push('config/ag12-batch-plan.json: expected exactly one proposed batch')
}
if (
  ag12BatchPlan.sourceScope?.confirmedPageRange?.[0] !== 1 ||
  ag12BatchPlan.sourceScope?.confirmedPageRange?.[1] !== 1
) {
  problems.push('config/ag12-batch-plan.json: confirmedPageRange must be [1, 1]')
}
if (ag12BatchPlan.sourceScope?.sourceStatus !== 'withdrawn') {
  problems.push('config/ag12-batch-plan.json: sourceStatus must be withdrawn')
}
const plannedAg12BatchIds = Array.isArray(ag12BatchPlan.proposedBatches)
  ? ag12BatchPlan.proposedBatches
      .map((batch) => batch?.plannedBatchId)
      .filter((batchId) => typeof batchId === 'string' && batchId.length > 0)
  : []
for (const plannedBatchId of plannedAg12BatchIds) {
  if (!batchDefinitions[plannedBatchId]) {
    problems.push(`scripts/batch-definitions.mjs: missing batch definition for ${plannedBatchId}`)
  }
}
if (!plannedAg12BatchIds.includes('batch-090')) {
  problems.push('config/ag12-batch-plan.json: expected batch-090 to be planned')
}

if (ag13BatchPlan.status !== 'planned') {
  problems.push('config/ag13-batch-plan.json: status must be planned')
}
if (!Array.isArray(ag13BatchPlan.proposedBatches) || ag13BatchPlan.proposedBatches.length !== 1) {
  problems.push('config/ag13-batch-plan.json: expected exactly one proposed batch')
}
if (
  ag13BatchPlan.sourceScope?.confirmedPageRange?.[0] !== 1 ||
  ag13BatchPlan.sourceScope?.confirmedPageRange?.[1] !== 2
) {
  problems.push('config/ag13-batch-plan.json: confirmedPageRange must be [1, 2]')
}
if (ag13BatchPlan.sourceScope?.sourceStatus !== 'historical') {
  problems.push('config/ag13-batch-plan.json: sourceStatus must be historical')
}
const plannedAg13BatchIds = Array.isArray(ag13BatchPlan.proposedBatches)
  ? ag13BatchPlan.proposedBatches
      .map((batch) => batch?.plannedBatchId)
      .filter((batchId) => typeof batchId === 'string' && batchId.length > 0)
  : []
for (const plannedBatchId of plannedAg13BatchIds) {
  if (!batchDefinitions[plannedBatchId]) {
    problems.push(`scripts/batch-definitions.mjs: missing batch definition for ${plannedBatchId}`)
  }
}
if (!plannedAg13BatchIds.includes('batch-091')) {
  problems.push('config/ag13-batch-plan.json: expected batch-091 to be planned')
}

if (ag16BatchPlan.status !== 'planned') {
  problems.push('config/ag16-batch-plan.json: status must be planned')
}
if (!Array.isArray(ag16BatchPlan.proposedBatches) || ag16BatchPlan.proposedBatches.length !== 1) {
  problems.push('config/ag16-batch-plan.json: expected exactly one proposed batch')
}
if (
  ag16BatchPlan.sourceScope?.confirmedPageRange?.[0] !== 1 ||
  ag16BatchPlan.sourceScope?.confirmedPageRange?.[1] !== 1
) {
  problems.push('config/ag16-batch-plan.json: confirmedPageRange must be [1, 1]')
}
if (ag16BatchPlan.sourceScope?.sourceStatus !== 'historical') {
  problems.push('config/ag16-batch-plan.json: sourceStatus must be historical')
}
const plannedAg16BatchIds = Array.isArray(ag16BatchPlan.proposedBatches)
  ? ag16BatchPlan.proposedBatches
      .map((batch) => batch?.plannedBatchId)
      .filter((batchId) => typeof batchId === 'string' && batchId.length > 0)
  : []
for (const plannedBatchId of plannedAg16BatchIds) {
  if (!batchDefinitions[plannedBatchId]) {
    problems.push(`scripts/batch-definitions.mjs: missing batch definition for ${plannedBatchId}`)
  }
}
if (!plannedAg16BatchIds.includes('batch-094')) {
  problems.push('config/ag16-batch-plan.json: expected batch-094 to be planned')
}

if (ag17BatchPlan.status !== 'planned') {
  problems.push('config/ag17-batch-plan.json: status must be planned')
}
if (!Array.isArray(ag17BatchPlan.proposedBatches) || ag17BatchPlan.proposedBatches.length !== 1) {
  problems.push('config/ag17-batch-plan.json: expected exactly one proposed batch')
}
if (
  ag17BatchPlan.sourceScope?.confirmedPageRange?.[0] !== 1 ||
  ag17BatchPlan.sourceScope?.confirmedPageRange?.[1] !== 1
) {
  problems.push('config/ag17-batch-plan.json: confirmedPageRange must be [1, 1]')
}
if (ag17BatchPlan.sourceScope?.sourceStatus !== 'historical') {
  problems.push('config/ag17-batch-plan.json: sourceStatus must be historical')
}
const plannedAg17BatchIds = Array.isArray(ag17BatchPlan.proposedBatches)
  ? ag17BatchPlan.proposedBatches
      .map((batch) => batch?.plannedBatchId)
      .filter((batchId) => typeof batchId === 'string' && batchId.length > 0)
  : []
for (const plannedBatchId of plannedAg17BatchIds) {
  if (!batchDefinitions[plannedBatchId]) {
    problems.push(`scripts/batch-definitions.mjs: missing batch definition for ${plannedBatchId}`)
  }
}
if (!plannedAg17BatchIds.includes('batch-095')) {
  problems.push('config/ag17-batch-plan.json: expected batch-095 to be planned')
}

if (ag18BatchPlan.status !== 'planned') {
  problems.push('config/ag18-batch-plan.json: status must be planned')
}
if (!Array.isArray(ag18BatchPlan.proposedBatches) || ag18BatchPlan.proposedBatches.length !== 1) {
  problems.push('config/ag18-batch-plan.json: expected exactly one proposed batch')
}
if (
  ag18BatchPlan.sourceScope?.confirmedPageRange?.[0] !== 1 ||
  ag18BatchPlan.sourceScope?.confirmedPageRange?.[1] !== 1
) {
  problems.push('config/ag18-batch-plan.json: confirmedPageRange must be [1, 1]')
}
if (ag18BatchPlan.sourceScope?.sourceStatus !== 'active') {
  problems.push('config/ag18-batch-plan.json: sourceStatus must be active')
}
const plannedAg18BatchIds = Array.isArray(ag18BatchPlan.proposedBatches)
  ? ag18BatchPlan.proposedBatches
      .map((batch) => batch?.plannedBatchId)
      .filter((batchId) => typeof batchId === 'string' && batchId.length > 0)
  : []
for (const plannedBatchId of plannedAg18BatchIds) {
  if (!batchDefinitions[plannedBatchId]) {
    problems.push(`scripts/batch-definitions.mjs: missing batch definition for ${plannedBatchId}`)
  }
}
if (!plannedAg18BatchIds.includes('batch-096')) {
  problems.push('config/ag18-batch-plan.json: expected batch-096 to be planned')
}

if (ag19BatchPlan.status !== 'planned') {
  problems.push('config/ag19-batch-plan.json: status must be planned')
}
if (!Array.isArray(ag19BatchPlan.proposedBatches) || ag19BatchPlan.proposedBatches.length !== 1) {
  problems.push('config/ag19-batch-plan.json: expected exactly one proposed batch')
}
if (
  ag19BatchPlan.sourceScope?.confirmedPageRange?.[0] !== 1 ||
  ag19BatchPlan.sourceScope?.confirmedPageRange?.[1] !== 1
) {
  problems.push('config/ag19-batch-plan.json: confirmedPageRange must be [1, 1]')
}
if (ag19BatchPlan.sourceScope?.sourceStatus !== 'active') {
  problems.push('config/ag19-batch-plan.json: sourceStatus must be active')
}
const plannedAg19BatchIds = Array.isArray(ag19BatchPlan.proposedBatches)
  ? ag19BatchPlan.proposedBatches
      .map((batch) => batch?.plannedBatchId)
      .filter((batchId) => typeof batchId === 'string' && batchId.length > 0)
  : []
for (const plannedBatchId of plannedAg19BatchIds) {
  if (!batchDefinitions[plannedBatchId]) {
    problems.push(`scripts/batch-definitions.mjs: missing batch definition for ${plannedBatchId}`)
  }
}
if (!plannedAg19BatchIds.includes('batch-097')) {
  problems.push('config/ag19-batch-plan.json: expected batch-097 to be planned')
}

if (ag20BatchPlan.status !== 'planned') {
  problems.push('config/ag20-batch-plan.json: status must be planned')
}
if (!Array.isArray(ag20BatchPlan.proposedBatches) || ag20BatchPlan.proposedBatches.length !== 1) {
  problems.push('config/ag20-batch-plan.json: expected exactly one proposed batch')
}
if (
  ag20BatchPlan.sourceScope?.confirmedPageRange?.[0] !== 1 ||
  ag20BatchPlan.sourceScope?.confirmedPageRange?.[1] !== 7
) {
  problems.push('config/ag20-batch-plan.json: confirmedPageRange must be [1, 7]')
}
if (ag20BatchPlan.sourceScope?.sourceStatus !== 'active') {
  problems.push('config/ag20-batch-plan.json: sourceStatus must be active')
}
const plannedAg20BatchIds = Array.isArray(ag20BatchPlan.proposedBatches)
  ? ag20BatchPlan.proposedBatches
      .map((batch) => batch?.plannedBatchId)
      .filter((batchId) => typeof batchId === 'string' && batchId.length > 0)
  : []
for (const plannedBatchId of plannedAg20BatchIds) {
  if (!batchDefinitions[plannedBatchId]) {
    problems.push(`scripts/batch-definitions.mjs: missing batch definition for ${plannedBatchId}`)
  }
}
if (!plannedAg20BatchIds.includes('batch-098')) {
  problems.push('config/ag20-batch-plan.json: expected batch-098 to be planned')
}

if (ag21BatchPlan.status !== 'planned') {
  problems.push('config/ag21-batch-plan.json: status must be planned')
}
if (!Array.isArray(ag21BatchPlan.proposedBatches) || ag21BatchPlan.proposedBatches.length !== 1) {
  problems.push('config/ag21-batch-plan.json: expected exactly one proposed batch')
}
if (
  ag21BatchPlan.sourceScope?.confirmedPageRange?.[0] !== 1 ||
  ag21BatchPlan.sourceScope?.confirmedPageRange?.[1] !== 1
) {
  problems.push('config/ag21-batch-plan.json: confirmedPageRange must be [1, 1]')
}
if (ag21BatchPlan.sourceScope?.sourceStatus !== 'active') {
  problems.push('config/ag21-batch-plan.json: sourceStatus must be active')
}
const plannedAg21BatchIds = Array.isArray(ag21BatchPlan.proposedBatches)
  ? ag21BatchPlan.proposedBatches
      .map((batch) => batch?.plannedBatchId)
      .filter((batchId) => typeof batchId === 'string' && batchId.length > 0)
  : []
for (const plannedBatchId of plannedAg21BatchIds) {
  if (!batchDefinitions[plannedBatchId]) {
    problems.push(`scripts/batch-definitions.mjs: missing batch definition for ${plannedBatchId}`)
  }
}
if (!plannedAg21BatchIds.includes('batch-099')) {
  problems.push('config/ag21-batch-plan.json: expected batch-099 to be planned')
}

if (ag22BatchPlan.status !== 'planned') {
  problems.push('config/ag22-batch-plan.json: status must be planned')
}
if (!Array.isArray(ag22BatchPlan.proposedBatches) || ag22BatchPlan.proposedBatches.length !== 1) {
  problems.push('config/ag22-batch-plan.json: expected exactly one proposed batch')
}
if (
  ag22BatchPlan.sourceScope?.confirmedPageRange?.[0] !== 1 ||
  ag22BatchPlan.sourceScope?.confirmedPageRange?.[1] !== 1
) {
  problems.push('config/ag22-batch-plan.json: confirmedPageRange must be [1, 1]')
}
if (ag22BatchPlan.sourceScope?.sourceStatus !== 'active') {
  problems.push('config/ag22-batch-plan.json: sourceStatus must be active')
}
const plannedAg22BatchIds = Array.isArray(ag22BatchPlan.proposedBatches)
  ? ag22BatchPlan.proposedBatches
      .map((batch) => batch?.plannedBatchId)
      .filter((batchId) => typeof batchId === 'string' && batchId.length > 0)
  : []
for (const plannedBatchId of plannedAg22BatchIds) {
  if (!batchDefinitions[plannedBatchId]) {
    problems.push(`scripts/batch-definitions.mjs: missing batch definition for ${plannedBatchId}`)
  }
}
if (!plannedAg22BatchIds.includes('batch-100')) {
  problems.push('config/ag22-batch-plan.json: expected batch-100 to be planned')
}

if (ag23BatchPlan.status !== 'planned') {
  problems.push('config/ag23-batch-plan.json: status must be planned')
}
if (!Array.isArray(ag23BatchPlan.proposedBatches) || ag23BatchPlan.proposedBatches.length !== 1) {
  problems.push('config/ag23-batch-plan.json: expected exactly one proposed batch')
}
if (
  ag23BatchPlan.sourceScope?.confirmedPageRange?.[0] !== 1 ||
  ag23BatchPlan.sourceScope?.confirmedPageRange?.[1] !== 1
) {
  problems.push('config/ag23-batch-plan.json: confirmedPageRange must be [1, 1]')
}
if (ag23BatchPlan.sourceScope?.sourceStatus !== 'active') {
  problems.push('config/ag23-batch-plan.json: sourceStatus must be active')
}
const plannedAg23BatchIds = Array.isArray(ag23BatchPlan.proposedBatches)
  ? ag23BatchPlan.proposedBatches
      .map((batch) => batch?.plannedBatchId)
      .filter((batchId) => typeof batchId === 'string' && batchId.length > 0)
  : []
for (const plannedBatchId of plannedAg23BatchIds) {
  if (!batchDefinitions[plannedBatchId]) {
    problems.push(`scripts/batch-definitions.mjs: missing batch definition for ${plannedBatchId}`)
  }
}
if (!plannedAg23BatchIds.includes('batch-101')) {
  problems.push('config/ag23-batch-plan.json: expected batch-101 to be planned')
}

if (ag24BatchPlan.status !== 'planned') {
  problems.push('config/ag24-batch-plan.json: status must be planned')
}
if (!Array.isArray(ag24BatchPlan.proposedBatches) || ag24BatchPlan.proposedBatches.length !== 3) {
  problems.push('config/ag24-batch-plan.json: expected exactly three proposed batches')
}
if (
  ag24BatchPlan.sourceScope?.confirmedPageRange?.[0] !== 1 ||
  ag24BatchPlan.sourceScope?.confirmedPageRange?.[1] !== 6
) {
  problems.push('config/ag24-batch-plan.json: confirmedPageRange must be [1, 6]')
}
if (ag24BatchPlan.sourceScope?.sourceStatus !== 'active') {
  problems.push('config/ag24-batch-plan.json: sourceStatus must be active')
}
const plannedAg24BatchIds = Array.isArray(ag24BatchPlan.proposedBatches)
  ? ag24BatchPlan.proposedBatches
      .map((batch) => batch?.plannedBatchId)
      .filter((batchId) => typeof batchId === 'string' && batchId.length > 0)
  : []
for (const plannedBatchId of plannedAg24BatchIds) {
  if (!batchDefinitions[plannedBatchId]) {
    problems.push(`scripts/batch-definitions.mjs: missing batch definition for ${plannedBatchId}`)
  }
}
for (const expectedBatchId of ['batch-102', 'batch-103', 'batch-104']) {
  if (!plannedAg24BatchIds.includes(expectedBatchId)) {
    problems.push(`config/ag24-batch-plan.json: expected ${expectedBatchId} to be planned`)
  }
}

if (ag29BatchPlan.status !== 'planned') {
  problems.push('config/ag29-batch-plan.json: status must be planned')
}
if (!Array.isArray(ag29BatchPlan.proposedBatches) || ag29BatchPlan.proposedBatches.length !== 1) {
  problems.push('config/ag29-batch-plan.json: expected exactly one proposed batch')
}
if (
  ag29BatchPlan.sourceScope?.confirmedPageRange?.[0] !== 1 ||
  ag29BatchPlan.sourceScope?.confirmedPageRange?.[1] !== 2
) {
  problems.push('config/ag29-batch-plan.json: confirmedPageRange must be [1, 2]')
}
if (ag29BatchPlan.sourceScope?.sourceStatus !== 'active') {
  problems.push('config/ag29-batch-plan.json: sourceStatus must be active')
}
const plannedAg29BatchIds = Array.isArray(ag29BatchPlan.proposedBatches)
  ? ag29BatchPlan.proposedBatches
      .map((batch) => batch?.plannedBatchId)
      .filter((batchId) => typeof batchId === 'string' && batchId.length > 0)
  : []
for (const plannedBatchId of plannedAg29BatchIds) {
  if (!batchDefinitions[plannedBatchId]) {
    problems.push(`scripts/batch-definitions.mjs: missing batch definition for ${plannedBatchId}`)
  }
}
if (!plannedAg29BatchIds.includes('batch-111')) {
  problems.push('config/ag29-batch-plan.json: expected batch-111 to be planned')
}

if (ag30BatchPlan.status !== 'planned') {
  problems.push('config/ag30-batch-plan.json: status must be planned')
}
if (!Array.isArray(ag30BatchPlan.proposedBatches) || ag30BatchPlan.proposedBatches.length !== 1) {
  problems.push('config/ag30-batch-plan.json: expected exactly one proposed batch')
}
if (
  ag30BatchPlan.sourceScope?.confirmedPageRange?.[0] !== 1 ||
  ag30BatchPlan.sourceScope?.confirmedPageRange?.[1] !== 2
) {
  problems.push('config/ag30-batch-plan.json: confirmedPageRange must be [1, 2]')
}
if (ag30BatchPlan.sourceScope?.sourceStatus !== 'active') {
  problems.push('config/ag30-batch-plan.json: sourceStatus must be active')
}
const plannedAg30BatchIds = Array.isArray(ag30BatchPlan.proposedBatches)
  ? ag30BatchPlan.proposedBatches
      .map((batch) => batch?.plannedBatchId)
      .filter((batchId) => typeof batchId === 'string' && batchId.length > 0)
  : []
for (const plannedBatchId of plannedAg30BatchIds) {
  if (!batchDefinitions[plannedBatchId]) {
    problems.push(`scripts/batch-definitions.mjs: missing batch definition for ${plannedBatchId}`)
  }
}
if (!plannedAg30BatchIds.includes('batch-112')) {
  problems.push('config/ag30-batch-plan.json: expected batch-112 to be planned')
}

if (ag31BatchPlan.status !== 'planned') {
  problems.push('config/ag31-batch-plan.json: status must be planned')
}
if (!Array.isArray(ag31BatchPlan.proposedBatches) || ag31BatchPlan.proposedBatches.length !== 1) {
  problems.push('config/ag31-batch-plan.json: expected exactly one proposed batch')
}
if (
  ag31BatchPlan.sourceScope?.confirmedPageRange?.[0] !== 1 ||
  ag31BatchPlan.sourceScope?.confirmedPageRange?.[1] !== 1
) {
  problems.push('config/ag31-batch-plan.json: confirmedPageRange must be [1, 1]')
}
if (ag31BatchPlan.sourceScope?.sourceStatus !== 'active') {
  problems.push('config/ag31-batch-plan.json: sourceStatus must be active')
}
const plannedAg31BatchIds = Array.isArray(ag31BatchPlan.proposedBatches)
  ? ag31BatchPlan.proposedBatches
      .map((batch) => batch?.plannedBatchId)
      .filter((batchId) => typeof batchId === 'string' && batchId.length > 0)
  : []
for (const plannedBatchId of plannedAg31BatchIds) {
  if (!batchDefinitions[plannedBatchId]) {
    problems.push(`scripts/batch-definitions.mjs: missing batch definition for ${plannedBatchId}`)
  }
}
if (!plannedAg31BatchIds.includes('batch-113')) {
  problems.push('config/ag31-batch-plan.json: expected batch-113 to be planned')
}

if (ag32BatchPlan.status !== 'planned') {
  problems.push('config/ag32-batch-plan.json: status must be planned')
}
if (!Array.isArray(ag32BatchPlan.proposedBatches) || ag32BatchPlan.proposedBatches.length !== 1) {
  problems.push('config/ag32-batch-plan.json: expected exactly one proposed batch')
}
if (
  ag32BatchPlan.sourceScope?.confirmedPageRange?.[0] !== 1 ||
  ag32BatchPlan.sourceScope?.confirmedPageRange?.[1] !== 2
) {
  problems.push('config/ag32-batch-plan.json: confirmedPageRange must be [1, 2]')
}
if (ag32BatchPlan.sourceScope?.sourceStatus !== 'active') {
  problems.push('config/ag32-batch-plan.json: sourceStatus must be active')
}
const plannedAg32BatchIds = Array.isArray(ag32BatchPlan.proposedBatches)
  ? ag32BatchPlan.proposedBatches
      .map((batch) => batch?.plannedBatchId)
      .filter((batchId) => typeof batchId === 'string' && batchId.length > 0)
  : []
for (const plannedBatchId of plannedAg32BatchIds) {
  if (!batchDefinitions[plannedBatchId]) {
    problems.push(`scripts/batch-definitions.mjs: missing batch definition for ${plannedBatchId}`)
  }
}
if (!plannedAg32BatchIds.includes('batch-114')) {
  problems.push('config/ag32-batch-plan.json: expected batch-114 to be planned')
}

await validateReviewMarkdown(paths.reviewPacketTemplateMd, 'review-packet.template.md')
await validateReviewMarkdown(paths.sampleReviewPacketMd, 'review-packet.sample.md')
await validateVm20PlanMarkdown(paths.vm20ExtractionPlanMd, 'docs/processor/vm20_extraction_plan.md')
  await validatePracticeNotePlanMarkdown(
    paths.practiceNoteExtractionPlanMd,
    'docs/processor/vm20_practice_note_extraction_plan.md',
  )
await validateModelGovernancePracticeNotePlanMarkdown(
    paths.modelGovernancePracticeNoteExtractionPlanMd,
    'docs/processor/model_governance_practice_note_extraction_plan.md',
  )
  await validateAg03PlanMarkdown(paths.ag03ExtractionPlanMd, 'docs/processor/ag03_extraction_plan.md')
await validateAg42PlanMarkdown(paths.ag42ExtractionPlanMd, 'docs/processor/ag42_extraction_plan.md')
await validateAg43PlanMarkdown(paths.ag43ExtractionPlanMd, 'docs/processor/ag43_extraction_plan.md')
await validateAg44PlanMarkdown(paths.ag44ExtractionPlanMd, 'docs/processor/ag44_extraction_plan.md')
await validateAg45PlanMarkdown(paths.ag45ExtractionPlanMd, 'docs/processor/ag45_extraction_plan.md')
await validateAg46PlanMarkdown(paths.ag46ExtractionPlanMd, 'docs/processor/ag46_extraction_plan.md')
await validateAg47PlanMarkdown(paths.ag47ExtractionPlanMd, 'docs/processor/ag47_extraction_plan.md')
await validateAg48PlanMarkdown(paths.ag48ExtractionPlanMd, 'docs/processor/ag48_extraction_plan.md')
await validateAg49PlanMarkdown(paths.ag49ExtractionPlanMd, 'docs/processor/ag49_extraction_plan.md')
await validateAg50PlanMarkdown(paths.ag50ExtractionPlanMd, 'docs/processor/ag50_extraction_plan.md')
await validateAg51PlanMarkdown(paths.ag51ExtractionPlanMd, 'docs/processor/ag51_extraction_plan.md')
await validateAg53PlanMarkdown(paths.ag53ExtractionPlanMd, 'docs/processor/ag53_extraction_plan.md')
await validateAg54PlanMarkdown(paths.ag54ExtractionPlanMd, 'docs/processor/ag54_extraction_plan.md')
await validateAg55PlanMarkdown(paths.ag55ExtractionPlanMd, 'docs/processor/ag55_extraction_plan.md')
await validateVm20ReviewIndexMarkdown(paths.vm20ReviewIndexMd, 'docs/review/vm20_review_index.md')
await validateSupportingVmReviewIndexMarkdown(
  paths.supportingVmReviewIndexMd,
  'docs/review/supporting_vm_review_index.md',
)
await validateVm21ReviewIndexMarkdown(paths.vm21ReviewIndexMd, 'docs/review/vm21_review_index.md')
await validateVm22ReviewIndexMarkdown(paths.vm22ReviewIndexMd, 'docs/review/vm22_review_index.md')
await validatePracticeNoteReviewIndexMarkdown(
  paths.practiceNoteReviewIndexMd,
  'docs/review/vm20_practice_note_review_index.md',
)
await validatePracticeNoteSelfReviewMarkdown(
  paths.practiceNoteSelfReviewMd,
  'docs/review/vm20_practice_note_self_review.md',
)
await validateModelGovernancePracticeNoteReviewIndexMarkdown(
  paths.modelGovernancePracticeNoteReviewIndexMd,
  'docs/review/model_governance_practice_note_review_index.md',
)
await validateModelGovernancePracticeNoteSelfReviewMarkdown(
  paths.modelGovernancePracticeNoteSelfReviewMd,
  'docs/review/model_governance_practice_note_self_review.md',
)
await validateAg03ReviewIndexMarkdown(paths.ag03ReviewIndexMd, 'docs/review/ag03_review_index.md')
await validateAg03SelfReviewMarkdown(paths.ag03SelfReviewMd, 'docs/review/ag03_self_review.md')
await validateAg01ReviewIndexMarkdown(paths.ag01ReviewIndexMd, 'docs/review/ag01_review_index.md')
await validateAg01SelfReviewMarkdown(paths.ag01SelfReviewMd, 'docs/review/ag01_self_review.md')
await validateAg02ReviewIndexMarkdown(paths.ag02ReviewIndexMd, 'docs/review/ag02_review_index.md')
await validateAg02SelfReviewMarkdown(paths.ag02SelfReviewMd, 'docs/review/ag02_self_review.md')
await validateAg04ReviewIndexMarkdown(paths.ag04ReviewIndexMd, 'docs/review/ag04_review_index.md')
await validateAg04SelfReviewMarkdown(paths.ag04SelfReviewMd, 'docs/review/ag04_self_review.md')
await validateAg05ReviewIndexMarkdown(paths.ag05ReviewIndexMd, 'docs/review/ag05_review_index.md')
await validateAg05SelfReviewMarkdown(paths.ag05SelfReviewMd, 'docs/review/ag05_self_review.md')
await validateAg06ReviewIndexMarkdown(paths.ag06ReviewIndexMd, 'docs/review/ag06_review_index.md')
await validateAg06SelfReviewMarkdown(paths.ag06SelfReviewMd, 'docs/review/ag06_self_review.md')
await validateAg07ReviewIndexMarkdown(paths.ag07ReviewIndexMd, 'docs/review/ag07_review_index.md')
await validateAg07SelfReviewMarkdown(paths.ag07SelfReviewMd, 'docs/review/ag07_self_review.md')
await validateAg08ReviewIndexMarkdown(paths.ag08ReviewIndexMd, 'docs/review/ag08_review_index.md')
await validateAg08SelfReviewMarkdown(paths.ag08SelfReviewMd, 'docs/review/ag08_self_review.md')
await validateAg09ReviewIndexMarkdown(paths.ag09ReviewIndexMd, 'docs/review/ag09_review_index.md')
await validateAg09SelfReviewMarkdown(paths.ag09SelfReviewMd, 'docs/review/ag09_self_review.md')
await validateAg10ReviewIndexMarkdown(paths.ag10ReviewIndexMd, 'docs/review/ag10_review_index.md')
await validateAg10SelfReviewMarkdown(paths.ag10SelfReviewMd, 'docs/review/ag10_self_review.md')
await validateAg11ReviewIndexMarkdown(paths.ag11ReviewIndexMd, 'docs/review/ag11_review_index.md')
await validateAg11SelfReviewMarkdown(paths.ag11SelfReviewMd, 'docs/review/ag11_self_review.md')
await validateAg12ReviewIndexMarkdown(paths.ag12ReviewIndexMd, 'docs/review/ag12_review_index.md')
await validateAg12SelfReviewMarkdown(paths.ag12SelfReviewMd, 'docs/review/ag12_self_review.md')
await validateAg13ReviewIndexMarkdown(paths.ag13ReviewIndexMd, 'docs/review/ag13_review_index.md')
await validateAg13SelfReviewMarkdown(paths.ag13SelfReviewMd, 'docs/review/ag13_self_review.md')
await validateAg14ReviewIndexMarkdown(paths.ag14ReviewIndexMd, 'docs/review/ag14_review_index.md')
await validateAg14SelfReviewMarkdown(paths.ag14SelfReviewMd, 'docs/review/ag14_self_review.md')
await validateAg15ReviewIndexMarkdown(paths.ag15ReviewIndexMd, 'docs/review/ag15_review_index.md')
await validateAg15SelfReviewMarkdown(paths.ag15SelfReviewMd, 'docs/review/ag15_self_review.md')
await validateAg16ReviewIndexMarkdown(paths.ag16ReviewIndexMd, 'docs/review/ag16_review_index.md')
await validateAg16SelfReviewMarkdown(paths.ag16SelfReviewMd, 'docs/review/ag16_self_review.md')
  await validateAg17ReviewIndexMarkdown(paths.ag17ReviewIndexMd, 'docs/review/ag17_review_index.md')
  await validateAg17SelfReviewMarkdown(paths.ag17SelfReviewMd, 'docs/review/ag17_self_review.md')
await validateAg18ReviewIndexMarkdown(paths.ag18ReviewIndexMd, 'docs/review/ag18_review_index.md')
await validateAg18SelfReviewMarkdown(paths.ag18SelfReviewMd, 'docs/review/ag18_self_review.md')
await validateAg19ReviewIndexMarkdown(paths.ag19ReviewIndexMd, 'docs/review/ag19_review_index.md')
await validateAg19SelfReviewMarkdown(paths.ag19SelfReviewMd, 'docs/review/ag19_self_review.md')
await validateAg20ReviewIndexMarkdown(paths.ag20ReviewIndexMd, 'docs/review/ag20_review_index.md')
await validateAg20SelfReviewMarkdown(paths.ag20SelfReviewMd, 'docs/review/ag20_self_review.md')
await validateAg21ReviewIndexMarkdown(paths.ag21ReviewIndexMd, 'docs/review/ag21_review_index.md')
await validateAg21SelfReviewMarkdown(paths.ag21SelfReviewMd, 'docs/review/ag21_self_review.md')
await validateAg22ReviewIndexMarkdown(paths.ag22ReviewIndexMd, 'docs/review/ag22_review_index.md')
await validateAg22SelfReviewMarkdown(paths.ag22SelfReviewMd, 'docs/review/ag22_self_review.md')
await validateAg23ReviewIndexMarkdown(paths.ag23ReviewIndexMd, 'docs/review/ag23_review_index.md')
await validateAg23SelfReviewMarkdown(paths.ag23SelfReviewMd, 'docs/review/ag23_self_review.md')
await validateAg24ReviewIndexMarkdown(paths.ag24ReviewIndexMd, 'docs/review/ag24_review_index.md')
await validateAg24SelfReviewMarkdown(paths.ag24SelfReviewMd, 'docs/review/ag24_self_review.md')
await validateAg25ReviewIndexMarkdown(paths.ag25ReviewIndexMd, 'docs/review/ag25_review_index.md')
await validateAg25SelfReviewMarkdown(paths.ag25SelfReviewMd, 'docs/review/ag25_self_review.md')
await validateAg25PlanMarkdown(paths.ag25ExtractionPlanMd, 'docs/processor/ag25_extraction_plan.md')
await validateAg26ReviewIndexMarkdown(paths.ag26ReviewIndexMd, 'docs/review/ag26_review_index.md')
await validateAg26SelfReviewMarkdown(paths.ag26SelfReviewMd, 'docs/review/ag26_self_review.md')
await validateAg26PlanMarkdown(paths.ag26ExtractionPlanMd, 'docs/processor/ag26_extraction_plan.md')
await validateAg27PlanMarkdown(paths.ag27ExtractionPlanMd, 'docs/processor/ag27_extraction_plan.md')
await validateAg28PlanMarkdown(paths.ag28ExtractionPlanMd, 'docs/processor/ag28_extraction_plan.md')
await validateAg29PlanMarkdown(paths.ag29ExtractionPlanMd, 'docs/processor/ag29_extraction_plan.md')
await validateAg30PlanMarkdown(paths.ag30ExtractionPlanMd, 'docs/processor/ag30_extraction_plan.md')
await validateAg31PlanMarkdown(paths.ag31ExtractionPlanMd, 'docs/processor/ag31_extraction_plan.md')
await validateAg32PlanMarkdown(paths.ag32ExtractionPlanMd, 'docs/processor/ag32_extraction_plan.md')
await validateAg33PlanMarkdown(paths.ag33ExtractionPlanMd, 'docs/processor/ag33_extraction_plan.md')
await validateAg31ReviewIndexMarkdown(paths.ag31ReviewIndexMd, 'docs/review/ag31_review_index.md')
await validateAg31SelfReviewMarkdown(paths.ag31SelfReviewMd, 'docs/review/ag31_self_review.md')
await validateAg32ReviewIndexMarkdown(paths.ag32ReviewIndexMd, 'docs/review/ag32_review_index.md')
await validateAg32SelfReviewMarkdown(paths.ag32SelfReviewMd, 'docs/review/ag32_self_review.md')
await validateAg33ReviewIndexMarkdown(paths.ag33ReviewIndexMd, 'docs/review/ag33_review_index.md')
await validateAg33SelfReviewMarkdown(paths.ag33SelfReviewMd, 'docs/review/ag33_self_review.md')
  await validateAg34PlanMarkdown(paths.ag34ExtractionPlanMd, 'docs/processor/ag34_extraction_plan.md')
  await validateAg35PlanMarkdown(paths.ag35ExtractionPlanMd, 'docs/processor/ag35_extraction_plan.md')
  await validateAg36PlanMarkdown(paths.ag36ExtractionPlanMd, 'docs/processor/ag36_extraction_plan.md')
  await validateAg37PlanMarkdown(paths.ag37ExtractionPlanMd, 'docs/processor/ag37_extraction_plan.md')
  await validateAg38PlanMarkdown(paths.ag38ExtractionPlanMd, 'docs/processor/ag38_extraction_plan.md')
  await validateAg39PlanMarkdown(paths.ag39ExtractionPlanMd, 'docs/processor/ag39_extraction_plan.md')
  if ((await exists(paths.ag34ReviewIndexMd)) && (await exists(paths.ag34SelfReviewMd))) {
    await validateAg34ReviewIndexMarkdown(paths.ag34ReviewIndexMd, 'docs/review/ag34_review_index.md')
    await validateAg34SelfReviewMarkdown(paths.ag34SelfReviewMd, 'docs/review/ag34_self_review.md')
  }
if ((await exists(paths.ag35ReviewIndexMd)) && (await exists(paths.ag35SelfReviewMd))) {
  await validateAg35ReviewIndexMarkdown(paths.ag35ReviewIndexMd, 'docs/review/ag35_review_index.md')
  await validateAg35SelfReviewMarkdown(paths.ag35SelfReviewMd, 'docs/review/ag35_self_review.md')
}
  if ((await exists(paths.ag36ReviewIndexMd)) && (await exists(paths.ag36SelfReviewMd))) {
    await validateAg36ReviewIndexMarkdown(paths.ag36ReviewIndexMd, 'docs/review/ag36_review_index.md')
    await validateAg36SelfReviewMarkdown(paths.ag36SelfReviewMd, 'docs/review/ag36_self_review.md')
  }
  const ag37ReviewArtifactsPresent =
    (await exists(paths.ag37ReviewIndexMd)) && (await exists(paths.ag37SelfReviewMd))
  if (ag37ReviewArtifactsPresent) {
    await validateAg37ReviewIndexMarkdown(paths.ag37ReviewIndexMd, 'docs/review/ag37_review_index.md')
    await validateAg37SelfReviewMarkdown(paths.ag37SelfReviewMd, 'docs/review/ag37_self_review.md')
  }
  const ag38ReviewArtifactsPresent =
    (await exists(paths.ag38ReviewIndexMd)) && (await exists(paths.ag38SelfReviewMd))
  if (ag38ReviewArtifactsPresent) {
    await validateAg38ReviewIndexMarkdown(paths.ag38ReviewIndexMd, 'docs/review/ag38_review_index.md')
    await validateAg38SelfReviewMarkdown(paths.ag38SelfReviewMd, 'docs/review/ag38_self_review.md')
  }
  const ag39ReviewArtifactsPresent =
    (await exists(paths.ag39ReviewIndexMd)) && (await exists(paths.ag39SelfReviewMd))
  if (ag39ReviewArtifactsPresent) {
    await validateAg39ReviewIndexMarkdown(paths.ag39ReviewIndexMd, 'docs/review/ag39_review_index.md')
    await validateAg39SelfReviewMarkdown(paths.ag39SelfReviewMd, 'docs/review/ag39_self_review.md')
  }
  const ag40ReviewArtifactsPresent =
    (await exists(paths.ag40ReviewIndexMd)) && (await exists(paths.ag40SelfReviewMd))
  if (ag40ReviewArtifactsPresent) {
    await validateAg40ReviewIndexMarkdown(paths.ag40ReviewIndexMd, 'docs/review/ag40_review_index.md')
    await validateAg40SelfReviewMarkdown(paths.ag40SelfReviewMd, 'docs/review/ag40_self_review.md')
  }
  const ag41ReviewArtifactsPresent =
    (await exists(paths.ag41ReviewIndexMd)) && (await exists(paths.ag41SelfReviewMd))
  if (ag41ReviewArtifactsPresent) {
    await validateAg41ReviewIndexMarkdown(paths.ag41ReviewIndexMd, 'docs/review/ag41_review_index.md')
    await validateAg41SelfReviewMarkdown(paths.ag41SelfReviewMd, 'docs/review/ag41_self_review.md')
  }
  const ag42ReviewArtifactsPresent =
    (await exists(paths.ag42ReviewIndexMd)) && (await exists(paths.ag42SelfReviewMd))
if (ag42ReviewArtifactsPresent) {
    await validateAg42ReviewIndexMarkdown(paths.ag42ReviewIndexMd, 'docs/review/ag42_review_index.md')
    await validateAg42SelfReviewMarkdown(paths.ag42SelfReviewMd, 'docs/review/ag42_self_review.md')
  }
  const ag43ReviewArtifactsPresent =
    (await exists(paths.ag43ReviewIndexMd)) && (await exists(paths.ag43SelfReviewMd))
  await validateAg43ReviewIndexMarkdown(paths.ag43ReviewIndexMd, 'docs/review/ag43_review_index.md')
  await validateAg43SelfReviewMarkdown(paths.ag43SelfReviewMd, 'docs/review/ag43_self_review.md')
  const ag44ReviewArtifactsPresent =
    (await exists(paths.ag44ReviewIndexMd)) && (await exists(paths.ag44SelfReviewMd))
  if (ag44ReviewArtifactsPresent) {
    await validateAg44ReviewIndexMarkdown(paths.ag44ReviewIndexMd, 'docs/review/ag44_review_index.md')
    await validateAg44SelfReviewMarkdown(paths.ag44SelfReviewMd, 'docs/review/ag44_self_review.md')
  }
  const ag45ReviewArtifactsPresent =
    (await exists(paths.ag45ReviewIndexMd)) && (await exists(paths.ag45SelfReviewMd))
  if (ag45ReviewArtifactsPresent) {
    await validateAg45ReviewIndexMarkdown(paths.ag45ReviewIndexMd, 'docs/review/ag45_review_index.md')
    await validateAg45SelfReviewMarkdown(paths.ag45SelfReviewMd, 'docs/review/ag45_self_review.md')
  }
  const ag46ReviewArtifactsPresent =
    (await exists(paths.ag46ReviewIndexMd)) && (await exists(paths.ag46SelfReviewMd))
  if (ag46ReviewArtifactsPresent) {
    await validateAg46ReviewIndexMarkdown(paths.ag46ReviewIndexMd, 'docs/review/ag46_review_index.md')
    await validateAg46SelfReviewMarkdown(paths.ag46SelfReviewMd, 'docs/review/ag46_self_review.md')
  }
  const ag47ReviewArtifactsPresent =
    (await exists(paths.ag47ReviewIndexMd)) && (await exists(paths.ag47SelfReviewMd))
  if (ag47ReviewArtifactsPresent) {
    await validateAg47ReviewIndexMarkdown(paths.ag47ReviewIndexMd, 'docs/review/ag47_review_index.md')
    await validateAg47SelfReviewMarkdown(paths.ag47SelfReviewMd, 'docs/review/ag47_self_review.md')
  }
  const ag48ReviewArtifactsPresent =
    (await exists(paths.ag48ReviewIndexMd)) && (await exists(paths.ag48SelfReviewMd))
  if (ag48ReviewArtifactsPresent) {
    await validateAg48ReviewIndexMarkdown(paths.ag48ReviewIndexMd, 'docs/review/ag48_review_index.md')
    await validateAg48SelfReviewMarkdown(paths.ag48SelfReviewMd, 'docs/review/ag48_self_review.md')
  }
  const ag49ReviewArtifactsPresent =
    (await exists(paths.ag49ReviewIndexMd)) && (await exists(paths.ag49SelfReviewMd))
  const ag50ReviewArtifactsPresent =
    (await exists(paths.ag50ReviewIndexMd)) && (await exists(paths.ag50SelfReviewMd))
  const ag51ReviewArtifactsPresent =
    (await exists(paths.ag51ReviewIndexMd)) && (await exists(paths.ag51SelfReviewMd))
  const ag52ReviewArtifactsPresent =
    (await exists(paths.ag52ReviewIndexMd)) && (await exists(paths.ag52SelfReviewMd))
  const ag53ReviewArtifactsPresent =
    (await exists(paths.ag53ReviewIndexMd)) && (await exists(paths.ag53SelfReviewMd))
  const ag54ReviewArtifactsPresent =
    (await exists(paths.ag54ReviewIndexMd)) && (await exists(paths.ag54SelfReviewMd))
  const ag55ReviewArtifactsPresent =
    (await exists(paths.ag55ReviewIndexMd)) && (await exists(paths.ag55SelfReviewMd))
  if (ag51ReviewArtifactsPresent) {
    await validateAg51ReviewIndexMarkdown(paths.ag51ReviewIndexMd, 'docs/review/ag51_review_index.md')
    await validateAg51SelfReviewMarkdown(paths.ag51SelfReviewMd, 'docs/review/ag51_self_review.md')
  } else if (ag50ReviewArtifactsPresent) {
    await validateAg50ReviewIndexMarkdown(paths.ag50ReviewIndexMd, 'docs/review/ag50_review_index.md')
    await validateAg50SelfReviewMarkdown(paths.ag50SelfReviewMd, 'docs/review/ag50_self_review.md')
  } else if (ag49ReviewArtifactsPresent) {
    await validateAg49ReviewIndexMarkdown(paths.ag49ReviewIndexMd, 'docs/review/ag49_review_index.md')
    await validateAg49SelfReviewMarkdown(paths.ag49SelfReviewMd, 'docs/review/ag49_self_review.md')
  }
  if (ag52ReviewArtifactsPresent) {
    await validateAg52ReviewIndexMarkdown(paths.ag52ReviewIndexMd, 'docs/review/ag52_review_index.md')
    await validateAg52SelfReviewMarkdown(paths.ag52SelfReviewMd, 'docs/review/ag52_self_review.md')
  }
  if (ag53ReviewArtifactsPresent) {
    await validateAg53ReviewIndexMarkdown(paths.ag53ReviewIndexMd, 'docs/review/ag53_review_index.md')
    await validateAg53SelfReviewMarkdown(paths.ag53SelfReviewMd, 'docs/review/ag53_self_review.md')
  }
  if (ag54ReviewArtifactsPresent) {
    await validateAg54ReviewIndexMarkdown(paths.ag54ReviewIndexMd, 'docs/review/ag54_review_index.md')
    await validateAg54SelfReviewMarkdown(paths.ag54SelfReviewMd, 'docs/review/ag54_self_review.md')
  }
  if (ag55ReviewArtifactsPresent) {
    await validateAg55ReviewIndexMarkdown(paths.ag55ReviewIndexMd, 'docs/review/ag55_review_index.md')
    await validateAg55SelfReviewMarkdown(paths.ag55SelfReviewMd, 'docs/review/ag55_self_review.md')
  }
await validateAg27ReviewIndexMarkdown(paths.ag27ReviewIndexMd, 'docs/review/ag27_review_index.md')
await validateAg27SelfReviewMarkdown(paths.ag27SelfReviewMd, 'docs/review/ag27_self_review.md')
await validateAg28ReviewIndexMarkdown(paths.ag28ReviewIndexMd, 'docs/review/ag28_review_index.md')
await validateAg28SelfReviewMarkdown(paths.ag28SelfReviewMd, 'docs/review/ag28_self_review.md')
await validateAg29ReviewIndexMarkdown(paths.ag29ReviewIndexMd, 'docs/review/ag29_review_index.md')
await validateAg29SelfReviewMarkdown(paths.ag29SelfReviewMd, 'docs/review/ag29_self_review.md')
await validateAg30ReviewIndexMarkdown(paths.ag30ReviewIndexMd, 'docs/review/ag30_review_index.md')
await validateAg30SelfReviewMarkdown(paths.ag30SelfReviewMd, 'docs/review/ag30_self_review.md')
await validateAg05PlanMarkdown(paths.ag05ExtractionPlanMd, 'docs/processor/ag05_extraction_plan.md')
await validateAg06PlanMarkdown(paths.ag06ExtractionPlanMd, 'docs/processor/ag06_extraction_plan.md')
await validateAg07PlanMarkdown(paths.ag07ExtractionPlanMd, 'docs/processor/ag07_extraction_plan.md')
await validateAg08PlanMarkdown(paths.ag08ExtractionPlanMd, 'docs/processor/ag08_extraction_plan.md')
await validateAg09PlanMarkdown(paths.ag09ExtractionPlanMd, 'docs/processor/ag09_extraction_plan.md')
await validateAg10PlanMarkdown(paths.ag10ExtractionPlanMd, 'docs/processor/ag10_extraction_plan.md')
await validateAg11PlanMarkdown(paths.ag11ExtractionPlanMd, 'docs/processor/ag11_extraction_plan.md')
await validateAg12PlanMarkdown(paths.ag12ExtractionPlanMd, 'docs/processor/ag12_extraction_plan.md')
await validateAg13PlanMarkdown(paths.ag13ExtractionPlanMd, 'docs/processor/ag13_extraction_plan.md')
await validateAg14PlanMarkdown(paths.ag14ExtractionPlanMd, 'docs/processor/ag14_extraction_plan.md')
await validateAg15PlanMarkdown(paths.ag15ExtractionPlanMd, 'docs/processor/ag15_extraction_plan.md')
await validateAg16PlanMarkdown(paths.ag16ExtractionPlanMd, 'docs/processor/ag16_extraction_plan.md')
await validateAg17PlanMarkdown(paths.ag17ExtractionPlanMd, 'docs/processor/ag17_extraction_plan.md')
await validateAg18PlanMarkdown(paths.ag18ExtractionPlanMd, 'docs/processor/ag18_extraction_plan.md')
await validateAg19PlanMarkdown(paths.ag19ExtractionPlanMd, 'docs/processor/ag19_extraction_plan.md')
await validateAg20PlanMarkdown(paths.ag20ExtractionPlanMd, 'docs/processor/ag20_extraction_plan.md')
await validateAg21PlanMarkdown(paths.ag21ExtractionPlanMd, 'docs/processor/ag21_extraction_plan.md')
await validateAg22PlanMarkdown(paths.ag22ExtractionPlanMd, 'docs/processor/ag22_extraction_plan.md')
await validateAg23PlanMarkdown(paths.ag23ExtractionPlanMd, 'docs/processor/ag23_extraction_plan.md')
await validateAg24PlanMarkdown(paths.ag24ExtractionPlanMd, 'docs/processor/ag24_extraction_plan.md')
await validateLhmanual26PlanMarkdown(paths.lhmanual26ExtractionPlanMd, 'docs/processor/lhmanual26_extraction_plan.md')
await validateAg02PlanMarkdown(paths.ag02ExtractionPlanMd, 'docs/processor/ag02_extraction_plan.md')
await validatePocStatusSummaryMarkdown(
  paths.pocStatusSummaryMd,
  'docs/review/valuation_regulation_repository_poc_status.md',
)
await validateSupportingVmPlanMarkdown(
  paths.supportingVmExtractionPlanMd,
  'docs/processor/supporting_vm_chapters_extraction_plan.md',
)
await validateVm21PlanMarkdown(paths.vm21ExtractionPlanMd, 'docs/processor/vm21_extraction_plan.md')
await validateVm22PlanMarkdown(paths.vm22ExtractionPlanMd, 'docs/processor/vm22_extraction_plan.md')
await validateRemainingSourceInventoryWorkflowMarkdown(
  paths.remainingSourceInventoryWorkflowMd,
  'docs/processor/remaining_source_inventory_workflow.md',
)

if (!config.project?.name) {
  problems.push('config/source-families.json: missing project.name')
}
if (!config.project?.rawSourceRoot) {
  problems.push('config/source-families.json: missing project.rawSourceRoot')
}
if (!Array.isArray(config.domains) || config.domains.length < 3) {
  problems.push('config/source-families.json: expected portability domains to be present')
}

const batchDirs = (await fs.readdir(workBatchesRoot, { withFileTypes: true })).filter((dirent) =>
  dirent.isDirectory(),
)
let validatedPilotBatchCount = 0
for (const dirent of batchDirs) {
  const batchId = dirent.name
  const batchPaths = getBatchPaths(batchId)
  if (!(await exists(batchPaths.batchManifest))) {
    continue
  }

  const batchDefinition = batchDefinitions[batchId]
  if (!batchDefinition) {
    warnings.push(`No batch definition found for ${batchId}; validating only the generic scaffold rules.`)
  }

  const batchManifest = await readJson(batchPaths.batchManifest)
  const isPilotBatch = batchManifest.boundaries?.noRealProcessing === false
  validateBatchManifestLike(batchManifest, `${batchId}/batch-manifest.json`, {
    mode: isPilotBatch ? 'pilot' : 'scaffold',
  })

  if (!isPilotBatch) {
    continue
  }

  validatedPilotBatchCount += 1

  const pilotRequiredFiles = [
    batchPaths.sourceInventory,
    batchPaths.chunkManifest,
    batchPaths.extractionOutput,
    batchPaths.reviewPacketJson,
    batchPaths.reviewPacketMd,
    batchPaths.validationReport,
    batchPaths.unresolvedIssuesSummary,
  ]

  for (const filePath of pilotRequiredFiles) {
    if (!(await exists(filePath))) {
      problems.push(`${path.relative(repoRoot, filePath)}: missing pilot output file`)
    }
  }

  const pilotSourceInventory = await readJson(batchPaths.sourceInventory)
  const pilotChunkManifest = await readJson(batchPaths.chunkManifest)
  const pilotExtractionOutput = await readJson(batchPaths.extractionOutput)
  const pilotReviewPacketJson = await readJson(batchPaths.reviewPacketJson)
  const pilotValidationReport = await readJson(batchPaths.validationReport)

  validateSourceInventoryLike(pilotSourceInventory, `${batchId}/source-inventory.json`)
  validateChunkManifestLike(pilotChunkManifest, `${batchId}/chunk-manifest.json`)
  validateExtractionOutputLike(pilotExtractionOutput, `${batchId}/extraction-output.json`)
  validateReviewPacketLike(pilotReviewPacketJson, `${batchId}/review/review-packet.json`)
  validateValidationReportLike(pilotValidationReport, `${batchId}/validation-report.json`)

  if (pilotReviewPacketJson.promotionRecommendation?.status !== 'not_recommended') {
    problems.push(`${batchId}/review/review-packet.json: pilot review packet must remain not_recommended`)
  }
  if (pilotReviewPacketJson.learnerFacingStatus?.ready !== false) {
    problems.push(`${batchId}/review/review-packet.json: learner-facing status must stay false`)
  }
  if (pilotReviewPacketJson.appExportReadiness?.ready !== false) {
    problems.push(`${batchId}/review/review-packet.json: app export readiness must stay false`)
  }
  if (pilotReviewPacketJson.ragReadiness?.ready !== false) {
    problems.push(`${batchId}/review/review-packet.json: RAG readiness must stay false`)
  }
  if (!Array.isArray(pilotReviewPacketJson.unresolvedIssues) || pilotReviewPacketJson.unresolvedIssues.length === 0) {
    problems.push(`${batchId}/review/review-packet.json: pilot review packet must include unresolved issues`)
  }

  const expectedCheckIds = batchDefinition?.validationChecks?.map((check) => check.checkId) ?? []
  const pilotCheckIds = new Map(
    Array.isArray(pilotValidationReport.checks)
      ? pilotValidationReport.checks.map((check) => [check.checkId, check])
      : [],
  )
  for (const checkId of expectedCheckIds) {
    const check = pilotCheckIds.get(checkId)
    if (!check) {
      problems.push(`${batchId}/validation-report.json: missing pilot check ${checkId}`)
      continue
    }
    if (check.status !== 'passed') {
      problems.push(`${batchId}/validation-report.json: pilot check ${checkId} must be passed`)
    }
  }

  await validateReviewMarkdown(batchPaths.reviewPacketMd, `${batchId}/review/review-packet.md`)
  await validateUnresolvedIssuesSummary(
    batchPaths.unresolvedIssuesSummary,
    `${batchId}/unresolved-issues-summary.md`,
    pilotReviewPacketJson.unresolvedIssues,
  )
}

if (problems.length > 0) {
  console.error('Scaffold validation failed.')
  for (const problem of problems) {
    console.error(`- ${problem}`)
  }
  process.exitCode = 1
} else {
  console.log('Scaffold validation passed.')
  console.log(`- Configured source families: ${config.sourceFamilies.length}`)
  console.log(`- Batch manifest source families: ${batchManifestTemplate.sourceFamilies.length}`)
  console.log(`- Demo sources in inventory sample: ${sampleSourceInventory.items.length}`)
  console.log(`- Demo source groups in extraction sample: ${sampleExtractionOutput.sourceGroups.length}`)
  console.log(`- Review packet headings verified: ${requiredReviewHeadings.length}`)
  console.log(`- Supporting chapter windows verified: ${supportingVmBatchPlan.sourceScope.observedChapterWindows.length}`)
  console.log(`- Supporting batches validated: ${supportingVmBatchPlan.proposedBatches.length}`)
  console.log(`- Supporting review index verified: 9 batches`)
  console.log(`- VM-21 batches validated: ${vm21BatchPlan.proposedBatches.length}`)
  console.log(`- VM-21 review index verified: 16 batches`)
  console.log(`- VM-22 plan verified: ${vm22BatchPlan.proposedBatches.length} batches`)
  console.log(`- VM-22 review index verified: 17 batches`)
  console.log(`- Practice-note plan verified: ${practiceNoteBatchPlan.proposedBatches.length} batches`)
  console.log(`- Practice-note review index verified: 21 batches`)
  console.log(`- AG 03 plan verified: ${ag03BatchPlan.proposedBatches.length} batches`)
  console.log(`- AG 01 plan verified: ${ag01BatchPlan.proposedBatches.length} batches`)
  console.log(`- AG 02 plan verified: ${ag02BatchPlan.proposedBatches.length} batches`)
  console.log(`- AG 04 plan verified: ${ag04BatchPlan.proposedBatches.length} batches`)
  console.log(`- AG 05 plan verified: ${ag05BatchPlan.proposedBatches.length} batches`)
  console.log(`- AG 06 plan verified: ${ag06BatchPlan.proposedBatches.length} batches`)
  console.log(`- AG 07 plan verified: ${ag07BatchPlan.proposedBatches.length} batches`)
  console.log(`- AG 08 plan verified: ${ag08BatchPlan.proposedBatches.length} batches`)
  console.log(`- AG 09 plan verified: ${ag09BatchPlan.proposedBatches.length} batches`)
  console.log(`- AG 10 plan verified: ${ag10BatchPlan.proposedBatches.length} batches`)
  console.log(`- AG 11 plan verified: ${ag11BatchPlan.proposedBatches.length} batches`)
  console.log(`- AG 12 plan verified: ${ag12BatchPlan.proposedBatches.length} batches`)
  console.log(`- AG 13 plan verified: ${ag13BatchPlan.proposedBatches.length} batches`)
  console.log(`- AG 14 plan verified: ${ag14BatchPlan.proposedBatches.length} batches`)
  console.log(`- AG 15 plan verified: ${ag15BatchPlan.proposedBatches.length} batches`)
  console.log(`- AG 16 plan verified: ${ag16BatchPlan.proposedBatches.length} batches`)
  console.log(`- AG 17 plan verified: ${ag17BatchPlan.proposedBatches.length} batches`)
  console.log(`- AG 18 plan verified: ${ag18BatchPlan.proposedBatches.length} batches`)
  console.log(`- AG 19 plan verified: ${ag19BatchPlan.proposedBatches.length} batches`)
  console.log(`- AG 20 plan verified: ${ag20BatchPlan.proposedBatches.length} batches`)
  console.log(`- AG 21 plan verified: ${ag21BatchPlan.proposedBatches.length} batches`)
  console.log(`- AG 22 plan verified: ${ag22BatchPlan.proposedBatches.length} batches`)
  console.log(`- AG 23 plan verified: ${ag23BatchPlan.proposedBatches.length} batches`)
  console.log(`- AG 24 plan verified: ${ag24BatchPlan.proposedBatches.length} batches`)
  console.log(`- AG 24 review index verified: 3 batches`)
  console.log(`- AG 24 self-review verified: 3 batches`)
  console.log(`- AG 10 review index verified: 1 batch`)
  console.log(`- AG 11 review index verified: 1 batch`)
  console.log(`- AG 12 review index verified: 1 batch`)
  console.log(`- AG 13 review index verified: 1 batch`)
  console.log(`- AG 14 review index verified: 1 batch`)
  console.log(`- AG 15 review index verified: 1 batch`)
  console.log(`- AG 16 review index verified: 1 batch`)
  console.log(`- AG 17 review index verified: 1 batch`)
  console.log(`- AG 18 review index verified: 1 batch`)
  console.log(`- AG 19 review index verified: 1 batch`)
  console.log(`- AG 20 review index verified: 1 batch`)
  console.log(`- AG 20 self-review verified: 1 batch`)
  console.log(`- AG 21 review index verified: 1 batch`)
  console.log(`- AG 21 self-review verified: 1 batch`)
  console.log(`- AG 22 review index verified: 1 batch`)
  console.log(`- AG 22 self-review verified: 1 batch`)
  console.log(`- AG 25 review index verified: 1 batch`)
  console.log(`- AG 25 self-review verified: 1 batch`)
  console.log(`- AG 25 plan verified: 1 batch`)
  console.log(`- AG 26 review index verified: 1 batch`)
  console.log(`- AG 26 self-review verified: 1 batch`)
  console.log(`- AG 26 plan verified: ${ag26BatchPlan.proposedBatches.length} batches`)
  console.log(`- AG 28 review index verified: 1 batch`)
  console.log(`- AG 28 self-review verified: 1 batch`)
  console.log(`- AG 29 plan verified: ${ag29BatchPlan.proposedBatches.length} batches`)
  console.log(`- AG 30 plan verified: ${ag30BatchPlan.proposedBatches.length} batches`)
  console.log(`- AG 31 plan verified: ${ag31BatchPlan.proposedBatches.length} batches`)
  console.log(`- AG 32 plan verified: ${ag32BatchPlan.proposedBatches.length} batches`)
  console.log(`- AG 33 plan verified: ${ag33BatchPlan.proposedBatches.length} batches`)
  console.log(`- AG 34 plan verified: ${ag34BatchPlan.proposedBatches.length} batches`)
  console.log(`- AG 35 plan verified: ${ag35BatchPlan.proposedBatches.length} batches`)
  console.log(`- AG 29 review index verified: 1 batch`)
  console.log(`- AG 29 self-review verified: 1 batch`)
  console.log(`- AG 30 review index verified: 1 batch`)
  console.log(`- AG 30 self-review verified: 1 batch`)
  console.log(`- AG 31 review index verified: 1 batch`)
  console.log(`- AG 31 self-review verified: 1 batch`)
  console.log(`- AG 32 review index verified: 1 batch`)
  console.log(`- AG 32 self-review verified: 1 batch`)
  console.log(`- AG 33 review index verified: 2 batches`)
  console.log(`- AG 33 self-review verified: 2 batches`)
  const ag34ReviewArtifactsPresent =
    (await exists(paths.ag34ReviewIndexMd)) && (await exists(paths.ag34SelfReviewMd))
  if (ag34ReviewArtifactsPresent) {
    console.log(`- AG 34 review index verified: 3 batches`)
    console.log(`- AG 34 self-review verified: 3 batches`)
  }
  const ag35ReviewArtifactsPresent =
    (await exists(paths.ag35ReviewIndexMd)) && (await exists(paths.ag35SelfReviewMd))
  if (ag35ReviewArtifactsPresent) {
    console.log(`- AG 35 review index verified: 3 batches`)
    console.log(`- AG 35 self-review verified: 3 batches`)
  }
  const ag36ReviewArtifactsPresent =
    (await exists(paths.ag36ReviewIndexMd)) && (await exists(paths.ag36SelfReviewMd))
    if (ag36ReviewArtifactsPresent) {
      console.log(`- AG 36 review index verified: 4 batches`)
      console.log(`- AG 36 self-review verified: 4 batches`)
    }
    console.log(`- AG 36 plan verified: ${ag36BatchPlan.proposedBatches.length} batches`)
    if (ag37ReviewArtifactsPresent) {
      console.log(`- AG 37 review index verified: ${ag37BatchPlan.proposedBatches.length} batches`)
      console.log(`- AG 37 self-review verified: ${ag37BatchPlan.proposedBatches.length} batches`)
    }
    console.log(`- AG 37 plan verified: ${ag37BatchPlan.proposedBatches.length} batches`)
    if (ag38ReviewArtifactsPresent) {
      console.log(`- AG 38 review index verified: ${ag38BatchPlan.proposedBatches.length} batches`)
      console.log(`- AG 38 self-review verified: ${ag38BatchPlan.proposedBatches.length} batches`)
    }
    console.log(`- AG 38 plan verified: ${ag38BatchPlan.proposedBatches.length} batches`)
    if (ag39ReviewArtifactsPresent) {
      console.log(`- AG 39 review index verified: ${ag39BatchPlan.proposedBatches.length} batches`)
      console.log(`- AG 39 self-review verified: ${ag39BatchPlan.proposedBatches.length} batches`)
    }
    console.log(`- AG 39 plan verified: ${ag39BatchPlan.proposedBatches.length} batches`)
    if (ag40ReviewArtifactsPresent) {
      console.log(`- AG 40 review index verified: ${ag40BatchPlan.proposedBatches.length} batches`)
      console.log(`- AG 40 self-review verified: ${ag40BatchPlan.proposedBatches.length} batches`)
    }
    console.log(`- AG 40 plan verified: ${ag40BatchPlan.proposedBatches.length} batches`)
    console.log(`- AG 41 plan verified: ${ag41BatchPlan.proposedBatches.length} batches`)
    if (ag42ReviewArtifactsPresent) {
      console.log(`- AG 42 review index verified: ${ag42BatchPlan.proposedBatches.length} batches`)
      console.log(`- AG 42 self-review verified: ${ag42BatchPlan.proposedBatches.length} batches`)
    }
    console.log(`- AG 42 plan verified: ${ag42BatchPlan.proposedBatches.length} batches`)
    if (ag43ReviewArtifactsPresent) {
      console.log(`- AG 43 review index verified: ${ag43BatchPlan.proposedBatches.length} batches`)
      console.log(`- AG 43 self-review verified: ${ag43BatchPlan.proposedBatches.length} batches`)
    }
    console.log(`- AG 43 plan verified: ${ag43BatchPlan.proposedBatches.length} batches`)
    if (ag44ReviewArtifactsPresent) {
      console.log(`- AG 44 review index verified: ${ag44BatchPlan.proposedBatches.length} batches`)
      console.log(`- AG 44 self-review verified: ${ag44BatchPlan.proposedBatches.length} batches`)
    }
    console.log(`- AG 44 plan verified: ${ag44BatchPlan.proposedBatches.length} batches`)
    if (ag45ReviewArtifactsPresent) {
      console.log(`- AG 45 review index verified: ${ag45BatchPlan.proposedBatches.length} batches`)
      console.log(`- AG 45 self-review verified: ${ag45BatchPlan.proposedBatches.length} batches`)
    }
    console.log(`- AG 45 plan verified: ${ag45BatchPlan.proposedBatches.length} batches`)
    if (ag46ReviewArtifactsPresent) {
      console.log(`- AG 46 review index verified: ${ag46BatchPlan.proposedBatches.length} batches`)
      console.log(`- AG 46 self-review verified: ${ag46BatchPlan.proposedBatches.length} batches`)
    }
    console.log(`- AG 46 plan verified: ${ag46BatchPlan.proposedBatches.length} batches`)
    if (ag47ReviewArtifactsPresent) {
      console.log(`- AG 47 review index verified: ${ag47BatchPlan.proposedBatches.length} batches`)
      console.log(`- AG 47 self-review verified: ${ag47BatchPlan.proposedBatches.length} batches`)
    }
    console.log(`- AG 47 plan verified: ${ag47BatchPlan.proposedBatches.length} batches`)
    if (ag48ReviewArtifactsPresent) {
      console.log(`- AG 48 review index verified: ${ag48BatchPlan.proposedBatches.length} batches`)
      console.log(`- AG 48 self-review verified: ${ag48BatchPlan.proposedBatches.length} batches`)
    }
    console.log(`- AG 48 plan verified: ${ag48BatchPlan.proposedBatches.length} batches`)
    if (ag51ReviewArtifactsPresent) {
      console.log(`- AG 51 review index verified: ${ag51BatchPlan.proposedBatches.length} batches`)
      console.log(`- AG 51 self-review verified: ${ag51BatchPlan.proposedBatches.length} batches`)
    }
    console.log(`- AG 51 plan verified: ${ag51BatchPlan.proposedBatches.length} batches`)
    if (ag53ReviewArtifactsPresent) {
      console.log(`- AG 53 review index verified: ${ag53BatchPlan.proposedBatches.length} batches`)
      console.log(`- AG 53 self-review verified: ${ag53BatchPlan.proposedBatches.length} batches`)
    }
    console.log(`- AG 53 plan verified: ${ag53BatchPlan.proposedBatches.length} batches`)
    if (ag54ReviewArtifactsPresent) {
      console.log(`- AG 54 review index verified: ${ag54BatchPlan.proposedBatches.length} batches`)
      console.log(`- AG 54 self-review verified: ${ag54BatchPlan.proposedBatches.length} batches`)
    }
    console.log(`- AG 54 plan verified: ${ag54BatchPlan.proposedBatches.length} batches`)
  if (ag55ReviewArtifactsPresent) {
    console.log(`- AG 55 review index verified: ${ag55BatchPlan.proposedBatches.length} batches`)
    console.log(`- AG 55 self-review verified: ${ag55BatchPlan.proposedBatches.length} batches`)
  }
  console.log(`- AG 55 plan verified: ${ag55BatchPlan.proposedBatches.length} batches`)
  const reg141BatchIds = reg141BatchPlan.proposedBatches.map((batch) => batch.plannedBatchId)
  const reg141ReviewIndexText = (await exists(paths.reg141ReviewIndexMd))
    ? await readText(paths.reg141ReviewIndexMd)
    : ''
  const reg141SelfReviewText = (await exists(paths.reg141SelfReviewMd))
    ? await readText(paths.reg141SelfReviewMd)
    : ''
  const reg141ReviewIndexReady =
    reg141ReviewIndexText.length > 0 && reg141BatchIds.every((batchId) => reg141ReviewIndexText.includes(batchId))
  const reg141SelfReviewReady =
    reg141SelfReviewText.length > 0 && reg141BatchIds.every((batchId) => reg141SelfReviewText.includes(batchId))
  const reg141ReviewArtifactsPresent = reg141ReviewIndexReady && reg141SelfReviewReady
  if (reg141ReviewIndexReady) {
    console.log(`- Reg 141 review index verified: ${reg141BatchPlan.proposedBatches.length} batches`)
  }
  if (reg141SelfReviewReady) {
    console.log(`- Reg 141 self-review verified: ${reg141BatchPlan.proposedBatches.length} batches`)
  }
  console.log(`- Reg 141 plan verified: ${reg141BatchPlan.proposedBatches.length} batches`)
  await validateReg102PlanMarkdown(paths.reg127ExtractionPlanMd, 'docs/processor/reg127_extraction_plan.md')
  const reg127BatchPlan = await readJson(paths.reg127BatchPlanJson)
  const reg127BatchIds = reg127BatchPlan.proposedBatches.map((batch) => batch.plannedBatchId)
  const reg127ReviewIndexText = (await exists(paths.reg127ReviewIndexMd))
    ? await readText(paths.reg127ReviewIndexMd)
    : ''
  const reg127SelfReviewText = (await exists(paths.reg127SelfReviewMd))
    ? await readText(paths.reg127SelfReviewMd)
    : ''
  const reg127PocSummaryText = (await exists(paths.pocStatusSummaryMd))
    ? await readText(paths.pocStatusSummaryMd)
    : ''
  const reg127ReviewIndexReady =
    reg127ReviewIndexText.length > 0 && reg127BatchIds.every((batchId) => reg127ReviewIndexText.includes(batchId))
  const reg127SelfReviewReady =
    reg127SelfReviewText.length > 0 && reg127BatchIds.every((batchId) => reg127SelfReviewText.includes(batchId))
  const reg127ReviewArtifactsPresent = reg127ReviewIndexReady && reg127SelfReviewReady
  const reg127PocSummaryReady =
    reg127PocSummaryText.includes('docs/review/reg127_review_index.md') &&
    reg127PocSummaryText.includes('docs/review/reg127_self_review.md') &&
    reg127PocSummaryText.includes('87 review indexes')
  if (reg127ReviewArtifactsPresent && !reg127PocSummaryReady) {
    problems.push('docs/review/valuation_regulation_repository_poc_status.md: missing Reg 127 review index reference')
  }
  if (reg127ReviewIndexReady) {
    console.log(`- Reg 127 review index verified: ${reg127BatchPlan.proposedBatches.length} batches`)
  }
  if (reg127SelfReviewReady) {
    console.log(`- Reg 127 self-review verified: ${reg127BatchPlan.proposedBatches.length} batches`)
  }
  console.log(`- Reg 127 plan verified: ${reg127BatchPlan.proposedBatches.length} batches`)
  await validateReg102PlanMarkdown(paths.reg128ExtractionPlanMd, 'docs/processor/reg128_extraction_plan.md')
  const reg128BatchPlan = await readJson(paths.reg128BatchPlanJson)
  const reg128BatchIds = reg128BatchPlan.proposedBatches.map((batch) => batch.plannedBatchId)
  const reg128ReviewIndexText = (await exists(paths.reg128ReviewIndexMd))
    ? await readText(paths.reg128ReviewIndexMd)
    : ''
  const reg128SelfReviewText = (await exists(paths.reg128SelfReviewMd))
    ? await readText(paths.reg128SelfReviewMd)
    : ''
  const reg128PocSummaryText = (await exists(paths.pocStatusSummaryMd))
    ? await readText(paths.pocStatusSummaryMd)
    : ''
  const reg128ReviewIndexReady =
    reg128ReviewIndexText.length > 0 && reg128BatchIds.every((batchId) => reg128ReviewIndexText.includes(batchId))
  const reg128SelfReviewReady =
    reg128SelfReviewText.length > 0 && reg128BatchIds.every((batchId) => reg128SelfReviewText.includes(batchId))
  const reg128ReviewArtifactsPresent = reg128ReviewIndexReady && reg128SelfReviewReady
  const reg128PocSummaryReady =
    reg128PocSummaryText.includes('docs/review/reg128_review_index.md') &&
    reg128PocSummaryText.includes('docs/review/reg128_self_review.md') &&
    reg128PocSummaryText.includes('86 review indexes')
  if (reg128ReviewArtifactsPresent && !reg128PocSummaryReady) {
    problems.push('docs/review/valuation_regulation_repository_poc_status.md: missing Reg 128 review index reference')
  }
  if (reg128ReviewIndexReady) {
    console.log(`- Reg 128 review index verified: ${reg128BatchPlan.proposedBatches.length} batches`)
  }
  if (reg128SelfReviewReady) {
    console.log(`- Reg 128 self-review verified: ${reg128BatchPlan.proposedBatches.length} batches`)
  }
  console.log(`- Reg 128 plan verified: ${reg128BatchPlan.proposedBatches.length} batches`)
  await validateReg102PlanMarkdown(paths.reg102ExtractionPlanMd, 'docs/processor/reg102_extraction_plan.md')
  const reg102BatchPlan = await readJson(paths.reg102BatchPlanJson)
  const reg102BatchIds = reg102BatchPlan.proposedBatches.map((batch) => batch.plannedBatchId)
  const reg102ReviewIndexText = (await exists(paths.reg102ReviewIndexMd))
    ? await readText(paths.reg102ReviewIndexMd)
    : ''
  const reg102SelfReviewText = (await exists(paths.reg102SelfReviewMd))
    ? await readText(paths.reg102SelfReviewMd)
    : ''
  const reg102PocSummaryText = (await exists(paths.pocStatusSummaryMd))
    ? await readText(paths.pocStatusSummaryMd)
    : ''
  const reg102ReviewIndexReady =
    reg102ReviewIndexText.length > 0 && reg102BatchIds.every((batchId) => reg102ReviewIndexText.includes(batchId))
  const reg102SelfReviewReady =
    reg102SelfReviewText.length > 0 && reg102BatchIds.every((batchId) => reg102SelfReviewText.includes(batchId))
  const reg102ReviewArtifactsPresent = reg102ReviewIndexReady && reg102SelfReviewReady
  const reg102PocSummaryReady =
    reg102PocSummaryText.includes('docs/review/reg102_review_index.md') &&
    reg102PocSummaryText.includes('docs/review/reg102_self_review.md') &&
    reg102PocSummaryText.includes('85 review indexes')
  if (reg102ReviewArtifactsPresent && !reg102PocSummaryReady) {
    problems.push('docs/review/valuation_regulation_repository_poc_status.md: missing Reg 102 review index reference')
  }
  if (reg102ReviewIndexReady) {
    console.log(`- Reg 102 review index verified: ${reg102BatchPlan.proposedBatches.length} batches`)
  }
  if (reg102SelfReviewReady) {
    console.log(`- Reg 102 self-review verified: ${reg102BatchPlan.proposedBatches.length} batches`)
  }
  console.log(`- Reg 102 plan verified: ${reg102BatchPlan.proposedBatches.length} batches`)
  await validateReg192PlanMarkdown(paths.reg192ExtractionPlanMd, 'docs/processor/reg192_extraction_plan.md')
  const reg192BatchPlan = await readJson(paths.reg192BatchPlanJson)
  const reg192BatchIds = reg192BatchPlan.proposedBatches.map((batch) => batch.plannedBatchId)
  const reg192ReviewIndexText = (await exists(paths.reg192ReviewIndexMd))
    ? await readText(paths.reg192ReviewIndexMd)
    : ''
  const reg192SelfReviewText = (await exists(paths.reg192SelfReviewMd))
    ? await readText(paths.reg192SelfReviewMd)
    : ''
  const reg192PocSummaryText = (await exists(paths.pocStatusSummaryMd))
    ? await readText(paths.pocStatusSummaryMd)
    : ''
  const reg192ReviewIndexReady =
    reg192ReviewIndexText.length > 0 && reg192BatchIds.every((batchId) => reg192ReviewIndexText.includes(batchId))
  const reg192SelfReviewReady =
    reg192SelfReviewText.length > 0 && reg192BatchIds.every((batchId) => reg192SelfReviewText.includes(batchId))
  const reg192ReviewArtifactsPresent = reg192ReviewIndexReady && reg192SelfReviewReady
  const reg192PocSummaryReady =
    reg192PocSummaryText.includes('docs/review/reg192_review_index.md') &&
    reg192PocSummaryText.includes('docs/review/reg192_self_review.md') &&
    reg192PocSummaryText.includes('84 review indexes')
  if (reg192ReviewArtifactsPresent && !reg192PocSummaryReady) {
    problems.push('docs/review/valuation_regulation_repository_poc_status.md: missing Reg 192 review index reference')
  }
  if (reg192ReviewIndexReady) {
    console.log(`- Reg 192 review index verified: ${reg192BatchPlan.proposedBatches.length} batches`)
  }
  if (reg192SelfReviewReady) {
    console.log(`- Reg 192 self-review verified: ${reg192BatchPlan.proposedBatches.length} batches`)
  }
  console.log(`- Reg 192 plan verified: ${reg192BatchPlan.proposedBatches.length} batches`)
  const reg210BatchPlan = await readJson(paths.reg210BatchPlanJson)
  const reg210BatchIds = reg210BatchPlan.proposedBatches.map((batch) => batch.plannedBatchId)
  const reg210ReviewIndexText = (await exists(paths.reg210ReviewIndexMd))
    ? await readText(paths.reg210ReviewIndexMd)
    : ''
  const reg210SelfReviewText = (await exists(paths.reg210SelfReviewMd))
    ? await readText(paths.reg210SelfReviewMd)
    : ''
  const reg210PocSummaryText = (await exists(paths.pocStatusSummaryMd))
    ? await readText(paths.pocStatusSummaryMd)
    : ''
  const reg210ReviewIndexReady =
    reg210ReviewIndexText.length > 0 && reg210BatchIds.every((batchId) => reg210ReviewIndexText.includes(batchId))
  const reg210SelfReviewReady =
    reg210SelfReviewText.length > 0 && reg210BatchIds.every((batchId) => reg210SelfReviewText.includes(batchId))
  const reg210ReviewArtifactsPresent = reg210ReviewIndexReady && reg210SelfReviewReady
  const reg210PocSummaryReady =
    reg210PocSummaryText.includes('docs/review/reg210_review_index.md') &&
    reg210PocSummaryText.includes('docs/review/reg210_self_review.md')
  if (!reg210PocSummaryReady) {
    problems.push('docs/review/valuation_regulation_repository_poc_status.md: missing Reg 210 review index reference')
  }
  if (reg210ReviewIndexReady) {
    console.log(`- Reg 210 review index verified: ${reg210BatchPlan.proposedBatches.length} batches`)
  }
  if (reg210SelfReviewReady) {
    console.log(`- Reg 210 self-review verified: ${reg210BatchPlan.proposedBatches.length} batches`)
  }
  console.log(`- Reg 210 plan verified: ${reg210BatchPlan.proposedBatches.length} batches`)
  await validateReg213PlanMarkdown(paths.reg213ExtractionPlanMd, 'docs/processor/reg213_extraction_plan.md')
  const reg213BatchPlan = await readJson(paths.reg213BatchPlanJson)
  const reg213BatchIds = reg213BatchPlan.proposedBatches.map((batch) => batch.plannedBatchId)
  const reg213ReviewIndexText = (await exists(paths.reg213ReviewIndexMd))
    ? await readText(paths.reg213ReviewIndexMd)
    : ''
  const reg213SelfReviewText = (await exists(paths.reg213SelfReviewMd))
    ? await readText(paths.reg213SelfReviewMd)
    : ''
  const reg213RegistryReady = reg213BatchIds.every((batchId) =>
    Object.prototype.hasOwnProperty.call(batchDefinitions, batchId),
  )
  if (!reg213RegistryReady) {
    problems.push('scripts/batch-definitions.mjs: missing Reg 213 batch definition coverage')
  }
  if (reg213RegistryReady) {
    console.log(`- Reg 213 registry verified: ${reg213BatchPlan.proposedBatches.length} batches`)
  }
  const reg213ReviewIndexReady =
    reg213ReviewIndexText.length > 0 && reg213BatchIds.every((batchId) => reg213ReviewIndexText.includes(batchId))
  const reg213SelfReviewReady =
    reg213SelfReviewText.length > 0 && reg213BatchIds.every((batchId) => reg213SelfReviewText.includes(batchId))
  const reg213ReviewArtifactsPresent = reg213ReviewIndexReady && reg213SelfReviewReady
  if (reg213ReviewIndexReady) {
    console.log(`- Reg 213 review index verified: ${reg213BatchPlan.proposedBatches.length} batches`)
  }
  if (reg213SelfReviewReady) {
    console.log(`- Reg 213 self-review verified: ${reg213BatchPlan.proposedBatches.length} batches`)
  }
  console.log(`- Reg 213 plan verified: ${reg213BatchPlan.proposedBatches.length} batches`)
  await validateReg213Amendment1FaqPlanMarkdown(
    paths.reg213Amendment1FaqExtractionPlanMd,
    'docs/processor/reg213_amendment1_faq_extraction_plan.md',
  )
  const reg213Amendment1FaqBatchPlan = await readJson(paths.reg213Amendment1FaqBatchPlanJson)
  if (reg213Amendment1FaqBatchPlan.status !== 'planned') {
    problems.push('config/reg213-amendment1-faq-batch-plan.json: status must be planned')
  }
  if (
    !Array.isArray(reg213Amendment1FaqBatchPlan.proposedBatches) ||
    reg213Amendment1FaqBatchPlan.proposedBatches.length !== 3
  ) {
    problems.push('config/reg213-amendment1-faq-batch-plan.json: expected exactly three proposed batches')
  }
  if (
    reg213Amendment1FaqBatchPlan.sourceScope?.confirmedPageRange?.[0] !== 1 ||
    reg213Amendment1FaqBatchPlan.sourceScope?.confirmedPageRange?.[1] !== 3
  ) {
    problems.push('config/reg213-amendment1-faq-batch-plan.json: confirmedPageRange must be [1, 3]')
  }
  const reg213Amendment1FaqBatchIds = Array.isArray(reg213Amendment1FaqBatchPlan.proposedBatches)
    ? reg213Amendment1FaqBatchPlan.proposedBatches
        .map((batch) => batch?.plannedBatchId)
        .filter((batchId) => typeof batchId === 'string' && batchId.length > 0)
    : []
  for (const plannedBatchId of reg213Amendment1FaqBatchIds) {
    if (!batchDefinitions[plannedBatchId]) {
      problems.push(`scripts/batch-definitions.mjs: missing batch definition for ${plannedBatchId}`)
    }
  }
  if (!reg213Amendment1FaqBatchIds.includes('batch-245')) {
    problems.push('config/reg213-amendment1-faq-batch-plan.json: expected batch-245 to be planned')
  }
  if (!reg213Amendment1FaqBatchIds.includes('batch-246')) {
    problems.push('config/reg213-amendment1-faq-batch-plan.json: expected batch-246 to be planned')
  }
  if (!reg213Amendment1FaqBatchIds.includes('batch-247')) {
    problems.push('config/reg213-amendment1-faq-batch-plan.json: expected batch-247 to be planned')
  }
  const reg213Amendment1FaqReviewIndexText = (await exists(paths.reg213Amendment1FaqReviewIndexMd))
    ? await readText(paths.reg213Amendment1FaqReviewIndexMd)
    : ''
  const reg213Amendment1FaqSelfReviewText = (await exists(paths.reg213Amendment1FaqSelfReviewMd))
    ? await readText(paths.reg213Amendment1FaqSelfReviewMd)
    : ''
  const reg213Amendment1FaqReviewIndexReady =
    reg213Amendment1FaqReviewIndexText.length > 0 &&
    reg213Amendment1FaqBatchIds.every((batchId) => reg213Amendment1FaqReviewIndexText.includes(batchId))
  const reg213Amendment1FaqSelfReviewReady =
    reg213Amendment1FaqSelfReviewText.length > 0 &&
    reg213Amendment1FaqBatchIds.every((batchId) => reg213Amendment1FaqSelfReviewText.includes(batchId))
  const reg213Amendment1FaqReviewArtifactsPresent =
    reg213Amendment1FaqReviewIndexReady && reg213Amendment1FaqSelfReviewReady
  if (reg213Amendment1FaqReviewIndexReady) {
    console.log(
      `- Reg 213 Amendment No. 1 FAQ review index verified: ${reg213Amendment1FaqBatchPlan.proposedBatches.length} batches`,
    )
  }
  if (reg213Amendment1FaqSelfReviewReady) {
    console.log(
      `- Reg 213 Amendment No. 1 FAQ self-review verified: ${reg213Amendment1FaqBatchPlan.proposedBatches.length} batches`,
    )
  }
  console.log(
    `- Reg 213 Amendment No. 1 FAQ plan verified: ${reg213Amendment1FaqBatchPlan.proposedBatches.length} batches`,
  )
  await validateReg213Amendment1TextPlanMarkdown(
    paths.reg213Amendment1TextExtractionPlanMd,
    'docs/processor/reg213_amendment1_text_extraction_plan.md',
  )
  const reg213Amendment1TextBatchPlan = await readJson(paths.reg213Amendment1TextBatchPlanJson)
  if (reg213Amendment1TextBatchPlan.status !== 'planned') {
    problems.push('config/reg213-amendment1-text-batch-plan.json: status must be planned')
  }
  if (
    !Array.isArray(reg213Amendment1TextBatchPlan.proposedBatches) ||
    reg213Amendment1TextBatchPlan.proposedBatches.length !== 6
  ) {
    problems.push('config/reg213-amendment1-text-batch-plan.json: expected exactly six proposed batches')
  }
  if (
    reg213Amendment1TextBatchPlan.sourceScope?.confirmedPageRange?.[0] !== 1 ||
    reg213Amendment1TextBatchPlan.sourceScope?.confirmedPageRange?.[1] !== 24
  ) {
    problems.push('config/reg213-amendment1-text-batch-plan.json: confirmedPageRange must be [1, 24]')
  }
  const reg213Amendment1TextBatchIds = Array.isArray(reg213Amendment1TextBatchPlan.proposedBatches)
    ? reg213Amendment1TextBatchPlan.proposedBatches
        .map((batch) => batch?.plannedBatchId)
        .filter((batchId) => typeof batchId === 'string' && batchId.length > 0)
    : []
  for (const plannedBatchId of reg213Amendment1TextBatchIds) {
    if (!batchDefinitions[plannedBatchId]) {
      problems.push(`scripts/batch-definitions.mjs: missing batch definition for ${plannedBatchId}`)
    }
  }
  if (!reg213Amendment1TextBatchIds.includes('batch-260')) {
    problems.push('config/reg213-amendment1-text-batch-plan.json: expected batch-260 to be planned')
  }
  if (!reg213Amendment1TextBatchIds.includes('batch-261')) {
    problems.push('config/reg213-amendment1-text-batch-plan.json: expected batch-261 to be planned')
  }
  if (!reg213Amendment1TextBatchIds.includes('batch-262')) {
    problems.push('config/reg213-amendment1-text-batch-plan.json: expected batch-262 to be planned')
  }
  if (!reg213Amendment1TextBatchIds.includes('batch-263')) {
    problems.push('config/reg213-amendment1-text-batch-plan.json: expected batch-263 to be planned')
  }
  if (!reg213Amendment1TextBatchIds.includes('batch-264')) {
    problems.push('config/reg213-amendment1-text-batch-plan.json: expected batch-264 to be planned')
  }
  if (!reg213Amendment1TextBatchIds.includes('batch-265')) {
    problems.push('config/reg213-amendment1-text-batch-plan.json: expected batch-265 to be planned')
  }
  console.log(
    `- Reg 213 First Amendment plan verified: ${reg213Amendment1TextBatchPlan.proposedBatches.length} batches`,
  )
  const reg213Amendment1TextReviewIndexText = (await exists(paths.reg213Amendment1TextReviewIndexMd))
    ? await readText(paths.reg213Amendment1TextReviewIndexMd)
    : ''
  const reg213Amendment1TextSelfReviewText = (await exists(paths.reg213Amendment1TextSelfReviewMd))
    ? await readText(paths.reg213Amendment1TextSelfReviewMd)
    : ''
  const reg213Amendment1TextReviewIndexReady =
    reg213Amendment1TextReviewIndexText.length > 0 &&
    reg213Amendment1TextBatchIds.every((batchId) => reg213Amendment1TextReviewIndexText.includes(batchId))
  const reg213Amendment1TextSelfReviewReady =
    reg213Amendment1TextSelfReviewText.length > 0 &&
    reg213Amendment1TextBatchIds.every((batchId) => reg213Amendment1TextSelfReviewText.includes(batchId))
  const reg213Amendment1TextReviewArtifactsPresent =
    reg213Amendment1TextReviewIndexReady && reg213Amendment1TextSelfReviewReady
  if (reg213Amendment1TextReviewIndexReady) {
    console.log(
      `- Reg 213 First Amendment review index verified: ${reg213Amendment1TextBatchPlan.proposedBatches.length} batches`,
    )
  }
  if (reg213Amendment1TextSelfReviewReady) {
    console.log(
      `- Reg 213 First Amendment self-review verified: ${reg213Amendment1TextBatchPlan.proposedBatches.length} batches`,
    )
  }
  await validateReg213Amendment2PlanMarkdown(
    paths.reg213Amendment2ExtractionPlanMd,
    'docs/processor/reg213_amendment2_extraction_plan.md',
  )
  const reg213Amendment2BatchPlan = await readJson(paths.reg213Amendment2BatchPlanJson)
  if (reg213Amendment2BatchPlan.status !== 'planned') {
    problems.push('config/reg213-amendment2-batch-plan.json: status must be planned')
  }
  if (
    !Array.isArray(reg213Amendment2BatchPlan.proposedBatches) ||
    reg213Amendment2BatchPlan.proposedBatches.length !== 3
  ) {
    problems.push('config/reg213-amendment2-batch-plan.json: expected exactly three proposed batches')
  }
  if (
    reg213Amendment2BatchPlan.sourceScope?.confirmedPageRange?.[0] !== 1 ||
    reg213Amendment2BatchPlan.sourceScope?.confirmedPageRange?.[1] !== 6
  ) {
    problems.push('config/reg213-amendment2-batch-plan.json: confirmedPageRange must be [1, 6]')
  }
  const reg213Amendment2BatchIds = Array.isArray(reg213Amendment2BatchPlan.proposedBatches)
    ? reg213Amendment2BatchPlan.proposedBatches
        .map((batch) => batch?.plannedBatchId)
        .filter((batchId) => typeof batchId === 'string' && batchId.length > 0)
    : []
  for (const plannedBatchId of reg213Amendment2BatchIds) {
    if (!batchDefinitions[plannedBatchId]) {
      problems.push(`scripts/batch-definitions.mjs: missing batch definition for ${plannedBatchId}`)
    }
  }
  if (!reg213Amendment2BatchIds.includes('batch-257')) {
    problems.push('config/reg213-amendment2-batch-plan.json: expected batch-257 to be planned')
  }
  if (!reg213Amendment2BatchIds.includes('batch-258')) {
    problems.push('config/reg213-amendment2-batch-plan.json: expected batch-258 to be planned')
  }
  if (!reg213Amendment2BatchIds.includes('batch-259')) {
    problems.push('config/reg213-amendment2-batch-plan.json: expected batch-259 to be planned')
  }
  console.log(
    `- Reg 213 Second Amendment plan verified: ${reg213Amendment2BatchPlan.proposedBatches.length} batches`,
  )
  const reg213Amendment2ReviewIndexText = (await exists(paths.reg213Amendment2ReviewIndexMd))
    ? await readText(paths.reg213Amendment2ReviewIndexMd)
    : ''
  const reg213Amendment2SelfReviewText = (await exists(paths.reg213Amendment2SelfReviewMd))
    ? await readText(paths.reg213Amendment2SelfReviewMd)
    : ''
  const reg213Amendment2ReviewIndexReady =
    reg213Amendment2ReviewIndexText.length > 0 &&
    reg213Amendment2BatchIds.every((batchId) => reg213Amendment2ReviewIndexText.includes(batchId))
  const reg213Amendment2SelfReviewReady =
    reg213Amendment2SelfReviewText.length > 0 &&
    reg213Amendment2BatchIds.every((batchId) => reg213Amendment2SelfReviewText.includes(batchId))
  const reg213Amendment2ReviewArtifactsPresent =
    reg213Amendment2ReviewIndexReady && reg213Amendment2SelfReviewReady
  if (reg213Amendment2ReviewIndexReady) {
    console.log(
      `- Reg 213 Second Amendment review index verified: ${reg213Amendment2BatchPlan.proposedBatches.length} batches`,
    )
  }
  if (reg213Amendment2SelfReviewReady) {
    console.log(
      `- Reg 213 Second Amendment self-review verified: ${reg213Amendment2BatchPlan.proposedBatches.length} batches`,
    )
  }
  await validateReg213Amendment3PlanMarkdown(
    paths.reg213Amendment3ExtractionPlanMd,
    'docs/processor/reg213_amendment3_extraction_plan.md',
  )
  const reg213Amendment3BatchPlan = await readJson(paths.reg213Amendment3BatchPlanJson)
  if (reg213Amendment3BatchPlan.status !== 'planned') {
    problems.push('config/reg213-amendment3-batch-plan.json: status must be planned')
  }
  if (
    !Array.isArray(reg213Amendment3BatchPlan.proposedBatches) ||
    reg213Amendment3BatchPlan.proposedBatches.length !== 1
  ) {
    problems.push('config/reg213-amendment3-batch-plan.json: expected exactly one proposed batch')
  }
  if (
    reg213Amendment3BatchPlan.sourceScope?.confirmedPageRange?.[0] !== 1 ||
    reg213Amendment3BatchPlan.sourceScope?.confirmedPageRange?.[1] !== 2
  ) {
    problems.push('config/reg213-amendment3-batch-plan.json: confirmedPageRange must be [1, 2]')
  }
  const reg213Amendment3BatchIds = Array.isArray(reg213Amendment3BatchPlan.proposedBatches)
    ? reg213Amendment3BatchPlan.proposedBatches
        .map((batch) => batch?.plannedBatchId)
        .filter((batchId) => typeof batchId === 'string' && batchId.length > 0)
    : []
  for (const plannedBatchId of reg213Amendment3BatchIds) {
    if (!batchDefinitions[plannedBatchId]) {
      problems.push(`scripts/batch-definitions.mjs: missing batch definition for ${plannedBatchId}`)
    }
  }
  if (!reg213Amendment3BatchIds.includes('batch-254')) {
    problems.push('config/reg213-amendment3-batch-plan.json: expected batch-254 to be planned')
  }
  console.log(
    `- Reg 213 Third Amendment plan verified: ${reg213Amendment3BatchPlan.proposedBatches.length} batches`,
  )
  const reg213Amendment3ReviewIndexText = (await exists(paths.reg213Amendment3ReviewIndexMd))
    ? await readText(paths.reg213Amendment3ReviewIndexMd)
    : ''
  const reg213Amendment3SelfReviewText = (await exists(paths.reg213Amendment3SelfReviewMd))
    ? await readText(paths.reg213Amendment3SelfReviewMd)
    : ''
  const reg213Amendment3ReviewIndexReady =
    reg213Amendment3ReviewIndexText.length > 0 &&
    reg213Amendment3BatchIds.every((batchId) => reg213Amendment3ReviewIndexText.includes(batchId))
  const reg213Amendment3SelfReviewReady =
    reg213Amendment3SelfReviewText.length > 0 &&
    reg213Amendment3BatchIds.every((batchId) => reg213Amendment3SelfReviewText.includes(batchId))
  const reg213Amendment3ReviewArtifactsPresent =
    reg213Amendment3ReviewIndexReady && reg213Amendment3SelfReviewReady
  if (reg213Amendment3ReviewIndexReady) {
    console.log(
      `- Reg 213 Third Amendment review index verified: ${reg213Amendment3BatchPlan.proposedBatches.length} batches`,
    )
  }
  if (reg213Amendment3SelfReviewReady) {
    console.log(
      `- Reg 213 Third Amendment self-review verified: ${reg213Amendment3BatchPlan.proposedBatches.length} batches`,
    )
  }
  await validateReg213Amendment4PlanMarkdown(
    paths.reg213Amendment4ExtractionPlanMd,
    'docs/processor/reg213_amendment4_extraction_plan.md',
  )
  const reg213Amendment4BatchPlan = await readJson(paths.reg213Amendment4BatchPlanJson)
  if (reg213Amendment4BatchPlan.status !== 'planned') {
    problems.push('config/reg213-amendment4-batch-plan.json: status must be planned')
  }
  if (
    !Array.isArray(reg213Amendment4BatchPlan.proposedBatches) ||
    reg213Amendment4BatchPlan.proposedBatches.length !== 2
  ) {
    problems.push('config/reg213-amendment4-batch-plan.json: expected exactly two proposed batches')
  }
  if (
    reg213Amendment4BatchPlan.sourceScope?.confirmedPageRange?.[0] !== 1 ||
    reg213Amendment4BatchPlan.sourceScope?.confirmedPageRange?.[1] !== 3
  ) {
    problems.push('config/reg213-amendment4-batch-plan.json: confirmedPageRange must be [1, 3]')
  }
  const reg213Amendment4BatchIds = Array.isArray(reg213Amendment4BatchPlan.proposedBatches)
    ? reg213Amendment4BatchPlan.proposedBatches
        .map((batch) => batch?.plannedBatchId)
        .filter((batchId) => typeof batchId === 'string' && batchId.length > 0)
    : []
  for (const plannedBatchId of reg213Amendment4BatchIds) {
    if (!batchDefinitions[plannedBatchId]) {
      problems.push(`scripts/batch-definitions.mjs: missing batch definition for ${plannedBatchId}`)
    }
  }
  if (!reg213Amendment4BatchIds.includes('batch-255')) {
    problems.push('config/reg213-amendment4-batch-plan.json: expected batch-255 to be planned')
  }
  if (!reg213Amendment4BatchIds.includes('batch-256')) {
    problems.push('config/reg213-amendment4-batch-plan.json: expected batch-256 to be planned')
  }
  console.log(
    `- Reg 213 Fourth Amendment plan verified: ${reg213Amendment4BatchPlan.proposedBatches.length} batches`,
  )
  const reg213Amendment4ReviewIndexText = (await exists(paths.reg213Amendment4ReviewIndexMd))
    ? await readText(paths.reg213Amendment4ReviewIndexMd)
    : ''
  const reg213Amendment4SelfReviewText = (await exists(paths.reg213Amendment4SelfReviewMd))
    ? await readText(paths.reg213Amendment4SelfReviewMd)
    : ''
  const reg213Amendment4ReviewIndexReady =
    reg213Amendment4ReviewIndexText.length > 0 &&
    reg213Amendment4BatchIds.every((batchId) => reg213Amendment4ReviewIndexText.includes(batchId))
  const reg213Amendment4SelfReviewReady =
    reg213Amendment4SelfReviewText.length > 0 &&
    reg213Amendment4BatchIds.every((batchId) => reg213Amendment4SelfReviewText.includes(batchId))
  const reg213Amendment4ReviewArtifactsPresent =
    reg213Amendment4ReviewIndexReady && reg213Amendment4SelfReviewReady
  if (reg213Amendment4ReviewIndexReady) {
    console.log(
      `- Reg 213 Fourth Amendment review index verified: ${reg213Amendment4BatchPlan.proposedBatches.length} batches`,
    )
  }
  if (reg213Amendment4SelfReviewReady) {
    console.log(
      `- Reg 213 Fourth Amendment self-review verified: ${reg213Amendment4BatchPlan.proposedBatches.length} batches`,
    )
  }
  await validateReg213Amendment6PlanMarkdown(
    paths.reg213Amendment6ExtractionPlanMd,
    'docs/processor/reg213_amendment6_extraction_plan.md',
  )
  const reg213Amendment6BatchPlan = await readJson(paths.reg213Amendment6BatchPlanJson)
  if (reg213Amendment6BatchPlan.status !== 'planned') {
    problems.push('config/reg213-amendment6-batch-plan.json: status must be planned')
  }
  if (
    !Array.isArray(reg213Amendment6BatchPlan.proposedBatches) ||
    reg213Amendment6BatchPlan.proposedBatches.length !== 1
  ) {
    problems.push('config/reg213-amendment6-batch-plan.json: expected exactly one proposed batch')
  }
  if (
    reg213Amendment6BatchPlan.sourceScope?.confirmedPageRange?.[0] !== 1 ||
    reg213Amendment6BatchPlan.sourceScope?.confirmedPageRange?.[1] !== 1
  ) {
    problems.push('config/reg213-amendment6-batch-plan.json: confirmedPageRange must be [1, 1]')
  }
  const reg213Amendment6BatchIds = Array.isArray(reg213Amendment6BatchPlan.proposedBatches)
    ? reg213Amendment6BatchPlan.proposedBatches
        .map((batch) => batch?.plannedBatchId)
        .filter((batchId) => typeof batchId === 'string' && batchId.length > 0)
    : []
  for (const plannedBatchId of reg213Amendment6BatchIds) {
    if (!batchDefinitions[plannedBatchId]) {
      problems.push(`scripts/batch-definitions.mjs: missing batch definition for ${plannedBatchId}`)
    }
  }
  if (!reg213Amendment6BatchIds.includes('batch-248')) {
    problems.push('config/reg213-amendment6-batch-plan.json: expected batch-248 to be planned')
  }
  console.log(
    `- Reg 213 Sixth Amendment plan verified: ${reg213Amendment6BatchPlan.proposedBatches.length} batches`,
  )
  const reg213Amendment6ReviewIndexText = (await exists(paths.reg213Amendment6ReviewIndexMd))
    ? await readText(paths.reg213Amendment6ReviewIndexMd)
    : ''
  const reg213Amendment6SelfReviewText = (await exists(paths.reg213Amendment6SelfReviewMd))
    ? await readText(paths.reg213Amendment6SelfReviewMd)
    : ''
  const reg213Amendment6ReviewIndexReady =
    reg213Amendment6ReviewIndexText.length > 0 &&
    reg213Amendment6BatchIds.every((batchId) => reg213Amendment6ReviewIndexText.includes(batchId))
  const reg213Amendment6SelfReviewReady =
    reg213Amendment6SelfReviewText.length > 0 &&
    reg213Amendment6BatchIds.every((batchId) => reg213Amendment6SelfReviewText.includes(batchId))
  const reg213Amendment6ReviewArtifactsPresent =
    reg213Amendment6ReviewIndexReady && reg213Amendment6SelfReviewReady
  if (reg213Amendment6ReviewIndexReady) {
    console.log(
      `- Reg 213 Sixth Amendment review index verified: ${reg213Amendment6BatchPlan.proposedBatches.length} batches`,
    )
  }
  if (reg213Amendment6SelfReviewReady) {
    console.log(
      `- Reg 213 Sixth Amendment self-review verified: ${reg213Amendment6BatchPlan.proposedBatches.length} batches`,
    )
  }
  await validateReg213Amendment5PlanMarkdown(
    paths.reg213Amendment5ExtractionPlanMd,
    'docs/processor/reg213_amendment5_extraction_plan.md',
  )
  const reg213Amendment5BatchPlan = await readJson(paths.reg213Amendment5BatchPlanJson)
  if (reg213Amendment5BatchPlan.status !== 'planned') {
    problems.push('config/reg213-amendment5-batch-plan.json: status must be planned')
  }
  if (
    !Array.isArray(reg213Amendment5BatchPlan.proposedBatches) ||
    reg213Amendment5BatchPlan.proposedBatches.length !== 2
  ) {
    problems.push('config/reg213-amendment5-batch-plan.json: expected exactly two proposed batches')
  }
  if (
    reg213Amendment5BatchPlan.sourceScope?.confirmedPageRange?.[0] !== 1 ||
    reg213Amendment5BatchPlan.sourceScope?.confirmedPageRange?.[1] !== 2
  ) {
    problems.push('config/reg213-amendment5-batch-plan.json: confirmedPageRange must be [1, 2]')
  }
  const reg213Amendment5BatchIds = Array.isArray(reg213Amendment5BatchPlan.proposedBatches)
    ? reg213Amendment5BatchPlan.proposedBatches
        .map((batch) => batch?.plannedBatchId)
        .filter((batchId) => typeof batchId === 'string' && batchId.length > 0)
    : []
  for (const plannedBatchId of reg213Amendment5BatchIds) {
    if (!batchDefinitions[plannedBatchId]) {
      problems.push(`scripts/batch-definitions.mjs: missing batch definition for ${plannedBatchId}`)
    }
  }
  if (!reg213Amendment5BatchIds.includes('batch-249')) {
    problems.push('config/reg213-amendment5-batch-plan.json: expected batch-249 to be planned')
  }
  if (!reg213Amendment5BatchIds.includes('batch-250')) {
    problems.push('config/reg213-amendment5-batch-plan.json: expected batch-250 to be planned')
  }
  console.log(
    `- Reg 213 Fifth Amendment plan verified: ${reg213Amendment5BatchPlan.proposedBatches.length} batches`,
  )
  const reg213Amendment5ReviewIndexText = (await exists(paths.reg213Amendment5ReviewIndexMd))
    ? await readText(paths.reg213Amendment5ReviewIndexMd)
    : ''
  const reg213Amendment5SelfReviewText = (await exists(paths.reg213Amendment5SelfReviewMd))
    ? await readText(paths.reg213Amendment5SelfReviewMd)
    : ''
  const reg213Amendment5ReviewIndexReady =
    reg213Amendment5ReviewIndexText.length > 0 &&
    reg213Amendment5BatchIds.every((batchId) => reg213Amendment5ReviewIndexText.includes(batchId))
  const reg213Amendment5SelfReviewReady =
    reg213Amendment5SelfReviewText.length > 0 &&
    reg213Amendment5BatchIds.every((batchId) => reg213Amendment5SelfReviewText.includes(batchId))
  const reg213Amendment5ReviewArtifactsPresent =
    reg213Amendment5ReviewIndexReady && reg213Amendment5SelfReviewReady
  if (reg213Amendment5ReviewIndexReady) {
    console.log(
      `- Reg 213 Fifth Amendment review index verified: ${reg213Amendment5BatchPlan.proposedBatches.length} batches`,
    )
  }
  if (reg213Amendment5SelfReviewReady) {
    console.log(
      `- Reg 213 Fifth Amendment self-review verified: ${reg213Amendment5BatchPlan.proposedBatches.length} batches`,
    )
  }
  await validateLhmanual26PlanMarkdown(
    paths.lhmanual26ExtractionPlanMd,
    'docs/processor/lhmanual26_extraction_plan.md',
  )
  const lhmanual26BatchPlan = await readJson(paths.lhmanual26BatchPlanJson)
  if (lhmanual26BatchPlan.status !== 'planned') {
    problems.push('config/lhmanual26-batch-plan.json: status must be planned')
  }
  if (!Array.isArray(lhmanual26BatchPlan.proposedBatches) || lhmanual26BatchPlan.proposedBatches.length !== 3) {
    problems.push('config/lhmanual26-batch-plan.json: expected exactly three proposed batches')
  }
  if (
    lhmanual26BatchPlan.sourceScope?.confirmedPageRange?.[0] !== 1 ||
    lhmanual26BatchPlan.sourceScope?.confirmedPageRange?.[1] !== 30
  ) {
    problems.push('config/lhmanual26-batch-plan.json: confirmedPageRange must be [1, 30]')
  }
  const lhmanual26BatchIds = Array.isArray(lhmanual26BatchPlan.proposedBatches)
    ? lhmanual26BatchPlan.proposedBatches
        .map((batch) => batch?.plannedBatchId)
        .filter((batchId) => typeof batchId === 'string' && batchId.length > 0)
    : []
  for (const plannedBatchId of lhmanual26BatchIds) {
    if (!batchDefinitions[plannedBatchId]) {
      problems.push(`scripts/batch-definitions.mjs: missing batch definition for ${plannedBatchId}`)
    }
  }
  if (!lhmanual26BatchIds.includes('batch-251')) {
    problems.push('config/lhmanual26-batch-plan.json: expected batch-251 to be planned')
  }
  if (!lhmanual26BatchIds.includes('batch-252')) {
    problems.push('config/lhmanual26-batch-plan.json: expected batch-252 to be planned')
  }
  if (!lhmanual26BatchIds.includes('batch-253')) {
    problems.push('config/lhmanual26-batch-plan.json: expected batch-253 to be planned')
  }
  console.log(
    `- Life & Health Valuation Law Manual plan verified: ${lhmanual26BatchPlan.proposedBatches.length} batches`,
  )
  const lhmanual26ReviewIndexText = (await exists(paths.lhmanual26ReviewIndexMd))
    ? await readText(paths.lhmanual26ReviewIndexMd)
    : ''
  const lhmanual26SelfReviewText = (await exists(paths.lhmanual26SelfReviewMd))
    ? await readText(paths.lhmanual26SelfReviewMd)
    : ''
  const lhmanual26ReviewIndexReady =
    lhmanual26ReviewIndexText.length > 0 &&
    lhmanual26BatchIds.every((batchId) => lhmanual26ReviewIndexText.includes(batchId))
  const lhmanual26SelfReviewReady =
    lhmanual26SelfReviewText.length > 0 &&
    lhmanual26BatchIds.every((batchId) => lhmanual26SelfReviewText.includes(batchId))
  const lhmanual26ReviewArtifactsPresent = lhmanual26ReviewIndexReady && lhmanual26SelfReviewReady
  if (lhmanual26ReviewIndexReady) {
    console.log(
      `- Life & Health Valuation Law Manual review index verified: ${lhmanual26BatchPlan.proposedBatches.length} batches`,
    )
  }
  if (lhmanual26SelfReviewReady) {
    console.log(
      `- Life & Health Valuation Law Manual self-review verified: ${lhmanual26BatchPlan.proposedBatches.length} batches`,
    )
  }
  const modelGovernanceBatchIds = modelGovernancePracticeNoteBatchPlan.proposedBatches.map((batch) => batch.plannedBatchId)
  const modelGovernanceReviewIndexText = (await exists(paths.modelGovernancePracticeNoteReviewIndexMd))
    ? await readText(paths.modelGovernancePracticeNoteReviewIndexMd)
    : ''
  const modelGovernanceSelfReviewText = (await exists(paths.modelGovernancePracticeNoteSelfReviewMd))
    ? await readText(paths.modelGovernancePracticeNoteSelfReviewMd)
    : ''
  const modelGovernanceReviewIndexReady =
    modelGovernanceReviewIndexText.length > 0 &&
    modelGovernanceBatchIds.every((batchId) => modelGovernanceReviewIndexText.includes(batchId))
  const modelGovernanceSelfReviewReady =
    modelGovernanceSelfReviewText.length > 0 &&
    modelGovernanceBatchIds.every((batchId) => modelGovernanceSelfReviewText.includes(batchId))
  const modelGovernanceReviewArtifactsPresent =
    modelGovernanceReviewIndexReady && modelGovernanceSelfReviewReady
  if (modelGovernanceReviewIndexReady) {
    console.log(
      `- Model governance review index verified: ${modelGovernancePracticeNoteBatchPlan.proposedBatches.length} batches`,
    )
  }
  if (modelGovernanceSelfReviewReady) {
    console.log(
      `- Model governance self-review verified: ${modelGovernancePracticeNoteBatchPlan.proposedBatches.length} batches`,
    )
  }
  console.log(`- Model governance plan verified: ${modelGovernancePracticeNoteBatchPlan.proposedBatches.length} batches`)
  await validateLifeReinsuranceReserveCreditPracticeNotePlanMarkdown(
    paths.lifeReinsuranceReserveCreditPracticeNoteExtractionPlanMd,
    'docs/processor/life_reinsurance_reserve_credit_practice_note_extraction_plan.md',
  )
  const lifeReinsuranceReserveCreditPracticeNoteBatchPlan = await readJson(
    paths.lifeReinsuranceReserveCreditPracticeNoteBatchPlanJson,
  )
  validateLifeReinsuranceReserveCreditPracticeNotePlanLike(
    lifeReinsuranceReserveCreditPracticeNoteBatchPlan,
    'config/life-reinsurance-reserve-credit-practice-note-batch-plan.json',
  )
  const lifeReinsuranceReserveCreditPracticeNoteBatchIds =
    lifeReinsuranceReserveCreditPracticeNoteBatchPlan.proposedBatches.map((batch) => batch.plannedBatchId)
  const lifeReinsuranceReserveCreditPracticeNoteReviewIndexText = (await exists(
    paths.lifeReinsuranceReserveCreditPracticeNoteReviewIndexMd,
  ))
    ? await readText(paths.lifeReinsuranceReserveCreditPracticeNoteReviewIndexMd)
    : ''
  const lifeReinsuranceReserveCreditPracticeNoteSelfReviewText = (await exists(
    paths.lifeReinsuranceReserveCreditPracticeNoteSelfReviewMd,
  ))
    ? await readText(paths.lifeReinsuranceReserveCreditPracticeNoteSelfReviewMd)
    : ''
  const lifeReinsuranceReserveCreditPracticeNoteReviewIndexReady =
    lifeReinsuranceReserveCreditPracticeNoteReviewIndexText.length > 0 &&
    lifeReinsuranceReserveCreditPracticeNoteBatchIds.every((batchId) =>
      lifeReinsuranceReserveCreditPracticeNoteReviewIndexText.includes(batchId),
    )
  const lifeReinsuranceReserveCreditPracticeNoteSelfReviewReady =
    lifeReinsuranceReserveCreditPracticeNoteSelfReviewText.length > 0 &&
    lifeReinsuranceReserveCreditPracticeNoteBatchIds.every((batchId) =>
      lifeReinsuranceReserveCreditPracticeNoteSelfReviewText.includes(batchId),
    )
  const lifeReinsuranceReserveCreditPracticeNoteReviewArtifactsPresent =
    lifeReinsuranceReserveCreditPracticeNoteReviewIndexReady &&
    lifeReinsuranceReserveCreditPracticeNoteSelfReviewReady
  if (lifeReinsuranceReserveCreditPracticeNoteReviewIndexReady) {
    console.log(
      `- Life reinsurance practice-note review index verified: ${lifeReinsuranceReserveCreditPracticeNoteBatchPlan.proposedBatches.length} batches`,
    )
  }
  if (lifeReinsuranceReserveCreditPracticeNoteSelfReviewReady) {
    console.log(
      `- Life reinsurance practice-note self-review verified: ${lifeReinsuranceReserveCreditPracticeNoteBatchPlan.proposedBatches.length} batches`,
    )
  }
  console.log(
    `- Life reinsurance practice-note plan verified: ${lifeReinsuranceReserveCreditPracticeNoteBatchPlan.proposedBatches.length} batches`,
  )
  await validateAssetAdequacyAnalysisPracticeNotePlanMarkdown(
    paths.assetAdequacyAnalysisPracticeNoteExtractionPlanMd,
    'docs/processor/asset_adequacy_analysis_extraction_plan.md',
  )
  const assetAdequacyAnalysisPracticeNoteBatchPlan = await readJson(
    paths.assetAdequacyAnalysisPracticeNoteBatchPlanJson,
  )
  validateAssetAdequacyAnalysisPracticeNotePlanLike(
    assetAdequacyAnalysisPracticeNoteBatchPlan,
    'config/asset-adequacy-analysis-batch-plan.json',
  )
  console.log(
    `- Asset adequacy analysis practice-note plan verified: ${assetAdequacyAnalysisPracticeNoteBatchPlan.proposedBatches.length} batches`,
  )
  const assetAdequacyAnalysisPracticeNoteReviewIndexText = (await exists(
    paths.assetAdequacyAnalysisPracticeNoteReviewIndexMd,
  ))
    ? await readText(paths.assetAdequacyAnalysisPracticeNoteReviewIndexMd)
    : ''
  const assetAdequacyAnalysisPracticeNoteSelfReviewText = (await exists(
    paths.assetAdequacyAnalysisPracticeNoteSelfReviewMd,
  ))
    ? await readText(paths.assetAdequacyAnalysisPracticeNoteSelfReviewMd)
    : ''
  const assetAdequacyAnalysisPracticeNoteBatchIds = [
    'batch-216',
    'batch-217',
    'batch-218',
    'batch-219',
    'batch-220',
    'batch-221',
  ]
  const assetAdequacyAnalysisPracticeNoteReviewIndexReady =
    assetAdequacyAnalysisPracticeNoteReviewIndexText.length > 0 &&
    assetAdequacyAnalysisPracticeNoteBatchIds.every((batchId) =>
      assetAdequacyAnalysisPracticeNoteReviewIndexText.includes(batchId),
    )
  const assetAdequacyAnalysisPracticeNoteSelfReviewReady =
    assetAdequacyAnalysisPracticeNoteSelfReviewText.length > 0 &&
    assetAdequacyAnalysisPracticeNoteBatchIds.every((batchId) =>
      assetAdequacyAnalysisPracticeNoteSelfReviewText.includes(batchId),
    )
  const assetAdequacyAnalysisPracticeNoteReviewArtifactsPresent =
    assetAdequacyAnalysisPracticeNoteReviewIndexReady &&
    assetAdequacyAnalysisPracticeNoteSelfReviewReady
  if (assetAdequacyAnalysisPracticeNoteReviewIndexReady) {
    console.log(
      `- Asset adequacy analysis practice-note review index verified: ${assetAdequacyAnalysisPracticeNoteBatchIds.length} batches`,
    )
  }
  if (assetAdequacyAnalysisPracticeNoteSelfReviewReady) {
    console.log(
      `- Asset adequacy analysis practice-note self-review verified: ${assetAdequacyAnalysisPracticeNoteBatchIds.length} batches`,
    )
  }
  const actuarialMemorandumPracticeNotePlanText = (await exists(
    paths.actuarialMemorandumPracticeNoteExtractionPlanMd,
  ))
    ? await readText(paths.actuarialMemorandumPracticeNoteExtractionPlanMd)
    : ''
  if (!actuarialMemorandumPracticeNotePlanText) {
    problems.push(
      'docs/processor/actuarial_memorandum_practice_note_extraction_plan.md: missing Actuarial Memorandum practice-note plan',
    )
  }
  const actuarialMemorandumPracticeNoteBatchPlan = await readJson(
    paths.actuarialMemorandumPracticeNoteBatchPlanJson,
  )
  const actuarialMemorandumPracticeNoteBatchIds = actuarialMemorandumPracticeNoteBatchPlan.proposedBatches.map(
    (batch) => batch.plannedBatchId,
  )
  const actuarialMemorandumPracticeNoteRegistryReady = actuarialMemorandumPracticeNoteBatchIds.every((batchId) =>
    Object.prototype.hasOwnProperty.call(batchDefinitions, batchId),
  )
  if (!actuarialMemorandumPracticeNoteRegistryReady) {
    problems.push(
      'scripts/batch-definitions.mjs: missing Actuarial Memorandum practice-note batch definition coverage',
    )
  }
  if (actuarialMemorandumPracticeNoteRegistryReady) {
    console.log(
      `- Actuarial memorandum practice-note registry verified: ${actuarialMemorandumPracticeNoteBatchPlan.proposedBatches.length} batches`,
    )
  }
  const actuarialMemorandumPracticeNoteReviewIndexText = (await exists(
    paths.actuarialMemorandumPracticeNoteReviewIndexMd,
  ))
    ? await readText(paths.actuarialMemorandumPracticeNoteReviewIndexMd)
    : ''
  const actuarialMemorandumPracticeNoteSelfReviewText = (await exists(
    paths.actuarialMemorandumPracticeNoteSelfReviewMd,
  ))
    ? await readText(paths.actuarialMemorandumPracticeNoteSelfReviewMd)
    : ''
  const actuarialMemorandumPracticeNoteReviewIndexReady =
    actuarialMemorandumPracticeNoteReviewIndexText.length > 0 &&
    actuarialMemorandumPracticeNoteBatchIds.every((batchId) =>
      actuarialMemorandumPracticeNoteReviewIndexText.includes(batchId),
    )
  const actuarialMemorandumPracticeNoteSelfReviewReady =
    actuarialMemorandumPracticeNoteSelfReviewText.length > 0 &&
    actuarialMemorandumPracticeNoteBatchIds.every((batchId) =>
      actuarialMemorandumPracticeNoteSelfReviewText.includes(batchId),
    )
  const actuarialMemorandumPracticeNoteReviewArtifactsPresent =
    actuarialMemorandumPracticeNoteReviewIndexReady && actuarialMemorandumPracticeNoteSelfReviewReady
  if (actuarialMemorandumPracticeNoteReviewIndexReady) {
    console.log(
      `- Actuarial memorandum practice-note review index verified: ${actuarialMemorandumPracticeNoteBatchPlan.proposedBatches.length} batches`,
    )
  }
  if (actuarialMemorandumPracticeNoteSelfReviewReady) {
    console.log(
      `- Actuarial memorandum practice-note self-review verified: ${actuarialMemorandumPracticeNoteBatchPlan.proposedBatches.length} batches`,
    )
  }
  console.log(
    `- Actuarial memorandum practice-note plan verified: ${actuarialMemorandumPracticeNoteBatchPlan.proposedBatches.length} batches`,
  )
  await validatePracticeNotePlanMarkdown(
    paths.c3Phase2PracticeNoteExtractionPlanMd,
    'docs/processor/c3_phase_2_practice_note_extraction_plan.md',
  )
  const c3Phase2PracticeNoteBatchPlan = await readJson(paths.c3Phase2PracticeNoteBatchPlanJson)
  const c3Phase2PracticeNoteBatchIds = c3Phase2PracticeNoteBatchPlan.proposedBatches.map((batch) => batch.plannedBatchId)
  const c3Phase2PracticeNoteRegistryReady = c3Phase2PracticeNoteBatchIds.every((batchId) =>
    Object.prototype.hasOwnProperty.call(batchDefinitions, batchId),
  )
  if (!c3Phase2PracticeNoteRegistryReady) {
    problems.push('scripts/c3-phase-2-practice-note-batch-definitions.mjs: missing C3 Phase 2 practice-note batch registry entries')
  }
  if (c3Phase2PracticeNoteRegistryReady) {
    console.log(
      `- C3 Phase 2 practice-note registry verified: ${c3Phase2PracticeNoteBatchPlan.proposedBatches.length} batches`,
    )
  }
  const c3Phase2PracticeNoteReviewIndexText = (await exists(paths.c3Phase2PracticeNoteReviewIndexMd))
    ? await readText(paths.c3Phase2PracticeNoteReviewIndexMd)
    : ''
  const c3Phase2PracticeNoteSelfReviewText = (await exists(paths.c3Phase2PracticeNoteSelfReviewMd))
    ? await readText(paths.c3Phase2PracticeNoteSelfReviewMd)
    : ''
  const c3Phase2PracticeNoteReviewIndexReady =
    c3Phase2PracticeNoteReviewIndexText.length > 0 &&
    c3Phase2PracticeNoteBatchIds.every((batchId) => c3Phase2PracticeNoteReviewIndexText.includes(batchId))
  const c3Phase2PracticeNoteSelfReviewReady =
    c3Phase2PracticeNoteSelfReviewText.length > 0 &&
    c3Phase2PracticeNoteBatchIds.every((batchId) => c3Phase2PracticeNoteSelfReviewText.includes(batchId))
  const c3Phase2PracticeNoteReviewArtifactsPresent =
    c3Phase2PracticeNoteReviewIndexReady && c3Phase2PracticeNoteSelfReviewReady
  if (c3Phase2PracticeNoteReviewIndexReady) {
    console.log(
      `- C3 Phase 2 practice-note review index verified: ${c3Phase2PracticeNoteBatchPlan.proposedBatches.length} batches`,
    )
  }
  if (c3Phase2PracticeNoteSelfReviewReady) {
    console.log(
      `- C3 Phase 2 practice-note self-review verified: ${c3Phase2PracticeNoteBatchPlan.proposedBatches.length} batches`,
    )
  }
  console.log(
    `- C3 Phase 2 practice-note plan verified: ${c3Phase2PracticeNoteBatchPlan.proposedBatches.length} batches`,
  )
  await validatePracticeNotePlanMarkdown(
    paths.c3Phase2Ag43March2011PracticeNoteExtractionPlanMd,
    'docs/processor/c3_phase_2_ag43_2011_practice_note_extraction_plan.md',
  )
  const c3Phase2Ag43March2011PracticeNoteBatchPlan = await readJson(
    paths.c3Phase2Ag43March2011PracticeNoteBatchPlanJson,
  )
  const c3Phase2Ag43March2011PracticeNoteBatchIds =
    c3Phase2Ag43March2011PracticeNoteBatchPlan.proposedBatches.map((batch) => batch.plannedBatchId)
  const c3Phase2Ag43March2011PracticeNoteRegistryReady =
    c3Phase2Ag43March2011PracticeNoteBatchIds.every((batchId) =>
      Object.prototype.hasOwnProperty.call(batchDefinitions, batchId),
    )
  if (!c3Phase2Ag43March2011PracticeNoteRegistryReady) {
    problems.push(
      'scripts/c3-phase-2-ag43-2011-practice-note-batch-definitions.mjs: missing C3 Phase 2 / AG 43 March 2011 practice-note batch registry entries',
    )
  }
  if (c3Phase2Ag43March2011PracticeNoteRegistryReady) {
    console.log(
      `- C3 Phase 2 / AG 43 March 2011 practice-note registry verified: ${c3Phase2Ag43March2011PracticeNoteBatchPlan.proposedBatches.length} batches`,
    )
  }
  const c3Phase2Ag43March2011PracticeNoteReviewIndexText = (await exists(
    paths.c3Phase2Ag43March2011PracticeNoteReviewIndexMd,
  ))
    ? await readText(paths.c3Phase2Ag43March2011PracticeNoteReviewIndexMd)
    : ''
  const c3Phase2Ag43March2011PracticeNoteSelfReviewText = (await exists(
    paths.c3Phase2Ag43March2011PracticeNoteSelfReviewMd,
  ))
    ? await readText(paths.c3Phase2Ag43March2011PracticeNoteSelfReviewMd)
    : ''
  const c3Phase2Ag43March2011PracticeNoteReviewIndexReady =
    c3Phase2Ag43March2011PracticeNoteReviewIndexText.length > 0 &&
    c3Phase2Ag43March2011PracticeNoteBatchIds.every((batchId) =>
      c3Phase2Ag43March2011PracticeNoteReviewIndexText.includes(batchId),
    )
  const c3Phase2Ag43March2011PracticeNoteSelfReviewReady =
    c3Phase2Ag43March2011PracticeNoteSelfReviewText.length > 0 &&
    c3Phase2Ag43March2011PracticeNoteBatchIds.every((batchId) =>
      c3Phase2Ag43March2011PracticeNoteSelfReviewText.includes(batchId),
    )
  const c3Phase2Ag43March2011PracticeNoteReviewArtifactsPresent =
    c3Phase2Ag43March2011PracticeNoteReviewIndexReady &&
    c3Phase2Ag43March2011PracticeNoteSelfReviewReady
  if (c3Phase2Ag43March2011PracticeNoteReviewIndexReady) {
    console.log(
      `- C3 Phase 2 / AG 43 March 2011 practice-note review index verified: ${c3Phase2Ag43March2011PracticeNoteBatchPlan.proposedBatches.length} batches`,
    )
  }
  if (c3Phase2Ag43March2011PracticeNoteSelfReviewReady) {
    console.log(
      `- C3 Phase 2 / AG 43 March 2011 practice-note self-review verified: ${c3Phase2Ag43March2011PracticeNoteBatchPlan.proposedBatches.length} batches`,
    )
  }
  console.log(
    `- C3 Phase 2 / AG 43 March 2011 practice-note plan verified: ${c3Phase2Ag43March2011PracticeNoteBatchPlan.proposedBatches.length} batches`,
  )
  await validateCia2022CapitalFCTEducationalNotePlanMarkdown(
    paths.cia2022CapitalFCTEducationalNoteExtractionPlanMd,
    'docs/processor/cia_2022_capital_fct_educational_note_extraction_plan.md',
  )
  const cia2022CapitalFCTEducationalNoteBatchPlan = await readJson(
    paths.cia2022CapitalFCTEducationalNoteBatchPlanJson,
  )
  validateCia2022CapitalFCTEducationalNotePlanLike(
    cia2022CapitalFCTEducationalNoteBatchPlan,
    'config/cia-2022-capital-fct-educational-note-batch-plan.json',
  )
  const cia2022CapitalFCTEducationalNoteBatchIds =
    cia2022CapitalFCTEducationalNoteBatchPlan.proposedBatches.map((batch) => batch.plannedBatchId)
  const cia2022CapitalFCTEducationalNoteReviewIndexText = (await exists(
    paths.cia2022CapitalFCTEducationalNoteReviewIndexMd,
  ))
    ? await readText(paths.cia2022CapitalFCTEducationalNoteReviewIndexMd)
    : ''
  const cia2022CapitalFCTEducationalNoteSelfReviewText = (await exists(
    paths.cia2022CapitalFCTEducationalNoteSelfReviewMd,
  ))
    ? await readText(paths.cia2022CapitalFCTEducationalNoteSelfReviewMd)
    : ''
  const cia2022CapitalFCTEducationalNoteReviewIndexReady =
    cia2022CapitalFCTEducationalNoteReviewIndexText.length > 0 &&
    cia2022CapitalFCTEducationalNoteBatchIds.every((batchId) =>
      cia2022CapitalFCTEducationalNoteReviewIndexText.includes(batchId),
    )
  const cia2022CapitalFCTEducationalNoteSelfReviewReady =
    cia2022CapitalFCTEducationalNoteSelfReviewText.length > 0 &&
    cia2022CapitalFCTEducationalNoteBatchIds.every((batchId) =>
      cia2022CapitalFCTEducationalNoteSelfReviewText.includes(batchId),
    )
  const cia2022CapitalFCTEducationalNoteReviewArtifactsPresent =
    cia2022CapitalFCTEducationalNoteReviewIndexReady &&
    cia2022CapitalFCTEducationalNoteSelfReviewReady
  if (cia2022CapitalFCTEducationalNoteReviewIndexReady) {
    console.log(
      `- CIA 2022 capital/FCT educational note review index verified: ${cia2022CapitalFCTEducationalNoteBatchPlan.proposedBatches.length} batches`,
    )
  }
  if (cia2022CapitalFCTEducationalNoteSelfReviewReady) {
    console.log(
      `- CIA 2022 capital/FCT educational note self-review verified: ${cia2022CapitalFCTEducationalNoteBatchPlan.proposedBatches.length} batches`,
    )
  }
  console.log(
    `- CIA 2022 capital/FCT educational note plan verified: ${cia2022CapitalFCTEducationalNoteBatchPlan.proposedBatches.length} batches`,
  )
  await validateCia2023FinancialConditionTestingEducationalNotePlanMarkdown(
    paths.cia2023FinancialConditionTestingEducationalNoteExtractionPlanMd,
    'docs/processor/cia_2023_financial_condition_testing_educational_note_extraction_plan.md',
  )
  const cia2023FinancialConditionTestingEducationalNoteBatchPlan = await readJson(
    paths.cia2023FinancialConditionTestingEducationalNoteBatchPlanJson,
  )
  validateCia2023FinancialConditionTestingEducationalNotePlanLike(
    cia2023FinancialConditionTestingEducationalNoteBatchPlan,
    'config/cia-2023-financial-condition-testing-educational-note-batch-plan.json',
  )
  const cia2023FinancialConditionTestingEducationalNoteBatchIds =
    cia2023FinancialConditionTestingEducationalNoteBatchPlan.proposedBatches.map(
      (batch) => batch.plannedBatchId,
    )
  const cia2023FinancialConditionTestingEducationalNoteReviewIndexText = (await exists(
    paths.cia2023FinancialConditionTestingEducationalNoteReviewIndexMd,
  ))
    ? await readText(paths.cia2023FinancialConditionTestingEducationalNoteReviewIndexMd)
    : ''
  const cia2023FinancialConditionTestingEducationalNoteSelfReviewText = (await exists(
    paths.cia2023FinancialConditionTestingEducationalNoteSelfReviewMd,
  ))
    ? await readText(paths.cia2023FinancialConditionTestingEducationalNoteSelfReviewMd)
    : ''
  const cia2023FinancialConditionTestingEducationalNoteReviewIndexReady =
    cia2023FinancialConditionTestingEducationalNoteReviewIndexText.length > 0 &&
    cia2023FinancialConditionTestingEducationalNoteBatchIds.every((batchId) =>
      cia2023FinancialConditionTestingEducationalNoteReviewIndexText.includes(batchId),
    )
  const cia2023FinancialConditionTestingEducationalNoteSelfReviewReady =
    cia2023FinancialConditionTestingEducationalNoteSelfReviewText.length > 0 &&
    cia2023FinancialConditionTestingEducationalNoteBatchIds.every((batchId) =>
      cia2023FinancialConditionTestingEducationalNoteSelfReviewText.includes(batchId),
    )
  const cia2023FinancialConditionTestingEducationalNoteReviewArtifactsPresent =
    cia2023FinancialConditionTestingEducationalNoteReviewIndexReady &&
    cia2023FinancialConditionTestingEducationalNoteSelfReviewReady
  if (cia2023FinancialConditionTestingEducationalNoteReviewIndexReady) {
    console.log(
      `- CIA 2023 financial condition testing educational note review index verified: ${cia2023FinancialConditionTestingEducationalNoteBatchPlan.proposedBatches.length} batches`,
    )
  }
  if (cia2023FinancialConditionTestingEducationalNoteSelfReviewReady) {
    console.log(
      `- CIA 2023 financial condition testing educational note self-review verified: ${cia2023FinancialConditionTestingEducationalNoteBatchPlan.proposedBatches.length} batches`,
    )
  }
  console.log(
    `- CIA 2023 financial condition testing educational note plan verified: ${cia2023FinancialConditionTestingEducationalNoteBatchPlan.proposedBatches.length} batches`,
  )
  await validateModelRegulationXXXPracticeNotePlanMarkdown(
    paths.modelRegulationXXXPracticeNoteExtractionPlanMd,
    'docs/processor/model_regulation_xxx_practice_note_extraction_plan.md',
  )
  const modelRegulationXXXBatchPlan = await readJson(paths.modelRegulationXXXPracticeNoteBatchPlanJson)
  validateModelRegulationXXXPracticeNotePlanLike(
    modelRegulationXXXBatchPlan,
    'config/model-regulation-xxx-practice-note-batch-plan.json',
  )
  const modelRegulationXXXBatchIds = modelRegulationXXXBatchPlan.proposedBatches.map(
    (batch) => batch.plannedBatchId,
  )
  const modelRegulationXXXReviewIndexText = (await exists(paths.modelRegulationXXXPracticeNoteReviewIndexMd))
    ? await readText(paths.modelRegulationXXXPracticeNoteReviewIndexMd)
    : ''
  const modelRegulationXXXSelfReviewText = (await exists(paths.modelRegulationXXXPracticeNoteSelfReviewMd))
    ? await readText(paths.modelRegulationXXXPracticeNoteSelfReviewMd)
    : ''
  const modelRegulationXXXReviewIndexReady =
    modelRegulationXXXReviewIndexText.length > 0 &&
    modelRegulationXXXBatchIds.every((batchId) => modelRegulationXXXReviewIndexText.includes(batchId))
  const modelRegulationXXXSelfReviewReady =
    modelRegulationXXXSelfReviewText.length > 0 &&
    modelRegulationXXXBatchIds.every((batchId) => modelRegulationXXXSelfReviewText.includes(batchId))
  const modelRegulationXXXReviewArtifactsPresent =
    modelRegulationXXXReviewIndexReady && modelRegulationXXXSelfReviewReady
  if (modelRegulationXXXReviewIndexReady) {
    console.log(
      `- Model Regulation XXX review index verified: ${modelRegulationXXXBatchPlan.proposedBatches.length} batches`,
    )
  }
  if (modelRegulationXXXSelfReviewReady) {
    console.log(
      `- Model Regulation XXX self-review verified: ${modelRegulationXXXBatchPlan.proposedBatches.length} batches`,
    )
  }
  console.log(`- Model Regulation XXX plan verified: ${modelRegulationXXXBatchPlan.proposedBatches.length} batches`)
  console.log(
    `- POC status summary verified: ${reg127ReviewArtifactsPresent ? 87 : reg128ReviewArtifactsPresent ? 86 : reg102ReviewArtifactsPresent ? 85 : reg213Amendment1TextReviewArtifactsPresent ? 84 : reg213Amendment2ReviewArtifactsPresent ? 82 : reg213Amendment4ReviewArtifactsPresent ? 81 : reg213Amendment3ReviewArtifactsPresent ? 80 : lhmanual26ReviewArtifactsPresent ? 79 : reg213Amendment5ReviewArtifactsPresent ? 78 : reg213Amendment6ReviewArtifactsPresent ? 77 : reg213Amendment1FaqReviewArtifactsPresent ? 76 : c3Phase2Ag43March2011PracticeNoteReviewArtifactsPresent ? 75 : c3Phase2PracticeNoteReviewArtifactsPresent ? 74 : assetAdequacyAnalysisPracticeNoteReviewArtifactsPresent ? 73 : cia2023FinancialConditionTestingEducationalNoteReviewArtifactsPresent ? 72 : cia2022CapitalFCTEducationalNoteReviewArtifactsPresent ? 71 : actuarialMemorandumPracticeNoteReviewArtifactsPresent ? 70 : lifeReinsuranceReserveCreditPracticeNoteReviewArtifactsPresent ? 69 : modelRegulationXXXReviewArtifactsPresent ? 68 : reg213ReviewArtifactsPresent ? 66 : reg210ReviewArtifactsPresent ? 65 : modelGovernanceReviewArtifactsPresent ? 64 : reg141ReviewArtifactsPresent ? 63 : ag55ReviewArtifactsPresent ? 62 : ag54ReviewArtifactsPresent ? 61 : ag53ReviewArtifactsPresent ? 58 : ag52ReviewArtifactsPresent ? 57 : ag51ReviewArtifactsPresent ? 56 : ag50ReviewArtifactsPresent ? 55 : ag49ReviewArtifactsPresent ? 54 : ag48ReviewArtifactsPresent ? 53 : ag47ReviewArtifactsPresent ? 52 : ag46ReviewArtifactsPresent ? 51 : ag45ReviewArtifactsPresent ? 50 : ag44ReviewArtifactsPresent ? 49 : ag43ReviewArtifactsPresent ? 48 : ag42ReviewArtifactsPresent ? 47 : ag41ReviewArtifactsPresent ? 46 : ag40ReviewArtifactsPresent ? 45 : ag39ReviewArtifactsPresent ? 44 : ag38ReviewArtifactsPresent ? 43 : ag37ReviewArtifactsPresent ? 42 : ag36ReviewArtifactsPresent ? 41 : ag35ReviewArtifactsPresent ? 40 : ag34ReviewArtifactsPresent ? 39 : 38} review indexes`,
  )
  if (validatedPilotBatchCount > 0) {
    console.log(`- Pilot batches validated: ${validatedPilotBatchCount}`)
  }
}

for (const warning of warnings) {
  console.warn(`- ${warning}`)
}
