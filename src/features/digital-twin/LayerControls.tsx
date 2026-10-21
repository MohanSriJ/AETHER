import React from 'react';
import { 
  Layers, 
  Building2, 
  Radio, 
  Flame, 
  GitBranch, 
  Navigation
} from 'lucide-react';
import { useSimulationStore } from '../../store/simulationStore';

export const LayerControls: React.FC = () => {
  const layerVisibility = useSimulationStore(state => state.layerVisibility);
  const toggleLayer = useSimulationStore(state => state.toggleLayer);

  const layers = [
    { key: 'standard' as const, label: 'Buildings', icon: Building2 },
    { key: 'sensors' as const, label: 'Telemetry', icon: Radio },
    { key: 'hazards' as const, label: 'Hazards', icon: Flame },
    { key: 'infrastructure' as const, label: 'Infrastructure', icon: GitBranch },
    { key: 'routes' as const, label: 'Dispatch Route', icon: Navigation }
  ];

  return (
    <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 p-1.5 rounded-xl bg-[var(--bg-elevated)]/90 backdrop-blur-md border border-[var(--border-subtle)] shadow-xl text-[var(--text-primary)]">
      <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider border-r border-[var(--border-subtle)]">
        <Layers className="w-3.5 h-3.5 text-[var(--accent-cyan)]" />
        <span className="hidden sm:inline">Layers</span>
      </div>

      <div className="flex items-center gap-1">
        {layers.map(({ key, label, icon: Icon }) => {
          const active = layerVisibility[key];
          return (
            <button
              key={key}
              onClick={() => toggleLayer(key)}
              title={`Toggle ${label} visibility`}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                active
                  ? 'bg-[var(--bg-surface)] text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/40 shadow-sm font-bold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${active ? 'text-[var(--accent-cyan)]' : 'text-[var(--text-secondary)]'}`} />
              <span className="hidden md:inline">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
