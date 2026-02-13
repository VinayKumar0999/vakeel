"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { authAPI } from "@/lib/api";
import toast from "react-hot-toast";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuth();

  const redirectTo = searchParams?.get("redirect") ?? null;

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"CLIENT" | "LAWYER">("CLIENT");
  const [errors, setErrors] = useState<{ email?: string; password?: string; submit?: string }>({});

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};
    const trimmedEmail = formData.email.trim();
    const trimmedPassword = formData.password.trim();

    if (!trimmedEmail) {
      newErrors.email = "Email or phone number is required";
    }

    if (!trimmedPassword) {
      newErrors.password = "Password is required";
    } else if (trimmedPassword.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = formData.email.trim().length > 0 && formData.password.trim().length >= 8;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      toast.error("Please fix the errors below");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.login({
        email: formData.email.trim(),
        password: formData.password,
      });

      const { user, token } = response.data.data || response.data;

      if (!user || !token) {
        toast.error("Invalid response from server");
        return;
      }

      // Save auth state (this will set cookies via useAuth hook)
      setAuth(user, token);

      const roleLabel = user.role === "LAWYER" || user.role === "ADVOCATE" || user.role === "lawyer" ? "Advocate" : "Client";
      toast.success(`Welcome back! You're logged in as ${roleLabel}.`);

      // Redirect logic based on user role
      // Priority: redirectTo param > role-based dashboard
      if (redirectTo && redirectTo.startsWith('/')) {
        router.push(redirectTo);
        return;
      }

      // Role-based redirects
      if (user.role === "ADMIN" || user.role === "admin") {
        router.push("/admin");
        return;
      }

      if (user.role === "LAWYER" || user.role === "lawyer") {
        // Check verification status for lawyers
        if (user.verificationStatus && user.verificationStatus !== "APPROVED") {
          toast("Your advocate verification is pending. You'll be notified once approved.", {
            icon: "⏳",
            duration: 4000,
          });
          router.push("/lawyer/verification-pending");
          return;
        }
        router.push("/dashboard/lawyer");
        return;
      }

      // Default: CLIENT
      if (user.role === "CLIENT" || user.role === "user") {
        router.push("/dashboard/client");
        return;
      }

      // Fallback
      router.push("/dashboard/client");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Login failed. Please check your credentials.";
      setErrors((prev) => ({ ...prev, submit: errorMessage }));
      toast.error(errorMessage);
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ring-2 ring-inset ${
                  selectedRole === "CLIENT"
                    ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                    : "bg-amber-50 text-amber-700 ring-amber-600/20"
                }`}
                aria-live="polite"
              >
                {selectedRole === "CLIENT" ? "Logging in as Client" : "Logging in as Advocate"}
              </span>
            </div>
            <CardDescription>Choose account type and sign in</CardDescription>
            <div className="flex gap-2 mt-3">
              <button
                type="button"
                onClick={() => setSelectedRole("CLIENT")}
                className={`flex-1 px-3 py-2.5 rounded-lg font-medium transition-all ${
                  selectedRole === "CLIENT"
                    ? "bg-emerald-600 text-white shadow-md ring-2 ring-emerald-500 ring-offset-2"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-emerald-300 hover:bg-emerald-50/50"
                }`}
                aria-pressed={selectedRole === "CLIENT"}
              >
                Client
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole("LAWYER")}
                className={`flex-1 px-3 py-2.5 rounded-lg font-medium transition-all ${
                  selectedRole === "LAWYER"
                    ? "bg-amber-600 text-white shadow-md ring-2 ring-amber-500 ring-offset-2"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-amber-300 hover:bg-amber-50/50"
                }`}
                aria-pressed={selectedRole === "LAWYER"}
              >
                Advocate
              </button>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {errors.submit && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errors.submit}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email or Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="you@example.com or 9876543210"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  disabled={isLoading}
                  className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    disabled={isLoading}
                    className={errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "password-error" : undefined}
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
                {errors.password && (
                  <p id="password-error" className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.password}
                  </p>
                )}
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

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !isFormValid}
              >
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
                <span className="text-gray-600">Are you an advocate? </span>
                <Link href="/signup/lawyer" className="text-primary-600 hover:text-primary-700 font-medium">Register as Advocate →</Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}