import React, { useState } from 'react';
import { useSimulationStore } from '../../store/simulationStore';
import { useSettingsStore } from '../../store/settingsStore';
import { 
  Shield, 
  Activity, 
  Wind, 
  TrendingUp, 
  TrendingDown, 
  Map as MapIcon, 
  Layers, 
  Radio, 
  Maximize2, 
  Minimize2,
  Building2,
  Cpu,
  X,
  ChevronUp,
  ChevronDown,
  BarChart2
} from 'lucide-react';

interface SmartCityCockpitOverlayProps {
  onToggleCockpitFrame: () => void;
  cockpitFrameActive: boolean;
}

export const SmartCityCockpitOverlay: React.FC<SmartCityCockpitOverlayProps> = ({
  onToggleCockpitFrame,
  cockpitFrameActive
}) => {
  const theme = useSettingsStore(state => state.theme);
  const isLight = theme === 'light';

  const currentTick = useSimulationStore(state => state.currentTick);
  const metrics = useSimulationStore(state => state.metrics);
  const activeScenario = useSimulationStore(state => state.activeScenario);
  const buildings = useSimulationStore(state => state.buildings);
  const selectAsset = useSimulationStore(state => state.selectAsset);
  const selectedAssetId = useSimulationStore(state => state.selectedAssetId);

  const [activeTab, setActiveTab] = useState<'POPULATION' | 'ECONOMICS' | 'COMMAND' | 'ECOLOGY'>('COMMAND');
  const [mapMode, setMapMode] = useState<'3D' | 'GRID' | 'SATELLITE'>('3D');
  
  // Mobile HUD Drawer States
  const [mobileHudOpen, setMobileHudOpen] = useState(false);
  const [mobileHudTab, setMobileHudTab] = useState<'overview' | 'eco' | 'police' | 'air'>('overview');
  const [assetListOpen, setAssetListOpen] = useState(false);

  // Time formatter
  const simSeconds = 10 * 3600 + 18 * 60 + currentTick;
  const hours = Math.floor(simSeconds / 3600) % 24;
  const minutes = Math.floor((simSeconds % 3600) / 60);
  const seconds = simSeconds % 60;
  const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const panelBg = isLight 
    ? 'bg-white/95 border border-slate-300 shadow-xl shadow-slate-200/50 backdrop-blur-md text-slate-800' 
    : 'bg-[#071326]/85 border border-[#00f0ff]/30 backdrop-blur-md shadow-[0_0_20px_rgba(0,15,35,0.6)] text-white';
  const subBoxBg = isLight
    ? 'bg-slate-50 border border-slate-200 text-slate-850'
    : 'bg-[#0a1b33]/60 border border-white/5 text-white';
  const labelText = isLight ? 'text-slate-500' : 'text-[#94a3b8]';
  const accentText = isLight ? 'text-sky-600' : 'text-[#00f0ff]';
  const borderDivider = isLight ? 'border-slate-200' : 'border-white/10';

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-10 flex flex-col justify-between overflow-hidden">
      {/* ============================================================== */}
      {/* 1. TOP HEADER COCKPIT BAR */}
      {/* ============================================================== */}
      <header className={`pointer-events-auto w-full px-2 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between border-b backdrop-blur-md font-sans transition-colors ${
        isLight
          ? 'bg-gradient-to-b from-white/95 via-white/85 to-transparent border-slate-200 text-slate-800'
          : 'bg-gradient-to-b from-[#050B14]/95 via-[#050B14]/85 to-transparent border-[#00f0ff]/20 text-white'
      }`}>
        {/* Left: Real-time Clock & Location Tag */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono">
          <div className={`flex items-center gap-1.5 px-2 py-0.5 sm:py-1 rounded border ${
            isLight
              ? 'bg-slate-100 border-sky-400 text-sky-700'
              : 'bg-[#0d1b2e]/80 border-[#00f0ff]/30 text-[#00f0ff]'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full animate-ping ${isLight ? 'bg-sky-600' : 'bg-[#00f0ff]'}`} />
            <span className="font-bold tracking-wider sm:tracking-widest text-[11px] sm:text-xs">{formattedTime}</span>
          </div>
          <span className={`hidden md:inline px-1.5 py-0.5 rounded text-[10px] ${
            isLight
              ? 'bg-slate-100 border border-slate-300 text-slate-600 font-semibold'
              : 'bg-blue-950/60 border border-blue-500/30 text-blue-300'
          }`}>
            NHKK- BBC Park
          </span>
        </div>

        {/* Center: SMART CITY COCKPIT Header Logo & Nav Pills (Desktop) */}
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('POPULATION')}
              className={`px-2.5 py-1 rounded-sm text-xs font-semibold tracking-wider transition ${
                activeTab === 'POPULATION'
                  ? 'bg-[#00f0ff] text-black shadow-[0_0_12px_rgba(0,240,255,0.6)]'
                  : 'bg-[#0d1d33]/80 text-[#94a3b8] hover:text-white border border-[#00f0ff]/20'
              }`}
            >
              POPULATION
            </button>
            <button
              onClick={() => setActiveTab('ECONOMICS')}
              className={`px-2.5 py-1 rounded-sm text-xs font-semibold tracking-wider transition ${
                activeTab === 'ECONOMICS'
                  ? 'bg-[#00f0ff] text-black shadow-[0_0_12px_rgba(0,240,255,0.6)]'
                  : 'bg-[#0d1d33]/80 text-[#94a3b8] hover:text-white border border-[#00f0ff]/20'
              }`}
            >
              ECONOMICS
            </button>
          </div>

          {/* Central Logo Hex Emblem */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 rounded-sm bg-gradient-to-r from-[#0055ff]/40 via-[#00f0ff]/20 to-[#0055ff]/40 border border-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.4)]">
            <Cpu className="w-3.5 h-3.5 text-[#00f0ff] animate-pulse" />
            <span className="font-extrabold text-[10px] sm:text-xs tracking-widest text-[#00f0ff] uppercase drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]">
              SMART CITY COCKPIT
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('COMMAND')}
              className={`px-2.5 py-1 rounded-sm text-xs font-semibold tracking-wider transition ${
                activeTab === 'COMMAND'
                  ? 'bg-[#00f0ff] text-black shadow-[0_0_12px_rgba(0,240,255,0.6)]'
                  : 'bg-[#0d1d33]/80 text-[#94a3b8] hover:text-white border border-[#00f0ff]/20'
              }`}
            >
              COMMAND
            </button>
            <button
              onClick={() => setActiveTab('ECOLOGY')}
              className={`px-2.5 py-1 rounded-sm text-xs font-semibold tracking-wider transition ${
                activeTab === 'ECOLOGY'
                  ? 'bg-[#00f0ff] text-black shadow-[0_0_12px_rgba(0,240,255,0.6)]'
                  : 'bg-[#0d1d33]/80 text-[#94a3b8] hover:text-white border border-[#00f0ff]/20'
              }`}
            >
              ECOLOGY
            </button>
          </div>
        </div>

        {/* Right: Mobile HUD Toggle & Operator Badge */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Mobile HUD Telemetry Button (< 1024px) */}
          <button
            onClick={() => setMobileHudOpen(!mobileHudOpen)}
            className="lg:hidden flex items-center gap-1 px-2 py-1 rounded bg-[#00f0ff]/20 hover:bg-[#00f0ff]/30 border border-[#00f0ff] text-[#00f0ff] text-[10px] font-mono font-bold transition touch-min"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>HUD</span>
          </button>

          {/* Mobile Quick Asset Selector Button */}
          <button
            onClick={() => setAssetListOpen(!assetListOpen)}
            className="lg:hidden flex items-center gap-1 px-2 py-1 rounded bg-[#0b172a] hover:bg-[#162947] border border-[#00f0ff]/40 text-[#00f0ff] text-[10px] font-mono transition touch-min"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">ASSETS</span>
          </button>

          {/* Cockpit Frame Toggle (Desktop) */}
          <button
            onClick={onToggleCockpitFrame}
            title={cockpitFrameActive ? 'Exit Cockpit Bezel' : 'Enter Cockpit Bezel Mode'}
            className="hidden sm:flex items-center gap-1 px-2 py-1 rounded bg-[#0b172a] hover:bg-[#162947] border border-[#00f0ff]/40 text-[#00f0ff] text-[10px] sm:text-xs font-mono transition"
          >
            {cockpitFrameActive ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
            <span className="hidden xl:inline">{cockpitFrameActive ? 'BEZEL: ON' : 'BEZEL: OFF'}</span>
          </button>

          {/* Operator Badge */}
          <div className="flex items-center gap-1.5 pl-1.5 border-l border-white/10">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#00f0ff] to-[#9d8cff] p-0.5 flex items-center justify-center">
              <span className="w-full h-full rounded-full bg-[#050B14] flex items-center justify-center text-[9px] font-bold text-[#00f0ff]">
                J
              </span>
            </div>
            <span className="hidden sm:inline text-[11px] font-bold text-[#f1f5f9]">Jacky001</span>
          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. MIDDLE VIEWPORT HUD PANELS (DESKTOP: FIXED SIDEBARS) */}
      {/* ============================================================== */}
      <div className="flex-1 w-full px-4 py-2 flex justify-between items-start pointer-events-none">
        {/* ----------------- LEFT HUD PANEL (DESKTOP ONLY) ----------------- */}
        <div className="hidden lg:flex flex-col gap-2.5 w-72 max-h-[80vh] overflow-y-auto custom-scrollbar pointer-events-auto">
          {/* A. CITY OVERVIEW CARD */}
          <div className={`p-3 rounded-lg ${panelBg}`}>
            <div className={`flex items-center gap-2 pb-1.5 border-b ${borderDivider} text-xs font-bold ${accentText} uppercase tracking-wider`}>
              <span className={`w-1.5 h-3 ${isLight ? 'bg-sky-600' : 'bg-[#00f0ff]'} rounded-xs`} />
              CITY OVERVIEW
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2 font-mono">
              <div className={`p-2 rounded ${subBoxBg}`}>
                <span className={`text-[10px] ${labelText} block`}>Gross Product</span>
                <span className={`text-sm font-bold ${accentText}`}>8,620,480</span>
              </div>
              <div className={`p-2 rounded ${subBoxBg}`}>
                <span className={`text-[10px] ${labelText} block`}>Per Capita GDP</span>
                <span className={`text-sm font-bold ${isLight ? 'text-sky-700' : 'text-[#38bdf8]'}`}>150,630</span>
              </div>
              <div className={`p-2 rounded ${subBoxBg} flex items-center justify-between`}>
                <div>
                  <span className={`text-[10px] ${labelText} block`}>Completed</span>
                  <span className="text-sm font-bold text-emerald-500">3,529</span>
                </div>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <div className={`p-2 rounded ${subBoxBg} flex items-center justify-between`}>
                <div>
                  <span className={`text-[10px] ${labelText} block`}>Incomplete</span>
                  <span className="text-sm font-bold text-amber-500">1,120</span>
                </div>
                <TrendingDown className="w-4 h-4 text-amber-500" />
              </div>
            </div>
          </div>

          {/* B. TOTAL CASE CARD */}
          <div className={`p-3 rounded-lg ${panelBg}`}>
            <div className={`flex items-center justify-between pb-1.5 border-b ${borderDivider} text-xs font-bold ${accentText} tracking-wider uppercase`}>
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-3 ${isLight ? 'bg-sky-600' : 'bg-[#00f0ff]'} rounded-xs`} />
                TOTAL CASE
              </div>
              <span className={`text-[10px] ${labelText} font-mono`}>LIVE FEED</span>
            </div>
            <div className="flex items-center justify-around mt-2 font-mono">
              <div className="text-center">
                <span className="text-base font-bold text-amber-500 block">1,320 ↑</span>
                <span className={`text-[10px] ${labelText}`}>Deployments</span>
              </div>
              <div className={`w-[1px] h-8 ${borderDivider}`} />
              <div className="text-center">
                <span className={`text-base font-bold ${accentText} block`}>2,509 ↓</span>
                <span className={`text-[10px] ${labelText}`}>Transit Lines</span>
              </div>
            </div>
          </div>

          {/* C. 5-AXIS SPIDER / RADAR CHART */}
          <div className={`p-3 rounded-lg ${panelBg}`}>
            <div className={`flex items-center justify-between pb-1 border-b ${borderDivider} text-xs font-bold ${accentText} tracking-wider uppercase`}>
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-3 ${isLight ? 'bg-sky-600' : 'bg-[#00f0ff]'} rounded-xs`} />
                ECOSYSTEM MATRIX
              </div>
              <span className={`text-[10px] ${accentText} font-mono`}>5-AXIS</span>
            </div>
            <div className="flex justify-center items-center py-2">
              <svg viewBox="0 0 160 140" className="w-40 h-36">
                {[0.25, 0.5, 0.75, 1.0].map((level, i) => {
                  const points = [
                    [80, 70 - 55 * level],
                    [80 + 52 * level, 70 - 17 * level],
                    [80 + 32 * level, 70 + 44 * level],
                    [80 - 32 * level, 70 + 44 * level],
                    [80 - 52 * level, 70 - 17 * level]
                  ].map(p => p.join(',')).join(' ');
                  return (
                    <polygon
                      key={`grid-${i}`}
                      points={points}
                      fill="none"
                      stroke="#1e3a5f"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                  );
                })}
                <line x1="80" y1="70" x2="80" y2="15" stroke="#1e3a5f" strokeWidth="1" />
                <line x1="80" y1="70" x2="132" y2="53" stroke="#1e3a5f" strokeWidth="1" />
                <line x1="80" y1="70" x2="112" y2="114" stroke="#1e3a5f" strokeWidth="1" />
                <line x1="80" y1="70" x2="48" y2="114" stroke="#1e3a5f" strokeWidth="1" />
                <line x1="80" y1="70" x2="28" y2="53" stroke="#1e3a5f" strokeWidth="1" />

                <polygon
                  points="80,26 122,58 102,106 58,98 38,62"
                  fill="rgba(0, 240, 255, 0.3)"
                  stroke="#00f0ff"
                  strokeWidth="2"
                />
                <text x="80" y="10" fill="#94a3b8" fontSize="8" textAnchor="middle">WATER</text>
                <text x="142" y="55" fill="#94a3b8" fontSize="8" textAnchor="start">LAND</text>
                <text x="120" y="125" fill="#94a3b8" fontSize="8" textAnchor="start">SURFACE</text>
                <text x="40" y="125" fill="#94a3b8" fontSize="8" textAnchor="end">AIR</text>
                <text x="18" y="55" fill="#94a3b8" fontSize="8" textAnchor="end">POWER</text>
              </svg>
            </div>
          </div>

          {/* D. WATER QUALITY TESTING TREND */}
          <div className="p-3 rounded-lg bg-[#071326]/85 border border-[#00f0ff]/30 backdrop-blur-md shadow-lg text-white">
            <div className="flex items-center justify-between pb-1.5 border-b border-white/10 text-xs font-bold text-[#00f0ff] tracking-wider uppercase">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-3 bg-[#00f0ff] rounded-xs" />
                WATER QUALITY TESTING
              </div>
              <span className="text-[10px] text-[#10b981] font-mono">98.4% SAFE</span>
            </div>
            <div className="mt-2 h-16 w-full">
              <svg viewBox="0 0 240 60" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="waterGradDesktop" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0,45 Q 30,25 60,35 T 120,20 T 180,18 T 240,10 L 240,60 L 0,60 Z"
                  fill="url(#waterGradDesktop)"
                />
                <path
                  d="M 0,45 Q 30,25 60,35 T 120,20 T 180,18 T 240,10"
                  fill="none"
                  stroke="#00f0ff"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* ----------------- RIGHT HUD PANEL (DESKTOP ONLY) ----------------- */}
        <div className="hidden lg:flex flex-col gap-2.5 w-76 max-h-[80vh] overflow-y-auto custom-scrollbar pointer-events-auto">
          {/* A. POLICE TODAY */}
          <div className={`p-3 rounded-lg ${panelBg}`}>
            <div className={`flex items-center justify-between pb-1.5 border-b ${borderDivider} text-xs font-bold ${accentText} tracking-wider uppercase`}>
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-3 ${isLight ? 'bg-sky-600' : 'bg-[#00f0ff]'} rounded-xs`} />
                POLICE TODAY
              </div>
              <Shield className={`w-4 h-4 ${accentText}`} />
            </div>

            <div className="flex items-center justify-between mt-2 font-mono">
              <div>
                <span className={`text-[10px] ${labelText} block`}>Police Number</span>
                <span className={`text-base font-bold ${isLight ? 'text-slate-800' : 'text-[#f1f5f9]'}`}>26,345</span>
              </div>
              <div className="text-right">
                <span className={`text-[10px] ${labelText} block`}>Alarms</span>
                <span className="text-base font-bold text-amber-500 flex items-center justify-end gap-1">
                  256 <span className="text-xs">↑</span>
                </span>
              </div>
            </div>

            <div className="space-y-1.5 mt-3 text-[11px] font-mono">
              <div className={`flex justify-between items-center ${labelText}`}>
                <span>Primary Industry</span>
                <span className={accentText}>1,256</span>
              </div>
              <div className={`w-full ${isLight ? 'bg-slate-200' : 'bg-[#142338]'} h-1.5 rounded-full overflow-hidden`}>
                <div className={`${isLight ? 'bg-sky-600' : 'bg-[#00f0ff]'} h-full w-[82%]`} />
              </div>

              <div className={`flex justify-between items-center ${labelText}`}>
                <span>Secondary Industry</span>
                <span className={isLight ? 'text-sky-700' : 'text-[#38bdf8]'}>520</span>
              </div>
              <div className={`w-full ${isLight ? 'bg-slate-200' : 'bg-[#142338]'} h-1.5 rounded-full overflow-hidden`}>
                <div className={`${isLight ? 'bg-sky-500' : 'bg-[#38bdf8]'} h-full w-[45%]`} />
              </div>

              <div className={`flex justify-between items-center ${labelText}`}>
                <span>Tertiary Industry</span>
                <span className="text-amber-500">36</span>
              </div>
              <div className={`w-full ${isLight ? 'bg-slate-200' : 'bg-[#142338]'} h-1.5 rounded-full overflow-hidden`}>
                <div className="bg-amber-500 h-full w-[12%]" />
              </div>
            </div>
          </div>

          {/* B. SAFETY MONITORING */}
          <div className={`p-3 rounded-lg ${panelBg}`}>
            <div className={`flex items-center justify-between pb-1.5 border-b ${borderDivider} text-xs font-bold ${accentText} tracking-wider uppercase`}>
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-3 ${isLight ? 'bg-sky-600' : 'bg-[#00f0ff]'} rounded-xs`} />
                SAFETY MONITORING
              </div>
              <Activity className="w-4 h-4 text-emerald-500" />
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2 font-mono">
              <div className={`p-2 rounded ${subBoxBg} flex items-center gap-2`}>
                <div className={`w-8 h-8 rounded-full border-2 ${isLight ? 'border-sky-500' : 'border-[#00f0ff]'} flex items-center justify-center shrink-0`}>
                  <span className={`text-[10px] font-bold ${accentText}`}>98%</span>
                </div>
                <div>
                  <span className={`text-xs font-bold ${accentText}`}>1,320 ↑</span>
                  <span className={`text-[9px] ${labelText} block`}>Key Projects</span>
                </div>
              </div>

              <div className={`p-2 rounded ${subBoxBg} flex items-center gap-2`}>
                <div className="w-8 h-8 rounded-full border-2 border-emerald-500 flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-emerald-500">92%</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-500">2,508 ↓</span>
                  <span className={`text-[9px] ${labelText} block`}>Start Business</span>
                </div>
              </div>
            </div>
          </div>

          {/* C. AIR QUALITY (AQI) */}
          <div className={`p-3 rounded-lg ${panelBg}`}>
            <div className={`flex items-center justify-between pb-1.5 border-b ${borderDivider} text-xs font-bold ${accentText} tracking-wider uppercase`}>
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-3 ${isLight ? 'bg-sky-600' : 'bg-[#00f0ff]'} rounded-xs`} />
                AIR QUALITY (AQI)
              </div>
              <Wind className={`w-4 h-4 ${isLight ? 'text-sky-600' : 'text-[#38bdf8]'}`} />
            </div>

            <div className="flex items-center justify-between mt-2">
              <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke={isLight ? '#e2e8f0' : '#162947'} strokeWidth="5" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="5" strokeDasharray="251" strokeDashoffset="60" strokeLinecap="round" />
                  <circle cx="50" cy="50" r="30" fill="none" stroke={isLight ? '#e2e8f0' : '#162947'} strokeWidth="5" />
                  <circle cx="50" cy="50" r="30" fill="none" stroke={isLight ? '#0284c7' : '#00f0ff'} strokeWidth="5" strokeDasharray="188" strokeDashoffset="65" strokeLinecap="round" />
                </svg>
                <div className="absolute text-center">
                  <span className={`text-xs font-mono font-bold ${accentText}`}>38</span>
                  <span className={`text-[8px] ${labelText} block uppercase`}>AQI AVG</span>
                </div>
              </div>

              <div className="flex flex-col gap-1 text-[9px] font-mono">
                <div className="flex items-center gap-1.5 text-[#10b981]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                  <span>0-50 (Excellent)</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#00f0ff]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]" />
                  <span>51-100 (Good)</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#f59e0b]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
                  <span>101-150 (Mild)</span>
                </div>
              </div>
            </div>
          </div>

          {/* D. INDUSTRY MAP DONUT */}
          <div className="p-3 rounded-lg bg-[#071326]/85 border border-[#00f0ff]/30 backdrop-blur-md shadow-lg text-white">
            <div className="flex items-center justify-between pb-1.5 border-b border-white/10 text-xs font-bold text-[#00f0ff] tracking-wider uppercase">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-3 bg-[#00f0ff] rounded-xs" />
                INDUSTRY MAP
              </div>
              <Building2 className="w-4 h-4 text-[#9d8cff]" />
            </div>

            <div className="flex items-center justify-between mt-2">
              <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="34" fill="none" stroke="#00f0ff" strokeWidth="12" strokeDasharray="213.6" strokeDashoffset="132" />
                  <circle cx="50" cy="50" r="34" fill="none" stroke="#38bdf8" strokeWidth="12" strokeDasharray="213.6" strokeDashoffset="156" transform="rotate(136.8 50 50)" />
                  <circle cx="50" cy="50" r="34" fill="none" stroke="#f59e0b" strokeWidth="12" strokeDasharray="213.6" strokeDashoffset="168" transform="rotate(234 50 50)" />
                </svg>
              </div>

              <div className="flex flex-col gap-1 text-[9px] text-[#94a3b8]">
                <div>Scientific (38%)</div>
                <div>Wholesale (27%)</div>
                <div>Culture (21%)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. MOBILE COCKPIT HUD SLIDE-UP DRAWER (< 1024px) */}
      {/* ============================================================== */}
      {mobileHudOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex flex-col justify-end pointer-events-auto">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setMobileHudOpen(false)}
          />

          {/* Drawer Body */}
          <div className="relative w-full max-h-[75vh] bg-[#071326] border-t-2 border-[#00f0ff] rounded-t-2xl shadow-2xl p-4 flex flex-col gap-3 animate-slideUp overflow-hidden">
            {/* Drawer Drag Bar & Close Button */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#00f0ff]" />
                <span className="font-extrabold text-xs tracking-wider text-white uppercase">
                  COCKPIT TELEMETRY & STATS
                </span>
              </div>
              <button
                onClick={() => setMobileHudOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-white/10 touch-min flex items-center justify-center"
                aria-label="Close telemetry drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Tab Selector */}
            <div className="grid grid-cols-4 gap-1 p-1 rounded-lg bg-[#0a1b33] text-[10px] font-mono">
              <button
                onClick={() => setMobileHudTab('overview')}
                className={`py-1.5 rounded transition ${mobileHudTab === 'overview' ? 'bg-[#00f0ff] text-black font-bold' : 'text-[#94a3b8]'}`}
              >
                Overview
              </button>
              <button
                onClick={() => setMobileHudTab('eco')}
                className={`py-1.5 rounded transition ${mobileHudTab === 'eco' ? 'bg-[#00f0ff] text-black font-bold' : 'text-[#94a3b8]'}`}
              >
                Ecosystem
              </button>
              <button
                onClick={() => setMobileHudTab('police')}
                className={`py-1.5 rounded transition ${mobileHudTab === 'police' ? 'bg-[#00f0ff] text-black font-bold' : 'text-[#94a3b8]'}`}
              >
                Response
              </button>
              <button
                onClick={() => setMobileHudTab('air')}
                className={`py-1.5 rounded transition ${mobileHudTab === 'air' ? 'bg-[#00f0ff] text-black font-bold' : 'text-[#94a3b8]'}`}
              >
                Air & Ind
              </button>
            </div>

            {/* Tab Contents (Scrollable) */}
            <div className="flex-1 overflow-y-auto space-y-3 py-1 custom-scrollbar text-white">
              {mobileHudTab === 'overview' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 font-mono">
                    <div className="p-2.5 rounded bg-[#0a1b33]/80 border border-white/10">
                      <span className="text-[10px] text-[#94a3b8] block">Gross Product</span>
                      <span className="text-base font-bold text-[#00f0ff]">8,620,480</span>
                    </div>
                    <div className="p-2.5 rounded bg-[#0a1b33]/80 border border-white/10">
                      <span className="text-[10px] text-[#94a3b8] block">Per Capita GDP</span>
                      <span className="text-base font-bold text-[#38bdf8]">150,630</span>
                    </div>
                    <div className="p-2.5 rounded bg-[#0a1b33]/80 border border-white/10">
                      <span className="text-[10px] text-[#94a3b8] block">Active Deployments</span>
                      <span className="text-base font-bold text-[#10b981]">1,320 ↑</span>
                    </div>
                    <div className="p-2.5 rounded bg-[#0a1b33]/80 border border-white/10">
                      <span className="text-[10px] text-[#94a3b8] block">Active Transit Lines</span>
                      <span className="text-base font-bold text-[#f59e0b]">2,509 ↓</span>
                    </div>
                  </div>
                </div>
              )}

              {mobileHudTab === 'eco' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-[#0a1b33]/60 border border-white/10 flex flex-col items-center">
                    <span className="text-xs font-bold text-[#00f0ff] uppercase mb-1">5-Axis Ecosystem Matrix</span>
                    <svg viewBox="0 0 160 140" className="w-36 h-32">
                      {[0.33, 0.66, 1.0].map((level, i) => {
                        const points = [
                          [80, 70 - 55 * level],
                          [80 + 52 * level, 70 - 17 * level],
                          [80 + 32 * level, 70 + 44 * level],
                          [80 - 32 * level, 70 + 44 * level],
                          [80 - 52 * level, 70 - 17 * level]
                        ].map(p => p.join(',')).join(' ');
                        return <polygon key={`m-grid-${i}`} points={points} fill="none" stroke="#1e3a5f" strokeWidth="1" />;
                      })}
                      <polygon points="80,26 122,58 102,106 58,98 38,62" fill="rgba(0, 240, 255, 0.3)" stroke="#00f0ff" strokeWidth="2" />
                      <text x="80" y="10" fill="#94a3b8" fontSize="8" textAnchor="middle">WATER</text>
                      <text x="142" y="55" fill="#94a3b8" fontSize="8" textAnchor="start">LAND</text>
                      <text x="120" y="125" fill="#94a3b8" fontSize="8" textAnchor="start">SURF</text>
                      <text x="40" y="125" fill="#94a3b8" fontSize="8" textAnchor="end">AIR</text>
                      <text x="18" y="55" fill="#94a3b8" fontSize="8" textAnchor="end">PWR</text>
                    </svg>
                  </div>
                </div>
              )}

              {mobileHudTab === 'police' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 font-mono">
                    <div className="p-2.5 rounded bg-[#0a1b33] border border-white/10">
                      <span className="text-[10px] text-[#94a3b8] block">Police Force</span>
                      <span className="text-sm font-bold text-white">26,345</span>
                    </div>
                    <div className="p-2.5 rounded bg-[#0a1b33] border border-white/10">
                      <span className="text-[10px] text-[#94a3b8] block">Alarms</span>
                      <span className="text-sm font-bold text-[#f59e0b]">256 ↑</span>
                    </div>
                  </div>
                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between text-[#94a3b8]">
                      <span>Primary Industry</span>
                      <span className="text-[#00f0ff]">1,256</span>
                    </div>
                    <div className="w-full bg-[#142338] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#00f0ff] h-full w-[82%]" />
                    </div>
                  </div>
                </div>
              )}

              {mobileHudTab === 'air' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-[#0a1b33] border border-white/10 flex items-center justify-around">
                    <div className="text-center">
                      <span className="text-2xl font-bold font-mono text-[#00f0ff] block">38</span>
                      <span className="text-[10px] text-[#94a3b8] uppercase">AQI Average</span>
                    </div>
                    <div className="text-xs space-y-1 font-mono">
                      <div className="text-[#10b981]">0-50: Excellent</div>
                      <div className="text-[#00f0ff]">51-100: Good</div>
                      <div className="text-[#f59e0b]">101-150: Mild</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. MOBILE QUICK ASSET SELECTOR LIST (< 1024px) */}
      {/* ============================================================== */}
      {assetListOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex flex-col justify-end pointer-events-auto">
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setAssetListOpen(false)} />
          <div className="relative w-full max-h-[60vh] bg-[#071326] border-t-2 border-[#00f0ff] rounded-t-2xl shadow-2xl p-4 flex flex-col gap-3 animate-slideUp">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="font-extrabold text-xs tracking-wider text-white uppercase flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#00f0ff]" />
                SELECT CITY ASSET
              </span>
              <button
                onClick={() => setAssetListOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-white/10 touch-min flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
              {buildings.map(b => (
                <button
                  key={b.id}
                  onClick={() => {
                    selectAsset(b.id);
                    setAssetListOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition touch-min ${
                    selectedAssetId === b.id
                      ? 'bg-[#00f0ff]/20 border-[#00f0ff] text-white'
                      : 'bg-[#0a1b33] border-white/10 text-slate-200 hover:bg-[#112442]'
                  }`}
                >
                  <div>
                    <div className="font-bold text-xs">{b.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono capitalize">
                      {b.district} • {b.type}
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    b.status === 'critical' ? 'bg-red-500/20 text-red-400' :
                    b.status === 'warning' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {b.status}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. BOTTOM 3D VIEWPORT HUD BAR (MAP MODES + FACTORY DATA) */}
      {/* ============================================================== */}
      <footer className={`pointer-events-auto w-full px-3 sm:px-6 py-2 flex items-center justify-between border-t font-sans transition-colors ${
        isLight
          ? 'bg-gradient-to-t from-white/95 via-white/85 to-transparent border-slate-200 text-slate-800'
          : 'bg-gradient-to-t from-[#050B14]/95 via-[#050B14]/85 to-transparent border-[#00f0ff]/20 text-white'
      }`}>
        {/* Left: WARNING LOCATION Scanner Reticle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className={`relative w-6 h-6 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center shrink-0 ${
            isLight ? 'border-sky-400' : 'border-[#00f0ff]/60'
          }`}>
            <span className={`w-full h-[1px] absolute ${isLight ? 'bg-sky-400/40' : 'bg-[#00f0ff]/40'}`} />
            <span className={`h-full w-[1px] absolute ${isLight ? 'bg-sky-400/40' : 'bg-[#00f0ff]/40'}`} />
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
          </div>
          <div className="font-mono text-[9px] sm:text-[10px]">
            <span className={`${accentText} font-bold block`}>RADAR SCAN</span>
            <span className={`hidden sm:inline ${labelText}`}>31°14'N 121°28'E [NORMAL]</span>
          </div>
        </div>

        {/* Center: MAP MODE TABS (3D MAP, GRID MAP, SATELLITE) */}
        <div className={`flex items-center gap-1 p-0.5 sm:p-1 rounded-md border shadow-lg ${
          isLight ? 'bg-white border-slate-300' : 'bg-[#071326]/90 border-[#00f0ff]/30'
        }`}>
          <button
            onClick={() => setMapMode('3D')}
            className={`px-2.5 sm:px-3 py-1 rounded text-[10px] sm:text-xs font-mono font-bold tracking-wider transition touch-min ${
              mapMode === '3D'
                ? isLight ? 'bg-sky-500 text-white shadow-md' : 'bg-[#00f0ff] text-black shadow-[0_0_12px_rgba(0,240,255,0.6)]'
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            3D MAP
          </button>
          <button
            onClick={() => setMapMode('GRID')}
            className={`px-2.5 sm:px-3 py-1 rounded text-[10px] sm:text-xs font-mono font-bold tracking-wider transition touch-min ${
              mapMode === 'GRID'
                ? isLight ? 'bg-sky-500 text-white shadow-md' : 'bg-[#00f0ff] text-black shadow-[0_0_12px_rgba(0,240,255,0.6)]'
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            GRID
          </button>
          <button
            onClick={() => setMapMode('SATELLITE')}
            className={`px-2.5 sm:px-3 py-1 rounded text-[10px] sm:text-xs font-mono font-bold tracking-wider transition touch-min ${
              mapMode === 'SATELLITE'
                ? isLight ? 'bg-sky-500 text-white shadow-md' : 'bg-[#00f0ff] text-black shadow-[0_0_12px_rgba(0,240,255,0.6)]'
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            SAT
          </button>
        </div>

        {/* Right: FACTORY / SYSTEM TELEMETRY DATA COUNTERS (Desktop only) */}
        <div className="hidden xl:flex items-center gap-4 font-mono text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-[#94a3b8] uppercase">Index:</span>
            <span className="font-bold text-[#00f0ff]">560,000</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-[#94a3b8] uppercase">Order:</span>
            <span className="font-bold text-[#38bdf8]">1,958,200</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-[#94a3b8] uppercase">Floating:</span>
            <span className="font-bold text-[#10b981]">54,472</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
