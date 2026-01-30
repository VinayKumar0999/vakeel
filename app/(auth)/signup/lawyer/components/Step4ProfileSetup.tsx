"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus } from "lucide-react";
import { useState } from "react";
import type { LawyerSignupData } from "../page";

interface Step4ProfileSetupProps {
  formData: LawyerSignupData;
  updateFormData: (data: Partial<LawyerSignupData>) => void;
}

export default function Step4ProfileSetup({ formData, updateFormData }: Step4ProfileSetupProps) {
  const [specializationInput, setSpecializationInput] = useState("");

  const addSpecialization = () => {
    if (specializationInput.trim() && !formData.specializations.includes(specializationInput.trim())) {
      updateFormData({
        specializations: [...formData.specializations, specializationInput.trim()],
      });
      setSpecializationInput("");
    }
  };

  const removeSpecialization = (spec: string) => {
    updateFormData({
      specializations: formData.specializations.filter((s) => s !== spec),
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="bio">
          Professional Bio <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="bio"
          placeholder="Tell us about your legal expertise, achievements, and what makes you unique..."
          value={formData.bio}
          onChange={(e) => updateFormData({ bio: e.target.value })}
          rows={5}
          required
        />
        <p className="text-xs text-gray-500">
          Minimum 50 characters. This will be visible on your profile.
        </p>
        <p className={`text-xs ${formData.bio.length >= 50 ? 'text-green-600' : 'text-red-500'}`}>
          {formData.bio.length} / 50 characters {formData.bio.length >= 50 ? '✓' : ''}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="consultationFee">
          Consultation Fee (₹) <span className="text-red-500">*</span>
        </Label>
        <Input
          id="consultationFee"
          type="number"
          placeholder="1000"
          value={formData.consultationFee}
          onChange={(e) => updateFormData({ consultationFee: e.target.value })}
          min="0"
          step="100"
          required
        />
        <p className="text-xs text-gray-500">Per consultation session</p>
      </div>

      <div className="space-y-2">
        <Label>
          Specializations <span className="text-red-500">*</span>
        </Label>
        <p className="text-xs text-gray-500 mb-2">
          Add specific areas where you excel (e.g., "Corporate Mergers", "Criminal Defense")
        </p>
        <div className="flex gap-2">
          <Input
            placeholder="Add specialization"
            value={specializationInput}
            onChange={(e) => setSpecializationInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSpecialization();
              }
            }}
          />
          <button
            type="button"
            onClick={addSpecialization}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {formData.specializations.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.specializations.map((spec) => (
              <span
                key={spec}
                className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
              >
                {spec}
                <button
                  type="button"
                  onClick={() => removeSpecialization(spec)}
                  className="hover:text-primary-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-red-500 mt-2">
            ⚠️ Please add at least one specialization
          </p>
        )}
      </div>

      <div className="space-y-4 border-t pt-4">
        <h3 className="font-semibold text-lg">Office Address</h3>

        <div className="space-y-2">
          <Label htmlFor="officeAddress">
            Street Address <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="officeAddress"
            placeholder="Building name, street, area"
            value={formData.officeAddress}
            onChange={(e) => updateFormData({ officeAddress: e.target.value })}
            rows={2}
            required
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">
              City <span className="text-red-500">*</span>
            </Label>
            <Input
              id="city"
              type="text"
              placeholder="Mumbai"
              value={formData.city}
              onChange={(e) => updateFormData({ city: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">
              State <span className="text-red-500">*</span>
            </Label>
            <Input
              id="state"
              type="text"
              placeholder="Maharashtra"
              value={formData.state}
              onChange={(e) => updateFormData({ state: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pincode">
              Pincode <span className="text-red-500">*</span>
            </Label>
            <Input
              id="pincode"
              type="text"
              placeholder="400001"
              value={formData.pincode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                if (value.length <= 6) {
                  updateFormData({ pincode: value });
                }
              }}
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
}
