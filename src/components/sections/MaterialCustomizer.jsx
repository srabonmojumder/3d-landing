'use client';

import React from 'react';
import { useProduct } from '@/context/ProductContext';
import { soundManager } from '@/lib/audio';
import { Check, Sparkles, Shield, Cpu, ArrowRight } from 'lucide-react';

export default function MaterialCustomizer() {
  const { finishes, selectedFinish, setSelectedFinish, setIsPreOrderOpen } = useProduct();

  const handleSelect = (finish) => {
    setSelectedFinish(finish);
    soundManager.playClick(650, 0.04);
  };

  const handleProceedToPreorder = (finish) => {
    setSelectedFinish(finish);
    soundManager.playChime(580, 0.25);
    const orderSection = document.getElementById('pre-order');
    if (orderSection) {
      orderSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="materialCustomizerSection" id="finishes">
      <div className="container">
        <div className="sectionHeaderCenter">
          <div className="section-badge">
            <span className="badge-pulse"></span>
            SURFACE METALLURGY & BIO-POLYMERS
          </div>
          <h2 className="title">
            Crafted in Four <span className="text-gradient">Iconic Finishes</span>
          </h2>
          <p className="subtitle">
            Every material is precision-machined in Switzerland and finished with vacuum-deposited
            PVD ceramic coatings. Choose your personal aesthetic.
          </p>
        </div>

        <div className="finishesGrid">
          {finishes.map((finish) => {
            const isSelected = selectedFinish.id === finish.id;
            return (
              <div
                key={finish.id}
                className={`finishCard ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelect(finish)}
              >
                {/* Badge Tag */}
                <div className="cardBadgeRow">
                  <span className="editionTag">{finish.tag}</span>
                  {isSelected && (
                    <span className="activeTag">
                      <Check size={12} /> ACTIVE
                    </span>
                  )}
                </div>

                {/* Visual Swatch Circle with animated edge glow */}
                <div className="swatchWrapper">
                  <div
                    className="swatchCircle"
                    style={{
                      backgroundColor: finish.colorHex,
                      boxShadow: `0 0 35px ${finish.edgeHex}44, inset 0 0 20px rgba(0,0,0,0.6)`,
                      borderColor: finish.edgeHex,
                    }}
                  >
                    <div className="innerCore"></div>
                  </div>
                </div>

                <div className="finishInfo">
                  <h3 className="finishName">{finish.name}</h3>
                  <p className="finishDesc">{finish.subtitle}</p>

                  <div className="specRow">
                    <span>Roughness: {(finish.roughness * 100).toFixed(0)}%</span>
                    <span>Metalness: {(finish.metalness * 100).toFixed(0)}%</span>
                  </div>

                  <div className="priceRow">
                    <span className="price">${finish.price}</span>
                    <span className="currency">USD</span>
                  </div>
                </div>

                <button
                  className={`selectBtn ${isSelected ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProceedToPreorder(finish);
                  }}
                >
                  <span>{isSelected ? 'Proceed with this Finish' : 'Select Finish'}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

