'use client';

import React from 'react';
import {
  Flame,
  Shield,
  Zap,
  Droplets,
  Layers,
  Sparkles,
  Scissors,
  Thermometer,
} from 'lucide-react';
import { soundManager } from '@/lib/audio';
import { useSettings } from '@/context/SettingsContext';

export default function FeatureHighlights() {
  const { settings } = useSettings();
  const brandTitle = settings?.title || 'Henley Fashion';

  const FEATURES = [
    {
      icon: Layers,
      badge: 'TEXTILE DENSITY',
      title: '450 GSM Ultra-Dense French Terry',
      desc: 'হেভিওয়েট প্রিমিয়াম ৩-এন্ড লুপ ফ্রেঞ্চ টেরি কটন। ফেব্রিকটি যথেষ্ট ভারী হওয়ায় বাতাসে উড়ে যায় না এবং নিখুঁত বক্সি ড্রপ-শোল্ডার স্ট্রাকচার ধরে রাখে।',
      metric: '450 GSM',
      metricLabel: 'Fabric Weight',
      color: 'cyan',
    },
    {
      icon: Droplets,
      badge: 'NANOTECH DWR',
      title: 'Hydrophobic Water-Beading Shield',
      desc: 'বায়ো-ইঞ্জিনিয়ার্ড DWR ন্যানোটেক কোটিং। বৃষ্টি বা কফির ছিটকে পড়া তরল ফেব্রিকের ভেতরে না ঢুকে মুক্তোর মতো গড়িয়ে নিচে পড়ে যায়।',
      metric: '100% Repel',
      metricLabel: 'Surface Protection',
      color: 'amber',
    },
    {
      icon: Scissors,
      badge: 'ERGONOMIC CUT',
      title: 'Relaxed Drop Shoulder Silhouette',
      desc: 'আন্তর্জাতিক স্ট্রিটওয়্যার ব্র্যান্ডের আদলে ডিজাইন করা অতিরিক্ত আরামদায়ক ড্রপ শোল্ডার কাটিং। কাঁধে কোনো টান পড়ে না, ফুল রেঞ্জ অফ মোশন দেয়।',
      metric: '360° Drape',
      metricLabel: 'Kinematic Fit',
      color: 'cyan',
    },
    {
      icon: Flame,
      badge: 'GRAPHENE SHIELD',
      title: '37.0°C Core Heat Lock',
      desc: 'হুডির ভেতরের থার্মাল গ্রাফিন মেমব্রেন শরীরের স্বাভাবিক তাপমাত্রা ধরে রাখে এবং কনকনে ঠান্ডায় বা বাইক রাইডিংয়ের সময় ঠান্ডা বাতাস প্রতিরোধ করে।',
      metric: '37.2 °C',
      metricLabel: 'Warmth Retention',
      color: 'amber',
    },
    {
      icon: Shield,
      badge: 'REINFORCED SEAMS',
      title: 'Double-Needle Flatlock Bar-Tacks',
      desc: 'ক্যাঙ্গারু পকেট, ড্রস্ট্রিং আইলেট এবং কাফগুলিতে রয়েছে ইন্ডাস্ট্রিয়াল ডাবল-নিডেল বার-ট্যাক সেলাই। শতবার ওয়াশ করলেও সেলাই কখনোই আলগা হবে না।',
      metric: '100+ Washes',
      metricLabel: 'Seam Longevity',
      color: 'cyan',
    },
    {
      icon: Sparkles,
      badge: 'BIO-WASHED',
      title: 'Pre-Shrunk 100% Combed Cotton',
      desc: 'কারখানায় প্রি-শ্রিঙ্কড ও এনজাইম সিলিকন ওয়াশ করা হয়েছে, ফলে বাসায় ওয়াশ করার পর সাইজ ছোট হওয়া বা রোয়া ওঠার (Pilling) কোনো সুযোগ নেই।',
      metric: '0% Shrinkage',
      metricLabel: 'Pre-Shrunk Guarantee',
      color: 'amber',
    },
  ];

  const handleCardHover = () => {
    soundManager.playClick(920, 0.02);
  };

  return (
    <section className="featureHighlightsSection" id="features">
      <div className="container">
        <div className="sectionHeaderCenter">
          <div className="section-badge">
            <span className="badge-pulse"></span>
            {brandTitle.toUpperCase()} // PERFORMANCE SPECIFICATIONS
          </div>
          <h2 className="title">
            Engineered for The Street. <br />
            <span className="text-gradient">Built for Extreme Warmth.</span>
          </h2>
          <p className="subtitle">
            সাধারণ হুডির চেয়ে সম্পূর্ণ আলাদা। ৪৫০ GSM হেভিওয়েট ফেব্রিক, ওয়াটার-রিপেলেন্ট ন্যানো-শিল্ড
            এবং প্রি-শ্রিঙ্কড পিওর কটনের এক অপূর্ব সংমিশ্রণ।
          </p>
        </div>

        <div className="featuresGrid">
          {FEATURES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="featureCard"
                onMouseEnter={handleCardHover}
              >
                <div className="cardHeader">
                  <div className={`iconWrapper ${item.color}`}>
                    <Icon size={22} />
                  </div>
                  <span className={`cardBadge ${item.color}`}>{item.badge}</span>
                </div>

                <h3 className="cardTitle">{item.title}</h3>
                <p className="cardDesc">{item.desc}</p>

                <div className="cardFooter">
                  <div className="metricBlock">
                    <span className={`metricVal ${item.color}`}>{item.metric}</span>
                    <span className="metricLbl">{item.metricLabel}</span>
                  </div>
                  <div className="cardCornerAccent"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
