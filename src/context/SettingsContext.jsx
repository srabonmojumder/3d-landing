'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const defaultSettings = {
  title: 'AEROVOID',
  brand_subtitle: 'TECHWEAR ATELIER',
  service_key: 'aerovoid_phantom_hoodie_v1',
  product_name: 'PHANTOM-450 // OVERSIZED DROP SHOULDER HOODIE',
  tag_line: 'BEYOND TEXTILES. ENGINEERED SILHOUETTE.',
  header_logo: '/images/logo.png',
  footer_description: 'An architectural 450 GSM heavyweight drop-shoulder hoodie. Engineered with PFC-free DWR hydrophobic shielding and an internal graphene thermal equilibrium matrix.',
  phone_number: '+880 1614-161001',
  whatsapp_number: '+880 1614-161001',
  footer_email: 'concierge@aerovoid.studio',
  footer_address: 'Atelier Flagship: Eastern Plaza Complex Level 3, Hatirpool, Dhaka // Global Dispatch: London & Tokyo',
  currency: '৳',
  currency_code: 'BDT',
  regular_price: 2850,
  sale_price: 2150,
  shipping_inside: 70,
  shipping_outside: 130,
  place_order_button_text: 'অর্ডার কনফার্ম করুন (ক্যাশ অন ডেলিভারি)',
};

const SettingsContext = createContext({
  settings: defaultSettings,
  updateSettings: () => {},
});

export function SettingsProvider({ children, initialSettings = {} }) {
  const [settings, setSettings] = useState({
    ...defaultSettings,
    ...initialSettings,
  });

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
