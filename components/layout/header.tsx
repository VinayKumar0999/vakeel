"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Scale, Menu, X, Bell, Laugh, LogOut as LogOutIcon, BadgeCheck } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { ENABLE_ADMIN_APPROVALS } from "@/lib/feature-flags";

export function Header() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'ADVOCATE' || user.role === 'advocate' || user.role === 'LAWYER' || user.role === 'lawyer') {
      return '/dashboard/lawyer';
    }
    if (user.role === 'CLIENT' || user.role === 'user') {
      return '/dashboard/client';
    }
    // Admin approval UI hidden when ENABLE_ADMIN_APPROVALS is false
    if (ENABLE_ADMIN_APPROVALS && (user.role === 'ADMIN' || user.role === 'admin' || user.role === 'SUPER_ADMIN')) {
      return '/admin/approvals';
    }
    return '/dashboard/client';
  };

  const isAdvocate = user && (user.role === 'ADVOCATE' || user.role === 'advocate' || user.role === 'LAWYER' || user.role === 'lawyer');

  const handleLogout = () => {
    logout();
    router.push('/login');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-16 w-full items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            {!logoError ? (
              <Image
                src="/logo.svg"
                alt="Vakeel Kutami"
                width={140}
                height={36}
                className="h-9 w-auto object-contain"
                onError={() => setLogoError(true)}
                priority
              />
            ) : (
              <>
                <Scale className="h-8 w-8 text-vk-primary" aria-hidden />
                <span className="text-xl font-bold text-vk-dark">Vakeel Kutami</span>
              </>
            )}
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/advocates"
              className="text-sm font-medium text-vk-dark/80 hover:text-vk-primary transition-colors"
            >
              Find Advocates
            </Link>
            <Link
              href="/#how-it-works"
              className="text-sm font-medium text-vk-dark/80 hover:text-vk-primary transition-colors"
            >
              How it Works
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" size="icon" className="relative text-vk-dark/80 hover:text-vk-primary">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </Button>
                <Button variant="ghost" asChild className="text-vk-dark/80 hover:text-vk-primary">
                  <Link href={getDashboardLink()}>Dashboard</Link>
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-vk-dark/80 hover:text-red-600"
                >
                  <LogOutIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
                <div className="relative flex items-center gap-2">
                  {isAdvocate && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-vk-primary/10 border border-vk-primary/20 rounded-full">
                      <BadgeCheck className="w-3 h-3 text-vk-primary" />
                      <span className="text-xs font-medium text-vk-primary hidden sm:inline">Advocate</span>
                    </div>
                  )}
                  <div className="relative w-8 h-8 rounded-full bg-vk-primary/10 flex items-center justify-center overflow-hidden">
                    {user?.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.fullName || "User"}
                        fill
                        className="object-cover rounded-full"
                        unoptimized={user.avatar.includes("supabase.co") || user.avatar.includes("supabase.in")}
                      />
                    ) : (
                      <span className="text-sm font-medium text-vk-primary">
                        {user?.fullName?.[0] || "U"}
                      </span>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  asChild
                  className="px-4 py-2 text-vk-dark hover:bg-slate-100 hover:text-vk-primary rounded-lg transition-colors"
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button
                  asChild
                  className="px-4 py-2 bg-vk-primary text-white rounded-lg hover:opacity-95 transition-opacity"
                >
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 text-vk-dark hover:text-vk-primary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/80 bg-white">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
            <Link
              href="/"
              className="text-sm font-medium text-vk-dark/80 hover:text-vk-primary py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/advocates"
              className="text-sm font-medium text-vk-dark/80 hover:text-vk-primary py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Find Advocates
            </Link>
            <Link
              href="/#how-it-works"
              className="text-sm font-medium text-vk-dark/80 hover:text-vk-primary py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              How it Works
            </Link>
            <Link
              href="/joke-generator"
              className="text-sm font-medium text-vk-dark/80 hover:text-vk-primary py-2 flex items-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Laugh className="w-4 h-4" />
              Joke Generator
            </Link>
            <Link
              href="/advocates"
              className="text-sm font-medium text-vk-dark/80 hover:text-vk-primary py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <div className="pt-4 border-t border-slate-200/80 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Button asChild className="w-full bg-vk-primary hover:opacity-95">
                    <Link href={getDashboardLink()}>Dashboard</Link>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 text-red-600 hover:bg-red-50"
                  >
                    <LogOutIcon className="h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" asChild className="w-full border-vk-dark/20 text-vk-dark hover:bg-slate-50">
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild className="w-full bg-vk-primary hover:opacity-95 text-white">
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
