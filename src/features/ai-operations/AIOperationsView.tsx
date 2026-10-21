import React, { useState } from 'react';
import { 
  BrainCircuit, 
  RefreshCw, 
  AlertTriangle, 
  Info, 
  ArrowRight
} from 'lucide-react';
import { AgentCard } from './AgentCard';
import { useSimulationStore } from '../../store/simulationStore';

interface AIOperationsViewProps {
  onNavigateToTwin: () => void;
}

export const AIOperationsView: React.FC<AIOperationsViewProps> = ({ onNavigateToTwin }) => {
  const aiReports = useSimulationStore(state => state.aiReports);
  const activeScenario = useSimulationStore(state => state.activeScenario);
  const currentTick = useSimulationStore(state => state.currentTick);
  const selectAsset = useSimulationStore(state => state.selectAsset);
  const tick = useSimulationStore(state => state.tick);

  const [isReevaluating, setIsReevaluating] = useState(false);

  const handleManualReevaluate = () => {
    setIsReevaluating(true);
    tick();
    setTimeout(() => {
      setIsReevaluating(false);
    }, 300);
  };

  const agentsList = [
    aiReports.monitoring,
    aiReports.risk_analysis,
    aiReports.response_planning,
    aiReports.public_comm
  ].filter(Boolean);

  return (
    <div className="w-full h-full overflow-y-auto bg-[var(--bg-primary)] text-[var(--text-primary)] p-4 md:p-8 custom-scrollbar">
      <div className="max-w-6xl mx-auto space-y-6 pb-32 sm:pb-36 pb-safe">
        {/* Header & Control Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[var(--accent-violet)]">
              <BrainCircuit className="w-4 h-4" />
              <span>Multi-Agent Explainable Decision Operations</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] mt-1 tracking-tight">
              AI Operations Centre
            </h1>
            <p className="text-sm text-[var(--text-secondary)] max-w-2xl mt-1.5 leading-relaxed">
              Continuous explainable analysis across four specialized simulated intelligence modules. All risk rankings, anomaly detections, and dispatch priorities derive from transparent deterministic formulas.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleManualReevaluate}
              disabled={isReevaluating}
              className="flex items-center gap-2 py-2 px-4 rounded-xl bg-[var(--bg-elevated)] hover:bg-[var(--bg-surface)] text-[var(--accent-violet)] border border-[var(--border-subtle)] transition text-xs font-bold cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isReevaluating ? 'animate-spin' : ''}`} />
              <span>Re-Evaluate Logic Matrix</span>
            </button>
          </div>
        </div>

        {/* Active Incident Context Ribbon */}
        {activeScenario ? (
          <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[rgba(255,100,124,0.3)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-lg bg-[#FF647C]/15 text-[#FF647C]">
                <AlertTriangle className="w-4 h-4 animate-pulse" />
              </span>
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-[#FF647C] tracking-wider">
                  ACTIVE SIMULATION CONTEXT
                </span>
                <div className="font-bold text-[var(--text-primary)] text-sm">
                  {activeScenario.title} — {(activeScenario.intensity * 100).toFixed(0)}% Intensity ({activeScenario.targetDistrict.toUpperCase()})
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 font-mono text-[var(--accent-cyan)] text-xs">
              <span>Timeframe: T+{currentTick}s</span>
              <button
                onClick={onNavigateToTwin}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--accent-cyan)] text-[var(--btn-primary-text)] font-bold text-xs hover:opacity-90 transition cursor-pointer"
              >
                <span>View in 3D</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#42D6A4]" />
              <span>Municipal baseline equilibrium. All 16 telemetry nodes and 24 facilities reporting nominal.</span>
            </div>
          </div>
        )}

        {/* Local Verification / Transparency Notice */}
        <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-start gap-3 text-xs text-[var(--text-secondary)]">
          <Info className="w-4 h-4 text-[var(--accent-cyan)] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-[var(--text-primary)]">
              Transparency & Model Disclosure:
            </span>{' '}
            These modules operate via certified local deterministic rule sets, spatial distance matrices, and threshold checks. They do not transmit municipal telemetry to third-party proprietary LLM cloud services, ensuring total computational reproducibility and low-latency offline capability.
          </div>
        </div>

        {/* 4 Agent Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {agentsList.map((report) => (
            <AgentCard
              key={report.agentId}
              report={report}
              onSelectAsset={(id) => selectAsset(id)}
              onNavigateToTwin={onNavigateToTwin}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
