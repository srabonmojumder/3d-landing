'use client';

import React, { useState, useEffect } from 'react';
import { useProduct } from '@/context/ProductContext';
import { soundManager } from '@/lib/audio';
import {
  Sparkles,
  ArrowRight,
  Play,
  Zap,
  Activity,
  Cpu,
  ShieldCheck,
  Disc,
} from 'lucide-react';

export default function HeroBanner() {
  const { selectedFinish, toggleSound, soundActive } = useProduct();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    setMousePos({
      x: (clientX / innerWidth - 0.5) * 20,
      y: (clientY / innerHeight - 0.5) * 20,
    });
  };

  const scrollToSection = (id) => {
    soundManager.playClick(650, 0.04);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="heroBanner" onMouseMove={handleMouseMove}>
      {/* Ambient Radial Glow Gradients */}
      <div className="ambientGlow glowCyan"></div>
      <div className="ambientGlow glowAmber"></div>

      {/* Cyber Grid Lines */}
      <div className="cyberGridOverlay"></div>

      <div className="container">
        <div className="heroGrid">
          {/* Left Text Column */}
          <div className="heroContent">
            <div className="section-badge">
              <span className="badge-pulse"></span>
              REVOLUTIONARY HARDWARE DISRUPTION // 2026
            </div>

            <h1 className="heroTitle">
              The World’s First <br />
              <span className="text-gradient">Autonomous Surface.</span>
            </h1>

            <p className="heroDescription">
              What looks like a humble circular disc is actually a multi-layered quantum
              computing surface. Engineered by Lusion, Oryzo X-1 delivers sub-millisecond
              ambient intelligence, tactile acoustic levitation, and autonomous thermal regulation.
            </p>

            {/* CTA Buttons */}
            <div className="heroCtaGroup">
              <button
                className="glow-btn"
                onClick={() => scrollToSection('pre-order')}
              >
                <Zap size={18} />
                <span>Pre-Order Oryzo X-1</span>
              </button>

              <button
                className="glass-btn"
                onClick={() => scrollToSection('3d-experience')}
              >
                <span>Explore 3D Architecture</span>
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Quick Telemetry Grid */}
            <div className="telemetryGrid">
              <div className="telemetryItem">
                <span className="telemetryValue cyan">0.12ms</span>
                <span className="telemetryLabel">Neural Latency</span>
              </div>
              <div className="telemetryDivider"></div>
              <div className="telemetryItem">
                <span className="telemetryValue">128 TPU</span>
                <span className="telemetryLabel">Edge Processing</span>
              </div>
              <div className="telemetryDivider"></div>
              <div className="telemetryItem">
                <span className="telemetryValue amber">72 Hours</span>
                <span className="telemetryLabel">Active Kinetic Life</span>
              </div>
            </div>
          </div>

          {/* Right Interactive Holographic Disc Preview */}
          <div className="heroVisualCol">
            <div
              className="holographicCard"
              style={{
                transform: `perspective(1000px) rotateX(${-mousePos.y * 0.7}deg) rotateY(${mousePos.x * 0.7}deg)`,
              }}
            >
              {/* Radar Scanner Circle */}
              <div className="radarCircle">
                <div className="radarLine"></div>
              </div>

              {/* Glowing Disc Visual Center */}
              <div
                className="discSurface"
                style={{
                  backgroundColor: selectedFinish.colorHex,
                  boxShadow: `0 0 50px ${selectedFinish.edgeHex}44, inset 0 0 30px rgba(0,0,0,0.8)`,
                }}
                onClick={() => {
                  soundManager.playChime(660, 0.3);
                  scrollToSection('3d-experience');
                }}
              >
                <div className="discCoreGlow">
                  <Disc size={36} className="coreIcon" />
                </div>
                <div className="grooveRing r1"></div>
                <div className="grooveRing r2"></div>
                <div className="grooveRing r3"></div>
                <div className="statusDotRing">
                  {[...Array(8)].map((_, i) => (
                    <span
                      key={i}
                      className="sensorDot"
                      style={{
                        transform: `rotate(${i * 45}deg) translate(80px) rotate(-${i * 45}deg)`,
                      }}
                    ></span>
                  ))}
                </div>
              </div>

              {/* Hologram Card Badges */}
              <div className="floatingCardBadge badgeTopLeft">
                <Cpu size={14} className="badgeIcon cyan" />
                <div>
                  <span className="tag">PROCESSOR</span>
                  <p>Oryzo Quantum NPU 4.0</p>
                </div>
              </div>

              <div className="floatingCardBadge badgeBottomRight">
                <Activity size={14} className="badgeIcon amber" />
                <div>
                  <span className="tag">STATUS</span>
                  <p>Surface In Sync (360° Ready)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

