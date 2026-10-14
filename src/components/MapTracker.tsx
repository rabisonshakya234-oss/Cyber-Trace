import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { IPTraceResult } from '../types';
import { Search, Radio, Crosshair, Network, AlertTriangle, ShieldCheck, Terminal, MapPin } from 'lucide-react';

interface MapTrackerProps {
  onInvestigateScam?: (ip: string) => void;
  selectedCaseIp?: string;
}

const PRESET_SYNDICATES = [
  { name: 'Jamtara OTP Hub', ip: '103.251.167.24', location: 'Jharkhand, India', type: 'OTP Interception' },
  { name: 'Nuh SIM-Swap Ring', ip: '103.149.28.17', location: 'Haryana, India', type: 'Sextortion / SIM-Swap' },
  { name: 'Sihanoukville Compound', ip: '119.82.252.10', location: 'Cambodia', type: 'Pig Butchering' },
  { name: 'Bucharest Phish Node', ip: '45.142.214.88', location: 'Romania', type: 'Banking Phishing Kit' },
  { name: 'Frankfurt Tor Relay', ip: '185.220.101.5', location: 'Germany', type: 'Darknet / Proxy Exit' },
  { name: 'Lagos Wire Mule Desk', ip: '197.210.54.12', location: 'Nigeria', type: 'Business Email / Wire' },
];

export const MapTracker: React.FC<MapTrackerProps> = ({ selectedCaseIp }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerGroupRef = useRef<L.LayerGroup | null>(null);

  const [inputIp, setInputIp] = useState(selectedCaseIp || '103.251.167.24');
  const [loading, setLoading] = useState(false);
  const [traceData, setTraceData] = useState<IPTraceResult | null>(null);
  const [terminalLog, setTerminalLog] = useState<string>('');
  const [showTerminal, setShowTerminal] = useState(false);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [23.9629, 86.8016],
        zoom: 12,
        zoomControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // CartoDB Dark Matter tiles (law enforcement dark tactical GIS theme)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      const markerGroup = L.layerGroup().addTo(map);
      markerGroupRef.current = markerGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      // Map cleanup on unmount
    };
  }, []);

  // Update map when traceData changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markerGroupRef.current || !traceData) return;

    const map = mapInstanceRef.current;
    const group = markerGroupRef.current;
    group.clearLayers();

    const { lat, lon, city, country, accuracyKm, cellTower, ip, threatScore } = traceData;

    // Center map
    map.flyTo([lat, lon], 12, { duration: 1.5 });

    // Custom Target Reticle Icon
    const targetIcon = L.divIcon({
      className: 'custom-radar-marker',
      html: `
        <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 32px; height: 32px; border-radius: 9999px; background: rgba(239, 68, 68, 0.25); border: 2px solid #ef4444; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="width: 14px; height: 14px; border-radius: 9999px; background: #ef4444; border: 2px solid #ffffff; box-shadow: 0 0 10px #ef4444;"></div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    // Suspect Location Marker
    const marker = L.marker([lat, lon], { icon: targetIcon });
    marker.bindPopup(`
      <div style="color: #0f172a; font-family: sans-serif; font-size: 12px; line-height: 1.4;">
        <strong style="color: #dc2626;">SUSPECT GEO-COORDINATE</strong><br/>
        <b>IP:</b> ${ip}<br/>
        <b>Location:</b> ${city}, ${country}<br/>
        <b>Threat Index:</b> ${threatScore}/100<br/>
        <b>Cell Mast:</b> ${cellTower}
      </div>
    `);
    group.addLayer(marker);

    // Accuracy uncertainty circle (Cellular radial estimation)
    const radiusMeters = (accuracyKm || 1.5) * 1000;
    const circle = L.circle([lat, lon], {
      color: '#f59e0b',
      fillColor: '#f59e0b',
      fillOpacity: 0.12,
      weight: 1.5,
      dashArray: '4, 4',
      radius: radiusMeters,
    });
    circle.bindTooltip(`Cellular Uncertainty Radius: +/- ${accuracyKm} km`, { sticky: true });
    group.addLayer(circle);

    // Cellular BTS Mast marker slightly offset
    const towerLat = lat + 0.007;
    const towerLon = lon - 0.005;

    const towerIcon = L.divIcon({
      className: 'tower-marker',
      html: `
        <div style="display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; background: #0f172a; border: 1.5px solid #3b82f6; border-radius: 4px; color: #60a5fa; font-size: 10px; font-weight: bold;">
          BTS
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    const towerMarker = L.marker([towerLat, towerLon], { icon: towerIcon });
    towerMarker.bindPopup(`
      <div style="color: #0f172a; font-size: 11px;">
        <strong>Cellular Base Transceiver (BTS)</strong><br/>
        <b>ID:</b> ${cellTower}<br/>
        <b>Azimuth Sector:</b> 120° Primary Azimuth
      </div>
    `);
    group.addLayer(towerMarker);

    // Triangulation Line
    const triLine = L.polyline(
      [
        [towerLat, towerLon],
        [lat, lon],
      ],
      {
        color: '#3b82f6',
        weight: 1.5,
        dashArray: '2, 4',
      }
    );
    group.addLayer(triLine);
  }, [traceData]);

  // Execute Python Trace on mount or IP change
  const handleExecuteTrace = async (targetIpToTrace?: string) => {
    const ip = (targetIpToTrace || inputIp).trim();
    if (!ip) return;

    setLoading(true);
    try {
      const response = await fetch('/api/python/run-tracker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip }),
      });
      const res = await response.json();

      if (res.data) {
        setTraceData(res.data);
      }
      setTerminalLog(res.terminalOutput || '');
    } catch (err) {
      console.error('Python trace error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleExecuteTrace(inputIp);
  }, []);

  return (
    <div className="space-y-4">
      {/* Search & Syndicate Selector Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 sm:p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* IP Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleExecuteTrace();
            }}
            className="flex items-center gap-2 flex-1"
          >
            <div className="relative flex-1">
              <Crosshair className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inputIp}
                onChange={(e) => setInputIp(e.target.value)}
                placeholder="Enter suspect IP (e.g. 103.251.167.24 or 103.149.28.17)"
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 focus:outline-none rounded-md pl-9 pr-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold rounded-md text-xs tracking-wide transition-colors whitespace-nowrap flex items-center gap-2"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{loading ? 'Tracer Running...' : 'Execute Python Trace'}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowTerminal(!showTerminal)}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition-colors"
              title="Toggle Python Terminal Log"
            >
              <Terminal className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Select Preset Syndicates */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 text-xs">
            <span className="text-slate-500 text-xs whitespace-nowrap mr-1 font-medium">Hotspots:</span>
            {PRESET_SYNDICATES.map((hub) => (
              <button
                key={hub.ip}
                onClick={() => {
                  setInputIp(hub.ip);
                  handleExecuteTrace(hub.ip);
                }}
                className={`px-2.5 py-1 rounded text-xs whitespace-nowrap transition-colors font-mono ${
                  traceData?.ip === hub.ip
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {hub.name}
              </button>
            ))}
          </div>
        </div>

        {/* Python Terminal Log Dropdown */}
        {showTerminal && (
          <div className="mt-3 bg-black border border-slate-800 rounded p-3 font-mono text-xs text-emerald-400 overflow-x-auto whitespace-pre-wrap max-h-48">
            <div className="flex items-center justify-between text-slate-500 text-[11px] mb-2 border-b border-slate-800 pb-1">
              <span>TERMINAL: python3 scripts/ip_tracker.py --ip {traceData?.ip}</span>
              <span>STATUS: LIVE PROCESS OK</span>
            </div>
            {terminalLog || 'Running Python OSINT tracker subprocess...'}
          </div>
        )}
      </div>

      {/* Main Grid: Interactive Map + Geospatial Intelligence Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left 8 Cols: Full Tactical Leaflet Map */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-lg overflow-hidden flex flex-col h-[520px]">
          <div className="px-4 py-2.5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
              <span className="text-xs font-semibold text-slate-200 tracking-wide uppercase">
                Geospatial Triangulation Radar
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
              <span>GRID: WGS-84</span>
              <span>·</span>
              <span>PROJECTION: EPSG:3857</span>
            </div>
          </div>

          <div className="relative flex-1 w-full bg-slate-950">
            <div ref={mapContainerRef} className="w-full h-full z-10" />

            {/* In-Map Tactical Legend Overlay */}
            <div className="absolute top-3 left-3 z-[1000] bg-slate-950/90 border border-slate-800 rounded p-2 text-xs font-mono backdrop-blur pointer-events-none space-y-1">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block shadow-sm shadow-rose-500"></span>
                <span>Suspect GPS Fix (+/- {traceData?.accuracyKm || '1.4'} km)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded bg-blue-500 inline-block"></span>
                <span>Cellular BTS Mast ({traceData?.cellTower || 'BTS-LOCAL'})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Telemetry & Network Threat Metrics */}
        <div className="lg:col-span-4 space-y-4">
          {/* Threat Metric Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-medium text-slate-400">Threat Risk Score</span>
              <span className="text-xs font-mono text-slate-500">SCALE: 0 - 100</span>
            </div>

            <div className="mt-3 flex items-baseline justify-between">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold font-mono text-rose-400 tabular-nums">
                  {traceData?.threatScore || 92}
                </span>
                <span className="text-xs text-slate-500 font-mono">/ 100</span>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">
                {traceData && traceData.threatScore >= 80 ? 'CRITICAL RISK' : 'ELEVATED RISK'}
              </span>
            </div>

            <div className="mt-2 w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${traceData?.threatScore || 92}%` }}
              />
            </div>
            <p className="mt-2.5 text-xs text-slate-400 leading-relaxed">
              {traceData?.threatType || 'Suspected OTP harvesting relay and mule communications cluster.'}
            </p>
          </div>

          {/* Forensic Technical Details */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <Network className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold text-slate-200">Network & Cellular Telemetry</span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-500">TARGET IP</span>
                <span className="text-amber-400 font-bold">{traceData?.ip || '103.251.167.24'}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-500">LOCATION</span>
                <span className="text-slate-200">
                  {traceData?.city}, {traceData?.region}, {traceData?.country}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-500">COORDINATES</span>
                <span className="text-slate-200">
                  {traceData?.lat.toFixed(4)}°, {traceData?.lon.toFixed(4)}°
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-500">BTS CELL TOWER</span>
                <span className="text-blue-400 font-medium">{traceData?.cellTower}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-500">CARRIER / ISP</span>
                <span className="text-slate-200 truncate max-w-[180px] text-right" title={traceData?.isp}>
                  {traceData?.isp}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-500">AUTONOMOUS SYS</span>
                <span className="text-slate-300 truncate max-w-[180px] text-right" title={traceData?.as}>
                  {traceData?.as}
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500">INTEL REGISTRY</span>
                <span className="text-emerald-400 text-[11px] truncate">{traceData?.source}</span>
              </div>
            </div>
          </div>

          {/* Quick Action Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-slate-300">Preserve CDR / Subpoena Lock</span>
            </div>
            <button
              onClick={() => alert(`Subpoena packet generated for ISP: ${traceData?.isp}. Notice queued for Legal Officer review.`)}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium transition-colors"
            >
              Export CDR Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
