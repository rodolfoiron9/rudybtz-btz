/**
 * Firebase Debug Test Script
 * Run this to test Firebase configuration without App Check
 */

// Simple test to check Firebase config
console.log('🔥 Firebase Debug Test Starting...');

// Check environment variables
console.log('\n📋 Environment Variables:');
console.log('NEXT_PUBLIC_FIREBASE_API_KEY:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing');
console.log('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'Not set');
console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'Not set');
console.log('NEXT_PUBLIC_FIREBASE_APP_CHECK_DEBUG:', process.env.NEXT_PUBLIC_FIREBASE_APP_CHECK_DEBUG || 'Not set');

// Check if we're in browser environment
if (typeof window !== 'undefined') {
  console.log('\n🌐 Browser Environment: ✅');
  console.log('App Check Debug Token:', window.FIREBASE_APPCHECK_DEBUG_TOKEN);
} else {
  console.log('\n🌐 Server Environment: ✅');
}

console.log('\n✅ Firebase Debug Test Complete');