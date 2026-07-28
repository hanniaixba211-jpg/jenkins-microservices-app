pipeline {
    agent any

    stages {

        stage('Build') {
            steps {
                sh 'docker compose --profile core build'
            }
        }

        stage('Start Services') {
            steps {
                sh 'docker compose --profile core up -d'
            }
        }

        stage('Health Checks') {
            steps {
                sh 'curl http://host.docker.internal:3000/health'
                sh 'curl http://host.docker.internal:3001/health'
                sh 'curl http://host.docker.internal:3002/health'
            }
        }
    }

    post {
    success {
        echo 'Practica 1 ejecutada correctamente'
    }
    failure {
        echo 'La practica fallo'
    }
    always {
        sh 'docker compose down'
    }
}
}