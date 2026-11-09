'use client';

import React, { useState } from 'react';
import { Layers, Scissors, Flame, Shield, CheckCircle2 } from 'lucide-react';
import { soundManager } from '@/lib/audio';
import { useSettings } from '@/context/SettingsContext';

const SPEC_CATEGORIES = [
  {
    id: 'sizing',
    title: 'Drop Shoulder Size Chart',
    icon: Scissors,
    specs: [
      { name: 'Medium (M)', value: 'Chest: 42" | Length: 27" | Shoulder: 23" | Sleeve: 24"' },
      { name: 'Large (L)', value: 'Chest: 44" | Length: 28" | Shoulder: 24" | Sleeve: 25"' },
      { name: 'Extra Large (XL)', value: 'Chest: 46" | Length: 29" | Shoulder: 25" | Sleeve: 26"' },
      { name: 'Double XL (XXL)', value: 'Chest: 48" | Length: 30" | Shoulder: 26" | Sleeve: 26.5"' },
      { name: 'Fit Recommendation', value: 'True to oversized streetwear aesthetic (No need to size up)' },
    ],
  },
  {
    id: 'textile',
    title: 'Textile Metallurgy & Yarn',
    icon: Layers,
    specs: [
      { name: 'GSM Density', value: '450 Grams per Square Meter (Heavyweight French Terry)' },
      { name: 'Yarn Composition', value: '100% Long-Staple Combed Organic Cotton (Bio-Washed)' },
      { name: 'Weave Construction', value: '3-End Diagonal Loop Terry with High-Tensile Stitching' },
      { name: 'Waist & Wrist Hem', value: '2×2 Heavy Lycra Ribbing (Maintains elasticity forever)' },
      { name: 'Hood Construction', value: 'Volumetric Double-Layered 3-Panel Hood with Metal Aglets' },
    ],
  },
  {
    id: 'thermal',
    title: 'Thermal & Weather Rating',
    icon: Flame,
    specs: [
      { name: 'Cold Resistance', value: 'Tested and certified for sub-zero climates (-10°C to 18°C)' },
      { name: 'Hydrophobic Coating', value: 'PFC-Free DWR (Durable Water Repellent) Nanotechnology' },
      { name: 'Windchill Shield', value: 'Dense cotton loop structure stops highway bike windchill' },
      { name: 'Moisture Vapor Rate', value: 'Breathable 8,000 g/m²/24h (Keeps sweat vapors out)' },
      { name: 'Color Fastness', value: 'Grade 4.5+ Reactive Dyeing (Zero fading after 50 washes)' },
    ],
  },
];

export default function TechSpecs() {
  const [activeTab, setActiveTab] = useState(SPEC_CATEGORIES[0].id);
  const { settings } = useSettings();
  const brandTitle = settings?.title || 'Henley Fashion';

  const handleTabChange = (id) => {
    setActiveTab(id);
    soundManager.playClick(700, 0.03);
  };

  const activeCategory = SPEC_CATEGORIES.find((c) => c.id === activeTab);

  return (
    <section className="techSpecsSection" id="tech-specs">
      <div className="container">
        <div className="sectionHeaderCenter">
          <div className="section-badge">
            <span className="badge-pulse"></span>
            {brandTitle.toUpperCase()} // SIZING & TEXTILE DATASHEET
          </div>
          <h2 className="title">
            Technical <span className="text-gradient">Specifications & Size Chart</span>
          </h2>
          <p className="subtitle">
            ড্রপ-শোল্ডার সাইজ চার্ট, ফেব্রিক কম্পোজিশন এবং ওয়াটার-রিপেলেন্ট টেস্টিং মেট্রিক্স।
            আপনার সঠিক সাইজটি বেছে নিন।
          </p>
        </div>

        <div className="specsLayout">
          {/* Tab Navigation */}
          <div className="specsTabNav">
            {SPEC_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = cat.id === activeTab;
              return (
                <button
                  key={cat.id}
                  className={`specTabBtn ${isActive ? 'active' : ''}`}
                  onClick={() => handleTabChange(cat.id)}
                >
                  <Icon size={18} />
                  <span>{cat.title}</span>
                </button>
              );
            })}
          </div>

          {/* Specs Table Display */}
          <div className="specsDisplayCard">
            <div className="tableHeader">
              <span className="colName">PARAMETER / SIZE METRIC</span>
              <span className="colVal">VERIFIED MEASUREMENT</span>
            </div>

            <div className="tableBody">
              {activeCategory?.specs.map((row, idx) => (
                <div key={idx} className="specTableRow">
                  <div className="paramName">
                    <span className="dot"></span>
                    <span>{row.name}</span>
                  </div>
                  <div className="paramValue">{row.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
