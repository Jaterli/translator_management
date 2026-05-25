# Etapa 1: Build de React
FROM node:20-alpine as build
WORKDIR /app

# Instalar yarn
RUN apk add --no-cache yarn

# Copiar archivos de dependencias
COPY ./frontend/package.json ./
COPY ./frontend/yarn.lock ./

# Instalar dependencias con yarn
RUN yarn install --frozen-lockfile

# Copiar el resto del código
COPY ./frontend/ ./

# Construir la app
#RUN yarn build
RUN yarn build --mode development

# Etapa 2: Servir con Nginx
FROM nginx:stable-alpine
# Copiamos los archivos compilados de React
COPY --from=build /app/dist /usr/share/nginx/html
# Copiamos la configuración personalizada de Nginx
COPY ./docker/nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80