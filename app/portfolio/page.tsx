import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Play, Clock, ExternalLink, Calendar, MapPin, Users } from 'lucide-react';
import Image from 'next/image';

// Streaming Platform Icons
const SpotifyIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 17.313c-.227 0-.369-.076-.562-.19-1.744-1.03-3.95-1.633-6.188-1.633-1.296 0-2.56.174-3.675.488-.175.05-.301.088-.438.088-.387 0-.7-.312-.7-.699 0-.313.175-.551.438-.65 1.362-.375 2.824-.575 4.375-.575 2.625 0 5.125.688 7.125 1.925.175.112.288.287.288.512 0 .387-.312.734-.663.734zm.899-2.25c-.287 0-.462-.087-.699-.212-1.944-1.138-4.287-1.825-6.888-1.825-1.462 0-2.888.212-4.125.575-.2.063-.35.125-.537.125-.475 0-.85-.375-.85-.85 0-.362.2-.662.5-.787 1.5-.45 3.125-.7 5.012-.7 2.925 0 5.625.725 7.875 2.087.225.138.35.375.35.65 0 .475-.375.937-.638.937zm1.025-2.375c-.325 0-.525-.1-.787-.25-2.15-1.275-5.062-2.013-8.1-2.013-1.625 0-3.188.225-4.625.625-.225.063-.4.138-.612.138-.55 0-1-.45-1-1 0-.4.225-.75.563-.9 1.662-.487 3.512-.762 5.674-.762 3.437 0 6.825.787 9.462 2.275.263.15.425.425.425.725 0 .55-.45 1.162-1 1.162z"/>
  </svg>
);

const AppleMusicIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.997 6.124c0-.738-.065-1.47-.24-2.19-.317-1.31-1.062-2.31-2.18-3.043C21.003.517 20.373.285 19.7.164c-.517-.093-1.038-.135-1.564-.14C17.894.01 17.653 0 17.415 0H6.585c-.238 0-.48.01-.721.024-.526.005-1.047.047-1.564.14-.673.121-1.303.353-1.877.727C1.302 1.624.557 2.624.24 3.934.065 4.654 0 5.386 0 6.124v11.752c0 .738.065 1.47.24 2.19.317 1.31 1.062 2.31 2.183 3.043.574.374 1.204.606 1.877.727.517.093 1.038.135 1.564.14.241.014.483.024.721.024h10.83c.238 0 .48-.01.721-.024.526-.005 1.047-.047 1.564-.14.673-.121 1.303-.353 1.877-.727 1.118-.734 1.863-1.734 2.18-3.043.175-.72.24-1.452.24-2.19V6.124zm-11.455 6.651l2.102-5.726c.098-.268.268-.402.537-.402.268 0 .439.134.537.402l2.102 5.726h-.671l-.504-1.417H13.72l-.504 1.417h-.674zm1.504-2.05h1.896l-.948-2.632-.948 2.632z"/>
  </svg>
);

const YouTubeMusicIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm5.568 16.568A1.216 1.216 0 0 1 16.35 17H7.65a1.216 1.216 0 0 1-1.218-.432A1.194 1.194 0 0 1 6 15.35V8.65c0-.337.138-.65.432-.918A1.216 1.216 0 0 1 7.65 7h8.7c.337 0 .65.138.918.432.294.268.432.581.432.918v6.7c0 .337-.138.65-.432.918zM9.6 10.8v2.4L12.6 12 9.6 10.8z"/>
  </svg>
);

const SoundCloudIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.104.101.104.058 0 .101-.046.108-.104L1.516 14.479l-.233-2.154c-.007-.058-.05-.1-.108-.1zm1.33.638c-.058 0-.1.058-.1.114l-.191 1.192.191 1.192c0 .057.042.114.1.114.057 0 .1-.057.1-.114l.24-1.192-.24-1.192c0-.057-.043-.114-.1-.114zm1.414-.064c-.063 0-.114.051-.114.114l-.179 1.256.179 1.256c0 .063.051.114.114.114.063 0 .114-.051.114-.114l.230-1.256-.230-1.256c0-.063-.051-.114-.114-.114zm1.455-.128c-.064 0-.115.058-.115.128l-.166 1.384.166 1.384c0 .070.051.128.115.128.070 0 .121-.058.121-.128l.204-1.384-.204-1.384c0-.070-.051-.128-.121-.128zm1.495-.051c-.077 0-.14.064-.14.141l-.153 1.435.153 1.435c0 .077.063.141.14.141.077 0 .14-.064.14-.141l.191-1.435-.191-1.435c0-.077-.063-.141-.14-.141zm1.542-.077c-.083 0-.153.07-.153.153l-.14 1.512.14 1.512c0 .083.070.153.153.153.090 0 .159-.070.159-.153l.179-1.512-.179-1.512c0-.083-.070-.153-.159-.153zm1.575-.115c-.096 0-.172.077-.172.172l-.128 1.627.128 1.627c0 .096.076.172.172.172.096 0 .172-.077.172-.172l.166-1.627-.166-1.627c0-.096-.076-.172-.172-.172zm1.608-.153c-.108 0-.198.089-.198.198l-.115 1.78.115 1.78c0 .108.089.198.198.198.115 0 .204-.089.204-.198l.153-1.78-.153-1.78c0-.108-.089-.198-.204-.198zm1.646-.179c-.121 0-.217.096-.217.217l-.102 1.959.102 1.959c0 .121.096.217.217.217.121 0 .217-.096.217-.217l.14-1.959-.14-1.959c0-.121-.096-.217-.217-.217zm1.685-.204c-.133 0-.243.109-.243.243l-.089 2.163.089 2.163c0 .133.109.243.243.243.133 0 .243-.109.243-.243l.128-2.163-.128-2.163c0-.133-.109-.243-.243-.243zm1.712-.25c-.146 0-.268.122-.268.268l-.077 2.413.077 2.413c0 .146.122.268.268.268.153 0 .281-.122.281-.268l.115-2.413-.115-2.413c0-.146-.128-.268-.281-.268zm1.789-.307c-.166 0-.306.14-.306.306l-.064 2.72.064 2.72c0 .166.14.306.306.306.166 0 .306-.14.306-.306l.102-2.72-.102-2.72c0-.166-.14-.306-.306-.306zm1.828-.383c-.179 0-.332.153-.332.332l-.051 3.103.051 3.103c0 .179.153.332.332.332.185 0 .338-.153.338-.332l.09-3.103-.09-3.103c0-.179-.153-.332-.338-.332zm2.189 1.063V15.68c0 .64-.525 1.165-1.165 1.165H8.01c-.11 0-.2-.019-.2-.122V9.178c0-.064.026-.122.077-.154.179-.102.384-.185.602-.243.32-.089.666-.14 1.028-.14 1.433 0 2.687.998 3.055 2.405.23-.115.494-.179.773-.179 1.075 0 1.947.872 1.947 1.947z"/>
  </svg>
);

const BandcampIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M0 12C0 5.373 5.373 0 12 0s12 5.373 12 12-5.373 12-12 12S0 18.627 0 12zm4.615 0l3.846 0-1.923-3.846L4.615 12z"/>
  </svg>
);

const TidalIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.017 6.257L9.33 8.944 6.644 6.257 3.958 8.944l2.686 2.686-2.686 2.687 2.686 2.686 2.686-2.686 2.686 2.686 2.687-2.686-2.687-2.687 2.687-2.686zm7.986 0l-2.687 2.687 2.687 2.686-2.687 2.687 2.687 2.686 2.686-2.686-2.686-2.687 2.686-2.686z"/>
  </svg>
);

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Hero Section - Your Music */}
      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0">
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="https://videos.pexels.com/video-files/3129671/3129671-uhd_3840_2160_30fps.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl px-4">
          <h1 className="text-3d-silver-violet silver-violet text-6xl md:text-8xl lg:text-9xl font-black mb-6 tracking-widest">
            RUDYBTZ
          </h1>
          <h2 className="text-3d-silver-violet silver-violet text-2xl md:text-4xl font-bold mb-4">
            Electronic Music Producer
          </h2>
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Crafting immersive sonic experiences with cutting-edge production
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold">
              <Play className="w-5 h-5 mr-2" />
              Listen Now
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
              <Music className="w-5 h-5 mr-2" />
              View Albums
            </Button>
          </div>

          {/* Streaming Platforms */}
          <div className="mt-12">
            <p className="text-white/80 mb-6 text-lg">Available on all major platforms:</p>
            <div className="flex flex-wrap justify-center gap-6">
              <a href="#" className="text-green-500 hover:text-green-400 transition-colors flex items-center gap-2 group" aria-label="Listen on Spotify" title="Listen on Spotify">
                <SpotifyIcon />
                <span className="text-white group-hover:text-green-400 transition-colors">Spotify</span>
              </a>
              <a href="#" className="text-white hover:text-gray-300 transition-colors flex items-center gap-2 group" aria-label="Listen on Apple Music" title="Listen on Apple Music">
                <AppleMusicIcon />
                <span className="text-white group-hover:text-gray-300 transition-colors">Apple Music</span>
              </a>
              <a href="#" className="text-red-500 hover:text-red-400 transition-colors flex items-center gap-2 group" aria-label="Listen on YouTube Music" title="Listen on YouTube Music">
                <YouTubeMusicIcon />
                <span className="text-white group-hover:text-red-400 transition-colors">YouTube Music</span>
              </a>
              <a href="#" className="text-orange-500 hover:text-orange-400 transition-colors flex items-center gap-2 group" aria-label="Listen on SoundCloud" title="Listen on SoundCloud">
                <SoundCloudIcon />
                <span className="text-white group-hover:text-orange-400 transition-colors">SoundCloud</span>
              </a>
              <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-2 group" aria-label="Listen on Bandcamp" title="Listen on Bandcamp">
                <BandcampIcon />
                <span className="text-white group-hover:text-cyan-300 transition-colors">Bandcamp</span>
              </a>
              <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2 group" aria-label="Listen on Tidal" title="Listen on Tidal">
                <TidalIcon />
                <span className="text-white group-hover:text-blue-300 transition-colors">Tidal</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Albums Section - Your Discography */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
              DISCOGRAPHY
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Explore the sonic journeys crafted by RUDYBTZ. Each album is a unique universe of sound, 
              blending electronic elements with cutting-edge production techniques.
            </p>
          </div>

          <div className="space-y-16">
            {/* Album 1 */}
            <Card className="overflow-hidden bg-gray-800/50 border-gray-700">
              <div className="grid md:grid-cols-2">
                <div className="relative aspect-square">
                  <Image
                    src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=2070"
                    alt="Neon Horizons album cover"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-8">
                  <div className="mb-6">
                    <h3 className="text-3xl font-bold text-white mb-2">Neon Horizons</h3>
                    <p className="text-xl text-cyan-400 font-semibold">2024</p>
                  </div>
                  <div className="space-y-3 mb-8">
                    <div className="flex justify-between items-center p-3 rounded bg-gray-700/50">
                      <span className="text-white">01. Digital Dreams</span>
                      <span className="text-gray-400">4:23</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded bg-gray-700/50">
                      <span className="text-white">02. Cyber City</span>
                      <span className="text-gray-400">3:45</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded bg-gray-700/50">
                      <span className="text-white">03. Electric Soul</span>
                      <span className="text-gray-400">5:12</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded bg-gray-700/50">
                      <span className="text-white">04. Future Funk</span>
                      <span className="text-gray-400">4:08</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded bg-gray-700/50">
                      <span className="text-white">05. Neon Lights</span>
                      <span className="text-gray-400">3:56</span>
                    </div>
                  </div>
                  <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold">
                    <Play className="w-4 h-4 mr-2" />
                    Play Album
                  </Button>
                  
                  {/* Streaming Links for Album */}
                  <div className="mt-4 pt-4 border-t border-gray-600">
                    <p className="text-gray-300 text-sm mb-3">Listen on:</p>
                    <div className="flex flex-wrap gap-3">
                      <a href="#" className="text-green-500 hover:text-green-400 transition-colors">
                        <SpotifyIcon />
                      </a>
                      <a href="#" className="text-white hover:text-gray-300 transition-colors">
                        <AppleMusicIcon />
                      </a>
                      <a href="#" className="text-red-500 hover:text-red-400 transition-colors">
                        <YouTubeMusicIcon />
                      </a>
                      <a href="#" className="text-orange-500 hover:text-orange-400 transition-colors">
                        <SoundCloudIcon />
                      </a>
                      <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                        <BandcampIcon />
                      </a>
                      <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                        <TidalIcon />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Album 2 */}
            <Card className="overflow-hidden bg-gray-800/50 border-gray-700">
              <div className="grid md:grid-cols-2">
                <div className="p-8 md:order-2">
                  <div className="mb-6">
                    <h3 className="text-3xl font-bold text-white mb-2">Quantum Beats</h3>
                    <p className="text-xl text-cyan-400 font-semibold">2023</p>
                  </div>
                  <div className="space-y-3 mb-8">
                    <div className="flex justify-between items-center p-3 rounded bg-gray-700/50">
                      <span className="text-white">01. Particle Wave</span>
                      <span className="text-gray-400">4:45</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded bg-gray-700/50">
                      <span className="text-white">02. Frequency Shift</span>
                      <span className="text-gray-400">3:28</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded bg-gray-700/50">
                      <span className="text-white">03. Quantum Entanglement</span>
                      <span className="text-gray-400">6:15</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded bg-gray-700/50">
                      <span className="text-white">04. Binary Code</span>
                      <span className="text-gray-400">4:02</span>
                    </div>
                  </div>
                  <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold">
                    <Play className="w-4 h-4 mr-2" />
                    Play Album
                  </Button>
                  
                  {/* Streaming Links for Album */}
                  <div className="mt-4 pt-4 border-t border-gray-600">
                    <p className="text-gray-300 text-sm mb-3">Listen on:</p>
                    <div className="flex flex-wrap gap-3">
                      <a href="#" className="text-green-500 hover:text-green-400 transition-colors">
                        <SpotifyIcon />
                      </a>
                      <a href="#" className="text-white hover:text-gray-300 transition-colors">
                        <AppleMusicIcon />
                      </a>
                      <a href="#" className="text-red-500 hover:text-red-400 transition-colors">
                        <YouTubeMusicIcon />
                      </a>
                      <a href="#" className="text-orange-500 hover:text-orange-400 transition-colors">
                        <SoundCloudIcon />
                      </a>
                      <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                        <BandcampIcon />
                      </a>
                      <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                        <TidalIcon />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="relative aspect-square md:order-1">
                  <Image
                    src="https://images.unsplash.com/photo-1571330735066-03aaa9429d89?q=80&w=2070"
                    alt="Quantum Beats album cover"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Bio Section - Your Story */}
      <section className="py-20 bg-black/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
                ABOUT THE ARTIST
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Discover the journey behind the sound, the vision driving the music, 
                and the technology shaping the future of electronic production.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-start">
              {/* Artist Profile */}
              <div className="space-y-8">
                <div className="relative w-64 h-64 mx-auto lg:mx-0">
                  <Image
                    src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=500&h=500&fit=crop"
                    alt="RUDYBTZ Artist Photo"
                    fill
                    className="object-cover rounded-full border-4 border-cyan-400"
                  />
                </div>

                <div className="text-center lg:text-left">
                  <h3 className="text-3xl font-bold text-white mb-4">RUDYBTZ</h3>
                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    Digital music producer and AI enthusiast pushing the boundaries of audio technology. 
                    Combining traditional music production with cutting-edge AI and real-time analysis 
                    to create immersive sonic experiences.
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    Specializing in electronic music that bridges the gap between human creativity 
                    and artificial intelligence, creating soundscapes that are both emotionally 
                    resonant and technologically innovative.
                  </p>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-white text-center lg:text-left">
                  Musical Journey
                </h3>
                
                <div className="space-y-6">
                  <div className="border-l-2 border-cyan-400 pl-6">
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <span className="text-cyan-400 font-bold text-lg">2024</span>
                      <h4 className="text-white font-semibold mb-2">Innovation Era</h4>
                      <p className="text-gray-300">Pioneering AI-assisted music production techniques</p>
                    </div>
                  </div>
                  
                  <div className="border-l-2 border-cyan-400 pl-6">
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <span className="text-cyan-400 font-bold text-lg">2023</span>
                      <h4 className="text-white font-semibold mb-2">Studio Album</h4>
                      <p className="text-gray-300">Released critically acclaimed album "Quantum Beats"</p>
                    </div>
                  </div>
                  
                  <div className="border-l-2 border-cyan-400 pl-6">
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <span className="text-cyan-400 font-bold text-lg">2022</span>
                      <h4 className="text-white font-semibold mb-2">International Recognition</h4>
                      <p className="text-gray-300">Performed at major electronic music festivals across Europe</p>
                    </div>
                  </div>
                  
                  <div className="border-l-2 border-cyan-400 pl-6">
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <span className="text-cyan-400 font-bold text-lg">2021</span>
                      <h4 className="text-white font-semibold mb-2">Breakthrough Year</h4>
                      <p className="text-gray-300">Featured on Spotify's Electronic Rising playlist</p>
                    </div>
                  </div>
                  
                  <div className="border-l-2 border-cyan-400 pl-6">
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <span className="text-cyan-400 font-bold text-lg">2020</span>
                      <h4 className="text-white font-semibold mb-2">Digital Debut</h4>
                      <p className="text-gray-300">Debut single "Digital Dreams" launched on all major platforms</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-16">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold">
                  Get In Touch
                </Button>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
                  <ExternalLink className="w-5 h-5 mr-2" />
                  View Press Kit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-800/50">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg">RUDYBTZ</span>
          </div>
          <p className="text-gray-400">
            © 2025 RUDYBTZ. Electronic Music Producer & AI Innovator.
          </p>
        </div>
      </footer>
    </div>
  );
}