import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  ArrowRight, 
  Layers, 
  Radio, 
  Sliders, 
  BrainCircuit, 
  ShieldCheck, 
  Waves, 
  Flame, 
  SunMedium, 
  Zap, 
  CheckCircle2, 
  Navigation, 
  FileText, 
  Sun, 
  Moon, 
  Sparkles, 
  Play, 
  Search, 
  Leaf, 
  Droplets, 
  Car, 
  Shield, 
  ChevronDown,
  Globe,
  Compass,
  Menu,
  X,
  Send,
  Cpu,
  CornerDownLeft,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { useSimulationStore } from '../../store/simulationStore';
import { SCENARIO_TEMPLATES } from '../scenarios/ScenarioLabView';
import { ScenarioType } from '../../types/simulation';
import { HeroScene } from './HeroScene';
import { PointerResponsiveBackground } from './PointerResponsiveBackground';

interface LandingPageProps {
  onEnterApp: () => void;
  onSelectScenarioTab: () => void;
  onOpenCommandPalette?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onEnterApp, 
  onSelectScenarioTab,
  onOpenCommandPalette 
}) => {
  const theme = useSettingsStore(state => state.theme);
  const toggleTheme = useSettingsStore(state => state.toggleTheme);
  const startScenario = useSimulationStore(state => state.startScenario);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Framer-style AI Prompt Bar State
  const [promptText, setPromptText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Bento Interactive Card 1: Layer Matrix State
  const [bentoLayers, setBentoLayers] = useState({
    architecture: true,
    sensorGrid: true,
    roadNetwork: true,
    hazardHeatmap: false
  });

  // Bento Interactive Card 3: Dynamic Physics Slider State
  const [bentoRiskSlider, setBentoRiskSlider] = useState(65);

  // Bento Interactive Card 4: Navigation Route State
  const [bentoRouteDest, setBentoRouteDest] = useState<'aqua' | 'exchange' | 'datacenter'>('aqua');

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentProgress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard Escape listener to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLaunchScenario = (scenarioId: ScenarioType) => {
    const template = SCENARIO_TEMPLATES.find(s => s.id === scenarioId);
    if (template) {
      startScenario({
        id: template.id,
        title: template.title,
        tagline: template.tagline,
        description: template.description,
        iconName: template.id,
        targetDistrict: template.defaultDistrict,
        intensity: template.defaultIntensity,
        durationSeconds: template.durationSeconds
      });
      onEnterApp();
    }
  };

  // Framer-style AI Prompt Execution
  const handleExecutePrompt = (textToRun?: string) => {
    const query = (textToRun || promptText).toLowerCase();
    setIsGenerating(true);

    let chosenScenario: ScenarioType = 'flood';
    if (query.includes('fire') || query.includes('chemical') || query.includes('smoke')) {
      chosenScenario = 'fire';
    } else if (query.includes('heat') || query.includes('temp') || query.includes('dome')) {
      chosenScenario = 'heatwave';
    } else if (query.includes('power') || query.includes('blackout') || query.includes('grid')) {
      chosenScenario = 'power_outage';
    }

    setTimeout(() => {
      setIsGenerating(false);
      handleLaunchScenario(chosenScenario);
    }, 450);
  };

  const isDark = theme === 'dark';

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] relative selection:bg-cyan-400 selection:text-black overflow-x-hidden w-full max-w-full font-sans">
      {/* Top Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 h-[2.5px] bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 z-[60] transition-all duration-75"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      {/* =========================================================================
          HERO BANNER & CINEMATIC DIGITAL TWIN OVERLAY
         ========================================================================= */}
      <div className="relative min-h-[100svh] flex flex-col justify-between overflow-hidden">
        {/* Background Live 3D Scene + Pointer Responsive Parallax */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <PointerResponsiveBackground />
          <HeroScene />
          {/* Framer-grade multi-layer vignettes */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#050811]/90 via-[#050811]/60 to-[#050811]/20 lg:to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-transparent to-[#050811]/75 z-10 pointer-events-none" />
        </div>

        {/* -----------------------------------------------------------------------
            FRAMER-STYLE MULTI-AGENT LIVE CURSORS (HERO AMBIENCE)
           ----------------------------------------------------------------------- */}
        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden hidden md:block">
          {/* Agent Alpha (Hydrology) Cursor */}
          <div className="absolute top-[28%] left-[58%] flex items-center gap-2 animate-bounce duration-1000">
            <svg className="w-4 h-4 text-cyan-400 -rotate-45 drop-shadow-[0_0_8px_#00f0ff]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 3l7 18 3-7 7-3L3 3z" />
            </svg>
            <span className="px-2.5 py-1 rounded-full bg-cyan-950/90 border border-cyan-400/80 text-[10px] font-mono font-bold text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.4)] backdrop-blur-md">
              ✦ Agent Alpha (Hydrology 3D)
            </span>
          </div>

          {/* Agent Beta (Thermal Plume) Cursor */}
          <div className="absolute top-[52%] right-[18%] flex items-center gap-2 animate-pulse">
            <svg className="w-4 h-4 text-purple-400 -rotate-45 drop-shadow-[0_0_8px_#a855f7]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 3l7 18 3-7 7-3L3 3z" />
            </svg>
            <span className="px-2.5 py-1 rounded-full bg-purple-950/90 border border-purple-400/80 text-[10px] font-mono font-bold text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.4)] backdrop-blur-md">
              ✦ Agent Beta (Thermal Plume)
            </span>
          </div>
        </div>

        {/* -----------------------------------------------------------------------
            1. TOP NAVBAR (FRAMER GLASSMORPHIC HEADER)
           ----------------------------------------------------------------------- */}
        <header className="relative z-30 h-16 sm:h-20 px-4 sm:px-8 lg:px-12 flex items-center justify-between border-b border-white/10 backdrop-blur-xl bg-black/30">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-2.5 sm:gap-3 cursor-pointer" onClick={() => scrollToSection('hero')}>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-cyan-400 via-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 shrink-0">
              <span className="text-black font-black text-base sm:text-lg tracking-tighter">∧</span>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-black tracking-widest text-white leading-none">
                AETHER
              </div>
              <div className="text-[8px] sm:text-[9px] font-mono tracking-[0.2em] sm:tracking-[0.28em] text-cyan-300 font-bold uppercase mt-0.5">
                PLAN • PREDICT • PROTECT
              </div>
            </div>
          </div>

          {/* Center Navigation Links (Framer Hover Pill Effect) */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-300 bg-white/[0.04] p-1.5 rounded-full border border-white/10 backdrop-blur-md">
            {[
              { label: 'Home', action: () => scrollToSection('hero') },
              { label: 'Capabilities', action: () => scrollToSection('capabilities') },
              { label: 'Living Bento', action: () => scrollToSection('bento') },
              { label: 'Digital Twin', action: onEnterApp },
              { label: 'Scenarios', action: onSelectScenarioTab },
              { label: 'Impact', action: () => scrollToSection('impact') }
            ].map((link, idx) => (
              <button
                key={idx}
                onClick={link.action}
                className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition cursor-pointer text-xs font-semibold"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Action Controls: Spotlight Search (⌘K), Theme Switch, Enter Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Framer-style Spotlight Search Trigger (⌘K) */}
            <button
              onClick={onOpenCommandPalette}
              title="Search everything (Ctrl+K)"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-slate-300 hover:text-white text-xs font-mono transition touch-min cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden md:inline-flex px-1.5 py-0.5 rounded text-[9px] bg-black/40 border border-white/20 text-slate-400">
                ⌘K
              </kbd>
            </button>

            {/* Accessible Premium Theme Switcher Segmented Pill */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle visual theme"
              className="relative h-8 w-[68px] rounded-full bg-slate-900/90 hover:bg-slate-900 border border-white/20 p-1 flex items-center transition-colors shadow-inner cursor-pointer touch-min group focus:outline-none focus:ring-2 focus:ring-cyan-400/50 shrink-0"
            >
              {/* Sliding Active Pill Background */}
              <span
                aria-hidden="true"
                className={`absolute top-1 bottom-1 left-1 w-[28px] rounded-full transition-transform duration-300 ease-out shadow-md pointer-events-none ${
                  isDark
                    ? 'translate-x-[32px] bg-gradient-to-r from-sky-400 to-indigo-500 shadow-cyan-400/30'
                    : 'translate-x-0 bg-gradient-to-r from-amber-400 to-yellow-400 shadow-amber-400/40'
                }`}
              />

              {/* Sun Slot (Light Mode) */}
              <span
                className={`relative z-10 w-[28px] h-6 flex items-center justify-center transition-colors duration-200 ${
                  !isDark ? 'text-slate-950 font-black' : 'text-slate-400 group-hover:text-amber-300'
                }`}
              >
                <Sun className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-45" />
              </span>

              {/* Moon Slot (Dark Mode) */}
              <span
                className={`relative z-10 w-[28px] h-6 flex items-center justify-center ml-auto transition-colors duration-200 ${
                  isDark ? 'text-slate-950 font-black' : 'text-slate-400 group-hover:text-cyan-300'
                }`}
              >
                <Moon className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-rotate-12" />
              </span>
            </button>

            {/* Desktop 'Enter AETHER' Button */}
            <button
              onClick={onEnterApp}
              className="hidden sm:inline-flex items-center gap-2 py-2 px-5 sm:px-6 rounded-full bg-gradient-to-r from-sky-400 to-indigo-600 hover:from-sky-300 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:scale-[1.02] cursor-pointer"
            >
              <span>Enter AETHER</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Hamburger Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/10 hover:bg-white/15 text-white transition touch-min flex items-center justify-center border border-white/15"
              aria-label="Toggle navigation drawer"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* -----------------------------------------------------------------------
            MOBILE NAVIGATION DRAWER OVERLAY
           ----------------------------------------------------------------------- */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex flex-col">
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fadeIn" 
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-full max-w-sm bg-[#090f1d] border-b border-cyan-500/30 shadow-2xl p-6 flex flex-col gap-4 animate-slideDown max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center font-black text-black text-sm">
                    ∧
                  </div>
                  <span className="font-extrabold text-white text-base tracking-wider">AETHER MENU</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-slate-400 hover:text-white bg-white/10 touch-min"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col gap-1.5">
                {[
                  { label: 'Overview & Home', action: () => scrollToSection('hero') },
                  { label: 'Capabilities & Core Tech', action: () => scrollToSection('capabilities') },
                  { label: 'Living Bento Engine', action: () => scrollToSection('bento') },
                  { label: '3D Digital Twin Command', action: onEnterApp },
                  { label: 'Emergency Scenarios', action: onSelectScenarioTab },
                  { label: 'Spotlight Search (⌘K)', action: () => { setMobileMenuOpen(false); onOpenCommandPalette?.(); } }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={item.action}
                    className="w-full py-3 px-4 rounded-xl text-left font-semibold text-sm text-slate-200 hover:text-white hover:bg-white/10 transition flex items-center justify-between touch-min"
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="w-4 h-4 text-cyan-400" />
                  </button>
                ))}
              </nav>

              {/* Mobile Drawer Theme Switch */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 mt-1">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                  {isDark ? <Moon className="w-3.5 h-3.5 text-cyan-400" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
                  <span>Theme: {isDark ? 'Dark Mode' : 'Light Mode'}</span>
                </span>
                <button
                  onClick={toggleTheme}
                  aria-label="Toggle visual theme in mobile menu"
                  className="relative h-8 w-[68px] rounded-full bg-slate-900 border border-white/20 p-1 flex items-center transition-colors cursor-pointer shrink-0"
                >
                  <span
                    aria-hidden="true"
                    className={`absolute top-1 bottom-1 left-1 w-[28px] rounded-full transition-transform duration-300 ease-out shadow-md pointer-events-none ${
                      isDark
                        ? 'translate-x-[32px] bg-gradient-to-r from-sky-400 to-indigo-500 shadow-cyan-400/30'
                        : 'translate-x-0 bg-gradient-to-r from-amber-400 to-yellow-400 shadow-amber-400/40'
                    }`}
                  />
                  <span className={`relative z-10 w-[28px] h-6 flex items-center justify-center ${!isDark ? 'text-slate-950 font-black' : 'text-slate-400'}`}>
                    <Sun className="w-3.5 h-3.5" />
                  </span>
                  <span className={`relative z-10 w-[28px] h-6 flex items-center justify-center ml-auto ${isDark ? 'text-slate-950 font-black' : 'text-slate-400'}`}>
                    <Moon className="w-3.5 h-3.5" />
                  </span>
                </button>
              </div>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onEnterApp();
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-600 text-black font-extrabold text-xs uppercase tracking-wider text-center shadow-lg shadow-cyan-400/30 touch-min mt-2"
              >
                Enter the Living World
              </button>
            </div>
          </div>
        )}

        {/* -----------------------------------------------------------------------
            2. HERO MAIN CONTENT WITH FRAMER AI COMMAND BAR
           ----------------------------------------------------------------------- */}
        <section id="hero" className="relative z-20 px-4 sm:px-8 lg:px-12 py-8 sm:py-12 lg:py-16 flex-1 flex items-center">
          <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-400/40 text-[10px] sm:text-[11px] font-mono tracking-widest text-cyan-300 font-bold uppercase backdrop-blur-md shadow-[0_0_20px_rgba(0,240,255,0.2)]">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>AUTONOMOUS SMART CITY SIMULATION</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-[clamp(2.1rem,7vw,4.5rem)] font-black tracking-tight leading-[1.06] text-white">
                A LIVING WORLD. <br className="hidden sm:inline" />
                A <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-300 to-purple-400 drop-shadow-[0_0_35px_rgba(56,189,248,0.5)]">SAFER FUTURE.</span>
              </h1>

              {/* Subheading */}
              <p className="text-sm sm:text-base lg:text-lg text-slate-300 font-normal leading-relaxed max-w-xl">
                See the world differently. Explore a living digital twin of urban infrastructure, simulate environmental emergencies in real time, and examine transparent AI response strategies.
              </p>

              {/* =========================================================================
                  FRAMER-STYLE GENERATIVE SIMULATION PROMPT BAR
                 ========================================================================= */}
              <div className="w-full max-w-xl p-2 rounded-2xl bg-slate-900/90 border border-cyan-400/50 shadow-[0_0_35px_rgba(0,240,255,0.25)] backdrop-blur-xl space-y-2">
                <div className="flex items-center gap-2 px-2">
                  <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 animate-pulse" />
                  <input
                    type="text"
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleExecutePrompt();
                    }}
                    placeholder="Simulate: e.g. Coastal storm surge breaching waterfront..."
                    className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none font-medium"
                  />
                  <button
                    onClick={() => handleExecutePrompt()}
                    disabled={isGenerating}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 text-black font-extrabold text-xs uppercase tracking-wider hover:opacity-90 transition shadow-md shadow-cyan-400/30 cursor-pointer shrink-0"
                  >
                    <span>{isGenerating ? 'Simulating...' : 'Simulate'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Prompt Suggestions */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-white/10 text-[10px] font-mono text-slate-300 custom-scrollbar">
                  <span className="text-slate-500 uppercase tracking-wider text-[9px] pl-1 shrink-0">Try:</span>
                  {[
                    { label: '🌊 Flood Waterfront', text: 'Simulate storm surge flood on waterfront' },
                    { label: '🔥 Chemical Plant Fire', text: 'Simulate industrial chemical fire hazard' },
                    { label: '⚡ Central Grid Blackout', text: 'Simulate high-voltage grid failure cascade' },
                    { label: '☀️ 43°C Heatwave', text: 'Simulate urban heat dome cooling stress' },
                  ].map((sug, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setPromptText(sug.text);
                        handleExecutePrompt(sug.text);
                      }}
                      className="px-2 py-0.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 hover:border-cyan-400/40 text-slate-300 hover:text-white transition whitespace-nowrap cursor-pointer"
                    >
                      {sug.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                <button
                  onClick={onEnterApp}
                  className="px-6 py-3.5 sm:py-4 rounded-xl sm:rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-600 text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider hover:opacity-95 transition-all shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] flex items-center justify-center gap-2 touch-min"
                >
                  <span>Enter the Living World</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => scrollToSection('bento')}
                  className="px-6 py-3.5 sm:py-4 rounded-xl sm:rounded-full bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all border border-white/20 backdrop-blur-md flex items-center justify-center gap-2 touch-min cursor-pointer"
                >
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>Explore Capabilities</span>
                </button>
              </div>
            </div>

            {/* Right Column: Floating Telemetry HUD Badges */}
            <div className="lg:col-span-5 relative mt-4 lg:mt-0">
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:block lg:h-[420px]">
                {/* 1. Air Quality Badge */}
                <div className="lg:absolute lg:top-4 lg:left-6 p-3 rounded-xl bg-slate-900/85 border border-cyan-500/40 backdrop-blur-md shadow-xl flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                    <Leaf className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-mono">Air Quality</div>
                    <div className="text-xs font-bold text-white flex items-center gap-1">
                      <span>Good (AQI 38)</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    </div>
                  </div>
                </div>

                {/* 2. Flood Risk Badge */}
                <div className="lg:absolute lg:top-20 lg:right-4 p-3 rounded-xl bg-slate-900/85 border border-cyan-500/40 backdrop-blur-md shadow-xl flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-mono">Flood Risk</div>
                    <div className="text-xs font-bold text-white flex items-center gap-1">
                      <span>Low (0.0m Surge)</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    </div>
                  </div>
                </div>

                {/* 3. Energy Usage Badge */}
                <div className="lg:absolute lg:bottom-24 lg:left-2 p-3 rounded-xl bg-slate-900/85 border border-cyan-500/40 backdrop-blur-md shadow-xl flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-mono">Energy Usage</div>
                    <div className="text-xs font-bold text-white flex items-center gap-1">
                      <span>Balanced (68%)</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    </div>
                  </div>
                </div>

                {/* 4. Traffic Flow Badge */}
                <div className="lg:absolute lg:bottom-8 lg:right-6 p-3 rounded-xl bg-slate-900/85 border border-cyan-500/40 backdrop-blur-md shadow-xl flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
                    <Car className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-mono">Traffic Flow</div>
                    <div className="text-xs font-bold text-white flex items-center gap-1">
                      <span>Smooth (94%)</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* -----------------------------------------------------------------------
            3. BOTTOM BAR (TRUSTED LOGOS, SCROLL INDICATOR & REAL-TIME PREVIEW CARD)
           ----------------------------------------------------------------------- */}
        <div className="relative z-20 px-4 sm:px-8 lg:px-12 py-6 border-t border-white/10 bg-[#050811]/90 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-mono text-slate-400">
            <span className="tracking-wider uppercase text-[10px] text-slate-500">TRUSTED BY VISIONARY CITIES</span>
            <div className="flex items-center gap-4 text-slate-300 font-bold">
              <span>METROPOLIS</span>
              <span>•</span>
              <span>NEO-TOKYO</span>
              <span>•</span>
              <span>SINGAPORE</span>
            </div>
          </div>

          <div className="hidden lg:flex flex-col items-center gap-1 text-[10px] font-mono tracking-widest text-slate-400">
            <div className="w-5 h-8 rounded-full border-2 border-slate-500 flex items-start justify-center p-1">
              <div className="w-1 h-2 rounded-full bg-cyan-400 animate-bounce" />
            </div>
            <span>SCROLL TO EXPLORE</span>
          </div>

          <div
            onClick={onEnterApp}
            className="w-full sm:w-auto p-3 rounded-xl bg-slate-900/80 border border-cyan-500/30 hover:border-cyan-400 transition cursor-pointer flex items-center justify-between sm:justify-start gap-3 backdrop-blur-md group"
          >
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 group-hover:scale-105 transition">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-white group-hover:text-cyan-400 transition">
                Explore a Real-Time Digital Twin
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                24 Buildings • 16 Sensors • Live Mesh
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition ml-2" />
          </div>
        </div>
      </div>

      {/* =========================================================================
          FRAMER-STYLE SIGNATURE BENTO GRID ("THE LIVING SYSTEM ENGINE")
         ========================================================================= */}
      <section id="bento" className="py-20 sm:py-28 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--accent-cyan)] font-bold uppercase mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>THE LIVING PLATFORM ENGINE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[var(--text-primary)] tracking-tight">
            Designed for Real Time. <br className="hidden sm:inline" />
            Built for Extreme Shocks.
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] mt-3 leading-relaxed">
            Every subsystem reacts instantly to simulated hazards. Explore the four core interactive engines below.
          </p>
        </div>

        {/* 4-Tile Interactive Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* ---------------- BENTO CARD 1: 3D SPATIAL TWIN (2/3 width) ---------------- */}
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-cyan-400/50 transition-all duration-300 shadow-xl flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-3">
                <span className="font-bold tracking-widest uppercase">01 // SPATIAL TWIN MATRIX</span>
                <span className="px-2 py-0.5 rounded bg-cyan-400/10 border border-cyan-400/30 text-[10px]">
                  60 FPS WEBGL
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-2">
                Sub-Second 3D Multi-Layer Simulation
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-xl leading-relaxed">
                Procedurally textured curtain-wall skyscrapers, real-time asphalt road networks, and synchronized telemetry feeds rendered without cloud latency.
              </p>
            </div>

            {/* Interactive Layer Matrix Widget Inside Bento */}
            <div className="mt-6 p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-mono text-[var(--text-secondary)] uppercase">Interactive Layer Toggles:</span>
                <span className="text-[10px] font-mono text-cyan-400">Click to preview active matrix</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { key: 'architecture', label: 'Architecture', color: '#00f0ff' },
                  { key: 'sensorGrid', label: 'Sensor Grid', color: '#10b981' },
                  { key: 'roadNetwork', label: 'Road Graph', color: '#f59e0b' },
                  { key: 'hazardHeatmap', label: 'Hazard Heatmap', color: '#ff647c' }
                ].map(layer => {
                  const active = (bentoLayers as any)[layer.key];
                  return (
                    <button
                      key={layer.key}
                      onClick={() => setBentoLayers(prev => ({ ...prev, [layer.key]: !active }))}
                      className={`p-2.5 rounded-xl border text-xs font-mono flex items-center justify-between transition-all cursor-pointer ${
                        active
                          ? 'bg-cyan-500/15 border-cyan-400 text-white font-bold shadow-sm'
                          : 'bg-[var(--bg-surface)] border-transparent text-[var(--text-secondary)] hover:text-white'
                      }`}
                    >
                      <span>{layer.label}</span>
                      <span className={`w-2 h-2 rounded-full ${active ? 'bg-cyan-400' : 'bg-slate-600'}`} />
                    </button>
                  );
                })}
              </div>

              {/* Live Preview Simulation Strip */}
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-slate-300">Synchronized Spatial Mesh: 24 Towers Online</span>
                </div>
                <button
                  onClick={onEnterApp}
                  className="text-cyan-400 hover:underline flex items-center gap-1 font-bold"
                >
                  <span>Launch Viewport</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* ---------------- BENTO CARD 2: MULTI-AGENT TERMINAL (1/3 width) ---------------- */}
          <div className="lg:col-span-4 p-6 sm:p-8 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-purple-400/50 transition-all duration-300 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-purple-400 mb-3">
                <span className="font-bold tracking-widest uppercase">02 // MULTI-AGENT CORE</span>
                <span className="px-2 py-0.5 rounded bg-purple-400/10 border border-purple-400/30 text-[10px]">
                  4 AGENTS
                </span>
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                Explainable AI Co-Pilots
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Four deterministic autonomous agents audit telemetry and formulate rationale trees with zero black-box obscurity.
              </p>
            </div>

            {/* Live Streaming Reasoning Terminal */}
            <div className="mt-6 p-3.5 rounded-2xl bg-black/60 border border-purple-500/30 font-mono text-[11px] space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-white/10 text-slate-400 text-[10px]">
                <span>AGENT REASONING STREAM</span>
                <span className="text-purple-400 animate-pulse">● LIVE</span>
              </div>
              <div className="space-y-1 text-slate-300">
                <p className="text-cyan-400">&gt; Node [sns-w-01] surge check: 2.4m</p>
                <p className="text-purple-300">&gt; RULE_THRESH_01: Inundation active</p>
                <p className="text-amber-400">&gt; Rerouting: Segments s-w-01 closed</p>
                <p className="text-emerald-400">&gt; Detour formulated: Bifrost Bridge OK</p>
              </div>
            </div>
          </div>

          {/* ---------------- BENTO CARD 3: DYNAMIC CASCADE SLIDER (1/3 width) ---------------- */}
          <div className="lg:col-span-4 p-6 sm:p-8 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-amber-400/50 transition-all duration-300 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-amber-400 mb-3">
                <span className="font-bold tracking-widest uppercase">03 // DYNAMIC CASCADE</span>
                <span className="px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/30 text-[10px]">
                  PHYSICS
                </span>
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                Disaster Propagation
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Calibrate shock severity and watch simulated electrical overloads, flood lines, and thermal stress ripple through the city.
              </p>
            </div>

            {/* Interactive Live Slider Mini Widget */}
            <div className="mt-6 p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-3">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-[var(--text-secondary)]">Simulated Intensity:</span>
                <span className="text-amber-400 font-bold">{bentoRiskSlider}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={bentoRiskSlider}
                onChange={(e) => setBentoRiskSlider(parseInt(e.target.value))}
                className="w-full accent-amber-400 bg-[var(--bg-surface)] h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-slate-400">Threat Level:</span>
                <span className={`px-2 py-0.5 rounded font-bold uppercase ${
                  bentoRiskSlider > 80 ? 'bg-red-500/20 text-red-400' :
                  bentoRiskSlider > 50 ? 'bg-amber-500/20 text-amber-400' :
                  'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {bentoRiskSlider > 80 ? 'Catastrophic' : bentoRiskSlider > 50 ? 'Severe Alert' : 'Moderate'}
                </span>
              </div>
            </div>
          </div>

          {/* ---------------- BENTO CARD 4: PREDICTIVE ROUTING (2/3 width) ---------------- */}
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-emerald-400/50 transition-all duration-300 shadow-xl flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-emerald-400 mb-3">
                <span className="font-bold tracking-widest uppercase">04 // AUTONOMOUS DISPATCH</span>
                <span className="px-2 py-0.5 rounded bg-emerald-400/10 border border-emerald-400/30 text-[10px]">
                  DIJKSTRA GRAPH
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-2">
                Real-Time Predictive Navigation Engine
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-xl leading-relaxed">
                Calculates fastest emergency transit routes around flooded roads, thermal plumes, and power outages with automated corridor clearance.
              </p>
            </div>

            {/* Interactive Route Selector Widget */}
            <div className="mt-6 p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[var(--text-secondary)]">Emergency Route Origin: Horizon Hospital Depot</span>
                <span className="text-emerald-400 font-bold">Fastest Detour Found</span>
              </div>

              {/* Destination Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { key: 'aqua', label: 'Aqua Port Authority', dist: '1,280m', time: '3.8 min' },
                  { key: 'exchange', label: 'Aegis Central Exchange', dist: '890m', time: '2.4 min' },
                  { key: 'datacenter', label: 'Quantum Datacenter', dist: '1,640m', time: '4.6 min' }
                ].map(dest => (
                  <button
                    key={dest.key}
                    onClick={() => setBentoRouteDest(dest.key as any)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition cursor-pointer ${
                      bentoRouteDest === dest.key
                        ? 'bg-emerald-500/20 border-emerald-400 text-white font-bold'
                        : 'bg-[var(--bg-surface)] border-transparent text-[var(--text-secondary)] hover:text-white'
                    }`}
                  >
                    <span>{dest.label} ({dest.time})</span>
                  </button>
                ))}
              </div>

              {/* Route Summary */}
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-slate-300">Hazard Avoidance: 2 Flooded Arteries Bypassed</span>
                </div>
                <button
                  onClick={onEnterApp}
                  className="text-emerald-400 hover:underline flex items-center gap-1 font-bold"
                >
                  <span>Simulate in 3D</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          KEY METRICS STRIP (HONEST SIMULATED PLATFORM TELEMETRY)
         ========================================================================= */}
      <section className="py-12 px-4 sm:px-8 lg:px-12 bg-[var(--bg-secondary)] border-y border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-400 font-mono">
              24
            </div>
            <div className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium mt-1 uppercase tracking-wider">
              Connected Municipal Assets
            </div>
            <div className="text-[10px] font-mono text-[var(--accent-cyan)] mt-0.5">
              Across 4 Major Districts
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400 font-mono">
              16
            </div>
            <div className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium mt-1 uppercase tracking-wider">
              Real-Time Telemetry Nodes
            </div>
            <div className="text-[10px] font-mono text-[var(--accent-violet)] mt-0.5">
              Hydrology, Thermal, AQI & Grid
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-mono">
              100%
            </div>
            <div className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium mt-1 uppercase tracking-wider">
              Deterministic Simulation Engine
            </div>
            <div className="text-[10px] font-mono text-[var(--status-success)] mt-0.5">
              Zero Hallucinations // Local Math
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SCENARIO LAUNCHER PREVIEWS
         ========================================================================= */}
      <section id="impact" className="py-16 sm:py-24 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--accent-cyan)] font-bold uppercase mb-2">
              <Sliders className="w-3.5 h-3.5" />
              <span>LIVE DRILLS</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
              Instant Simulation Scenarios
            </h2>
          </div>
          <button
            onClick={onSelectScenarioTab}
            className="inline-flex items-center gap-2 text-xs font-bold text-[var(--accent-cyan)] hover:underline uppercase tracking-wider cursor-pointer"
          >
            <span>Open Scenario Lab</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SCENARIO_TEMPLATES.map(s => {
            const Icon = s.icon;
            return (
              <div
                key={s.id}
                onClick={() => handleLaunchScenario(s.id)}
                className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[var(--accent-cyan)] transition-all cursor-pointer flex flex-col justify-between group shadow-sm hover:shadow-lg"
              >
                <div>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 border"
                    style={{
                      backgroundColor: `${s.accentColor}15`,
                      color: s.accentColor,
                      borderColor: `${s.accentColor}30`
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[var(--text-primary)] mb-1 group-hover:text-[var(--accent-cyan)] transition">
                    {s.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-3">
                    {s.tagline}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-semibold text-[var(--accent-cyan)]">
                  <span>Launch Drill</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          FOOTER (RESPONSIVE FOR ALL SCREEN SIZES)
         ========================================================================= */}
      <footer id="about" className="border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)] py-12 px-4 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center font-black text-black text-sm">
              ∧
            </div>
            <div className="text-left">
              <span className="font-extrabold text-sm text-[var(--text-primary)] tracking-wider">AETHER</span>
              <p className="text-[11px] text-[var(--text-secondary)]">The Living World Digital Twin Platform</p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs text-[var(--text-secondary)]">
            <button onClick={() => scrollToSection('hero')} className="hover:text-[var(--text-primary)]">Home</button>
            <button onClick={() => scrollToSection('capabilities')} className="hover:text-[var(--text-primary)]">Capabilities</button>
            <button onClick={() => scrollToSection('bento')} className="hover:text-[var(--text-primary)]">Living Bento</button>
            <button onClick={onEnterApp} className="hover:text-[var(--text-primary)]">Digital Twin</button>
            <button onClick={onSelectScenarioTab} className="hover:text-[var(--text-primary)]">Scenarios</button>
          </div>

          <div className="text-xs text-[var(--text-muted)] font-mono">
            © 2026 AETHER PLATFORM. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </div>
  );
};
