# Guía de evidencias del Proyecto Final DevOps AWS

## GitHub
- Repositorio público del proyecto.
- Rama main.
- Rama develop.
- Commits con convención feat:, fix: y docs:.
- Pull Request de develop hacia main.

## CloudShell
- Acceso a AWS CloudShell en us-east-1.
- Repositorio clonado.
- Validación con aws sts get-caller-identity.
- Ejecución de scripts Bash y Python.

## S3
- Bucket propio del proyecto creado.
- Versionado activado.
- Cifrado en reposo activado.
- Archivo de evidencia subido automáticamente.

## DynamoDB
- Tabla creada con boto3.
- Registro insertado.
- Registro consultado.
- Registro actualizado.
- Registro eliminado.

## Docker
- Dockerfile creado.
- docker-compose.yml agregado.
- Red personalizada configurada.
- Volumen de logs configurado.

## CloudWatch
- Script para crear alarma de CPU.
- Monitoreo de instancia EC2.

## Seguridad
- No se crearon usuarios IAM personalizados.
- Se trabajó con las restricciones del Learner Lab.
- Se documentaron limitaciones de permisos IAM.
