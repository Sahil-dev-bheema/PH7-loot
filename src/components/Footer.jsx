// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  FiMail,
  FiPhone,
  FiShield,
  FiHelpCircle,
  FiLock,
  FiInstagram,
  FiTwitter,
  FiFacebook,
} from "react-icons/fi";

const Chip = ({ children }) => (
  <span className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold text-white">
    {children}
  </span>
);

const FooterLink = ({ to, children }) => (
  <Link
    to={to}
    className="text-sm text-white/85 hover:text-white transition underline-offset-4 hover:underline"
  >
    {children}
  </Link>
);

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-[#00D5BE] to-[#00B9A6] text-white">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Top */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
             
              <div>
                <p className="text-lg font-extrabold leading-tight">ph7Loot</p>
                <p className="text-xs text-white/80">Play smart • Pay secure</p>
              </div>
            </div>

            <p className="mt-3 text-sm text-white/85 leading-relaxed">
              Buy tickets, track draws, manage your wallet, and view your history in one place.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Chip>Secure Payments</Chip>
              <Chip>Fast Wallet</Chip>
              <Chip>24/7 Support</Chip>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-sm font-bold tracking-wide">Quick links</p>
            <ul className="mt-3 space-y-2">
              <li>
                <FooterLink to="/">Home</FooterLink>
              </li>
          
              
              <li>
                <FooterLink to="/profile">My Profile</FooterLink>
              </li>
             
            </ul>
          </div>

          {/* Support */}
          <div>
            <p className="text-sm font-bold tracking-wide">Support</p>
            <ul className="mt-3 space-y-2">
              <li className="flex items-center gap-2">
                <FiHelpCircle className="text-white/90" />
                <FooterLink to="/faq">FAQs</FooterLink>
              </li>
              <li className="flex items-center gap-2">
                <FiMail className="text-white/90" />
                <a
                  className="text-sm text-white/85 hover:text-white transition hover:underline underline-offset-4"
                  href="mailto:support@lotto247.com"
                >
                  support@lotto247.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <FiPhone className="text-white/90" />
                <a
                  className="text-sm text-white/85 hover:text-white transition hover:underline underline-offset-4"
                  href="tel:+910000000000"
                >
                  +91 00000 00000
                </a>
              </li>

              <li className="mt-3">
                <p className="text-xs text-white/70">Follow</p>
                <div className="mt-2 flex items-center gap-2">
                  <a
                    href="#"
                    className="h-9 w-9 rounded-xl bg-white/10 ring-1 ring-white/20 flex items-center justify-center hover:bg-white/15 transition"
                    aria-label="Instagram"
                  >
                    <FiInstagram />
                  </a>
                  <a
                    href="#"
                    className="h-9 w-9 rounded-xl bg-white/10 ring-1 ring-white/20 flex items-center justify-center hover:bg-white/15 transition"
                    aria-label="Twitter"
                  >
                    <FiTwitter />
                  </a>
                  <a
                    href="#"
                    className="h-9 w-9 rounded-xl bg-white/10 ring-1 ring-white/20 flex items-center justify-center hover:bg-white/15 transition"
                    aria-label="Facebook"
                  >
                    <FiFacebook />
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* Legal + Payments */}
          <div>
            <p className="text-sm font-bold tracking-wide">Legal</p>
            <ul className="mt-3 space-y-2">
              <li className="flex items-center gap-2">
                <FiLock className="text-white/90" />
                <FooterLink to="/privacy-policy">Privacy Policy</FooterLink>
              </li>
              <li className="flex items-center gap-2">
                <FiShield className="text-white/90" />
                <FooterLink to="/terms">Terms & Conditions</FooterLink>
              </li>
              <li>
                <FooterLink to="/responsible-gaming">Responsible Gaming</FooterLink>
              </li>
            </ul>

            <p className="mt-5 text-xs text-white/70">Payment methods</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Chip>UPI</Chip>
              <Chip>Visa</Chip>
              <Chip>Mastercard</Chip>
              <Chip>NetBanking</Chip>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-5 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/80">
            © {year} ph7Loot. All rights reserved.
          </p>

          <div className="flex items-center gap-4 text-xs">
            <Link className="text-white/80 hover:text-white transition" to="/refund">
              Refund Policy
            </Link>
            <Link className="text-white/80 hover:text-white transition" to="/contact">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
