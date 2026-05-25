#!/bin/bash
# deploy.sh - Script para despliegue con Yarn

echo "Iniciando despliegue..."

# Usar entorno de producción
echo "Copiando configuración de producción..."
cp .env.production .env

# Instalar dependencias si es necesario
echo "Instalando dependencias..."
yarn install

# Build de la aplicación
echo "Compilando aplicación..."
yarn build

# Limpiar archivo .env temporal
rm -f .env

echo "¡Despliegue completado!"
echo "Los archivos están en: dist/"