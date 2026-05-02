pipeline {
    agent any

    environment {
        IMAGE = "thejohnbaba/tictactoe:${BRANCH_NAME}-${BUILD_NUMBER}"
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
                script {

                    if (env.BRANCH_NAME == 'main') {
                        sh '''
                        echo "Deploying to PROD..."

                        kubectl apply -f k8/prod/
                        kubectl set image deployment/tictactoe-prod tictactoe=$IMAGE
                        kubectl rollout status deployment/tictactoe-prod
                        '''
                    } else {
                        sh '''
                        echo "Deploying to DEV..."

                        kubectl apply -f k8/dev/
                        kubectl set image deployment/tictactoe-dev tictactoe=$IMAGE
                        kubectl rollout status deployment/tictactoe-dev
                        '''
                    }

                }
            }
        }
    }
}