'use client';

import React from 'react';
import { Sparkles, ArrowUp, Phone, MapPin, Mail, ShieldCheck } from 'lucide-react';
import { soundManager } from '@/lib/audio';
import { useSettings } from '@/context/SettingsContext';

export default function Footer() {
  const { settings } = useSettings();
  const brandTitle = settings?.title || 'Henley Fashion';
  const tagline = settings?.tag_line || 'DEFINE YOUR STYLE';

  const scrollToTop = () => {
    soundManager.playClick(600, 0.04);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="siteFooter">
      <div className="container">
        {/* Top Newsletter / VIP Club Row */}
        <div className="footerLabBriefing">
          <div className="briefingText">
            <div className="badgeLine">
              <span className="dot"></span>
              {brandTitle.toUpperCase()} // VIP STREETWEAR CLUB
            </div>
            <h3 className="briefingTitle">নতুন কালেকশন ও ডিসকাউন্ট অফার</h3>
            <p className="briefingSub">
              আমাদের পরবর্তী সীমিত সংস্করণের ড্রপ-শোল্ডার হুডি ও জ্যাকেট কালেকশনের আর্লি অ্যাক্সেস পেতে
              সাবস্ক্রাইব করুন।
            </p>
          </div>
          <form
            className="briefingForm"
            onSubmit={(e) => {
              e.preventDefault();
              alert('ধন্যবাদ! আপনি Henley Fashion ভিআইপি ক্লাবে যুক্ত হয়েছেন।');
            }}
          >
            <input type="email" placeholder="আপনার ইমেইল বা মোবাইল নম্বর দিন" required />
            <button type="submit" className="glow-btn">
              যুক্ত হোন
            </button>
          </form>
        </div>

        {/* Middle Links Grid */}
        <div className="footerMainGrid">
          <div className="footerCol brandCol">
            <div className="footerLogo">
              <div className="logoSymbol">
                <span className="innerDisc"></span>
                <span className="orbitRing"></span>
              </div>
              <span className="brandName">{brandTitle.toUpperCase()}</span>
            </div>
            <p className="footerAbout">
              {settings?.footer_description ||
                'প্রিমিয়াম কোয়ালিটি ৪৫০ GSM হেভিওয়েট ড্রপ শোল্ডার সাইবার হুডি। প্রি-শ্রিঙ্কড ১০০% অর্গানিক কম্বড কটন উইথ গ্রাফিন থার্মাল শিল্ড।'}
            </p>
            <div className="systemStatusPill">
              <span className="statusDot"></span>
              <span>100% AUTHENTIC QUALITY // PREMIUM FINISH</span>
            </div>
          </div>

          <div className="footerCol">
            <h4 className="colTitle">NAVIGATION</h4>
            <ul className="footerLinks">
              <li>
                <a href="#features">Textile Features</a>
              </li>
              <li>
                <a href="#thermal-scanner">Thermal Scanner</a>
              </li>
              <li>
                <a href="#tech-specs">Size & Fabric Matrix</a>
              </li>
              <li>
                <a href="#reviews">Customer Acclaim</a>
              </li>
              <li>
                <a href="#pre-order">অর্ডার করুন (Cash on Delivery)</a>
              </li>
            </ul>
          </div>

          <div className="footerCol">
            <h4 className="colTitle">CUSTOMER SERVICE</h4>
            <ul className="footerLinks">
              <li>
                <span>হটলাইন: </span>
                <strong style={{ color: '#00f5c4' }}>{settings?.phone_number || '01614161001'}</strong>
              </li>
              <li>
                <span>হোয়াটসঅ্যাপ: </span>
                <strong style={{ color: '#00f5c4' }}>{settings?.whatsapp_number || '01614161001'}</strong>
              </li>
              <li>
                <span>ইমেইল: </span>
                <span>{settings?.footer_email || 'support@henleyfashion.com'}</span>
              </li>
              <li>
                <span>ডেলিভারি: সারা দেশে ২-৩ দিনে হোম ডেলিভারি</span>
              </li>
            </ul>
          </div>

          <div className="footerCol">
            <h4 className="colTitle">OUTLET & ADDRESS</h4>
            <p className="addressText">
              {settings?.footer_address ||
                'Eastern Plaza Shopping Complex Level 3 (Right Side), Shop No. 3/35 Hatirpool, Dhaka 1205, Bangladesh'}
            </p>
            <div className="socialIconsRow">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="socialIcon" aria-label="Facebook">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="socialIcon" aria-label="Instagram">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footerBottomBar">
          <p className="copyrightText">
            © {new Date().getFullYear()} {brandTitle}. All Rights Reserved. Crafted with Next.js, Three.js & SCSS.
          </p>
          <div className="satiricalNote">
            <span>“{tagline}”</span>
          </div>
          <button className="backToTopBtn" onClick={scrollToTop} aria-label="Back to Top">
            <span>Top</span>
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
