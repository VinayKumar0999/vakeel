import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, verifyPassword } from "@/lib/db-helpers";
import { createServerClient } from "@/lib/supabase";
import { getPublicUrl, LAWYER_DOCUMENTS_BUCKET } from "@/lib/storage-helpers";

const supabase = createServerClient();

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check if email is actually a phone number (10 digits)
    const cleanEmail = email.trim();
    const isPhoneNumber = /^[0-9]{10}$/.test(cleanEmail.replace(/\D/g, ""));

    let user;

    if (isPhoneNumber) {
      // Search by phone number
      const cleanPhone = cleanEmail.replace(/\D/g, "");
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("phone", cleanPhone)
        .single();

      if (error || !data) {
        return NextResponse.json(
          { message: "Invalid phone number or password" },
          { status: 401 }
        );
      }
      user = data;
    } else {
      // Search by email
      user = await getUserByEmail(cleanEmail);
      if (!user) {
        return NextResponse.json(
          { message: "Invalid email or password" },
          { status: 401 }
        );
      }
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Fetch profile photo if user is a lawyer/advocate
    let profilePhoto = null;
    if (user.role === 'LAWYER' || user.role === 'ADVOCATE') {
      const { data: profile, error: profileError } = await supabase
        .from('lawyer_profiles')
        .select('profile_photo_path')
        .eq('user_id', user.id)
        .single();
      
      if (profile?.profile_photo_path) {
        // If it's already a full URL, use it directly
        if (profile.profile_photo_path.startsWith('http://') || profile.profile_photo_path.startsWith('https://')) {
          profilePhoto = profile.profile_photo_path;
        } else {
          // Convert relative path to public URL
          // The path stored should be like "profile-photos/user-id-timestamp-filename.jpg"
          profilePhoto = getPublicUrl(LAWYER_DOCUMENTS_BUCKET, profile.profile_photo_path);
        }
      }
    }

    // Format response to match frontend expectations
    // Convert LAWYER role to ADVOCATE
    const userRole = user.role === 'LAWYER' ? 'ADVOCATE' : user.role;
    
    const responseUser = {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      phone: user.phone,
      role: userRole,
      avatar: profilePhoto,
      verificationStatus: user.verification_status,
      createdAt: user.created_at,
    };

    return NextResponse.json(
      {
        data: {
          user: responseUser,
          token: `supabase-token-${user.id}`, // In production, generate proper JWT
          message: "Login successful",
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        message: error.message || "Login failed. Please try again.",
      },
      { status: 500 }
    );
  }
}
