import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-8">
        <h1 className="text-3d-silver-violet silver-violet text-6xl font-bold">
          RUDYBTZ
        </h1>
        <p className="text-xl text-gray-300">
          AI-Powered Music Portfolio
        </p>
        <div className="space-x-4">
          <Link 
            href="/portfolio" 
            className="silver-violet-link nav-3d-silver-violet inline-block px-6 py-3 bg-violet-600 hover:bg-violet-700 rounded-lg font-semibold transition-colors"
          >
            View Portfolio
          </Link>
          <Link 
            href="/admin" 
            className="silver-violet-link nav-3d-silver-violet inline-block px-6 py-3 border border-violet-400 text-violet-400 hover:bg-violet-400 hover:text-black rounded-lg font-semibold transition-colors"
          >
            Admin Dashboard
          </Link>
        </div>
        <div className="mt-12 text-sm text-gray-500">
          <p>Version 2.0 - Complete Rebuild</p>
          <p>Admin Dashboard → AI Content Creation → 3D Visualizer</p>
        </div>
      </div>
    </div>
  );
}