"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload, File, X } from "lucide-react";
import { useState } from "react";
import type { LawyerSignupData } from "../page";

interface Step3DocumentsProps {
  formData: LawyerSignupData;
  updateFormData: (data: Partial<LawyerSignupData>) => void;
}

export default function Step3Documents({ formData, updateFormData }: Step3DocumentsProps) {
  const handleFileChange = (field: "barCertificate" | "idProof" | "profilePhoto", file: File | null) => {
    updateFormData({ [field]: file });
  };

  const FileUploadField = ({
    label,
    field,
    required,
    accept,
    description,
  }: {
    label: string;
    field: "barCertificate" | "idProof" | "profilePhoto";
    required?: boolean;
    accept?: string;
    description?: string;
  }) => {
    const file = formData[field];
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileChange(field, e.dataTransfer.files[0]);
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        handleFileChange(field, e.target.files[0]);
      }
    };

    return (
      <div className="space-y-2">
        <Label>
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        {description && <p className="text-xs text-gray-500">{description}</p>}
        <div
          className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
            dragActive ? "border-primary-500 bg-primary-50" : "border-gray-300"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {file ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <File className="w-8 h-8 text-primary-600" />
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleFileChange(field, null)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center cursor-pointer">
              <Upload className="w-10 h-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500">PDF, PNG, JPG (Max 5MB)</p>
              <Input
                type="file"
                accept={accept || "image/*,application/pdf"}
                onChange={handleChange}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Please ensure all documents are clear and legible. Your account
          will be verified before activation.
        </p>
      </div>

      <FileUploadField
        label="Bar Council Certificate"
        field="barCertificate"
        required
        accept="application/pdf,image/*"
        description="Upload your Bar Council enrollment certificate"
      />

      <FileUploadField
        label="ID Proof"
        field="idProof"
        required
        accept="image/*,application/pdf"
        description="Aadhar Card, PAN Card, or Passport"
      />

      <FileUploadField
        label="Profile Photo"
        field="profilePhoto"
        accept="image/*"
        description="Professional photo (optional but recommended)"
      />
    </div>
  );
}
