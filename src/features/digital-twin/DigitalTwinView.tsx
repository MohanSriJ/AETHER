import React, { useState, useRef, useMemo, useEffect } from 'react';
import { CityScene } from '../../components/three/CityScene';
import { CityCanvasFallback } from '../../components/three/CityCanvasFallback';
import { CameraControls } from './CameraControls';
import { AssetDetailsPanel } from './AssetDetailsPanel';
import { useSettingsStore } from '../../store/settingsStore';
import { useSimulationStore } from '../../store/simulationStore';
import { DistrictId } from '../../types/city';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight,
  Compass,
  ChevronDown,
  ArrowUp,
  Building2,
  Activity,
  Radio,
  Sliders,
  ShieldAlert,
  Zap,
  Waves,
  Flame,
  Search,
  Filter,
  ArrowRight,
  Layers,
  Maximize2
} from 'lucide-react';

export const DigitalTwinView: React.FC = () => {
  const graphicsQuality = useSettingsStore(state => state.graphicsQuality);
  const theme = useSettingsStore(state => state.theme);
  const isLight = theme === 'light';

  const simulationStatus = useSimulationStore(state => state.simulationStatus);
  const pauseSimulation = useSimulationStore(state => state.pauseSimulation);
  const resumeSimulation = useSimulationStore(state => state.resumeSimulation);
  const resetToBaseline = useSimulationStore(state => state.resetToBaseline);
  const playbackSpeed = useSimulationStore(state => state.playbackSpeed);
  const setPlaybackSpeed = useSimulationStore(state => state.setPlaybackSpeed);
  const currentTick = useSimulationStore(state => state.currentTick);
  const seekTick = useSimulationStore(state => state.seekTick);
  const activeScenario = useSimulationStore(state => state.activeScenario);
  const setCameraPreset = useSimulationStore(state => state.setCameraPreset);
  const buildings = useSimulationStore(state => state.buildings);
  const sensors = useSimulationStore(state => state.sensors);
  const selectAsset = useSimulationStore(state => state.selectAsset);
  const selectedAssetId = useSimulationStore(state => state.selectedAssetId);
  const metrics = useSimulationStore(state => state.metrics);
  const layerVisibility = useSimulationStore(state => state.layerVisibility);
  const toggleLayer = useSimulationStore(state => state.toggleLayer);

  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  
  // Downpage filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictId | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'normal' | 'warning' | 'critical' | 'offline'>('all');

  const containerRef = useRef<HTMLDivElement>(null);
  const downpageRef = useRef<HTMLDivElement>(null);

  const maxDuration = activeScenario?.durationSeconds || 60;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const scrollToDownpage = () => {
    downpageRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFocusAsset = (id: string, district: DistrictId) => {
    selectAsset(id);
    setCameraPreset(district);
    scrollToTop();
  };

  // Scroll listener for floating back-to-top button
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleScroll = () => {
      setShowScrollTop(container.scrollTop > 350);
    };
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Filtered buildings for Downpage Directory
  const filteredBuildings = useMemo(() => {
    return buildings.filter(b => {
      const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            b.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDistrict = selectedDistrict === 'all' || b.district === selectedDistrict;
      const matchesStatus = selectedStatus === 'all' || 
                            (selectedStatus === 'offline' ? b.powerState === 'offline' : b.status === selectedStatus);
      return matchesSearch && matchesDistrict && matchesStatus;
    });
  }, [buildings, searchQuery, selectedDistrict, selectedStatus]);

  // District summaries for Downpage Metrics
  const districtSummaries = useMemo(() => {
    const districts: { id: DistrictId; name: string; icon: string }[] = [
      { id: 'central', name: 'Central District', icon: '🏛️' },
      { id: 'waterfront', name: 'Waterfront Basin', icon: '🌊' },
      { id: 'industrial', name: 'Industrial District', icon: '🏭' },
      { id: 'tech_quad', name: 'Tech & Medical Quadrant', icon: '🔬' }
    ];

    return districts.map(d => {
      const dBuildings = buildings.filter(b => b.district === d.id);
      const dSensors = sensors.filter(s => s.district === d.id);
      const avgTemp = (dBuildings.reduce((sum, b) => sum + b.temperature, 0) / (dBuildings.length || 1)).toFixed(1);
      const criticalCount = dBuildings.filter(b => b.status === 'critical' || b.powerState === 'offline').length;
      const warningCount = dBuildings.filter(b => b.status === 'warning').length;
      const powerLoad = dBuildings.reduce((sum, b) => sum + b.powerConsumptionMw, 0).toFixed(1);

      return {
        ...d,
        buildingCount: dBuildings.length,
        sensorCount: dSensors.length,
        avgTemp,
        criticalCount,
        warningCount,
        powerLoad
      };
    });
  }, [buildings, sensors]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-y-auto overflow-x-hidden custom-scrollbar bg-[var(--bg-primary)] text-[var(--text-primary)] scroll-smooth"
    >
      {/* =========================================================================
          SECTION 1: FULL-BLEED 3D DIGITAL TWIN & CLEAN COMMAND VIEWPORT
         ========================================================================= */}
      <section className="relative w-full h-[100dvh] min-h-[100dvh] shrink-0 flex flex-col bg-[#03060c] overflow-hidden">
        {/* Full Edge-to-Edge 3D City Viewport */}
        <div className="absolute inset-0 w-full h-full z-0">
          {graphicsQuality === 'canvas2d' ? (
            <CityCanvasFallback />
          ) : (
            <CityScene />
          )}
        </div>

        {/* =====================================================================
            TOP FLOATING COMMAND & TELEMETRY HUD BAR (Z-20)
           ===================================================================== */}
        <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
          {/* Left: Simulation State & Live Metric Strip */}
          <div className="pointer-events-auto flex items-center gap-2">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl backdrop-blur-md border shadow-lg text-xs font-mono transition-colors ${
              activeScenario
                ? 'bg-rose-950/85 border-rose-500/50 text-rose-300 shadow-rose-950/40'
                : 'bg-[var(--bg-elevated)]/90 border-[var(--border-subtle)] text-[var(--text-primary)]'
            }`}>
              <span className={`w-2 h-2 rounded-full animate-ping ${activeScenario ? 'bg-rose-400' : 'bg-emerald-400'}`} />
              <span className="font-bold">
                {activeScenario ? `DRILL: ${activeScenario.title.toUpperCase()}` : 'LIVE DIGITAL TWIN // 24 ASSETS'}
              </span>
            </div>

            {/* Quick Telemetry Chips */}
            <div className="hidden sm:flex items-center gap-2 p-1 rounded-xl bg-[var(--bg-elevated)]/85 backdrop-blur-md border border-[var(--border-subtle)] text-xs font-mono shadow-md">
              <div className="px-2 py-0.5 text-[11px] text-[var(--text-secondary)]">
                Temp: <span className="font-bold text-[var(--accent-cyan)]">{metrics.avgCityTemperature}°C</span>
              </div>
              <div className="w-px h-3 bg-[var(--border-subtle)]" />
              <div className="px-2 py-0.5 text-[11px] text-[var(--text-secondary)]">
                AQI: <span className="font-bold text-emerald-400">{metrics.avgCityAQI}</span>
              </div>
              <div className="w-px h-3 bg-[var(--border-subtle)]" />
              <div className="px-2 py-0.5 text-[11px] text-[var(--text-secondary)]">
                Grid: <span className="font-bold text-amber-400">{metrics.cityPowerGridLoadPercent}%</span>
              </div>
            </div>
          </div>

          {/* Right: Layer Toggles & Downpage Jump */}
          <div className="pointer-events-auto flex items-center gap-2">
            {/* Layer Visibility Toggles */}
            <div className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-elevated)]/85 backdrop-blur-md border border-[var(--border-subtle)] shadow-md">
              {(['standard', 'sensors', 'hazards', 'routes'] as const).map(layer => {
                const active = layerVisibility[layer];
                const labels: Record<string, string> = {
                  standard: 'Buildings',
                  sensors: 'Sensors',
                  hazards: 'Hazards',
                  routes: 'Routes'
                };
                return (
                  <button
                    key={layer}
                    onClick={() => toggleLayer(layer)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition cursor-pointer ${
                      active
                        ? 'bg-[var(--accent-cyan)]/20 border border-[var(--accent-cyan)]/40 text-[var(--accent-cyan)] font-bold shadow-xs'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {labels[layer]}
                  </button>
                );
              })}
            </div>

            <button
              onClick={scrollToDownpage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-elevated)]/90 hover:bg-[var(--bg-surface)] backdrop-blur-md border border-[var(--border-subtle)] hover:border-[var(--accent-cyan)] text-xs font-mono font-bold text-[var(--accent-cyan)] shadow-md transition cursor-pointer touch-min"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">24 Assets</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Detailed Selected Asset Inspector Drawer (Slides in on right when an asset is selected) */}
        <AssetDetailsPanel />

        {/* =====================================================================
            BOTTOM FLOATING CONTROLS DOCK (Z-20)
           ===================================================================== */}
        <div className="absolute bottom-4 left-3 right-3 sm:left-4 sm:right-4 z-20 flex items-center justify-between pointer-events-none gap-2">
          {/* Bottom Left: Camera Presets */}
          <div className="pointer-events-auto hidden md:flex items-center">
            <CameraControls />
          </div>

          {/* Mobile Camera Reset Quick Pill */}
          <button
            onClick={() => setCameraPreset('overview')}
            title="Reset Camera View"
            className="md:hidden pointer-events-auto p-2.5 rounded-full bg-[var(--bg-elevated)]/90 border border-[var(--border-subtle)] text-[var(--accent-cyan)] shadow-lg backdrop-blur-md touch-min flex items-center justify-center cursor-pointer"
            aria-label="Reset Camera"
          >
            <Compass className="w-5 h-5" />
          </button>

          {/* Bottom Center: Compact Simulation Timeline & Playback Bar */}
          <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-xl bg-[var(--bg-elevated)]/90 backdrop-blur-md border border-[var(--border-subtle)] text-[var(--text-primary)] shadow-2xl w-full sm:w-auto sm:min-w-[400px] max-w-lg">
            {/* Play/Pause */}
            <div className="flex items-center gap-1 shrink-0">
              {simulationStatus === 'running' ? (
                <button
                  onClick={pauseSimulation}
                  title="Pause Simulation"
                  className="p-2 sm:p-1.5 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] text-amber-500 transition cursor-pointer touch-min flex items-center justify-center"
                  aria-label="Pause simulation"
                >
                  <Pause className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                </button>
              ) : (
                <button
                  onClick={resumeSimulation}
                  title={activeScenario ? 'Resume Simulation' : 'Run Simulation'}
                  className="p-2 sm:p-1.5 rounded-lg bg-[var(--accent-cyan)] hover:opacity-90 text-[var(--btn-primary-text)] font-bold transition cursor-pointer shadow-md touch-min flex items-center justify-center"
                  aria-label="Resume simulation"
                >
                  <Play className="w-4 h-4 sm:w-3.5 sm:h-3.5 fill-current" />
                </button>
              )}

              {/* Step Back / Step Forward */}
              <button
                onClick={() => seekTick(Math.max(0, currentTick - 5))}
                title="Step -5s"
                className="p-1.5 sm:p-1 rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition touch-min flex items-center justify-center"
                aria-label="Step backward 5 seconds"
              >
                <ChevronLeft className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
              </button>
              <button
                onClick={() => seekTick(Math.min(maxDuration, currentTick + 5))}
                title="Step +5s"
                className="p-1.5 sm:p-1 rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition touch-min flex items-center justify-center"
                aria-label="Step forward 5 seconds"
              >
                <ChevronRight className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
              </button>

              <button
                onClick={resetToBaseline}
                title="Reset to Baseline"
                className="p-1.5 sm:p-1 rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition touch-min flex items-center justify-center"
                aria-label="Reset simulation to baseline"
              >
                <RotateCcw className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
              </button>
            </div>

            {/* Scrubber Slider */}
            <div className="flex-1 flex items-center gap-1.5 sm:gap-2">
              <span className="font-mono text-[9px] sm:text-[10px] text-[var(--accent-cyan)] shrink-0 font-bold">
                {formatTime(currentTick)}
              </span>
              <input
                type="range"
                min="0"
                max={maxDuration}
                step="1"
                value={currentTick}
                onChange={(e) => seekTick(parseInt(e.target.value, 10))}
                className="w-full h-1.5 sm:h-1 bg-[var(--bg-surface)] rounded-lg appearance-none cursor-pointer accent-[var(--accent-cyan)]"
                title={`Seek: ${formatTime(currentTick)}`}
                aria-label="Timeline seek"
              />
              <span className="font-mono text-[9px] sm:text-[10px] text-[var(--text-muted)] shrink-0">
                {formatTime(maxDuration)}
              </span>
            </div>

            {/* Speed Multipliers */}
            <div className="hidden xs:flex items-center gap-1 pl-1 border-l border-[var(--border-subtle)] shrink-0 font-mono text-[10px]">
              {[1, 2, 4].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-1.5 py-0.5 rounded transition cursor-pointer ${
                    playbackSpeed === spd
                      ? 'bg-[var(--accent-cyan)] text-[var(--btn-primary-text)] font-bold'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Right: Cue Pill to Downpage */}
          <div className="pointer-events-auto hidden lg:flex items-center">
            <button
              onClick={scrollToDownpage}
              title="Inspect Downpage Telemetry & Asset Matrix"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--bg-elevated)]/90 hover:bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent-cyan)] text-[var(--accent-cyan)] text-xs font-mono font-bold shadow-xl backdrop-blur-md transition-all hover:scale-105 cursor-pointer touch-min"
            >
              <span>Inspect Systems Downpage</span>
              <ChevronDown className="w-4 h-4 animate-bounce" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: COMPREHENSIVE DOWNPAGE TELEMETRY & ASSET DIRECTORY
         ========================================================================= */}
      <section 
        ref={downpageRef} 
        id="digital-twin-downpage"
        className="w-full px-4 sm:px-8 py-10 max-w-7xl mx-auto space-y-10 pb-36 animate-fadeIn"
      >
        {/* Downpage Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[var(--accent-cyan)] font-semibold">
              <Building2 className="w-4 h-4" />
              <span>Municipal Systems Telemetry Matrix // Real-Time Digital Twin</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] mt-1 tracking-tight">
              City Infrastructure & Telemetry Directory
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-3xl mt-1.5 leading-relaxed">
              Complete deterministic status across all 24 municipal building assets, real-time telemetry sensor node thresholds, environmental threat cascades, and active emergency interventions.
            </p>
          </div>

          <button
            onClick={scrollToTop}
            className="self-start md:self-auto flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--accent-cyan)] text-[var(--accent-cyan)] text-xs font-mono font-bold transition shadow-sm cursor-pointer touch-min"
          >
            <ArrowUp className="w-4 h-4" />
            <span>Return to 3D Orbit</span>
          </button>
        </div>

        {/* 4 Municipal District Metric Cards */}
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-3 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-[var(--accent-cyan)]" />
            <span>Municipal District Diagnostics</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {districtSummaries.map((dist) => (
              <div 
                key={dist.id}
                onClick={() => setCameraPreset(dist.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer hover:scale-[1.02] shadow-sm ${
                  isLight 
                    ? 'bg-white border-slate-200 hover:border-sky-400' 
                    : 'bg-[#091222] border-[#1e2e4a] hover:border-cyan-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">{dist.icon}</span>
                  <div className="flex items-center gap-1 text-[10px] font-mono">
                    {dist.criticalCount > 0 ? (
                      <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 font-bold">
                        {dist.criticalCount} ALERT
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                        NOMINAL
                      </span>
                    )}
                  </div>
                </div>

                <div className="font-bold text-sm text-[var(--text-primary)] mt-3">
                  {dist.name}
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[var(--border-subtle)] font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-[var(--text-secondary)] block">Avg Temp</span>
                    <span className="font-semibold text-[var(--text-primary)]">{dist.avgTemp}°C</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-secondary)] block">Power Load</span>
                    <span className="font-semibold text-[var(--text-primary)]">{dist.powerLoad} MW</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-secondary)] block">Buildings</span>
                    <span className="font-semibold text-[var(--text-primary)]">{dist.buildingCount} Assets</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-secondary)] block">Sensors</span>
                    <span className="font-semibold text-[var(--text-primary)]">{dist.sensorCount} Nodes</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Full Asset Directory Controls & Filters */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold uppercase tracking-wider text-[var(--text-primary)]">
                Active Building Assets ({filteredBuildings.length} of {buildings.length})
              </span>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                <input
                  type="text"
                  placeholder="Filter by building name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl text-xs bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)] w-56 sm:w-64"
                />
              </div>

              {/* District Filter */}
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl text-xs bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)] cursor-pointer"
                aria-label="Filter assets by district"
              >
                <option value="all">All Districts</option>
                <option value="central">Central District</option>
                <option value="waterfront">Waterfront Basin</option>
                <option value="industrial">Industrial District</option>
                <option value="tech_quad">Tech Quadrant</option>
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl text-xs bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)] cursor-pointer"
                aria-label="Filter assets by status"
              >
                <option value="all">All Statuses</option>
                <option value="normal">Normal</option>
                <option value="warning">Warning</option>
                <option value="critical">Critical</option>
                <option value="offline">Offline</option>
              </select>
            </div>
          </div>

          {/* Asset Grid (24 Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBuildings.map((b) => {
              const isSelected = selectedAssetId === b.id;
              const isOffline = b.powerState === 'offline';
              const isCritical = b.status === 'critical' || isOffline;
              const isWarning = b.status === 'warning';

              return (
                <div
                  key={b.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[var(--bg-elevated)] border-[var(--accent-cyan)] shadow-lg shadow-[var(--accent-cyan)]/15 scale-[1.01]'
                      : isLight
                        ? 'bg-white border-slate-200 hover:border-slate-300'
                        : 'bg-[#091222] border-[#1a2842] hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono text-[var(--accent-cyan)] uppercase tracking-wider block">
                          {b.id} • {b.district.replace('_', ' ').toUpperCase()}
                        </span>
                        <h4 className="font-extrabold text-sm text-[var(--text-primary)] mt-0.5 leading-snug">
                          {b.name}
                        </h4>
                      </div>

                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase shrink-0 ${
                        isCritical
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : isWarning
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {isOffline ? 'OFFLINE' : b.status}
                      </span>
                    </div>

                    {/* Asset Specs & Live Telemetry Grid */}
                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[var(--border-subtle)] font-mono text-xs">
                      <div>
                        <span className="text-[10px] text-[var(--text-secondary)] block">Type</span>
                        <span className="font-semibold text-[var(--text-primary)] capitalize">{b.type.replace('_', ' ')}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[var(--text-secondary)] block">Floors / Pop</span>
                        <span className="font-semibold text-[var(--text-primary)]">{b.floors}F / {b.populationEstimate.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[var(--text-secondary)] block">Temperature</span>
                        <span className={`font-semibold ${b.temperature > 30 ? 'text-amber-400 font-bold' : 'text-[var(--text-primary)]'}`}>
                          {b.temperature.toFixed(1)}°C
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[var(--text-secondary)] block">Power Consumption</span>
                        <span className="font-semibold text-[var(--text-primary)]">{b.powerConsumptionMw.toFixed(1)} MW</span>
                      </div>
                    </div>

                    {/* Structural Integrity Progress Bar */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-secondary)] mb-1">
                        <span>Structural Integrity</span>
                        <span className="font-semibold text-[var(--text-primary)]">{b.structuralIntegrity}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-700/30 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            b.structuralIntegrity < 50
                              ? 'bg-red-500'
                              : b.structuralIntegrity < 80
                                ? 'bg-amber-400'
                                : 'bg-emerald-400'
                          }`}
                          style={{ width: `${b.structuralIntegrity}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions: Focus in 3D */}
                  <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
                    <button
                      onClick={() => handleFocusAsset(b.id, b.district)}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-[var(--accent-cyan)]/15 hover:bg-[var(--accent-cyan)]/25 border border-[var(--accent-cyan)]/40 text-[var(--accent-cyan)] font-mono text-xs font-bold transition cursor-pointer touch-min"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Focus in 3D Orbit</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real-Time Sensor Telemetry Matrix */}
        <div className="p-6 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-[var(--accent-cyan)] animate-pulse" />
              <h3 className="text-base font-extrabold text-[var(--text-primary)]">
                Live Sensor Telemetry Array ({sensors.length} Active Nodes)
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold uppercase">
              100% Signal Integrity
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {sensors.slice(0, 8).map((s) => (
              <div 
                key={s.id}
                className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] font-mono text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[var(--text-secondary)]">{s.id}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[9px] uppercase font-bold ${
                    s.status === 'critical'
                      ? 'bg-red-500/20 text-red-400'
                      : s.status === 'alert'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {s.status}
                  </span>
                </div>
                <div className="font-bold text-[var(--text-primary)] mt-1 truncate">
                  {s.name}
                </div>
                <div className="text-base font-bold text-[var(--accent-cyan)] mt-1">
                  {s.currentValue.toFixed(1)} <span className="text-[10px] text-[var(--text-secondary)] font-normal">{s.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Floating Quick Return to 3D Orbit Button (Visible only after scrolling into downpage) */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          title="Return to 3D Command View"
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-[var(--accent-cyan)] text-[var(--btn-primary-text)] shadow-2xl hover:scale-110 transition-all cursor-pointer touch-min flex items-center justify-center font-bold animate-fadeIn"
          aria-label="Return to 3D view"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
