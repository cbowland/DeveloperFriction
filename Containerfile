# Build stages run natively (no platform pin) since they only produce
# platform-independent output (static JS/CSS). This avoids esbuild
# crashes under QEMU emulation on ARM Macs.
FROM registry.access.redhat.com/ubi9/nodejs-20:latest AS frontend-build
USER 0
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM registry.access.redhat.com/ubi9/nodejs-20:latest AS backend-build
USER 0
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json* ./
RUN npm install
COPY backend/ ./
RUN npm run build

# Only the runtime stage targets amd64 for OpenShift deployment
FROM --platform=linux/amd64 registry.access.redhat.com/ubi9/nodejs-20-minimal:latest
USER 0
WORKDIR /app

COPY --from=backend-build /app/backend/package.json /app/backend/package-lock.json* ./backend/
RUN cd backend && npm install --omit=dev

COPY --from=backend-build /app/backend/dist ./backend/dist
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

RUN chown -R 1001:0 /app
USER 1001

EXPOSE 8080

CMD ["node", "backend/dist/index.js"]
