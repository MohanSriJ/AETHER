import React from 'react';
import { 
  Bot, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  FileText, 
  ArrowRight, 
  ShieldAlert, 
  BrainCircuit 
} from 'lucide-react';
import { AgentReport } from '../../types/ai';
import { useSimulationStore } from '../../store/simulationStore';

interface AgentCardProps {
  report: AgentReport;
  onSelectAsset?: (assetId: string) => void;
  onNavigateToTwin?: () => void;
}

export const AgentCard: React.FC<AgentCardProps> = ({ 
  report, 
  onSelectAsset, 
  onNavigateToTwin 
}) => {
  const calculateRoute = useSimulationStore(state => state.calculateRoute);

  const getStatusBadge = () => {
    switch (report.status) {
      case 'alert':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FF647C]/20 text-[#FF647C] border border-[#FF647C]/30 animate-pulse">
            <AlertTriangle className="w-3 h-3" />
            Active Alert
          </span>
        );
      case 'analyzing':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/30 animate-pulse">
            <Activity className="w-3 h-3" />
            Analyzing
          </span>
        );
      case 'completed':
      default:
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#42D6A4]/20 text-[#42D6A4] border border-[#42D6A4]/30">
            <CheckCircle2 className="w-3 h-3" />
            Nominal / Synced
          </span>
        );
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition flex flex-col justify-between shadow-xl space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[var(--accent-violet)]/15 text-[var(--accent-violet)] border border-[var(--accent-violet)]/30">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)] leading-snug">
                {report.agentName}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] line-clamp-1 mt-0.5">
                {report.role}
              </p>
            </div>
          </div>
          {getStatusBadge()}
        </div>

        {/* Summary Banner */}
        <div className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] leading-relaxed">
          <span className="font-semibold text-[var(--accent-cyan)] uppercase font-mono mr-1.5 text-[10px]">
            SYNTHESIS:
          </span>
          {report.summary}
        </div>
      </div>

      {/* Structured Metrics Grid */}
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(report.metrics).map(([key, val]) => (
          <div key={key} className="p-2.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
            <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider truncate">
              {key}
            </div>
            <div className="text-sm font-bold font-mono text-[var(--text-primary)] mt-0.5 truncate">
              {val}
            </div>
          </div>
        ))}
      </div>

      {/* Key Findings List */}
      <div className="space-y-2">
        <h4 className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-[var(--accent-cyan)]" />
          <span>Observed Evidence & Findings</span>
        </h4>
        <ul className="space-y-1.5 text-xs text-[var(--text-secondary)]">
          {report.findings.map((f, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-cyan)] mt-1.5 shrink-0" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Rules / Formula Evaluated (Explainability) */}
      <div className="space-y-1.5 p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
        <div className="text-[10px] font-mono uppercase text-[var(--accent-violet)] font-semibold flex items-center gap-1">
          <ShieldAlert className="w-3 h-3" />
          <span>Explainable Decision Rules Evaluated</span>
        </div>
        <div className="space-y-1 text-[11px] font-mono text-[var(--text-secondary)]">
          {report.rulesEvaluated.map((rule, idx) => (
            <div key={idx} className="truncate">
              • {rule}
            </div>
          ))}
        </div>
      </div>

      {/* Action Recommendations */}
      {report.recommendations.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
          <h4 className="text-[11px] font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center justify-between">
            <span>Proposed Interventions</span>
            <span className="text-[10px] font-mono text-[var(--accent-cyan)]">
              {report.recommendations.length} Action{report.recommendations.length > 1 ? 's' : ''}
            </span>
          </h4>

          <div className="space-y-2">
            {report.recommendations.map(rec => (
              <div
                key={rec.id}
                className="p-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[var(--text-primary)]">
                    {rec.title}
                  </span>
                  <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                    rec.priority === 'critical' ? 'bg-[#FF647C]/20 text-[#FF647C]' :
                    rec.priority === 'high' ? 'bg-[#FFBF69]/20 text-[#FFBF69]' :
                    'bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)]'
                  }`}>
                    {rec.priority}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                  {rec.action}
                </p>
                <div className="text-[10px] text-[var(--accent-cyan)] font-mono font-medium">
                  Impact: {rec.estimatedImpact}
                </div>

                {rec.affectedAssetIds.length > 0 && onSelectAsset && onNavigateToTwin && (
                  <div className="pt-1.5 flex items-center gap-2">
                    <button
                      onClick={() => {
                        onSelectAsset(rec.affectedAssetIds[0]);
                        onNavigateToTwin();
                      }}
                      className="text-[11px] font-medium text-[var(--accent-cyan)] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Inspect Asset in 3D</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimers & Assumptions */}
      <div className="text-[10px] text-[var(--text-muted)] italic pt-1 border-t border-[var(--border-subtle)]">
        * {report.limitations[0]}
      </div>
    </div>
  );
};
