import React, { useState } from 'react';
import { X, ShieldAlert, Check } from 'lucide-react';
import { CaseItem } from '../types';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCaseCreated: (newCase: CaseItem) => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, onCaseCreated }) => {
  const [title, setTitle] = useState('');
  const [scamType, setScamType] = useState('OTP & Banking Trojan');
  const [victimName, setVictimName] = useState('');
  const [victimLoss, setVictimLoss] = useState('$5,000.00');
  const [suspectPhone, setSuspectPhone] = useState('+91 ');
  const [suspectIp, setSuspectIp] = useState('103.251.167.24');
  const [muleAccount, setMuleAccount] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [priority, setPriority] = useState<CaseItem['priority']>('CRITICAL');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const resp = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          scamType,
          victimName: victimName || 'Complainant',
          victimLoss: victimLoss || '$0.00',
          suspectPhone,
          suspectIp,
          suspectLocation: 'Triangulation Pending (Jamtara/Mewat Sector)',
          gpsCoordinates: { lat: 23.9629, lon: 86.8016 },
          cellTower: `BTS-${Math.floor(1000 + Math.random() * 9000)}`,
          accuracyRadiusKm: 1.5,
          isp: 'Cellular Gateway',
          muleAccount: muleAccount || 'Under Subpoena Audit',
          evidenceHash: 'c7d1e84f50918d' + Math.random().toString(16).substring(2),
          synopsis,
          priority,
          indicators: [`Suspect IP: ${suspectIp}`, `Suspect Phone: ${suspectPhone}`],
        }),
      });

      const data = await resp.json();
      if (data.success && data.case) {
        onCaseCreated(data.case);
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-lg max-w-2xl w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-bold text-white uppercase tracking-wider">
            Register New Fraud Incident / Cyber Crime FIR Docket
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div>
            <label className="text-slate-300 block mb-1 font-sans font-semibold">Incident Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. State Bank OTP Lure & APK Trojan Attack"
              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-100 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Scam Classification</label>
              <select
                value={scamType}
                onChange={(e) => setScamType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-100"
              >
                <option value="OTP & Banking Trojan">OTP Interception & Banking Trojan</option>
                <option value="Digital Arrest & Wire Fraud">Digital Arrest Customs/Police Extortion</option>
                <option value="Phishing & Credential Harvest">Phishing Domain & Card Harvest</option>
                <option value="SIM Swap & Sextortion">SIM Swap & Extortion</option>
                <option value="Task/Investment Ponzi">Telegram Job/Task Investment Fraud</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Threat Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-100"
              >
                <option value="CRITICAL">CRITICAL (Active Financial Drain)</option>
                <option value="HIGH">HIGH (Immediate Subpoena Required)</option>
                <option value="MEDIUM">MEDIUM (Attempted / Thwarted)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Complainant / Victim Name</label>
              <input
                type="text"
                value={victimName}
                onChange={(e) => setVictimName(e.target.value)}
                placeholder="Dr. John Doe"
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-100"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Reported Financial Loss</label>
              <input
                type="text"
                value={victimLoss}
                onChange={(e) => setVictimLoss(e.target.value)}
                placeholder="$12,000.00"
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Suspect Phone / Sender ID</label>
              <input
                type="text"
                value={suspectPhone}
                onChange={(e) => setSuspectPhone(e.target.value)}
                placeholder="+91 98..."
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-100"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Suspect IP Address</label>
              <input
                type="text"
                value={suspectIp}
                onChange={(e) => setSuspectIp(e.target.value)}
                placeholder="103.xxx..."
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-100"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Mule Account / UPI ID</label>
              <input
                type="text"
                value={muleAccount}
                onChange={(e) => setMuleAccount(e.target.value)}
                placeholder="SBIN000123 / 9871..."
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Incident Synopsis / Victim Deposition</label>
            <textarea
              rows={3}
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              placeholder="Detail how the scammer approached, the fraudulent link or APK sent, and the OTP extraction method..."
              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-100 font-sans"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-sans"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded font-sans transition-colors"
            >
              {submitting ? 'Registering Docket...' : 'Submit Incident & Trigger Triage'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
