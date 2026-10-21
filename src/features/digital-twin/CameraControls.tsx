import React from 'react';
import { 
  RotateCcw, 
  Orbit, 
  MapPin
} from 'lucide-react';
import { useSimulationStore } from '../../store/simulationStore';
import { useSettingsStore } from '../../store/settingsStore';

export const CameraControls: React.FC = () => {
  const cameraPreset = useSimulationStore(state => state.cameraPreset);
  const setCameraPreset = useSimulationStore(state => state.setCameraPreset);
  const autoRotate = useSettingsStore(state => state.autoRotate);
  const setAutoRotate = useSettingsStore(state => state.setAutoRotate);

  const presets = [
    { key: 'overview' as const, label: 'Overview' },
    { key: 'central' as const, label: 'Central' },
    { key: 'waterfront' as const, label: 'Waterfront' },
    { key: 'industrial' as const, label: 'Industrial' },
    { key: 'tech_quad' as const, label: 'Tech & Med' }
  ];

  return (
    <div className="flex items-center gap-1.5 p-1 sm:p-1.5 rounded-xl bg-[var(--bg-elevated)]/90 backdrop-blur-md border border-[var(--border-subtle)] shadow-xl text-[var(--text-primary)] whitespace-nowrap">
      <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider border-r border-[var(--border-subtle)]">
        <MapPin className="w-3.5 h-3.5 text-[var(--accent-violet)]" />
        <span className="hidden sm:inline">Camera</span>
      </div>

      <div className="flex items-center gap-1">
        {presets.map(({ key, label }) => {
          const isActive = cameraPreset === key;
          return (
            <button
              key={key}
              onClick={() => setCameraPreset(key)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-[var(--bg-surface)] text-[var(--accent-violet)] border border-[var(--accent-violet)]/40 shadow-sm font-bold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]/60'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="h-4 w-px bg-[var(--border-subtle)] mx-1" />

      {/* Auto Orbit Toggle */}
      <button
        onClick={() => setAutoRotate(!autoRotate)}
        title={autoRotate ? 'Disable cinematic orbit' : 'Enable cinematic orbit'}
        className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
          autoRotate
            ? 'bg-[var(--bg-surface)] text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/40 font-bold'
            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
        }`}
      >
        <Orbit className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
        <span className="hidden md:inline">Auto Orbit</span>
      </button>

      {/* Reset Camera to Overview */}
      <button
        onClick={() => setCameraPreset('overview')}
        title="Reset Camera to Overview"
        className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
