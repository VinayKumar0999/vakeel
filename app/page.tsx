// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { 
//   Search, 
//   Scale, 
//   ShieldCheck, 
//   Video, 
//   FileText,
//   Star,
//   ArrowRight,
//   CheckCircle
// } from "lucide-react";
// import Link from "next/link";
// import Image from "next/image";

// export default function LandingPage() {
//   return (
//     <div className="min-h-screen flex flex-col">
      
//       {/* Hero Section */}
//       <section className="relative bg-gradient-to-br from-primary-50 via-white to-primary-50 py-20 md:py-32">
//         <div className="container mx-auto px-4">
//           <div className="max-w-4xl mx-auto text-center">
//             <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
//               Get Expert Legal Advice
//               <span className="block text-primary-600">Anytime, Anywhere</span>
//             </h1>
//             <p className="text-xl text-gray-600 mb-8">
//               Connect with verified lawyers instantly for online consultations
//             </p>
            
//             {/* Search Bar */}
//             <div className="max-w-2xl mx-auto mb-8">
//               <div className="flex gap-2">
//                 <div className="relative flex-1">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                   <Input
//                     type="search"
//                     placeholder="Search lawyers by expertise, location..."
//                     className="pl-10 h-14 text-lg"
//                   />
//                 </div>
//                 <Button size="lg" className="h-14 px-8">
//                   Search
//                 </Button>
//               </div>
//             </div>

//             {/* Quick Stats */}
//             <div className="flex flex-wrap justify-center gap-8 text-sm">
//               <div className="flex items-center gap-2">
//                 <Scale className="w-5 h-5 text-primary-600" />
//                 <span className="font-semibold">1000+ Lawyers</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Star className="w-5 h-5 text-yellow-500" />
//                 <span className="font-semibold">4.8/5 Rating</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <ShieldCheck className="w-5 h-5 text-green-600" />
//                 <span className="font-semibold">100% Verified</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* How It Works */}
//       <section className="py-16 bg-white">
//         <div className="container mx-auto px-4">
//           <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
//             How It Works
//           </h2>
//           <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
//             <Card className="text-center">
//               <CardContent className="pt-6">
//                 <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <Search className="w-8 h-8 text-primary-600" />
//                 </div>
//                 <h3 className="text-xl font-semibold mb-2">1. Search Lawyer</h3>
//                 <p className="text-gray-600">
//                   Browse and find the right lawyer for your legal needs
//                 </p>
//               </CardContent>
//             </Card>

//             <Card className="text-center">
//               <CardContent className="pt-6">
//                 <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <FileText className="w-8 h-8 text-primary-600" />
//                 </div>
//                 <h3 className="text-xl font-semibold mb-2">2. Book Slot</h3>
//                 <p className="text-gray-600">
//                   Choose a convenient time and make secure payment
//                 </p>
//               </CardContent>
//             </Card>

//             <Card className="text-center">
//               <CardContent className="pt-6">
//                 <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <Video className="w-8 h-8 text-primary-600" />
//                 </div>
//                 <h3 className="text-xl font-semibold mb-2">3. Consult Online</h3>
//                 <p className="text-gray-600">
//                   Get expert legal advice via secure video consultation
//                 </p>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </section>

//       {/* Legal Expertise Areas */}
//       <section className="py-16 bg-gray-50">
//         <div className="container mx-auto px-4">
//           <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
//             Legal Expertise Areas
//           </h2>
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
//             {[
//               "Family Law",
//               "Criminal Law",
//               "Property Law",
//               "Corporate Law",
//               "Consumer Law",
//               "Cyber Law",
//             ].map((area) => (
//               <Link
//                 key={area}
//                 href={`/lawyers?expertise=${area}`}
//                 className="bg-white rounded-lg p-6 text-center hover:shadow-md transition-shadow"
//               >
//                 <div className="text-4xl mb-2">⚖️</div>
//                 <div className="font-medium text-gray-900">{area}</div>
//               </Link>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Top Rated Lawyers */}
//       <section className="py-16 bg-white">
//         <div className="container mx-auto px-4">
//           <div className="flex items-center justify-between mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold">
//               Top Rated Lawyers
//             </h2>
//             <Link href="/lawyers" className="text-primary-600 hover:text-primary-700 flex items-center gap-2">
//               View All <ArrowRight className="w-4 h-4" />
//             </Link>
//           </div>
          
//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {/* Placeholder lawyer cards - replace with actual data */}
//             {[1, 2, 3, 4].map((i) => (
//               <Card key={i} className="hover:shadow-lg transition-shadow">
//                 <CardContent className="p-4">
//                   <div className="aspect-square bg-gray-200 rounded-lg mb-4" />
//                   <h3 className="font-semibold text-lg mb-1">Adv. Name {i}</h3>
//                   <div className="flex items-center gap-1 text-sm text-yellow-600 mb-2">
//                     <Star className="w-4 h-4 fill-current" />
//                     <span className="font-medium">4.9</span>
//                     <span className="text-gray-500">(50)</span>
//                   </div>
//                   <p className="text-sm text-gray-600 mb-3">Family Law, Divorce</p>
//                   <div className="text-lg font-semibold text-primary-600 mb-3">
//                     ₹800/30min
//                   </div>
//                   <Button className="w-full" size="sm">
//                     Book Now
//                   </Button>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Why Choose Us */}
//       <section className="py-16 bg-primary-50">
//         <div className="container mx-auto px-4">
//           <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
//             Why Choose Vakeel Kutami
//           </h2>
//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
//             {[
//               {
//                 icon: ShieldCheck,
//                 title: "Verified Lawyers",
//                 description: "All lawyers are verified with Bar Council registration",
//               },
//               {
//                 icon: ShieldCheck,
//                 title: "Secure & Confidential",
//                 description: "Attorney-client privilege protected with end-to-end encryption",
//               },
//               {
//                 icon: FileText,
//                 title: "Transparent Pricing",
//                 description: "No hidden fees. Know the cost upfront",
//               },
//               {
//                 icon: Video,
//                 title: "Instant Connect",
//                 description: "Book and consult with lawyers within minutes",
//               },
//             ].map((feature, i) => (
//               <div key={i} className="text-center">
//                 <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
//                   <feature.icon className="w-8 h-8 text-primary-600" />
//                 </div>
//                 <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
//                 <p className="text-gray-600">{feature.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Testimonials */}
//       <section className="py-16 bg-white">
//         <div className="container mx-auto px-4">
//           <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
//             What Our Clients Say
//           </h2>
//           <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
//             {[
//               {
//                 name: "John Doe",
//                 location: "Mumbai",
//                 rating: 5,
//                 text: "Great experience! The lawyer was very professional and explained everything clearly.",
//               },
//               {
//                 name: "Sarah Miller",
//                 location: "Delhi",
//                 rating: 5,
//                 text: "Quick and efficient. Got my legal query resolved in just one consultation.",
//               },
//               {
//                 name: "Raj Patel",
//                 location: "Bangalore",
//                 rating: 5,
//                 text: "Highly recommended! The platform is easy to use and lawyers are well-qualified.",
//               },
//             ].map((testimonial, i) => (
//               <Card key={i}>
//                 <CardContent className="pt-6">
//                   <div className="flex gap-1 mb-4">
//                     {[...Array(testimonial.rating)].map((_, i) => (
//                       <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
//                     ))}
//                   </div>
//                   <p className="text-gray-700 mb-4">{testimonial.text}</p>
//                   <div>
//                     <div className="font-semibold">{testimonial.name}</div>
//                     <div className="text-sm text-gray-500">{testimonial.location}</div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
//         <div className="container mx-auto px-4 text-center">
//           <h2 className="text-3xl md:text-4xl font-bold mb-4">
//             Ready to Get Legal Help?
//           </h2>
//           <p className="text-xl mb-8 text-primary-100">
//             Join thousands of satisfied clients today
//           </p>
//           <div className="flex flex-wrap gap-4 justify-center">
//             <Button size="lg" variant="secondary" asChild>
//               <Link href="/signup">Get Started</Link>
//             </Button>
//             <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary-600" asChild>
//               <Link href="/lawyers">Find a Lawyer</Link>
//             </Button>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }
"use client"
import React, { useState } from 'react';
import { Scale, Video, Shield, Clock, Search, CheckCircle, ArrowRight, Star, Users } from 'lucide-react';

export default function LandingPage() {
  const [hoveredCard, setHoveredCard] = useState<any>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block px-4 py-2 bg-blue-50 text-blue-900 rounded-full text-sm font-medium mb-6">
              🎯 Expert Legal Consultation at Your Fingertips
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
              Connect with Top Lawyers <span className="text-blue-900">Instantly</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Get professional legal consultation through secure video calls. Book verified lawyers, discuss your case, and get expert advice—all from the comfort of your home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20">
                Find a Lawyer <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 bg-white text-blue-900 border-2 border-blue-900 rounded-lg hover:bg-blue-50 transition-colors">
                Learn More
              </button>
            </div>
            <div className="flex items-center gap-8 mt-10 pt-10 border-t border-slate-200">
              <div>
                <div className="text-3xl font-bold text-slate-900">500+</div>
                <div className="text-slate-600">Verified Lawyers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-900">10k+</div>
                <div className="text-slate-600">Consultations</div>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-3xl font-bold text-slate-900">4.9</span>
                  <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                </div>
                <div className="text-slate-600">Average Rating</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="relative bg-gradient-to-br from-blue-900 to-blue-700 rounded-2xl p-8 shadow-2xl">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-900" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Live Consultation</div>
                    <div className="text-sm text-slate-600">In Progress</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-blue-900 rounded-full animate-pulse"></div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">22:30 / 30:00</span>
                    <span className="text-green-600 flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                      Active
                    </span>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-amber-400 text-slate-900 px-4 py-2 rounded-lg font-semibold shadow-lg">
                Secure & Private
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Why Choose Vakeel Kutami?</h2>
            <p className="text-xl text-slate-600">Experience the future of legal consultation</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Video,
                title: "HD Video Consultations",
                description: "Crystal-clear video calls with screen sharing and document collaboration features"
              },
              {
                icon: Shield,
                title: "Verified Lawyers Only",
                description: "All lawyers are Bar Council verified with validated credentials and experience"
              },
              {
                icon: Clock,
                title: "Instant Booking",
                description: "Book appointments in seconds and get legal advice within hours, not days"
              },
              {
                icon: Search,
                title: "Smart Search",
                description: "Find the perfect lawyer by expertise, language, location, and ratings"
              },
              {
                icon: CheckCircle,
                title: "Transparent Pricing",
                description: "No hidden fees. See lawyer rates upfront and pay only for confirmed consultations"
              },
              {
                icon: Scale,
                title: "Multiple Practice Areas",
                description: "From family law to corporate, find specialists in all legal domains"
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={`w-14 h-14 rounded-lg flex items-center justify-center mb-4 transition-colors ${
                  hoveredCard === idx ? 'bg-blue-900' : 'bg-blue-50'
                }`}>
                  <feature.icon className={`w-7 h-7 transition-colors ${
                    hoveredCard === idx ? 'text-white' : 'text-blue-900'
                  }`} />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-xl text-slate-600">Get legal help in 3 simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {[
              { step: "1", title: "Find Your Lawyer", desc: "Search by expertise, location, or language. Review profiles and ratings" },
              { step: "2", title: "Book Consultation", desc: "Choose a convenient time slot and make secure payment" },
              { step: "3", title: "Get Expert Advice", desc: "Join video call and discuss your legal matters confidentially" }
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-900 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600">{item.desc}</p>
                </div>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-slate-200 -z-10"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Get Legal Help?</h2>
          <p className="text-xl text-blue-100 mb-8">Join thousands who trust Vakeel Kutami for their legal needs</p>
          <button className="px-8 py-4 bg-white text-blue-900 rounded-lg hover:bg-blue-50 transition-all transform hover:scale-105 font-semibold shadow-xl">
            Find a Lawyer Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Scale className="w-6 h-6 text-white" />
                <span className="text-xl font-bold text-white">Vakeel Kutami</span>
              </div>
              <p className="text-sm">Connecting you with the best legal minds in India.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">For Clients</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Find Lawyers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">For Lawyers</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Join as Lawyer</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Benefits</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Resources</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm">
            © 2024 Vakeel Kutami. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}