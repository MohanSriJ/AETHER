import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Radio, 
  Zap 
} from 'lucide-react';
import { useSimulationStore } from '../../store/simulationStore';

export const QuickStatsOverlay: React.FC = () => {
  const metrics = useSimulationStore(state => state.metrics);

  return (
    <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-elevated)]/90 backdrop-blur-md border border-[var(--border-subtle)] shadow-xl text-xs text-[var(--text-primary)]">
      {/* Affected Facilities Count */}
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
        {metrics.affectedBuildingsCount > 0 ? (
          <AlertTriangle className="w-3.5 h-3.5 text-[#FF647C] animate-pulse" />
        ) : (
          <CheckCircle2 className="w-3.5 h-3.5 text-[#42D6A4]" />
        )}
        <span className="text-[var(--text-secondary)] text-[10px] uppercase font-semibold">Impacted:</span>
        <span className={`font-mono font-bold text-xs ${metrics.affectedBuildingsCount > 0 ? 'text-[#FF647C]' : 'text-[#42D6A4]'}`}>
          {metrics.affectedBuildingsCount}
        </span>
      </div>

      {/* Telemetry Health */}
      <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
        <Radio className="w-3.5 h-3.5 text-[var(--accent-cyan)]" />
        <span className="text-[var(--text-secondary)] text-[10px] uppercase font-semibold">Sensors:</span>
        <span className="font-mono text-xs text-[var(--text-primary)] font-bold">
          {metrics.sensorsReporting}/15
        </span>
      </div>

      {/* Power Load */}
      <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
        <Zap className="w-3.5 h-3.5 text-[#FFBF69]" />
        <span className="text-[var(--text-secondary)] text-[10px] uppercase font-semibold">Grid:</span>
        <span className="font-mono text-xs text-[var(--text-primary)] font-bold">
          {metrics.cityPowerGridLoadPercent}%
        </span>
      </div>
    </div>
  );
};
