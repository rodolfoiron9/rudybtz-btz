import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, MapPin, Calendar, Clock, Music, Headphones, Volume2 } from 'lucide-react';
import Image from 'next/image';

export default function LaTripPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0">
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="https://videos.pexels.com/video-files/2278095/2278095-uhd_3840_2160_25fps.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/70 via-pink-900/60 to-orange-900/70" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-6xl px-4">
          <div className="mb-8">
            <Badge className="bg-orange-500 text-black font-bold text-lg px-6 py-2 mb-4">
              EXCLUSIVE EXPERIENCE
            </Badge>
          </div>
          <h1 className="text-3d-silver-violet silver-violet text-6xl md:text-8xl lg:text-9xl font-black tracking-widest mb-6">
            LA TRIP
          </h1>
          <h2 className="text-3d-silver-violet silver-violet text-3xl md:text-5xl font-bold mb-6">
            A Sonic Journey Through Los Angeles
          </h2>
          <p className="text-xl md:text-2xl text-orange-200 mb-8 max-w-4xl mx-auto leading-relaxed">
            Experience the underground electronic scene of LA through an immersive audio-visual journey. 
            Curated beats, exclusive mixes, and hidden gems from the city of angels.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-black font-bold text-lg px-8 py-4">
              <Play className="w-6 h-6 mr-3" />
              Start The Trip
            </Button>
            <Button variant="outline" size="lg" className="border-2 border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-black font-bold text-lg px-8 py-4">
              <Headphones className="w-6 h-6 mr-3" />
              Preview Mix
            </Button>
          </div>
        </div>
      </section>

      {/* Experience Overview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3d-silver-violet silver-violet text-5xl md:text-7xl font-black mb-6">
              THE EXPERIENCE
            </h2>
            <p className="text-xl text-orange-200 max-w-3xl mx-auto leading-relaxed">
              Dive deep into the electronic underground of Los Angeles. Each chapter takes you through 
              different neighborhoods, venues, and sonic landscapes that define the city's nightlife.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Chapter 1 */}
            <Card className="bg-gray-900/50 border-orange-500/30 backdrop-blur-sm">
              <div className="relative h-64">
                <Image
                  src="https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=2070"
                  alt="Downtown LA"
                  fill
                  className="object-cover rounded-t-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-orange-500 text-black font-bold">CHAPTER 01</Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl text-white">Downtown Pulse</CardTitle>
                <CardDescription className="text-orange-200">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Arts District & Downtown LA
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  Industrial beats echo through converted warehouses. Deep house and techno reign supreme 
                  in the concrete jungle of downtown LA.
                </p>
                <div className="flex items-center gap-4 text-sm text-orange-400">
                  <span><Clock className="w-4 h-4 inline mr-1" />45 min</span>
                  <span><Music className="w-4 h-4 inline mr-1" />12 tracks</span>
                </div>
              </CardContent>
            </Card>

            {/* Chapter 2 */}
            <Card className="bg-gray-900/50 border-pink-500/30 backdrop-blur-sm">
              <div className="relative h-64">
                <Image
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070"
                  alt="Hollywood Hills"
                  fill
                  className="object-cover rounded-t-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-pink-500 text-black font-bold">CHAPTER 02</Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl text-white">Hollywood Heights</CardTitle>
                <CardDescription className="text-pink-200">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Hollywood Hills & West Hollywood
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  Glamorous rooftop parties meet underground vibes. Progressive house and melodic techno 
                  with a view of the city lights.
                </p>
                <div className="flex items-center gap-4 text-sm text-pink-400">
                  <span><Clock className="w-4 h-4 inline mr-1" />52 min</span>
                  <span><Music className="w-4 h-4 inline mr-1" />15 tracks</span>
                </div>
              </CardContent>
            </Card>

            {/* Chapter 3 */}
            <Card className="bg-gray-900/50 border-purple-500/30 backdrop-blur-sm">
              <div className="relative h-64">
                <Image
                  src="https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?q=80&w=2070"
                  alt="Venice Beach"
                  fill
                  className="object-cover rounded-t-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-purple-500 text-black font-bold">CHAPTER 03</Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl text-white">Venice Vibes</CardTitle>
                <CardDescription className="text-purple-200">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Venice Beach & Santa Monica
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  Beach house meets underground bass. Chill electronica transitions to heavy drops 
                  as the ocean meets the dance floor.
                </p>
                <div className="flex items-center gap-4 text-sm text-purple-400">
                  <span><Clock className="w-4 h-4 inline mr-1" />38 min</span>
                  <span><Music className="w-4 h-4 inline mr-1" />10 tracks</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Complete Experience */}
          <div className="text-center">
            <Card className="bg-gradient-to-r from-orange-900/30 via-pink-900/30 to-purple-900/30 border-2 border-orange-500/50 backdrop-blur-sm max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="text-4xl text-white mb-4">Complete LA Trip Experience</CardTitle>
                <CardDescription className="text-xl text-orange-200">
                  All three chapters + exclusive bonus content and behind-the-scenes commentary
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-400 mb-2">2h 15min</div>
                    <div className="text-gray-300">Total Runtime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-pink-400 mb-2">37 Tracks</div>
                    <div className="text-gray-300">Curated Selection</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2">Exclusive</div>
                    <div className="text-gray-300">Unreleased Content</div>
                  </div>
                </div>
                <Button size="lg" className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 text-black font-bold text-xl px-12 py-6">
                  <Volume2 className="w-6 h-6 mr-3" />
                  Experience The Full Trip
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Behind The Scenes */}
      <section className="py-20 bg-black/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-black text-white mb-6">
                BEHIND THE MIX
              </h2>
              <p className="text-xl text-orange-200 mb-6 leading-relaxed">
                "LA Trip was born from countless nights exploring the underground electronic scene 
                across Los Angeles. Each location has its own energy, its own sound, its own story."
              </p>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                This isn't just a mixtape - it's a sonic documentary of the city's electronic heartbeat. 
                Recorded live at various venues, featuring exclusive edits and unreleased tracks that 
                capture the essence of each neighborhood's unique vibe.
              </p>
              <Button variant="outline" className="border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-black">
                <Play className="w-5 h-5 mr-2" />
                Watch Behind The Scenes
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-video relative">
                <Image
                  src="https://images.unsplash.com/photo-1571330735066-03aaa9429d89?q=80&w=2070"
                  alt="Studio Session"
                  fill
                  className="object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/20 rounded-lg" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button size="lg" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/50">
                    <Play className="w-8 h-8 text-white" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-orange-500/20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-full flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg">LA TRIP by RUDYBTZ</span>
          </div>
          <p className="text-orange-200/80">
            A sonic journey through the electronic underground of Los Angeles
          </p>
        </div>
      </footer>
    </div>
  );
}