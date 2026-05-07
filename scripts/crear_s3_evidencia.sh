#!/bin/bash

set -e

REGION="us-east-1"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
BUCKET="proyecto-devops-${ACCOUNT_ID}-${RANDOM}"

echo "Creando bucket: $BUCKET"

aws s3 mb s3://$BUCKET --region $REGION

echo "Activando versionado..."
aws s3api put-bucket-versioning \
  --bucket $BUCKET \
  --versioning-configuration Status=Enabled

echo "Activando cifrado en reposo..."
aws s3api put-bucket-encryption \
  --bucket $BUCKET \
  --server-side-encryption-configuration '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"}}]}'

echo "Creando archivo de evidencia..."
echo "Evidencia del proyecto final DevOps en AWS" > evidencia_s3.txt

echo "Subiendo archivo a S3..."
aws s3 cp evidencia_s3.txt s3://$BUCKET/evidencias/evidencia_s3.txt

echo "Listando contenido del bucket..."
aws s3 ls s3://$BUCKET --recursive

echo "Bucket creado: $BUCKET"
echo $BUCKET > evidencias/bucket_s3_creado.txt
