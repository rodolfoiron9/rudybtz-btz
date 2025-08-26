# 🔥 Firebase Setup Guide for RUDYBTZ Portfolio

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name your project: `rudybtz-portfolio`
4. Enable Google Analytics (optional)
5. Create project

## Step 2: Set up Firebase Services

### Firestore Database
1. Go to "Firestore Database" in the sidebar
2. Click "Create database"
3. Choose "Start in test mode" for development
4. Select your region (closest to your users)
5. Create database

### Firebase Storage
1. Go to "Storage" in the sidebar
2. Click "Get started"
3. Start in test mode
4. Choose same region as Firestore
5. Done

### Authentication
1. Go to "Authentication" in the sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Save

## Step 3: Get Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Web app" (</>) icon
4. Register app with name: `rudybtz-portfolio-web`
5. Copy the configuration object

## Step 4: Environment Variables

Create `.env.local` file in your project root:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# AI Integration (Optional - for AI features)
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key
NEXT_PUBLIC_HUGGINGFACE_API_KEY=your_huggingface_key
```

## Step 5: Firestore Security Rules

Go to Firestore → Rules and replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Albums collection
    match /albums/{albumId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Hero slides collection
    match /heroSlides/{slideId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Blog posts collection
    match /blogPosts/{postId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Artist bio collection
    match /artistBio/{entryId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Visualizer presets collection
    match /visualizerPresets/{presetId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Knowledge base collection
    match /knowledgeBase/{entryId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Theme configuration
    match /siteConfig/{configId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Step 6: Storage Security Rules

Go to Storage → Rules and replace with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow read access to all files
    match /{allPaths=**} {
      allow read: if true;
    }
    
    // Allow authenticated users to upload files
    match /album-covers/{allPaths=**} {
      allow write: if request.auth != null;
    }
    
    match /tracks/{allPaths=**} {
      allow write: if request.auth != null;
    }
    
    match /hero-media/{allPaths=**} {
      allow write: if request.auth != null;
    }
    
    match /blog-images/{allPaths=**} {
      allow write: if request.auth != null;
    }
  }
}
```

## Step 7: Create Admin User

1. Go to Authentication → Users
2. Click "Add user"
3. Email: `admin@rudybtz.com` (or your preferred email)
4. Password: Create a strong password
5. Add user

## Step 8: Test Connection

1. Run your development server: `npm run dev`
2. Go to `/admin`
3. Try creating an album or hero slide
4. Check if data appears in Firestore console

## 🎉 You're Ready!

Your Firebase backend is now configured and ready to use with the RUDYBTZ Portfolio admin dashboard.

### Next Steps:
- Test all admin dashboard features
- Upload some sample content
- Set up the public portfolio site
- Add AI integrations

### Troubleshooting:
- If you get auth errors, check your domain is added to authorized domains
- If uploads fail, verify Storage rules are set correctly
- For Firestore errors, ensure your security rules are published