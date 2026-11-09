'use client';

import React from 'react';
import { Award, Star, Quote } from 'lucide-react';
import { soundManager } from '@/lib/audio';
import { useSettings } from '@/context/SettingsContext';

export default function PressReviews() {
  const { settings } = useSettings();
  const brandName = settings?.title || 'AEROVOID';

  const REVIEWS = [
    {
      outlet: 'HYPEBEAST',
      badge: 'STREETWEAR & INNOVATION',
      quote:
        'A masterclass in 3D textile engineering. The continuous scroll deconstruction reveals why this 450 GSM drop shoulder cut is the definitive techwear silhouette of the season.',
      author: 'Apparel & Tech Editor',
      score: '9.8 / 10',
      stars: 5,
    },
    {
      outlet: 'GQ Style',
      badge: 'LUXURY ESSENTIALS',
      quote:
        'The drape is immaculate. Dense, heavyweight, and effortlessly relaxed. The hydrophobic water-beading finish actually works in heavy downpours.',
      author: 'Fashion & Materials Desk',
      score: 'Editor’s Choice',
      stars: 5,
    },
    {
      outlet: 'Highsnobiety',
      badge: 'CULTURE & METALLURGY',
      quote:
        'Finally, a digital experience that honors physical craft. Watching the graphene thermo-matrix separate in real time is pure digital luxury.',
      author: 'Design & Culture Column',
      score: '5 / 5 Stars',
      stars: 5,
    },
  ];

  return (
    <section className="pressReviewsSection" id="reviews">
      <div className="container">
        <div className="sectionHeaderCenter">
          <div className="section-badge">
            <span className="badge-pulse"></span>
            GLOBAL CRITICAL ACCLAIM // EDITORIAL REVIEWS
          </div>
          <h2 className="title">
            Celebrated by <span className="text-gradient">Style & Textile Critics</span>
          </h2>
          <p className="subtitle">
            Recognized internationally for boundary-pushing 3D WebGL execution,
            450 GSM French Terry craftsmanship, and architectural drop-shoulder silhouette.
          </p>
        </div>

        <div className="reviewsGrid">
          {REVIEWS.map((rev, idx) => (
            <div
              key={idx}
              className="reviewCard"
              onMouseEnter={() => soundManager.playClick(850, 0.02)}
            >
              <div className="cardTop">
                <div className="outletHeader">
                  <span className="outletName">{rev.outlet}</span>
                  <div className="starsRow">
                    {[...Array(rev.stars)].map((_, s) => (
                      <Star key={s} size={14} className="starIcon" fill="#00f5c4" />
                    ))}
                  </div>
                </div>
                <span className="accoladeBadge">{rev.badge}</span>
              </div>

              <div className="quoteBody">
                <Quote size={20} className="quoteIcon" />
                <p className="quoteText">“{rev.quote}”</p>
              </div>

              <div className="cardBottom">
                <span className="authorName">{rev.author}</span>
                <span className="scoreTag">{rev.score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
