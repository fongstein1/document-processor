#!/usr/bin/env python3
"""
M5 Scalable Regulatory Document Processor — High-Fidelity PDF Extractor
Extracts page-level text, headings, section numbers, and structural metadata using pypdf.
"""

import sys
import json
import re
import os
import hashlib
from typing import Dict, Any, List

import pypdf

def extract_pdf_structure(pdf_path: str, max_pages: int = None) -> Dict[str, Any]:
    if not os.path.exists(pdf_path):
        return {"error": f"File not found: {pdf_path}", "ok": False}

    with open(pdf_path, 'rb') as f:
        file_bytes = f.read()
    file_sha256 = hashlib.sha256(file_bytes).hexdigest()

    try:
        reader = pypdf.PdfReader(pdf_path)
    except Exception as e:
        return {
            "error": f"Failed to parse PDF: {str(e)}",
            "ok": False,
            "sourceSha256": file_sha256
        }

    total_pages = len(reader.pages)
    limit = total_pages if max_pages is None else min(total_pages, max_pages)

    doc_info = reader.metadata or {}
    meta = {
        "title": str(doc_info.get('/Title', '') or '').strip(),
        "author": str(doc_info.get('/Author', '') or '').strip(),
        "creator": str(doc_info.get('/Creator', '') or '').strip(),
        "producer": str(doc_info.get('/Producer', '') or '').strip(),
        "creationDate": str(doc_info.get('/CreationDate', '') or '').strip(),
    }

    pages_data = []
    total_chars = 0
    full_text_parts = []

    # Regex patterns for regulatory headings and section identifiers
    heading_patterns = [
        re.compile(r'^(Section\s+\d+[\.\w\(\)]*[:\s].*)$', re.MULTILINE | re.IGNORECASE),
        re.compile(r'^(SSAP\s+No\.\s+\d+[\.\w\(\)]*[:\s].*)$', re.MULTILINE | re.IGNORECASE),
        re.compile(r'^(Appendix\s+[A-Z\d]+[:\s].*)$', re.MULTILINE | re.IGNORECASE),
        re.compile(r'^(Actuarial\s+Guideline\s+[A-Z\d]+[:\s].*)$', re.MULTILINE | re.IGNORECASE),
        re.compile(r'^(Table\s+[\dA-Z]+[:\s].*)$', re.MULTILINE | re.IGNORECASE),
        re.compile(r'^([A-Z\s]{4,40})$', re.MULTILINE), # ALL CAPS line
    ]

    for p_idx in range(limit):
        page = reader.pages[p_idx]
        try:
            text = page.extract_text() or ""
        except Exception as err:
            text = f"[EXTRACTION ERROR on page {p_idx+1}: {str(err)}]"

        # Clean null characters and carriage returns
        text = text.replace('\x00', '').replace('\r\n', '\n')
        total_chars += len(text)
        full_text_parts.append(text)

        # Detect page headings
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        detected_headings = []
        for line in lines[:10]: # Look in first 10 non-empty lines
            for pat in heading_patterns:
                m = pat.match(line)
                if m:
                    heading_text = m.group(1).strip()
                    if heading_text not in detected_headings and len(heading_text) > 3:
                        detected_headings.append(heading_text)
                    break

        # Detect table indicators
        has_tables = bool(
            re.search(r'\b(Table|Column|Percentage|Basis Points|Spread|Ratio|Schedule)\b', text, re.I) and
            re.search(r'\d+\.\d+%', text)
        )

        # Detect footnotes
        has_footnotes = bool(re.search(r'(Footnote|\*\s+[A-Z]|Note\s+\d+:)', text))

        pages_data.append({
            "pageNumber": p_idx + 1,
            "charCount": len(text),
            "wordCount": len(text.split()),
            "detectedHeadings": detected_headings[:5],
            "hasTables": has_tables,
            "hasFootnotes": has_footnotes,
            "text": text
        })

    full_text = "\n\n".join(full_text_parts)
    extracted_text_sha256 = hashlib.sha256(full_text.encode('utf-8')).hexdigest()

    return {
        "ok": True,
        "filePath": pdf_path,
        "fileSizeBytes": len(file_bytes),
        "sourceSha256": file_sha256,
        "extractedTextSha256": extracted_text_sha256,
        "totalPages": total_pages,
        "pagesExtracted": len(pages_data),
        "totalCharacters": total_chars,
        "metadata": meta,
        "pages": pages_data
    }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Usage: pdf_extractor.py <pdf_path> [max_pages]"}))
        sys.exit(1)

    pdf_file = sys.argv[1]
    max_p = int(sys.argv[2]) if len(sys.argv) > 2 else None
    result = extract_pdf_structure(pdf_file, max_p)
    # Output compact or pretty json
    print(json.dumps(result))
