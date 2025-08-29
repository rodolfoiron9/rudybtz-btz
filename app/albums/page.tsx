import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Clock, Calendar, Music, Headphones, Star, Download, Share, Heart } from 'lucide-react';
import Image from 'next/image';

// Streaming Platform Icons (reusing from portfolio)
const SpotifyIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 17.313c-.227 0-.369-.076-.562-.19-1.744-1.03-3.95-1.633-6.188-1.633-1.296 0-2.56.174-3.675.488-.175.05-.301.088-.438.088-.387 0-.7-.312-.7-.699 0-.313.175-.551.438-.65 1.362-.375 2.824-.575 4.375-.575 2.625 0 5.125.688 7.125 1.925.175.112.288.287.288.512 0 .387-.312.734-.663.734zm.899-2.25c-.287 0-.462-.087-.699-.212-1.944-1.138-4.287-1.825-6.888-1.825-1.462 0-2.888.212-4.125.575-.2.063-.35.125-.537.125-.475 0-.85-.375-.85-.85 0-.362.2-.662.5-.787 1.5-.45 3.125-.7 5.012-.7 2.925 0 5.625.725 7.875 2.087.225.138.35.375.35.65 0 .475-.375.937-.638.937zm1.025-2.375c-.325 0-.525-.1-.787-.25-2.15-1.275-5.062-2.013-8.1-2.013-1.625 0-3.188.225-4.625.625-.225.063-.4.138-.612.138-.55 0-1-.45-1-1 0-.4.225-.75.563-.9 1.662-.487 3.512-.762 5.674-.762 3.437 0 6.825.787 9.462 2.275.263.15.425.425.425.725 0 .55-.45 1.162-1 1.162z"/>
  </svg>
);

const AppleMusicIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.997 6.124c0-.738-.065-1.47-.24-2.19-.317-1.31-1.062-2.31-2.18-3.043C21.003.517 20.373.285 19.7.164c-.517-.093-1.038-.135-1.564-.14C17.894.01 17.653 0 17.415 0H6.585c-.238 0-.48.01-.721.024-.526.005-1.047.047-1.564.14-.673.121-1.303.353-1.877.727C1.302 1.624.557 2.624.24 3.934.065 4.654 0 5.386 0 6.124v11.752c0 .738.065 1.47.24 2.19.317 1.31 1.062 2.31 2.183 3.043.574.374 1.204.606 1.877.727.517.093 1.038.135 1.564.14.241.014.483.024.721.024h10.83c.238 0 .48-.01.721-.024.526-.005 1.047-.047 1.564-.14.673-.121 1.303-.353 1.877-.727 1.118-.734 1.863-1.734 2.18-3.043.175-.72.24-1.452.24-2.19V6.124zm-11.455 6.651l2.102-5.726c.098-.268.268-.402.537-.402.268 0 .439.134.537.402l2.102 5.726h-.671l-.504-1.417H13.72l-.504 1.417h-.674zm1.504-2.05h1.896l-.948-2.632-.948 2.632z"/>
  </svg>
);

const YouTubeMusicIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm5.568 16.568A1.216 1.216 0 0 1 16.35 17H7.65a1.216 1.216 0 0 1-1.218-.432A1.194 1.194 0 0 1 6 15.35V8.65c0-.337.138-.65.432-.918A1.216 1.216 0 0 1 7.65 7h8.7c.337 0 .65.138.918.432.294.268.432.581.432.918v6.7c0 .337-.138.65-.432.918zM9.6 10.8v2.4L12.6 12 9.6 10.8z"/>
  </svg>
);

const SoundCloudIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.104.101.104.058 0 .101-.046.108-.104L1.516 14.479l-.233-2.154c-.007-.058-.05-.1-.108-.1zm1.33.638c-.058 0-.1.058-.1.114l-.191 1.192.191 1.192c0 .057.042.114.1.114.057 0 .1-.057.1-.114l.24-1.192-.24-1.192c0-.057-.043-.114-.1-.114zm1.414-.064c-.063 0-.114.051-.114.114l-.179 1.256.179 1.256c0 .063.051.114.114.114.063 0 .114-.051.114-.114l.230-1.256-.230-1.256c0-.063-.051-.114-.114-.114zm1.455-.128c-.064 0-.115.058-.115.128l-.166 1.384.166 1.384c0 .070.051.128.115.128.070 0 .121-.058.121-.128l.204-1.384-.204-1.384c0-.070-.051-.128-.121-.128zm1.495-.051c-.077 0-.14.064-.14.141l-.153 1.435.153 1.435c0 .077.063.141.14.141.077 0 .14-.064.14-.141l.191-1.435-.191-1.435c0-.077-.063-.141-.14-.141zm1.542-.077c-.083 0-.153.07-.153.153l-.14 1.512.14 1.512c0 .083.070.153.153.153.090 0 .159-.070.159-.153l.179-1.512-.179-1.512c0-.083-.070-.153-.159-.153zm1.575-.115c-.096 0-.172.077-.172.172l-.128 1.627.128 1.627c0 .096.076.172.172.172.096 0 .172-.077.172-.172l.166-1.627-.166-1.627c0-.096-.076-.172-.172-.172zm1.608-.153c-.108 0-.198.089-.198.198l-.115 1.78.115 1.78c0 .108.089.198.198.198.115 0 .204-.089.204-.198l.153-1.78-.153-1.78c0-.108-.089-.198-.204-.198zm1.646-.179c-.121 0-.217.096-.217.217l-.102 1.959.102 1.959c0 .121.096.217.217.217.121 0 .217-.096.217-.217l.14-1.959-.14-1.959c0-.121-.096-.217-.217-.217zm1.685-.204c-.133 0-.243.109-.243.243l-.089 2.163.089 2.163c0 .133.109.243.243.243.133 0 .243-.109.243-.243l.128-2.163-.128-2.163c0-.133-.109-.243-.243-.243zm1.712-.25c-.146 0-.268.122-.268.268l-.077 2.413.077 2.413c0 .146.122.268.268.268.153 0 .281-.122.281-.268l.115-2.413-.115-2.413c0-.146-.128-.268-.281-.268zm1.789-.307c-.166 0-.306.14-.306.306l-.064 2.72.064 2.72c0 .166.14.306.306.306.166 0 .306-.14.306-.306l.102-2.72-.102-2.72c0-.166-.14-.306-.306-.306zm1.828-.383c-.179 0-.332.153-.332.332l-.051 3.103.051 3.103c0 .179.153.332.332.332.185 0 .338-.153.338-.332l.09-3.103-.09-3.103c0-.179-.153-.332-.338-.332zm2.189 1.063V15.68c0 .64-.525 1.165-1.165 1.165H8.01c-.11 0-.2-.019-.2-.122V9.178c0-.064.026-.122.077-.154.179-.102.384-.185.602-.243.32-.089.666-.14 1.028-.14 1.433 0 2.687.998 3.055 2.405.23-.115.494-.179.773-.179 1.075 0 1.947.872 1.947 1.947z"/>
  </svg>
);

export default function AlbumsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-fuchsia-900">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=2070"
            alt="Albums collection"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-violet-900/90 via-purple-900/80 to-fuchsia-900/90" />
        </div>

        <div className="relative z-10 text-center max-w-4xl px-4">
          <Badge className="bg-fuchsia-400 text-black font-bold text-lg px-6 py-2 mb-4">
            COMPLETE DISCOGRAPHY
          </Badge>
          <h1 className="text-3d-silver-violet silver-violet text-5xl md:text-7xl font-black mb-4">
            ALBUMS
          </h1>
          <p className="text-xl text-fuchsia-200 max-w-2xl mx-auto">
            Explore the complete collection of RUDYBTZ releases, from groundbreaking debuts to chart-topping hits
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <Card className="bg-gray-900/50 border-violet-500/30 backdrop-blur-sm text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-violet-400 mb-2">12</div>
                <div className="text-gray-300">Studio Albums</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900/50 border-purple-500/30 backdrop-blur-sm text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-purple-400 mb-2">156</div>
                <div className="text-gray-300">Total Tracks</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900/50 border-fuchsia-500/30 backdrop-blur-sm text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-fuchsia-400 mb-2">2.8M</div>
                <div className="text-gray-300">Total Streams</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900/50 border-pink-500/30 backdrop-blur-sm text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-pink-400 mb-2">35hrs</div>
                <div className="text-gray-300">Total Runtime</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Latest Release */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-8 text-center">Latest Release</h2>
            <Card className="overflow-hidden bg-gray-900/50 border-violet-500/30 backdrop-blur-sm">
              <div className="grid lg:grid-cols-2">
                <div className="relative aspect-square">
                  <Image
                    src="https://images.unsplash.com/photo-1571330735066-03aaa9429d89?q=80&w=2070"
                    alt="Neural Landscapes album cover"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-violet-500 text-black font-bold">NEW RELEASE</Badge>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <Button size="lg" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/50 rounded-full">
                      <Play className="w-8 h-8 text-white" />
                    </Button>
                  </div>
                </div>
                <div className="p-8">
                  <div className="mb-6">
                    <h3 className="text-4xl font-bold text-white mb-2">Neural Landscapes</h3>
                    <p className="text-xl text-violet-400 font-semibold mb-2">2025</p>
                    <div className="flex items-center gap-4 text-gray-400">
                      <span className="flex items-center gap-1">
                        <Music className="w-4 h-4" />
                        8 tracks
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        42 min
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        4.9/5
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                    The most ambitious project yet - a fully AI-collaborative album that explores the 
                    intersection of human creativity and machine learning. Each track represents a 
                    different neural network architecture translated into sound.
                  </p>

                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between items-center p-3 rounded bg-gray-700/30 hover:bg-gray-700/50 transition-all cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" className="text-violet-400 hover:text-violet-300">
                          <Play className="w-4 h-4" />
                        </Button>
                        <span className="text-white">01. Synaptic Dreams</span>
                      </div>
                      <div className="flex items-center gap-4 text-gray-400">
                        <span>5:23</span>
                        <Heart className="w-4 h-4 hover:text-red-400 cursor-pointer" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded bg-gray-700/30 hover:bg-gray-700/50 transition-all cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" className="text-violet-400 hover:text-violet-300">
                          <Play className="w-4 h-4" />
                        </Button>
                        <span className="text-white">02. Deep Learning</span>
                      </div>
                      <div className="flex items-center gap-4 text-gray-400">
                        <span>4:45</span>
                        <Heart className="w-4 h-4 hover:text-red-400 cursor-pointer" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded bg-gray-700/30 hover:bg-gray-700/50 transition-all cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" className="text-violet-400 hover:text-violet-300">
                          <Play className="w-4 h-4" />
                        </Button>
                        <span className="text-white">03. Artificial Emotions</span>
                      </div>
                      <div className="flex items-center gap-4 text-gray-400">
                        <span>6:12</span>
                        <Heart className="w-4 h-4 hover:text-red-400 cursor-pointer" />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mb-6">
                    <Button className="flex-1 bg-violet-500 hover:bg-violet-600 text-black font-bold">
                      <Play className="w-4 h-4 mr-2" />
                      Play Album
                    </Button>
                    <Button variant="outline" className="border-violet-400 text-violet-400 hover:bg-violet-400 hover:text-black">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" className="border-violet-400 text-violet-400 hover:bg-violet-400 hover:text-black">
                      <Share className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Streaming Links */}
                  <div className="border-t border-gray-600 pt-4">
                    <p className="text-gray-300 text-sm mb-3">Available on:</p>
                    <div className="flex gap-4">
                      <a href="#" className="text-green-500 hover:text-green-400 transition-colors" title="Spotify">
                        <SpotifyIcon />
                      </a>
                      <a href="#" className="text-white hover:text-gray-300 transition-colors" title="Apple Music">
                        <AppleMusicIcon />
                      </a>
                      <a href="#" className="text-red-500 hover:text-red-400 transition-colors" title="YouTube Music">
                        <YouTubeMusicIcon />
                      </a>
                      <a href="#" className="text-orange-500 hover:text-orange-400 transition-colors" title="SoundCloud">
                        <SoundCloudIcon />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Complete Discography */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-12 text-center">Complete Discography</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Album 1 */}
              <Card className="bg-gray-900/50 border-violet-500/30 backdrop-blur-sm overflow-hidden group">
                <div className="relative aspect-square">
                  <Image
                    src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=600"
                    alt="Neon Horizons"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300" />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-purple-500 text-black font-bold text-xs">2024</Badge>
                  </div>
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full">
                      <Play className="w-4 h-4 text-white" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">Neon Horizons</h3>
                  <p className="text-gray-400 text-sm mb-3">5 tracks • 23 min</p>
                  <p className="text-gray-300 text-sm mb-4">
                    Exploring cyberpunk aesthetics through sound design and atmospheric textures.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm">4.8</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300">
                      <Headphones className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Album 2 */}
              <Card className="bg-gray-900/50 border-purple-500/30 backdrop-blur-sm overflow-hidden group">
                <div className="relative aspect-square">
                  <Image
                    src="https://images.unsplash.com/photo-1571330735066-03aaa9429d89?q=80&w=600"
                    alt="Quantum Beats"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300" />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-blue-500 text-black font-bold text-xs">2023</Badge>
                  </div>
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full">
                      <Play className="w-4 h-4 text-white" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">Quantum Beats</h3>
                  <p className="text-gray-400 text-sm mb-3">4 tracks • 18 min</p>
                  <p className="text-gray-300 text-sm mb-4">
                    Physics-inspired electronic compositions exploring quantum mechanics through sound.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm">4.6</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                      <Headphones className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Album 3 */}
              <Card className="bg-gray-900/50 border-fuchsia-500/30 backdrop-blur-sm overflow-hidden group">
                <div className="relative aspect-square">
                  <Image
                    src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=600"
                    alt="Digital Dreams"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300" />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-cyan-500 text-black font-bold text-xs">2022</Badge>
                  </div>
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full">
                      <Play className="w-4 h-4 text-white" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">Digital Dreams</h3>
                  <p className="text-gray-400 text-sm mb-3">6 tracks • 28 min</p>
                  <p className="text-gray-300 text-sm mb-4">
                    A journey through digital landscapes and virtual realms of consciousness.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm">4.7</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300">
                      <Headphones className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Album 4 */}
              <Card className="bg-gray-900/50 border-pink-500/30 backdrop-blur-sm overflow-hidden group">
                <div className="relative aspect-square">
                  <Image
                    src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600"
                    alt="Synthwave Nights"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300" />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-pink-500 text-black font-bold text-xs">2021</Badge>
                  </div>
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full">
                      <Play className="w-4 h-4 text-white" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">Synthwave Nights</h3>
                  <p className="text-gray-400 text-sm mb-3">7 tracks • 32 min</p>
                  <p className="text-gray-300 text-sm mb-4">
                    Retro-futuristic synthwave anthems inspired by 80s aesthetics and neon culture.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm">4.5</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-pink-400 hover:text-pink-300">
                      <Headphones className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Album 5 */}
              <Card className="bg-gray-900/50 border-indigo-500/30 backdrop-blur-sm overflow-hidden group">
                <div className="relative aspect-square">
                  <Image
                    src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=600"
                    alt="Electric Pulse"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300" />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-indigo-500 text-black font-bold text-xs">2021</Badge>
                  </div>
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full">
                      <Play className="w-4 h-4 text-white" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">Electric Pulse</h3>
                  <p className="text-gray-400 text-sm mb-3">5 tracks • 25 min</p>
                  <p className="text-gray-300 text-sm mb-4">
                    High-energy electronic tracks designed for dance floors and festival stages.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm">4.4</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-indigo-400 hover:text-indigo-300">
                      <Headphones className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Album 6 */}
              <Card className="bg-gray-900/50 border-emerald-500/30 backdrop-blur-sm overflow-hidden group">
                <div className="relative aspect-square">
                  <Image
                    src="https://images.unsplash.com/photo-1619983081563-430f63602796?q=80&w=600"
                    alt="Midnight Sessions"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300" />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-emerald-500 text-black font-bold text-xs">2020</Badge>
                  </div>
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full">
                      <Play className="w-4 h-4 text-white" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">Midnight Sessions</h3>
                  <p className="text-gray-400 text-sm mb-3">4 tracks • 20 min</p>
                  <p className="text-gray-300 text-sm mb-4">
                    The debut release - intimate late-night electronic explorations and ambient textures.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm">4.3</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-emerald-400 hover:text-emerald-300">
                      <Headphones className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-violet-500/20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 rounded-full flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg">RUDYBTZ DISCOGRAPHY</span>
          </div>
          <p className="text-violet-200/80">
            Complete collection of electronic music releases and productions
          </p>
        </div>
      </footer>
    </div>
  );
}