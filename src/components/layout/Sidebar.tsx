import React, { useEffect } from 'react';
import { 
  Home, 
  Box, 
  Sliders, 
  BrainCircuit, 
  BarChart3, 
  FileText, 
  Settings,
  X,
  ChevronLeft,
  ChevronRight,
  Radio,
  AlertTriangle
} from 'lucide-react';
import { useSimulationStore } from '../../store/simulationStore';

export type NavigationTab = 
  | 'landing' 
  | 'digital_twin' 
  | 'scenarios' 
  | 'ai_operations' 
  | 'analytics' 
  | 'reports' 
  | 'settings';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile
}) => {
  const activeScenario = useSimulationStore(state => state.activeScenario);
  const metrics = useSimulationStore(state => state.metrics);

  // Close mobile drawer on Escape key
  useEffect(() => {
    if (!mobileOpen || !onCloseMobile) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseMobile();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen, onCloseMobile]);

  const navItems = [
    { id: 'digital_twin' as NavigationTab, label: 'Digital Twin', icon: Box, badge: activeScenario ? 'ACTIVE' : undefined },
    { id: 'scenarios' as NavigationTab, label: 'Scenario Lab', icon: Sliders, badge: '4 DRILLS' },
    { id: 'ai_operations' as NavigationTab, label: 'AI Operations', icon: BrainCircuit, badge: '4 AGENTS' },
    { id: 'analytics' as NavigationTab, label: 'Analytics', icon: BarChart3 },
    { id: 'reports' as NavigationTab, label: 'Incident Reports', icon: FileText },
    { id: 'landing' as NavigationTab, label: 'Landing Overview', icon: Home },
    { id: 'settings' as NavigationTab, label: 'Settings', icon: Settings }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden animate-fadeIn"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Element */}
      <aside
        role={mobileOpen ? 'dialog' : undefined}
        aria-modal={mobileOpen ? 'true' : undefined}
        aria-label="Application navigation"
        className={`fixed md:static inset-y-0 left-0 z-50 flex flex-col justify-between bg-[var(--bg-secondary)] border-r border-[var(--border-subtle)] transition-all duration-300 ${
          mobileOpen ? 'translate-x-0 w-72 pb-safe' : '-translate-x-full md:translate-x-0'
        } ${isCollapsed ? 'md:w-16' : 'md:w-60'}`}
      >
        <div>
          {/* Mobile Header with Title and Close Button */}
          <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)] md:hidden">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#54E7F2] to-[#9D8CFF] flex items-center justify-center font-black text-black text-sm">
                Æ
              </div>
              <span className="font-extrabold text-sm tracking-wider text-[var(--text-primary)]">
                NAVIGATION
              </span>
            </div>
            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] touch-min flex items-center justify-center"
                aria-label="Close navigation"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation Items */}
          <div className="p-3 space-y-1.5 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-semibold transition-all relative touch-min ${
                    isActive
                      ? 'bg-[var(--bg-elevated)] text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/40 shadow-sm'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[var(--accent-cyan)]' : 'text-[var(--text-secondary)]'}`} />

                  {(!isCollapsed || mobileOpen) && (
                    <div className="flex-1 flex items-center justify-between truncate text-left">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                          item.badge === 'ACTIVE'
                            ? 'bg-[#FF647C]/20 text-[#FF647C] animate-pulse'
                            : 'bg-[var(--bg-surface)] text-[var(--text-secondary)]'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer: Collapse Toggle (Desktop) */}
        <div className="hidden md:flex p-3 border-t border-[var(--border-subtle)] items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-secondary)] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-success)]" />
              <span>LIVE CORE</span>
            </div>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition ml-auto cursor-pointer"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </aside>
    </>
  );
};
