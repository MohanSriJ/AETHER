import React, { useState } from 'react';
import { 
  Waves, 
  Flame, 
  SunMedium, 
  Zap, 
  Play, 
  Pause, 
  RotateCcw, 
  Sliders, 
  MapPin, 
  Clock, 
  CheckCircle2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { DistrictId } from '../../types/city';
import { ScenarioConfig, ScenarioType } from '../../types/simulation';
import { useSimulationStore } from '../../store/simulationStore';

interface ScenarioTemplate {
  id: ScenarioType;
  title: string;
  tagline: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  defaultDistrict: DistrictId;
  defaultIntensity: number;
  durationSeconds: number;
  accentColor: string;
  affectedInfrastructure: string[];
  expectedConsequences: string[];
}

export const SCENARIO_TEMPLATES: ScenarioTemplate[] = [
  {
    id: 'flood',
    title: 'Urban Storm Surge & Coastal Flooding',
    tagline: 'Tidal overflow breaches seawalls in the low-elevation Waterfront Basin.',
    description: 'Simulates torrential precipitation coinciding with ocean storm surges. Evaluates seawall containment, inundated arterial roadways, and pump station electrical failure.',
    icon: Waves,
    defaultDistrict: 'waterfront',
    defaultIntensity: 0.75,
    durationSeconds: 60,
    accentColor: '#38bdf8',
    affectedInfrastructure: [
      'Aqua Marine Terminal & Port Authority',
      'Tidal Water Filtration & Pumping Hub',
      'Harborview Residential Blocks',
      'Promenade Seawall Roadways'
    ],
    expectedConsequences: [
      'Water levels climb up to 2.8m above baseline',
      'Waterfront roads become impassable / closed',
      'Pumping stations shift to auxiliary backup power',
      'Automated dispatch re-routes via Bifrost Bridge bypass'
    ]
  },
  {
    id: 'fire',
    title: 'Industrial Chemical Fire & Particulate Hazard',
    tagline: 'Thermal runaway in chemical refinery creates hazardous particulate dispersion plume.',
    description: 'Models rapid fire propagation through heavy industrial manufacturing zones. Calculates plume trajectory, particulate air toxicity (AQI > 300), and dispatch perimeter isolation.',
    icon: Flame,
    defaultDistrict: 'industrial',
    defaultIntensity: 0.85,
    durationSeconds: 60,
    accentColor: '#ff647c',
    affectedInfrastructure: [
      'Vulcan Chemical Plant & Synthesis Labs',
      'Metro Gas Turbine Generating Station',
      'East Rail Freight Hub & Cargo Depots',
      'Arterial Hazmat Access Roads'
    ],
    expectedConsequences: [
      'Particulate AQI spikes past 380 in Industrial Quadrant',
      'Structural thermal stress drops facility integrity below 40%',
      'Emergency containment cordon automatically closes surrounding segments',
      'Civilian evacuation advisory triggered for adjacent sectors'
    ]
  },
  {
    id: 'heatwave',
    title: 'Metropolitan Heat Dome & Cooling Stress',
    tagline: 'Stagnant high-pressure system raises ambient urban temperature above 43°C.',
    description: 'Simulates acute urban heat island stress across high-density commercial towers and residential complexes. Evaluates district cooling energy demand and vulnerable citizen exposure.',
    icon: SunMedium,
    defaultDistrict: 'central',
    defaultIntensity: 0.8,
    durationSeconds: 60,
    accentColor: '#ffbf69',
    affectedInfrastructure: [
      'Apex Corporate Tower & Central Spire',
      'Civic Plaza Center & Municipal Hall',
      'Grand Station Metro Hub',
      'High-Density Commercial Complexes'
    ],
    expectedConsequences: [
      'Ambient citywide air temperature climbs past 42.5°C',
      'District HVAC power grid loading surges beyond 92%',
      'Heat distress incidents registered across 8,000+ citizens',
      'Cooling centers and misting stations deployed via dispatch route'
    ]
  },
  {
    id: 'power_outage',
    title: 'High-Voltage Grid Outage & Cascade',
    tagline: 'Transformer explosion at primary substation cascades into district-wide blackout.',
    description: 'Triggers sudden loss of primary power across central commercial and industrial sectors. Assesses emergency generator failover at critical hospitals and trauma centres.',
    icon: Zap,
    defaultDistrict: 'central',
    defaultIntensity: 0.9,
    durationSeconds: 60,
    accentColor: '#9d8cff',
    affectedInfrastructure: [
      'Central Grid Distribution Substation',
      'Horizon General Hospital & Trauma Center',
      'Quantum Computing Datacenter',
      'Traffic Signaling & Transit Substations'
    ],
    expectedConsequences: [
      'Commercial and industrial facilities lose primary power',
      'Hospital & Quantum Datacenter engage diesel backup',
      'Grid frequency collapse and telemetry alert alarms',
      'Traffic gridlock on central arterial intersections'
    ]
  }
];

export const ScenarioLabView: React.FC<{ onNavigateToTwin: () => void }> = ({ onNavigateToTwin }) => {
  const activeScenario = useSimulationStore(state => state.activeScenario);
  const simulationStatus = useSimulationStore(state => state.simulationStatus);
  const startScenario = useSimulationStore(state => state.startScenario);
  const pauseSimulation = useSimulationStore(state => state.pauseSimulation);
  const resumeSimulation = useSimulationStore(state => state.resumeSimulation);
  const resetToBaseline = useSimulationStore(state => state.resetToBaseline);
  const currentTick = useSimulationStore(state => state.currentTick);

  // Local state for scenario configuration adjustments
  const [selectedTemplateId, setSelectedTemplateId] = useState<ScenarioType>('flood');
  const [intensity, setIntensity] = useState<number>(0.75);
  const [district, setDistrict] = useState<DistrictId | 'all'>('waterfront');
  const [duration, setDuration] = useState<number>(60);

  const selectedTemplate = SCENARIO_TEMPLATES.find(t => t.id === selectedTemplateId)!;

  const handleSelectTemplate = (t: ScenarioTemplate) => {
    setSelectedTemplateId(t.id);
    setIntensity(t.defaultIntensity);
    setDistrict(t.defaultDistrict);
    setDuration(t.durationSeconds);
  };

  const handleLaunch = () => {
    const config: ScenarioConfig = {
      id: selectedTemplate.id,
      title: selectedTemplate.title,
      tagline: selectedTemplate.tagline,
      description: selectedTemplate.description,
      iconName: selectedTemplate.id,
      intensity,
      targetDistrict: district,
      durationSeconds: duration
    };
    startScenario(config);
    onNavigateToTwin();
  };

  const isCurrentActive = activeScenario?.id === selectedTemplateId;

  return (
    <div className="w-full h-full overflow-y-auto bg-[var(--bg-primary)] text-[var(--text-primary)] p-4 md:p-8 custom-scrollbar">
      <div className="max-w-6xl mx-auto space-y-8 pb-32 sm:pb-36 pb-safe">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[var(--accent-cyan)]">
            <Sliders className="w-4 h-4" />
            <span>Deterministic Emergency Simulation Engine</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] mt-1 tracking-tight">
            Scenario Laboratory
          </h1>
          <p className="text-sm text-[var(--text-secondary)] max-w-2xl mt-1.5 leading-relaxed">
            Select an urban emergency scenario, calibrate severity intensity, and inspect how cascading environmental and infrastructural dynamics propagate across the 3D digital twin.
          </p>
        </div>

        {/* 4 Scenario Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {SCENARIO_TEMPLATES.map(t => {
            const Icon = t.icon;
            const isSelected = selectedTemplateId === t.id;
            const isActive = activeScenario?.id === t.id;

            return (
              <div
                key={t.id}
                onClick={() => handleSelectTemplate(t)}
                className={`relative p-5 rounded-xl cursor-pointer transition-all border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[var(--bg-elevated)] border-[var(--accent-cyan)] shadow-lg shadow-[var(--accent-cyan)]/10'
                    : 'bg-[var(--bg-secondary)] border-[var(--border-subtle)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-elevated)]'
                }`}
              >
                {isActive && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-wider bg-[#FF647C]/20 text-[#FF647C] border border-[#FF647C]/40 animate-pulse">
                    Live Active
                  </span>
                )}

                <div>
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 border"
                    style={{
                      backgroundColor: `${t.accentColor}15`,
                      color: t.accentColor,
                      borderColor: `${t.accentColor}30`
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1 leading-snug">
                    {t.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] line-clamp-3 leading-relaxed">
                    {t.tagline}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
                  <span className="capitalize font-mono">{t.defaultDistrict}</span>
                  <span className="font-mono text-[var(--accent-cyan)] font-bold">{(t.defaultIntensity * 100).toFixed(0)}% Intensity</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Scenario Customization Workbench */}
        <div className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] shadow-xl grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Details & Parameters */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-start gap-4">
              <div
                className="p-3.5 rounded-xl border shrink-0"
                style={{
                  backgroundColor: `${selectedTemplate.accentColor}20`,
                  color: selectedTemplate.accentColor,
                  borderColor: `${selectedTemplate.accentColor}40`
                }}
              >
                <selectedTemplate.icon className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--accent-cyan)] border border-[var(--border-subtle)]">
                    CONFIGURING: {selectedTemplate.id.toUpperCase()}
                  </span>
                  {isCurrentActive && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#42D6A4]/20 text-[#42D6A4]">
                      CURRENT RUNNING STATE: {simulationStatus.toUpperCase()} (T+{currentTick}s)
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold text-[var(--text-primary)] mt-1">
                  {selectedTemplate.title}
                </h2>
                <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                  {selectedTemplate.description}
                </p>
              </div>
            </div>

            {/* Parameter Sliders & Pickers */}
            <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-5">
              {/* Intensity Slider */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-[var(--accent-cyan)]" />
                    <span>Scenario Severity Intensity</span>
                  </span>
                  <span className="font-mono text-sm font-bold text-[var(--accent-cyan)]">
                    {(intensity * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="1.0"
                  step="0.05"
                  value={intensity}
                  onChange={(e) => setIntensity(parseFloat(e.target.value))}
                  className="w-full accent-[var(--accent-cyan)] bg-[var(--bg-surface)] h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[var(--text-secondary)] font-mono mt-1">
                  <span>Mild (20%)</span>
                  <span>Moderate (50%)</span>
                  <span>Severe (80%)</span>
                  <span>Catastrophic (100%)</span>
                </div>
              </div>

              {/* District & Duration Pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[var(--border-subtle)]">
                <div>
                  <label className="text-xs font-semibold text-[var(--text-primary)] mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[var(--accent-violet)]" />
                    <span>Target Municipal Sector</span>
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value as any)}
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg py-2 px-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)] cursor-pointer"
                  >
                    <option value="waterfront">Waterfront & Harbor Basin</option>
                    <option value="industrial">Industrial & Power District</option>
                    <option value="central">Central Spire & Civic Core</option>
                    <option value="tech_quad">Tech Quadrant & Medical Center</option>
                    <option value="all">Citywide Metrowide Impact</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--text-primary)] mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#FFBF69]" />
                    <span>Simulation Duration</span>
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg py-2 px-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)] cursor-pointer"
                  >
                    <option value={30}>30 Seconds (Rapid Cycle)</option>
                    <option value={60}>60 Seconds (Standard Drill)</option>
                    <option value={90}>90 Seconds (Extended Evaluation)</option>
                    <option value={120}>120 Seconds (Full Lifecycle)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Launch & Control Actions */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={handleLaunch}
                className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[var(--accent-cyan)] hover:opacity-90 text-[var(--btn-primary-text)] font-bold text-sm transition shadow-lg shadow-[var(--accent-cyan)]/25 cursor-pointer touch-min"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Launch & Enter 3D Twin</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {isCurrentActive && simulationStatus === 'running' && (
                <button
                  onClick={pauseSimulation}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] text-[#FFBF69] border border-[#FFBF69]/30 text-sm font-semibold transition cursor-pointer touch-min"
                >
                  <Pause className="w-4 h-4" />
                  <span>Pause Active Run</span>
                </button>
              )}

              {isCurrentActive && simulationStatus === 'paused' && (
                <button
                  onClick={resumeSimulation}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] text-[#42D6A4] border border-[#42D6A4]/30 text-sm font-semibold transition cursor-pointer touch-min"
                >
                  <Play className="w-4 h-4" />
                  <span>Resume Run</span>
                </button>
              )}

              <button
                onClick={resetToBaseline}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm font-semibold transition border border-[var(--border-subtle)] cursor-pointer touch-min"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Return to Baseline</span>
              </button>
            </div>
          </div>

          {/* Right Col: Affected Infrastructure & Expected Consequences */}
          <div className="space-y-5 bg-[var(--bg-elevated)] p-5 rounded-xl border border-[var(--border-subtle)]">
            <div>
              <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-[#FFBF69]" />
                <span>Potentially Exposed Assets</span>
              </h4>
              <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
                {selectedTemplate.affectedInfrastructure.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-cyan)] mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-[var(--border-subtle)]">
              <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#42D6A4]" />
                <span>Simulated Outcomes</span>
              </h4>
              <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
                {selectedTemplate.expectedConsequences.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#42D6A4] mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
