"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import type { LawyerSignupData } from "../page";

interface Step2ProfessionalDetailsProps {
  formData: LawyerSignupData;
  updateFormData: (data: Partial<LawyerSignupData>) => void;
}

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Puducherry",
];

const PRACTICE_AREAS = [
  "Criminal Law",
  "Civil Law",
  "Corporate Law",
  "Family Law",
  "Property Law",
  "Tax Law",
  "Intellectual Property",
  "Labor Law",
  "Constitutional Law",
  "Environmental Law",
  "Immigration Law",
  "Banking & Finance",
  "Real Estate",
  "Medical Negligence",
  "Consumer Protection",
  "Cyber Law",
  "Arbitration & Mediation",
];

const LANGUAGES = [
  "Hindi",
  "English",
  "Bengali",
  "Telugu",
  "Marathi",
  "Tamil",
  "Gujarati",
  "Kannada",
  "Malayalam",
  "Punjabi",
  "Odia",
  "Assamese",
  "Urdu",
];

const EXPERIENCE_YEARS = ["0-1", "1-3", "3-5", "5-10", "10-15", "15+"];

export default function Step2ProfessionalDetails({
  formData,
  updateFormData,
}: Step2ProfessionalDetailsProps) {
  const togglePracticeArea = (area: string) => {
    const updated = formData.practiceAreas.includes(area)
      ? formData.practiceAreas.filter((a) => a !== area)
      : [...formData.practiceAreas, area];
    updateFormData({ practiceAreas: updated });
  };

  const toggleLanguage = (lang: string) => {
    const updated = formData.languages.includes(lang)
      ? formData.languages.filter((l) => l !== lang)
      : [...formData.languages, lang];
    updateFormData({ languages: updated });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="barCouncilNumber">
            Bar Council Number <span className="text-red-500">*</span>
          </Label>
          <Input
            id="barCouncilNumber"
            type="text"
            placeholder="BCN123456"
            value={formData.barCouncilNumber}
            onChange={(e) => updateFormData({ barCouncilNumber: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="barCouncilState">
            Bar Council State <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.barCouncilState}
            onValueChange={(value) => updateFormData({ barCouncilState: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent>
              {INDIAN_STATES.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>
          Practice Areas <span className="text-red-500">*</span>
        </Label>
        <p className="text-xs text-gray-500 mb-2">Select all that apply</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto border rounded-md p-4">
          {PRACTICE_AREAS.map((area) => (
            <div key={area} className="flex items-center space-x-2">
              <Checkbox
                id={`practice-${area}`}
                checked={formData.practiceAreas.includes(area)}
                onCheckedChange={() => togglePracticeArea(area)}
              />
              <label
                htmlFor={`practice-${area}`}
                className="text-sm font-medium leading-none cursor-pointer"
              >
                {area}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="yearsOfExperience">
          Years of Experience <span className="text-red-500">*</span>
        </Label>
        <Select
          value={formData.yearsOfExperience}
          onValueChange={(value) => updateFormData({ yearsOfExperience: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select experience" />
          </SelectTrigger>
          <SelectContent>
            {EXPERIENCE_YEARS.map((years) => (
              <SelectItem key={years} value={years}>
                {years} years
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="education">
          Education <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="education"
          placeholder="LLB from XYZ University, LLM from ABC College..."
          value={formData.education}
          onChange={(e) => updateFormData({ education: e.target.value })}
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>
          Languages Spoken <span className="text-red-500">*</span>
        </Label>
        <p className="text-xs text-gray-500 mb-2">Select all languages you can communicate in</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto border rounded-md p-4">
          {LANGUAGES.map((lang) => (
            <div key={lang} className="flex items-center space-x-2">
              <Checkbox
                id={`lang-${lang}`}
                checked={formData.languages.includes(lang)}
                onCheckedChange={() => toggleLanguage(lang)}
              />
              <label
                htmlFor={`lang-${lang}`}
                className="text-sm font-medium leading-none cursor-pointer"
              >
                {lang}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
