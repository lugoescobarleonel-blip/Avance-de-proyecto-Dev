# Gestor de Tareas - Proyecto Final DevOps AWS

## Descripción del proyecto

Este proyecto consiste en una aplicación web estática llamada **Gestor de Tareas**, desarrollada con HTML, CSS y JavaScript. La aplicación permite simular la gestión académica de tareas, donde los profesores pueden crear, revisar y calificar actividades, mientras que los alumnos pueden consultar y entregar tareas.

El objetivo principal del proyecto es aplicar prácticas DevOps para automatizar el despliegue, monitoreo y administración de infraestructura en AWS, utilizando herramientas como GitHub, Jenkins, Docker, AWS CloudFormation, EC2, S3, DynamoDB, CloudWatch y scripts Bash/Python.

---

## Caso de análisis

La empresa ficticia **Soluciones Tecnológicas del Futuro** enfrenta problemas relacionados con procesos manuales de despliegue, errores en producción, falta de monitoreo y dificultad para entregar actualizaciones de software de forma rápida y segura.

Para atender este caso, se implementó una solución basada en prácticas DevOps que permite:

- Automatizar tareas repetitivas.
- Controlar versiones mediante GitHub.
- Desplegar infraestructura como código con AWS CloudFormation.
- Ejecutar una aplicación web en AWS EC2 con Nginx.
- Monitorear recursos con AWS CloudWatch.
- Gestionar almacenamiento con S3.
- Usar DynamoDB para operaciones básicas con boto3.
- Integrar Jenkins como herramienta de CI/CD.

---

## Tecnologías utilizadas

| Tecnología | Uso dentro del proyecto |
|---|---|
| HTML5 | Estructura de la aplicación web |
| CSS3 | Estilos visuales |
| JavaScript | Funcionalidad del frontend |
| LocalStorage | Persistencia local de tareas |
| Git | Control de versiones |
| GitHub | Repositorio remoto y colaboración |
| Jenkins | Automatización CI/CD |
| Docker | Contenerización de la aplicación |
| Docker Compose | Definición de servicios, red y volumen |
| AWS CloudShell | Entorno Linux para administración AWS |
| AWS CLI | Gestión de recursos AWS desde terminal |
| AWS CloudFormation | Infraestructura como código |
| AWS EC2 | Servidor para desplegar la aplicación |
| Nginx | Servidor web dentro de EC2/Docker |
| Amazon S3 | Almacenamiento de evidencias |
| Amazon DynamoDB | Base de datos NoSQL para pruebas CRUD |
| Amazon CloudWatch | Monitoreo y alarmas |
| Python 3 | Automatización con boto3 |
| boto3 | SDK de AWS para Python |
| Bash | Automatización de tareas |

---

## Funcionalidades de la aplicación

La aplicación web permite:

- Crear tareas.
- Editar tareas.
- Eliminar tareas.
- Entregar tareas como alumno.
- Revisar tareas como profesor.
- Filtrar tareas por estado:
  - Pendiente
  - Entregada
  - Revisada
- Buscar tareas por texto.
- Guardar información en LocalStorage.

---

## Arquitectura general

La arquitectura implementada es la siguiente:

```text
Usuario
  ↓
Navegador Web
  ↓
EC2 pública
  ↓
Nginx
  ↓
Aplicación Web Gestor de Tareas

Además, se agregaron componentes de automatización y monitoreo:

GitHub
  ↓
Jenkins
  ↓
Validación / Build / Despliegue
  ↓
AWS CloudFormation
  ↓
EC2 + Nginx + Aplicación Web

AWS CloudShell
  ├── Scripts Bash → S3
  ├── Scripts Python boto3 → EC2 / DynamoDB
  └── AWS CLI → CloudFormation / CloudWatch

CloudWatch
  ↓
Alarma de CPU para EC2
Estructura del repositorio
Avance-de-proyecto-Dev/
│
├── index.html
├── styles.css
├── app.js
│
├── Dockerfile
├── docker-compose.yml
├── Jenkinsfile
│
├── template.yml
├── deploy.sh
├── aws_script.py
│
├── scripts/
│   ├── crear_s3_evidencia.sh
│   ├── crear_alarma_cloudwatch.sh
│   └── dynamodb_demo.py
│
├── evidencias/
│   ├── guia_evidencias.md
│   ├── infraestructura_cloudformation.md
│   └── evidencia_s3.txt
│
├── README.md
└── .gitignore
Flujo de trabajo con Git y GitHub

El proyecto utiliza dos ramas principales:

Rama	Propósito
main	Rama principal con la versión final estable
develop	Rama de desarrollo para integrar cambios antes de pasarlos a main
Convención de commits utilizada

Se aplicaron convenciones de commits:

feat: nueva funcionalidad
fix: corrección de errores
docs: documentación

Ejemplos:

git commit -m "feat: agregar docker compose dynamodb y monitoreo"
git commit -m "fix: desplegar aplicacion web en EC2 con CloudFormation"
git commit -m "docs: actualizar README con configuracion DevOps"
Flujo de integración
develop → Pull Request → main

Antes de fusionar cambios a main, se realizaron Pull Requests para revisar e integrar los cambios.

Configuración inicial en AWS CloudShell

Se utilizó AWS CloudShell como entorno Linux debido a restricciones de permisos en AWS Cloud9 dentro del Learner Lab.

Validar región
aws configure get region

Configurar región permitida:

export AWS_DEFAULT_REGION=us-east-1
aws configure set region us-east-1

Verificar región:

aws configure get region
Validar credenciales
aws sts get-caller-identity

Este comando permite comprobar que CloudShell está autenticado correctamente con las credenciales temporales del Learner Lab.

Verificar herramientas disponibles
aws --version
git --version
python3 --version
Clonar el repositorio

Desde AWS CloudShell:

cd ~
git clone https://github.com/lugoescobarleonel-blip/Avance-de-proyecto-Dev.git
cd Avance-de-proyecto-Dev
git checkout main
git pull origin main

Verificar archivos:

ls
Infraestructura como código con CloudFormation

El archivo principal de infraestructura es:

template.yml

Este archivo define:

Instancia EC2 t2.micro.
Security Group con acceso HTTP por el puerto 80.
Instalación automática de Nginx mediante UserData.
Descarga de la aplicación desde GitHub.
Copia de archivos web a /usr/share/nginx/html/.
Outputs con información de la instancia y URL pública.
Validar plantilla CloudFormation
aws cloudformation validate-template --template-body file://template.yml
Desplegar stack
aws cloudformation deploy \
  --template-file template.yml \
  --stack-name proyecto-devops-stack \
  --region us-east-1

Si no hay cambios nuevos, AWS puede responder:

No changes to deploy. Stack proyecto-devops-stack is up to date

Esto significa que la infraestructura ya está desplegada correctamente.

Validación de instancia EC2

Obtener la instancia creada por CloudFormation:

INSTANCE_ID=$(aws cloudformation list-stack-resources \
  --stack-name proyecto-devops-stack \
  --query "StackResourceSummaries[?ResourceType=='AWS::EC2::Instance'].PhysicalResourceId | [0]" \
  --output text)

echo $INSTANCE_ID

Validar estado de la instancia:

aws ec2 describe-instances \
  --instance-ids $INSTANCE_ID \
  --query "Reservations[*].Instances[*].[InstanceId,State.Name,InstanceType,PublicIpAddress,PrivateIpAddress]" \
  --output table

Obtener IP pública:

PUBLIC_IP=$(aws ec2 describe-instances \
  --instance-ids $INSTANCE_ID \
  --query "Reservations[0].Instances[0].PublicIpAddress" \
  --output text)

echo $PUBLIC_IP

Probar aplicación:

curl http://$PUBLIC_IP

También puede abrirse en navegador:

http://<IP_PUBLICA_EC2>
Contenerización con Docker

El proyecto incluye un Dockerfile para contenerizar la aplicación web con Nginx.

Archivo Dockerfile
FROM nginx:alpine

COPY index.html /usr/share/nginx/html/index.html
COPY styles.css /usr/share/nginx/html/styles.css
COPY app.js /usr/share/nginx/html/app.js

EXPOSE 80
Construir imagen Docker
docker build -t gestor-tareas-devops .
Ejecutar contenedor
docker run -d -p 8080:80 --name gestor-tareas-devops gestor-tareas-devops
Probar contenedor local
curl http://localhost:8080
Docker Compose

El proyecto también incluye docker-compose.yml para definir el servicio, red personalizada y volumen de logs.

Ejecutar con Docker Compose
docker compose up -d
Ver contenedores activos
docker ps
Detener servicios
docker compose down
Nota sobre CloudShell

En AWS CloudShell, Docker puede estar limitado dependiendo del entorno. Por ello, la contenerización se documenta mediante Dockerfile y docker-compose.yml, y puede ejecutarse en un entorno compatible con Docker o dentro de Jenkins.

CI/CD con Jenkins

La actividad original contemplaba CodeCommit, CodeBuild y CodePipeline; sin embargo, por las restricciones del entorno Learner Lab, el flujo CI/CD fue implementado con Jenkins conectado a GitHub.

Archivo Jenkinsfile
Jenkinsfile

El pipeline permite automatizar etapas como:

Obtener código desde GitHub.
Validar archivos del proyecto.
Construir la aplicación.
Ejecutar pruebas básicas.
Desplegar o validar el entorno.
Flujo CI/CD implementado
Push / Pull Request en GitHub
        ↓
Jenkins Pipeline
        ↓
Validación del proyecto
        ↓
Build / Docker
        ↓
Despliegue o verificación
Justificación

Jenkins reemplaza el uso de CodePipeline y CodeBuild en este proyecto, manteniendo el principio DevOps de integración y entrega continua.

Script de despliegue Bash

Archivo:

deploy.sh

Ejemplo de uso:

chmod +x deploy.sh
./deploy.sh

Este script automatiza tareas relacionadas con el despliegue de la aplicación.

Automatización con Python y boto3

El proyecto incluye scripts Python para interactuar con AWS mediante boto3.

Script para listar instancias EC2

Archivo:

aws_script.py

Ejecutar:

python3 aws_script.py

Este script lista instancias EC2 disponibles en la cuenta AWS.

DynamoDB con boto3

Archivo:

scripts/dynamodb_demo.py

Este script realiza operaciones CRUD sobre DynamoDB:

Crear tabla.
Insertar registro.
Consultar registro.
Actualizar registro.
Eliminar registro.

Ejecutar:

python3 scripts/dynamodb_demo.py

Salida esperada:

Tabla creada correctamente
Registro insertado
Registro consultado
Registro actualizado
Registro eliminado

Si aparece:

Table already exists

significa que la tabla ya fue creada previamente y el script continúa con las operaciones CRUD.

Automatización con S3

El proyecto incluye un script Bash para crear y validar un bucket S3.

Archivo:

scripts/crear_s3_evidencia.sh

Ejecutar:

chmod +x scripts/*.sh
./scripts/crear_s3_evidencia.sh

El script realiza:

Creación de bucket S3.
Activación de versionado.
Activación de cifrado en reposo.
Creación de archivo de evidencia.
Carga automática del archivo al bucket.
Listado del contenido del bucket.
Validar bucket manualmente
aws s3 ls

Validar contenido:

aws s3 ls s3://<NOMBRE_BUCKET> --recursive

Validar versionado:

aws s3api get-bucket-versioning --bucket <NOMBRE_BUCKET>

Validar cifrado:

aws s3api get-bucket-encryption --bucket <NOMBRE_BUCKET>
Monitoreo con CloudWatch

Se creó una alarma de CloudWatch para monitorear el uso de CPU de la instancia EC2.

Archivo:

scripts/crear_alarma_cloudwatch.sh

Ejecutar:

./scripts/crear_alarma_cloudwatch.sh $INSTANCE_ID

Validar alarma:

aws cloudwatch describe-alarms \
  --alarm-names alarma-cpu-proyecto-devops \
  --output table

La alarma monitorea:

Métrica: CPUUtilization
Namespace: AWS/EC2
Threshold: 70%
Periodo: 300 segundos
Seguridad

Durante el proyecto se aplicaron medidas de seguridad dentro de los límites del Learner Lab:

No se crearon usuarios IAM personalizados.
No se crearon grupos IAM personalizados.
No se crearon roles adicionales fuera de los permitidos.
Se trabajó con credenciales temporales del Learner Lab.
Se utilizó Security Group para permitir acceso HTTP por puerto 80.
Se documentaron las restricciones de IAM encontradas.
Limitaciones del Learner Lab

Durante el desarrollo se identificaron restricciones propias del entorno AWS Learner Lab:

Cloud9

No fue posible utilizar AWS Cloud9 con Systems Manager debido a restricciones de permisos IAM para crear roles o perfiles requeridos por el servicio. Por esta razón, se utilizó AWS CloudShell como entorno Linux alternativo.

IAM

No se crearon usuarios, grupos ni roles personalizados, ya que el laboratorio limita esas acciones. Se trabajó con los permisos disponibles.

CodePipeline / CodeBuild

La parte de CI/CD con CodePipeline y CodeBuild fue reemplazada por Jenkins, manteniendo el objetivo de automatizar validación, construcción y despliegue.

Docker en CloudShell

La ejecución de Docker puede estar limitada en CloudShell. Por ello se documentó la contenerización mediante Dockerfile y docker-compose.yml, y se integró el flujo con Jenkins.

Evidencias recomendadas

Para documentar el proyecto se deben incluir capturas de:

Repositorio GitHub en rama main.
Ramas main y develop.
Pull Requests fusionados.
Jenkinsfile.
Pipeline de Jenkins.
AWS CloudShell con credenciales validadas.
CloudFormation Stack desplegado.
EC2 en estado running.
Aplicación abierta en navegador.
curl mostrando HTML de la app.
Bucket S3 creado.
Versionado S3 habilitado.
Cifrado S3 habilitado.
DynamoDB ejecutando operaciones CRUD.
CloudWatch Alarm creada.
Dockerfile y docker-compose.yml.
Limpieza de recursos

Para evitar consumo innecesario en el Learner Lab, se recomienda detener o eliminar recursos al finalizar.

Detener instancia EC2
aws ec2 stop-instances --instance-ids $INSTANCE_ID
Eliminar stack CloudFormation
aws cloudformation delete-stack \
  --stack-name proyecto-devops-stack \
  --region us-east-1
Eliminar bucket S3

Antes de borrar un bucket, se debe vaciar:

aws s3 rm s3://<NOMBRE_BUCKET> --recursive
aws s3 rb s3://<NOMBRE_BUCKET>
Autores
Leonel Lugo Escobar
Gabriel Huerta
Hugo Alberto Brihuega
Próximas mejoras
Implementar autenticación de usuarios.
Integrar base de datos persistente en la nube.
Agregar AWS Lambda y API Gateway como microservicio.
Implementar AWS Config para auditoría.
Enviar logs de EC2 a CloudWatch Logs.
Agregar Load Balancer.
Implementar Auto Scaling.
Mejorar políticas de seguridad restringiendo acceso por IP.
Agregar pruebas automatizadas más completas.
