"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { LawyerSignupData } from "../page";

interface Step4ProfileSetupProps {
  formData: LawyerSignupData;
  updateFormData: (data: Partial<LawyerSignupData>) => void;
}

export default function Step4ProfileSetup({ formData, updateFormData }: Step4ProfileSetupProps) {
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
