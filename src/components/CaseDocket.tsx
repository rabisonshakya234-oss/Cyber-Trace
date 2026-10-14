import React, { useState } from 'react';
import { CaseItem } from '../types';
import { Search, MapPin, Phone, ShieldAlert, ArrowUpRight, FolderGit2, AlertTriangle, Filter } from 'lucide-react';

interface CaseDocketProps {
  cases: CaseItem[];
  onSelectCaseForMap: (ip: string) => void;
  onSelectCaseForFIR: (caseId: string) => void;
  onOpenReportModal: () => void;
}

export const CaseDocket: React.FC<CaseDocketProps> = ({
  cases,
  onSelectCaseForMap,
  onSelectCaseForFIR,
  onOpenReportModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');

  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.suspectIp.includes(searchTerm) ||
      c.suspectLocation.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPriority = filterPriority === 'ALL' || c.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="space-y-4">
      {/* Top Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by case #, suspect IP, location, or syndicate..."
              className="w-full bg-slate-950 border border-slate-800 rounded-md pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded p-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
            <button
              onClick={() => setFilterPriority('ALL')}
              className={`px-2 py-0.5 rounded text-xs transition-colors ${
                filterPriority === 'ALL' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterPriority('CRITICAL')}
              className={`px-2 py-0.5 rounded text-xs transition-colors ${
                filterPriority === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Critical
            </button>
            <button
              onClick={() => setFilterPriority('HIGH')}
              className={`px-2 py-0.5 rounded text-xs transition-colors ${
                filterPriority === 'HIGH' ? 'bg-amber-500/20 text-amber-300 font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              High
            </button>
          </div>

          <button
            onClick={onOpenReportModal}
            className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded text-xs transition-colors whitespace-nowrap"
          >
            + File Incident
          </button>
        </div>
      </div>

      {/* Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCases.map((caseItem) => (
          <div
            key={caseItem.id}
            className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3.5 hover:border-slate-700 transition-colors"
          >
            {/* Top Bar with Case ID and Status */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-amber-400 font-bold">{caseItem.caseNumber}</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-slate-400">{caseItem.reportedAt}</span>
                </div>
                <h3 className="text-sm font-bold text-white mt-1 leading-snug">{caseItem.title}</h3>
              </div>

              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase border font-mono ${
                  caseItem.priority === 'CRITICAL'
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}
              >
                {caseItem.priority}
              </span>
            </div>

            {/* Synopsis */}
            <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{caseItem.synopsis}</p>

            {/* Suspect Coordinates & Telecom Details */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded p-2.5 space-y-1.5 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-500">SUSPECT IP</span>
                <span className="text-amber-400 font-semibold">{caseItem.suspectIp}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-500">LOCATION</span>
                <span className="text-slate-200 truncate max-w-[220px] text-right">{caseItem.suspectLocation}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-500">CELL TOWER ID</span>
                <span className="text-blue-400">{caseItem.cellTower}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-500">MULE ACCOUNT</span>
                <span className="text-slate-300 truncate max-w-[200px] text-right">{caseItem.muleAccount}</span>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-1 flex items-center justify-between text-xs">
              <div className="text-slate-500 text-[11px] font-mono">
                LOSS: <span className="text-rose-400 font-bold">{caseItem.victimLoss}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectCaseForMap(caseItem.suspectIp)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium transition-colors flex items-center gap-1"
                >
                  <MapPin className="w-3 h-3 text-amber-400" />
                  <span>Track IP</span>
                </button>
                <button
                  onClick={() => onSelectCaseForFIR(caseItem.id)}
                  className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <span>Open FIR</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
