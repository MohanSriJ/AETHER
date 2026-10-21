import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Monitor, 
  Eye, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  Info,
  Sun,
  Moon,
  MousePointer
} from 'lucide-react';
import { useSettingsStore, GraphicsQuality } from '../../store/settingsStore';
import { useSimulationStore } from '../../store/simulationStore';

export const SettingsView: React.FC = () => {
  const theme = useSettingsStore(state => state.theme);
  const toggleTheme = useSettingsStore(state => state.toggleTheme);
  const graphicsQuality = useSettingsStore(state => state.graphicsQuality);
  const setGraphicsQuality = useSettingsStore(state => state.setGraphicsQuality);
  const reducedMotion = useSettingsStore(state => state.reducedMotion);
  const setReducedMotion = useSettingsStore(state => state.setReducedMotion);
  const showLabels = useSettingsStore(state => state.showLabels);
  const setShowLabels = useSettingsStore(state => state.setShowLabels);
  const autoRotate = useSettingsStore(state => state.autoRotate);
  const setAutoRotate = useSettingsStore(state => state.setAutoRotate);
  const customCursorEnabled = useSettingsStore(state => state.customCursorEnabled);
  const setCustomCursorEnabled = useSettingsStore(state => state.setCustomCursorEnabled);
  const resetPreferences = useSettingsStore(state => state.resetPreferences);

  const resetToBaseline = useSimulationStore(state => state.resetToBaseline);

  const [notification, setNotification] = useState<string | null>(null);

  const handleResetSession = () => {
    resetToBaseline();
    setNotification('Simulation session and all asset states reset to nominal baseline.');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleResetPreferences = () => {
    resetPreferences();
    setNotification('System display preferences reset to default configuration.');
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-[var(--bg-primary)] text-[var(--text-primary)] p-4 md:p-8 custom-scrollbar">
      <div className="max-w-4xl mx-auto space-y-8 pb-32 sm:pb-36 pb-safe">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[var(--accent-cyan)]">
            <SettingsIcon className="w-4 h-4" />
            <span>Platform Configuration & Preferences</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] mt-1 tracking-tight">
            Settings & System Governance
          </h1>
          <p className="text-sm text-[var(--text-secondary)] max-w-2xl mt-1.5 leading-relaxed">
            Configure 3D rendering pipeline quality, visual themes, accessibility controls, overlay behaviors, and inspect simulation boundary documentation.
          </p>
        </div>

        {notification && (
          <div className="p-3.5 rounded-xl bg-[#42D6A4]/15 border border-[#42D6A4]/40 text-[#42D6A4] text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            <span>{notification}</span>
          </div>
        )}

        {/* Demo Mode Notice Banner */}
        <div className="p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] shadow-lg flex items-start gap-3.5">
          <div className="p-2 rounded-lg bg-[var(--accent-cyan)]/15 text-[var(--accent-cyan)] shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                Simulated Digital Twin Demonstration Environment
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)] font-bold">
                SIMULATED DATA
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              AETHER operates as a closed-loop, deterministic smart-city simulation platform. All 16 telemetry stations, 24 building facilities, and 4 disaster scenarios run locally in your browser without requiring external paid cloud APIs or physical IoT hardware connections.
            </p>
          </div>
        </div>

        {/* Setting Groups */}
        <div className="space-y-6">
          {/* Group 1: Theme & Appearance */}
          <div className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-[var(--border-subtle)]">
              {theme === 'dark' ? <Moon className="w-4 h-4 text-[var(--accent-violet)]" /> : <Sun className="w-4 h-4 text-[#FFBF69]" />}
              <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">
                Visual Theme & Appearance
              </h3>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-[var(--text-primary)]">
                  Interface Theme
                </div>
                <div className="text-[11px] text-[var(--text-secondary)]">
                  Toggle between Cyberpunk Command Center (Dark) and Architectural CAD Instrument (Light).
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 py-2 px-3.5 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-subtle)] text-xs font-semibold transition cursor-pointer"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-[#FFBF69]" />
                    <span>Switch to Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-[var(--accent-violet)]" />
                    <span>Switch to Dark</span>
                  </>
                )}
              </button>
            </div>

            {/* Custom Interactive Cursor Toggle */}
            <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)]">
              <div>
                <div className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                  <MousePointer className="w-3.5 h-3.5 text-[var(--accent-cyan)]" />
                  <span>Signature Precision Cursor</span>
                </div>
                <div className="text-[11px] text-[var(--text-secondary)]">
                  Enables contextual reticle and 3D precision orbit pointer on desktop devices.
                </div>
              </div>
              <input
                type="checkbox"
                checked={customCursorEnabled}
                onChange={(e) => setCustomCursorEnabled(e.target.checked)}
                className="w-4 h-4 accent-[var(--accent-cyan)] rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Group 2: 3D Graphics & Rendering */}
          <div className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-[var(--border-subtle)]">
              <Monitor className="w-4 h-4 text-[var(--accent-cyan)]" />
              <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">
                3D Graphics & Viewport Pipeline
              </h3>
            </div>

            <div>
              <div className="text-xs font-semibold text-[var(--text-primary)] mb-2">
                Rendering Fidelity Preset
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { key: 'high', label: 'High Fidelity', desc: 'Realistic glass textures, beacons, 60fps' },
                  { key: 'balanced', label: 'Balanced', desc: 'Optimized lighting & shaders' },
                  { key: 'low', label: 'Low Power', desc: 'Minimal shadows & post-fx' },
                  { key: 'canvas2d', label: '2D Canvas Fallback', desc: 'Isometric hardware 2D' }
                ].map(item => (
                  <button
                    key={item.key}
                    onClick={() => setGraphicsQuality(item.key as GraphicsQuality)}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                      graphicsQuality === item.key
                        ? 'bg-[var(--bg-elevated)] border-[var(--accent-cyan)] text-[var(--text-primary)] shadow-sm font-bold'
                        : 'bg-[var(--bg-surface)]/50 border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]'
                    }`}
                  >
                    <div className="text-xs font-bold leading-snug">{item.label}</div>
                    <div className="text-[10px] text-[var(--text-secondary)] mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Auto Rotate Toggle */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <div className="text-xs font-semibold text-[var(--text-primary)]">
                  Cinematic Camera Auto-Orbit
                </div>
                <div className="text-[11px] text-[var(--text-secondary)]">
                  Slowly rotates the 3D digital twin when idle to demonstrate spatial depth.
                </div>
              </div>
              <input
                type="checkbox"
                checked={autoRotate}
                onChange={(e) => setAutoRotate(e.target.checked)}
                className="w-4 h-4 accent-[var(--accent-cyan)] rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Group 3: Accessibility & UI Behavior */}
          <div className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-[var(--border-subtle)]">
              <Eye className="w-4 h-4 text-[var(--accent-violet)]" />
              <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">
                Accessibility & Spatial Overlays
              </h3>
            </div>

            {/* Reduced Motion Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-[var(--text-primary)]">
                  Reduced Motion Mode
                </div>
                <div className="text-[11px] text-[var(--text-secondary)]">
                  Disables smooth camera transitions and pulsing hazard radar animations.
                </div>
              </div>
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={(e) => setReducedMotion(e.target.checked)}
                className="w-4 h-4 accent-[var(--accent-cyan)] rounded cursor-pointer"
              />
            </div>

            {/* Show Hover Labels */}
            <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
              <div>
                <div className="text-xs font-semibold text-[var(--text-primary)]">
                  Display 3D Spatial Asset Labels
                </div>
                <div className="text-[11px] text-[var(--text-secondary)]">
                  Shows hovering name badges and telemetry markers directly in the 3D viewport.
                </div>
              </div>
              <input
                type="checkbox"
                checked={showLabels}
                onChange={(e) => setShowLabels(e.target.checked)}
                className="w-4 h-4 accent-[var(--accent-cyan)] rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Group 4: Session Reset & Governance */}
          <div className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[var(--border-subtle)]">
              <RotateCcw className="w-4 h-4 text-[#FFBF69]" />
              <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">
                State Governance & Reset Controls
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleResetSession}
                className="py-2 px-4 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-subtle)] font-semibold text-xs transition cursor-pointer"
              >
                Reset Simulation Session to Baseline
              </button>

              <button
                onClick={handleResetPreferences}
                className="py-2 px-4 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] font-semibold text-xs transition cursor-pointer"
              >
                Restore Display Defaults
              </button>
            </div>
          </div>

          {/* Group 5: About & Technical Architecture Disclosure */}
          <div className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-3 text-xs text-[var(--text-secondary)] leading-relaxed">
            <div className="flex items-center gap-2 text-sm font-bold text-[var(--text-primary)]">
              <Info className="w-4 h-4 text-[var(--accent-cyan)]" />
              <span>About AETHER & Mathematical Foundation</span>
            </div>
            <p>
              AETHER: The Living World is built with React 19, TypeScript, Three.js, React Three Fiber, React Three Drei, Tailwind CSS, Recharts, and Zustand.
            </p>
            <p>
              Emergency pathfinding is calculated via Dijkstra shortest-path navigation traversing a bi-directional graph of 22 intersections and 26 road segments, dynamically reprioritizing routes when flooding or thermal hazards compromise segments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
