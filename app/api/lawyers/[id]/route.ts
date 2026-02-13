import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

const supabase = createServerClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: lawyerId } = await params;

    if (!lawyerId) {
      return NextResponse.json(
        { message: "Lawyer ID is required" },
        { status: 400 }
      );
    }

    // Fetch lawyer profile (no join)
    const { data: profile, error: profileError } = await supabase
      .from("lawyer_profiles")
      .select("*")
      .eq("user_id", lawyerId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { message: "Advocate not found" },
        { status: 404 }
      );
    }

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id, full_name, email, phone, verification_status")
      .eq("id", lawyerId)
      .single();

    if (userError || !userData) {
      return NextResponse.json(
        { message: "Advocate not found" },
        { status: 404 }
      );
    }

    const data = profile;
    const user = userData;

    // Parse experience
    const expText = data.years_of_experience || "0";
    const expMatch = expText.match(/(\d+)/);
    const experienceYears = expMatch ? parseInt(expMatch[1]) : 0;

    // Format lawyer data
    const lawyer = {
      id: data.user_id,
      name: user.full_name,
      email: user.email,
      phone: user.phone,
      photo: data.profile_photo_path || null,
      expertise: data.practice_areas || [],
      specializations: data.specializations || [],
      experience: expText,
      experienceYears,
      languages: data.languages || [],
      location: `${data.city}, ${data.state}`,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      rating: 4.5, // TODO: Calculate from reviews
      reviews: 0, // TODO: Count from reviews
      fee: parseFloat(data.consultation_fee || "0"),
      bio: data.bio,
      education: data.education,
      barCouncil: `${data.bar_council_state}/${data.bar_council_number}`,
      barCouncilNumber: data.bar_council_number,
      barCouncilState: data.bar_council_state,
      officeAddress: data.office_address,
      barCertificatePath: data.bar_certificate_path,
      idProofPath: data.id_proof_path,
      createdAt: data.created_at,
    };

    return NextResponse.json({ data: lawyer }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching lawyer:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch lawyer" },
      { status: 500 }
    );
  }
}
