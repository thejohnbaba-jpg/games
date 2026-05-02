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

        stage('Setup Ingress Controller (One-time Safe)') {
            steps {
                sh '''
                echo "🔧 Setting up Ingress Controller..."

                # Namespace
                kubectl apply -f k8s/ingress-controller/namespace.yaml

                # ServiceAccount
                kubectl apply -f k8s/ingress-controller/serviceaccount.yaml

                # Controller Deployment
                kubectl apply -f k8s/ingress-controller/controller.yaml

                # Controller Service
                kubectl apply -f k8s/ingress-controller/service.yaml
                '''
            }
        }
       stage('Deploy Application') {
            steps {
                script {

                    if (env.BRANCH_NAME == 'main') {

                        sh """
                        echo "🚀 Deploying to PROD..."

                        sed -i "s|IMAGE_PLACEHOLDER|$IMAGE|g" k8s/prod/deployment.yaml

                        kubectl apply -f k8s/prod/
                        kubectl apply -f k8s/ingress/

                        kubectl rollout status deployment/tictactoe-prod
                        """

                    } else {

                        sh """
                        echo "🚀 Deploying to DEV..."

                        sed -i "s|IMAGE_PLACEHOLDER|$IMAGE|g" k8s/dev/deployment.yaml

                        kubectl apply -f k8s/dev/
                        kubectl apply -f k8s/ingress/

                        kubectl rollout status deployment/tictactoe-dev
                        """

                    }
                }
            }
       }
    }
}