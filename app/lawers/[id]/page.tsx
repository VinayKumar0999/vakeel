"use client";

// import { useEffect, useState } from "react";
// import { useRouter, usePathname } from "next/navigation";
// import Link from "next/link";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Star, MapPin, MessageSquare, Calendar, Clock } from "lucide-react";
// import { lawyerAPI } from "@/lib/api";
// import { formatDate, formatTime } from "@/lib/utils";
// import toast from "react-hot-toast";

// interface Lawyer {
//   id: number;
//   name: string;
//   rating: number;
//   reviews: number;
//   expertise: string[];
//   location: string;
//   languages: string[];
//   fee: number;
//   bio?: string;
//   experience?: number;
//   isAvailable?: boolean;
//   userId?: number;
// }

// export default function LawyerProfilePage({ params }: { params: { id: string } }) {
//   const [lawyer, setLawyer] = useState<Lawyer | null>(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     // Fetch lawyer details from API
//     async function fetchLawyer() {
//       setLoading(true);
//       try {
//         const res = await lawyerAPI.getById(params.id);
//         // API expected: { data: { ... } }
//         setLawyer(res.data.data || res.data);
//       } catch (err) {
//         console.error("Failed to load lawyer", err);
//         toast.error("Failed to load lawyer profile.");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchLawyer();
//   }, [params.id]);

//   // Fallback mock if API not ready
//   useEffect(() => {
//     if (!loading && !lawyer) {
//       setLawyer({
//         id: Number(params.id),
//         name: "Adv. Priya Sharma",
//         rating: 4.8,
//         reviews: 120,
//         expertise: ["Family Law", "Divorce", "Child Custody"],
//         location: "Delhi",
//         languages: ["English", "Hindi"],
//         fee: 800,
//         bio: "Experienced family law attorney with 9+ years of practice in Delhi High Court.",
//         experience: 9,
//         isAvailable: true,
//         userId: 3,
//       });
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [loading]);

//   if (loading && !lawyer) {
//     return (
//       <main className="container mx-auto p-8">
//         <div className="text-center py-24">Loading...</div>
//       </main>
//     );
//   }

//   return (
//     <main className="container mx-auto px-4 py-10">
//         <div className="grid lg:grid-cols-3 gap-8">
//           <section className="lg:col-span-2">
//             <Card>
//               <CardContent className="p-6">
//                 <div className="flex items-start gap-6">
//                   <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold">
//                     {lawyer?.name.split(" ").map(s => s[0]).slice(0,2).join("")}
//                   </div>
//                   <div className="flex-1">
//                     <h1 className="text-2xl font-semibold">{lawyer?.name}</h1>
//                     <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
//                       <div className="inline-flex items-center gap-1">
//                         <Star className="w-4 h-4 text-yellow-500" />
//                         <span className="font-medium">{lawyer?.rating}</span>
//                         <span>({lawyer?.reviews})</span>
//                       </div>
//                       <div className="inline-flex items-center gap-1">
//                         <MapPin className="w-4 h-4" />
//                         <span>{lawyer?.location}</span>
//                       </div>
//                       <div className="inline-flex items-center gap-1">
//                         <MessageSquare className="w-4 h-4" />
//                         <span>{lawyer?.languages.join(", ")}</span>
//                       </div>
//                     </div>

//                     <p className="mt-4 text-gray-700">{lawyer?.bio}</p>

//                     <div className="mt-6 flex gap-3">
//                       <Button onClick={() => router.push(`/book/${lawyer?.id}`)}>
//                         Book Consultation
//                       </Button>
//                       <Button variant="outline" asChild>
//                         <Link href={`/lawyers/${lawyer?.id}#reviews`}>Read Reviews</Link>
//                       </Button>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mt-6">
//                   <h3 className="font-semibold mb-2">Expertise</h3>
//                   <div className="flex flex-wrap gap-2">
//                     {lawyer?.expertise.map((e) => (
//                       <span key={e} className="text-xs px-2 py-1 rounded-full bg-gray-100">{e}</span>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="mt-6 grid grid-cols-2 gap-4">
//                   <div>
//                     <h4 className="text-sm font-medium">Experience</h4>
//                     <p className="text-gray-600">{lawyer?.experience} years</p>
//                   </div>
//                   <div>
//                     <h4 className="text-sm font-medium">Consultation Fee</h4>
//                     <p className="text-gray-600">₹{lawyer?.fee} / 30min</p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Reviews section anchor */}
//             <div id="reviews" className="mt-8">
//               <Card>
//                 <CardHeader className="p-6">
//                   <CardTitle>Reviews</CardTitle>
//                 </CardHeader>
//                 <CardContent className="p-6">
//                   {/* Placeholder: integrate reviewAPI.getLawyerReviews */}
//                   <p className="text-gray-600">Customer reviews will appear here. (Integrate reviewAPI.getLawyerReviews)</p>
//                 </CardContent>
//               </Card>
//             </div>
//           </section>

//           <aside>
//             <Card>
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h3 className="font-semibold">Next available</h3>
//                     <p className="text-sm text-gray-600 mt-1">Tue, {formatDate(new Date())}</p>
//                     <p className="text-sm text-gray-600">{formatTime(new Date())}</p>
//                   </div>
//                   <div className="text-right">
//                     <div className="text-lg font-semibold">₹{lawyer?.fee}</div>
//                     <div className={`text-sm ${lawyer?.isAvailable ? "text-green-600" : "text-gray-500"}`}>
//                       {lawyer?.isAvailable ? "Available Today" : "Not available"}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mt-6">
//                   <Button className="w-full" onClick={() => router.push(`/book/${lawyer?.id}`)}>
//                     Select date & time
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="mt-4">
//               <CardContent className="p-6">
//                 <h4 className="font-semibold mb-2">Contact</h4>
//                 <p className="text-sm text-gray-600">For urgent matters, contact via the consultation booking flow.</p>
//               </CardContent>
//             </Card>
//           </aside>
//         </div>
//       </main>
//   );
// }
import React, { useState } from 'react';
import { MapPin, Star, Award, Briefcase, Clock, Video, MessageCircle, Share2, Heart, CheckCircle, Calendar, Languages, GraduationCap, Shield } from 'lucide-react';

export default function LawyerProfilePage() {
  const [activeTab, setActiveTab] = useState('about');
  const [showBookingModal, setShowBookingModal] = useState(false);

  const lawyer = {
    name: "Adv. Rajesh Kumar",
    photo: "👨‍⚖️",
    title: "Senior Corporate & Property Law Specialist",
    experience: 15,
    location: "Hyderabad, Telangana",
    rating: 4.9,
    reviews: 127,
    consultations: 450,
    fee: 1500,
    barCouncil: "TN/12345/2008",
    verified: true,
    available: true,
    expertise: ["Corporate Law", "Property Law", "Contract Law", "Real Estate"],
    languages: ["English", "Hindi", "Telugu"],
    education: [
      { degree: "LLM (Corporate Law)", institution: "National Law School, Bangalore", year: "2010" },
      { degree: "LLB", institution: "Osmania University", year: "2008" }
    ],
    courts: ["High Court of Telangana", "Supreme Court of India", "Civil Courts"],
    about: "With over 15 years of experience in corporate and property law, I specialize in helping businesses navigate complex legal landscapes. My practice focuses on corporate transactions, real estate deals, and contract negotiations. I've successfully handled over 450 consultations and represented clients in high-stakes matters across various courts.",
    achievements: [
      "Successfully handled 200+ corporate transactions",
      "Represented clients in 50+ property disputes",
      "Member of Bar Council of India",
      "Certified Mediator and Arbitrator"
    ]
  };

  const reviews = [
    {
      id: 1,
      client: "Amit Sharma",
      rating: 5,
      date: "2 weeks ago",
      comment: "Excellent consultation! Adv. Rajesh provided clear guidance on my property dispute. Very professional and knowledgeable. Highly recommended!"
    },
    {
      id: 2,
      client: "Priya Reddy",
      rating: 5,
      date: "1 month ago",
      comment: "Very helpful with corporate compliance matters. Explained complex legal terms in simple language. Will definitely consult again."
    },
    {
      id: 3,
      client: "Vikram Mehta",
      rating: 4,
      date: "2 months ago",
      comment: "Good experience overall. Provided practical solutions for my contract issue. Worth the consultation fee."
    }
  ];

  const availableSlots = [
    { date: "Today", slots: ["2:00 PM", "4:30 PM", "6:00 PM"] },
    { date: "Tomorrow", slots: ["10:00 AM", "11:30 AM", "2:00 PM", "4:00 PM", "5:30 PM"] },
    { date: "Dec 5", slots: ["9:00 AM", "10:30 AM", "2:00 PM", "3:30 PM"] }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-blue-900">Vakeel Kutami</div>
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg">Back to Search</button>
              <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center text-white font-semibold">
                JD
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Profile Header */}
            <div className="bg-white rounded-xl p-8 shadow-sm mb-6">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center text-6xl relative">
                    {lawyer.photo}
                    {lawyer.verified && (
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center border-4 border-white">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h1 className="text-3xl font-bold text-slate-900 mb-1">{lawyer.name}</h1>
                      <p className="text-lg text-slate-600 mb-3">{lawyer.title}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="w-10 h-10 border-2 border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center">
                        <Share2 className="w-5 h-5 text-slate-600" />
                      </button>
                      <button className="w-10 h-10 border-2 border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center">
                        <Heart className="w-5 h-5 text-slate-600" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-slate-900">{lawyer.rating}</span>
                      <span className="text-slate-600">({lawyer.reviews} reviews)</span>
                    </div>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-600">{lawyer.consultations} consultations</span>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-slate-600 mb-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {lawyer.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {lawyer.experience} years exp.
                    </span>
                    {lawyer.available && (
                      <span className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        Available Today
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {lawyer.expertise.map((exp, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-900 rounded-full text-sm font-medium">
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm mb-6">
              <div className="border-b border-slate-200">
                <div className="flex">
                  {['about', 'education', 'reviews'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-4 font-medium capitalize transition-colors relative ${
                        activeTab === tab
                          ? 'text-blue-900'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tab}
                      {activeTab === tab && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-900"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {activeTab === 'about' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-3">About</h3>
                      <p className="text-slate-600 leading-relaxed">{lawyer.about}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <Languages className="w-5 h-5" />
                        Languages
                      </h3>
                      <div className="flex gap-2">
                        {lawyer.languages.map((lang, idx) => (
                          <span key={idx} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Court Practice
                      </h3>
                      <div className="space-y-2">
                        {lawyer.courts.map((court, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-slate-600">{court}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <Award className="w-5 h-5" />
                        Key Achievements
                      </h3>
                      <div className="space-y-2">
                        {lawyer.achievements.map((achievement, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-blue-900 mt-1 flex-shrink-0" />
                            <span className="text-slate-600">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'education' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <GraduationCap className="w-5 h-5" />
                        Education
                      </h3>
                      <div className="space-y-4">
                        {lawyer.education.map((edu, idx) => (
                          <div key={idx} className="border-l-4 border-blue-900 pl-4">
                            <div className="font-semibold text-slate-900">{edu.degree}</div>
                            <div className="text-slate-600">{edu.institution}</div>
                            <div className="text-sm text-slate-500">{edu.year}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-3">Certifications</h3>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center">
                            <Shield className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">Bar Council Verified</div>
                            <div className="text-sm text-slate-600">Registration No: {lawyer.barCouncil}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-4xl font-bold text-slate-900">{lawyer.rating}</div>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <div className="text-sm text-slate-600 mt-1">Based on {lawyer.reviews} reviews</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {reviews.map(review => (
                        <div key={review.id} className="border-b border-slate-200 pb-4 last:border-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="font-semibold text-slate-900">{review.client}</div>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-1">
                                  {[...Array(review.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                  ))}
                                </div>
                                <span className="text-sm text-slate-500">{review.date}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-slate-600 leading-relaxed">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <div className="mb-6">
                <div className="text-sm text-slate-600 mb-1">Consultation Fee</div>
                <div className="text-3xl font-bold text-blue-900">
                  ₹{lawyer.fee}
                  <span className="text-lg font-normal text-slate-600">/30 min</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="w-full px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 font-semibold"
                >
                  <Video className="w-5 h-5" />
                  Book Video Consultation
                </button>
                <button className="w-full px-6 py-3 border-2 border-blue-900 text-blue-900 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 font-semibold">
                  <MessageCircle className="w-5 h-5" />
                  Send Message
                </button>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Available Slots
                </h4>
                <div className="space-y-4">
                  {availableSlots.map((day, idx) => (
                    <div key={idx}>
                      <div className="text-sm font-medium text-slate-700 mb-2">{day.date}</div>
                      <div className="flex flex-wrap gap-2">
                        {day.slots.map((slot, slotIdx) => (
                          <button
                            key={slotIdx}
                            className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg hover:border-blue-900 hover:bg-blue-50 hover:text-blue-900 transition-colors"
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-green-700 mt-0.5" />
                  <div>
                    <div className="font-medium text-green-900 text-sm">Quick Response Time</div>
                    <div className="text-sm text-green-700 mt-1">
                      Usually responds within 2 hours
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}