import React, { ReactNode } from 'react';
import { useSettingsStore } from '../../store/settingsStore';

interface CockpitConsoleFrameProps {
  children: ReactNode;
  isActive: boolean;
}

export const CockpitConsoleFrame: React.FC<CockpitConsoleFrameProps> = ({ children, isActive }) => {
  const theme = useSettingsStore(state => state.theme);
  const isLight = theme === 'light';

  if (!isActive) {
    return <div className="relative w-full h-full overflow-hidden">{children}</div>;
  }

  return (
    <div className={`relative w-full h-full p-0 sm:p-2 lg:p-4 xl:p-6 flex items-center justify-center overflow-hidden transition-colors ${
      isLight ? 'bg-slate-200' : 'bg-[#03060c]'
    }`}>
      {/* ============================================================== */}
      {/* 1. PHYSICAL VEHICLE / COMMAND BRIDGE COCKPIT BEZEL */}
      {/* ============================================================== */}
      <div className={`relative w-full h-full max-w-[1920px] max-h-[1080px] rounded-none sm:rounded-2xl overflow-hidden shadow-2xl border-0 sm:border-4 lg:border-8 flex flex-col transition-colors ${
        isLight
          ? 'bg-slate-50 border-slate-300 shadow-slate-400/40'
          : 'bg-black border-[#101726] shadow-[0_0_80px_rgba(0,0,0,0.9)]'
      }`}>
        {/* Overhead Cockpit Angled Beam with Overhead Recessed Ambient LED Bar */}
        <div className={`relative w-full h-7 sm:h-10 lg:h-12 border-b flex items-center justify-between px-3 sm:px-6 shrink-0 z-30 transition-colors ${
          isLight
            ? 'bg-gradient-to-b from-slate-100 via-slate-200 to-slate-300 border-slate-300 text-slate-700'
            : 'bg-gradient-to-b from-[#182338] via-[#101726] to-[#090e17] border-[#233554] text-white'
        }`}>
          {/* Overhead Ambient LED Bar */}
          <div className={`absolute top-0 left-1/4 right-1/4 h-1.5 sm:h-2 bg-gradient-to-r from-transparent ${
            isLight ? 'via-sky-400 shadow-[0_0_15px_#0284c7]' : 'via-[#e0f7ff] shadow-[0_0_20px_#00f0ff]'
          } to-transparent opacity-90`} />

          {/* Left Cockpit Mount Rivets */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full border ${isLight ? 'bg-slate-300 border-slate-400' : 'bg-[#233554] border-[#384e75]'}`} />
            <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full border ${isLight ? 'bg-slate-300 border-slate-400' : 'bg-[#233554] border-[#384e75]'}`} />
            <span className={`text-[9px] sm:text-[10px] font-mono tracking-widest uppercase hidden sm:inline ${isLight ? 'text-slate-600 font-semibold' : 'text-[#475569]'}`}>
              SEC-POD-09 // BRIDGE CONSOLE
            </span>
          </div>

          {/* Center Overhead Mount Indicator */}
          <div className={`w-16 sm:w-24 h-1 sm:h-1.5 rounded-full flex items-center justify-center ${isLight ? 'bg-slate-300' : 'bg-[#1e293b]'}`}>
            <div className={`w-6 sm:w-8 h-1 rounded-full animate-pulse ${isLight ? 'bg-sky-500' : 'bg-[#00f0ff]'}`} />
          </div>

          {/* Right Mount Rivets */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className={`text-[9px] sm:text-[10px] font-mono tracking-widest uppercase hidden sm:inline ${isLight ? 'text-slate-600 font-semibold' : 'text-[#475569]'}`}>
              HUD OPTIC ARRAY
            </span>
            <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full border ${isLight ? 'bg-slate-300 border-slate-400' : 'bg-[#233554] border-[#384e75]'}`} />
            <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full border ${isLight ? 'bg-slate-300 border-slate-400' : 'bg-[#233554] border-[#384e75]'}`} />
          </div>
        </div>

        {/* Inner Cockpit Screen Viewport Framed by Left/Right Structural Pillars */}
        <div className="relative flex-1 w-full h-full flex overflow-hidden">
          {/* Left Angled Structural Cockpit Pillar */}
          <div className={`hidden lg:flex flex-col justify-between w-6 xl:w-10 border-r py-6 px-1 shrink-0 z-20 ${
            isLight
              ? 'bg-gradient-to-r from-slate-200 to-slate-100 border-slate-300'
              : 'bg-gradient-to-r from-[#0d1422] to-[#080d16] border-[#1a2942]'
          }`}>
            <div className="w-full space-y-2">
              <div className={`h-6 rounded-xs border-l-2 ${isLight ? 'bg-slate-300 border-sky-600' : 'bg-[#142033] border-[#00f0ff]'}`} />
              <div className={`h-3 rounded-xs ${isLight ? 'bg-slate-300' : 'bg-[#101a2b]'}`} />
              <div className={`h-3 rounded-xs ${isLight ? 'bg-slate-300' : 'bg-[#101a2b]'}`} />
            </div>
            <div className="w-full space-y-2">
              <div className={`h-3 rounded-xs ${isLight ? 'bg-slate-300' : 'bg-[#101a2b]'}`} />
              <div className={`h-6 rounded-xs border-l-2 ${isLight ? 'bg-slate-300 border-amber-600' : 'bg-[#142033] border-[#f59e0b]'}`} />
            </div>
          </div>

          {/* Curved High-Tech Glass Display Housing the 3D Twin & Smart City Cockpit */}
          <div className={`relative flex-1 h-full w-full overflow-hidden ${isLight ? 'bg-slate-100' : 'bg-[#050B14]'}`}>
            <div className={`absolute inset-0 pointer-events-none z-20 ${
              isLight ? 'shadow-[inset_0_0_40px_rgba(0,0,0,0.06)]' : 'shadow-[inset_0_0_40px_rgba(0,0,0,0.8)]'
            }`} />
            {children}
          </div>

          {/* Right Angled Structural Cockpit Pillar */}
          <div className={`hidden lg:flex flex-col justify-between w-6 xl:w-10 border-l py-6 px-1 shrink-0 z-20 ${
            isLight
              ? 'bg-gradient-to-l from-slate-200 to-slate-100 border-slate-300'
              : 'bg-gradient-to-l from-[#0d1422] to-[#080d16] border-[#1a2942]'
          }`}>
            <div className="w-full space-y-2">
              <div className={`h-6 rounded-xs border-r-2 ${isLight ? 'bg-slate-300 border-sky-600' : 'bg-[#142033] border-[#00f0ff]'}`} />
              <div className={`h-3 rounded-xs ${isLight ? 'bg-slate-300' : 'bg-[#101a2b]'}`} />
            </div>
            <div className="w-full space-y-2">
              <div className={`h-3 rounded-xs ${isLight ? 'bg-slate-300' : 'bg-[#101a2b]'}`} />
              <div className={`h-6 rounded-xs border-r-2 ${isLight ? 'bg-slate-300 border-emerald-600' : 'bg-[#142033] border-[#10b981]'}`} />
            </div>
          </div>
        </div>

        {/* Bottom Cockpit Control Dashboard Shelf */}
        <div className={`relative w-full h-5 sm:h-8 lg:h-10 border-t flex items-center justify-between px-3 sm:px-6 shrink-0 z-30 ${
          isLight
            ? 'bg-gradient-to-t from-slate-200 via-slate-100 to-slate-200 border-slate-300 text-slate-700'
            : 'bg-gradient-to-t from-[#182338] via-[#101726] to-[#090e17] border-[#233554] text-white'
        }`}>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className={`w-1.5 h-1.5 rounded-full animate-ping ${isLight ? 'bg-emerald-600' : 'bg-[#10b981]'}`} />
            <span className={`text-[8px] sm:text-[9px] font-mono font-semibold ${isLight ? 'text-slate-600' : 'text-[#64748b]'}`}>
              TELEMETRY BUS: OK
            </span>
          </div>

          <div className={`flex items-center gap-4 text-[8px] sm:text-[9px] font-mono font-semibold ${isLight ? 'text-slate-600' : 'text-[#475569]'}`}>
            <span>OPTICAL LATENCY: 4ms</span>
            <span className="hidden sm:inline">INTEGRITY: 100%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
