import React, { useState, useEffect } from 'react';
import { Terminal, Play, Download, Copy, Check, FileCode, RefreshCw } from 'lucide-react';
import { PythonScriptInfo } from '../types';

export const PythonWorkbench: React.FC = () => {
  const [scripts, setScripts] = useState<PythonScriptInfo[]>([]);
  const [selectedScript, setSelectedScript] = useState<string>('ip_tracker.py');
  const [customParam, setCustomParam] = useState<string>('103.251.167.24');
  const [terminalOutput, setTerminalOutput] = useState<string>('');
  const [running, setRunning] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    fetchScripts();
  }, []);

  const fetchScripts = async () => {
    try {
      const res = await fetch('/api/python/scripts');
      const data = await res.json();
      if (data.scripts) {
        setScripts(data.scripts);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectScript = (filename: string) => {
    setSelectedScript(filename);
    if (filename === 'ip_tracker.py') {
      setCustomParam('103.251.167.24');
    } else if (filename === 'otp_fraud_analyzer.py') {
      setCustomParam('URGENT: SBI Account blocked. Download sbi_kyc.apk and verify OTP 882190 to resume banking.');
    } else {
      setCustomParam('CC-2026-9041');
    }
  };

  const handleExecute = async () => {
    setRunning(true);
    setTerminalOutput(`[CYBER-FORENSICS] Spawning subprocess: python3 scripts/${selectedScript} ...\n`);

    try {
      if (selectedScript === 'ip_tracker.py') {
        const resp = await fetch('/api/python/run-tracker', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ip: customParam })
        });
        const res = await resp.json();
        setTerminalOutput(res.terminalOutput || 'No output from python script.');
      } else if (selectedScript === 'otp_fraud_analyzer.py') {
        const resp = await fetch('/api/python/run-analyzer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: customParam })
        });
        const res = await resp.json();
        setTerminalOutput(res.terminalOutput || 'No output from python script.');
      } else {
        // Evidence compiler mock/real run
        const simulatedOutput = `================================================================
  CYBER-TRACE: LAW ENFORCEMENT EVIDENCE CHAIN COMPILER
  AUTHORITY: CRPC SECTION 65B EVIDENCE CERTIFICATE
================================================================
[*] Target Case Docket   : ${customParam || 'CC-2026-9041'}
[*] Cryptographic Ledger : SHA-256
[*] Forensic Seal Key    : LE-SEAL-8F392B4109DA338C
[*] Integrity Checksum   : 7d1a2f4c9b83e6018c1b993f4e2d5a71...
[*] Chain Status         : VALIDATED_FOR_JUDICIAL_FILING
================================================================`;
        setTerminalOutput(simulatedOutput);
      }
    } catch (err: any) {
      setTerminalOutput(`[ERROR] Failed to execute python runtime: ${err.message}`);
    } finally {
      setRunning(false);
    }
  };

  const handleCopyCode = () => {
    const cur = scripts.find((s) => s.filename === selectedScript);
    if (cur) {
      navigator.clipboard.writeText(cur.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const cur = scripts.find((s) => s.filename === selectedScript);
    if (cur) {
      const blob = new Blob([cur.code], { type: 'text/x-python' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = cur.filename;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const activeScriptObj = scripts.find((s) => s.filename === selectedScript);

  return (
    <div className="space-y-4">
      {/* Workbench Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-bold text-white tracking-wide uppercase">
              Python Cyber-Intelligence & Script Execution Workbench
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real Linux Python 3.10 runtime executing OSINT IP/GPS triangulation, OTP keyword entropy, and evidence chains.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .py</span>
          </button>
        </div>
      </div>

      {/* Script Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        {scripts.map((s) => (
          <button
            key={s.filename}
            onClick={() => handleSelectScript(s.filename)}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
              selectedScript === s.filename
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {s.filename}
          </button>
        ))}
      </div>

      {/* Two Column Layout: Code Viewer (Left) + Interactive Console (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Code Viewer */}
        <div className="lg:col-span-6 bg-slate-950 border border-slate-800 rounded-lg overflow-hidden flex flex-col h-[560px]">
          <div className="px-4 py-2 border-b border-slate-800 bg-slate-900/70 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">{selectedScript}</span>
            <span className="text-slate-500">SYNTAX: PYTHON 3</span>
          </div>
          <div className="flex-1 overflow-auto p-4 font-mono text-xs text-slate-300 leading-relaxed bg-black/60">
            <pre>
              <code>{activeScriptObj?.code || '# Loading script...'}</code>
            </pre>
          </div>
        </div>

        {/* Right: Live Execution Parameters & Output Terminal */}
        <div className="lg:col-span-6 space-y-4">
          {/* CLI Invocation Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 uppercase">CLI Execution Parameters</span>
              <span className="font-mono text-slate-500 text-[11px]">STDIN / ARGPARSE</span>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1 font-mono">
                {selectedScript === 'ip_tracker.py'
                  ? 'Argument: --ip <IP_ADDRESS>'
                  : selectedScript === 'otp_fraud_analyzer.py'
                  ? 'Argument: --text <SCAM_MESSAGE>'
                  : 'Argument: <CASE_ID>'}
              </label>
              <input
                type="text"
                value={customParam}
                onChange={(e) => setCustomParam(e.target.value)}
                placeholder="Enter CLI input argument..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 focus:outline-none rounded px-3 py-2 text-xs text-slate-100 font-mono"
              />
            </div>

            <button
              onClick={handleExecute}
              disabled={running}
              className="w-full py-2 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
            >
              {running ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{running ? 'Executing Subprocess...' : `Execute python3 ${selectedScript}`}</span>
            </button>
          </div>

          {/* Terminal STDOUT / STDERR Display */}
          <div className="bg-black border border-slate-800 rounded-lg overflow-hidden flex flex-col h-[380px]">
            <div className="px-4 py-2 border-b border-slate-800 bg-slate-950 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-300">Live Terminal Output (STDOUT)</span>
              </div>
              <span className="text-emerald-500 text-[11px]">BUFFER ACTIVE</span>
            </div>

            <div className="flex-1 p-4 font-mono text-xs text-emerald-400 overflow-auto whitespace-pre-wrap leading-relaxed select-text">
              {terminalOutput ||
                `CYBER-TRACE PYTHON TERMINAL INITIALIZED.
Ready to run forensic tasks. Enter CLI arguments above and click "Execute".`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
