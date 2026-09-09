import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { root,runId,publicRoot,privateRoot,privateBase,read,hash,write,loadCorpus,verifyFreeze,scoreCase,summarize } from './hierarchical-retrieval-experiment.mjs'
import { validateGitSafeArtifact } from './rights-storage.mjs'
const config=await read(path.join(root,'config/hierarchical-retrieval-hardening.json'))
await verifyFreeze()
const corpus=await loadCorpus(), children=new Map(corpus.children.map(x=>[x.childId,x])), parents=new Map(corpus.parents.map(x=>[x.parentId,x]))
const evidence=new Map([...children].map(([id,c])=>[id,{...c,role:c.semanticRole}]))
for(const h of corpus.headers)evidence.set(h.headerContextId,h)
for(const p of corpus.parentContexts)if(!evidence.has(p.parentContextId))evidence.set(p.parentContextId,p)
const gold=(await read(path.join(root,'data/processed/review_packages/retrieval-gold-v3-expansion-2026-09/evaluation-v3-freeze.json'))).cases
const artifacts=[]
for(const split of ['development','holdout']) {
  const file=path.join(privateRoot,`${split}-rankings.json`), ranking=await read(file), report=await read(path.join(publicRoot,`${split}-results.json`))
  assert.equal(ranking.cases.length,split==='development'?36:24)
  for(const c of ranking.cases) {
    const g=gold.find(x=>x.caseId===c.caseId);assert.equal(g.split,split);assert.equal(g.queryHash,c.queryHash)
    for(const s of c.systems) {
      assert.equal(new Set(s.ranking.map(x=>x.childId)).size,s.ranking.length)
      assert(s.ranking.every((x,i)=>x.rank===i+1&&children.has(x.childId)&&Number.isFinite(x.score)))
      assert(s.parentIds.length<=config.topParents)
      if(s.systemId!=='A')assert(s.ranking.every(x=>s.parentIds.includes(children.get(x.childId).parentId)))
      assert.equal(new Set(s.records.map(x=>x.evidenceId)).size,s.records.length)
      if(s.systemId==='D') {
        assert(s.records.length<=config.maximumPackageEvidence)
        assert(s.records.reduce((n,x)=>n+x.characterCount,0)<=config.maximumPackageCharacters)
        for(const r of s.records)assert(s.parentIds.includes(r.parentId))
      }
      for(const r of s.records){const e=evidence.get(r.evidenceId);assert(e,`Unknown evidence ${r.evidenceId}`);assert.equal(e.parentId,r.parentId);assert.equal(e.sourceId,r.sourceId);assert(parents.has(r.parentId))}
      assert.deepEqual(scoreCase(g,s,children),report.cases.find(x=>x.caseId===g.caseId&&x.systemId===s.systemId))
    }
    assert.deepEqual(c.systems.find(x=>x.systemId==='C').ranking,c.systems.find(x=>x.systemId==='D').ranking)
  }
  for(const s of report.systems)assert.deepEqual(s.metrics,summarize(report.cases.filter(x=>x.systemId===s.systemId)))
  if(process.argv.includes('--determinism')) {
    const before=await hash(file)
    execFileSync(process.execPath,['scripts/hierarchical-retrieval-experiment.mjs','rank',split],{cwd:root,stdio:'inherit'})
    assert.equal(await hash(file),before,`${split} byte determinism failed`)
  }
  artifacts.push({artifactType:`${split}-rankings`,externalPath:file,sha256:await hash(file),byteCount:(await fs.stat(file)).size,rightsStorageStatus:'RIGHTS_EXTERNAL_STORAGE_ONLY',reviewOnly:true})
}
const changes=execFileSync('git',['diff','--name-only',config.startingSha,'--','data/processed'],{cwd:root,encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean)
assert(changes.every(p=>p.startsWith(`data/processed/review_packages/${runId}/`)||p.startsWith('data/processed/review_packages/multi-unit-gold-v1-2026-09/')),'Historical processed artifacts changed')
const baselinePaths=['config/hybrid-vector-retrieval-experiment.json','scripts/hybrid-vector-retrieval-experiment.mjs','scripts/lib/hybrid-vector-retrieval.mjs','scripts/lib/semantic-evidence-units.mjs','scripts/retrieval-gold-v3-evaluation.mjs']
assert.equal(execFileSync('git',['diff',config.startingSha,'--',...baselinePaths],{cwd:root,encoding:'utf8'}),'','Frozen baseline modified')
for(const file of await fs.readdir(publicRoot))if(file.endsWith('.json'))validateGitSafeArtifact({artifactType:file,value:await read(path.join(publicRoot,file))})
const parentManifest=await read(path.join(root,'data/processed/review_packages/retrieval-gold-v3-expansion-2026-09/external-artifact-manifest-v3.json'))
for(const a of parentManifest.artifacts.filter(x=>['frozen-document-vectors','query-vectors','private-queries','frozen-exact-index','gold-adjudication'].includes(x.artifactType))) {
  assert.equal(await hash(a.externalPath),a.sha256)
  assert.equal((await fs.stat(a.externalPath)).size,a.byteCount)
  artifacts.push(a)
}
await write(path.join(publicRoot,'external-artifact-manifest.json'),{schemaVersion:'1.0',runId,artifacts,privateArtifactByteCount:artifacts.reduce((n,x)=>n+x.byteCount,0),artifactCount:artifacts.length,reviewOnly:true},true)
if(process.argv.includes('--determinism'))await write(path.join(publicRoot,'determinism-evidence.json'),{schemaVersion:'1.0',runId,artifacts:artifacts.slice(0,2),determinismPassed:true,allPassed:true,reviewOnly:true},true)
const determinism=await read(path.join(publicRoot,'determinism-evidence.json'));assert.equal(determinism.allPassed,true)
assert.deepEqual(determinism.artifacts,artifacts.slice(0,2))
console.log('Hierarchy integrity, freeze, historical baseline, Gold V3 isolation, rights, exact evidence scoring and determinism PASS')
