"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Star,
  Video,
  Clock,
  Briefcase,
  GraduationCap,
  FileText,
  CheckCircle2,
  ArrowLeft,
  User,
  Phone,
  Mail,
} from "lucide-react";
import { lawyerAPI } from "@/lib/api";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LawyerProfile {
  id: string;
  name: string;
  photo: string | null;
  expertise: string[];
  specializations: string[];
  experience: string;
  experienceYears: number;
  languages: string[];
  location: string;
  city: string;
  state: string;
  pincode: string;
  rating: number;
  reviews: number;
  fee: number;
  bio: string;
  education: string;
  barCouncil: string;
  barCouncilNumber: string;
  barCouncilState: string;
  officeAddress: string;
  barCertificatePath: string | null;
  idProofPath: string | null;
  email: string;
  phone: string;
}

export default function LawyerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const lawyerId = params?.id as string;
  const [lawyer, setLawyer] = useState<LawyerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (lawyerId) {
      fetchLawyer();
    }
  }, [lawyerId]);

  const fetchLawyer = async () => {
    try {
      setIsLoading(true);
      const response = await lawyerAPI.getById(lawyerId);
      setLawyer(response.data.data);
    } catch (error: any) {
      console.error("Error fetching lawyer:", error);
      toast.error(error.response?.data?.message || "Failed to load lawyer profile");
      router.push("/lawers");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lawyer profile...</p>
        </div>
      </div>
    );
  }

  if (!lawyer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Lawyer not found</h2>
          <Link href="/lawers" className="text-blue-900 hover:underline">
            ← Back to Lawyers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back Button */}
        <Link
          href="/lawers"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Lawyers
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                {/* Profile Photo */}
                <div className="flex justify-center mb-6">
                  {lawyer.photo ? (
                    <div className="w-32 h-32 rounded-xl overflow-hidden bg-gradient-to-br from-blue-100 to-blue-50">
                      <Image
                        src={lawyer.photo}
                        alt={lawyer.name}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center">
                      <User className="w-16 h-16 text-blue-600" />
                    </div>
                  )}
                </div>

                {/* Name & Rating */}
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-slate-900 mb-2">{lawyer.name}</h1>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-slate-900">{lawyer.rating}</span>
                    <span className="text-slate-600">({lawyer.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-slate-600 text-sm">
                    <MapPin className="w-4 h-4" />
                    {lawyer.location}
                  </div>
                </div>

                {/* Consultation Fee */}
                <div className="bg-blue-50 rounded-lg p-4 mb-6 text-center">
                  <div className="text-sm text-slate-600 mb-1">Consultation Fee</div>
                  <div className="text-3xl font-bold text-blue-900">
                    ₹{lawyer.fee}
                    <span className="text-lg font-normal text-slate-600">/session</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Link href={`/book/${lawyer.id}`} className="block">
                    <Button className="w-full bg-blue-900 hover:bg-blue-800" size="lg">
                      <Video className="w-5 h-5 mr-2" />
                      Book Consultation
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full" size="lg">
                    <Phone className="w-5 h-5 mr-2" />
                    Contact Lawyer
                  </Button>
                </div>

                {/* Quick Info */}
                <div className="mt-6 pt-6 border-t space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Briefcase className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-600">{lawyer.experience} experience</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-slate-600">Verified Lawyer</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <FileText className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-600">Bar ID: {lawyer.barCouncil}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 leading-relaxed">{lawyer.bio}</p>
              </CardContent>
            </Card>

            {/* Practice Areas & Specializations */}
            <Card>
              <CardHeader>
                <CardTitle>Practice Areas & Specializations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Practice Areas</h4>
                  <div className="flex flex-wrap gap-2">
                    {lawyer.expertise.map((area, idx) => (
                      <Badge key={idx} variant="secondary" className="px-3 py-1">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
                {lawyer.specializations.length > 0 && (
                  <div>
                    <h4 className="font-medium text-slate-900 mb-2">Specializations</h4>
                    <div className="flex flex-wrap gap-2">
                      {lawyer.specializations.map((spec, idx) => (
                        <Badge key={idx} className="px-3 py-1 bg-blue-100 text-blue-900">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Education & Languages */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700">{lawyer.education}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Languages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {lawyer.languages.map((lang, idx) => (
                      <Badge key={idx} variant="outline">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Office Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Office Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700">{lawyer.officeAddress}</p>
                <p className="text-slate-600 mt-1">
                  {lawyer.city}, {lawyer.state} - {lawyer.pincode}
                </p>
              </CardContent>
            </Card>

            {/* Reviews Section (Placeholder) */}
            <Card>
              <CardHeader>
                <CardTitle>Reviews ({lawyer.reviews})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-slate-500">
                  <Star className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                  <p>No reviews yet. Be the first to review!</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
