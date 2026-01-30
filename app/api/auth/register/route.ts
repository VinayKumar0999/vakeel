import { NextRequest, NextResponse } from "next/server";
import { createUser, createLawyerProfile, emailExists, phoneExists } from "@/lib/db-helpers";
import { uploadLawyerDocuments } from "@/lib/storage-helpers";

export async function POST(request: NextRequest) {
  try {
    // Handle both JSON and FormData requests
    const contentType = request.headers.get("content-type") || "";
    let formData: FormData;
    let isJsonRequest = false;

    if (contentType.includes("application/json")) {
      // Client registration sends JSON
      isJsonRequest = true;
      const jsonData = await request.json();
      // Convert JSON to FormData for unified handling
      formData = new FormData();
      Object.keys(jsonData).forEach((key) => {
        formData.append(key, String(jsonData[key]));
      });
    } else {
      // Lawyer registration sends FormData (multipart/form-data)
      formData = await request.formData();
    }

    const role = formData.get("role") as string;

    // Handle Lawyer Registration
    if (role === "LAWYER") {
      // Extract text fields
      const fullName = formData.get("fullName") as string;
      const email = formData.get("email") as string;
      const phone = formData.get("phone") as string;
      const password = formData.get("password") as string;
      const barCouncilNumber = formData.get("barCouncilNumber") as string;
      const barCouncilState = formData.get("barCouncilState") as string;
      const practiceAreas = formData.get("practiceAreas") as string;
      const yearsOfExperience = formData.get("yearsOfExperience") as string;
      const education = formData.get("education") as string;
      const languages = formData.get("languages") as string;
      const bio = formData.get("bio") as string;
      const consultationFee = formData.get("consultationFee") as string;
      const specializations = formData.get("specializations") as string;
      const officeAddress = formData.get("officeAddress") as string;
      const city = formData.get("city") as string;
      const state = formData.get("state") as string;
      const pincode = formData.get("pincode") as string;

      // Validate required fields
      const requiredFields = {
        fullName,
        email,
        phone,
        password,
        barCouncilNumber,
        barCouncilState,
        practiceAreas,
        yearsOfExperience,
        bio,
        consultationFee,
        specializations,
        officeAddress,
        city,
        state,
        pincode,
      };

      for (const [field, value] of Object.entries(requiredFields)) {
        if (!value || (typeof value === "string" && value.trim() === "")) {
          return NextResponse.json(
            { message: `${field} is required` },
            { status: 400 }
          );
        }
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { message: "Invalid email format" },
          { status: 400 }
        );
      }

      // Validate phone (10 digits)
      const cleanPhone = phone.replace(/\D/g, "");
      if (!/^[0-9]{10}$/.test(cleanPhone)) {
        return NextResponse.json(
          { message: "Invalid phone number. Must be 10 digits" },
          { status: 400 }
        );
      }

      // Validate password length
      if (password.length < 8) {
        return NextResponse.json(
          { message: "Password must be at least 8 characters" },
          { status: 400 }
        );
      }

      // Validate bio length
      if (bio.length < 50) {
        return NextResponse.json(
          { message: "Bio must be at least 50 characters" },
          { status: 400 }
        );
      }

      // Validate pincode (6 digits)
      if (!/^[0-9]{6}$/.test(pincode)) {
        return NextResponse.json(
          { message: "Invalid pincode. Must be 6 digits" },
          { status: 400 }
        );
      }

      // Validate consultation fee
      const fee = parseFloat(consultationFee);
      if (isNaN(fee) || fee <= 0) {
        return NextResponse.json(
          { message: "Invalid consultation fee" },
          { status: 400 }
        );
      }

      // Check if email or phone already exists
      if (await emailExists(email)) {
        return NextResponse.json(
          { message: "Advocate already registered" },
          { status: 400 }
        );
      }

      if (await phoneExists(cleanPhone)) {
        return NextResponse.json(
          { message: "Phone number already registered" },
          { status: 400 }
        );
      }

      // Handle file uploads
      const barCertificate = formData.get("barCertificate") as File | null;
      const idProof = formData.get("idProof") as File | null;
      const profilePhoto = formData.get("profilePhoto") as File | null;

      if (!barCertificate) {
        return NextResponse.json(
          { message: "Bar Certificate is required" },
          { status: 400 }
        );
      }

      if (!idProof) {
        return NextResponse.json(
          { message: "ID Proof is required" },
          { status: 400 }
        );
      }

      // Parse JSON arrays
      let practiceAreasArr: string[] = [];
      let languagesArr: string[] = [];
      let specializationsArr: string[] = [];

      try {
        practiceAreasArr = JSON.parse(practiceAreas);
        languagesArr = JSON.parse(languages);
        specializationsArr = JSON.parse(specializations);
      } catch (e) {
        return NextResponse.json(
          { message: "Invalid JSON format in arrays" },
          { status: 400 }
        );
      }

      // Validate arrays
      if (!Array.isArray(practiceAreasArr) || practiceAreasArr.length === 0) {
        return NextResponse.json(
          { message: "At least one practice area is required" },
          { status: 400 }
        );
      }

      if (!Array.isArray(languagesArr) || languagesArr.length === 0) {
        return NextResponse.json(
          { message: "At least one language is required" },
          { status: 400 }
        );
      }

      if (!Array.isArray(specializationsArr) || specializationsArr.length === 0) {
        return NextResponse.json(
          { message: "At least one specialization is required" },
          { status: 400 }
        );
      }

      // Create user first
      const user = await createUser({
        fullName,
        email,
        phone: cleanPhone,
        password,
        role: "LAWYER",
      });

      // Upload documents to Supabase Storage
      const documentPaths = await uploadLawyerDocuments(user.id, {
        barCertificate,
        idProof,
        profilePhoto: profilePhoto || undefined,
      });

      // Create lawyer profile
      const lawyerProfile = await createLawyerProfile({
        userId: user.id,
        barCouncilNumber,
        barCouncilState,
        practiceAreas: practiceAreasArr,
        yearsOfExperience,
        education,
        languages: languagesArr,
        bio,
        consultationFee: fee,
        specializations: specializationsArr,
        officeAddress,
        city,
        state,
        pincode,
        barCertificatePath: documentPaths.barCertificatePath,
        idProofPath: documentPaths.idProofPath,
        profilePhotoPath: documentPaths.profilePhotoPath,
      });

      // Format response to match frontend expectations
      const responseUser = {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        verificationStatus: user.verification_status,
        createdAt: user.created_at,
      };

      return NextResponse.json(
        {
          data: {
            user: responseUser,
            lawyerProfile: {
              ...lawyerProfile,
              practiceAreas: lawyerProfile.practice_areas,
              yearsOfExperience: lawyerProfile.years_of_experience,
              consultationFee: lawyerProfile.consultation_fee,
              officeAddress: lawyerProfile.office_address,
              barCouncilNumber: lawyerProfile.bar_council_number,
              barCouncilState: lawyerProfile.bar_council_state,
              barCertificatePath: lawyerProfile.bar_certificate_path,
              idProofPath: lawyerProfile.id_proof_path,
              profilePhotoPath: lawyerProfile.profile_photo_path,
            },
            token: `supabase-token-${user.id}`, // In production, generate proper JWT
            message: "Registration successful. Welcome to Vakeel Kutami.",
          },
        },
        { status: 201 }
      );
    }

    // Handle Client Registration
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;

    // Validate client registration
    if (!fullName || !email || !phone || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate phone
    const cleanPhone = phone.replace(/\D/g, "");
    if (!/^[0-9]{10}$/.test(cleanPhone)) {
      return NextResponse.json(
        { message: "Invalid phone number. Must be 10 digits" },
        { status: 400 }
      );
    }

    // Validate password
    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Check if email or phone already exists
    if (await emailExists(email)) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400 }
      );
    }

    if (await phoneExists(cleanPhone)) {
      return NextResponse.json(
        { message: "Phone number already registered" },
        { status: 400 }
      );
    }

    // Create user
    const user = await createUser({
      fullName,
      email,
      phone: cleanPhone,
      password,
      role: "CLIENT",
    });

    // Format response
    const responseUser = {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.created_at,
    };

    return NextResponse.json(
      {
        data: {
          user: responseUser,
          token: `supabase-token-${user.id}`, // In production, generate proper JWT
          message: "Account created successfully!",
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        message: error.message || "Registration failed. Please try again.",
      },
      { status: 500 }
    );
  }
}
