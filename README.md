# 🎵 RUDYBTZ Portfolio

> **A modern, full-stack music portfolio showcasing albums, bio, and interactive 3D visualizations**

[![Deploy Status](https://github.com/rodolfoiron9/rudybtz-btz/workflows/CI/CD%20Pipeline/badge.svg)](https://github.com/rodolfoiron9/rudybtz-btz/actions)
[![Live Demo](https://img.shields.io/badge/demo-live-green.svg)](https://rudybtz--rudybtz-portfolio.asia-east1.hosted.app)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)

## ✨ Features

### 🎨 **Modern Design**
- **Glassmorphism UI** with Tailwind CSS
- **Responsive Layout** for all devices
- **Dark/Light Theme** support
- **Smooth Animations** with Framer Motion

### 🎵 **Music Portfolio**
- **Album Showcase** with dynamic covers
- **Interactive Audio Player** with controls
- **Track Listings** and metadata
- **Release Timeline** visualization

### 🎭 **Interactive Elements**
- **3D Audio Visualizer** with React Three Fiber
- **Real-time Audio Analysis** with Web Audio API
- **Particle Effects** and dynamic backgrounds
- **Floating Visualizer** components

### 🔐 **Admin Dashboard**
- **Content Management** for albums and bio
- **Firebase Authentication** integration
- **Real-time Updates** with Firestore
- **Media Upload** capabilities

### ⚡ **Performance**
- **Next.js 15** with App Router
- **Image Optimization** with external sources
- **Lazy Loading** for components
- **Performance Monitoring** built-in

## 🚀 Tech Stack

### **Frontend**
- [Next.js 15](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Radix UI](https://www.radix-ui.com/) - Component primitives
- [Framer Motion](https://www.framer.com/motion/) - Animations

### **3D & Audio**
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) - 3D rendering
- [Three.js](https://threejs.org/) - 3D graphics
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) - Audio processing

### **Backend & Database**
- [Firebase](https://firebase.google.com/) - Backend as a Service
- [Firestore](https://firebase.google.com/docs/firestore) - NoSQL database
- [Firebase Storage](https://firebase.google.com/docs/storage) - File storage
- [Firebase Auth](https://firebase.google.com/docs/auth) - Authentication

### **DevOps & Deployment**
- [Firebase App Hosting](https://firebase.google.com/docs/app-hosting) - Deployment
- [GitHub Actions](https://github.com/features/actions) - CI/CD
- [ESLint](https://eslint.org/) - Code linting
- [Prettier](https://prettier.io/) - Code formatting

## 🛠️ Installation

### **Prerequisites**
- Node.js 20+ 
- npm or yarn
- Firebase CLI
- Git

### **Clone Repository**
```bash
git clone https://github.com/rodolfoiron9/rudybtz-btz.git
cd rudybtz-btz
```

### **Install Dependencies**
```bash
npm install
```

### **Environment Setup**
```bash
# Copy environment template
cp .env.example .env.local

# Add your Firebase configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### **Firebase Setup**
```bash
# Login to Firebase
firebase login

# Initialize project (if needed)
firebase init

# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy storage rules  
firebase deploy --only storage
```

### **Development Server**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the result.

## 📱 Usage

### **Admin Dashboard**
1. Navigate to `/admin`
2. Login with Firebase Authentication
3. Manage albums, bio, and content
4. Upload media files to Firebase Storage

### **Portfolio Features**
- **Home**: Hero section with latest releases
- **Portfolio**: Complete album showcase
- **Visualizer**: Interactive 3D audio experience
- **Bio**: Artist information and background

### **3D Visualizer**
- Upload audio files or use demo tracks
- Choose from multiple visualization presets
- Real-time frequency analysis
- Interactive 3D particle effects

## 🔧 Configuration

### **Firebase Configuration**
```typescript
// lib/firebase.ts
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};
```

### **Next.js Configuration**
```typescript
// next.config.ts
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      }
    ]
  }
};
```

## 🚀 Deployment

### **Automatic Deployment**
Push to `main` branch triggers automatic deployment via GitHub Actions:

```bash
git add .
git commit -m "feat: add new feature"
git push origin main
```

### **Manual Deployment**
```bash
# Build the application
npm run build

# Deploy to Firebase
firebase deploy
```

## 🧪 Testing

### **Run Tests**
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:coverage
```

### **Linting**
```bash
# ESLint
npm run lint

# Type checking
npm run type-check
```

## 📊 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Image Optimization**: WebP/AVIF formats
- **Lazy Loading**: Components and images
- **Caching**: Static assets and API responses
- **Bundle Size**: Optimized with tree shaking

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**RUDYBTZ** - Music Producer & Developer
- Website: [rudybtz--rudybtz-portfolio.asia-east1.hosted.app](https://rudybtz--rudybtz-portfolio.asia-east1.hosted.app)
- GitHub: [@rodolfoiron9](https://github.com/rodolfoiron9)
- Email: rodolfoiron@gmail.com

## 🙏 Acknowledgments

- **Firebase Team** - For the amazing backend platform
- **Vercel Team** - For Next.js and development tools
- **React Three Fiber** - For 3D graphics capabilities
- **Unsplash** - For beautiful stock photography
- **Radix UI** - For accessible component primitives

---

**⭐ Star this repository if you found it helpful!**
