#!/usr/bin/env node

/**
 * Production Environment Setup Script
 * 
 * This script helps configure the production environment for RUDYBTZ Portfolio
 * It handles Firebase configuration, environment variables, and deployment setup
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupFirebaseConfig() {
  console.log('\n🔥 Firebase Configuration Setup');
  console.log('==============================');
  
  const config = {
    apiKey: await question('Enter Firebase API Key: '),
    authDomain: await question('Enter Firebase Auth Domain: '),
    projectId: await question('Enter Firebase Project ID: '),
    storageBucket: await question('Enter Firebase Storage Bucket: '),
    messagingSenderId: await question('Enter Firebase Messaging Sender ID: '),
    appId: await question('Enter Firebase App ID: ')
  };

  const googleGenAiKey = await question('Enter Google Generative AI API Key: ');
  const adminPassword = await question('Enter Admin Password (optional): ');

  // Create production environment file
  const envContent = `# Production Environment Variables
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=${config.apiKey}
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${config.authDomain}
NEXT_PUBLIC_FIREBASE_PROJECT_ID=${config.projectId}
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${config.storageBucket}
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${config.messagingSenderId}
NEXT_PUBLIC_FIREBASE_APP_ID=${config.appId}

# Google AI Configuration
GOOGLE_GENAI_API_KEY=${googleGenAiKey}

# Optional Configuration
${adminPassword ? `ADMIN_PASSWORD=${adminPassword}` : '# ADMIN_PASSWORD=your_admin_password'}
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Analytics (optional)
# NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
`;

  fs.writeFileSync('.env.production', envContent);
  console.log('✅ Production environment file created: .env.production');
  
  return config;
}

async function setupVercelConfig(firebaseConfig) {
  console.log('\n▲ Vercel Configuration Setup');
  console.log('============================');
  
  const projectName = await question('Enter Vercel project name: ');
  const customDomain = await question('Enter custom domain (optional): ');
  
  const vercelConfig = {
    name: projectName,
    version: 2,
    builds: [
      {
        src: 'package.json',
        use: '@vercel/next'
      }
    ],
    env: {
      NEXT_PUBLIC_FIREBASE_API_KEY: firebaseConfig.apiKey,
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: firebaseConfig.authDomain,
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: firebaseConfig.projectId,
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: firebaseConfig.storageBucket,
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: firebaseConfig.messagingSenderId,
      NEXT_PUBLIC_FIREBASE_APP_ID: firebaseConfig.appId
    }
  };

  if (customDomain) {
    vercelConfig.alias = [customDomain];
  }

  console.log('✅ Vercel configuration prepared');
  console.log('📋 Next steps for Vercel deployment:');
  console.log('1. Install Vercel CLI: npm i -g vercel');
  console.log('2. Login to Vercel: vercel login');
  console.log('3. Deploy: vercel --prod');
  
  return vercelConfig;
}

async function setupNetlifyConfig() {
  console.log('\n🌐 Netlify Configuration Setup');
  console.log('==============================');
  
  const siteName = await question('Enter Netlify site name: ');
  
  console.log('✅ Netlify configuration ready');
  console.log('📋 Next steps for Netlify deployment:');
  console.log('1. Install Netlify CLI: npm i -g netlify-cli');
  console.log('2. Login to Netlify: netlify login');
  console.log('3. Deploy: netlify deploy --prod');
  
  return { siteName };
}

async function setupGitHubSecrets(firebaseConfig) {
  console.log('\n🔐 GitHub Secrets Configuration');
  console.log('===============================');
  
  console.log('Add the following secrets to your GitHub repository:');
  console.log('(Go to Settings > Secrets and variables > Actions)');
  console.log('');
  console.log('Required secrets:');
  console.log(`NEXT_PUBLIC_FIREBASE_API_KEY: ${firebaseConfig.apiKey}`);
  console.log(`NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ${firebaseConfig.authDomain}`);
  console.log(`NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${firebaseConfig.projectId}`);
  console.log(`NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: ${firebaseConfig.storageBucket}`);
  console.log(`NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: ${firebaseConfig.messagingSenderId}`);
  console.log(`NEXT_PUBLIC_FIREBASE_APP_ID: ${firebaseConfig.appId}`);
  console.log('GOOGLE_GENAI_API_KEY: [Your Google AI API Key]');
  console.log('');
  console.log('Optional secrets for deployment:');
  console.log('VERCEL_TOKEN: [Your Vercel token]');
  console.log('VERCEL_ORG_ID: [Your Vercel org ID]');
  console.log('VERCEL_PROJECT_ID: [Your Vercel project ID]');
  console.log('LHCI_GITHUB_APP_TOKEN: [Lighthouse CI GitHub token]');
}

async function createDeploymentScript() {
  console.log('\n🚀 Creating Deployment Scripts');
  console.log('==============================');
  
  const deployScript = `#!/bin/bash
# Production Deployment Script

set -e

echo "🔍 Running pre-deployment checks..."

# Type checking
echo "📝 Type checking..."
npm run typecheck

# Linting
echo "🧹 Linting..."
npm run lint

# Testing
echo "🧪 Running tests..."
npm run test:run

# Build
echo "🏗️  Building application..."
npm run build

echo "✅ Pre-deployment checks passed!"
echo "🚀 Ready for deployment!"
`;

  fs.writeFileSync('scripts/deploy.sh', deployScript);
  fs.chmodSync('scripts/deploy.sh', '755');
  
  console.log('✅ Deployment script created: scripts/deploy.sh');
}

async function main() {
  console.log('🏗️  RUDYBTZ Portfolio - Production Setup');
  console.log('========================================');
  console.log('This script will help you configure the production environment.');
  console.log('');
  
  try {
    // Create scripts directory if it doesn't exist
    if (!fs.existsSync('scripts')) {
      fs.mkdirSync('scripts');
    }
    
    const firebaseConfig = await setupFirebaseConfig();
    
    const platform = await question('\nChoose deployment platform (vercel/netlify/both): ');
    
    if (platform === 'vercel' || platform === 'both') {
      await setupVercelConfig(firebaseConfig);
    }
    
    if (platform === 'netlify' || platform === 'both') {
      await setupNetlifyConfig();
    }
    
    await setupGitHubSecrets(firebaseConfig);
    await createDeploymentScript();
    
    console.log('\n🎉 Production setup complete!');
    console.log('===============================');
    console.log('Your application is ready for production deployment.');
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Review the generated configuration files');
    console.log('2. Set up your deployment platform (Vercel/Netlify)');
    console.log('3. Configure GitHub repository secrets');
    console.log('4. Push to main branch to trigger deployment');
    console.log('');
    console.log('📚 Documentation: See docs/deployment-guide.md for detailed instructions');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  setupFirebaseConfig,
  setupVercelConfig,
  setupNetlifyConfig,
  setupGitHubSecrets
};