import { NextRequest, NextResponse } from "next/server";
import { approveAgency } from "@/lib/admin-helpers";
import { getUserById } from "@/lib/db-helpers";

export async function POST(request: NextRequest) {
  try {
    const { agencyId, action, notes } = await request.json();

    if (!agencyId || !action || !["APPROVED", "REJECTED"].includes(action)) {
      return NextResponse.json(
        { message: "Invalid request. agencyId and action (APPROVED/REJECTED) are required." },
        { status: 400 }
      );
    }

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
      return NextResponse.json(
        { message: "Only platform admins can approve agencies" },
        { status: 403 }
      );
    }

    // Approve/reject agency
    const result = await approveAgency(agencyId, adminUserId, action, notes);

    return NextResponse.json(
      {
        data: result,
        message: `Agency ${action.toLowerCase()} successfully`,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error approving agency:", error);
    return NextResponse.json(
      { message: error.message || "Failed to approve agency" },
      { status: 500 }
    );
  }
}
