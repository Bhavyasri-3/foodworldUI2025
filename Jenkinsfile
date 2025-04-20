
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
                bat 'npm ci'
            }
        
        }

        stage('Lint'){
            steps{
                bat 'npm run lint || echo "Lint warnings"'
            }
        }

        stage('Build'){
            steps{
                bat 'ng build --configuration=production'
            }
        }

        stage('Deploy to Render'){
            steps{
                bat "curl -X POST $RENDER_DEPLOY_HOOK"
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