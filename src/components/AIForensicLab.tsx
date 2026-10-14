import React, { useState } from 'react';
import { ScamAnalysisResult } from '../types';
import { Cpu, AlertOctagon, CheckCircle2, ShieldAlert, Sparkles, Send, FileCode2, ArrowRight } from 'lucide-react';

const SCAM_PRESETS = [
  {
    name: 'SBI YONO KYC & APK Lure',
    category: 'OTP & Trojan APK',
    text: `Dear Customer, Your SBI YONO Account will be DEACTIVATED within 24 Hours due to incomplete PAN KYC. To prevent immediate suspension and Rs. 5000 penalty, update immediately by installing our verified bank security patch: http://sbi-kyc-update-portal.net/SBI_Support_v4.apk . Do not share your OTP with anyone.`,
    phone: '+91 98721 54321',
    ip: '103.251.167.24',
    loss: '$14,800.00'
  },
  {
    name: 'FedEx Narcotics Digital Arrest',
    category: 'Digital Arrest Extortion',
    text: `URGENT: This is Inspector Ajay Kumar from Mumbai Cyber Crime & Narcotics Control Bureau. A FedEx parcel (AWB #8921-9921) dispatched under your Aadhaar ID containing 5 MDMA passports and illegal narcotics has been seized at international cargo. You are under immediate DIGITAL ARREST. Connect to our Skype investigation officer immediately to verify your bank accounts for national security clearance or local police will arrive at your residence in 30 minutes.`,
    phone: '+91 99812 04918',
    ip: '119.82.252.10',
    loss: '$42,500.00'
  },
  {
    name: 'Electricity Cutoff Power Threat',
    category: 'Utility Phishing',
    text: `Dear consumer, Your Electricity power connection will be DISCONNECTED tonight at 9:30 PM from the power station office because your previous month bill was not updated. Please contact our electricity nodal officer immediately on 9845210921 or pay Rs 11 update charge to avoid disconnection.`,
    phone: '+91 98452 10921',
    ip: '103.149.28.17',
    loss: '$3,200.00'
  },
  {
    name: 'Part-time Review Task & Ponzi',
    category: 'Telegram Task Fraud',
    text: `Hello! I am Sarah from Google Maps HR Department. We offer part-time remote work. Like 3 hotel places on Google Maps and earn $50 daily. Payouts via Instant USDT/Crypto or UPI transfer. Join our VIP Telegram channel @task_wealth_growth_2026 to claim your first test bonus of $15 right now.`,
    phone: '+62 812 9491 221',
    ip: '45.142.214.88',
    loss: '$8,900.00'
  }
];

export const AIForensicLab: React.FC = () => {
  const [inputText, setInputText] = useState(SCAM_PRESETS[0].text);
  const [scamType, setScamType] = useState(SCAM_PRESETS[0].category);
  const [suspectPhone, setSuspectPhone] = useState(SCAM_PRESETS[0].phone);
  const [suspectIp, setSuspectIp] = useState(SCAM_PRESETS[0].ip);
  const [victimLoss, setVictimLoss] = useState(SCAM_PRESETS[0].loss);

  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ScamAnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRunAnalysis = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      const resp = await fetch('/api/ai/analyze-scam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText,
          scamType,
          suspectPhone,
          suspectIp,
          victimLoss
        })
      });

      const res = await resp.json();
      if (res.success && res.analysis) {
        setAnalysis(res.analysis);
      } else {
        setErrorMsg(res.error || 'AI analysis response failed');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Failed to communicate with AI Cyber Forensics engine');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPreset = (preset: typeof SCAM_PRESETS[0]) => {
    setInputText(preset.text);
    setScamType(preset.category);
    setSuspectPhone(preset.phone);
    setSuspectIp(preset.ip);
    setVictimLoss(preset.loss);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Scenario Selectors */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                AI Fraud Forensics & OTP Scam Deobfuscator
              </h2>
              <p className="text-xs text-slate-400">
                Powered by Gemini 3.8 Flash · Social Engineering Linguistic Modeling & Attribution
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>MODEL: GEMINI-3.8-FLASH</span>
            <span>·</span>
            <span>ENGINE: FORENSIC-V2</span>
          </div>
        </div>

        {/* Presets */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-500 whitespace-nowrap font-medium">Quick Incident Presets:</span>
          {SCAM_PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => handleSelectPreset(p)}
              className="px-2.5 py-1 bg-slate-950 border border-slate-800 hover:border-amber-500/50 hover:text-amber-300 text-slate-300 rounded text-xs whitespace-nowrap transition-colors"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Input Workbench Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form & Raw Evidence Input (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                Evidence Payload / Transcript
              </span>
              <span className="text-[11px] font-mono text-slate-500">RAW_INPUT_BUFFER</span>
            </div>

            <textarea
              rows={6}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste suspicious SMS, WhatsApp message, extortion call transcript, or fake OTP lure here..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 focus:outline-none rounded-md p-3 text-xs text-slate-200 placeholder:text-slate-600 font-mono leading-relaxed"
            />

            {/* Suspect Meta Inputs */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">Suspect Phone / Sender ID</label>
                <input
                  type="text"
                  value={suspectPhone}
                  onChange={(e) => setSuspectPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 font-mono"
                  placeholder="+91..."
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">Suspect Origin IP</label>
                <input
                  type="text"
                  value={suspectIp}
                  onChange={(e) => setSuspectIp(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 font-mono"
                  placeholder="103.xxx..."
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">Reported Financial Loss</label>
                <input
                  type="text"
                  value={victimLoss}
                  onChange={(e) => setVictimLoss(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 font-mono"
                  placeholder="$0.00"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">Incident Category</label>
                <input
                  type="text"
                  value={scamType}
                  onChange={(e) => setScamType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 font-mono"
                  placeholder="OTP / Wire Fraud"
                />
              </div>
            </div>

            <button
              onClick={handleRunAnalysis}
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-md text-xs tracking-wide transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Performing AI Forensic Extraction...' : 'Analyze Threat with Gemini AI'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: AI Forensic Intelligence Output (7 cols) */}
        <div className="lg:col-span-7">
          {errorMsg && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-300 text-xs mb-4">
              Error: {errorMsg}
            </div>
          )}

          {!analysis && !loading && (
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-10 text-center flex flex-col items-center justify-center h-full min-h-[380px]">
              <AlertOctagon className="w-10 h-10 text-slate-700 mb-3" />
              <h3 className="text-sm font-semibold text-slate-300">Awaiting Incident Triage</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Select a preset or paste evidence text on the left, then click "Analyze Threat with Gemini AI" to extract psychological coercion triggers, technical IoCs, and syndicate attribution.
              </p>
            </div>
          )}

          {loading && (
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-10 flex flex-col items-center justify-center h-full min-h-[380px] space-y-4">
              <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-mono text-slate-400">
                DISSECTING LINGUISTIC PATTERNS & ATTRIBUTION MATRICES...
              </p>
            </div>
          )}

          {analysis && !loading && (
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-5">
              {/* Header Score & Classification */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">CATEGORY:</span>
                    <span className="text-xs font-bold text-amber-400">{analysis.threatCategory}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">
                    {analysis.severityRating} Threat Classification
                  </h3>
                </div>

                <div className="flex items-baseline gap-2 bg-slate-950 px-3.5 py-1.5 rounded border border-slate-800">
                  <span className="text-xs font-mono text-slate-400">THREAT INDEX</span>
                  <span className="text-2xl font-bold font-mono text-rose-400 tabular-nums">
                    {analysis.threatScore}
                  </span>
                  <span className="text-xs font-mono text-slate-500">/ 100</span>
                </div>
              </div>

              {/* Modus Operandi Narrative */}
              <div>
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Modus Operandi Breakdown
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded border border-slate-800/80">
                  {analysis.modusOperandiSummary}
                </p>
              </div>

              {/* Psychological Social Engineering Vectors */}
              <div>
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Social Engineering Coercion Vectors
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {analysis.socialEngineeringVectors.map((vec, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-300"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
                      <span className="truncate">{vec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Syndicate Attribution */}
              <div className="bg-slate-950 border border-slate-800/80 rounded p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">Cluster Attribution</span>
                  <span className="font-mono text-amber-400">{analysis.syndicateAttribution?.knownCluster}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Estimated Sophistication</span>
                  <span className="text-slate-200 font-medium">
                    {analysis.syndicateAttribution?.estimatedSophistication}
                  </span>
                </div>
                <div className="text-xs pt-1 border-t border-slate-800">
                  <span className="text-slate-500">Typical Cashout Path: </span>
                  <span className="text-slate-300 font-mono text-[11px]">
                    {analysis.syndicateAttribution?.typicalCashoutRoute}
                  </span>
                </div>
              </div>

              {/* Law Enforcement Directives */}
              <div>
                <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Statutory Law Enforcement Directives</span>
                </h4>
                <div className="space-y-1.5 text-xs">
                  {analysis.lawEnforcementDirectives.map((dir, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 bg-emerald-950/20 border border-emerald-900/30 rounded text-slate-300">
                      <span className="font-mono text-emerald-400 text-xs shrink-0">{i + 1}.</span>
                      <span>{dir}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Immediate Victim Advisory */}
              <div className="pt-2 border-t border-slate-800">
                <span className="text-xs font-semibold text-slate-400 block mb-1">Immediate Victim Guidance:</span>
                <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                  {analysis.victimImmediateAdvisory.map((adv, idx) => (
                    <li key={idx}>{adv}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
