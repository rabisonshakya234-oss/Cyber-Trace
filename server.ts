import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { execFile } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini API client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Initial Law Enforcement Incident Docket (Realistic Cyber Cell cases)
let caseDocket = [
  {
    id: "CC-2026-9041",
    caseNumber: "FIR/CYBER/2026/0941",
    title: "State Bank OTP Interception & Fake KYC APK Syndicate",
    scamType: "OTP & Banking Trojan",
    priority: "CRITICAL",
    status: "UNDER_SURVEILLANCE",
    reportedAt: "2026-10-14 04:12 UTC",
    victimName: "Dr. Ananya Sengupta (Sr. Pediatrician)",
    victimLoss: "$14,800.00 (₹1,225,000)",
    suspectPhone: "+91 98721 54321",
    suspectIp: "103.251.167.24",
    suspectLocation: "Jamtara, Jharkhand, India",
    gpsCoordinates: { lat: 23.9629, lon: 86.8016 },
    cellTower: "BTS-JH-JMT-7721",
    accuracyRadiusKm: 1.4,
    isp: "Bharti Airtel Ltd (Cellular Substation)",
    muleAccount: "SBIN0004928 / A/C 30992188412",
    evidenceHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    synopsis: "Victim received fraudulent SMS claiming electricity/PAN deactivation. Fraudster masqueraded as bank KYC officer, induced victim into installing 'SBI-QuickSupport.apk' which forwarded incoming OTPs to remote C2 server.",
    indicators: ["Malicious APK: sbi_support_v3.apk", "SMS Spoof Header: VK-SBIBNK", "Remote C2 Server IP: 103.251.167.24"]
  },
  {
    id: "CC-2026-8815",
    caseNumber: "FIR/CYBER/2026/0815",
    title: "FedEx Narcotics Parcel Extortion & Digital Arrest Coercion",
    scamType: "Digital Arrest & Wire Fraud",
    priority: "HIGH",
    status: "ESCALATED_INTERPOL",
    reportedAt: "2026-10-13 18:30 UTC",
    victimName: "Marcus Vance (Tech Lead)",
    victimLoss: "$42,500.00",
    suspectPhone: "+855 96 441 0921",
    suspectIp: "119.82.252.10",
    suspectLocation: "Sihanoukville, Preah Sihanouk, Cambodia",
    gpsCoordinates: { lat: 10.6274, lon: 103.5224 },
    cellTower: "KH-CELLCARD-SHV-91",
    accuracyRadiusKm: 0.8,
    isp: "EZECOM Co. Ltd (Commercial Compound)",
    muleAccount: "SWIFT: ABAAKHPP / 001928410",
    evidenceHash: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
    synopsis: "Impersonation of customs and federal law enforcement via spoofed Skype video call with fake police insignia. Coerced victim to liquidate savings into 'safe judicial holding escrow accounts' under threat of arrest.",
    indicators: ["Skype Handle: cbi_customs_desk04", "Wire Escrow Route: ABA Bank Phnom Penh", "VoIP SIP Trunk: 119.82.252.10"]
  },
  {
    id: "CC-2026-7630",
    caseNumber: "FIR/CYBER/2026/0763",
    title: "Fake Credit Card Limit Enhancement & OTP Phishing Kit",
    scamType: "Phishing & OTP Harvesting",
    priority: "HIGH",
    status: "INVESTIGATING",
    reportedAt: "2026-10-12 11:45 UTC",
    victimName: "Elena Rostova",
    victimLoss: "$6,200.00",
    suspectPhone: "+40 721 884 102",
    suspectIp: "45.142.214.88",
    suspectLocation: "Bucharest, Romania",
    gpsCoordinates: { lat: 44.4268, lon: 26.1025 },
    cellTower: "RO-VODAFONE-BC-119",
    accuracyRadiusKm: 4.8,
    isp: "HostPalace Web Services (Bulletproof VPS)",
    muleAccount: "IBAN: RO49BTRL00001234567890XX",
    evidenceHash: "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
    synopsis: "Phishing domain cloned official banking portal. When victim entered card credentials, fake loader screen prompted for real-time OTP which was relayed by API bot to merchant terminal within 12 seconds.",
    indicators: ["Phishing Domain: secure-limit-upgrade-bank.com", "Bulletproof Host IP: 45.142.214.88", "Telegram Bot Exfiltration"]
  },
  {
    id: "CC-2026-6410",
    caseNumber: "FIR/CYBER/2026/0641",
    title: "Mewat SIM-Swap & Sextortion Blackmail Cluster",
    scamType: "SIM Swap & Extortion",
    priority: "CRITICAL",
    status: "RAID_PENDING",
    reportedAt: "2026-10-11 22:15 UTC",
    victimName: "Rajiv Khurana (Businessman)",
    victimLoss: "$18,000.00",
    suspectPhone: "+91 96540 21984",
    suspectIp: "103.149.28.17",
    suspectLocation: "Nuh, Haryana, India",
    gpsCoordinates: { lat: 28.1154, lon: 77.0146 },
    cellTower: "RJIO-HR-NUH-0422",
    accuracyRadiusKm: 1.1,
    isp: "Reliance Jio Infocomm (Mobile Gateway)",
    muleAccount: "Paytm Payments Bank / 919654021984",
    evidenceHash: "ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d",
    synopsis: "Scammers orchestrated SIM-swap at regional mobile retail kiosk, intercepted 2FA OTP codes for cryptocurrency wallet, and threatened to release deepfake video recordings unless additional ransom paid.",
    indicators: ["Fraudulent SIM Activation at Nuh Circle", "WhatsApp Extortion Bot: +91 96540 21984", "Suspect Base Station: RJIO-HR-NUH-0422"]
  }
];

// 1. Python IP & GPS Tracker API Endpoint
app.post('/api/python/run-tracker', (req: Request, res: Response) => {
  const targetIp = (req.body.ip || '103.251.167.24').trim();
  const scriptPath = path.join(__dirname, 'scripts', 'ip_tracker.py');

  execFile('python3', [scriptPath, '--ip', targetIp, '--json'], { timeout: 8000 }, (error, stdout, stderr) => {
    let rawOutput = stdout || '';
    let parsedData = null;

    try {
      if (rawOutput) {
        parsedData = JSON.parse(rawOutput);
      }
    } catch {
      // ignore
    }

    // Also get terminal-formatted output
    execFile('python3', [scriptPath, '--ip', targetIp], { timeout: 8000 }, (_err, termStdout) => {
      res.json({
        success: true,
        ip: targetIp,
        data: parsedData,
        terminalOutput: termStdout || rawOutput || 'Python execution completed.',
        executionStatus: error ? 'EXIT_WITH_WARNING' : 'EXIT_SUCCESS_0',
        runtime: 'Python 3.10 Linux Runtime'
      });
    });
  });
});

// 2. Python OTP Scam Forensic Analyzer Endpoint
app.post('/api/python/run-analyzer', (req: Request, res: Response) => {
  const text = req.body.text || '';
  const sender = req.body.sender || '';
  const scriptPath = path.join(__dirname, 'scripts', 'otp_fraud_analyzer.py');

  execFile('python3', [scriptPath, '--text', text, '--sender', sender, '--json'], { timeout: 8000 }, (error, stdout) => {
    let parsedData = null;
    try {
      if (stdout) {
        parsedData = JSON.parse(stdout);
      }
    } catch {
      // ignore
    }

    execFile('python3', [scriptPath, '--text', text, '--sender', sender], { timeout: 8000 }, (_err, termStdout) => {
      res.json({
        success: true,
        data: parsedData,
        terminalOutput: termStdout || stdout || 'Analysis complete.',
        executionStatus: error ? 'EXIT_WARN' : 'EXIT_SUCCESS_0'
      });
    });
  });
});

// 3. AI Forensic Fraud & OTP Investigator (Gemini 3.8 Flash)
app.post('/api/ai/analyze-scam', async (req: Request, res: Response) => {
  try {
    const { text, scamType, suspectPhone, suspectIp, suspectUrl, victimLoss } = req.body;

    const prompt = `You are a Senior Cyber Crime Forensic Investigator and Intelligence Analyst in a National Cyber Crime Division.
Perform an exhaustive forensic triage of the following suspected fraudulent incident:

INCIDENT DETAILS:
- Reported Scam Category: ${scamType || 'Suspected OTP / Banking Fraud'}
- Suspect Contact / Sender ID: ${suspectPhone || 'Unknown / Withheld'}
- Suspect IP Address: ${suspectIp || 'N/A'}
- Phishing URL / Lure: ${suspectUrl || 'N/A'}
- Financial Impact / Loss: ${victimLoss || 'Attempted / Zero loss'}
- Raw Evidence Text / Transcript / SMS Lure:
"""${text}"""

Return a strictly formatted JSON response analyzing this scam according to professional cyber crime standards.
The response MUST be valid JSON with this exact structure:
{
  "threatScore": number (0 to 100, where 90+ is active severe crime syndication),
  "threatCategory": string (e.g., "OTP Interception via Android Accessibility RAT", "Digital Arrest Extortion Syndicate", "Electricity KYC Deactivation Phishing"),
  "severityRating": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
  "modusOperandiSummary": string (2-3 sentences explaining the exact technical and psychological mechanism used to defraud the victim),
  "socialEngineeringVectors": string[] (list 3-5 specific psychological triggers used, e.g. "Artificial Urgency & Disconnection Threat", "Authority Impersonation of Regulatory Body", "Confidentiality Coercion"),
  "technicalIoCs": {
    "suspiciousPatterns": string[],
    "harvestedCredentials": string[],
    "payloadRisks": string[],
    "infrastructureType": string
  },
  "syndicateAttribution": {
    "knownCluster": string (e.g. "Jamtara-style Mobile Banking Ring", "Mewat/Alwar Sextortion Hub", "Southeast Asia Pig Butchering Compound", "Eastern European Bulletproof Phishing Operation"),
    "estimatedSophistication": "Nation-State / Syndicate" | "Organized Cyber Gang" | "Opportunistic Script Kiddie",
    "typicalCashoutRoute": string (e.g., "Tiered Mule Bank Accounts -> Immediate UPI Layering -> P2P Crypto Conversion / ATM Cashout")
  },
  "lawEnforcementDirectives": string[] (4-6 actionable step-by-step enforcement commands for the police investigator, citing appropriate legal acts e.g. IT Act Sec 66D/420, Immediate IFSC Freeze under Section 91 CrPC, Telecom CDR Subpoena, Domain Takedown to Registrar),
  "victimImmediateAdvisory": string[] (3-4 immediate protective actions the victim must take right now)
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, analysis: parsed });
  } catch (error: any) {
    console.error('Error in /api/ai/analyze-scam:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Forensic analysis failed',
    });
  }
});

// 4. AI Official First Information Report (FIR) / Formal Judicial Dossier Generator
app.post('/api/ai/generate-fir', async (req: Request, res: Response) => {
  try {
    const { caseData } = req.body;

    const prompt = `You are a Legal & Cyber Forensics Specialist drafting an official Law Enforcement Cyber Crime Investigation Dossier and Formal First Information Report (FIR) for judicial submission in court.

CASE DETAILS:
Case ID: ${caseData.id || 'CC-2026-PENDING'}
Case Title: ${caseData.title || 'Cyber Crime Incident'}
Scam Classification: ${caseData.scamType || 'Fraudulent Activity'}
Victim Information: ${caseData.victimName || 'Confidential Complainant'}
Financial Loss: ${caseData.victimLoss || '$0.00'}
Suspect Phone: ${caseData.suspectPhone || 'N/A'}
Suspect IP Address: ${caseData.suspectIp || 'N/A'}
Suspect Location / Cell Tower: ${caseData.suspectLocation || 'Unknown'} (Tower: ${caseData.cellTower || 'Unknown'}, Radius: ${caseData.accuracyRadiusKm || '2.0'} km)
ISP / Gateway: ${caseData.isp || 'N/A'}
Mule Bank Account Flagged: ${caseData.muleAccount || 'N/A'}
Synopsis / Facts: ${caseData.synopsis || 'Complainant reported fraudulent debit after unauthorized OTP disclosure.'}

Generate an authoritative, professional, courtroom-grade FIR / Cyber Crime Investigation Dossier.
Return JSON with the following structure:
{
  "firNumber": string (e.g. "FIR-CYB-2026-${Math.floor(1000 + Math.random() * 9000)}"),
  "investigatingAgency": "Special Cyber Crime Investigation Division & Forensics Laboratory",
  "penalCodeSections": string[] (e.g., ["Section 66C: Identity Theft", "Section 66D: Cheating by Personation using Computer Resource", "Section 420: Cheating & Dishonestly Inducing Delivery of Property", "18 U.S.C. § 1343: Wire Fraud (if cross-border)"]),
  "briefFactsOfTheCase": string (exhaustive factual narrative detailing the fraud inception, OTP deception, and financial outflow),
  "digitalForensicFindings": {
    "ipOrigin": string,
    "gpsTriangulation": string,
    "cdrTowerAnalysis": string,
    "electronicEvidenceHash": string
  },
  "muleAccountDirectives": string (formal legal order directing the concerned bank manager to freeze debits immediately under CrPC 91/102),
  "telecomOrderDirective": string (formal directive to telecom service provider to freeze suspect SIM and preserve Call Detail Records [CDR] and IPDR logs for 12 months),
  "leadInvestigatorSignoff": string
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.1,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, fir: parsed });
  } catch (error: any) {
    console.error('Error in /api/ai/generate-fir:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'FIR generation failed',
    });
  }
});

// 5. Case Docket CRUD
app.get('/api/cases', (_req: Request, res: Response) => {
  res.json({ success: true, cases: caseDocket });
});

app.post('/api/cases', (req: Request, res: Response) => {
  const newCase = req.body;
  if (!newCase.title) {
    res.status(400).json({ success: false, error: 'Title required' });
    return;
  }
  const id = `CC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const created = {
    id,
    caseNumber: `FIR/CYBER/2026/${id.split('-')[2]}`,
    reportedAt: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
    status: 'ACTIVE_TRIAGE',
    priority: newCase.priority || 'HIGH',
    ...newCase,
  };
  caseDocket.unshift(created);
  res.json({ success: true, case: created });
});

// 6. Python Script Code Viewer Endpoint (so investigators can inspect & download real scripts)
app.get('/api/python/scripts', (_req: Request, res: Response) => {
  try {
    const trackerCode = fs.readFileSync(path.join(__dirname, 'scripts', 'ip_tracker.py'), 'utf-8');
    const analyzerCode = fs.readFileSync(path.join(__dirname, 'scripts', 'otp_fraud_analyzer.py'), 'utf-8');
    const compilerCode = fs.readFileSync(path.join(__dirname, 'scripts', 'evidence_compiler.py'), 'utf-8');

    res.json({
      success: true,
      scripts: [
        {
          filename: 'ip_tracker.py',
          name: 'IP & GPS Triangulation Engine',
          description: 'Geolocates suspect IP, checks against fraud hubs, computes cell mast ID & uncertainty radius',
          code: trackerCode,
        },
        {
          filename: 'otp_fraud_analyzer.py',
          name: 'OTP Phishing Linguistic Analyzer',
          description: 'Extracts OTP lures, detects malicious APKs, urgency markers, and parses suspect contacts',
          code: analyzerCode,
        },
        {
          filename: 'evidence_compiler.py',
          name: 'Evidence Custody Chain Compiler',
          description: 'Generates SHA-256 digital seals and courtroom custody hashes for digital evidence',
          code: compilerCode,
        },
      ],
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[CYBER-TRACE] Cyber Crime Workstation Server running on port ${PORT}`);
  });
}

startServer();
