#!/bin/bash
echo "Iniciando despliegue..."

docker stop gestor || true
docker rm gestor || true

docker build -t gestor-html .
docker run -d -p 80:80 --name gestor gestor-html

echo "Despliegue completado"
