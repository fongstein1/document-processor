import assert from 'node:assert/strict'
import fs from 'node:fs'
import { planEvidenceSlots,assembleSlotPackage } from './lib/multi-unit-sidecar.mjs'

const cases=[
 ['Which entities are covered and what must they report?','REQUIREMENT_PLUS_SCOPE'],
 ['What is required and what exception applies?','REQUIREMENT_PLUS_EXCEPTION'],
 ['What does the term mean and what must be reported?','DEFINITION_PLUS_REQUIREMENT'],
 ['For Table F, give the columns and values for ages 11 through 22.','TABLE_HEADER_PLUS_DATA'],
 ['Compare direct risks with assumed risks.','COMPARISON'],
 ['What must be disclosed and what must be recognized?','MULTIPLE_REQUIREMENTS']
]
for(const [q,type] of cases){const p=planEvidenceSlots(q);assert.equal(p.planType,type);assert.ok(p.slots.length>=2)}
for(const p of cases.map(([q])=>planEvidenceSlots(q)))for(const forbidden of ['acceptedEvidenceIds','expectedSource','expectedParent','requiredRoles','classification','split','acceptedEvidenceSets'])assert.equal(JSON.stringify(p).includes(forbidden),false)
const plan=planEvidenceSlots('What is required and what exception applies?')
const doc=(id,role,sourceId='s')=>({childId:id,parentId:'p',sourceId,semanticRole:role,body:id,identifier:'',parentHeading:'',header:''})
const ranked=(d,score=.03,sim=.8)=>[{doc:d,rank:1,finalScore:score,bm25Rank:1,vectorSimilarity:sim}]
const complete=assembleSlotPackage({query:'',plan,slotRankings:{requirement:ranked(doc('r','REQUIREMENT')),exception:ranked(doc('e','EXCEPTION_OR_QUALIFICATION'))},originalRanking:ranked(doc('r','REQUIREMENT')),parentById:new Map(),config:{sourceConsensusDepth:12,originalSourceDepth:10,originalSourceWeight:.35,slotCandidateDepth:80,roleBonus:.024,sourceConsensusBonus:.016,sameParentBonus:.006,parentCoherenceBonus:.04,structuralBonus:.012,minimumRrfScore:.018,minimumVectorSimilarity:.72,maximumPackageEvidence:6,maximumPackageCharacters:16000}})
assert.equal(complete.status,'COMPLETE_CANDIDATE');assert.equal(complete.records.length,2);assert.equal(new Set(complete.records.map(x=>x.evidenceId)).size,2)
assert.deepEqual(complete,assembleSlotPackage({query:'',plan,slotRankings:{requirement:ranked(doc('r','REQUIREMENT')),exception:ranked(doc('e','EXCEPTION_OR_QUALIFICATION'))},originalRanking:ranked(doc('r','REQUIREMENT')),parentById:new Map(),config:{sourceConsensusDepth:12,originalSourceDepth:10,originalSourceWeight:.35,slotCandidateDepth:80,roleBonus:.024,sourceConsensusBonus:.016,sameParentBonus:.006,parentCoherenceBonus:.04,structuralBonus:.012,minimumRrfScore:.018,minimumVectorSimilarity:.72,maximumPackageEvidence:6,maximumPackageCharacters:16000}}))
const partial=assembleSlotPackage({query:'',plan,slotRankings:{requirement:ranked(doc('r','REQUIREMENT')),exception:ranked(doc('e','EXCEPTION_OR_QUALIFICATION'),.01,.2)},originalRanking:ranked(doc('r','REQUIREMENT')),parentById:new Map(),config:{sourceConsensusDepth:12,originalSourceDepth:10,originalSourceWeight:.35,slotCandidateDepth:80,roleBonus:.024,sourceConsensusBonus:.016,sameParentBonus:.006,parentCoherenceBonus:.04,structuralBonus:.012,minimumRrfScore:.018,minimumVectorSimilarity:.72,maximumPackageEvidence:6,maximumPackageCharacters:16000}})
assert.equal(partial.status,'PARTIAL_CANDIDATE')
const rankSource=fs.readFileSync(new URL('./multi-unit-sidecar-experiment.mjs',import.meta.url),'utf8').split('export async function score')[0]
for(const forbidden of ['acceptedEvidenceIds','expectedSource','expectedParent','requiredEvidenceRoles','acceptedEvidenceSets'])assert.equal(rankSource.includes(forbidden),false,`ranking leaked ${forbidden}`)
console.log('multi-unit planner, independent slots, relational assembly, gold leakage, determinism, status and bounds: PASS')
