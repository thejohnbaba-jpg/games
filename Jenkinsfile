pipeline {
    agent any

    environment {
        IMAGE = "thejohnbaba/tictactoe:${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                sh 'docker build -t tictactoe .'
            }
        }

        stage('Tag') {
            steps {
                sh 'docker tag tictactoe $IMAGE'
            }
        }

        stage('Push') {
            steps {
                withCredentials([string(credentialsId: 'docker-pass', variable: 'PASS')]) {
                    sh '''
                    echo $PASS | docker login -u thejohnbaba --password-stdin
                    docker push $IMAGE
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                kubectl set image deployment/tictactoe tictactoe=$IMAGE
                kubectl rollout status deployment/tictactoe
                '''
            }
        }
    }
}