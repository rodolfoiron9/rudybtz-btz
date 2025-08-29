import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Award, Users, Music, Headphones, Mic, Zap } from 'lucide-react';
import Image from 'next/image';

export default function BioPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-cyan-900">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1571330735066-03aaa9429d89?q=80&w=2070"
            alt="Artist in studio"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/80 via-blue-900/70 to-cyan-900/80" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-6xl px-4">
          <div className="mb-8">
            <Badge className="bg-cyan-400 text-black font-bold text-lg px-6 py-2 mb-4">
              ARTIST BIOGRAPHY
            </Badge>
          </div>
          <h1 className="text-3d-silver-violet silver-violet text-6xl md:text-8xl lg:text-9xl font-black tracking-widest mb-6">
            RUDYBTZ
          </h1>
          <h2 className="text-3d-silver-violet silver-violet text-3xl md:text-5xl font-bold mb-6">
            Electronic Music Producer & AI Pioneer
          </h2>
          <p className="text-xl md:text-2xl text-cyan-200 mb-8 max-w-4xl mx-auto leading-relaxed">
            Bridging the gap between human creativity and artificial intelligence, crafting immersive 
            sonic experiences that push the boundaries of electronic music production.
          </p>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 -mt-20 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="bg-gray-900/80 border-cyan-500/30 backdrop-blur-sm text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-cyan-400 mb-2">5+</div>
                <div className="text-gray-300">Years Active</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900/80 border-blue-500/30 backdrop-blur-sm text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-blue-400 mb-2">12</div>
                <div className="text-gray-300">Studio Albums</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900/80 border-indigo-500/30 backdrop-blur-sm text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-indigo-400 mb-2">2M+</div>
                <div className="text-gray-300">Streams</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900/80 border-purple-500/30 backdrop-blur-sm text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-purple-400 mb-2">50+</div>
                <div className="text-gray-300">Live Shows</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* The Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3d-silver-violet silver-violet text-5xl md:text-7xl font-black text-center mb-16">
              THE STORY
            </h2>
            
            <div className="space-y-12">
              {/* Early Days */}
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-3xl font-bold text-cyan-400 mb-6">The Beginning</h3>
                  <p className="text-lg text-gray-300 mb-4 leading-relaxed">
                    It all started in a small bedroom studio in 2020, armed with nothing but a laptop, 
                    a pair of headphones, and an insatiable curiosity for electronic sound design. 
                    What began as late-night experiments with synthesizers and drum machines quickly 
                    evolved into a passion for creating immersive sonic landscapes.
                  </p>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    The early tracks were raw, experimental, and deeply personal - capturing the energy 
                    of a generation discovering new ways to express themselves through technology.
                  </p>
                </div>
                <div className="relative">
                  <Image
                    src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=2070"
                    alt="Early studio setup"
                    width={600}
                    height={400}
                    className="rounded-lg object-cover"
                  />
                </div>
              </div>

              {/* Evolution */}
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="lg:order-2">
                  <h3 className="text-3xl font-bold text-blue-400 mb-6">The Evolution</h3>
                  <p className="text-lg text-gray-300 mb-4 leading-relaxed">
                    By 2022, the sound had evolved dramatically. Incorporating AI-assisted production 
                    techniques and real-time audio analysis, RUDYBTZ began pushing the boundaries of 
                    what electronic music could be. The integration of machine learning algorithms 
                    with traditional composition methods created a unique signature sound.
                  </p>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    This period saw the release of breakthrough tracks that caught the attention of 
                    major streaming platforms and electronic music blogs worldwide.
                  </p>
                </div>
                <div className="lg:order-1 relative">
                  <Image
                    src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070"
                    alt="Modern studio setup"
                    width={600}
                    height={400}
                    className="rounded-lg object-cover"
                  />
                </div>
              </div>

              {/* Present Day */}
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-3xl font-bold text-indigo-400 mb-6">The Present</h3>
                  <p className="text-lg text-gray-300 mb-4 leading-relaxed">
                    Today, RUDYBTZ stands at the forefront of AI-assisted music production, 
                    creating not just songs, but entire sonic experiences that adapt and evolve 
                    in real-time. The latest albums feature tracks that use machine learning to 
                    analyze listener behavior and adjust their arrangements accordingly.
                  </p>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    From intimate venue performances to major festival stages, the live shows 
                    have become legendary for their innovative use of technology and audience 
                    interaction.
                  </p>
                </div>
                <div className="relative">
                  <Image
                    src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070"
                    alt="Live performance"
                    width={600}
                    height={400}
                    className="rounded-lg object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-black/30">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl md:text-7xl font-black text-white text-center mb-16">
            CAREER TIMELINE
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {/* 2025 */}
              <div className="border-l-4 border-cyan-400 pl-8">
                <Card className="bg-gray-900/50 border-cyan-400/30">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-2">
                      <Badge className="bg-cyan-400 text-black font-bold">2025</Badge>
                      <h3 className="text-2xl font-bold text-white">AI Innovation Era</h3>
                    </div>
                    <CardDescription className="text-cyan-200">
                      Pioneering the future of electronic music production
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-cyan-400" />
                        Released "Neural Landscapes" - first fully AI-collaborative album
                      </li>
                      <li className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-cyan-400" />
                        Featured in Electronic Music Magazine's "Innovators of the Year"
                      </li>
                      <li className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-cyan-400" />
                        Launched interactive live streaming platform
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* 2024 */}
              <div className="border-l-4 border-blue-400 pl-8">
                <Card className="bg-gray-900/50 border-blue-400/30">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-2">
                      <Badge className="bg-blue-400 text-black font-bold">2024</Badge>
                      <h3 className="text-2xl font-bold text-white">Breakthrough Year</h3>
                    </div>
                    <CardDescription className="text-blue-200">
                      Major label recognition and international acclaim
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-center gap-2">
                        <Music className="w-4 h-4 text-blue-400" />
                        "Neon Horizons" album reached #1 on electronic charts
                      </li>
                      <li className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-400" />
                        European tour - 15 cities, 30,000+ attendees
                      </li>
                      <li className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-blue-400" />
                        Won "Best Electronic Artist" at Underground Music Awards
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* 2023 */}
              <div className="border-l-4 border-indigo-400 pl-8">
                <Card className="bg-gray-900/50 border-indigo-400/30">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-2">
                      <Badge className="bg-indigo-400 text-black font-bold">2023</Badge>
                      <h3 className="text-2xl font-bold text-white">Technical Evolution</h3>
                    </div>
                    <CardDescription className="text-indigo-200">
                      Integration of AI and machine learning in production
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-center gap-2">
                        <Headphones className="w-4 h-4 text-indigo-400" />
                        Released "Quantum Beats" - first AI-assisted album
                      </li>
                      <li className="flex items-center gap-2">
                        <Mic className="w-4 h-4 text-indigo-400" />
                        Developed custom AI production tools
                      </li>
                      <li className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-indigo-400" />
                        Collaborated with tech companies on music AI research
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* 2022 */}
              <div className="border-l-4 border-purple-400 pl-8">
                <Card className="bg-gray-900/50 border-purple-400/30">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-2">
                      <Badge className="bg-purple-400 text-black font-bold">2022</Badge>
                      <h3 className="text-2xl font-bold text-white">Recognition</h3>
                    </div>
                    <CardDescription className="text-purple-200">
                      International performances and streaming success
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-purple-400" />
                        Performed at Coachella and Burning Man
                      </li>
                      <li className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-purple-400" />
                        Reached 1 million monthly Spotify listeners
                      </li>
                      <li className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-purple-400" />
                        First international tour across Asia
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* 2020-2021 */}
              <div className="border-l-4 border-pink-400 pl-8">
                <Card className="bg-gray-900/50 border-pink-400/30">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-2">
                      <Badge className="bg-pink-400 text-black font-bold">2020-2021</Badge>
                      <h3 className="text-2xl font-bold text-white">The Foundation</h3>
                    </div>
                    <CardDescription className="text-pink-200">
                      Beginning of the journey and first releases
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-center gap-2">
                        <Music className="w-4 h-4 text-pink-400" />
                        First single "Digital Dreams" released
                      </li>
                      <li className="flex items-center gap-2">
                        <Headphones className="w-4 h-4 text-pink-400" />
                        Built home studio and began serious production
                      </li>
                      <li className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-pink-400" />
                        Gained initial following on SoundCloud and YouTube
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl md:text-7xl font-black text-white mb-12">
              ARTISTIC PHILOSOPHY
            </h2>
            <Card className="bg-gradient-to-r from-indigo-900/50 via-blue-900/50 to-cyan-900/50 border-2 border-cyan-400/50 backdrop-blur-sm">
              <CardContent className="p-12">
                <blockquote className="text-2xl md:text-3xl text-cyan-200 font-light leading-relaxed mb-8">
                  "Music is the bridge between human emotion and technological possibility. 
                  Every track is an experiment in pushing boundaries, exploring the unknown, 
                  and creating something that has never existed before."
                </blockquote>
                <p className="text-xl text-gray-300 leading-relaxed">
                  My approach combines traditional musicality with cutting-edge technology, 
                  always asking: What happens when human creativity meets artificial intelligence? 
                  The answer lies in the music itself - constantly evolving, always surprising, 
                  forever pushing the boundaries of what electronic music can be.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-cyan-500/20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg">RUDYBTZ</span>
          </div>
          <p className="text-cyan-200/80">
            Electronic Music Producer & AI Pioneer
          </p>
        </div>
      </footer>
    </div>
  );
}