# Local Development

## Prerequisites

- Node.js 20+
- npm

## Getting Started

Install dependencies for both the backend and frontend:

```bash
cd backend && npm install
cd ../frontend && npm install
```

Start the backend server:

```bash
cd backend
npm run dev
```

The API starts on port 8080.

In a separate terminal, start the frontend dev server:

```bash
cd frontend
npm run dev
```

The Vite dev server starts on port 5173 and proxies all `/api` requests to the backend on port 8080 (configured in `vite.config.ts`).

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Type Checking

Both the frontend and backend use TypeScript. To verify types without building:

```bash
cd backend && npx tsc --noEmit
cd ../frontend && npx tsc --noEmit
```

## Building for Production

Build the backend (compiles TypeScript to `backend/dist/`):

```bash
cd backend
npm run build
```

Build the frontend (outputs static files to `frontend/dist/`):

```bash
cd frontend
npm run build
```

To test the production build locally, run the compiled backend which serves the frontend static files:

```bash
cd backend
npm start
```

Then open [http://localhost:8080](http://localhost:8080).
