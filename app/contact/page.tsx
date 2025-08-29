import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ContactForm } from '@/components/forms/contact-form';
import { Mail, Phone, MapPin, Clock, Send, Music, Calendar, DollarSign, Users, Instagram, Twitter, Youtube } from 'lucide-react';
import Image from 'next/image';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-900 via-pink-900 to-orange-900">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070"
            alt="Contact and booking"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-rose-900/90 via-pink-900/80 to-orange-900/90" />
        </div>

        <div className="relative z-10 text-center max-w-4xl px-4">
          <Badge className="bg-orange-400 text-black font-bold text-lg px-6 py-2 mb-4">
            GET IN TOUCH
          </Badge>
          <h1 className="text-3d-silver-violet silver-violet text-5xl md:text-7xl font-black mb-4">
            CONTACT
          </h1>
          <p className="text-xl text-orange-200 max-w-2xl mx-auto">
            Ready to collaborate, book a show, or just connect? Let's make something amazing together.
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16">
              
              {/* Contact Form */}
              <div>
                <h2 className="text-3d-silver-violet silver-violet text-4xl font-bold mb-8">Send a Message</h2>
                <ContactForm />
              </div>

              {/* Contact Info & Services */}
              <div className="space-y-8">
                
                {/* Contact Information */}
                <div>
                  <h2 className="text-4xl font-bold text-white mb-8">Contact Information</h2>
                  <div className="space-y-6">
                    <Card className="bg-gray-900/50 border-pink-500/30 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center">
                            <Mail className="w-6 h-6 text-pink-400" />
                          </div>
                          <div>
                            <h3 className="text-white font-semibold mb-1">Email</h3>
                            <p className="text-pink-200">booking@rudybtz.com</p>
                            <p className="text-gray-400 text-sm">Response within 24 hours</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-900/50 border-orange-500/30 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                            <Phone className="w-6 h-6 text-orange-400" />
                          </div>
                          <div>
                            <h3 className="text-white font-semibold mb-1">Management</h3>
                            <p className="text-orange-200">+1 (555) 123-4567</p>
                            <p className="text-gray-400 text-sm">Mon-Fri, 9 AM - 6 PM PST</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-900/50 border-rose-500/30 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-rose-500/20 rounded-lg flex items-center justify-center">
                            <MapPin className="w-6 h-6 text-rose-400" />
                          </div>
                          <div>
                            <h3 className="text-white font-semibold mb-1">Location</h3>
                            <p className="text-rose-200">Los Angeles, CA</p>
                            <p className="text-gray-400 text-sm">Available for worldwide events</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Services */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">Services Available</h3>
                  <div className="grid gap-4">
                    <div className="flex items-center gap-3 p-4 bg-gray-800/30 rounded-lg">
                      <Music className="w-5 h-5 text-pink-400" />
                      <span className="text-white">Live DJ Sets & Performances</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-800/30 rounded-lg">
                      <Calendar className="w-5 h-5 text-orange-400" />
                      <span className="text-white">Festival & Event Bookings</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-800/30 rounded-lg">
                      <Users className="w-5 h-5 text-rose-400" />
                      <span className="text-white">Music Production Collaborations</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-800/30 rounded-lg">
                      <DollarSign className="w-5 h-5 text-pink-400" />
                      <span className="text-white">Custom Music & Sound Design</span>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">Follow & Connect</h3>
                  <div className="flex gap-4">
                    <a href="#" className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center hover:scale-110 transition-transform" aria-label="Follow on Instagram">
                      <Instagram className="w-6 h-6 text-white" />
                    </a>
                    <a href="#" className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center hover:scale-110 transition-transform" aria-label="Follow on Twitter">
                      <Twitter className="w-6 h-6 text-white" />
                    </a>
                    <a href="#" className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center hover:scale-110 transition-transform" aria-label="Watch on YouTube">
                      <Youtube className="w-6 h-6 text-white" />
                    </a>
                  </div>
                  <p className="text-gray-400 text-sm mt-4">
                    Follow for behind-the-scenes content, live updates, and exclusive releases
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Information */}
      <section className="py-20 bg-black/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-8">Event Booking</h2>
            <p className="text-xl text-orange-200 mb-12 max-w-2xl mx-auto">
              Interested in booking RUDYBTZ for your event? Here's what you need to know about 
              availability, requirements, and the booking process.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="bg-gray-900/50 border-rose-500/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-rose-400 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Availability
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm">
                    Currently booking for 2025-2026. Weekend slots fill up quickly, 
                    so advance booking is recommended.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-pink-500/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-pink-400 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Set Duration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm">
                    Standard sets: 60-90 minutes. Extended sets and multiple 
                    performances available for festivals and special events.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-orange-500/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-orange-400 flex items-center gap-2">
                    <Music className="w-5 h-5" />
                    Technical Rider
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm">
                    Full technical rider and hospitality requirements available 
                    upon request. Includes lighting and visual specifications.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-gradient-to-r from-rose-900/50 via-pink-900/50 to-orange-900/50 p-8 rounded-lg border border-orange-500/30">
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Book?</h3>
              <p className="text-orange-200 mb-6">
                Send us your event details including date, location, expected attendance, 
                and budget range. We'll get back to you within 24 hours with availability and a custom quote.
              </p>
              <Button size="lg" className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-black font-bold">
                <Mail className="w-5 h-5 mr-2" />
                Request Booking Quote
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <Card className="bg-gray-900/50 border-rose-500/30 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-rose-400 mb-3">What's your typical response time?</h3>
                  <p className="text-gray-300">
                    I aim to respond to all inquiries within 24 hours. For urgent booking requests, 
                    please call the management number directly.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-pink-500/30 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-pink-400 mb-3">Do you travel internationally?</h3>
                  <p className="text-gray-300">
                    Yes! I'm available for international bookings. Travel and accommodation 
                    arrangements are typically handled by the event organizer.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-orange-500/30 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-orange-400 mb-3">What about custom music production?</h3>
                  <p className="text-gray-300">
                    I offer custom music production services for films, games, commercials, 
                    and special projects. Rates vary based on scope and timeline.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-rose-500/30 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-rose-400 mb-3">Can you perform at private events?</h3>
                  <p className="text-gray-300">
                    Absolutely! I perform at private parties, corporate events, weddings, 
                    and other special occasions. Each event is customized to fit the vibe you're looking for.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-rose-500/20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-rose-500 via-pink-500 to-orange-500 rounded-full flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg">CONTACT RUDYBTZ</span>
          </div>
          <p className="text-rose-200/80">
            Let's create something extraordinary together
          </p>
        </div>
      </footer>
    </div>
  );
}