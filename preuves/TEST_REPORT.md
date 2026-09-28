# Test report — 2026-09-26

| Template | Automated tests | Result |
|---|---|---|
| QE Governed Agent | 7 | passed |
| QE Serious Game Studio | 2 | passed |
| QE Verifiable Journal SDK | 5 | passed |
| QE Consent & Approval Ledger Kit | 4 | passed |
| QE Grounded Answers Kit | 3 | passed |
| QE Premium Demo Page Kit | 3 | passed |
| QE Digital Fortress Kit | 6 | passed |
| QE Immersive Gallery Kit | 9 | passed |
| PQC Migration Suite | 4 | passed |
| AI Trust & Governance Suite | 5 | passed |
| HoloFit Studio Pro | 3 | passed |
| Fashion Labyrinth | 4 | passed |

Total: **55 tests**, all passing — run on 2026-09-26 on the sealed packages listed in `PACKAGE_SHA256.txt`, with `python -m pytest -q` inside each template. The packages themselves are not in this public repository (they are the product), so this report is a dated statement by the publisher; what the CI of this repository proves independently is the journal producer (`preuves/interop_test.js`) and the well-formedness of the hash list.
