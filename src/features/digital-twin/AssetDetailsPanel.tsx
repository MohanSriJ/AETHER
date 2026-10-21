import React from 'react';
import { 
  Building2, 
  Thermometer, 
  Wind, 
  ShieldAlert, 
  Zap, 
  Droplets, 
  Flame, 
  Navigation, 
  X, 
  Users, 
  Compass, 
  AlertTriangle, 
  RotateCcw, 
  CheckCircle2 
} from 'lucide-react';
import { useSimulationStore } from '../../store/simulationStore';
import { findNearestRoadNode } from '../../simulation/routing/spatial';

export const AssetDetailsPanel: React.FC = () => {
  const selectedAssetId = useSimulationStore(state => state.selectedAssetId);
  const selectAsset = useSimulationStore(state => state.selectAsset);
  const buildings = useSimulationStore(state => state.buildings);
  const roadIntersections = useSimulationStore(state => state.roadIntersections);
  const calculateRoute = useSimulationStore(state => state.calculateRoute);
  const clearRoute = useSimulationStore(state => state.clearRoute);
  const activeRoute = useSimulationStore(state => state.activeRoute);
  const setCameraPreset = useSimulationStore(state => state.setCameraPreset);

  const building = buildings.find(b => b.id === selectedAssetId);

  if (!building) return null;

  const tempDiff = Number((building.temperature - building.baseline.temperature).toFixed(1));
  const aqiDiff = building.airQualityIndex - building.baseline.airQualityIndex;
  const nearestNodeId = findNearestRoadNode(building.position, roadIntersections);
  const nearestNode = roadIntersections.find(n => n.id === nearestNodeId);

  const isTargetOfRoute = activeRoute?.destinationNodeId === nearestNodeId;

  return (
    <div className="absolute z-30 flex flex-col bg-[var(--bg-elevated)]/95 backdrop-blur-md border border-[var(--border-subtle)] text-[var(--text-primary)] rounded-t-2xl md:rounded-xl shadow-2xl overflow-hidden transition-all duration-200
      max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:max-h-[70vh] max-md:pb-safe
      md:top-20 md:bottom-8 md:right-4 md:w-96"
    >
      {/* Mobile Drag Indicator Bar */}
      <div className="md:hidden flex justify-center pt-2.5 pb-1">
        <div className="w-12 h-1.5 bg-[var(--border-strong)] rounded-full" />
      </div>

      {/* Panel Header */}
      <div className="p-3.5 sm:p-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 sm:p-2.5 rounded-lg shrink-0 ${
            building.status === 'critical' ? 'bg-[#FF647C]/15 text-[#FF647C] border border-[#FF647C]/30' :
            building.status === 'warning' ? 'bg-[#FFBF69]/15 text-[#FFBF69] border border-[#FFBF69]/30' :
            'bg-[var(--accent-cyan)]/15 text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/30'
          }`}>
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-wider px-1.5 py-0.5 rounded bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                {building.id.toUpperCase()}
              </span>
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                building.status === 'critical' ? 'bg-[#FF647C]/20 text-[#FF647C]' :
                building.status === 'warning' ? 'bg-[#FFBF69]/20 text-[#FFBF69]' :
                'bg-[var(--status-success)]/20 text-[var(--status-success)]'
              }`}>
                {building.status}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mt-1 leading-snug line-clamp-1">
              {building.name}
            </h3>
          </div>
        </div>
        <button
          onClick={() => selectAsset(null)}
          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-2 rounded-lg hover:bg-[var(--bg-elevated)] transition touch-min flex items-center justify-center"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-4 text-xs custom-scrollbar">
        {/* District & Importance Summary */}
        <div className="grid grid-cols-2 gap-2 bg-[var(--bg-surface)] p-3 rounded-lg border border-[var(--border-subtle)]">
          <div>
            <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">District</div>
            <div className="text-xs font-semibold text-[var(--accent-cyan)] uppercase font-mono mt-0.5">
              {building.district.replace('_', ' ')}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">Asset Importance</div>
            <div className="text-xs font-semibold text-[var(--text-primary)] font-mono mt-0.5">
              {building.infrastructureImportance} / 100
            </div>
          </div>
          <div>
            <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">Type / Floors</div>
            <div className="text-xs font-medium text-[var(--text-primary)] capitalize mt-0.5">
              {building.type.replace('_', ' ')} ({building.floors} fl)
            </div>
          </div>
          <div>
            <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">Est. Occupants</div>
            <div className="text-xs font-medium text-[var(--text-primary)] font-mono mt-0.5 flex items-center gap-1">
              <Users className="w-3 h-3 text-[var(--text-secondary)]" />
              {building.populationEstimate.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Hazard Exposure Alert Banner (if affected) */}
        {(building.floodDepth > 0 || building.fireSeverity > 0 || building.status !== 'normal') && (
          <div className="p-3 rounded-lg bg-[#FF647C]/10 border border-[#FF647C]/30 text-[#FF647C] space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-xs">
              <AlertTriangle className="w-4 h-4" />
              <span>Simulated Hazard Exposure</span>
            </div>
            {building.floodDepth > 0 && (
              <p className="text-[11px] text-[var(--text-secondary)]">
                Submerged foundation level: <span className="font-mono text-[var(--text-primary)] font-bold">{building.floodDepth} m</span>
              </p>
            )}
            {building.fireSeverity > 0 && (
              <p className="text-[11px] text-[var(--text-secondary)]">
                Thermal propagation intensity: <span className="font-mono text-[var(--text-primary)] font-bold">{building.fireSeverity}%</span>
              </p>
            )}
          </div>
        )}

        {/* Live Telemetry Readings vs Baseline */}
        <div className="space-y-2">
          <div className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[var(--accent-cyan)]" />
            <span>Facility Telemetry & Metrics</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Temperature */}
            <div className="p-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
              <div className="flex items-center justify-between text-[var(--text-secondary)] mb-1">
                <span className="flex items-center gap-1 text-[10px] uppercase">
                  <Thermometer className="w-3 h-3 text-[#FFBF69]" /> Temp
                </span>
                <span className={`text-[10px] font-mono font-bold ${tempDiff > 0 ? 'text-[#FF647C]' : 'text-[var(--status-success)]'}`}>
                  {tempDiff > 0 ? `+${tempDiff}` : tempDiff}°C
                </span>
              </div>
              <div className="text-base font-bold font-mono text-[var(--text-primary)]">
                {building.temperature} <span className="text-xs font-normal text-[var(--text-secondary)]">°C</span>
              </div>
              <div className="text-[9px] text-[var(--text-secondary)] mt-0.5">
                Baseline: {building.baseline.temperature}°C
              </div>
            </div>

            {/* Air Quality */}
            <div className="p-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
              <div className="flex items-center justify-between text-[var(--text-secondary)] mb-1">
                <span className="flex items-center gap-1 text-[10px] uppercase">
                  <Wind className="w-3 h-3 text-[var(--accent-cyan)]" /> AQI
                </span>
                <span className={`text-[10px] font-mono font-bold ${aqiDiff > 0 ? 'text-[#FF647C]' : 'text-[var(--status-success)]'}`}>
                  {aqiDiff > 0 ? `+${aqiDiff}` : aqiDiff}
                </span>
              </div>
              <div className="text-base font-bold font-mono text-[var(--text-primary)]">
                {building.airQualityIndex} <span className="text-xs font-normal text-[var(--text-secondary)]">AQI</span>
              </div>
              <div className="text-[9px] text-[var(--text-secondary)] mt-0.5">
                Baseline: {building.baseline.airQualityIndex} AQI
              </div>
            </div>

            {/* Structural Integrity */}
            <div className="p-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
              <div className="flex items-center justify-between text-[var(--text-secondary)] mb-1">
                <span className="flex items-center gap-1 text-[10px] uppercase">
                  <ShieldAlert className="w-3 h-3 text-[var(--accent-violet)]" /> Integrity
                </span>
              </div>
              <div className="text-base font-bold font-mono text-[var(--text-primary)]">
                {building.structuralIntegrity}%
              </div>
              <div className="w-full bg-[var(--bg-elevated)] h-1.5 rounded-full overflow-hidden mt-1">
                <div
                  className={`h-full ${
                    building.structuralIntegrity > 80 ? 'bg-[var(--status-success)]' :
                    building.structuralIntegrity > 50 ? 'bg-[#FFBF69]' : 'bg-[#FF647C]'
                  }`}
                  style={{ width: `${building.structuralIntegrity}%` }}
                />
              </div>
            </div>

            {/* Power State */}
            <div className="p-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
              <div className="flex items-center justify-between text-[var(--text-secondary)] mb-1">
                <span className="flex items-center gap-1 text-[10px] uppercase">
                  <Zap className="w-3 h-3 text-[var(--accent-cyan)]" /> Power
                </span>
              </div>
              <div className="text-base font-bold font-mono uppercase text-[var(--text-primary)] flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${
                  building.powerState === 'online' ? 'bg-[var(--status-success)]' :
                  building.powerState === 'backup' ? 'bg-[#FFBF69] animate-pulse' : 'bg-[#FF647C]'
                }`} />
                {building.powerState}
              </div>
              <div className="text-[9px] text-[var(--text-secondary)] mt-0.5">
                Load: {building.powerConsumptionMw} MW
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Dispatch & Navigation Action */}
        <div className="pt-2 border-t border-[var(--border-subtle)]">
          {isTargetOfRoute ? (
            <button
              onClick={clearRoute}
              className="w-full py-2.5 px-3 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-semibold flex items-center justify-center gap-2 transition touch-min cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-[var(--accent-cyan)]" />
              <span>Clear Navigation Route</span>
            </button>
          ) : (
            <button
              onClick={() => {
                if (nearestNode) {
                  calculateRoute('node-hosp-depot', nearestNode.id);
                }
              }}
              className="w-full py-2.5 px-3 rounded-lg bg-[var(--accent-cyan)] hover:opacity-90 text-[var(--btn-primary-text)] font-bold flex items-center justify-center gap-2 transition shadow-md touch-min cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              <span>Dispatch Emergency Response</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
