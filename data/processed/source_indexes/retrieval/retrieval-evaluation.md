# Retrieval evaluation

- Evaluation ID: `source-index-poc-2026-07-21-retrieval`
- Method: keyword_overlap_baseline
- Queries: 3
- Top-1 hits: 3
- Top-3 coverage: 100%

| Query | Expected chunk(s) | Top ranked chunk(s) | Top-1 hit | Top-3 hit |
| --- | --- | --- | --- | --- |
| How does AG 01 treat policies when net premium exceeds gross premium? | chunk-ag01-net-premium-interpretation-001 | chunk-ag01-net-premium-interpretation-001 (7)<br>chunk-ag03-maturity-value-interpretation-001 (1)<br>chunk-vm20-framework-boundary-001 (0) | Yes | Yes |
| What does AG 03 say maturity value means for cash surrender benefit interpretation? | chunk-ag03-maturity-value-interpretation-001 | chunk-ag03-maturity-value-interpretation-001 (7)<br>chunk-ag01-net-premium-interpretation-001 (2)<br>chunk-vm20-framework-boundary-001 (1) | Yes | Yes |
| What does VM-20 say about the minimum reserve valuation standard and the start of reserve mechanics? | chunk-vm20-framework-overview-001<br>chunk-vm20-framework-boundary-001 | chunk-vm20-framework-overview-001 (6)<br>chunk-vm20-framework-boundary-001 (5)<br>chunk-ag01-net-premium-interpretation-001 (1) | Yes | Yes |

## Notes

This baseline is intentionally lightweight and offline. It exists to prove the POC contract, not to replace a production search backend.
