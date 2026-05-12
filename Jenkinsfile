pipeline {
    agent any

    environment {
        // Puedes cambiar el nombre de la imagen si prefieres algo como "node-app"
        IMAGE_NAME = "mi-proyecto-app"
        CONTAINER_NAME = "mi-contenedor-app"
    }

    stages {
        stage('Clonar repositorio') {
            steps {
                checkout scm
            }
        }

        stage('Construir imagen Docker') {
            steps {
                // CAMBIO CLAVE: Se usa '.' porque tu app.js y Dockerfile están en la raíz
                sh 'docker build --no-cache -t $IMAGE_NAME .'
            }
        }

        stage('Limpiar y Desplegar') {
            steps {
                sh 'docker stop $CONTAINER_NAME || true'
                sh 'docker rm $CONTAINER_NAME || true'
                
                // Si tu app de Node usa otro puerto (ej. 3000), cambia el primer 5000:
                sh 'docker run -d --name $CONTAINER_NAME -p 5000:5000 $IMAGE_NAME'
            }
        }

        stage('Validar despliegue') {
            steps {
                sh 'docker ps'
                sleep 5
                sh 'curl --max-time 5 http://localhost:5000/ || true'
            }
        }
    }

    post {
        success {
            echo '¡Despliegue automático exitoso!'
        }
        failure {
            echo 'El pipeline falló. Revisa el Console Output.'
        }
    }
}
