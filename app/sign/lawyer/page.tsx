"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scale, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { authAPI } from "@/lib/api";
import toast from "react-hot-toast";

// Import step components
import Step1BasicInfo from "./components/Step1BasicInfo";
import Step2ProfessionalDetails from "./components/Step2ProfessionalDetails";
import Step3Documents from "./components/Step3Documents";
import Step4ProfileSetup from "./components/Step4ProfileSetup";
import Step5Review from "./components/Step5Review";

export interface LawyerSignupData {
  // Step 1: Basic Info
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;

  // Step 2: Professional Details
  barCouncilNumber: string;
  barCouncilState: string;
  practiceAreas: string[];
  yearsOfExperience: string;
  education: string;
  languages: string[];

  // Step 3: Documents
  barCertificate: File | null;
  idProof: File | null;
  profilePhoto: File | null;

  // Step 4: Profile Setup
  bio: string;
  consultationFee: string;
  specializations: string[];
  officeAddress: string;
  city: string;
  state: string;
  pincode: string;
}

const TOTAL_STEPS = 5;

export default function LawyerSignupPage() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<LawyerSignupData>({
    // Step 1
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",

    // Step 2
    barCouncilNumber: "",
    barCouncilState: "",
    practiceAreas: [],
    yearsOfExperience: "",
    education: "",
    languages: [],

    // Step 3
    barCertificate: null,
    idProof: null,
    profilePhoto: null,

    // Step 4
    bio: "",
    consultationFee: "",
    specializations: [],
    officeAddress: "",
    city: "",
    state: "",
    pincode: "",
  });

  const updateFormData = (data: Partial<LawyerSignupData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.fullName.trim()) {
          toast.error("Please enter your full name");
          return false;
        }
        if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          toast.error("Please enter a valid email address");
          return false;
        }
        if (!formData.phone.trim() || !/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ""))) {
          toast.error("Please enter a valid 10-digit phone number");
          return false;
        }
        if (formData.password.length < 8) {
          toast.error("Password must be at least 8 characters long");
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          toast.error("Passwords do not match");
          return false;
        }
        return true;

      case 2:
        if (!formData.barCouncilNumber.trim()) {
          toast.error("Please enter your Bar Council Number");
          return false;
        }
        if (!formData.barCouncilState) {
          toast.error("Please select your Bar Council State");
          return false;
        }
        if (formData.practiceAreas.length === 0) {
          toast.error("Please select at least one practice area");
          return false;
        }
        if (!formData.yearsOfExperience) {
          toast.error("Please select years of experience");
          return false;
        }
        return true;

      case 3:
        if (!formData.barCertificate) {
          toast.error("Please upload your Bar Certificate");
          return false;
        }
        if (!formData.idProof) {
          toast.error("Please upload your ID Proof");
          return false;
        }
        return true;

      case 4:
        if (!formData.bio.trim() || formData.bio.length < 50) {
          toast.error("Please enter a bio (minimum 50 characters)");
          return false;
        }
        if (!formData.consultationFee || parseFloat(formData.consultationFee) <= 0) {
          toast.error("Please enter a valid consultation fee");
          return false;
        }
        if (formData.specializations.length === 0) {
          toast.error("Please add at least one specialization");
          return false;
        }
        if (!formData.officeAddress.trim()) {
          toast.error("Please enter your office address");
          return false;
        }
        if (!formData.city.trim()) {
          toast.error("Please enter your city");
          return false;
        }
        if (!formData.state.trim()) {
          toast.error("Please enter your state");
          return false;
        }
        if (!formData.pincode.trim() || !/^[0-9]{6}$/.test(formData.pincode)) {
          toast.error("Please enter a valid 6-digit pincode");
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) return;

    setIsSubmitting(true);

    try {
      // Create FormData for file uploads
      const submitData = new FormData();
      
      // Basic info
      submitData.append("fullName", formData.fullName);
      submitData.append("email", formData.email);
      submitData.append("phone", formData.phone);
      submitData.append("password", formData.password);
      submitData.append("role", "LAWYER");

      // Professional details
      submitData.append("barCouncilNumber", formData.barCouncilNumber);
      submitData.append("barCouncilState", formData.barCouncilState);
      submitData.append("practiceAreas", JSON.stringify(formData.practiceAreas));
      submitData.append("yearsOfExperience", formData.yearsOfExperience);
      submitData.append("education", formData.education);
      submitData.append("languages", JSON.stringify(formData.languages));

      // Documents
      if (formData.barCertificate) {
        submitData.append("barCertificate", formData.barCertificate);
      }
      if (formData.idProof) {
        submitData.append("idProof", formData.idProof);
      }
      if (formData.profilePhoto) {
        submitData.append("profilePhoto", formData.profilePhoto);
      }

      // Profile setup
      submitData.append("bio", formData.bio);
      submitData.append("consultationFee", formData.consultationFee);
      submitData.append("specializations", JSON.stringify(formData.specializations));
      submitData.append("officeAddress", formData.officeAddress);
      submitData.append("city", formData.city);
      submitData.append("state", formData.state);
      submitData.append("pincode", formData.pincode);

      const response = await authAPI.register(submitData);

      const { user, token } = response.data.data || response.data;
      setAuth(user, token);

      toast.success("Registration successful! Your account is pending verification.");
      router.push("/lawyer/verification-pending");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1BasicInfo formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <Step2ProfessionalDetails formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <Step3Documents formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <Step4ProfileSetup formData={formData} updateFormData={updateFormData} />;
      case 5:
        return <Step5Review formData={formData} />;
      default:
        return null;
    }
  };

  const stepTitles = [
    "Basic Information",
    "Professional Details",
    "Documents",
    "Profile Setup",
    "Review & Submit",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
            <Scale className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lawyer Registration</h1>
          <p className="text-gray-600">Complete your profile to join our platform</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {Array.from({ length: TOTAL_STEPS }).map((_, index) => {
              const stepNum = index + 1;
              const isActive = stepNum === currentStep;
              const isCompleted = stepNum < currentStep;

              return (
                <div key={stepNum} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                        isCompleted
                          ? "bg-primary-600 text-white"
                          : isActive
                          ? "bg-primary-600 text-white ring-4 ring-primary-200"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {isCompleted ? <Check className="w-5 h-5" /> : stepNum}
                    </div>
                    <p
                      className={`mt-2 text-xs text-center max-w-[100px] ${
                        isActive ? "text-primary-600 font-semibold" : "text-gray-500"
                      }`}
                    >
                      {stepTitles[index]}
                    </p>
                  </div>
                  {stepNum < TOTAL_STEPS && (
                    <div
                      className={`h-1 flex-1 mx-2 transition-all ${
                        isCompleted ? "bg-primary-600" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Card */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl">
              Step {currentStep} of {TOTAL_STEPS}: {stepTitles[currentStep - 1]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1 || isSubmitting}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentStep < TOTAL_STEPS ? (
                <Button type="button" onClick={handleNext} disabled={isSubmitting}>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-primary-600 hover:bg-primary-700"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Submitting...
                    </>
                  ) : (
                    "Submit Registration"
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
