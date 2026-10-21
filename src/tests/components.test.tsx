import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { LandingPage } from '../features/landing/LandingPage';
import { AgentCard } from '../features/ai-operations/AgentCard';
import { AgentReport } from '../types/ai';

// Mock Three.js Canvas for headless testing
vi.mock('../features/landing/HeroScene', () => ({
  HeroScene: () => <div data-testid="mock-hero-scene">3D Hero Scene</div>
}));

describe('Frontend Component Tests', () => {
  it('renders LandingPage with title, tagline, and interactive CTAs', () => {
    const handleEnter = vi.fn();
    const handleSelectScenario = vi.fn();

    render(
      <LandingPage
        onEnterApp={handleEnter}
        onSelectScenarioTab={handleSelectScenario}
      />
    );

    expect(screen.getByText(/See the world/i)).toBeDefined();
    expect(screen.getByText(/differently/i)).toBeDefined();
    expect(screen.getByText(/Explore a living digital twin/i)).toBeDefined();

    // Click primary CTA
    const enterButtons = screen.getAllByText(/Enter the Living World/i);
    expect(enterButtons.length).toBeGreaterThan(0);
    fireEvent.click(enterButtons[0]);
    expect(handleEnter).toHaveBeenCalled();
  });

  it('renders mobile navigation drawer and handles open/close interactions', () => {
    const handleEnter = vi.fn();
    const handleSelectScenario = vi.fn();

    render(
      <LandingPage
        onEnterApp={handleEnter}
        onSelectScenarioTab={handleSelectScenario}
      />
    );

    // Find and click mobile menu toggle button
    const menuButton = screen.getByLabelText(/Toggle navigation drawer/i);
    expect(menuButton).toBeDefined();

    fireEvent.click(menuButton);

    // Verify mobile drawer items are now visible
    expect(screen.getByText(/AETHER MENU/i)).toBeDefined();
    expect(screen.getByText(/Overview & Home/i)).toBeDefined();
    expect(screen.getByText(/3D Digital Twin Command/i)).toBeDefined();

    // Test pressing Escape key closes mobile drawer
    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
    expect(screen.queryByText(/AETHER MENU/i)).toBeNull();
  });

  it('renders AgentCard with explainable findings and rules', () => {
    const mockReport: AgentReport = {
      agentId: 'monitoring',
      agentName: 'Agent A — Telemetry & Sensor Vigilance',
      role: 'Real-time telemetry ingestion and outlier verification.',
      status: 'alert',
      lastAnalysisTimestamp: 10,
      summary: 'Active monitoring alert: 3 anomalies detected.',
      findings: [
        'Node [sns-w-01] breached safety threshold',
        'Water elevation rate of change exceeds 0.2m/min'
      ],
      metrics: {
        'Active Breaches': 3,
        'Sensor Health': '80%'
      },
      rulesEvaluated: [
        'RULE_THRESH_01: Sensor.value > MaxThreshold'
      ],
      recommendations: [
        {
          id: 'rec-1',
          title: 'Increase Telemetry Polling Rate',
          priority: 'critical',
          targetDistrict: 'waterfront',
          action: 'Switch node to high-frequency mode',
          rationale: 'Breached threshold',
          affectedAssetIds: ['bld-w-01'],
          estimatedImpact: 'Improves response time by 40%'
        }
      ],
      limitations: [
        'Simulated test limitation disclaimer'
      ]
    };

    render(<AgentCard report={mockReport} />);

    expect(screen.getByText(/Agent A — Telemetry & Sensor Vigilance/i)).toBeDefined();
    expect(screen.getByText(/Active monitoring alert: 3 anomalies detected/i)).toBeDefined();
    expect(screen.getByText(/Node \[sns-w-01\] breached safety threshold/i)).toBeDefined();
    expect(screen.getByText(/RULE_THRESH_01: Sensor.value > MaxThreshold/i)).toBeDefined();
    expect(screen.getByText(/Increase Telemetry Polling Rate/i)).toBeDefined();
  });
});
