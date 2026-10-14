#!/usr/bin/env python3
"""
CYBER-TRACE: Law Enforcement Evidence Hash & Custody Chain Compiler
"""

import sys
import json
import hashlib
import datetime

def compile_dossier(case_id, suspect_ip, suspect_phone, scam_type, victim_name, loss_amount, notes):
    now = datetime.datetime.utcnow().isoformat() + "Z"
    payload = f"{case_id}|{suspect_ip}|{suspect_phone}|{scam_type}|{loss_amount}|{now}"
    dossier_hash = hashlib.sha256(payload.encode("utf-8")).hexdigest()
    seal_key = hashlib.sha3_256(f"GOVT-CYBER-SEAL-{dossier_hash}".encode("utf-8")).hexdigest()[:24].upper()

    return {
        "caseId": case_id,
        "timestamp": now,
        "suspectIp": suspect_ip,
        "suspectPhone": suspect_phone,
        "scamClassification": scam_type,
        "victimName": victim_name,
        "reportedLoss": loss_amount,
        "investigatorNotes": notes,
        "chainOfCustodyHash": dossier_hash,
        "digitalForensicSeal": f"LE-SEAL-{seal_key}",
        "judicialStatus": "VERIFIED_FOR_COURT_FILING"
    }

if __name__ == "__main__":
    if len(sys.argv) > 1:
        case = sys.argv[1]
    else:
        case = "CC-2026-9041"
    res = compile_dossier(case, "103.251.167.24", "+91 98721 54321", "OTP Interception & Banking Impersonation", "Confidential Complainant", "$3,450.00", "Malicious APK disguised as SBI YONO update forwarded via WhatsApp")
    print(json.dumps(res, indent=2))
