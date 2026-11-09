'use client';

import React, { useState, useEffect } from 'react';
import { useProduct } from '@/context/ProductContext';
import { useSettings } from '@/context/SettingsContext';
import { soundManager } from '@/lib/audio';
import { Volume2, VolumeX, Menu, X, ArrowUpRight, Zap, ShoppingBag } from 'lucide-react';

export default function Header() {
  const { soundActive, toggleSound } = useProduct();
  const { settings } = useSettings();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const brandTitle = settings?.title || 'Henley Fashion';
  const tagline = settings?.tag_line || 'DEFINE YOUR STYLE';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    soundManager.playClick(600, 0.04);
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`siteHeader ${scrolled ? 'headerScrolled' : ''}`}>
      <div className="container">
        <div className="headerInner">
          {/* Logo */}
          <a
            href="#"
            className="brandLogo"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="logoSymbol">
              <span className="innerDisc"></span>
              <span className="orbitRing"></span>
            </div>
            <div className="logoTextGroup">
              <span className="brandName">{brandTitle.toUpperCase()}</span>
              <span className="brandTag">TECHWEAR 450 GSM</span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="desktopNav">
            <button onClick={() => scrollToSection('features')} className="navLink">
              Textile Features
            </button>
            <button onClick={() => scrollToSection('thermal-scanner')} className="navLink">
              Thermal Scanner
            </button>
            <button onClick={() => scrollToSection('tech-specs')} className="navLink">
              Size & Fabric Matrix
            </button>
            <button onClick={() => scrollToSection('reviews')} className="navLink">
              Reviews
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="headerActions">
            {/* Audio Toggle */}
            <button
              className={`audioToggleBtn ${soundActive ? 'active' : ''}`}
              onClick={toggleSound}
              title={soundActive ? 'Mute Sound FX' : 'Enable Sci-Fi Audio FX'}
            >
              {soundActive ? <Volume2 size={16} /> : <VolumeX size={16} />}
              <span className="audioLabel">{soundActive ? 'AUDIO ON' : 'AUDIO OFF'}</span>
            </button>

            {/* Pre-Order CTA */}
            <button
              className="glow-btn headerCta"
              onClick={() => scrollToSection('pre-order')}
            >
              <ShoppingBag size={15} />
              <span>অর্ডার করুন (৳{settings?.sale_price || '2,150'})</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              className="mobileMenuToggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="mobileNavDropdown">
            <button onClick={() => scrollToSection('features')} className="mobileNavLink">
              Textile Features
            </button>
            <button onClick={() => scrollToSection('thermal-scanner')} className="mobileNavLink">
              Thermal Scanner
            </button>
            <button onClick={() => scrollToSection('tech-specs')} className="mobileNavLink">
              Size & Fabric Matrix
            </button>
            <button onClick={() => scrollToSection('reviews')} className="mobileNavLink">
              Reviews
            </button>
            <div className="mobileNavActions">
              <button
                className="glow-btn"
                style={{ width: '100%' }}
                onClick={() => scrollToSection('pre-order')}
              >
                <ShoppingBag size={16} />
                <span>অর্ডার করুন (৳{settings?.sale_price || '2,150'})</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
