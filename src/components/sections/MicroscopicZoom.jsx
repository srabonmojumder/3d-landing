'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ZoomIn, ZoomOut, Bug, Eye, Sparkles, Compass } from 'lucide-react';
import { soundManager } from '@/lib/audio';

export default function MicroscopicZoom() {
  const [zoomLevel, setZoomLevel] = useState(100); // 1x, 10x, 100x, 1000x
  const canvasRef = useRef(null);

  // Microscopic canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    // Tardigrades / Microscopic organisms
    const tardigrades = [
      { x: width * 0.35, y: height * 0.45, vx: 0.3, vy: 0.15, angle: 0, size: 24 },
      { x: width * 0.65, y: height * 0.6, vx: -0.25, vy: -0.2, angle: Math.PI, size: 20 },
    ];

    let t = 0;

    const render = () => {
      t += 0.02;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw cellular cork honeycomb / titanium crystal grain
      const cellSize = Math.max(12, (zoomLevel / 100) * 36);
      ctx.strokeStyle = 'rgba(0, 245, 196, 0.12)';
      ctx.lineWidth = 1;

      const cols = Math.ceil(width / cellSize) + 1;
      const rows = Math.ceil(height / (cellSize * 0.866)) + 1;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * cellSize + (r % 2 === 1 ? cellSize * 0.5 : 0);
          const y = r * cellSize * 0.866;

          // Subtle organic cell variation
          const noise = Math.sin(c * 0.5 + t * 0.5) * Math.cos(r * 0.5);
          ctx.beginPath();
          ctx.arc(x, y, (cellSize * 0.45) + noise * 1.5, 0, Math.PI * 2);
          ctx.stroke();

          if (zoomLevel >= 100 && (c + r) % 5 === 0) {
            ctx.fillStyle = 'rgba(255, 158, 44, 0.18)';
            ctx.beginPath();
            ctx.arc(x, y, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // 2. Draw crawling Tardigrades (Easter Egg when zoomed in >= 100x)
      if (zoomLevel >= 100) {
        tardigrades.forEach((bug, idx) => {
          bug.x += bug.vx;
          bug.y += bug.vy;

          if (bug.x < 50 || bug.x > width - 50) bug.vx *= -1;
          if (bug.y < 50 || bug.y > height - 50) bug.vy *= -1;

          bug.angle = Math.atan2(bug.vy, bug.vx);

          ctx.save();
          ctx.translate(bug.x, bug.y);
          ctx.rotate(bug.angle);

          // Tardigrade chubby segmented body
          ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.strokeStyle = '#00f5c4';
          ctx.lineWidth = 2;

          // 4 Segments
          for (let s = -2; s <= 1; s++) {
            ctx.beginPath();
            ctx.ellipse(s * 7, 0, 7, 9, 0, 0, Math.PI * 2);
            ctx.fillStyle = idx === 0 ? 'rgba(0, 245, 196, 0.25)' : 'rgba(255, 158, 44, 0.25)';
            ctx.fill();
            ctx.stroke();

            // Legs wiggling
            const legWiggle = Math.sin(t * 4 + s) * 4;
            ctx.beginPath();
            ctx.moveTo(s * 7, -8);
            ctx.lineTo(s * 7 - 4, -14 + legWiggle);
            ctx.moveTo(s * 7, 8);
            ctx.lineTo(s * 7 - 4, 14 - legWiggle);
            ctx.stroke();
          }

          // Head & tiny claws
          ctx.beginPath();
          ctx.arc(14, 0, 5, 0, Math.PI * 2);
          ctx.fillStyle = '#00f5c4';
          ctx.fill();

          ctx.restore();
        });
      }

      // 3. Circular Microscopic Viewfinder Ring Overlay
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, Math.min(width, height) * 0.44, 0, Math.PI * 2);
      ctx.stroke();

      // Crosshairs
      ctx.strokeStyle = 'rgba(0, 245, 196, 0.35)';
      ctx.beginPath();
      ctx.moveTo(width / 2 - 30, height / 2);
      ctx.lineTo(width / 2 + 30, height / 2);
      ctx.moveTo(width / 2, height / 2 - 30);
      ctx.lineTo(width / 2, height / 2 + 30);
      ctx.stroke();
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [zoomLevel]);

  const handleZoomChange = (val) => {
    setZoomLevel(val);
    soundManager.playClick(400 + val * 3, 0.03);
  };

  return (
    <section className="microscopicSection" id="microscopic">
      <div className="container">
        <div className="sectionHeaderCenter">
          <div className="section-badge">
            <span className="badge-pulse"></span>
            SUB-MICRON RESOLUTION // 1000X MAGNIFICATION
          </div>
          <h2 className="title">
            Microscopic Cellular <span className="text-gradient">Bio-Architecture</span>
          </h2>
          <p className="subtitle">
            An homage to Oryzo’s celebrated microscopic deep-dive. Zoom in from macro to
            cellular scale to observe the impermeable suberin cork honeycomb matrix — and if
            you look closely, you will spot microscopic tardigrades navigating the titanium lattice.
          </p>
        </div>

        {/* Interactive Microscope Viewer */}
        <div className="microscopeCard">
          <div className="microscopeViewport">
            <canvas ref={canvasRef} className="microCanvas"></canvas>

            {/* Micro HUD Overlay */}
            <div className="microHud top-left">
              <span className="mono-tag cyan">OPTICAL SENSOR: ZEISS ULTRA-FIELD</span>
              <span className="mono-tag">FOV: 180μm</span>
              <span className="mono-tag amber">SUBSTRATE: HYDROPHOBIC SUBERIN</span>
            </div>

            <div className="microHud top-right">
              <span className="mono-tag green">ORGANISMS DETECTED: 2 TARDIGRADES</span>
              <span className="mono-tag">RESISTANCE: IP68</span>
            </div>

            {/* Easter Egg Callout */}
            <div className="easterEggBanner">
              <Bug size={16} className="bugIcon" />
              <span>
                <strong>EASTER EGG DETECTED:</strong> Tiny resilient tardigrades thrive on the
                cork cellular mesh.
              </span>
            </div>
          </div>

          {/* Zoom Control Slider */}
          <div className="microscopeControls">
            <div className="zoomLevelButtons">
              <button
                className={`zoomBtn ${zoomLevel === 1 ? 'active' : ''}`}
                onClick={() => handleZoomChange(1)}
              >
                1X Macro
              </button>
              <button
                className={`zoomBtn ${zoomLevel === 10 ? 'active' : ''}`}
                onClick={() => handleZoomChange(10)}
              >
                10X Micro
              </button>
              <button
                className={`zoomBtn ${zoomLevel === 100 ? 'active' : ''}`}
                onClick={() => handleZoomChange(100)}
              >
                100X Cellular
              </button>
              <button
                className={`zoomBtn ${zoomLevel === 1000 ? 'active' : ''}`}
                onClick={() => handleZoomChange(1000)}
              >
                1000X Nanoscale
              </button>
            </div>

            <div className="sliderRangeWrapper">
              <ZoomOut size={16} className="icon" />
              <input
                type="range"
                min="1"
                max="1000"
                value={zoomLevel}
                onChange={(e) => handleZoomChange(Number(e.target.value))}
                className="zoomSlider"
              />
              <ZoomIn size={16} className="icon" />
              <span className="zoomReadout">{zoomLevel}X</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

