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
                        sh """
                        echo "Deploying to PROD..."

                        # Replace image dynamically
                        sed -i "s|IMAGE_PLACEHOLDER|$IMAGE|g" k8s/prod/deployment.yaml

                        # Apply PROD configs
                        kubectl apply -f k8s/prod/

                        # Apply ingress (shared)
                        kubectl apply -f k8s/ingress.yaml

                        # Wait for rollout
                        kubectl rollout status deployment/tictactoe-prod
                        """
                    } else {
                        sh """
                        echo "🚀 Deploying to DEV..."

                        # Replace image dynamically
                        sed -i "s|IMAGE_PLACEHOLDER|$IMAGE|g" k8s/dev/deployment.yaml

                        # Apply DEV configs
                        kubectl apply -f k8s/dev/

                        # Apply ingress (shared)
                        kubectl apply -f k8s/ingress.yaml

                        # Wait for rollout
                        kubectl rollout status deployment/tictactoe-dev
                        """
                    }

                }
            }
        }
    }
}