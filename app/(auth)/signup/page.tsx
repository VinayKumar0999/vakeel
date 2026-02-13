"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scale, User, ArrowRight } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Join Vakeel Kutami</h1>
          <p className="text-lg text-gray-600">Choose your account type to get started</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Client Signup Card */}
          <Card className="border-2 hover:border-emerald-500 transition-all duration-300 cursor-pointer hover:shadow-xl">
            <CardHeader className="text-center pb-4 relative">
              <span className="absolute top-3 right-3 rounded-full bg-emerald-100 text-emerald-700 px-2.5 py-0.5 text-xs font-semibold">
                Client
              </span>
              <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-emerald-600" />
              </div>
              <CardTitle className="text-2xl">I'm a Client</CardTitle>
              <CardDescription className="text-base mt-2">
                Looking for legal consultation and services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="text-sm text-gray-600 space-y-2 text-left">
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2">✓</span>
                  <span>Find qualified advocates</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2">✓</span>
                  <span>Book consultations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2">✓</span>
                  <span>Get legal advice</span>
                </li>
              </ul>
              <Button
                onClick={() => router.push("/signup/client")}
                className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700"
                size="lg"
              >
                Sign Up as Client
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Advocate Signup Card */}
          <Card className="border-2 hover:border-amber-500 transition-all duration-300 cursor-pointer hover:shadow-xl">
            <CardHeader className="text-center pb-4 relative">
              <span className="absolute top-3 right-3 rounded-full bg-amber-100 text-amber-800 px-2.5 py-0.5 text-xs font-semibold">
                Advocate
              </span>
              <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                <Scale className="w-8 h-8 text-amber-600" />
              </div>
              <CardTitle className="text-2xl">I'm an Advocate</CardTitle>
              <CardDescription className="text-base mt-2">
                Join our platform and grow your practice
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="text-sm text-gray-600 space-y-2 text-left">
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">✓</span>
                  <span>Connect with clients</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">✓</span>
                  <span>Manage your practice</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">✓</span>
                  <span>Build your reputation</span>
                </li>
              </ul>
              <Button
                onClick={() => router.push("/signup/lawyer")}
                className="w-full mt-6 bg-amber-600 hover:bg-amber-700"
                size="lg"
                variant="default"
              >
                Sign Up as Advocate
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
