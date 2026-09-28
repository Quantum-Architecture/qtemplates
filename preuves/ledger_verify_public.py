#!/usr/bin/env python3
"""Copie conforme du vérificateur public (github.com/Quantum-Architecture/ledger-verify), pour les tests d'interopérabilité."""
from __future__ import annotations
import argparse, hashlib, json
from pathlib import Path
GENESIS = "0" * 64
def canonical_payload(record: dict) -> bytes:
    payload = {k: record[k] for k in sorted(record) if k != "hash"}
    return json.dumps(payload, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
def digest(record: dict) -> str: return hashlib.sha256(canonical_payload(record)).hexdigest()
def verify(path: Path):
    errors, prev = [], GENESIS
    with path.open("r", encoding="utf-8") as f:
        for idx, line in enumerate(f, start=1):
            if not line.strip(): continue
            try: rec = json.loads(line)
            except json.JSONDecodeError as exc: errors.append(f"line {idx}: invalid JSON: {exc}"); continue
            if rec.get("prev_hash") != prev: errors.append(f"line {idx}: prev_hash mismatch")
            if rec.get("hash") != digest(rec): errors.append(f"line {idx}: hash mismatch")
            prev = rec.get("hash", "")
    return (not errors, errors)
if __name__ == "__main__":
    ap = argparse.ArgumentParser(); ap.add_argument("ledger", type=Path); a = ap.parse_args(); ok, errs = verify(a.ledger)
    print("VALID" if ok else "INVALID"); [print("-", e) for e in errs]; raise SystemExit(0 if ok else 1)
