# 📘 Gestor de Tareas - DevOps

## 📌 Descripción

Aplicación web para la gestión de tareas académicas, donde los profesores pueden asignar, revisar y calificar actividades, y los alumnos pueden entregar sus tareas.

---

## 🚀 Tecnologías utilizadas

* HTML5
* CSS3
* JavaScript (ES6+)
* LocalStorage
* Docker 🐳
* AWS EC2 ☁️
* AWS CodeDeploy 🚀
* AWS CodePipeline 🔄
* AWS CloudFormation 📜
* Git & GitHub

---

## ⚙️ Funcionalidades

* Crear tareas
* Editar y eliminar tareas
* Entregar tareas (alumnos)
* Calificar tareas (profesor)
* Filtros por estado (pendiente, entregada, revisada)
* Búsqueda por texto

---

## 🧱 Arquitectura

La aplicación sigue una arquitectura simple basada en frontend estático desplegado en contenedor Docker:

Usuario → Navegador → EC2 → Docker (Nginx) → Aplicación Web

* EC2: Servidor en AWS
* Docker: Contenedor que ejecuta la app
* Nginx: Servidor web
* CodeDeploy: Automatiza despliegues
* CodePipeline: CI/CD

---

## 🐳 Contenerización con Docker

### Construcción de imagen

```bash
docker build -t gestor-html .
```

### Ejecución del contenedor

```bash
docker run -d -p 80:80 --name gestor gestor-html
```

---

## 📜 Script de despliegue (Bash)

Archivo: `deploy.sh`

```bash
#!/bin/bash
echo "🚀 Iniciando despliegue..."

docker stop gestor || true
docker rm gestor || true

docker build -t gestor-html .
docker run -d -p 80:80 --name gestor gestor-html

echo "✅ Despliegue completado"
```

### Ejecutar:

```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 🐍 Script en Python (Boto3)

Archivo: `aws_script.py`

```python
import boto3

ec2 = boto3.client('ec2')

response = ec2.describe_instances()

for reservation in response['Reservations']:
    for instance in reservation['Instances']:
        print(instance['InstanceId'])
```

---

## ☁️ Infraestructura como Código (CloudFormation)

Archivo: `template.yml`

Define:

* Instancia EC2
* Seguridad (puerto 80)
* Configuración base

---

## 🔄 Pipeline CI/CD

Flujo automatizado:

1. Push a GitHub
2. CodePipeline detecta cambios
3. CodeDeploy despliega en EC2
4. Docker levanta la aplicación

---

## 🌐 Despliegue

Aplicación disponible en:

```
http://<IP_PUBLICA_EC2>
```

---

## 📸 Evidencias

(Incluir en el PDF)

* Aplicación funcionando
* EC2 en ejecución
* CodeDeploy exitoso
* CodePipeline en verde

---

## 👨‍💻 Autores

Leonel Lugo Escobar
Gabriel Huerta
Hugo Alberto Brihuega

---

## 📈 Próximas mejoras

* Base de datos (RDS)
* Autenticación de usuarios
* Escalabilidad con Load Balancer
* Integración con S3

---
