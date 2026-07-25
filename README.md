
# AINA — Anticipatory Intelligence Network for Action
> **IGAD Hackathon 2026 | ICPAC Regional Track**  
> *Transforming climate forecasts into accountable, explainable, and actor-specific action[cite: 1, 4].*

---

## Executive Summary
Across East Africa, credible drought and flood forecasts already exist from ICPAC, national meteorological services, and satellite monitoring[cite: 1]. **The bottleneck is not prediction—it is what happens after the forecast lands on someone’s desk[cite: 1].** 

Traditional dashboards show risk, but they do not decide anything[cite: 1, 3, 4]. This creates a **forecast-to-action gap**, resulting in delayed emergency response, higher humanitarian costs, livestock loss, and preventable displacement[cite: 1].

**AINA** is a decision intelligence platform[cite: 1, 4]. It sits on top of existing climate monitoring systems (like ICPAC Hazard Watch and Drought Watch)[cite: 4] to automatically classify risk, generate ranked recommendations, launch trackable decision workflows, and log outcomes into an institutional memory layer[cite: 1, 3].

---

##  Project Composition & System Architecture

AINA consists of three main operational layers:


```

┌────────────────────────────────────────────────────────────────────────┐
│                        1. GEOSPATIAL INTELLIGENCE                      │
│   (Static GeoJSON / HDX Data / ICPAC Basemaps / Vulnerability Layers)   │
└───────────────────────────────────┬────────────────────────────────────┘
│
▼
┌────────────────────────────────────────────────────────────────────────┐
│                          2. AI REASONING ENGINE                        │
│      (FastAPI + Context Ingestion + GPT-4o Decision Reasoning)         │
└───────────────────────────────────┬────────────────────────────────────┘
│
▼
┌────────────────────────────────────────────────────────────────────────┐
│                        3. ACTION ORCHESTRATION UI                      │
│   (React / Leaflet Interactive Map + Workflow Tracker + Observatory)   │
└────────────────────────────────────────────────────────────────────────┘

```

### Key Differentiators (What We Are Building)[cite: 1, 3]
1. **Explainable Recommendations:** Every suggestion carries explicit reasoning linking the forecast to local ground conditions[cite: 1, 3].
2. **Decision Context Engine:** Captures *WHY* a decision was made so agencies can audit choices[cite: 1, 3].
3. **Decision Observatory & Memory Loop:** Logs every warning, action, and outcome so the next forecast is answered with what actually worked before[cite: 1, 3].
4. **Simulation Mode:** Allows decision-makers to run "what-if" scenarios against historical and live context data before committing funds[cite: 1, 3].

---

##  Team Skill Division & Responsibilities

Our team leverages a high-synergy balance of **Geospatial Science (GIS)** and **Software & Artificial Intelligence Development**.

| Role | Skillset | Primary 6-Day Responsibilities |
| :--- | :--- | :--- |
| **GIS Specialist 1** | Spatial Analysis & Remote Sensing | Extract & clean shapefiles/GeoJSON for selected target region (NDVI, soil moisture, hazard boundaries). |
| **GIS Specialist 2** | Cartography & Data Curation | Gather HDX infrastructure data (roads, boreholes, livestock markets, population density) & design map layers. |
| **Dev / AI Specialist 1** | Backend Engineering & AI Systems | Build FastAPI backend, craft the Decision Engine System Prompt, and construct the "Fake RAG" pipeline. |
| **Dev / AI Specialist 2** | Frontend Architecture & UI/UX | Build React + Vite app, integrate Leaflet/Mapbox interactive map, and code the Decision Workflow UI. |

---

##  6-Day Sprint Workplan (Lean Prototype Strategy)

To ensure maximum visual polish, technical depth, and submission readiness within 6 days, we are executing a **Lean Architecture Strategy** (utilizing static pre-processed spatial data + API-driven LLM decision reasoning).


```

Day 1: Setup & Data Prep ──► Day 2: AI & API Integration ──► Day 3: Interactive UI Build
│
Day 6: Pitch & Submission ◄── Day 5: Polish & Architecture ◄── Day 4: Unique AINA Modules

```

### Detailed Breakdown

* **Day 1: Alignment, Environment & Spatial Curation**
  * Set up Git repository, React (Vite), and FastAPI project structures.
  * Define target region (e.g., Kajiado County / Garissa Corridor).
  * GIS team exports pre-processed GeoJSON layers into `frontend/public/data/`.

* **Day 2: AI Decision Core & API Integration**
  * Implement FastAPI endpoint `/api/generate-decision`.
  * Construct system prompts enforcing structured JSON output for actor-specific actions and reasoning[cite: 1, 3].
  * Test backend API using mock spatial context inputs.

* **Day 3: Frontend Integration & Interactive Mapping**
  * Integrate Leaflet/Mapbox inside React.
  * Connect GIS GeoJSON layers with interactive map toggles (Hazard zones, Infrastructure, Vulnerability).
  * Connect map clicks/region selection directly to the FastAPI Decision Engine.

* **Day 4: Unique "AINA" Features (The Winning Edge)**
  * Build the **Decision Context Engine Panel** (displays *WHY* an action was generated)[cite: 1, 3].
  * Build a **Simulation Mode Toggle** ("What if rainfall drops another 20%?")[cite: 1, 3].
  * Build the **Decision Observatory Log** (showing past institutional actions)[cite: 1, 3].

* **Day 5: Architecture Documentation & UI Polish**
  * Create a high-grade System Architecture Diagram for the pitch submission.
  * Polish UI styling, responsive design, and status indicators.
  * Dry-run the end-to-end prototype flow to verify zero crashes during demonstration.

* **Day 6: Pitch Video, Portfolio & Submission**
  * Write the 250-word Overview and 250-word Solution Details for Devpost.
  * Record and edit the 5-minute video walkthrough (GIS explaining spatial context, Devs explaining AI reasoning & workflow).
  * Final repository push and Devpost submission ahead of deadline.

---

##  Tech Stack Specification

* **Frontend:** React, TypeScript, Vite, Tailwind CSS, React-Leaflet / Mapbox GL, Lucide Icons
* **Backend:** Python 3.11+, FastAPI, Uvicorn, OpenAI SDK, Pydantic, Python-Dotenv
* **Data & GIS Tools:** QGIS, Google Earth Engine, OpenStreetMap, Humanitarian Data Exchange (HDX), ICPAC Open Data[cite: 1, 4]

---

##  Alignment with Hackathon Judging Criteria

1. **Technical Depth & Engineering (30%):** Robust React-FastAPI architecture, smooth API integration, structured data contracts, and clean spatial rendering.
2. **Innovation & AI Creativity (30%):** Moving beyond basic visualization to automated, explainable decision-reasoning pipelines using structured AI[cite: 1, 3, 4].
3. **Problem Value & Impact (25%):** Directly addresses the regional "forecast-to-action gap" for pastoralists, county officers, and humanitarian organizations[cite: 1, 4].
4. **Presentation & Documentation (15%):** Clean UI, clear architecture diagrams, comprehensive README, and a crisp 5-minute pitch video.

