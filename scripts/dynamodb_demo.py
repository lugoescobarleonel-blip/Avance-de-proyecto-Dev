import boto3

REGION = "us-east-1"
TABLE_NAME = "ProyectoDevOpsTareas"

dynamodb = boto3.resource("dynamodb", region_name=REGION)

def crear_tabla():
    try:
        table = dynamodb.create_table(
            TableName=TABLE_NAME,
            KeySchema=[
                {"AttributeName": "id", "KeyType": "HASH"}
            ],
            AttributeDefinitions=[
                {"AttributeName": "id", "AttributeType": "S"}
            ],
            BillingMode="PAY_PER_REQUEST"
        )
        print("Creando tabla DynamoDB...")
        table.wait_until_exists()
        print("Tabla creada correctamente.")
    except Exception as e:
        print("La tabla ya existe o no se pudo crear:", e)

def insertar_registro():
    table = dynamodb.Table(TABLE_NAME)
    table.put_item(
        Item={
            "id": "1",
            "tarea": "Configurar proyecto DevOps",
            "estado": "Pendiente"
        }
    )
    print("Registro insertado.")

def consultar_registro():
    table = dynamodb.Table(TABLE_NAME)
    response = table.get_item(Key={"id": "1"})
    print("Registro consultado:")
    print(response.get("Item", "No encontrado"))

def actualizar_registro():
    table = dynamodb.Table(TABLE_NAME)
    table.update_item(
        Key={"id": "1"},
        UpdateExpression="SET estado = :estado",
        ExpressionAttributeValues={
            ":estado": "Completado"
        }
    )
    print("Registro actualizado.")

def eliminar_registro():
    table = dynamodb.Table(TABLE_NAME)
    table.delete_item(Key={"id": "1"})
    print("Registro eliminado.")

crear_tabla()
insertar_registro()
consultar_registro()
actualizar_registro()
consultar_registro()
eliminar_registro()
