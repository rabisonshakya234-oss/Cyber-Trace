import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MapTracker } from './components/MapTracker';
import { AIForensicLab } from './components/AIForensicLab';
import { PythonWorkbench } from './components/PythonWorkbench';
import { CaseDocket } from './components/CaseDocket';
import { FIRGenerator } from './components/FIRGenerator';
import { MuleRegistry } from './components/MuleRegistry';
import { ReportModal } from './components/ReportModal';
import { CaseItem } from './types';
import { ShieldCheck, Crosshair, Radio, FileText, Database, Terminal, AlertTriangle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'tracker' | 'ai-lab' | 'python' | 'cases' | 'fir' | 'registry'>('tracker');
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [selectedIpForMap, setSelectedIpForMap] = useState<string>('103.251.167.24');
  const [selectedCaseIdForFIR, setSelectedCaseIdForFIR] = useState<string>('');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const resp = await fetch('/api/cases');
      const data = await resp.json();
      if (data.cases) {
        setCases(data.cases);
        if (!selectedCaseIdForFIR && data.cases.length > 0) {
          setSelectedCaseIdForFIR(data.cases[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch cases:', err);
    }
  };

  const handleSelectCaseForMap = (ip: string) => {
    setSelectedIpForMap(ip);
    setActiveTab('tracker');
  };

  const handleSelectCaseForFIR = (caseId: string) => {
    setSelectedCaseIdForFIR(caseId);
    setActiveTab('fir');
  };

  const handleCaseCreated = (newCase: CaseItem) => {
    setCases([newCase, ...cases]);
    setSelectedIpForMap(newCase.suspectIp);
    setSelectedCaseIdForFIR(newCase.id);
    setActiveTab('cases');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenReportModal={() => setIsReportModalOpen(true)}
      />

      {/* Editorial Station Status Strip (Unboxed metadata, typographic separators) */}
      <div className="no-print bg-slate-900/60 border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-200">National Cyber Crime Investigation Network</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Station ID: CC-DIV-402</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-emerald-400 font-medium">Telecom & Banking Gateways Active</span>
          </div>

          <div className="flex items-center gap-4 font-mono text-[11px] tabular-nums">
            <span>ACTIVE CASES: <strong className="text-white">{cases.length}</strong></span>
            <span aria-hidden="true" className="text-slate-700">|</span>
            <span>CELL MASTS MONITORED: <strong className="text-amber-400">14</strong></span>
            <span aria-hidden="true" className="text-slate-700">|</span>
            <span>MULE BENEFICIARIES: <strong className="text-rose-400">28</strong></span>
          </div>
        </div>
      </div>

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'tracker' && (
          <MapTracker
            selectedCaseIp={selectedIpForMap}
            onInvestigateScam={(ip) => {
              setSelectedIpForMap(ip);
              setActiveTab('ai-lab');
            }}
          />
        )}

        {activeTab === 'ai-lab' && <AIForensicLab />}

        {activeTab === 'python' && <PythonWorkbench />}

        {activeTab === 'cases' && (
          <CaseDocket
            cases={cases}
            onSelectCaseForMap={handleSelectCaseForMap}
            onSelectCaseForFIR={handleSelectCaseForFIR}
            onOpenReportModal={() => setIsReportModalOpen(true)}
          />
        )}

        {activeTab === 'fir' && (
          <FIRGenerator cases={cases} selectedCaseId={selectedCaseIdForFIR} />
        )}

        {activeTab === 'registry' && <MuleRegistry />}
      </main>

      {/* Official Clean Footer (No fake engines, clean copyright and authority notice) */}
      <footer className="no-print border-t border-slate-900 bg-slate-950 py-6 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">CYBER-TRACE</span>
            <span aria-hidden="true">·</span>
            <span>Law Enforcement Forensic Intelligence & Fraud Reporting Workstation</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>COMPLIANCE: CRPC 65B & IT ACT 66D</span>
            <span aria-hidden="true">·</span>
            <span>RESTRICTED LAW ENFORCEMENT PORTAL</span>
          </div>
        </div>
      </footer>

      {/* Report Scam Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onCaseCreated={handleCaseCreated}
      />
    </div>
  );
}
