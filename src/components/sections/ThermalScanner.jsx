'use client';

import React, { useState, useRef } from 'react';
import { Thermometer, Eye, Flame, ShieldCheck, Activity } from 'lucide-react';
import { soundManager } from '@/lib/audio';
import { useSettings } from '@/context/SettingsContext';

export default function ThermalScanner() {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const { settings } = useSettings();
  const brandName = settings?.title || 'AEROVOID';

  const handlePointerDown = (e) => {
    setIsDragging(true);
    updateSlider(e);
    soundManager.playThermalHum();
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    updateSlider(e);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const updateSlider = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const relativeX = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (relativeX / rect.width) * 100));
    setSliderPos(percentage);
  };

  // Dynamic temperature calculation: Body warmth 37.2°C vs Cold -5°C
  const currentTemp = (-5.0 + (sliderPos / 100) * 42.2).toFixed(1);

  // SVG Vector Hoodie Component
  const HoodieVector = ({ isThermal }) => (
    <div className={`hoodieGraphicWrapper ${isThermal ? 'thermalMode' : 'matteMode'}`}>
      <svg
        viewBox="0 0 500 440"
        className="hoodieSvg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Thermal Gradients */}
          <radialGradient id="thermalCore" cx="50%" cy="45%" r="45%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="25%" stopColor="#ffe600" />
            <stop offset="55%" stopColor="#ff2a5f" />
            <stop offset="85%" stopColor="#7928ca" />
            <stop offset="100%" stopColor="#00f5c4" />
          </radialGradient>
          <linearGradient id="thermalSleeveL" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff2a5f" />
            <stop offset="50%" stopColor="#7928ca" />
            <stop offset="100%" stopColor="#00f5c4" />
          </linearGradient>
          <linearGradient id="thermalSleeveR" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff2a5f" />
            <stop offset="50%" stopColor="#7928ca" />
            <stop offset="100%" stopColor="#00f5c4" />
          </linearGradient>
          {/* Matte Black Gradients */}
          <linearGradient id="matteBody" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#181b22" />
            <stop offset="50%" stopColor="#0f1117" />
            <stop offset="100%" stopColor="#090a0d" />
          </linearGradient>
          <filter id="thermalGlow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Thermal Heat Aura (Thermal Only) */}
        {isThermal && (
          <ellipse
            cx="250"
            cy="210"
            rx="210"
            ry="180"
            fill="url(#thermalCore)"
            opacity="0.25"
            filter="url(#thermalGlow)"
          />
        )}

        {/* (1) Oversized Drop Shoulder Sleeves */}
        {/* Left Sleeve */}
        <path
          d="M175 105 L60 160 L20 280 L62 298 L115 190 L140 230 Z"
          fill={isThermal ? 'url(#thermalSleeveL)' : '#12141a'}
          stroke={isThermal ? '#00f5c4' : '#282d3c'}
          strokeWidth="2"
        />
        {/* Left Ribbed Cuff */}
        <path
          d="M20 280 L62 298 L56 316 L14 298 Z"
          fill={isThermal ? '#00f5c4' : '#0a0b0e'}
          stroke={isThermal ? '#5effdb' : '#333a4d'}
          strokeWidth="1.5"
        />

        {/* Right Sleeve */}
        <path
          d="M325 105 L440 160 L480 280 L438 298 L385 190 L360 230 Z"
          fill={isThermal ? 'url(#thermalSleeveR)' : '#12141a'}
          stroke={isThermal ? '#00f5c4' : '#282d3c'}
          strokeWidth="2"
        />
        {/* Right Ribbed Cuff */}
        <path
          d="M480 280 L438 298 L444 316 L486 298 Z"
          fill={isThermal ? '#00f5c4' : '#0a0b0e'}
          stroke={isThermal ? '#5effdb' : '#333a4d'}
          strokeWidth="1.5"
        />

        {/* (2) Main Torso */}
        <path
          d="M165 95 L335 95 L360 360 L140 360 Z"
          fill={isThermal ? 'url(#thermalCore)' : 'url(#matteBody)'}
          stroke={isThermal ? '#ff2a5f' : '#282d3c'}
          strokeWidth="2.5"
          filter={isThermal ? 'url(#thermalGlow)' : undefined}
        />

        {/* Ribbed Bottom Hem Waistband */}
        <rect
          x="136"
          y="360"
          width="228"
          height="32"
          rx="4"
          fill={isThermal ? '#7928ca' : '#0a0b0e'}
          stroke={isThermal ? '#00f5c4' : '#282d3c'}
          strokeWidth="2"
        />

        {/* (3) Front Kangaroo Pocket */}
        <path
          d="M175 240 L325 240 L345 340 L155 340 Z"
          fill={isThermal ? 'url(#thermalCore)' : '#141720'}
          stroke={isThermal ? '#ff9e2c' : '#32384a'}
          strokeWidth="2"
        />
        {/* Kangaroo Pocket Slant Openings */}
        <line
          x1="175"
          y1="240"
          x2="155"
          y2="340"
          stroke={isThermal ? '#ffe600' : '#454d66'}
          strokeWidth="3"
        />
        <line
          x1="325"
          y1="240"
          x2="345"
          y2="340"
          stroke={isThermal ? '#ffe600' : '#454d66'}
          strokeWidth="3"
        />

        {/* (4) Volumetric Double-Layer Hood */}
        {/* Hood Outer */}
        <path
          d="M165 95 C165 20 335 20 335 95 C335 125 310 135 250 135 C190 135 165 125 165 95 Z"
          fill={isThermal ? 'url(#thermalCore)' : '#161922'}
          stroke={isThermal ? '#ff2a5f' : '#282d3c'}
          strokeWidth="2.5"
        />
        {/* Inner Hood Dark Depth Cavity */}
        <path
          d="M185 95 C185 45 315 45 315 95 C315 118 295 124 250 124 C205 124 185 118 185 95 Z"
          fill={isThermal ? '#ff2a5f' : '#07080b'}
          opacity={isThermal ? 0.7 : 1}
        />

        {/* Hanging Drawstrings with Aglets */}
        <line x1="228" y1="120" x2="228" y2="210" stroke={isThermal ? '#ffffff' : '#e2e8f0'} strokeWidth="3" />
        <rect x="226" y="210" width="4" height="16" fill={isThermal ? '#00f5c4' : '#00f5c4'} rx="1" />

        <line x1="272" y1="120" x2="272" y2="210" stroke={isThermal ? '#ffffff' : '#e2e8f0'} strokeWidth="3" />
        <rect x="270" y="210" width="4" height="16" fill={isThermal ? '#00f5c4' : '#00f5c4'} rx="1" />

        {/* Chest Silicon Crest / Emblem */}
        <rect
          x="220"
          y="155"
          width="60"
          height="20"
          rx="4"
          fill={isThermal ? '#ffffff' : '#07090e'}
          stroke={isThermal ? '#ffe600' : '#00f5c4'}
          strokeWidth="1.5"
        />
        <text
          x="250"
          y="169"
          textAnchor="middle"
          fill={isThermal ? '#050608' : '#00f5c4'}
          fontSize="10"
          fontFamily="monospace"
          fontWeight="bold"
        >
          {brandName.substring(0, 8)}
        </text>

        {/* Thermal Hotspot Crosshairs & Probes (Thermal Only) */}
        {isThermal && (
          <g>
            {/* Core Chest Probe: 37.2°C */}
            <circle cx="250" cy="195" r="5" fill="#ffffff" stroke="#ff2a5f" strokeWidth="2" />
            <line x1="250" y1="180" x2="250" y2="210" stroke="#ffffff" strokeWidth="1" strokeDasharray="2,2" />
            <line x1="235" y1="195" x2="265" y2="195" stroke="#ffffff" strokeWidth="1" strokeDasharray="2,2" />
            <rect x="268" y="184" width="60" height="20" rx="4" fill="#000000" opacity="0.8" />
            <text x="274" y="198" fill="#ff5e84" fontSize="11" fontFamily="monospace" fontWeight="bold">
              37.2°C
            </text>

            {/* Hood Heat Probe: 34.5°C */}
            <circle cx="250" cy="65" r="4" fill="#ff9e2c" />
            <rect x="265" y="55" width="56" height="18" rx="4" fill="#000000" opacity="0.8" />
            <text x="271" y="68" fill="#ffe600" fontSize="10" fontFamily="monospace" fontWeight="bold">
              34.5°C
            </text>

            {/* Exterior Sleeve Shield: -5.0°C */}
            <circle cx="50" cy="240" r="4" fill="#00f5c4" />
            <rect x="58" y="232" width="60" height="18" rx="4" fill="#000000" opacity="0.8" />
            <text x="64" y="245" fill="#00f5c4" fontSize="10" fontFamily="monospace" fontWeight="bold">
              -5.0°C
            </text>
          </g>
        )}
      </svg>
    </div>
  );

  return (
    <section className="thermalScannerSection" id="thermal-scanner">
      <div className="container">
        <div className="sectionHeaderCenter">
          <div className="section-badge">
            <span className="badge-pulse"></span>
            FLIR INFRARED RADIOMETRIC SCAN // 60 FPS
          </div>
          <h2 className="title">
            37.0°C Body Heat <span className="text-gradient">Dynamic Shield</span>
          </h2>
          <p className="subtitle">
            ড্র্যাগ করে লেজার স্লাইডারটি ডানে-বামে সরান। দেখুন কীভাবে {brandName}-এর ৪৫০ GSM গ্রাফিন হুডি
            শরীরের ৩৭.২°C স্বাভাবিক তাপমাত্রা ভেতর ধরে রাখে এবং বাইরের কনকনে -১০°C উইন্ডচিল্ড প্রতিহত করে।
          </p>
        </div>

        {/* Interactive Comparison Slider */}
        <div
          className="scannerComparisonWrapper"
          ref={containerRef}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
        >
          {/* Background: Visible Matte Fabric Hoodie */}
          <div className="visibleLayer">
            <HoodieVector isThermal={false} />
            <div className="spectrumTag leftTag">
              <Eye size={16} />
              <span>NATURAL LIGHT SPECTRUM // 450 GSM COTTON</span>
            </div>
          </div>

          {/* Foreground: Thermal Infrared Spectrum Hoodie (Clipped by sliderPos) */}
          <div
            className="thermalLayer"
            style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
          >
            <HoodieVector isThermal={true} />
            <div className="spectrumTag rightTag">
              <Flame size={16} />
              <span>FLIR THERMAL IR // 37.2°C HEAT-LOCK SHIELD</span>
            </div>
          </div>

          {/* Draggable Divider Line */}
          <div
            className="sliderDivider"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="laserLine"></div>
            <div className="sliderHandle">
              <span className="handleArrow left">◀</span>
              <div className="handleCenter">
                <Thermometer size={16} />
                <span className="tempBadge">{currentTemp}°C</span>
              </div>
              <span className="handleArrow right">▶</span>
            </div>
          </div>

          {/* Floating Diagnostic HUD readout */}
          <div className="thermalHud">
            <div className="hudItem">
              <span className="hudLabel">CORE CHEST HEAT</span>
              <span className="hudValue red">37.2 °C</span>
            </div>
            <div className="hudDivider"></div>
            <div className="hudItem">
              <span className="hudLabel">EXTERIOR DEFLECTION</span>
              <span className="hudValue cyan">-10.0 °C SHIELD</span>
            </div>
            <div className="hudDivider"></div>
            <div className="hudItem">
              <span className="hudLabel">THERMAL RETENTION</span>
              <span className="hudValue green">98.8% PASSIVE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
