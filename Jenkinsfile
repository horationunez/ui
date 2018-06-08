pipeline {
    agent {
            label 'xenial-jenkins-docker'
    }
    environment {
        CI = 'true'
    }
    stages {
        stage('Install') {
            steps {
                sh 'npm install'
            }
        }
        stage('Test') {
            steps {
                sh 'npm run test'
            }
        }
        stage('Build') {
            steps {
                sh 'npm run build'
                sh 'rm -rf node_modules'
                sh 'npm i --production'
            }
        }
        stage('Archive') {
            steps {
                archiveArtifacts artifacts: 'node_modules/**, config/**, dist/**, server/**, package.json', fingerprint: true
            }
        } 
        stage('Deploy Dev') {
            steps {
            sh 'echo deploy command goes here'
        }
    }
}
