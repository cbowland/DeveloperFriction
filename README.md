# Developer Friction Survey

A single-page application that collects developer experience feedback through a three-question survey and displays aggregated results as a grouped bar chart. Built with React and Node.js, containerized for OpenShift, and delivered via Red Hat Developer Hub.

## Questions

The survey measures friction across three dimensions:

1. **Development Environment Setup** -- How much friction getting a dev environment running?
2. **CI/CD Pipeline Experience** -- How reliable and fast are builds and deploys?
3. **Component Reuse & Discovery** -- How easy is it to find and reuse existing services?

Each question offers three responses (Low/Medium/High friction). After submitting, the user sees a bar chart of all responses collected so far.

## Architecture

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

- **Frontend**: React (Vite) with Recharts for data visualization
- **Backend**: Node.js + Express serving the static frontend and a REST API
- **Storage**: In-memory -- responses reset when the container restarts
- **No external database** is required

## API

| Method | Path                     | Description                          |
|--------|--------------------------|--------------------------------------|
| POST   | `/api/responses`         | Submit a survey response             |
| GET    | `/api/responses/results` | Retrieve aggregated counts           |

**POST body:**

```json
{ "q1": 2, "q2": 1, "q3": 3 }
```

**GET response:**

```json
{
  "q1": { "1": 12, "2": 34, "3": 8 },
  "q2": { "1": 20, "2": 15, "3": 19 },
  "q3": { "1": 5, "2": 30, "3": 19 },
  "total": 54
}
```

## Project Structure

```
├── frontend/                React SPA (Vite + TypeScript)
│   └── src/
│       ├── App.tsx
│       └── components/
│           ├── SurveyForm.tsx
│           └── ResultsChart.tsx
├── backend/                 Node.js API (Express + TypeScript)
│   └── src/
│       ├── index.ts
│       ├── store.ts
│       └── routes/responses.ts
├── k8s/                     Plain OpenShift manifests (Deployment, Service, Route)
├── tekton/                  Tekton Pipeline for deploying a prebuilt image
├── Containerfile            Multi-stage container build (UBI 9)
├── catalog-info.yaml        Backstage/RHDH component registration
└── template.yaml            RHDH Software Template for scaffolding
```

## Local Development

Start the backend and frontend dev servers:

```bash
cd backend && npm install && npm run dev
```

```bash
cd frontend && npm install && npm run dev
```

The Vite dev server (default port 5173) proxies `/api` requests to the backend on port 8080.

## Building the Container

The container is built from Red Hat UBI 9 Node.js images (`ubi9/nodejs-20` for build stages, `ubi9/nodejs-20-minimal` for the runtime).

```bash
podman build --platform linux/amd64 -f Containerfile -t developer-friction-survey .
podman run -p 8080:8080 developer-friction-survey
```

The `--platform linux/amd64` flag ensures the final image targets x86_64 for OpenShift. The build stages (frontend and backend) run natively on the host architecture since they only produce platform-independent output (static JS/CSS). This avoids esbuild crashes under QEMU emulation on ARM Macs.

Then open http://localhost:8080.

## Pushing to Quay.io

After building the image locally, tag and push it to your quay.io repository:

```bash
podman tag developer-friction-survey quay.io/YOUR_ORG/developer-friction-survey:latest
podman push quay.io/YOUR_ORG/developer-friction-survey:latest
```

Make sure the repository visibility in quay.io is set appropriately for your OpenShift cluster to pull from it.

## Deploying to OpenShift

### Option 1: Plain manifests

Edit `k8s/deployment.yaml` and replace `quay.io/YOUR_ORG/developer-friction-survey:latest` with your actual image reference, then apply:

```bash
oc apply -f k8s/
```

### Option 2: Tekton Pipeline

The Tekton pipeline deploys a prebuilt container image from quay.io (no in-cluster build step).

1. Apply the pipeline:

   ```bash
   oc apply -f tekton/pipeline.yaml
   ```

2. Edit `tekton/pipelinerun.yaml` and replace `YOUR_ORG` with your quay.io org, then run:

   ```bash
   oc create -f tekton/pipelinerun.yaml
   ```

   This creates the Deployment, Service, and Route, then waits for the rollout to complete.

## Red Hat Developer Hub

Register the Software Template in your RHDH instance by adding `template.yaml` to your catalog locations. The template prompts for an application name, OpenShift namespace, and Git repository, then scaffolds and publishes the project automatically.

The `catalog-info.yaml` file registers the deployed component in the RHDH catalog for visibility and ownership tracking.
