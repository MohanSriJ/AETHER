import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, 
  Building2, 
  Sliders, 
  BrainCircuit, 
  BarChart3, 
  FileText, 
  Settings, 
  Sun, 
  Moon, 
  Play, 
  RotateCcw, 
  ArrowRight, 
  X,
  Compass,
  Zap,
  Waves,
  Flame,
  SunMedium
} from 'lucide-react';
import { useSimulationStore } from '../../store/simulationStore';
import { useSettingsStore } from '../../store/settingsStore';
import { SCENARIO_TEMPLATES } from '../../features/scenarios/ScenarioLabView';
import { ScenarioType } from '../../types/simulation';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: any) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const buildings = useSimulationStore(state => state.buildings);
  const selectAsset = useSimulationStore(state => state.selectAsset);
  const startScenario = useSimulationStore(state => state.startScenario);
  const resetToBaseline = useSimulationStore(state => state.resetToBaseline);
  const setCameraPreset = useSimulationStore(state => state.setCameraPreset);
  
  const theme = useSettingsStore(state => state.theme);
  const toggleTheme = useSettingsStore(state => state.toggleTheme);
  const autoRotate = useSettingsStore(state => state.autoRotate);
  const setAutoRotate = useSettingsStore(state => state.setAutoRotate);

  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Handle global shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Aggregate items
  const items = useMemo(() => {
    const q = query.toLowerCase().trim();

    const sections: Array<{
      category: string;
      items: Array<{
        id: string;
        title: string;
        subtitle?: string;
        icon: React.ComponentType<{ className?: string }>;
        action: () => void;
        badge?: string;
      }>;
    }> = [];

    // 1. Navigation items
    const navs = [
      { id: 'nav-twin', title: 'Digital Twin 3D Viewport', subtitle: 'Interactive smart city model and telemetry', icon: Compass, action: () => { onNavigateTab('digital_twin'); onClose(); } },
      { id: 'nav-scenarios', title: 'Scenario Laboratory', subtitle: 'Inject environmental and infrastructure emergencies', icon: Sliders, action: () => { onNavigateTab('scenarios'); onClose(); } },
      { id: 'nav-ai', title: 'AI Operations & Rationale', subtitle: 'Autonomous explainable mitigation agents', icon: BrainCircuit, action: () => { onNavigateTab('ai_operations'); onClose(); } },
      { id: 'nav-analytics', title: 'Telemetry Analytics', subtitle: 'Microclimate charts and system distributions', icon: BarChart3, action: () => { onNavigateTab('analytics'); onClose(); } },
      { id: 'nav-reports', title: 'Incident Reports & Compliance', subtitle: 'Export CSV, JSON, and print-ready audits', icon: FileText, action: () => { onNavigateTab('reports'); onClose(); } },
      { id: 'nav-settings', title: 'System Settings', subtitle: 'Rendering quality and display preferences', icon: Settings, action: () => { onNavigateTab('settings'); onClose(); } },
      { id: 'nav-landing', title: 'Landing Overview', subtitle: 'Return to public cinematic portal', icon: Building2, action: () => { onNavigateTab('landing'); onClose(); } }
    ].filter(i => !q || i.title.toLowerCase().includes(q) || (i.subtitle && i.subtitle.toLowerCase().includes(q)));

    if (navs.length > 0) sections.push({ category: 'Navigation', items: navs });

    // 2. Scenario items
    const scenarios = SCENARIO_TEMPLATES.map(s => ({
      id: `scen-${s.id}`,
      title: `Simulate: ${s.title}`,
      subtitle: `${s.tagline} (${(s.defaultIntensity * 100).toFixed(0)}% Intensity)`,
      icon: s.id === 'flood' ? Waves : s.id === 'fire' ? Flame : s.id === 'heatwave' ? SunMedium : Zap,
      badge: 'SCENARIO',
      action: () => {
        startScenario({
          id: s.id,
          title: s.title,
          tagline: s.tagline,
          description: s.description,
          iconName: s.id,
          targetDistrict: s.defaultDistrict,
          intensity: s.defaultIntensity,
          durationSeconds: s.durationSeconds
        });
        onNavigateTab('digital_twin');
        onClose();
      }
    })).filter(i => !q || i.title.toLowerCase().includes(q) || i.subtitle.toLowerCase().includes(q));

    if (scenarios.length > 0) sections.push({ category: 'Simulation Scenarios', items: scenarios });

    // 3. Buildings / Facilities
    const blds = buildings.map(b => ({
      id: `bld-${b.id}`,
      title: b.name,
      subtitle: `${b.district.replace('_', ' ').toUpperCase()} • ${b.type.replace('_', ' ')} • Status: ${b.status}`,
      icon: Building2,
      badge: b.status.toUpperCase(),
      action: () => {
        selectAsset(b.id);
        onNavigateTab('digital_twin');
        onClose();
      }
    })).filter(i => !q || i.title.toLowerCase().includes(q) || i.subtitle.toLowerCase().includes(q));

    if (blds.length > 0) sections.push({ category: 'Facilities & Infrastructure', items: blds.slice(0, 8) });

    // 4. Quick Actions
    const actions = [
      {
        id: 'act-theme',
        title: `Switch Theme to ${theme === 'dark' ? 'Light Mode' : 'Dark Mode'}`,
        subtitle: 'Toggle high-contrast architectural CAD / nocturnal command styling',
        icon: theme === 'dark' ? Sun : Moon,
        badge: 'THEME',
        action: () => { toggleTheme(); onClose(); }
      },
      {
        id: 'act-autorotate',
        title: `${autoRotate ? 'Disable' : 'Enable'} Camera Cinematic Orbit`,
        subtitle: 'Slowly rotate the 3D twin to demonstrate spatial depth',
        icon: Compass,
        badge: 'CAMERA',
        action: () => { setAutoRotate(!autoRotate); onClose(); }
      },
      {
        id: 'act-reset',
        title: 'Restore Municipal Baseline',
        subtitle: 'Clears active hazards and restores nominal sensors',
        icon: RotateCcw,
        badge: 'RESET',
        action: () => { resetToBaseline(); onClose(); }
      }
    ].filter(i => !q || i.title.toLowerCase().includes(q) || i.subtitle.toLowerCase().includes(q));

    if (actions.length > 0) sections.push({ category: 'System Actions', items: actions });

    return sections;
  }, [query, buildings, theme, autoRotate, onNavigateTab, onClose, selectAsset, startScenario, resetToBaseline, toggleTheme, setAutoRotate]);

  const flatItems = useMemo(() => {
    return items.flatMap(sec => sec.items);
  }, [items]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, flatItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + flatItems.length) % Math.max(1, flatItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (flatItems[selectedIndex]) {
        flatItems[selectedIndex].action();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-4 pointer-events-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-xl animate-fadeIn"
        onClick={onClose}
      />

      {/* Floating Framer-style Spotlight Card */}
      <div 
        className="relative w-full max-w-2xl bg-[#070b14]/95 border border-cyan-500/40 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.25)] backdrop-blur-2xl overflow-hidden flex flex-col max-h-[75vh] animate-slideDown text-white font-sans"
        onKeyDown={handleKeyDown}
      >
        {/* Search Header Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-[#0c1424]">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, building, or scenario (e.g. 'Flood', 'Office C', 'Analytics')..."
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-white/10 border border-white/15">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-4 custom-scrollbar">
          {items.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-1">
              <Search className="w-8 h-8 text-cyan-400/40 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-300">No matching commands found</p>
              <p className="text-xs text-slate-500">Try searching for "Flood", "Metropolitan", "AI", or "Dark Mode"</p>
            </div>
          ) : (
            items.map((section) => (
              <div key={section.category} className="space-y-1">
                <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                  {section.category}
                </div>
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const globalIdx = flatItems.findIndex(fi => fi.id === item.id);
                    const isSelected = globalIdx === selectedIndex;
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.id}
                        onClick={item.action}
                        onMouseEnter={() => setSelectedIndex(globalIdx)}
                        className={`w-full px-3 py-2.5 rounded-xl text-left flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-r from-cyan-500/20 via-sky-500/15 to-transparent border border-cyan-400/60 shadow-md text-white'
                            : 'hover:bg-white/5 border border-transparent text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3 truncate">
                          <div className={`p-2 rounded-lg shrink-0 ${isSelected ? 'bg-cyan-400 text-black' : 'bg-white/10 text-cyan-400'}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="truncate">
                            <div className="text-xs sm:text-sm font-semibold truncate text-white">{item.title}</div>
                            {item.subtitle && (
                              <div className="text-[11px] text-slate-400 truncate font-normal">{item.subtitle}</div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 ml-2">
                          {item.badge && (
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
                              {item.badge}
                            </span>
                          )}
                          <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'text-cyan-400 translate-x-0.5' : 'text-slate-600'}`} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-white/10 bg-[#0c1424] flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="text-cyan-400 font-bold">AETHER SPOTLIGHT</span>
        </div>
      </div>
    </div>
  );
};
