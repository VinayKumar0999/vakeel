import { NextRequest, NextResponse } from "next/server";
import { getPendingAgencies } from "@/lib/admin-helpers";
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

    // Verify user is SUPER_ADMIN or ADMIN (not AGENCY_ADMIN)
    const adminUser = await getUserById(adminUserId);
    if (!adminUser || !["ADMIN", "SUPER_ADMIN"].includes(adminUser.role)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const pendingAgencies = await getPendingAgencies();

    return NextResponse.json({ data: pendingAgencies }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching pending agencies:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch pending agencies" },
      { status: 500 }
    );
  }
}
