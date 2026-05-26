FROM python:3.12-slim AS backend

WORKDIR /app

# Instalar curl para healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copiar dependencias de backend
COPY ./backend/requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt gunicorn

# Copiar backend
COPY ./backend /app/

# ========== BUILD FRONTEND ==========
FROM node:20-alpine AS frontend

WORKDIR /frontend
COPY ./frontend/package.json ./frontend/yarn.lock* ./
RUN yarn install --frozen-lockfile
COPY ./frontend ./
RUN yarn build

# ========== FINAL ==========
FROM backend

# Copiar el build del frontend a la carpeta que Django espera
COPY --from=frontend /frontend/dist /frontend/dist

# Script de entrada
COPY ./docker/backend/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8000
ENTRYPOINT ["/entrypoint.sh"]