import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-8">
        <h1 className="text-6xl font-bold neon-text">
          RUDYBTZ
        </h1>
        <p className="text-xl text-gray-300">
          AI-Powered Music Portfolio
        </p>
        <div className="space-x-4">
          <Link 
            href="/portfolio" 
            className="inline-block px-6 py-3 bg-violet-600 hover:bg-violet-700 rounded-lg font-semibold transition-colors"
          >
            View Portfolio
          </Link>
          <Link 
            href="/admin" 
            className="inline-block px-6 py-3 border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black rounded-lg font-semibold transition-colors"
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