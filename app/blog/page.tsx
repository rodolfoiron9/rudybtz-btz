import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, User, ArrowRight, Search, Filter, BookOpen, Headphones, Zap, Code } from 'lucide-react';
import Image from 'next/image';

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1629654291663-b91ad427bcc0?q=80&w=2070"
            alt="Music production setup"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 via-teal-900/80 to-cyan-900/90" />
        </div>

        <div className="relative z-10 text-center max-w-4xl px-4">
          <Badge className="bg-emerald-400 text-black font-bold text-lg px-6 py-2 mb-4">
            PRODUCTION INSIGHTS
          </Badge>
          <h1 className="text-3d-silver-violet silver-violet text-5xl md:text-7xl font-black mb-4">
            BLOG
          </h1>
          <p className="text-xl text-emerald-200 max-w-2xl mx-auto">
            Behind-the-scenes insights, production techniques, and the future of electronic music
          </p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input 
                  placeholder="Search articles..." 
                  className="pl-10 bg-gray-800/50 border-emerald-500/30 text-white placeholder-gray-400"
                />
              </div>
              <Button variant="outline" className="border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-black">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-3 mb-12">
              <Badge className="bg-emerald-500 text-black px-4 py-2 cursor-pointer hover:bg-emerald-400">All Posts</Badge>
              <Badge variant="outline" className="border-teal-400 text-teal-400 px-4 py-2 cursor-pointer hover:bg-teal-400 hover:text-black">Production Tips</Badge>
              <Badge variant="outline" className="border-cyan-400 text-cyan-400 px-4 py-2 cursor-pointer hover:bg-cyan-400 hover:text-black">AI & Music</Badge>
              <Badge variant="outline" className="border-blue-400 text-blue-400 px-4 py-2 cursor-pointer hover:bg-blue-400 hover:text-black">Studio Setup</Badge>
              <Badge variant="outline" className="border-purple-400 text-purple-400 px-4 py-2 cursor-pointer hover:bg-purple-400 hover:text-black">Industry Insights</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3d-silver-violet silver-violet text-3xl font-bold mb-8 text-center">Featured Article</h2>
            <Card className="overflow-hidden bg-gray-900/50 border-emerald-500/30 backdrop-blur-sm">
              <div className="grid lg:grid-cols-2">
                <div className="relative aspect-video lg:aspect-auto">
                  <Image
                    src="https://images.unsplash.com/photo-1558618047-3c8c89c91e7e?q=80&w=2070"
                    alt="AI Music Production"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-emerald-500 text-black font-bold">FEATURED</Badge>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <Badge className="bg-cyan-500 text-black">AI & Music</Badge>
                    <span className="text-gray-400 text-sm flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      August 25, 2025
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">
                    The Future of AI-Assisted Music Production: A Deep Dive
                  </h3>
                  <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                    Exploring how artificial intelligence is revolutionizing electronic music creation, 
                    from real-time composition to automated mastering. Learn about the tools and 
                    techniques that are shaping the next generation of producers.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <User className="w-4 h-4" />
                      <span>RUDYBTZ</span>
                    </div>
                    <Button className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold">
                      Read More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Recent Articles */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8">Recent Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Article 1 */}
              <Card className="bg-gray-900/50 border-teal-500/30 backdrop-blur-sm overflow-hidden group">
                <div className="relative aspect-video">
                  <Image
                    src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1000"
                    alt="Studio setup"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300" />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-teal-500 text-black text-xs">Production Tips</Badge>
                    <span className="text-gray-400 text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      5 min read
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-teal-400 transition-colors">
                    Building the Perfect Home Studio on a Budget
                  </h3>
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                    Essential gear recommendations and setup tips for creating professional-quality 
                    electronic music without breaking the bank.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs">Aug 20, 2025</span>
                    <Button variant="ghost" size="sm" className="text-teal-400 hover:text-black hover:bg-teal-400">
                      <BookOpen className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Article 2 */}
              <Card className="bg-gray-900/50 border-cyan-500/30 backdrop-blur-sm overflow-hidden group">
                <div className="relative aspect-video">
                  <Image
                    src="https://images.unsplash.com/photo-1571330735066-03aaa9429d89?q=80&w=1000"
                    alt="Music production"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300" />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-cyan-500 text-black text-xs">AI & Music</Badge>
                    <span className="text-gray-400 text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      8 min read
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                    Machine Learning in Beat Detection and Analysis
                  </h3>
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                    How modern AI algorithms can analyze rhythm patterns and help create more 
                    dynamic and engaging electronic compositions.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs">Aug 18, 2025</span>
                    <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-black hover:bg-cyan-400">
                      <BookOpen className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Article 3 */}
              <Card className="bg-gray-900/50 border-blue-500/30 backdrop-blur-sm overflow-hidden group">
                <div className="relative aspect-video">
                  <Image
                    src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1000"
                    alt="Live performance"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300" />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-blue-500 text-black text-xs">Industry Insights</Badge>
                    <span className="text-gray-400 text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      12 min read
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                    The Evolution of Electronic Music Festivals
                  </h3>
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                    From underground raves to mainstream festivals: exploring how electronic music 
                    culture has transformed over the past decade.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs">Aug 15, 2025</span>
                    <Button variant="ghost" size="sm" className="text-blue-400 hover:text-black hover:bg-blue-400">
                      <BookOpen className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Article 4 */}
              <Card className="bg-gray-900/50 border-purple-500/30 backdrop-blur-sm overflow-hidden group">
                <div className="relative aspect-video">
                  <Image
                    src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000"
                    alt="Synthesizer setup"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300" />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-purple-500 text-black text-xs">Studio Setup</Badge>
                    <span className="text-gray-400 text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      6 min read
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                    Analog vs Digital: Finding Your Sound
                  </h3>
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                    Exploring the eternal debate between analog warmth and digital precision 
                    in modern electronic music production.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs">Aug 12, 2025</span>
                    <Button variant="ghost" size="sm" className="text-purple-400 hover:text-black hover:bg-purple-400">
                      <BookOpen className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Article 5 */}
              <Card className="bg-gray-900/50 border-pink-500/30 backdrop-blur-sm overflow-hidden group">
                <div className="relative aspect-video">
                  <Image
                    src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1000"
                    alt="Music software"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300" />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-pink-500 text-black text-xs">Production Tips</Badge>
                    <span className="text-gray-400 text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      10 min read
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-pink-400 transition-colors">
                    Advanced Mixing Techniques for Electronic Music
                  </h3>
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                    Professional mixing strategies to make your electronic tracks sound polished 
                    and radio-ready.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs">Aug 10, 2025</span>
                    <Button variant="ghost" size="sm" className="text-pink-400 hover:text-black hover:bg-pink-400">
                      <BookOpen className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Article 6 */}
              <Card className="bg-gray-900/50 border-emerald-500/30 backdrop-blur-sm overflow-hidden group">
                <div className="relative aspect-video">
                  <Image
                    src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1000"
                    alt="Creative process"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300" />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-emerald-500 text-black text-xs">Creative Process</Badge>
                    <span className="text-gray-400 text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      7 min read
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
                    Overcoming Creative Blocks in Music Production
                  </h3>
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                    Practical strategies and exercises to reignite your creativity when inspiration 
                    seems to have vanished.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs">Aug 8, 2025</span>
                    <Button variant="ghost" size="sm" className="text-emerald-400 hover:text-black hover:bg-emerald-400">
                      <BookOpen className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-black/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">Stay Updated</h2>
            <p className="text-xl text-emerald-200 mb-8">
              Get the latest production tips, industry insights, and exclusive content delivered to your inbox.
            </p>
            <div className="flex gap-4 max-w-md mx-auto">
              <Input 
                placeholder="Enter your email" 
                className="bg-gray-800/50 border-emerald-500/30 text-white placeholder-gray-400"
              />
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-emerald-500/20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg">RUDYBTZ BLOG</span>
          </div>
          <p className="text-emerald-200/80">
            Production insights, industry knowledge, and creative inspiration
          </p>
        </div>
      </footer>
    </div>
  );
}