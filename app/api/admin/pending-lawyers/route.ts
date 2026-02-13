import { NextRequest, NextResponse } from "next/server";
import { getPendingLawyers } from "@/lib/admin-helpers";
import { getUserById } from "@/lib/db-helpers";

export async function GET(request: NextRequest) {
  try {
    // Get admin user ID from cookies/auth
    const authStorage = request.cookies.get("auth-storage")?.value;
    if (!authStorage) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const authData = JSON.parse(decodeURIComponent(authStorage));
    const adminUserId = authData.state?.user?.id;

    if (!adminUserId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Verify user is admin
    const adminUser = await getUserById(adminUserId);
    if (!adminUser || !["ADMIN", "SUPER_ADMIN", "AGENCY_ADMIN"].includes(adminUser.role)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const pendingLawyers = await getPendingLawyers(adminUserId);

    return NextResponse.json({ data: pendingLawyers }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching pending lawyers:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch pending lawyers" },
      { status: 500 }
    );
  }
}
