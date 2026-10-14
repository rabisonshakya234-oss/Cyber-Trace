import React from 'react';
import { ShieldAlert, PlusCircle } from 'lucide-react';

interface HeaderProps {
  activeTab: 'tracker' | 'ai-lab' | 'python' | 'cases' | 'fir' | 'registry';
  onSelectTab: (tab: 'tracker' | 'ai-lab' | 'python' | 'cases' | 'fir' | 'registry') => void;
  onOpenReportModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onSelectTab, onOpenReportModal }) => {
  return (
    <header className="no-print border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
            CYBER-TRACE <span className="text-amber-400 font-normal text-sm ml-1">CYBER CRIME UNIT</span>
          </span>
        </div>

        {/* Zone 2: Navigation Links (Single-line, unboxed, active underline) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => onSelectTab('tracker')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'tracker'
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            IP & GPS Tracker
          </button>
          <button
            onClick={() => onSelectTab('ai-lab')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'ai-lab'
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            AI OTP Forensics
          </button>
          <button
            onClick={() => onSelectTab('python')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'python'
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Python Engine
          </button>
          <button
            onClick={() => onSelectTab('cases')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'cases'
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Active Docket
          </button>
          <button
            onClick={() => onSelectTab('fir')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'fir'
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Official FIR
          </button>
          <button
            onClick={() => onSelectTab('registry')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'registry'
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Mule Registry
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenReportModal}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-colors whitespace-nowrap shadow-sm shadow-amber-500/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report Scam</span>
          </button>
        </div>
      </div>
    </header>
  );
};
