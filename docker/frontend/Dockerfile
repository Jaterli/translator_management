# Etapa 1: Build de React
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY frontend/package.json frontend/yarn.lock* ./
RUN yarn install --frozen-lockfile

# Copiar el resto del código y construir
COPY frontend/ ./
RUN yarn build

# Etapa 2: Servir con Nginx
FROM nginx:alpine

# Copiar los archivos compilados
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuración simple de nginx
RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]