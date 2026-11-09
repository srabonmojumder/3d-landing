'use client';

import React, { useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { soundManager } from '@/lib/audio';
import { useSettings } from '@/context/SettingsContext';

export default function TopAnnouncement() {
  const [isVisible, setIsVisible] = useState(true);
  const { settings } = useSettings();

  if (!isVisible) return null;

  const scrollToPreOrder = (e) => {
    e.preventDefault();
    soundManager.playClick(650, 0.04);
    const orderSection = document.getElementById('pre-order');
    if (orderSection) {
      orderSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <aside className="topAnnouncement">
      <div className="container">
        <div className="announcementContent">
          <div className="badgeLive">
            <span className="dot"></span>
            LIMITED WINTER DROP
          </div>
          <p className="announcementText">
            <strong>{settings?.title || 'Henley Fashion'}</strong> — ৪৫০ GSM হেভিওয়েট ড্রপ শোল্ডার সাইবার হুডি। সারা বাংলাদেশে ক্যাশ অন ডেলিভারি ও হোম ট্রায়াল সুবিধা!
          </p>
          <a href="#pre-order" onClick={scrollToPreOrder} className="claimLink">
            <span>অর্ডার করুন (৳{settings?.sale_price || '2,150'})</span>
            <ArrowRight size={14} />
          </a>
        </div>
        <button
          className="closeBtn"
          onClick={() => setIsVisible(false)}
          aria-label="Close notification"
        >
          <X size={14} />
        </button>
      </div>
    </aside>
  );
}
