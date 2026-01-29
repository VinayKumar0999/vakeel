"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle2, Mail } from "lucide-react";
import Link from "next/link";

export default function VerificationPendingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="w-full max-w-2xl">
        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-10 h-10 text-yellow-600" />
            </div>
            <CardTitle className="text-3xl font-bold mb-2">
              Verification Pending
            </CardTitle>
            <CardDescription className="text-lg">
              Your lawyer registration is under review
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-900 mb-1">
                    Check Your Email
                  </p>
                  <p className="text-sm text-blue-800">
                    We've sent a confirmation email to your registered email address.
                    Please verify your email to continue.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">What happens next?</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary-600 font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Email Verification</p>
                    <p className="text-sm text-gray-600">
                      Verify your email address by clicking the link in the email we sent.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary-600 font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Document Review</p>
                    <p className="text-sm text-gray-600">
                      Our team will review your Bar Council certificate and ID proof.
                      This usually takes 24-48 hours.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary-600 font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Account Activation</p>
                    <p className="text-sm text-gray-600">
                      Once verified, you'll receive an email notification and can start
                      using your lawyer dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                <strong>Note:</strong> If you don't receive the verification email within
                a few minutes, please check your spam folder or contact our support team.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button asChild className="flex-1">
                <Link href="/login">Go to Login</Link>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
