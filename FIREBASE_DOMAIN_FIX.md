# Firebase Domain Authorization Guide

## Current Issue
You're trying to access the admin login from:
- `http://192.168.1.166:3000/admin/login` 
- `http://localhost:3001/admin/login`

But your Firebase project only has these authorized domains:
- `localhost` (Default)
- `rudybtz-portfolio.firebaseapp.com` (Default)
- `rudybtz-portfolio.web.app` (Default)
- `rudybtz--rudybtz-portfolio.asia-east1.hosted.app` (Custom)

## Solutions

### Option 1: Add Development Domains to Firebase (Recommended)

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: `rudybtz-portfolio`
3. **Navigate to Authentication** → **Settings** → **Authorized domains**
4. **Click "Add domain"** and add these development domains:
   - `192.168.1.166:3000`
   - `localhost:3001`
   - `127.0.0.1:3001`
   - `192.168.1.166:3001`

### Option 2: Use Localhost on Port 3000 (Quick Fix)

Since `localhost` is already authorized, you can:
1. Stop any process using port 3000: `taskkill /f /im node.exe`
2. Start your app on port 3000: `npm run dev` (default port)
3. Access: `http://localhost:3000/admin/login`

### Option 3: Use Firebase Auth Emulator (Development Only)

Enable the Firebase Auth emulator for local development:
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Initialize emulators: `firebase init emulators`
3. Start emulators: `firebase emulators:start`

## Quick Fix Instructions

### Step 1: Add Domains to Firebase Console
1. Open: https://console.firebase.google.com/project/rudybtz-portfolio/authentication/settings
2. Scroll to "Authorized domains"
3. Click "Add domain"
4. Add: `192.168.1.166:3000`
5. Click "Add domain" again
6. Add: `localhost:3001`
7. Save changes

### Step 2: Test Access
After adding the domains, try accessing:
- `http://192.168.1.166:3000/admin/login`
- `http://localhost:3001/admin/login`

## Alternative: Use Standard Localhost

If you want to use the already-authorized `localhost` domain:

```bash
# Kill any processes on port 3000
netstat -ano | findstr :3000
# Note the PID and kill it: taskkill /f /pid [PID_NUMBER]

# Start on port 3000
npm run dev
```

Then access: `http://localhost:3000/admin/login`

## Troubleshooting

### If you still get auth errors:
1. **Clear browser cache** and cookies
2. **Try incognito/private mode**
3. **Check browser console** for specific error messages
4. **Wait 2-3 minutes** after adding domains (Firebase needs time to propagate)

### Common Error Messages:
- "auth/unauthorized-domain" → Domain not added to Firebase
- "auth/operation-not-allowed" → Google Sign-In not enabled
- "auth/popup-blocked" → Use redirect instead of popup

## Production Domains (Already Working)
- `https://rudybtz-portfolio.firebaseapp.com`
- `https://rudybtz-portfolio.web.app`  
- `https://rudybtz--rudybtz-portfolio.asia-east1.hosted.app`

## Development Domains (Need to Add)
- `http://localhost:3001`
- `http://192.168.1.166:3000`
- `http://192.168.1.166:3001`
- `http://127.0.0.1:3001`

Once you add these development domains to Firebase, your local authentication should work perfectly!