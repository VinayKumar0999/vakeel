"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, User, Briefcase, MapPin, Send } from "lucide-react";
import type { LawyerSignupData } from "../page";

interface Step5ReviewProps {
  formData: LawyerSignupData;
  onSubmit?: () => void;
  isSubmitting?: boolean;
}

export default function Step5Review({ formData, onSubmit, isSubmitting = false }: Step5ReviewProps) {
  const ReviewSection = ({
    icon: Icon,
    title,
    children,
  }: {
    icon: React.ElementType;
    title: string;
    children: React.ReactNode;
  }) => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-primary-600" />
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 text-green-800">
          <CheckCircle2 className="w-5 h-5" />
          <p className="font-medium">Please review all information before submitting</p>
        </div>
      </div>

      <ReviewSection icon={User} title="Basic Information">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Name:</span>
            <span className="font-medium">{formData.fullName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Email:</span>
            <span className="font-medium">{formData.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Phone:</span>
            <span className="font-medium">{formData.phone}</span>
          </div>
        </div>
      </ReviewSection>

      <ReviewSection icon={Briefcase} title="Professional Details">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Bar Council Number:</span>
            <span className="font-medium">{formData.barCouncilNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Bar Council State:</span>
            <span className="font-medium">{formData.barCouncilState}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Experience:</span>
            <span className="font-medium">{formData.yearsOfExperience} years</span>
          </div>
          <div className="mt-3">
            <span className="text-gray-600 block mb-1">Practice Areas:</span>
            <div className="flex flex-wrap gap-2">
              {formData.practiceAreas.map((area) => (
                <span
                  key={area}
                  className="px-2 py-1 bg-primary-100 text-primary-800 rounded text-xs"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
          {formData.languages.length > 0 && (
            <div className="mt-3">
              <span className="text-gray-600 block mb-1">Languages:</span>
              <div className="flex flex-wrap gap-2">
                {formData.languages.map((lang) => (
                  <span
                    key={lang}
                    className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </ReviewSection>

      <ReviewSection icon={User} title="Profile Setup">
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-gray-600 block mb-1">Bio:</span>
            <p className="text-gray-800">{formData.bio || "Not provided"}</p>
          </div>
          <div className="flex justify-between mt-3">
            <span className="text-gray-600">Consultation Fee:</span>
            <span className="font-medium">₹{formData.consultationFee}</span>
          </div>
        </div>
      </ReviewSection>

      <ReviewSection icon={MapPin} title="Office Address">
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-gray-600 block mb-1">Address:</span>
            <p className="text-gray-800">{formData.officeAddress}</p>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">City:</span>
            <span className="font-medium">{formData.city}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">State:</span>
            <span className="font-medium">{formData.state}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Pincode:</span>
            <span className="font-medium">{formData.pincode}</span>
          </div>
        </div>
      </ReviewSection>

      {/* Submit Button Section */}
      <div className="mt-6 pt-6 border-t">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-blue-800 text-center">
            <strong>Ready to submit?</strong> Please review all information above. Once submitted, your account will be pending verification.
          </p>
        </div>
        <Button
          type="button"
          onClick={onSubmit || (() => {})}
          disabled={isSubmitting || !onSubmit}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white py-6 text-lg font-semibold"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Submitting Registration...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Submit Registration
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
