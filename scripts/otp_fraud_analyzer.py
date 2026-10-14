#!/usr/bin/env python3
"""
CYBER-TRACE: OTP Scam & Fraudulent Message Linguistic Analyzer
Analyzes phishing templates, malicious APK names, urgency triggers, and mule vectors.
"""

import sys
import json
import argparse
import re
import hashlib

BANK_KEYWORDS = [
    "sbi", "hdfc", "icici", "axis", "pnb", "bob", "kotak", "canara", "chase",
    "wells fargo", "citibank", "bank of america", "barclays", "hsbc", "paypal",
    "paytm", "phonepe", "gpay", "bhim", "upi"
]

URGENCY_KEYWORDS = [
    "blocked", "suspended", "deactivated", "expire", "immediate", "urgent",
    "within 24 hours", "penalty", "kyc pending", "ebill disconnect", "electricity",
    "cut off", "arrest warrant", "cbi", "police", "customs", "parcel"
]

OTP_HARVEST_KEYWORDS = [
    "otp", "one time password", "verification code", "secret pin", "cvv",
    "share code", "forward to", "enter otp", "update pan", "claim bonus",
    "lottery", "refund", "cashback"
]

APK_PATTERNS = [
    r"https?://[^\s]+\.apk",
    r"[a-zA-Z0-9_\-]+\.apk",
    r"support[0-9]*\.apk",
    r"banking[0-9]*\.apk",
    r"quicksupport",
    r"anydesk",
    r"teamviewer"
]

def analyze_fraud_content(text, sender=""):
    score = 0
    flags = []
    text_lower = text.lower()
    
    # 1. Bank Impersonation check
    matched_banks = [b for b in BANK_KEYWORDS if b in text_lower]
    if matched_banks:
        score += 25
        flags.append(f"Targeted Financial Institution Impersonation: {', '.join(matched_banks).upper()}")

    # 2. Urgency & Coercion triggers
    matched_urgency = [u for u in URGENCY_KEYWORDS if u in text_lower]
    if matched_urgency:
        score += 30
        flags.append(f"High Psychological Pressure / Threat Vectors: {', '.join(matched_urgency)}")

    # 3. OTP & Credential Harvesting
    matched_otp = [o for o in OTP_HARVEST_KEYWORDS if o in text_lower]
    if matched_otp:
        score += 35
        flags.append(f"Direct OTP / Authentication Credential Extraction: {', '.join(matched_otp)}")

    # 4. Dangerous APK or Remote Access Lures
    apk_matches = []
    for pat in APK_PATTERNS:
        matches = re.findall(pat, text_lower)
        if matches:
            apk_matches.extend(matches)
    if apk_matches:
        score += 30
        flags.append(f"Trojan / Remote Access APK Payload Detected: {', '.join(apk_matches)}")

    # 5. Extract URLs
    urls = re.findall(r"https?://(?:[-\w.]|(?:%[\da-fA-F]{2}))+[^\s]*", text)
    if urls:
        score += 15
        flags.append(f"Suspicious Action URL(s): {', '.join(urls)}")
        # Check for spoofed bank domain
        for u in urls:
            if any(b in u.lower() for b in ["sbi", "hdfc", "pnb", "kyc", "apk", "ngrok", "bit.ly", "tinyurl"]):
                score += 20
                flags.append(f"Phishing Link Heuristic Match: {u}")

    # 6. Extract Phone / Shortcode Numbers
    phones = re.findall(r"(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b[6-9]\d{9}\b", text)
    
    # Cap score
    final_score = min(100, max(10, score))
    
    # Threat level
    if final_score >= 80:
        level = "CRITICAL / SEVERE THREAT"
        action = "IMMEDIATE ACCOUNT FREEZE & CARRIER BLOCK DISPATCH"
    elif final_score >= 50:
        level = "HIGH RISK FRAUD"
        action = "SUSPECT MONITORING & REVERSE LOOKUP SUBPOENA"
    else:
        level = "SUSPICIOUS / LOW-CONFIDENCE"
        action = "LOG EVIDENCE IN CYBER INCIDENT QUEUE"

    sha256 = hashlib.sha256(text.encode("utf-8")).hexdigest()

    return {
        "threatScore": final_score,
        "threatLevel": level,
        "recommendedAction": action,
        "detectedFlags": flags,
        "impersonatedEntities": matched_banks,
        "extractedUrls": urls,
        "extractedPhones": list(set(phones)),
        "apkPayloads": apk_matches,
        "contentSha256": sha256
    }

def main():
    parser = argparse.ArgumentParser(description="Cyber-Trace OTP & Phishing Linguistic Analyzer")
    parser.add_argument("--text", type=str, required=True, help="Scam message text or transcript")
    parser.add_argument("--sender", type=str, default="", help="Sender ID or phone number")
    parser.add_argument("--json", action="store_true", help="Output JSON")
    args = parser.parse_args()

    result = analyze_fraud_content(args.text, args.sender)

    if args.json:
        print(json.dumps(result, indent=2))
    else:
        print("=" * 64)
        print("  CYBER-TRACE: OTP SCAM FORENSIC LINGUISTIC ANALYZER")
        print("=" * 64)
        print(f"[*] Threat Score    : {result['threatScore']}/100")
        print(f"[*] Severity Level  : {result['threatLevel']}")
        print(f"[*] Directive Action: {result['recommendedAction']}")
        print(f"[*] Evidence Hash   : {result['contentSha256']}")
        print("\n[*] Detected Modus Operandi Indicators:")
        for f in result["detectedFlags"]:
            print(f"    - {f}")
        if result["extractedUrls"]:
            print(f"[*] Phishing Links  : {', '.join(result['extractedUrls'])}")
        if result["extractedPhones"]:
            print(f"[*] Suspect Contacts: {', '.join(result['extractedPhones'])}")
        print("=" * 64)

if __name__ == "__main__":
    main()
