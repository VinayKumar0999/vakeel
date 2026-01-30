"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  UserCheck, 
  Building2, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Eye,
  FileText,
  MapPin,
  Briefcase,
  DollarSign
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import toast from "react-hot-toast";
import Link from "next/link";

interface PendingLawyer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  createdAt: string;
  barCouncilNumber: string;
  barCouncilState: string;
  practiceAreas: string[];
  yearsOfExperience: string;
  education: string;
  bio: string;
  consultationFee: number;
  city: string;
  state: string;
  barCertificatePath: string | null;
  idProofPath: string | null;
  profilePhotoPath: string | null;
  agencyId: string | null;
  agencyName: string | null;
}

interface PendingAgency {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  description: string | null;
  agencyAdminId: string | null;
  agencyAdminName: string | null;
  createdAt: string;
}

export default function AdminApprovalsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [pendingLawyers, setPendingLawyers] = useState<PendingLawyer[]>([]);
  const [pendingAgencies, setPendingAgencies] = useState<PendingAgency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("lawyers");

  useEffect(() => {
    // Check if user is admin
    if (!isAuthenticated || !user) {
      router.push("/login?redirect=/admin/approvals");
      return;
    }

    if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN" && user.role !== "AGENCY_ADMIN") {
      toast.error("Access denied. Admin privileges required.");
      router.push("/dashboard/client");
      return;
    }

    fetchPendingApprovals();
  }, [isAuthenticated, user, router]);

  const fetchPendingApprovals = async () => {
    try {
      setIsLoading(true);
      
      const [lawyersRes, agenciesRes] = await Promise.all([
        fetch("/api/admin/pending-lawyers"),
        user?.role === "SUPER_ADMIN" || user?.role === "ADMIN"
          ? fetch("/api/admin/pending-agencies")
          : Promise.resolve({ json: () => Promise.resolve([]) }),
      ]);

      if (lawyersRes.ok) {
        const lawyersData = await lawyersRes.json();
        setPendingLawyers(lawyersData.data || []);
      }

      if (agenciesRes.ok && (user?.role === "SUPER_ADMIN" || user?.role === "ADMIN")) {
        const agenciesData = await agenciesRes.json();
        setPendingAgencies(agenciesData.data || []);
      }
    } catch (error) {
      console.error("Error fetching pending approvals:", error);
      toast.error("Failed to load pending approvals");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveLawyer = async (lawyerId: string) => {
    if (!confirm("Are you sure you want to approve this lawyer?")) return;

    try {
      const response = await fetch(`/api/admin/approve-lawyer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lawyerId, action: "APPROVED" }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Lawyer approved successfully!");
        fetchPendingApprovals();
      } else {
        toast.error(data.message || "Failed to approve lawyer");
      }
    } catch (error) {
      toast.error("Failed to approve lawyer");
    }
  };

  const handleRejectLawyer = async (lawyerId: string) => {
    const notes = prompt("Please provide a reason for rejection:");
    if (!notes) return;

    try {
      const response = await fetch(`/api/admin/approve-lawyer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lawyerId, action: "REJECTED", notes }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Lawyer rejected");
        fetchPendingApprovals();
      } else {
        toast.error(data.message || "Failed to reject lawyer");
      }
    } catch (error) {
      toast.error("Failed to reject lawyer");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pending approvals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Pending Approvals</h1>
          <p className="text-slate-600">Review and approve lawyer and agency registrations</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="lawyers" className="flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              Lawyers ({pendingLawyers.length})
            </TabsTrigger>
            {(user?.role === "SUPER_ADMIN" || user?.role === "ADMIN") && (
              <TabsTrigger value="agencies" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Agencies ({pendingAgencies.length})
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="lawyers" className="space-y-4">
            {pendingLawyers.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <p className="text-slate-600 text-lg">No pending lawyer approvals</p>
                </CardContent>
              </Card>
            ) : (
              pendingLawyers.map((lawyer) => (
                <Card key={lawyer.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{lawyer.fullName}</CardTitle>
                        <div className="flex flex-wrap gap-2 text-sm text-slate-600">
                          <span>{lawyer.email}</span>
                          <span>•</span>
                          <span>{lawyer.phone}</span>
                          {lawyer.agencyName && (
                            <>
                              <span>•</span>
                              <Badge variant="outline">{lawyer.agencyName}</Badge>
                            </>
                          )}
                        </div>
                      </div>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(lawyer.createdAt)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-slate-700">Bar Council:</span>
                          <p className="text-slate-900">{lawyer.barCouncilNumber} ({lawyer.barCouncilState})</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-slate-700">Experience:</span>
                          <p className="text-slate-900">{lawyer.yearsOfExperience} years</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-slate-700">Education:</span>
                          <p className="text-slate-900">{lawyer.education}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-slate-700">Location:</span>
                          <p className="text-slate-900">{lawyer.city}, {lawyer.state}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-slate-700">Consultation Fee:</span>
                          <p className="text-slate-900">₹{lawyer.consultationFee}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-slate-700">Practice Areas:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {lawyer.practiceAreas.map((area) => (
                              <Badge key={area} variant="secondary">{area}</Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-slate-700">Bio:</span>
                          <p className="text-slate-900 text-sm line-clamp-3">{lawyer.bio}</p>
                        </div>
                        <div className="flex gap-2">
                          {lawyer.barCertificatePath && (
                            <a
                              href={lawyer.barCertificatePath}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                            >
                              <FileText className="w-4 h-4" />
                              Bar Certificate
                            </a>
                          )}
                          {lawyer.idProofPath && (
                            <a
                              href={lawyer.idProofPath}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                            >
                              <FileText className="w-4 h-4" />
                              ID Proof
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 pt-4 border-t">
                      <Button
                        onClick={() => handleApproveLawyer(lawyer.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleRejectLawyer(lawyer.id)}
                        variant="destructive"
                        className="flex-1"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                      <Link href={`/admin/lawyers/${lawyer.id}`}>
                        <Button variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {(user?.role === "SUPER_ADMIN" || user?.role === "ADMIN") && (
            <TabsContent value="agencies" className="space-y-4">
              {pendingAgencies.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <p className="text-slate-600 text-lg">No pending agency approvals</p>
                  </CardContent>
                </Card>
              ) : (
                pendingAgencies.map((agency) => (
                  <Card key={agency.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{agency.name}</CardTitle>
                          <div className="flex flex-wrap gap-2 text-sm text-slate-600">
                            <span>{agency.email}</span>
                            <span>•</span>
                            <span>{agency.phone}</span>
                            {agency.agencyAdminName && (
                              <>
                                <span>•</span>
                                <span>Admin: {agency.agencyAdminName}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(agency.createdAt)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 mb-6">
                        <div>
                          <span className="text-sm font-medium text-slate-700">Address:</span>
                          <p className="text-slate-900">{agency.address}, {agency.city}, {agency.state}</p>
                        </div>
                        {agency.description && (
                          <div>
                            <span className="text-sm font-medium text-slate-700">Description:</span>
                            <p className="text-slate-900">{agency.description}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-3 pt-4 border-t">
                        <Button
                          onClick={async () => {
                            if (!confirm("Approve this agency?")) return;
                            try {
                              const res = await fetch("/api/admin/approve-agency", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ agencyId: agency.id, action: "APPROVED" }),
                              });
                              const data = await res.json();
                              if (res.ok) {
                                toast.success("Agency approved!");
                                fetchPendingApprovals();
                              } else {
                                toast.error(data.message);
                              }
                            } catch (error) {
                              toast.error("Failed to approve agency");
                            }
                          }}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          onClick={async () => {
                            const notes = prompt("Rejection reason:");
                            if (!notes) return;
                            try {
                              const res = await fetch("/api/admin/approve-agency", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ agencyId: agency.id, action: "REJECTED", notes }),
                              });
                              const data = await res.json();
                              if (res.ok) {
                                toast.success("Agency rejected");
                                fetchPendingApprovals();
                              } else {
                                toast.error(data.message);
                              }
                            } catch (error) {
                              toast.error("Failed to reject agency");
                            }
                          }}
                          variant="destructive"
                          className="flex-1"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
