import React, { useState } from 'react';
import { BlacklistEntry } from '../types';
import { ShieldAlert, Plus, Search, Check, AlertCircle, Building2, PhoneCall, Globe, CreditCard } from 'lucide-react';

const INITIAL_REGISTRY: BlacklistEntry[] = [
  {
    id: 'MULE-01',
    type: 'BANK_MULE',
    identifier: 'SBIN0004928 / 30992188412',
    holderOrEntity: 'Aakash Mondal (Ranchi Branch)',
    riskRating: 'CRITICAL',
    associatedCase: 'CC-2026-9041',
    flaggedDate: '2026-10-14',
    jurisdiction: 'Jharkhand Nodal'
  },
  {
    id: 'MULE-02',
    type: 'PHONE_SPOOF',
    identifier: '+91 98721 54321',
    holderOrEntity: 'VoIP SIP Gateway (Fake SBI Header)',
    riskRating: 'CRITICAL',
    associatedCase: 'CC-2026-9041',
    flaggedDate: '2026-10-14',
    jurisdiction: 'DoT Eastern Circle'
  },
  {
    id: 'MULE-03',
    type: 'UPI_WALLET',
    identifier: 'paytm-919654021984@paytm',
    holderOrEntity: 'Nuh Mewat SIM Relay Account',
    riskRating: 'HIGH',
    associatedCase: 'CC-2026-6410',
    flaggedDate: '2026-10-11',
    jurisdiction: 'Haryana Police'
  },
  {
    id: 'MULE-04',
    type: 'IP_PROXY',
    identifier: '45.142.214.88:443',
    holderOrEntity: 'Bulletproof Phishing Host Palace',
    riskRating: 'CRITICAL',
    associatedCase: 'CC-2026-7630',
    flaggedDate: '2026-10-12',
    jurisdiction: 'EUROPOL Cyber Division'
  },
  {
    id: 'MULE-05',
    type: 'BANK_MULE',
    identifier: 'SWIFT: ABAAKHPP / 001928410',
    holderOrEntity: 'Sihanoukville Tech Escrow Ltd',
    riskRating: 'CRITICAL',
    associatedCase: 'CC-2026-8815',
    flaggedDate: '2026-10-13',
    jurisdiction: 'INTERPOL Purple Notice'
  }
];

export const MuleRegistry: React.FC = () => {
  const [registry, setRegistry] = useState<BlacklistEntry[]>(INITIAL_REGISTRY);
  const [search, setSearch] = useState('');
  const [newType, setNewType] = useState<BlacklistEntry['type']>('BANK_MULE');
  const [newId, setNewId] = useState('');
  const [newHolder, setNewHolder] = useState('');
  const [newJurisdiction, setNewJurisdiction] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newId.trim()) return;

    const entry: BlacklistEntry = {
      id: `MULE-0${registry.length + 1}`,
      type: newType,
      identifier: newId,
      holderOrEntity: newHolder || 'Unidentified Suspect',
      riskRating: 'CRITICAL',
      associatedCase: 'MANUAL_OFFICER_ENTRY',
      flaggedDate: new Date().toISOString().substring(0, 10),
      jurisdiction: newJurisdiction || 'Central Cyber Unit'
    };

    setRegistry([entry, ...registry]);
    setNewId('');
    setNewHolder('');
    setNewJurisdiction('');
    setShowAddForm(false);
  };

  const filtered = registry.filter(
    (r) =>
      r.identifier.toLowerCase().includes(search.toLowerCase()) ||
      r.holderOrEntity.toLowerCase().includes(search.toLowerCase()) ||
      r.jurisdiction.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-amber-400" />
            <span>National Mule Account & Telecom Blacklist Registry</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Inter-agency synchronized database of compromised beneficiary bank accounts, VoIP spoof numbers, and malicious IPs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search accounts, phones, or IPs..."
              className="bg-slate-950 border border-slate-800 rounded pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded text-xs transition-colors flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Flag Target</span>
          </button>
        </div>
      </div>

      {/* Add Entry Form Modal/Accordion */}
      {showAddForm && (
        <form onSubmit={handleAdd} className="bg-slate-900 border border-amber-500/30 rounded-lg p-4 space-y-3">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Flag New Suspect Entity into National Blacklist
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Entity Type</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-slate-200 font-mono"
              >
                <option value="BANK_MULE">Bank Account (IFSC / IBAN)</option>
                <option value="PHONE_SPOOF">VoIP / Spoofed Phone Number</option>
                <option value="UPI_WALLET">UPI Handle / Wallet</option>
                <option value="IP_PROXY">Malicious Host / IP</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Identifier (Number / A/C / IP)</label>
              <input
                type="text"
                required
                value={newId}
                onChange={(e) => setNewId(e.target.value)}
                placeholder="e.g. HDFC000123 / 9841..."
                className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-slate-200 font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Holder / Syndicate Entity</label>
              <input
                type="text"
                value={newHolder}
                onChange={(e) => setNewHolder(e.target.value)}
                placeholder="Suspect Name / Alias"
                className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-slate-200 font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Reporting Jurisdiction</label>
              <input
                type="text"
                value={newJurisdiction}
                onChange={(e) => setNewJurisdiction(e.target.value)}
                placeholder="e.g. Cyber Cell HQ"
                className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-slate-200 font-mono"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1 bg-slate-800 text-slate-300 rounded text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-rose-500 hover:bg-rose-400 text-white font-bold rounded text-xs"
            >
              Add to Freeze Blacklist
            </button>
          </div>
        </form>
      )}

      {/* Table Display */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/80 font-mono text-[11px] text-slate-400 uppercase">
              <th className="py-2.5 px-4">Type</th>
              <th className="py-2.5 px-4">Identifier / Coordinate</th>
              <th className="py-2.5 px-4">Beneficiary / Alias</th>
              <th className="py-2.5 px-4">Threat Rating</th>
              <th className="py-2.5 px-4">Case Linked</th>
              <th className="py-2.5 px-4">Jurisdiction</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 font-mono">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-2.5 px-4 text-slate-300">
                  <span className="flex items-center gap-1.5">
                    {item.type === 'BANK_MULE' && <Building2 className="w-3.5 h-3.5 text-amber-400" />}
                    {item.type === 'PHONE_SPOOF' && <PhoneCall className="w-3.5 h-3.5 text-rose-400" />}
                    {item.type === 'IP_PROXY' && <Globe className="w-3.5 h-3.5 text-blue-400" />}
                    {item.type === 'UPI_WALLET' && <CreditCard className="w-3.5 h-3.5 text-emerald-400" />}
                    <span>{item.type.replace('_', ' ')}</span>
                  </span>
                </td>
                <td className="py-2.5 px-4 text-amber-300 font-bold">{item.identifier}</td>
                <td className="py-2.5 px-4 text-slate-200">{item.holderOrEntity}</td>
                <td className="py-2.5 px-4">
                  <span className="text-rose-400 font-bold px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-[10px]">
                    {item.riskRating}
                  </span>
                </td>
                <td className="py-2.5 px-4 text-slate-400">{item.associatedCase}</td>
                <td className="py-2.5 px-4 text-slate-400">{item.jurisdiction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
