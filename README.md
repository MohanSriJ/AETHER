# AETHER: The Living World (v3.0)
### Production-Quality Immersive 3D Digital Twin & AI Simulation Platform

> **“See the system. Simulate the future. Shape what happens next.”**

AETHER is a futuristic smart-city digital twin that presents a living, interactive, three-dimensional representation of an urban environment. Users can inspect buildings and infrastructure, observe synthetic sensor telemetry, introduce simulated emergency scenarios, observe cascading consequences, and explore explainable AI-assisted response strategies.

---

## 🏆 National Hackathon Finals — Presentation & Judge Walkthrough

### The 3-Minute Pitch Script

1. **The Problem:** Smart cities collect millions of data points, but emergency managers still rely on static, fragmented 2D dashboards. When a flood or blackout strikes, cascading infrastructure failures are nearly impossible to foresee in real time.
2. **Our Solution (AETHER):** A living, browser-native 3D digital twin powered by a **100% deterministic local physics engine** and **four explainable autonomous AI agents**. No external cloud API latency, zero AI hallucinations, 100% computational reproducibility.
3. **The Proof:** A live 60 FPS WebGL city with 24 municipal buildings, 16 real-time telemetry sensors, dynamic Dijkstra emergency rerouting, and instant incident audit exports.

### 5-Step Live Demonstration Flow for Judges

1. **Hero Experience:** Show the live WebGL rotating city with dynamic traffic particles and the Framer-style AI prompt bar (`Try: 🌊 Flood Waterfront`).
2. **Command Viewport:** Click **"Enter the Living World"**. Demonstrate full 3D Orbit controls, camera presets (Central, Waterfront, Industrial, Tech/Med), and the precision reticle cursor.
3. **Interactive Inspection:** Click on any building (e.g. *Central Spire* or *Horizon Hospital*) to open the live telemetry drawer showing temperature, AQI, structural integrity, and power.
4. **Trigger a Live Drill:** Open **Scenario Lab**, select *Urban Storm Surge & Coastal Flooding*, and hit **"Launch Emergency Scenario"**. Observe seawall breaches in 3D, sensor alarms, and autonomous traffic rerouting around inundated corridors.
5. **Explainable AI & Governance:** Navigate to **AI Operations** to review explainable rule evaluations from 4 specialized agents, and go to **Incident Reports** to export instant CSV, JSON, and print-ready audit reports.

---

## Key Features

1. **Cinematic 3D Digital Twin Viewport**
   - High-performance procedural Three.js scene utilizing `@react-three/fiber` and `@react-three/drei`.
   - 24 detailed municipal facilities across 4 distinct districts: Central Spire & Civic Core, Waterfront Basin, Industrial Manufacturing Sector, and Tech & Medical Quadrant.
   - Interactive raycasting: hover highlights, 3D tooltips, click-selection opening contextual metadata side panel (floors, population, structural stability, power status, live telemetry vs baseline).
   - Camera presets (Overview, Central, Waterfront, Industrial, Tech/Med) with smooth orbit controls and auto-rotation.
   - Dynamic layer toggles: Buildings, Telemetry Beacons, Hazards, Infrastructure Grid, and Emergency Dispatch Routes.
   - **2D Canvas Fallback Mode**: An interactive 2D isometric hardware-accelerated canvas renderer ensuring 100% usability and resilience on low-power or non-WebGL devices.

2. **Synthetic Telemetry Network**
   - 16 distributed sensor beacons measuring ambient temperatures, particulate air quality (AQI), coastal water surge levels, structural vibrations, and electrical substation voltages.
   - Deterministic telemetry progression: microclimate equilibrium drift in baseline mode; rapid threshold breaches during active incidents.

3. **Scenario Laboratory (Deterministic Physical Engine)**
   - **Urban Flooding**: Coastal storm surge breaches seawall; inundates low-lying waterfront roadways, activates pump station backup generators.
   - **Industrial Chemical Fire**: High-volatility ignition; severe thermal spikes (>80°C), hazardous particulate AQI (>400), structural integrity loss, 300m containment perimeter.
   - **Extreme Heatwave**: High-pressure metropolitan heat dome pushing air past 42°C; surges grid cooling load by 45%, activates transit cooling shelters.
   - **Power Disruption**: Substation breaker trip cascading through commercial and industrial feeders; triggers hospital and datacenter auxiliary emergency power.
   - Calibrate severity intensity (20% to 100%), target district, and duration (30s to 120s), with real-time Play / Pause / Resume / Baseline Reset controls.

4. **Explainable Multi-Agent AI Operations**
   - **Agent A (Telemetry Vigilance)**: Ingests sensor streams, identifies threshold breaches and rate-of-change spikes.
   - **Agent B (Spatial Risk Modeling)**: Computes transparent composite risk formulas (`0.40 * Exposure + 0.35 * Importance + 0.25 * Vulnerability`).
   - **Agent C (Response Planning & Dispatch)**: Prioritizes intervention facilities and guides resource dispatch.
   - **Agent D (Citizen Communications)**: Translates raw engineering telemetry into unambiguous, empathetic citizen guidance and broadcast alerts.
   - *100% explainable, local rule-based models without proprietary third-party cloud API dependencies.*

5. **Dijkstra Response Routing Engine**
   - Connected road graph of 22 intersections and 26 road segments.
   - True Dijkstra shortest-path pathfinding dynamically re-routing emergency dispatch around floodwaters, debris, and fire barriers.
   - Visualized directly in 3D viewport as illuminated dispatch vectors and waypoints.

6. **Analytics Workspace**
   - Interactive Recharts time-series: temperature progression over simulation time, water surge depth, asset impact by functional classification, sensor health status distribution.
   - Multi-point baseline history curves with real-time simulation step advance (`Step T+5s`).
   - Real-time district filtering and delta comparisons against baseline equilibrium.

7. **Incident Audit Reporting & Compliance**
   - Comprehensive post-incident assessment documents generated directly from verified simulation state.
   - Real, working export to **CSV Dataset**, **JSON Audit Package**, and **Print-Ready Styled HTML Document**.

8. **Settings & Governance**
   - Dual theme calibration: Cyberpunk Command Center (Dark) and Architectural CAD Instrument (Light).
   - 3D Graphics quality presets (High Fidelity, Balanced, Low Power, 2D Canvas Fallback).
   - Accessibility controls: Reduced Motion toggle, 3D Spatial Label visibility, Camera auto-orbit, and Precision Dual-Ring Cursor toggle.

---

## Technology Stack

- **Frontend**: React 19, TypeScript (strict mode), Vite 8, Tailwind CSS v4.
- **3D Graphics**: Three.js, React Three Fiber (R3F), React Three Drei.
- **State Management**: Zustand unified store coordinating city state, scenarios, AI reports, and camera presets.
- **Data Visualization**: Recharts, SVG, and HTML5 Canvas.
- **Icons**: Lucide React.
- **Testing**: Vitest, `@testing-library/react`, JSDOM (15/15 unit and integration tests passing).

---

## Local Installation & Verification Commands

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Vitest Test Suite
```bash
npm test
```
*Executes all 15 unit, simulation, routing, and component tests.*

### 3. Build Production Bundle
```bash
npm run build
```
*Compiles TypeScript and bundles production assets into `dist/`.*

### 4. Run Development Server
```bash
npm run dev
```
*Starts local Vite dev server at `http://localhost:5173/`.*

### 5. Run Preview Server
```bash
npm run preview
```
*Serves the optimized production build at `http://localhost:4173/`.*

---

## 🚀 One-Click Hosting & GitHub Deployment Guide

### Option 1: Deploy to Vercel (Recommended — 60 Seconds)
1. Push this repository to GitHub (see commands below).
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Select your GitHub repository.
4. Framework Preset: **Vite** (Build command: `npm run build`, Output directory: `dist`).
5. Click **Deploy**. Your live production URL will be ready immediately!

### Option 2: Deploy to Netlify
1. Go to [netlify.com](https://netlify.com) and click **"Add new site" > "Import an existing project"**.
2. Connect your GitHub repository.
3. Build command: `npm run build`, Publish directory: `dist`.
4. Click **Deploy Site**.

### Pushing to Your GitHub Repository
```bash
git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
git branch -M main
git push -u origin main
```
