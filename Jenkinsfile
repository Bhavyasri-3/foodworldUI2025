options{
    skipDefaultCheckout()
}

pipeline {
    agent any
    tools {
        nodejs "Node 20"
    }

    triggers {
        cron('* * * * *')
    }

    environment {
        RENDER_DEPLOY_HOOK = 'https://api.render.com/deploy/srv-d02akf3e5dus73bj8b50?key=tKZT2bA5n2Q'
    }

    stages {
        

        stage('Install Dependencies'){
            steps{
                sh 'npm ci'
            }
        
        }

        stage('Lint'){
            steps{
                sh 'npm run lint || echo "Lint warnings"'
            }
        }

        stage('Build'){
            steps{
                sh 'ng build --configuration=production'
            }
        }

        stage('Deploy to Render'){
            steps{
                sh "curl -X POST $RENDER_DEPLOY_HOOK"
            }
        }
    }   


post {
    success{
        echo "✅ Build and deployement successful!"
    }
    failure {
        echo "❌ Build or deployement failed."
    }

}

}