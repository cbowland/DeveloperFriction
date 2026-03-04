# Architecture

## System Design

The application runs as a single container with both the frontend and backend bundled together.

```
┌──────────────────────────────────────┐
│          Single Container            │
│                                      │
│  React SPA ──► Node.js/Express API   │
│  (static)      (in-memory store)     │
│                                      │
│  Port 8080                           │
└──────────────────────────────────────┘
```

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18, Vite, TypeScript          |
| Charting  | Recharts                            |
| Backend   | Node.js, Express, TypeScript        |
| Storage   | In-memory array (no database)       |
| Container | Red Hat UBI 9 Node.js 20 (minimal)  |
| Platform  | OpenShift, Red Hat Developer Hub    |

## How It Works

1. The React SPA is built at container image build time using Vite and served as static files by the Express server.
2. The Express server exposes two API endpoints under `/api/responses`.
3. When a user submits a survey response, the frontend sends a `POST` to the API, which stores the response in an in-memory array.
4. The frontend then fetches aggregated results via `GET` and renders a grouped bar chart.
5. Since storage is in-memory, all data resets when the container restarts.

## Project Structure

```
├── frontend/                React SPA (Vite + TypeScript)
│   └── src/
│       ├── App.tsx          Main component with form/chart toggle
│       └── components/
│           ├── SurveyForm.tsx    Three questions with radio buttons
│           └── ResultsChart.tsx  Recharts grouped bar chart
├── backend/                 Node.js API (Express + TypeScript)
│   └── src/
│       ├── index.ts         Server entry point, static file serving
│       ├── store.ts         In-memory response storage
│       └── routes/
│           └── responses.ts POST and GET endpoints
├── k8s/                     OpenShift manifests
├── tekton/                  Tekton Pipeline for deployment
├── docs/                    Documentation (this directory)
├── Containerfile            Multi-stage container build (UBI 9)
├── catalog-info.yaml        RHDH component registration
└── template.yaml            RHDH Software Template
```
