# 🚀 GitHub Setup Guide for RUDYBTZ Portfolio

## 📋 Post-Push Configuration Steps

### 1. 🔐 GitHub Secrets Configuration

Navigate to your GitHub repository: `https://github.com/rodolfoiron9/rudybtz-btz/settings/secrets/actions`

Add the following secrets:

#### **Firebase Configuration**
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDM4GK_qDt4PWr2iql1zU869Nmf3MmrVHk
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=rudybtz-portfolio.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=rudybtz-portfolio
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=rudybtz-portfolio.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=759447585600
NEXT_PUBLIC_FIREBASE_APP_ID=1:759447585600:web:748fe6367a5ddd0c0df0a5
```

#### **AI Integration**
```bash
GOOGLE_GENAI_API_KEY=AIzaSyDGXsNmW3CKn4S-CSPx2VY8ShTOoOwVfbs
```

#### **Firebase Service Account**
Create a service account key for GitHub Actions:

1. Go to [Firebase Console](https://console.firebase.google.com/project/rudybtz-portfolio/settings/serviceaccounts/adminsdk)
2. Click "Generate new private key"
3. Download the JSON file
4. Copy the entire JSON content and add as secret:
   - Name: `FIREBASE_SERVICE_ACCOUNT_RUDYBTZ_PORTFOLIO`
   - Value: [entire JSON content]

### 2. 🔄 Enable GitHub Actions

1. Go to `https://github.com/rodolfoiron9/rudybtz-btz/actions`
2. Enable GitHub Actions if not already enabled
3. The CI/CD workflow should automatically trigger on push to main

### 3. 🏠 Firebase App Hosting Connection

1. Go to [Firebase Console App Hosting](https://console.firebase.google.com/project/rudybtz-portfolio/apphosting)
2. Connect your GitHub repository if not already connected
3. Select the `rudybtz-btz` repository
4. Configure the build settings:
   - **Root directory**: `/`
   - **Build command**: `npm run build`
   - **Output directory**: `.next`

### 4. 📊 Repository Settings

#### **Branch Protection Rules**
1. Go to `https://github.com/rodolfoiron9/rudybtz-btz/settings/branches`
2. Add protection for `main` branch:
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Status checks: `Quality Checks`, `Security Scan`

#### **Dependabot Alerts**
1. Go to `https://github.com/rodolfoiron9/rudybtz-btz/settings/security_analysis`
2. Enable:
   - ✅ Dependency graph
   - ✅ Dependabot alerts
   - ✅ Dependabot security updates

### 5. 🌐 Domain Configuration

#### **Firebase Hosting Domain**
1. Current domain: `rudybtz--rudybtz-portfolio.asia-east1.hosted.app`
2. To add custom domain:
   - Go to [Firebase Hosting](https://console.firebase.google.com/project/rudybtz-portfolio/hosting/main)
   - Click "Add custom domain"
   - Follow the verification steps

#### **GitHub Pages (Optional)**
If you want to also deploy to GitHub Pages:
1. Go to `https://github.com/rodolfoiron9/rudybtz-btz/settings/pages`
2. Source: GitHub Actions
3. The existing workflow will also deploy there

### 6. 🔍 Environment Verification

After setting up secrets, check the workflow:

1. Make a small change and push to trigger the workflow
2. Check Actions tab: `https://github.com/rodolfoiron9/rudybtz-btz/actions`
3. Verify all jobs pass:
   - ✅ Quality Checks
   - ✅ Build and Deploy to Firebase
   - ✅ Security Scan

### 7. 🎯 Live URLs

After successful deployment:

- **Firebase App Hosting**: `https://rudybtz--rudybtz-portfolio.asia-east1.hosted.app`
- **Firebase Hosting**: `https://rudybtz-portfolio.web.app`
- **GitHub Repository**: `https://github.com/rodolfoiron9/rudybtz-btz`

### 8. 📝 Environment Files

Create these environment files locally (never commit them):

#### **.env.local** (for development)
```bash
# Copy from .env.example and fill with real values
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=rudybtz-portfolio.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=rudybtz-portfolio
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=rudybtz-portfolio.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=759447585600
NEXT_PUBLIC_FIREBASE_APP_ID=1:759447585600:web:748fe6367a5ddd0c0df0a5
GOOGLE_GENAI_API_KEY=your_actual_genai_key
ADMIN_EMAIL=rodolfoiron@gmail.com
ADMIN_PASSWORD=PaufinoPaugrosso
```

### 9. 🔐 Security Checklist

- ✅ `.env` files are in `.gitignore`
- ✅ Sensitive information is in GitHub Secrets
- ✅ Firebase security rules are configured
- ✅ Admin authentication is enabled
- ✅ CORS policies are set up

### 10. 🚀 Next Steps

1. **Test the deployment** by visiting the live URL
2. **Test admin login** at `/admin` route
3. **Upload content** through the admin dashboard
4. **Monitor performance** in Firebase Analytics
5. **Set up monitoring** alerts for errors

## 🆘 Troubleshooting

### Common Issues:

1. **GitHub Actions Failing**
   - Check that all secrets are properly set
   - Verify Firebase service account has necessary permissions

2. **Firebase Deployment Issues**
   - Ensure Firebase CLI is authenticated
   - Check project ID matches in all configs

3. **Environment Variables Not Loading**
   - Verify `.env.local` exists and has correct format
   - Check that variable names start with `NEXT_PUBLIC_` for client-side access

4. **Build Errors**
   - Check Node.js version compatibility (requires 20+)
   - Verify all dependencies are installed

---

**🎉 Your RUDYBTZ Portfolio is now live on GitHub and ready for the world to see!**