'use client';

import { AudioPlayer } from '@/components/audio-analysis';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Music, Play, BarChart3, Radio } from 'lucide-react';
import Link from 'next/link';

export default function VisualizerDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Music className="w-6 h-6 text-purple-400" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Audio Visualizer Studio
            </h1>
          </div>
          
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Experience your music with real-time audio analysis, waveform visualization, and spectrum analysis.
          </p>
          
          <div className="flex items-center justify-center gap-2">
            <Badge variant="secondary" className="bg-purple-500/10 text-purple-400">
              <Play className="w-3 h-3 mr-1" />
              Real-time
            </Badge>
            <Badge variant="secondary" className="bg-blue-500/10 text-blue-400">
              Web Audio API
            </Badge>
            <Badge variant="secondary" className="bg-violet-500/10 text-violet-400">
              Canvas Based
            </Badge>
          </div>
          
          <div className="pt-4">
            <Link href="/portfolio" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              ← Back to Portfolio
            </Link>
          </div>
        </div>

        {/* Main Audio Player */}
        <Card className="overflow-hidden bg-black/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Radio className="w-5 h-5" />
              Audio Analysis Engine
            </CardTitle>
            <CardDescription className="text-gray-300">
              Upload your audio files and watch the real-time visualization unfold with waveform, spectrum, and circular visualizers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AudioPlayer 
              showVisualizers={true}
              showControls={true}
              autoPlay={false}
              className="w-full"
            />
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-black/50 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                Waveform Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300 mb-4">
                Interactive waveform visualization with seek functionality. Click anywhere on the waveform to jump to that position.
              </p>
              <div className="space-y-2">
                <div className="text-xs text-gray-400">Features:</div>
                <ul className="text-xs text-gray-300 space-y-1">
                  <li>• Real-time waveform generation</li>
                  <li>• Progress tracking</li>
                  <li>• Interactive seeking</li>
                  <li>• Peak visualization</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/50 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                Spectrum Analyzer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300 mb-4">
                Real-time frequency spectrum analysis with peak holds and frequency band visualization.
              </p>
              <div className="space-y-2">
                <div className="text-xs text-gray-400">Features:</div>
                <ul className="text-xs text-gray-300 space-y-1">
                  <li>• 64-band frequency analysis</li>
                  <li>• Peak hold indicators</li>
                  <li>• dB level mapping</li>
                  <li>• Gradient coloring</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/50 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Radio className="w-5 h-5 text-violet-400" />
                Circular Visualizer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300 mb-4">
                360-degree circular audio visualization with beat detection and BPM display.
              </p>
              <div className="space-y-2">
                <div className="text-xs text-gray-400">Features:</div>
                <ul className="text-xs text-gray-300 space-y-1">
                  <li>• 128-bar circular spectrum</li>
                  <li>• Beat detection & BPM</li>
                  <li>• Reactive animations</li>
                  <li>• Color-coded frequencies</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Technical Info */}
        <Card className="bg-black/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white">Technical Implementation</CardTitle>
            <CardDescription className="text-gray-300">
              Built with cutting-edge web technologies for optimal performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-white">Audio Processing</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Web Audio API for real-time analysis</li>
                  <li>• FFT (Fast Fourier Transform) processing</li>
                  <li>• Beat detection algorithms</li>
                  <li>• Audio metadata extraction</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-white">Visualization</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Canvas 2D for high-performance rendering</li>
                  <li>• RequestAnimationFrame optimization</li>
                  <li>• Responsive design with device pixel ratio</li>
                  <li>• Hardware-accelerated graphics</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}