pipeline {
    agent any

    stages {

        stage('Build') {
            steps {
                bat 'docker compose --profile core build'
            }
        }

        stage('Start Services') {
            steps {
                bat 'docker compose --profile core up -d'
            }
        }

        stage('Health Checks') {
            steps {
                bat 'curl http://localhost:3000/health'
                bat 'curl http://localhost:3001/health'
                bat 'curl http://localhost:3002/health'
            }
        }
    }

    post {
        success {
            echo 'Práctica 1 ejecutada correctamente'
        }

        failure {
            echo 'La práctica falló'
        }
    }
}