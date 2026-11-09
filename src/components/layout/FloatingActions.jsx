'use client';

import React, { useState, useEffect } from 'react';
import { useProduct } from '@/context/ProductContext';
import { soundManager } from '@/lib/audio';
import { Volume2, VolumeX, RotateCcw, Zap, ChevronUp, Layers } from 'lucide-react';

export default function FloatingActions() {
  const { soundActive, toggleSound, setViewMode } = useProduct();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToPreOrder = () => {
    soundManager.playClick(650, 0.04);
    const el = document.getElementById('pre-order');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollTo3D = () => {
    soundManager.playClick(600, 0.04);
    const el = document.getElementById('3d-experience');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    soundManager.playClick(500, 0.04);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside className="floatingActionsContainer" aria-label="Quick controls">
      {/* 3D Model Quick Trigger */}
      <button
        className="floatingBtn btn3D"
        onClick={scrollTo3D}
        title="Jump to 3D Experience"
      >
        <Layers size={18} />
        <span className="tooltip">3D Viewport</span>
      </button>

      {/* Audio Sound FX Toggle */}
      <button
        className={`floatingBtn btnSound ${soundActive ? 'active' : ''}`}
        onClick={toggleSound}
        title={soundActive ? 'Mute Sound' : 'Enable Sci-Fi Audio'}
      >
        {soundActive ? <Volume2 size={18} /> : <VolumeX size={18} />}
        <span className="tooltip">{soundActive ? 'Mute FX' : 'Enable FX'}</span>
      </button>

      {/* Quick Pre-Order Button */}
      <button
        className="floatingBtn btnOrder"
        onClick={scrollToPreOrder}
        title="Pre-Order Oryzo X-1"
      >
        <Zap size={18} />
        <span className="tooltip">Reserve X-1</span>
      </button>

      {/* Back to top if scrolled */}
      {showScrollTop && (
        <button
          className="floatingBtn btnTop"
          onClick={scrollToTop}
          title="Scroll to Top"
        >
          <ChevronUp size={18} />
          <span className="tooltip">Back to Top</span>
        </button>
      )}
    </aside>
  );
}

