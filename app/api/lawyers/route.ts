import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

const supabase = createServerClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const city = searchParams.get("city") || "";
    const state = searchParams.get("state") || "";
    const practiceArea = searchParams.get("practiceArea") || "";
    const language = searchParams.get("language") || "";
    const minExperience = searchParams.get("minExperience") || "0";
    const maxFee = searchParams.get("maxFee") || "999999";
    const minRating = searchParams.get("minRating") || "0";
    const sortBy = searchParams.get("sortBy") || "relevance";

    // Fetch all lawyer_profiles (no join - avoids relation name / RLS issues)
    let query = supabase.from("lawyer_profiles").select("*");

    if (city) {
      query = query.ilike("city", `%${city}%`);
    }
    if (state) {
      query = query.ilike("state", `%${state}%`);
    }
    if (maxFee && maxFee !== "999999") {
      query = query.lte("consultation_fee", parseFloat(maxFee));
    }

    const { data: profilesData, error: profilesError } = await query;

    if (profilesError) {
      throw new Error(`Failed to fetch lawyers: ${profilesError.message}`);
    }

    const profiles = profilesData || [];
    if (process.env.NODE_ENV === "development") {
      console.log("[GET /api/lawyers] lawyer_profiles count:", profiles.length);
    }
    if (profiles.length === 0) {
      return NextResponse.json(
        { data: [], count: 0 },
        { status: 200, headers: { "Cache-Control": "no-store, max-age=0" } }
      );
    }

    // Fetch linked users by user_id (normalize to string for matching)
    const userIds = [...new Set(profiles.map((p: any) => (p.user_id != null ? String(p.user_id) : null)).filter(Boolean))];
    if (userIds.length === 0) {
      return NextResponse.json({ data: [], count: 0 }, { status: 200, headers: { "Cache-Control": "no-store, max-age=0" } });
    }
    const { data: usersData, error: usersError } = await supabase
      .from("users")
      .select("id, full_name, email, phone, verification_status")
      .in("id", userIds);

    if (usersError) {
      throw new Error(`Failed to fetch users: ${usersError.message}`);
    }

    const usersMap = new Map((usersData || []).map((u: any) => [u.id != null ? String(u.id) : "", u]));

    // Merge and transform (match by string id)
    let lawyers = profiles
      .map((profile: any) => {
        const profileUserId = profile.user_id != null ? String(profile.user_id) : "";
        const user = usersMap.get(profileUserId);
        if (!user) return null;

        const expText = profile.years_of_experience || "0";
        const expMatch = expText.match(/(\d+)/);
        const experience = expMatch ? parseInt(expMatch[1]) : 0;

        return {
          id: profile.user_id,
          name: user.full_name,
          email: user.email,
          phone: user.phone,
          photo: profile.profile_photo_path || null,
          expertise: profile.practice_areas || [],
          specializations: profile.specializations || [],
          experience: expText,
          experienceYears: experience,
          languages: profile.languages || [],
          location: `${profile.city || ""}, ${profile.state || ""}`.replace(/^,\s*|,\s*$/g, "").trim() || "—",
          city: profile.city,
          state: profile.state,
          pincode: profile.pincode,
          rating: 4.5,
          reviews: 0,
          fee: parseFloat(profile.consultation_fee || "0"),
          bio: profile.bio,
          education: profile.education,
          barCouncil: `${profile.bar_council_state || ""}/${profile.bar_council_number || ""}`.replace(/^\/|\/$/g, "") || "—",
          barCouncilNumber: profile.bar_council_number,
          barCouncilState: profile.bar_council_state,
          officeAddress: profile.office_address,
          available: true,
          createdAt: profile.created_at,
        };
      })
      .filter((lawyer: any) => lawyer !== null);

    // Apply practice area filter (multiple)
    if (practiceArea) {
      const areas = practiceArea.split(",").map((a: string) => a.trim().toLowerCase());
      lawyers = lawyers.filter((lawyer: any) =>
        areas.some((area: string) =>
          lawyer.expertise.some((exp: string) =>
            exp.toLowerCase().includes(area)
          )
        )
      );
    }

    // Apply language filter (multiple)
    if (language) {
      const langs = language.split(",").map((l: string) => l.trim().toLowerCase());
      lawyers = lawyers.filter((lawyer: any) =>
        langs.some((lang: string) =>
          lawyer.languages.some((l: string) =>
            l.toLowerCase().includes(lang)
          )
        )
      );
    }

    // Apply search filter (name, location, expertise)
    if (search) {
      const searchLower = search.toLowerCase();
      lawyers = lawyers.filter(
        (lawyer: any) =>
          lawyer.name.toLowerCase().includes(searchLower) ||
          (lawyer.location && lawyer.location.toLowerCase().includes(searchLower)) ||
          (lawyer.expertise || []).some((exp: string) =>
            exp.toLowerCase().includes(searchLower)
          ) ||
          (lawyer.specializations || []).some((spec: string) =>
            spec.toLowerCase().includes(searchLower)
          )
      );
    }

    // Apply experience filter
    if (minExperience && minExperience !== "0") {
      const minExp = parseInt(minExperience);
      lawyers = lawyers.filter(
        (lawyer: any) => lawyer.experienceYears >= minExp
      );
    }

    // Apply rating filter
    if (minRating && minRating !== "0") {
      const minRate = parseFloat(minRating);
      lawyers = lawyers.filter((lawyer: any) => lawyer.rating >= minRate);
    }

    // Sort
    switch (sortBy) {
      case "rating":
        lawyers.sort((a: any, b: any) => b.rating - a.rating);
        break;
      case "experience":
        lawyers.sort((a: any, b: any) => b.experienceYears - a.experienceYears);
        break;
      case "price-low":
        lawyers.sort((a: any, b: any) => a.fee - b.fee);
        break;
      case "price-high":
        lawyers.sort((a: any, b: any) => b.fee - a.fee);
        break;
      default:
        // Relevance: keep original order (could be improved with search ranking)
        break;
    }

    return NextResponse.json(
      {
        data: lawyers,
        count: lawyers.length,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error: any) {
    console.error("Error fetching lawyers:", error);
    return NextResponse.json(
      {
        message: error.message || "Failed to fetch lawyers",
        data: [],
      },
      { status: 500 }
    );
  }
}
