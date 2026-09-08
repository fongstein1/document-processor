import argparse
import hashlib
import json
import os
import platform
import sys
from pathlib import Path

import numpy as np
import torch
import transformers
from transformers import AutoModel, AutoTokenizer


def sha256_file(file_path: Path) -> str:
    digest = hashlib.sha256()
    with file_path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def stable_hash(value) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


def load_jsonl(file_path: Path):
    rows = []
    with file_path.open("r", encoding="utf-8") as handle:
        for line_number, line in enumerate(handle, 1):
            if not line.strip():
                continue
            row = json.loads(line)
            if not isinstance(row.get("id"), str) or not isinstance(row.get("text"), str):
                raise ValueError(f"Invalid embedding row at {file_path}:{line_number}")
            rows.append(row)
    if len({row["id"] for row in rows}) != len(rows):
        raise ValueError(f"Duplicate embedding IDs in {file_path}")
    return rows


def average_pool(last_hidden_states, attention_mask):
    masked = last_hidden_states.masked_fill(~attention_mask[..., None].bool(), 0.0)
    return masked.sum(dim=1) / attention_mask.sum(dim=1)[..., None]


def embed(rows, tokenizer, model, batch_size, max_length):
    vectors = []
    for start in range(0, len(rows), batch_size):
        batch = [row["text"] for row in rows[start : start + batch_size]]
        encoded = tokenizer(batch, max_length=max_length, padding=True, truncation=True, return_tensors="pt")
        with torch.no_grad():
            output = model(**encoded)
            embeddings = average_pool(output.last_hidden_state, encoded["attention_mask"])
            embeddings = torch.nn.functional.normalize(embeddings, p=2, dim=1)
        vectors.append(embeddings.cpu().to(torch.float32).numpy())
        completed = min(start + batch_size, len(rows))
        if completed == len(rows) or completed % (batch_size * 25) == 0:
            print(f"embedded {completed}/{len(rows)}", flush=True)
    return np.concatenate(vectors, axis=0).astype("<f4", copy=False)


def model_snapshot(model_dir: Path):
    records = []
    for file_path in sorted(path for path in model_dir.rglob("*") if path.is_file() and ".cache" not in path.parts):
        records.append({
            "path": file_path.relative_to(model_dir).as_posix(),
            "byteCount": file_path.stat().st_size,
            "sha256": sha256_file(file_path),
        })
    return records, stable_hash(records)


def main():
    parser = argparse.ArgumentParser(description="Create deterministic local E5 embeddings for the review-only hybrid experiment.")
    parser.add_argument("--passages", required=True, type=Path)
    parser.add_argument("--queries", required=True, type=Path)
    parser.add_argument("--model-dir", required=True, type=Path)
    parser.add_argument("--output-dir", required=True, type=Path)
    parser.add_argument("--model-id", required=True)
    parser.add_argument("--revision", required=True)
    parser.add_argument("--license", required=True)
    parser.add_argument("--batch-size", type=int, default=16)
    parser.add_argument("--max-length", type=int, default=512)
    args = parser.parse_args()

    os.environ["HF_HUB_OFFLINE"] = "1"
    os.environ["TRANSFORMERS_OFFLINE"] = "1"
    torch.manual_seed(0)
    torch.set_num_threads(max(1, min(4, os.cpu_count() or 1)))
    torch.use_deterministic_algorithms(True)

    passage_rows = load_jsonl(args.passages)
    query_rows = load_jsonl(args.queries)
    tokenizer = AutoTokenizer.from_pretrained(args.model_dir, local_files_only=True)
    model = AutoModel.from_pretrained(args.model_dir, local_files_only=True)
    model.eval()

    args.output_dir.mkdir(parents=True, exist_ok=True)
    passage_vectors = embed(passage_rows, tokenizer, model, args.batch_size, args.max_length)
    query_vectors = embed(query_rows, tokenizer, model, args.batch_size, args.max_length)
    passage_path = args.output_dir / "document-embeddings.f32"
    query_path = args.output_dir / "query-embeddings.f32"
    passage_vectors.tofile(passage_path)
    query_vectors.tofile(query_path)

    model_files, model_snapshot_sha256 = model_snapshot(args.model_dir)
    passage_norms = np.linalg.norm(passage_vectors, axis=1)
    query_norms = np.linalg.norm(query_vectors, axis=1)
    metadata = {
        "schemaVersion": "1.0",
        "model": args.model_id,
        "revision": args.revision,
        "license": args.license,
        "device": "cpu",
        "pooling": "attention-mask average pooling over last_hidden_state",
        "normalization": "L2",
        "maxSequenceLength": args.max_length,
        "vectorDtype": "float32-le",
        "vectorDimension": int(passage_vectors.shape[1]),
        "vectorCount": int(passage_vectors.shape[0]),
        "queryVectorCount": int(query_vectors.shape[0]),
        "passageIdsSha256": stable_hash([row["id"] for row in passage_rows]),
        "queryIdsSha256": stable_hash([row["id"] for row in query_rows]),
        "passageInputSha256": sha256_file(args.passages),
        "queryInputSha256": sha256_file(args.queries),
        "documentVectorSha256": sha256_file(passage_path),
        "queryVectorSha256": sha256_file(query_path),
        "modelSnapshotSha256": model_snapshot_sha256,
        "modelSnapshotByteCount": sum(item["byteCount"] for item in model_files),
        "normMaximumDeviation": float(max(np.max(np.abs(passage_norms - 1.0)), np.max(np.abs(query_norms - 1.0)))),
        "deterministicAlgorithms": True,
        "runtime": {
            "pythonVersion": platform.python_version(),
            "torchVersion": torch.__version__,
            "transformersVersion": transformers.__version__,
            "numpyVersion": np.__version__,
            "platform": platform.platform(),
        },
        "modelFiles": model_files,
        "localOnly": True,
        "hostedApisUsed": False,
    }
    metadata_path = args.output_dir / "embedding-metadata.json"
    metadata_path.write_text(json.dumps(metadata, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps({key: metadata[key] for key in ["model", "revision", "vectorDimension", "vectorCount", "queryVectorCount", "documentVectorSha256", "queryVectorSha256", "normMaximumDeviation"]}, indent=2))


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(f"ERROR: {error}", file=sys.stderr)
        raise
