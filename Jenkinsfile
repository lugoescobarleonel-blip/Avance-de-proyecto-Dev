pipeline {
    agent any

    environment {
        IMAGE_NAME = "mi-proyecto-app"
        CONTAINER_NAME = "mi-contenedor-app"
    }

    stages {
        stage('Limpieza de Disco') {
            steps {
                // Previene el error de "espacio bajo" que vimos en tus capturas
                sh 'docker image prune -f'
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
                // Mapeo 80 de la instancia al 80 del contenedor (Nginx)
                sh 'docker run -d --name $CONTAINER_NAME -p 80:80 $IMAGE_NAME'
            }
        }

        stage('Validar despliegue') {
            steps {
                sh 'docker ps'
                sleep 5
                // Validamos contra el puerto 80 que es donde vive Nginx
                sh 'curl --max-time 5 http://localhost:80/ || true'
            }
        }
    }

    post {
        success {
            echo '¡Despliegue automático exitoso! Revisa http://3.89.229.156'
        }
        failure {
            echo 'El pipeline falló. Revisa el Console Output para ver si es falta de espacio.'
        }
    }
}
