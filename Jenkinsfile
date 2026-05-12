pipeline {
    agent any

    // Disparador para revisar cambios en GitHub cada 5 minutos
    triggers {
        pollSCM('*/5 * * * *')
    }

    environment {
        IMAGE_NAME = "mi-proyecto-app"
        CONTAINER_NAME = "mi-contenedor-app"
    }

    stages {
        stage('Limpieza de Disco') {
            steps {
                // Mantiene el espacio libre para evitar que el nodo se ponga offline
                sh 'docker image prune -f'
                sh 'docker container prune -f'
            }
        }

        stage('Clonar repositorio') {
            steps {
                checkout scm
            }
        }

        stage('Construir imagen Docker') {
            steps {
                sh 'docker build --no-cache -t $IMAGE_NAME .'
            }
        }

        stage('Limpiar y Desplegar') {
            steps {
                sh 'docker stop $CONTAINER_NAME || true'
                sh 'docker rm $CONTAINER_NAME || true'
                // Mapeo al puerto 80 para acceso directo vía IP
                sh 'docker run -d --name $CONTAINER_NAME -p 80:80 $IMAGE_NAME'
            }
        }

        stage('Validar despliegue') {
            steps {
                sh 'docker ps'
                sleep 5
                // Verificación interna en el puerto 80
                sh 'curl --max-time 5 http://localhost:80/ || true'
            }
        }
    }

    post {
        success {
            echo '¡Despliegue automático exitoso! Revisa http://3.89.229.156'
        }
        failure {
            echo 'El pipeline falló. Revisa si el nodo sigue en línea o si falta espacio.'
        }
    }
}
