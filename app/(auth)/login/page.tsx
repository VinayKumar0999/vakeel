"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { authAPI } from "@/lib/api";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"CLIENT" | "LAWYER">("CLIENT");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password,
      });

      const { user, token } = response.data.data || response.data;

      // Save auth state (useAuth implementation should store token safely)
      setAuth(user, token);

      // Redirect logic based on backend role
      // Backend must be authoritative
      if (user.role === "ADMIN") {
        router.push("/admin");
        return;
      }

      if (user.role === "LAWYER") {
        // If you maintain verification status, check it here
        if (user.verification_status && user.verification_status !== "APPROVED") {
          toast.success("Logged in. Your lawyer verification is pending.");
          router.push("/auth/verify-pending");
          return;
        }
        // If the user selected CLIENT by mistake, gently inform them
        if (selectedRole === "CLIENT") {
          toast("You logged in as a Lawyer. Redirecting to Lawyer Dashboard.");
        }
        router.push("/lawyer/dashboard"); // lawyer dashboard path (adjust if different)
        return;
      }

      // Default: CLIENT
      if (user.role === "CLIENT") {
        if (selectedRole === "LAWYER") {
          toast("You logged in as a Client. If you intended to login as a Lawyer, please register or use the lawyer login option.");
        }
        router.push("/dashboard");
        return;
      }

      // Fallback
      router.push("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed. Please check credentials.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>Login to your account</CardDescription>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setSelectedRole("CLIENT")}
                className={`flex-1 px-3 py-2 rounded ${selectedRole === "CLIENT" ? "bg-primary-600 text-white" : "bg-white border"}`}
                aria-pressed={selectedRole === "CLIENT"}
              >
                Client
              </button>
              <button
                onClick={() => setSelectedRole("LAWYER")}
                className={`flex-1 px-3 py-2 rounded ${selectedRole === "LAWYER" ? "bg-primary-600 text-white" : "bg-white border"}`}
                aria-pressed={selectedRole === "LAWYER"}
              >
                Lawyer
              </button>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email or Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="you@example.com or 9876543210"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <span>Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700">
                  Forgot Password?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>

              <div className="text-center text-sm">
                <span className="text-gray-600">New to Vakeel Kutami? </span>
                <Link href="/signup" className="text-primary-600 hover:text-primary-700 font-medium">Create an account</Link>
              </div>

              <div className="text-center text-sm">
                <span className="text-gray-600">Are you a lawyer? </span>
                <Link href="/signup/lawyer" className="text-primary-600 hover:text-primary-700 font-medium">Register as Lawyer →</Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}