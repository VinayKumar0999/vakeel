"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Scale, Menu, X, Bell, Laugh } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 supports-[backdrop-filter]:bg-white/60">
      <div className="container">
        <div className="flex h-16 w-full items-center justify-between ">
          <nav className="bg-white/80 backdrop-blur-md w-full border-b h-full flex items-center space-between w-full border-slate-200 sticky top-0 z-50">
            <div className="mx-auto px-6 py-4 w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <a href="/">
                  <Scale className="w-8 h-8 text-blue-900" />
                  <span className="text-2xl font-bold text-blue-900">
                    Vakeel Kutami
                  </span>
                  </a>
                </div>
                <div className="hidden md:flex items-center gap-8">
                  <a
                    href="/lawers"
                    className="text-slate-700 hover:text-blue-900 transition-colors"
                  >
                    Find Lawyers
                  </a>
                  <a
                    href="#"
                    className="text-slate-700 hover:text-blue-900 transition-colors"
                  >
                    How it Works
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  {isAuthenticated ? (
                    <>
                      <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                      </Button>
                      <Button variant="ghost" asChild>
                        <Link href="/dashboard">Dashboard</Link>
                      </Button>
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-700">
                          {user?.fullName?.[0] || "U"}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        asChild
                        className="px-5 py-2 text-blue-900 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Link href="/login">Login</Link>
                      </Button>
                      <Button
                        asChild
                        className="px-5 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
                      >
                        <Link href="/signup">Sign Up</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link
              href="/"
              className="text-sm font-medium text-gray-700 hover:text-primary-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/lawyers"
              className="text-sm font-medium text-gray-700 hover:text-primary-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Find Lawyers
            </Link>
            <Link
              href="/joke-generator"
              className="text-sm font-medium text-gray-700 hover:text-primary-600 flex items-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Laugh className="w-4 h-4" />
              Joke Generator
            </Link>
            <Link
              href="/lawers"
              className="text-sm font-medium text-gray-700 hover:text-primary-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <div className="pt-4 border-t flex flex-col gap-2">
              {isAuthenticated ? (
                <Button asChild className="w-full">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild className="w-full">
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
