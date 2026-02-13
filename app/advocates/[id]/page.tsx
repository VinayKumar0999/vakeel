"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Star,
  Video,
  Briefcase,
  GraduationCap,
  FileText,
  CheckCircle2,
  ArrowLeft,
  User,
  Phone,
} from "lucide-react";
import { lawyerAPI } from "@/lib/api";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AdvocateProfile {
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

export default function AdvocateProfilePage() {
  const params = useParams();
  const router = useRouter();
  const advocateId = params?.id as string;
  const [advocate, setAdvocate] = useState<AdvocateProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (advocateId) fetchAdvocate();
  }, [advocateId]);

  const fetchAdvocate = async () => {
    try {
      setIsLoading(true);
      const response = await lawyerAPI.getById(advocateId);
      setAdvocate(response.data.data);
    } catch (error: unknown) {
      console.error("Error fetching advocate:", error);
      toast.error("Failed to load advocate profile");
      router.push("/advocates");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vk-primary mx-auto mb-4" />
          <p className="text-slate-600">Loading advocate profile...</p>
        </div>
      </div>
    );
  }

  if (!advocate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Advocate not found</h2>
          <Link href="/advocates" className="text-vk-primary hover:underline">
            ← Back to Advocates
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Link href="/advocates" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Advocates
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="flex justify-center mb-6">
                  {advocate.photo ? (
                    <div className="w-32 h-32 rounded-xl overflow-hidden bg-gradient-to-br from-vk-primary/10 to-vk-primary/5">
                      <Image src={advocate.photo} alt={advocate.name} width={128} height={128} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-32 h-32 bg-gradient-to-br from-vk-primary/10 to-vk-primary/5 rounded-xl flex items-center justify-center">
                      <User className="w-16 h-16 text-vk-primary" />
                    </div>
                  )}
                </div>
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-slate-900 mb-2">{advocate.name}</h1>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-slate-900">{advocate.rating}</span>
                    <span className="text-slate-600">({advocate.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-slate-600 text-sm">
                    <MapPin className="w-4 h-4" />
                    {advocate.location}
                  </div>
                </div>
                <div className="bg-vk-primary/10 rounded-lg p-4 mb-6 text-center">
                  <div className="text-sm text-slate-600 mb-1">Consultation Fee</div>
                  <div className="text-3xl font-bold text-vk-primary">
                    ₹{advocate.fee}
                    <span className="text-lg font-normal text-slate-600">/session</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <Link href={`/book/${advocate.id}`} className="block">
                    <Button className="w-full bg-vk-primary hover:opacity-95" size="lg">
                      <Video className="w-5 h-5 mr-2" />
                      Book Consultation
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full" size="lg">
                    <Phone className="w-5 h-5 mr-2" />
                    Contact Advocate
                  </Button>
                </div>
                <div className="mt-6 pt-6 border-t space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Briefcase className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-600">{advocate.experience} experience</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-slate-600">Verified Advocate</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <FileText className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-600">Bar ID: {advocate.barCouncil}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 leading-relaxed">{advocate.bio}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Practice Areas & Specializations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Practice Areas</h4>
                  <div className="flex flex-wrap gap-2">
                    {advocate.expertise.map((area, idx) => (
                      <Badge key={idx} variant="secondary" className="px-3 py-1">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
                {advocate.specializations.length > 0 && (
                  <div>
                    <h4 className="font-medium text-slate-900 mb-2">Specializations</h4>
                    <div className="flex flex-wrap gap-2">
                      {advocate.specializations.map((spec, idx) => (
                        <Badge key={idx} className="px-3 py-1 bg-vk-primary/10 text-vk-primary">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700">{advocate.education}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Languages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {advocate.languages.map((lang, idx) => (
                      <Badge key={idx} variant="outline">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Office Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700">{advocate.officeAddress}</p>
                <p className="text-slate-600 mt-1">
                  {advocate.city}, {advocate.state} - {advocate.pincode}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reviews ({advocate.reviews})</CardTitle>
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
