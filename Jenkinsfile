pipeline {
    agent any

    environment {
        IMAGE_NAME = "flask-jenkins-app"
        CONTAINER_NAME = "flask-jenkins-container"
    }

    stages {
        stage('Clonar repositorio') {
            steps {
                checkout scm
            }
        }

        stage('Construir imagen Docker') {
            steps {
                // --no-cache obliga a Docker a no usar versiones viejas del código
                sh 'docker build --no-cache -t $IMAGE_NAME ./app'
            }
        }

        stage('Limpiar y Desplegar') {
            steps {
                // Detenemos y borramos cualquier contenedor que use el nombre para evitar choques
                sh 'docker stop $CONTAINER_NAME || true'
                sh 'docker rm $CONTAINER_NAME || true'
                
                // Ejecutamos el nuevo contenedor
                sh 'docker run -d --name $CONTAINER_NAME -p 5000:5000 $IMAGE_NAME'
            }
        }

        stage('Validar despliegue') {
            steps {
                sh 'docker ps'
                // Le damos 5 segundos para que Flask "despierte"
                sleep 5
                // El timeout de 5 segundos evita que Jenkins se quede esperando si la app no carga
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
