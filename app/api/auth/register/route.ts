import { NextRequest, NextResponse } from "next/server";
import { createUser, createLawyerProfile, emailExists, phoneExists } from "@/lib/db-helpers";
import { uploadLawyerDocuments } from "@/lib/storage-helpers";

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    const isJsonRequest = contentType.includes("application/json");

    // Advocate signup without files sends JSON; client signup sends JSON; legacy FormData with files supported
    let body: Record<string, unknown> = {};
    let formData: FormData | null = null;

    if (isJsonRequest) {
      body = (await request.json()) as Record<string, unknown>;
    } else {
      formData = await request.formData();
    }

    const role = (isJsonRequest ? body.role : formData!.get("role")) as string;

    // Handle Lawyer/Advocate Registration
    if (role === "LAWYER") {
      const fullName = (isJsonRequest ? body.fullName : formData!.get("fullName")) as string;
      const email = (isJsonRequest ? body.email : formData!.get("email")) as string;
      const phone = (isJsonRequest ? body.phone : formData!.get("phone")) as string;
      const password = (isJsonRequest ? body.password : formData!.get("password")) as string;
      const barCouncilNumber = (isJsonRequest ? body.barCouncilNumber : formData!.get("barCouncilNumber")) as string;
      const barCouncilState = (isJsonRequest ? body.barCouncilState : formData!.get("barCouncilState")) as string;
      const yearsOfExperience = (isJsonRequest ? body.yearsOfExperience : formData!.get("yearsOfExperience")) as string;
      const education = (isJsonRequest ? body.education : formData!.get("education")) as string;
      const bio = (isJsonRequest ? body.bio : formData!.get("bio")) as string;
      const consultationFee = (isJsonRequest ? body.consultationFee : formData!.get("consultationFee")) as string;
      const officeAddress = (isJsonRequest ? body.officeAddress : formData!.get("officeAddress")) as string;
      const city = (isJsonRequest ? body.city : formData!.get("city")) as string;
      const state = (isJsonRequest ? body.state : formData!.get("state")) as string;
      const pincode = (isJsonRequest ? body.pincode : formData!.get("pincode")) as string;

      let practiceAreasArr: string[] = [];
      let languagesArr: string[] = [];
      let specializationsArr: string[] = [];

      if (isJsonRequest) {
        practiceAreasArr = Array.isArray(body.practiceAreas) ? (body.practiceAreas as string[]) : [];
        languagesArr = Array.isArray(body.languages) ? (body.languages as string[]) : [];
        specializationsArr = Array.isArray(body.specializations) ? (body.specializations as string[]) : practiceAreasArr;
      } else {
        try {
          practiceAreasArr = JSON.parse((formData!.get("practiceAreas") as string) || "[]");
          languagesArr = JSON.parse((formData!.get("languages") as string) || "[]");
          specializationsArr = JSON.parse((formData!.get("specializations") as string) || "[]");
        } catch (e) {
          return NextResponse.json(
            { message: "Invalid JSON format in arrays" },
            { status: 400 }
          );
        }
      }

      const requiredFields: Record<string, unknown> = {
        fullName,
        email,
        phone,
        password,
        barCouncilNumber,
        barCouncilState,
        yearsOfExperience,
        bio,
        consultationFee,
        officeAddress,
        city,
        state,
        pincode,
      };

      for (const [field, value] of Object.entries(requiredFields)) {
        if (value == null || (typeof value === "string" && value.trim() === "")) {
          return NextResponse.json(
            { message: `${field} is required` },
            { status: 400 }
          );
        }
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { message: "Invalid email format" },
          { status: 400 }
        );
      }

      const cleanPhone = phone.replace(/\D/g, "");
      if (!/^[0-9]{10}$/.test(cleanPhone)) {
        return NextResponse.json(
          { message: "Invalid phone number. Must be 10 digits" },
          { status: 400 }
        );
      }

      if (password.length < 8) {
        return NextResponse.json(
          { message: "Password must be at least 8 characters" },
          { status: 400 }
        );
      }

      if (bio.length < 50) {
        return NextResponse.json(
          { message: "Bio must be at least 50 characters" },
          { status: 400 }
        );
      }

      if (!/^[0-9]{6}$/.test(pincode)) {
        return NextResponse.json(
          { message: "Invalid pincode. Must be 6 digits" },
          { status: 400 }
        );
      }

      const fee = parseFloat(consultationFee);
      if (isNaN(fee) || fee <= 0) {
        return NextResponse.json(
          { message: "Invalid consultation fee" },
          { status: 400 }
        );
      }

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
        specializationsArr = practiceAreasArr;
      }

      const user = await createUser({
        fullName,
        email,
        phone: cleanPhone,
        password,
        role: "LAWYER",
      });

      let documentPaths: { barCertificatePath?: string; idProofPath?: string; profilePhotoPath?: string } = {};
      if (formData) {
        const barCertificate = formData.get("barCertificate") as File | null;
        const idProof = formData.get("idProof") as File | null;
        const profilePhoto = formData.get("profilePhoto") as File | null;
        if (barCertificate || idProof || profilePhoto) {
          documentPaths = await uploadLawyerDocuments(user.id, {
            barCertificate: barCertificate || undefined,
            idProof: idProof || undefined,
            profilePhoto: profilePhoto || undefined,
          });
        }
      }

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
      // Convert LAWYER role to ADVOCATE for frontend
      const userRole = user.role === 'LAWYER' ? 'ADVOCATE' : user.role;
      
      // Use profile photo from lawyer profile (stored in DB) or from uploaded paths
      const profilePhotoUrl = lawyerProfile.profile_photo_path || documentPaths.profilePhotoPath || null;
      
      const responseUser = {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        phone: user.phone,
        role: userRole,
        avatar: profilePhotoUrl,
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
    const fullName = (isJsonRequest ? body.fullName : formData!.get("fullName")) as string;
    const email = (isJsonRequest ? body.email : formData!.get("email")) as string;
    const phone = (isJsonRequest ? body.phone : formData!.get("phone")) as string;
    const password = (isJsonRequest ? body.password : formData!.get("password")) as string;

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
    const message =
      error?.message ||
      (error?.cause && String(error.cause)) ||
      "Registration failed. Please try again.";
    const isSupabaseDown =
      message.includes("Supabase is unavailable") ||
      message.includes("fetch failed") ||
      message.includes("ECONNREFUSED") ||
      message.includes("521") ||
      message.toLowerCase().includes("timed out") ||
      message.toLowerCase().includes("timeout");
    return NextResponse.json(
      {
        message,
        ...(isSupabaseDown && {
          hint: "Supabase may be paused or slow. Go to https://supabase.com/dashboard → your project → Settings → General → Resume project (if paused). Then try again.",
        }),
      },
      { status: 500 }
    );
  }
}
