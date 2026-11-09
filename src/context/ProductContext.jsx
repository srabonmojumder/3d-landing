'use client';

import React, { createContext, useContext, useState } from 'react';
import { soundManager } from '@/lib/audio';

const ProductContext = createContext();

export const HOODIE_COLORWAYS = [
  {
    id: 'pitch-onyx',
    name: 'Pitch Onyx',
    subtitle: 'Ultra-Dense Carbon Black (DWR Nanotech Finish)',
    colorHex: '#0c0d10',
    edgeHex: '#00f5c4',
    roughness: 0.88,
    metalness: 0.08,
    price: 2150,
    regularPrice: 2850,
    tag: 'Flagship Stealth',
    badge: 'Signature Edition',
  },
  {
    id: 'ghost-mirage',
    name: 'Ghost Mirage',
    subtitle: 'Acid-Wash Vintage Concrete Grey French Terry',
    colorHex: '#4a4e58',
    edgeHex: '#e2e8f0',
    roughness: 0.9,
    metalness: 0.05,
    price: 2150,
    regularPrice: 2850,
    tag: 'Vintage Wash',
    badge: 'Staff Pick',
  },
  {
    id: 'cyber-moss',
    name: 'Cyber Moss',
    subtitle: 'Deep Forest Oxide with Laser-Etched Cyan Seams',
    colorHex: '#12261e',
    edgeHex: '#00f5c4',
    roughness: 0.85,
    metalness: 0.12,
    price: 2250,
    regularPrice: 2950,
    tag: 'Atelier Limited',
    badge: 'Limited Drop',
  },
  {
    id: 'desert-dune',
    name: 'Desert Dune',
    subtitle: 'Raw Earth Mineral Pigment Terry (Sun-Faded Wash)',
    colorHex: '#8e775f',
    edgeHex: '#ff9e2c',
    roughness: 0.92,
    metalness: 0.05,
    price: 2150,
    regularPrice: 2850,
    tag: 'Raw Earth',
    badge: 'New Release',
  },
];

export const HOODIE_SIZES = [
  { size: 'M', chest: '42"', length: '27"', shoulder: '23"', sleeve: '24"' },
  { size: 'L', chest: '44"', length: '28"', shoulder: '24"', sleeve: '25"' },
  { size: 'XL', chest: '46"', length: '29"', shoulder: '25"', sleeve: '26"' },
  { size: 'XXL', chest: '48"', length: '30"', shoulder: '26"', sleeve: '26.5"' },
];

export function ProductProvider({ children }) {
  const [selectedColorway, setSelectedColorway] = useState(HOODIE_COLORWAYS[0]);
  const [selectedSize, setSelectedSize] = useState('L');
  const [viewMode, setViewMode] = useState('studio');
  const [soundActive, setSoundActive] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(1);

  const toggleSound = () => {
    const newState = soundManager.toggle();
    setSoundActive(newState);
  };

  const handleColorwayChange = (colorway) => {
    setSelectedColorway(colorway);
    soundManager.playClick(600, 0.05);
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    soundManager.playClick(750, 0.03);
  };

  return (
    <ProductContext.Provider
      value={{
        colorways: HOODIE_COLORWAYS,
        selectedColorway,
        setSelectedColorway: handleColorwayChange,
        finishes: HOODIE_COLORWAYS,
        selectedFinish: selectedColorway,
        setSelectedFinish: handleColorwayChange,
        sizes: HOODIE_SIZES,
        selectedSize,
        setSelectedSize: handleSizeChange,
        viewMode,
        setViewMode,
        soundActive,
        toggleSound,
        cartQuantity,
        setCartQuantity,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProduct() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
}
