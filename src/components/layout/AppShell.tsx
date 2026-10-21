import React, { useState, useEffect } from 'react';
import { TopBar } from './TopBar';
import { Sidebar, NavigationTab } from './Sidebar';
import { DigitalTwinView } from '../../features/digital-twin/DigitalTwinView';
import { ScenarioLabView } from '../../features/scenarios/ScenarioLabView';
import { AIOperationsView } from '../../features/ai-operations/AIOperationsView';
import { AnalyticsView } from '../../features/analytics/AnalyticsView';
import { ReportsView } from '../../features/reports/ReportsView';
import { SettingsView } from '../../features/settings/SettingsView';
import { LandingPage } from '../../features/landing/LandingPage';
import { CommandPalette } from '../ui/CommandPalette';
import { useSimulationStore } from '../../store/simulationStore';

export const AppShell: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('landing');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const simulationStatus = useSimulationStore(state => state.simulationStatus);
  const playbackSpeed = useSimulationStore(state => state.playbackSpeed);
  const tick = useSimulationStore(state => state.tick);

  // Global Command Palette Shortcut (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Deterministic simulation tick loop
  useEffect(() => {
    if (simulationStatus !== 'running') return;

    const intervalMs = Math.max(250, 1000 / playbackSpeed);
    const interval = setInterval(() => {
      tick();
    }, intervalMs);

    return () => clearInterval(interval);
  }, [simulationStatus, playbackSpeed, tick]);

  return (
    <>
      {/* Global Framer-style Spotlight Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigateTab={(tab) => setCurrentTab(tab)}
      />

      {currentTab === 'landing' ? (
        <LandingPage
          onEnterApp={() => setCurrentTab('digital_twin')}
          onSelectScenarioTab={() => setCurrentTab('scenarios')}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        />
      ) : (
        <div className="flex flex-col h-[100dvh] w-full min-h-0 bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden">
          {/* Top Application Bar */}
          <TopBar
            onToggleSidebar={() => setMobileMenuOpen(!mobileMenuOpen)}
            onOpenSettings={() => setCurrentTab('settings')}
            onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          />

          {/* Main Workspace Body */}
          <div className="flex flex-1 min-h-0 overflow-hidden relative">
            {/* Navigation Sidebar */}
            <Sidebar
              currentTab={currentTab}
              onSelectTab={setCurrentTab}
              isCollapsed={isSidebarCollapsed}
              onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              mobileOpen={mobileMenuOpen}
              onCloseMobile={() => setMobileMenuOpen(false)}
            />

            {/* Dynamic Viewport / Workspace View */}
            <main className="flex-1 h-full min-h-0 overflow-hidden relative">
              {currentTab === 'digital_twin' && <DigitalTwinView />}
              {currentTab === 'scenarios' && (
                <ScenarioLabView onNavigateToTwin={() => setCurrentTab('digital_twin')} />
              )}
              {currentTab === 'ai_operations' && (
                <AIOperationsView onNavigateToTwin={() => setCurrentTab('digital_twin')} />
              )}
              {currentTab === 'analytics' && <AnalyticsView />}
              {currentTab === 'reports' && <ReportsView />}
              {currentTab === 'settings' && <SettingsView />}
            </main>
          </div>
        </div>
      )}
    </>
  );
};
