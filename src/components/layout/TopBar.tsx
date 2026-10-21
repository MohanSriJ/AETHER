import React from 'react';
import { 
  Activity, 
  Clock, 
  ShieldCheck, 
  Settings, 
  Menu, 
  Sparkles,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Sun,
  Moon,
  Search
} from 'lucide-react';
import { useSimulationStore } from '../../store/simulationStore';
import { useSettingsStore } from '../../store/settingsStore';

interface TopBarProps {
  onToggleSidebar?: () => void;
  onOpenSettings: () => void;
  onOpenCommandPalette?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ 
  onToggleSidebar, 
  onOpenSettings,
  onOpenCommandPalette 
}) => {
  const simulationStatus = useSimulationStore(state => state.simulationStatus);
  const activeScenario = useSimulationStore(state => state.activeScenario);
  const currentTick = useSimulationStore(state => state.currentTick);
  const pauseSimulation = useSimulationStore(state => state.pauseSimulation);
  const resumeSimulation = useSimulationStore(state => state.resumeSimulation);
  const resetToBaseline = useSimulationStore(state => state.resetToBaseline);
  const metrics = useSimulationStore(state => state.metrics);

  const theme = useSettingsStore(state => state.theme);
  const toggleTheme = useSettingsStore(state => state.toggleTheme);

  const formatSimTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `T+${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <header className="h-16 px-3 sm:px-6 bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)] flex items-center justify-between select-none z-30 transition-colors duration-200 shrink-0">
      {/* Left: Brand & Mobile Toggle */}
      <div className="flex items-center gap-2 sm:gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition touch-min flex items-center justify-center cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#54E7F2] to-[#9D8CFF] flex items-center justify-center font-black text-black text-sm shadow-md shadow-[#54E7F2]/20 shrink-0">
            Æ
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-extrabold text-sm tracking-wider text-[var(--text-primary)]">AETHER</span>
              <span className="text-[10px] text-[var(--text-secondary)] font-mono hidden sm:inline">v3.0</span>
            </div>
            <div className="text-[10px] text-[var(--accent-cyan)] font-mono tracking-wider hidden xs:block">
              CENTRAL COMMAND
            </div>
          </div>
        </div>
      </div>

      {/* Center: Live Simulation Status & Clock */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Sim Status Pill */}
        <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs">
          <span className={`w-2 h-2 rounded-full shrink-0 ${
            simulationStatus === 'running' ? 'bg-[#54E7F2] animate-pulse' :
            simulationStatus === 'paused' ? 'bg-[#FFBF69]' :
            simulationStatus === 'completed' ? 'bg-[#9D8CFF]' :
            'bg-[#42D6A4]'
          }`} />
          <span className="font-mono text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-[var(--text-primary)] truncate max-w-[90px] xs:max-w-[130px] sm:max-w-none">
            {activeScenario
              ? (simulationStatus === 'running' ? `INCIDENT: ${activeScenario.id.toUpperCase()}` : simulationStatus.toUpperCase())
              : 'EQUILIBRIUM'}
          </span>
        </div>

        {/* Sim Clock (Hidden on smallest mobile, visible >= 640px) */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-mono text-xs">
          <Clock className="w-3.5 h-3.5 text-[var(--accent-cyan)]" />
          <span>{formatSimTime(currentTick)}</span>
        </div>
      </div>

      {/* Right: Quick Controls, Spotlight Search, Theme Switch & Settings */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Spotlight Command Search Button (⌘K / Ctrl+K) */}
        {onOpenCommandPalette && (
          <button
            onClick={onOpenCommandPalette}
            title="Search commands, buildings & scenarios (Ctrl+K)"
            aria-label="Open command palette"
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg bg-[var(--bg-elevated)] hover:bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-mono transition touch-min cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-[var(--accent-cyan)]" />
            <span className="hidden md:inline">Spotlight</span>
            <kbd className="hidden lg:inline-flex px-1.5 py-0.5 rounded text-[9px] bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-muted)]">
              ⌘K
            </kbd>
          </button>
        )}

        {/* Accessible Theme Switcher */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle visual theme"
          className="p-2 sm:p-2.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition touch-min flex items-center justify-center cursor-pointer"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-[#FFBF69]" />
          ) : (
            <Moon className="w-4 h-4 text-[#6D28D9]" />
          )}
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          title="Open System Preferences"
          aria-label="Open settings"
          className="p-2 sm:p-2.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition touch-min flex items-center justify-center cursor-pointer"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
