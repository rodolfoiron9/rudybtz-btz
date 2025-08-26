# Firebase Configuration Guide

## Your Firebase Project Setup

You have successfully created a Firebase project with the following configuration:

- **Project ID**: `rudybtz-portfolio`
- **Hosting URL**: `https://rudybtz--rudybtz-portfolio.asia-east1.hosted.app/`
- **Storage Bucket**: `gs://rudybtz-portfolio.firebasestorage.app`

## Storage Bucket Structure

Your Firebase Storage is organized with the following folders:

### 📁 Storage Buckets Overview

| Bucket | Purpose | File Types | Max Size |
|--------|---------|------------|----------|
| `datasets/` | Training datasets and data files | .json, .csv, .txt, .xml | 100MB |
| `images/` | Album covers, photos, visual content | .jpg, .jpeg, .png, .gif, .webp | 10MB |
| `inspire/` | Reference materials and inspiration | .jpg, .jpeg, .png, .pdf, .txt | 50MB |
| `knowledge/` | Documentation and knowledge base | .md, .txt, .pdf, .docx | 25MB |
| `music/` | Audio files and music content | .mp3, .wav, .flac, .m4a | 500MB |
| `video/` | Video content and multimedia | .mp4, .mov, .avi, .webm | 1GB |

## Required Configuration Steps

### 1. Update Environment Variables

You need to update your `.env` file with your actual Firebase credentials:

```env
# Firebase Configuration (Production)
NEXT_PUBLIC_FIREBASE_API_KEY=your-actual-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=rudybtz-portfolio.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=rudybtz-portfolio
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=rudybtz-portfolio.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false

# Domain Configuration
NEXT_PUBLIC_DOMAIN=rudybtz--rudybtz-portfolio.asia-east1.hosted.app
```

### 2. Get Your Firebase Configuration

To get your actual Firebase configuration:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your `rudybtz-portfolio` project
3. Click on the gear icon (Project Settings)
4. Scroll down to "Your apps" section
5. Click on the web app icon (</>)
6. Copy the configuration values

### 3. Firebase Storage Rules

Make sure your `storage.rules` file allows proper access:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow read access to all files
    match /{allPaths=**} {
      allow read: if true;
    }
    
    // Allow authenticated users to upload to specific folders
    match /images/{filename} {
      allow write: if request.auth != null 
        && request.resource.size < 10 * 1024 * 1024
        && request.resource.contentType.matches('image/.*');
    }
    
    match /music/{filename} {
      allow write: if request.auth != null 
        && request.resource.size < 500 * 1024 * 1024
        && request.resource.contentType.matches('audio/.*');
    }
    
    match /video/{filename} {
      allow write: if request.auth != null 
        && request.resource.size < 1024 * 1024 * 1024
        && request.resource.contentType.matches('video/.*');
    }
    
    // Admin-only access for other folders
    match /{folder}/{filename} {
      allow write: if request.auth != null 
        && request.auth.token.email == 'rodolfoiron@gmail.com';
    }
  }
}
```

### 4. Firestore Database Rules

Update your `firestore.rules` for proper security:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to public collections
    match /albums/{document} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == 'rodolfoiron@gmail.com';
    }
    
    match /tracks/{document} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == 'rodolfoiron@gmail.com';
    }
    
    match /projects/{document} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == 'rodolfoiron@gmail.com';
    }
    
    // Admin-only collections
    match /{collection}/{document} {
      allow read, write: if request.auth != null && request.auth.token.email == 'rodolfoiron@gmail.com';
    }
  }
}
```

## Features Added

### 🔥 Storage Manager Component

I've added a comprehensive Storage Manager to your admin dashboard that allows you to:

- **Upload Files**: Drag and drop or select files for any bucket
- **File Validation**: Automatic validation of file types and sizes
- **View Files**: Preview and download uploaded files
- **Delete Files**: Remove files from storage buckets
- **Batch Operations**: Upload multiple files at once
- **Real-time Updates**: See changes immediately

### 📊 Storage Analytics

The storage manager includes:

- **Usage Statistics**: Track storage usage across buckets
- **File Type Analysis**: See what types of files you're storing
- **Upload Progress**: Real-time upload progress indicators
- **Error Handling**: Comprehensive error messages and validation

## How to Use

### 1. Access Storage Manager

1. Go to your admin dashboard: `/admin`
2. Click on the "Storage" tab
3. Select which bucket you want to manage
4. Upload, view, or manage files

### 2. Upload Files

1. Select the appropriate bucket (e.g., "Images" for album covers)
2. Click "Choose Files" or drag files into the upload area
3. Files will be automatically validated
4. Progress will be shown during upload
5. Files appear in the file list once uploaded

### 3. Organize Content

Use the buckets strategically:

- **images/**: Album covers, artist photos, promotional images
- **music/**: Track files, stems, audio samples
- **video/**: Music videos, behind-the-scenes content
- **datasets/**: Training data for AI features
- **knowledge/**: Documentation, lyrics, press releases
- **inspire/**: Reference materials, mood boards

## Next Steps

1. **Update Environment Variables**: Add your actual Firebase configuration
2. **Deploy Rules**: Update your Firebase security rules
3. **Test Upload**: Try uploading a test image to verify everything works
4. **Organize Content**: Start organizing your existing files into the bucket structure

## Support

If you encounter any issues:

1. Check the browser console for error messages
2. Verify your Firebase configuration is correct
3. Ensure your Firebase project has the Storage service enabled
4. Check that your storage rules allow the operations you're trying to perform

The Storage Manager component is now integrated into your admin dashboard and ready to use with your Firebase project!