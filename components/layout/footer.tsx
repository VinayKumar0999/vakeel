import Link from "next/link";
import { Scale, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-vk-dark text-slate-400">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Scale className="h-8 w-8 text-vk-primary" />
              <span className="text-xl font-bold text-white">Vakeel Kutami</span>
            </Link>
            <p className="text-sm mb-4">
              Organizing legal access for Digital India. Structure, clarity, and trust from first question to case resolution.
            </p>
            <div className="flex gap-3">
              <a href="#" className="hover:text-vk-primary transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-vk-primary transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-vk-primary transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-vk-primary transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/advocates" className="hover:text-vk-primary transition-colors">
                  Find Advocates
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-vk-primary transition-colors">
                  How it Works
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-vk-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-vk-primary transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-vk-primary transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="hover:text-vk-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-vk-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-vk-primary transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-vk-primary transition-colors">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="block text-slate-500">Email:</span>
                <a href="mailto:support@vakeelkutami.com" className="hover:text-vk-primary transition-colors">
                  support@vakeelkutami.com
                </a>
              </li>
              <li>
                <span className="block text-slate-500">Phone:</span>
                <a href="tel:+918888888888" className="hover:text-vk-primary transition-colors">
                  +91 88888 88888
                </a>
              </li>
              <li>
                <span className="block text-slate-500">Address:</span>
                <span>Mumbai, Maharashtra, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm text-slate-500">
          <p>© 2025 Vakeel Kutami. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}