#!/bin/bash

INSTANCE_ID=$1

if [ -z "$INSTANCE_ID" ]; then
  echo "Debes poner el ID de la instancia EC2."
  echo "Ejemplo: ./scripts/crear_alarma_cloudwatch.sh i-1234567890"
  exit 1
fi

aws cloudwatch put-metric-alarm \
  --alarm-name "alarma-cpu-proyecto-devops" \
  --alarm-description "Alarma para detectar CPU alta en EC2" \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --statistic Average \
  --period 300 \
  --threshold 70 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 1 \
  --dimensions Name=InstanceId,Value=$INSTANCE_ID \
  --region us-east-1

echo "Alarma creada correctamente para la instancia $INSTANCE_ID"
