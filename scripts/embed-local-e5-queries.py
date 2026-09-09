import argparse
import hashlib
import json
import os
import platform
from pathlib import Path

import numpy as np
import torch
import transformers
from transformers import AutoModel, AutoTokenizer

def file_hash(path):
    h=hashlib.sha256()
    with path.open('rb') as f:
        for block in iter(lambda:f.read(1024*1024),b''): h.update(block)
    return h.hexdigest()

def stable_hash(value):
    return hashlib.sha256(json.dumps(value,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()).hexdigest()

def main():
    p=argparse.ArgumentParser()
    p.add_argument('--queries',required=True,type=Path); p.add_argument('--model-dir',required=True,type=Path)
    p.add_argument('--output-dir',required=True,type=Path); p.add_argument('--model-id',required=True); p.add_argument('--revision',required=True)
    p.add_argument('--license',required=True); p.add_argument('--max-length',type=int,default=512); p.add_argument('--batch-size',type=int,default=16)
    p.add_argument('--inference-precision',choices=['dynamic-int8-linear'],default='dynamic-int8-linear')
    a=p.parse_args(); os.environ['HF_HUB_OFFLINE']='1'; os.environ['TRANSFORMERS_OFFLINE']='1'
    torch.manual_seed(0); torch.set_num_threads(max(1,min(4,os.cpu_count() or 1))); torch.use_deterministic_algorithms(True)
    rows=[json.loads(line) for line in a.queries.read_text(encoding='utf8').splitlines() if line.strip()]
    if len({r['id'] for r in rows})!=len(rows): raise ValueError('duplicate query IDs')
    tok=AutoTokenizer.from_pretrained(a.model_dir,local_files_only=True); model=AutoModel.from_pretrained(a.model_dir,local_files_only=True)
    model=torch.ao.quantization.quantize_dynamic(model,{torch.nn.Linear},dtype=torch.qint8); model.eval()
    ordered=sorted(enumerate(rows),key=lambda x:(len(x[1]['text']),x[0])); vectors=None
    for start in range(0,len(ordered),a.batch_size):
        batch=ordered[start:start+a.batch_size]; enc=tok([r['text'] for _,r in batch],max_length=a.max_length,padding=True,truncation=True,return_tensors='pt')
        with torch.no_grad():
            out=model(**enc).last_hidden_state.masked_fill(~enc['attention_mask'][...,None].bool(),0.0)
            emb=out.sum(dim=1)/enc['attention_mask'].sum(dim=1)[...,None]; emb=torch.nn.functional.normalize(emb,p=2,dim=1)
        arr=emb.cpu().to(torch.float32).numpy()
        if vectors is None: vectors=np.empty((len(rows),arr.shape[1]),dtype=np.float32)
        for j,(original,_) in enumerate(batch): vectors[original]=arr[j]
        print(f'embedded {min(start+a.batch_size,len(rows))}/{len(rows)}',flush=True)
    vectors=vectors.astype('<f4',copy=False); a.output_dir.mkdir(parents=True,exist_ok=True)
    vector_file=a.output_dir/'query-embeddings.f32'; vectors.tofile(vector_file)
    norms=np.linalg.norm(vectors,axis=1)
    metadata={'schemaVersion':'1.0','model':a.model_id,'revision':a.revision,'license':a.license,'device':'cpu','inferencePrecision':a.inference_precision,'pooling':'attention-mask average pooling over last_hidden_state','normalization':'L2','maxSequenceLength':a.max_length,'vectorDtype':'float32-le','vectorDimension':int(vectors.shape[1]),'queryVectorCount':len(rows),'queryIdsSha256':stable_hash([r['id'] for r in rows]),'queryInputSha256':file_hash(a.queries),'queryVectorSha256':file_hash(vector_file),'normMaximumDeviation':float(np.max(np.abs(norms-1.0))),'deterministicAlgorithms':True,'localOnly':True,'hostedApisUsed':False,'runtime':{'pythonVersion':platform.python_version(),'torchVersion':torch.__version__,'transformersVersion':transformers.__version__,'numpyVersion':np.__version__,'platform':platform.platform()}}
    (a.output_dir/'query-embedding-metadata.json').write_text(json.dumps(metadata,indent=2)+'\n',encoding='utf8')
    print(json.dumps(metadata,indent=2))

if __name__=='__main__': main()
