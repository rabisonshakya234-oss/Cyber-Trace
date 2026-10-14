import React, { useState } from 'react';
import { CaseItem, FIRDocument } from '../types';
import { Printer, Shield, FileText, CheckCircle2, AlertTriangle, RefreshCw, Stamp } from 'lucide-react';

interface FIRGeneratorProps {
  cases: CaseItem[];
  selectedCaseId?: string;
}

export const FIRGenerator: React.FC<FIRGeneratorProps> = ({ cases, selectedCaseId }) => {
  const [activeCaseId, setActiveCaseId] = useState<string>(selectedCaseId || cases[0]?.id || '');
  const [loading, setLoading] = useState(false);
  const [firDoc, setFirDoc] = useState<FIRDocument | null>(null);

  const activeCase = cases.find((c) => c.id === activeCaseId) || cases[0];

  const handleGenerateFIR = async () => {
    if (!activeCase) return;
    setLoading(true);

    try {
      const resp = await fetch('/api/ai/generate-fir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseData: activeCase }),
      });
      const data = await resp.json();
      if (data.success && data.fir) {
        setFirDoc(data.fir);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Control Bar (hidden in print) */}
      <div className="no-print bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Official Courtroom Cyber Crime FIR & Forensic Dossier</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            AI-assisted generation of formal legal incident reports for police filing and court proceedings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={activeCaseId}
            onChange={(e) => {
              setActiveCaseId(e.target.value);
              setFirDoc(null);
            }}
            className="bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 font-mono"
          >
            {cases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.caseNumber} - {c.scamType} ({c.id})
              </option>
            ))}
          </select>

          <button
            onClick={handleGenerateFIR}
            disabled={loading}
            className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded text-xs transition-colors flex items-center gap-1.5"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Shield className="w-3.5 h-3.5" />}
            <span>{loading ? 'Synthesizing...' : 'Draft Legal FIR'}</span>
          </button>

          {firDoc && (
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold rounded text-xs transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Export PDF</span>
            </button>
          )}
        </div>
      </div>

      {/* When no FIR generated yet */}
      {!firDoc && !loading && (
        <div className="no-print bg-slate-900 border border-slate-800 rounded-lg p-12 text-center flex flex-col items-center justify-center">
          <FileText className="w-12 h-12 text-slate-700 mb-3" />
          <h3 className="text-sm font-semibold text-slate-300">No FIR Dossier Rendered</h3>
          <p className="text-xs text-slate-500 max-w-md mt-1 mb-4">
            Select a case from the dropdown above and click "Draft Legal FIR" to generate an authoritative First Information Report with statutory penal code charges and bank freeze orders.
          </p>
          <button
            onClick={handleGenerateFIR}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded transition-colors"
          >
            Draft FIR for Case #{activeCase?.id || 'CC-2026-9041'}
          </button>
        </div>
      )}

      {loading && (
        <div className="no-print bg-slate-900 border border-slate-800 rounded-lg p-12 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-mono text-slate-400">
            DRAFTING COURTROOM JURISPRUDENCE & STATUTORY PENAL SECTIONS...
          </span>
        </div>
      )}

      {/* Rendered Official FIR Paper Document */}
      {firDoc && (
        <div className="fir-paper max-w-4xl mx-auto bg-slate-900/95 border-2 border-slate-700 rounded-lg p-6 sm:p-10 text-slate-200 shadow-xl space-y-6 relative overflow-hidden">
          {/* Official Agency Header Lockup */}
          <div className="border-b-2 border-slate-700 pb-6 flex items-start justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src="/src/assets/images/cyber_crime_insignia_1791985452607.jpg"
                alt="Cyber Crime Investigation Division Crest"
                className="w-20 h-20 rounded-full border border-slate-600 shadow-md object-cover"
                referrerPolicy="no-referrer"
              />
              <div>
                <span className="text-[11px] font-mono tracking-widest text-amber-400 uppercase font-semibold block">
                  GOVERNMENT OF THE STATE · POLICE HEADQUARTERS
                </span>
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white uppercase">
                  SPECIAL CYBER CRIME INVESTIGATION DIVISION
                </h1>
                <p className="text-xs text-slate-400">
                  Central Electronic Evidence Laboratory & Fraud Mitigation Unit
                </p>
              </div>
            </div>

            <div className="text-right font-mono text-xs space-y-1">
              <div className="text-rose-400 font-bold">{firDoc.firNumber}</div>
              <div className="text-slate-400">DATE: {new Date().toLocaleDateString()}</div>
              <div className="text-emerald-400 text-[11px]">JUDICIAL SEAL: VALID</div>
            </div>
          </div>

          {/* Incident Overview Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded border border-slate-800 text-xs font-mono">
            <div>
              <span className="text-slate-500 block text-[11px]">DOCKET REF</span>
              <span className="text-amber-400 font-bold">{activeCase?.caseNumber}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">CLASSIFICATION</span>
              <span className="text-slate-200">{activeCase?.scamType}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">COMPLAINANT</span>
              <span className="text-slate-200">{activeCase?.victimName}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">QUANTUM OF FRAUD</span>
              <span className="text-rose-400 font-bold">{activeCase?.victimLoss}</span>
            </div>
          </div>

          {/* Applicable Legal Sections */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-1">
              I. Applicable Statutory Penal Code Sections
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {firDoc.penalCodeSections?.map((sec, i) => (
                <div key={i} className="p-2 bg-slate-950 rounded border border-slate-800 font-mono text-slate-300">
                  {sec}
                </div>
              ))}
            </div>
          </div>

          {/* Brief Facts of the Case */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-1">
              II. Statement of Facts & Modus Operandi
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3.5 rounded border border-slate-800 font-serif text-justify">
              {firDoc.briefFactsOfTheCase}
            </p>
          </div>

          {/* Digital Forensic Findings Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-1">
              III. Electronic Evidence & Technical Attributions
            </h3>
            <div className="bg-slate-950 rounded border border-slate-800 overflow-hidden text-xs font-mono">
              <table className="w-full text-left">
                <tbody>
                  <tr className="border-b border-slate-800/80">
                    <td className="px-3 py-2 text-slate-400 w-1/3">Suspect IP Origin</td>
                    <td className="px-3 py-2 text-amber-300 font-bold">
                      {firDoc.digitalForensicFindings?.ipOrigin || activeCase?.suspectIp}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-800/80">
                    <td className="px-3 py-2 text-slate-400">GPS & Cellular Triangulation</td>
                    <td className="px-3 py-2 text-slate-200">
                      {firDoc.digitalForensicFindings?.gpsTriangulation ||
                        `${activeCase?.gpsCoordinates.lat}°, ${activeCase?.gpsCoordinates.lon}° (Tower: ${activeCase?.cellTower})`}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-800/80">
                    <td className="px-3 py-2 text-slate-400">Base Transceiver Station (BTS)</td>
                    <td className="px-3 py-2 text-blue-400">{activeCase?.cellTower}</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 text-slate-400">Chain of Custody SHA-256 Hash</td>
                    <td className="px-3 py-2 text-emerald-400 break-all text-[11px]">
                      {firDoc.digitalForensicFindings?.electronicEvidenceHash || activeCase?.evidenceHash}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Banking Order Directive */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider border-b border-slate-800 pb-1">
              IV. Formal Directive to Nodal Banking Authority (CrPC Sec 91/102)
            </h3>
            <div className="p-3 bg-rose-950/20 border border-rose-900/40 rounded text-xs text-slate-300 leading-relaxed font-mono">
              {firDoc.muleAccountDirectives}
            </div>
          </div>

          {/* Telecom Preservation Order */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider border-b border-slate-800 pb-1">
              V. Directive to Telecom Service Provider (Preservation of CDR / IPDR)
            </h3>
            <div className="p-3 bg-blue-950/20 border border-blue-900/40 rounded text-xs text-slate-300 leading-relaxed font-mono">
              {firDoc.telecomOrderDirective}
            </div>
          </div>

          {/* Signatures & Official Stamp */}
          <div className="pt-6 border-t-2 border-slate-700 flex items-end justify-between text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>ELECTRONICALLY VERIFIED BY STATE DIGITAL REPOSITORY</span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Report compiled in compliance with Section 65B Indian Evidence Act / Federal Rules of Evidence Rule 902.
              </p>
            </div>

            <div className="text-right">
              <div className="w-36 h-10 border-b border-dashed border-slate-600 mb-1 ml-auto"></div>
              <span className="font-bold text-white block">{firDoc.leadInvestigatorSignoff || 'Inspector D. S. Rathore'}</span>
              <span className="text-slate-400 text-[11px]">Officer-in-Charge · Cyber Forensics Lab</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
