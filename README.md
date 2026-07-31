# AINA - Anticipatory Intelligence Network for Action

**IGAD Hackathon 2026 Submission**

AINA is an AI-powered decision intelligence platform that transforms complex climate risk forecasts into actionable, localized, and trackable humanitarian workflows for frontline responders across East Africa.

## The Problem: The Early Warning to Early Action Gap
Across the IGAD region, scientific forecasting of climate hazards (droughts, floods) is highly accurate. However, these warnings typically arrive as dense, probabilistic reports. Disaster management committees are forced to manually translate this data into operational decisions under severe time constraints, causing fatal delays in emergency response.

## The Solution
AINA acts as a Decision Intelligence Operating System. It sits above the forecast data and before the action. Instead of merely displaying risk maps, AINA automatically ingests spatial risk signals and processes them through a Large Language Model (LLM) to generate ranked, explainable, and actor-specific Standard Operating Procedures (SOPs).

### Key Features
* **AI Decision Core:** Utilizes DeepSeek-V4 to instantly generate actor-specific recommendations, complete with confidence scores and estimated impacts of delay.
* **Multi-Role Contextualization:** Dynamically adjusts the intelligence output and UI depending on the user's operational role (e.g., National Director vs. Field Officer).
* **Last-Mile Localization:** Instant Swahili translation ensures actionable guidance reaches field teams without language barriers.
* **Simulation Mode:** A dedicated rehearsal environment utilizing local storage caching to allow disaster managers to stress-test their operational readiness against hypothetical hazard scenarios.
* **SMS Broadcast Simulator:** Automatically packages AI recommendations into API payloads for distribution to feature phones on the ground.

## Technology Stack
This repository contains the hackathon MVP, engineered as a serverless-edge frontend application for maximum resilience in low-bandwidth environments.

* **Frontend Framework:** React 18, TypeScript, Vite
* **Styling:** Tailwind CSS v4
* **Geospatial Rendering:** React-Leaflet, MapLibre
* **AI Integration:** Featherless AI API (DeepSeek-V4-Pro)
* **State Management:** Custom React Context API

## Local Setup & Installation

To run the AINA platform locally on your machine, follow these steps:

### 1. Clone the repository
```bash
git clone [https://github.com/YOUR_USERNAME/aina.git](https://github.com/Brikita/aina.git)
cd aina/frontend