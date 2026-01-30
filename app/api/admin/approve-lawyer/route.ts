import { NextRequest, NextResponse } from "next/server";
import { approveLawyer, canApproveLawyer } from "@/lib/admin-helpers";
import { getUserById } from "@/lib/db-helpers";

export async function POST(request: NextRequest) {
  try {
    const { lawyerId, action, notes } = await request.json();

    if (!lawyerId || !action || !["APPROVED", "REJECTED"].includes(action)) {
      return NextResponse.json(
        { message: "Invalid request. lawyerId and action (APPROVED/REJECTED) are required." },
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

    // Verify user can approve this lawyer
    const canApprove = await canApproveLawyer(adminUserId, lawyerId);
    if (!canApprove) {
      return NextResponse.json(
        { message: "You don't have permission to approve this lawyer" },
        { status: 403 }
      );
    }

    // Approve/reject lawyer
    const result = await approveLawyer(lawyerId, adminUserId, action, notes);

    return NextResponse.json(
      {
        data: result,
        message: `Lawyer ${action.toLowerCase()} successfully`,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error approving lawyer:", error);
    return NextResponse.json(
      { message: error.message || "Failed to approve lawyer" },
      { status: 500 }
    );
  }
}
