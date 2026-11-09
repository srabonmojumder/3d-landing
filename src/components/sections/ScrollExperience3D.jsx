'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useProduct } from '@/context/ProductContext';
import { useSettings } from '@/context/SettingsContext';
import { soundManager } from '@/lib/audio';
import {
  Zap,
  ArrowDown,
  PackageCheck,
  Sparkles,
  Layers,
  ShieldCheck,
} from 'lucide-react';

export default function ScrollExperience3D() {
  const containerRef = useRef(null);
  const canvasHolderRef = useRef(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const { settings } = useSettings();
  const {
    colorways,
    selectedColorway,
    setSelectedColorway,
    sizes,
    selectedSize,
    setSelectedSize,
  } = useProduct();

  const brandName = settings?.title || 'AEROVOID';
  const subtitle = settings?.brand_subtitle || 'TECHWEAR ATELIER';

  const CHAPTERS = [
    {
      id: 'unveiling',
      step: '01 // UNVEILING',
      badge: `${brandName} // DROP 01 ARCHITECTURAL CUT`,
      title: 'Unfolds Into Heavyweight Form.',
      desc: 'Sculpted from 450 GSM combed cotton. Scroll down to watch the hoodie unfurl from its compact folded geometry into an oversized drop-shoulder techwear silhouette.',
      metric: '450 GSM',
      metricLabel: 'French Terry Density',
    },
    {
      id: 'kinematics',
      step: '02 // 360° DRAPE',
      badge: 'ERGONOMIC KINEMATIC DRAPE',
      title: 'Zero Restriction. Street-Engineered.',
      desc: 'Double-needle flatlock bar-tack seams with reinforced kangaroo pocket ergonomics. The fabric falls with natural geometric weight without clinging, providing an effortless streetwear drape.',
      metric: '360° Flex',
      metricLabel: 'Multi-Directional Drape',
    },
    {
      id: 'deconstruction',
      step: '03 // TEXTILE MATRIX',
      badge: 'EXPLODED THREE-LAYER DECONSTRUCTION',
      title: 'Three Constituent Performance Strata.',
      desc: 'Watch the hoodie pull apart into its 3 constituent layers: Outer Hydrophobic DWR Shell, Core Graphene Thermo-Matrix, and Inner Silver-Ion French Terry loop lining.',
      metric: '3 Strata',
      metricLabel: 'Textile Architecture',
    },
    {
      id: 'hardware',
      step: '04 // HARDWARE & CRAFT',
      badge: 'AEROSPACE TITANIUM & FLATLOCK BAR-TACK',
      title: 'Precision Down To The Millimeter.',
      desc: 'Aerospace-grade titanium drawcord aglets, reinforced bar-tack stress points, and an embossed cyber crest engineered to endure years of high-intensity urban wear.',
      metric: 'Grade 5 Ti',
      metricLabel: 'Hardware Aglet Spec',
    },
    {
      id: 'packaging',
      step: '05 // ARCHIVAL PACKAGING',
      badge: 'CUSTOM TECHWEAR MATTE PRESENTATION CASE',
      title: 'Folds Neatly Into Its Luxury Vault.',
      desc: 'Watch the hoodie fold itself into archival geometry before being enclosed in our custom matte-black magnetic presentation box with tamper-evident serialized seals.',
      metric: 'Anti-Static',
      metricLabel: 'Sealed Luxury Vault',
    },
    {
      id: 'dispatch',
      step: '06 // BATCH 01 ALLOCATION',
      badge: 'LIMITED DROP // SERIALIZED DISPATCH',
      title: 'Ready For Fast Express Delivery.',
      desc: 'Each order comes serialized with authentication certificate and custom dust bag. Select your preferred colorway and drop shoulder size below to secure yours.',
      metric: '48-72h',
      metricLabel: 'Nationwide Dispatch',
    },
  ];

  // Three.js internal references
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const hoodieGroupRef = useRef(null);
  const outerShellRef = useRef(null);
  const grapheneCoreRef = useRef(null);
  const innerLiningRef = useRef(null);

  // Anatomical parts for folding/opening animation
  const torsoMeshRef = useRef(null);
  const hemMeshRef = useRef(null);
  const pocketMeshRef = useRef(null);
  const leftSleeveRef = useRef(null);
  const rightSleeveRef = useRef(null);
  const leftCuffRef = useRef(null);
  const rightCuffRef = useRef(null);
  const hoodOuterRef = useRef(null);
  const hoodInnerRef = useRef(null);
  const crestMeshRef = useRef(null);

  // Packaging Box references
  const boxGroupRef = useRef(null);
  const boxLidPivotRef = useRef(null);
  const boxLatchRef = useRef(null);

  const fabricTextureRef = useRef(null);

  // Smooth lerp state
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);

  // Helper: Generate Procedural French Terry Weave Bump Map
  const generateFabricTexture = () => {
    if (typeof window === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 256, 256);

    // Diagonal French Terry loop ridges
    ctx.strokeStyle = '#9a9a9a';
    ctx.lineWidth = 1.5;
    for (let i = -256; i < 512; i += 6) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 256, 256);
      ctx.stroke();
    }
    ctx.strokeStyle = '#686868';
    ctx.lineWidth = 1;
    for (let i = -256; i < 512; i += 8) {
      ctx.beginPath();
      ctx.moveTo(i + 256, 0);
      ctx.lineTo(i, 256);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10, 10);
    return texture;
  };

  // 1. SETUP THREE.JS SCENE ON MOUNT
  useEffect(() => {
    const holder = canvasHolderRef.current;
    if (!holder) return;

    // SCENE
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // CAMERA
    const camera = new THREE.PerspectiveCamera(
      40,
      holder.clientWidth / holder.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0.4, 7.5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // RENDERER
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(holder.clientWidth, holder.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    holder.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // FABRIC TEXTURE BUMP
    const fabricTexture = generateFabricTexture();
    fabricTextureRef.current = fabricTexture;

    // LIGHTING SETUP (STUDIO CINEMATOGRAPHY)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(6, 9, 8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const cyanRimLight = new THREE.DirectionalLight(0x00f5c4, 3.6);
    cyanRimLight.position.set(-8, -2, -6);
    scene.add(cyanRimLight);

    const amberFillLight = new THREE.PointLight(0xff9e2c, 1.6, 20);
    amberFillLight.position.set(4, -4, 4);
    scene.add(amberFillLight);

    // Floor Contact Shadow Plane
    const shadowPlaneGeo = new THREE.PlaneGeometry(8, 8);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d');
    const grad = sCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(0,0,0,0.7)');
    grad.addColorStop(0.5, 'rgba(0,0,0,0.3)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 128, 128);
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowPlaneGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -2.2;
    scene.add(shadowMesh);

    // ==========================================
    // 2. PROCEDURAL HIGH-FASHION HOODIE MESH GROUP
    // ==========================================
    const hoodieGroup = new THREE.Group();
    hoodieGroupRef.current = hoodieGroup;
    scene.add(hoodieGroup);

    const baseFabricColor = new THREE.Color(selectedColorway.colorHex);

    const makeFabricMat = (color, roughness = 0.88, isWire = false) =>
      new THREE.MeshStandardMaterial({
        color: color,
        roughness: roughness,
        metalness: 0.08,
        bumpMap: fabricTexture,
        bumpScale: 0.035,
        wireframe: isWire,
      });

    // LAYER 1: OUTER HIGH-DENSITY SHELL
    const outerGroup = new THREE.Group();
    outerShellRef.current = outerGroup;
    hoodieGroup.add(outerGroup);

    // (A) Torso with Organic Fabric Contours
    const torsoGeo = new THREE.CylinderGeometry(1.42, 1.32, 2.3, 48, 12);
    const pos = torsoGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const angle = Math.atan2(pos.getZ(i), pos.getX(i));
      if (y < -0.4 && y > -1.0) {
        const fold = Math.sin(angle * 4 + y * 5) * 0.04;
        pos.setX(i, pos.getX(i) + Math.cos(angle) * fold);
        pos.setZ(i, pos.getZ(i) + Math.sin(angle) * fold);
      }
    }
    torsoGeo.computeVertexNormals();

    const torsoMesh = new THREE.Mesh(torsoGeo, makeFabricMat(baseFabricColor));
    torsoMesh.scale.set(1.0, 1.0, 0.66);
    torsoMesh.position.y = -0.1;
    torsoMesh.castShadow = true;
    outerGroup.add(torsoMesh);
    torsoMeshRef.current = torsoMesh;

    // (B) Ribbed Waistband Hem
    const hemGeo = new THREE.CylinderGeometry(1.26, 1.24, 0.3, 48);
    const hemMat = new THREE.MeshStandardMaterial({
      color: baseFabricColor.clone().multiplyScalar(0.88),
      roughness: 0.95,
      bumpMap: fabricTexture,
      bumpScale: 0.06,
    });
    const hemMesh = new THREE.Mesh(hemGeo, hemMat);
    hemMesh.scale.set(1.0, 1.0, 0.64);
    hemMesh.position.y = -1.35;
    outerGroup.add(hemMesh);
    hemMeshRef.current = hemMesh;

    // (C) Front Kangaroo Pouch Pocket
    const pocketGeo = new THREE.CylinderGeometry(
      1.3,
      1.34,
      0.82,
      24,
      1,
      false,
      -Math.PI * 0.36,
      Math.PI * 0.72
    );
    const pocketMat = makeFabricMat(baseFabricColor.clone().multiplyScalar(0.92));
    const pocketMesh = new THREE.Mesh(pocketGeo, pocketMat);
    pocketMesh.scale.set(0.96, 1.0, 0.72);
    pocketMesh.position.set(0, -0.42, 0.08);
    outerGroup.add(pocketMesh);
    pocketMeshRef.current = pocketMesh;

    // Pocket Top Ribbed Lip
    const lipGeo = new THREE.TorusGeometry(0.85, 0.035, 12, 32, Math.PI * 0.6);
    const lipMesh = new THREE.Mesh(lipGeo, hemMat);
    lipMesh.position.set(0, 0.02, 0.52);
    lipMesh.rotation.z = Math.PI * 0.7;
    outerGroup.add(lipMesh);

    // (D) Oversized Drop Shoulder Sleeves
    const sleeveGeo = new THREE.CylinderGeometry(0.54, 0.36, 2.15, 32, 8);

    // Left Sleeve
    const leftSleeve = new THREE.Mesh(sleeveGeo, makeFabricMat(baseFabricColor));
    leftSleeve.position.set(-1.62, 0.18, 0.02);
    leftSleeve.rotation.z = -0.54;
    leftSleeve.rotation.x = 0.08;
    leftSleeve.scale.set(1.0, 1.0, 0.78);
    outerGroup.add(leftSleeve);
    leftSleeveRef.current = leftSleeve;

    // Left Ribbed Wrist Cuff
    const cuffGeo = new THREE.CylinderGeometry(0.35, 0.33, 0.32, 24);
    const leftCuff = new THREE.Mesh(cuffGeo, hemMat);
    leftCuff.position.set(-2.18, -0.84, 0.02);
    leftCuff.rotation.z = -0.54;
    leftCuff.rotation.x = 0.08;
    outerGroup.add(leftCuff);
    leftCuffRef.current = leftCuff;

    // Right Sleeve
    const rightSleeve = new THREE.Mesh(sleeveGeo, makeFabricMat(baseFabricColor));
    rightSleeve.position.set(1.62, 0.18, 0.02);
    rightSleeve.rotation.z = 0.54;
    rightSleeve.rotation.x = 0.08;
    rightSleeve.scale.set(1.0, 1.0, 0.78);
    outerGroup.add(rightSleeve);
    rightSleeveRef.current = rightSleeve;

    // Right Ribbed Wrist Cuff
    const rightCuff = new THREE.Mesh(cuffGeo, hemMat);
    rightCuff.position.set(2.18, -0.84, 0.02);
    rightCuff.rotation.z = 0.54;
    rightCuff.rotation.x = 0.08;
    outerGroup.add(rightCuff);
    rightCuffRef.current = rightCuff;

    // (E) Deep Volumetric Double-Layer Hood
    const hoodOuterGeo = new THREE.SphereGeometry(1.08, 36, 28, 0, Math.PI * 2, 0, Math.PI * 0.74);
    const hoodOuter = new THREE.Mesh(hoodOuterGeo, makeFabricMat(baseFabricColor));
    hoodOuter.position.set(0, 1.48, -0.2);
    hoodOuter.scale.set(1.05, 1.18, 0.96);
    hoodOuter.rotation.x = 0.28;
    outerGroup.add(hoodOuter);
    hoodOuterRef.current = hoodOuter;

    // Dark Inner Cowl Cavity
    const hoodInnerGeo = new THREE.SphereGeometry(1.02, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.7);
    const hoodInnerMat = new THREE.MeshStandardMaterial({
      color: 0x050608,
      roughness: 0.95,
      side: THREE.BackSide,
    });
    const hoodInner = new THREE.Mesh(hoodInnerGeo, hoodInnerMat);
    hoodInner.position.set(0, 1.48, -0.18);
    hoodInner.scale.set(1.02, 1.15, 0.94);
    hoodInner.rotation.x = 0.28;
    outerGroup.add(hoodInner);
    hoodInnerRef.current = hoodInner;

    // Cowl Neck Collar Band
    const neckBandGeo = new THREE.TorusGeometry(0.72, 0.08, 16, 48);
    const neckBand = new THREE.Mesh(neckBandGeo, hemMat);
    neckBand.position.set(0, 1.05, 0.12);
    neckBand.rotation.x = Math.PI * 0.42;
    outerGroup.add(neckBand);

    // Hanging Braided Drawstrings with Titanium Aglets
    [-0.22, 0.22].forEach((xPos) => {
      const stringGeo = new THREE.CylinderGeometry(0.022, 0.022, 1.1, 10);
      const stringMat = new THREE.MeshStandardMaterial({
        color: 0xf0f2f5,
        roughness: 0.7,
      });
      const stringMesh = new THREE.Mesh(stringGeo, stringMat);
      stringMesh.position.set(xPos, 0.7, 0.52);
      outerGroup.add(stringMesh);

      // Metallic Titanium Aglet
      const agletGeo = new THREE.CylinderGeometry(0.028, 0.028, 0.2, 16);
      const agletMat = new THREE.MeshStandardMaterial({
        color: 0x00f5c4,
        metalness: 0.95,
        roughness: 0.15,
      });
      const aglet = new THREE.Mesh(agletGeo, agletMat);
      aglet.position.set(xPos, 0.12, 0.52);
      outerGroup.add(aglet);
    });

    // Chest Minimalist Cyber Crest / Logo Plate
    const crestGeo = new THREE.BoxGeometry(0.55, 0.18, 0.03);
    const crestMat = new THREE.MeshStandardMaterial({
      color: 0x07090e,
      emissive: 0x00f5c4,
      emissiveIntensity: 0.85,
      metalness: 0.8,
      roughness: 0.2,
    });
    const crest = new THREE.Mesh(crestGeo, crestMat);
    crest.position.set(0, 0.65, 0.45);
    outerGroup.add(crest);
    crestMeshRef.current = crest;

    // LAYER 2: CORE GRAPHENE THERMO-MATRIX (Revealed in Chapter 3)
    const grapheneGroup = new THREE.Group();
    grapheneCoreRef.current = grapheneGroup;
    hoodieGroup.add(grapheneGroup);

    const graphTorsoGeo = new THREE.CylinderGeometry(1.36, 1.26, 2.2, 28, 6);
    const graphMat = new THREE.MeshStandardMaterial({
      color: 0x00f5c4,
      emissive: 0x00b894,
      emissiveIntensity: 0.7,
      wireframe: true,
    });
    const graphTorso = new THREE.Mesh(graphTorsoGeo, graphMat);
    graphTorso.scale.set(0.96, 0.96, 0.62);
    graphTorso.position.y = -0.1;
    grapheneGroup.add(graphTorso);

    // Graphene hexagonal conductivity rings
    for (let h = -0.8; h <= 0.8; h += 0.35) {
      const ringGeo = new THREE.TorusGeometry(1.18, 0.025, 12, 36);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x5effdb });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.position.y = h;
      grapheneGroup.add(ringMesh);
    }

    // LAYER 3: INNER SILVER-ION FRENCH TERRY LINING
    const innerGroup = new THREE.Group();
    innerLiningRef.current = innerGroup;
    hoodieGroup.add(innerGroup);

    const innerTorsoGeo = new THREE.CylinderGeometry(1.3, 1.2, 2.1, 28);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x8b9bb4,
      metalness: 0.75,
      roughness: 0.35,
      bumpMap: fabricTexture,
      bumpScale: 0.05,
    });
    const innerTorso = new THREE.Mesh(innerTorsoGeo, innerMat);
    innerTorso.scale.set(0.92, 0.92, 0.58);
    innerTorso.position.y = -0.1;
    innerGroup.add(innerTorso);

    // ==========================================
    // 3. ARCHITECTURAL TECHWEAR PACKAGING BOX (Chapter 5 & 6)
    // ==========================================
    const boxGroup = new THREE.Group();
    boxGroup.visible = false;
    boxGroupRef.current = boxGroup;
    scene.add(boxGroup);

    // Box Materials
    const boxMat = new THREE.MeshStandardMaterial({
      color: 0x0d0f16,
      roughness: 0.32,
      metalness: 0.65,
    });
    const cushionMat = new THREE.MeshStandardMaterial({
      color: 0x050608,
      roughness: 0.96,
      metalness: 0.1,
    });
    const cyanGlowMat = new THREE.MeshStandardMaterial({
      color: 0x00f5c4,
      emissive: 0x00f5c4,
      emissiveIntensity: 0.85,
      roughness: 0.2,
      metalness: 0.8,
    });
    const foilStickerMat = new THREE.MeshStandardMaterial({
      color: 0xff9e2c,
      emissive: 0xff9e2c,
      emissiveIntensity: 0.45,
      metalness: 0.9,
      roughness: 0.2,
    });

    // (A) Tray Base
    const trayGeo = new THREE.BoxGeometry(2.7, 0.45, 2.3);
    const trayMesh = new THREE.Mesh(trayGeo, boxMat);
    trayMesh.castShadow = true;
    trayMesh.receiveShadow = true;
    boxGroup.add(trayMesh);

    // Interior Velvet Cushion Recess
    const cushionGeo = new THREE.BoxGeometry(2.5, 0.32, 2.1);
    const cushionMesh = new THREE.Mesh(cushionGeo, cushionMat);
    cushionMesh.position.y = 0.08;
    boxGroup.add(cushionMesh);

    // Front Magnetic Latch Bar
    const latchGeo = new THREE.BoxGeometry(0.7, 0.08, 0.04);
    const latchMesh = new THREE.Mesh(latchGeo, cyanGlowMat);
    latchMesh.position.set(0, 0.16, 1.16);
    boxGroup.add(latchMesh);
    boxLatchRef.current = latchMesh;

    // (B) Hinged Lid Pivot at Rear Edge
    const lidPivot = new THREE.Group();
    lidPivot.position.set(0, 0.22, -1.15);
    boxGroup.add(lidPivot);
    boxLidPivotRef.current = lidPivot;

    // Lid Panel (Extending forward from hinge)
    const lidGeo = new THREE.BoxGeometry(2.72, 0.1, 2.32);
    const lidMesh = new THREE.Mesh(lidGeo, boxMat);
    lidMesh.position.set(0, 0.05, 1.15);
    lidMesh.castShadow = true;
    lidPivot.add(lidMesh);

    // Laser-Etched Cyber Plate on Top of Lid
    const plateGeo = new THREE.BoxGeometry(1.4, 0.02, 0.45);
    const plateMesh = new THREE.Mesh(plateGeo, cyanGlowMat);
    plateMesh.position.set(0, 0.11, 1.15);
    lidPivot.add(plateMesh);

    // Holographic Serialized Security Seal on Lid Front Edge
    const sealGeo = new THREE.BoxGeometry(0.4, 0.03, 0.3);
    const sealMesh = new THREE.Mesh(sealGeo, foilStickerMat);
    sealMesh.position.set(0.9, 0.11, 1.95);
    lidPivot.add(sealMesh);

    // ==========================================
    // 4. BACKGROUND DUST PARTICLES
    // ==========================================
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 16;
      positions[i + 1] = (Math.random() - 0.5) * 12;
      positions[i + 2] = (Math.random() - 0.5) * 12;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.045,
      color: 0x00f5c4,
      transparent: true,
      opacity: 0.4,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ==========================================
    // 5. SCROLL PROGRESS TRACKING
    // ==========================================
    const onScroll = () => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const totalDist = container.clientHeight - window.innerHeight;
      if (totalDist <= 0) return;

      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalDist));
      targetProgressRef.current = progress;
      setScrollProgress(progress);

      const chapterIdx = Math.min(
        CHAPTERS.length - 1,
        Math.floor(progress * CHAPTERS.length)
      );
      setCurrentChapterIndex(chapterIdx);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ==========================================
    // 6. CINEMATIC 6-PHASE ANIMATION LOOP
    // ==========================================
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Smooth progress lerp (60+ FPS interpolation)
      currentProgressRef.current +=
        (targetProgressRef.current - currentProgressRef.current) * 0.075;
      const p = currentProgressRef.current;

      const camera = cameraRef.current;
      const hoodie = hoodieGroupRef.current;
      const outer = outerShellRef.current;
      const graphene = grapheneCoreRef.current;
      const inner = innerLiningRef.current;

      const leftSleeve = leftSleeveRef.current;
      const rightSleeve = rightSleeveRef.current;
      const leftCuff = leftCuffRef.current;
      const rightCuff = rightCuffRef.current;
      const torsoMesh = torsoMeshRef.current;
      const hemMesh = hemMeshRef.current;
      const pocketMesh = pocketMeshRef.current;
      const hoodOuter = hoodOuterRef.current;
      const hoodInner = hoodInnerRef.current;

      const boxGroup = boxGroupRef.current;
      const boxLidPivot = boxLidPivotRef.current;
      const boxLatch = boxLatchRef.current;

      if (!camera || !hoodie || !outer || !graphene || !inner) return;

      // ==========================================
      // PHASE 1: UNVEILING & OPENING (0.00 -> 0.16)
      // Hoodie physically UNFURLS/OPENS from folded into full silhouette
      // ==========================================
      if (p < 0.16) {
        const localP = p / 0.16;

        if (boxGroup) boxGroup.visible = false;
        hoodie.visible = true;

        // Camera gentle approach
        camera.position.x = THREE.MathUtils.lerp(0, 0.25, localP);
        camera.position.y = THREE.MathUtils.lerp(0.5, 0.35, localP);
        camera.position.z = THREE.MathUtils.lerp(7.8, 6.8, localP);
        camera.lookAt(0, 0, 0);

        hoodie.position.set(0, Math.sin(time * 1.5) * 0.05, 0);
        hoodie.rotation.set(
          THREE.MathUtils.lerp(0.2, 0.05, localP),
          THREE.MathUtils.lerp(-0.2, 0.25, localP) + Math.sin(time * 0.8) * 0.04,
          0
        );
        hoodie.scale.setScalar(1.0);

        // Sleeves unfolding open outward
        if (leftSleeve && rightSleeve && leftCuff && rightCuff) {
          leftSleeve.rotation.z = THREE.MathUtils.lerp(0.12, -0.54, localP);
          leftSleeve.position.x = THREE.MathUtils.lerp(-0.95, -1.62, localP);
          rightSleeve.rotation.z = THREE.MathUtils.lerp(-0.12, 0.54, localP);
          rightSleeve.position.x = THREE.MathUtils.lerp(0.95, 1.62, localP);

          leftCuff.position.set(
            THREE.MathUtils.lerp(-1.25, -2.18, localP),
            THREE.MathUtils.lerp(-1.1, -0.84, localP),
            0.02
          );
          rightCuff.position.set(
            THREE.MathUtils.lerp(1.25, 2.18, localP),
            THREE.MathUtils.lerp(-1.1, -0.84, localP),
            0.02
          );
        }

        // Torso expanding upward
        if (torsoMesh && hemMesh && pocketMesh) {
          torsoMesh.scale.set(1.0, THREE.MathUtils.lerp(0.65, 1.0, localP), 0.66);
          torsoMesh.position.y = THREE.MathUtils.lerp(-0.35, -0.1, localP);
          hemMesh.position.y = THREE.MathUtils.lerp(-0.85, -1.35, localP);
          pocketMesh.position.y = THREE.MathUtils.lerp(-0.25, -0.42, localP);
          pocketMesh.scale.set(0.96, THREE.MathUtils.lerp(0.65, 1.0, localP), 0.72);
        }

        // Hood blooming open
        if (hoodOuter && hoodInner) {
          const hoodScale = THREE.MathUtils.lerp(0.65, 1.0, localP);
          hoodOuter.scale.set(1.05 * hoodScale, 1.18 * hoodScale, 0.96 * hoodScale);
          hoodInner.scale.set(1.02 * hoodScale, 1.15 * hoodScale, 0.94 * hoodScale);
          hoodOuter.position.y = THREE.MathUtils.lerp(0.95, 1.48, localP);
          hoodInner.position.y = THREE.MathUtils.lerp(0.95, 1.48, localP);
        }

        outer.position.set(0, 0, 0);
        graphene.position.set(0, 0, 0);
        inner.position.set(0, 0, 0);
      }
      // ==========================================
      // PHASE 2: 360° DRAPE & KINEMATICS (0.16 -> 0.33)
      // Fully opened hoodie glides left, executes smooth 360° rotation
      // ==========================================
      else if (p < 0.33) {
        const localP = (p - 0.16) / 0.17;

        if (boxGroup) boxGroup.visible = false;
        hoodie.visible = true;

        // Ensure fully opened pose
        if (leftSleeve && rightSleeve && leftCuff && rightCuff) {
          leftSleeve.rotation.z = -0.54;
          leftSleeve.position.x = -1.62;
          rightSleeve.rotation.z = 0.54;
          rightSleeve.position.x = 1.62;
          leftCuff.position.set(-2.18, -0.84, 0.02);
          rightCuff.position.set(2.18, -0.84, 0.02);
        }
        if (torsoMesh && hemMesh && pocketMesh) {
          torsoMesh.scale.set(1.0, 1.0, 0.66);
          torsoMesh.position.y = -0.1;
          hemMesh.position.y = -1.35;
          pocketMesh.position.y = -0.42;
          pocketMesh.scale.set(0.96, 1.0, 0.72);
        }
        if (hoodOuter && hoodInner) {
          hoodOuter.scale.set(1.05, 1.18, 0.96);
          hoodInner.scale.set(1.02, 1.15, 0.94);
          hoodOuter.position.y = 1.48;
          hoodInner.position.y = 1.48;
        }

        camera.position.x = THREE.MathUtils.lerp(0.25, 0.1, localP);
        camera.position.y = THREE.MathUtils.lerp(0.35, 0.1, localP);
        camera.position.z = THREE.MathUtils.lerp(6.8, 5.8, localP);
        camera.lookAt(-0.6, 0, 0);

        hoodie.position.x = THREE.MathUtils.lerp(0, -1.2, localP);
        hoodie.position.y = Math.sin(time * 1.5) * 0.05;
        hoodie.position.z = 0;
        hoodie.rotation.x = 0.08;
        hoodie.rotation.y = THREE.MathUtils.lerp(0.25, Math.PI * 2.2, localP);
        hoodie.scale.setScalar(THREE.MathUtils.lerp(1.0, 1.15, localP));

        outer.position.set(0, 0, 0);
        graphene.position.set(0, 0, 0);
        inner.position.set(0, 0, 0);
      }
      // ==========================================
      // PHASE 3: TEXTILE MATRIX DECONSTRUCTION (0.33 -> 0.50)
      // Hoodie glides to right, pulls apart into 3 floating strata
      // ==========================================
      else if (p < 0.50) {
        const localP = (p - 0.33) / 0.17;

        if (boxGroup) boxGroup.visible = false;
        hoodie.visible = true;

        camera.position.x = THREE.MathUtils.lerp(0.1, -0.3, localP);
        camera.position.y = THREE.MathUtils.lerp(0.1, 0.3, localP);
        camera.position.z = THREE.MathUtils.lerp(5.8, 6.2, localP);
        camera.lookAt(0.5, 0, 0);

        hoodie.position.x = THREE.MathUtils.lerp(-1.2, 1.1, localP);
        hoodie.position.y = Math.sin(time * 1.5) * 0.05;
        hoodie.position.z = 0;
        hoodie.rotation.x = 0.12;
        hoodie.rotation.y = THREE.MathUtils.lerp(Math.PI * 2.2, Math.PI * 2.45, localP);
        hoodie.scale.setScalar(1.15);

        // Explode separation (layers pull apart smoothly)
        const explodeFactor = Math.sin(localP * Math.PI);
        outer.position.set(0, explodeFactor * 0.85, explodeFactor * 1.35);
        graphene.position.set(0, 0, 0);
        inner.position.set(0, -explodeFactor * 0.75, -explodeFactor * 1.25);
      }
      // ==========================================
      // PHASE 4: HARDWARE & CRAFT (0.50 -> 0.67)
      // Camera macro swoop on titanium aglets and chest crest
      // ==========================================
      else if (p < 0.67) {
        const localP = (p - 0.50) / 0.17;

        if (boxGroup) boxGroup.visible = false;
        hoodie.visible = true;

        // Reassemble layers
        outer.position.set(0, 0, 0);
        graphene.position.set(0, 0, 0);
        inner.position.set(0, 0, 0);

        camera.position.x = THREE.MathUtils.lerp(-0.3, -0.15, localP);
        camera.position.y = THREE.MathUtils.lerp(0.3, 0.45, localP);
        camera.position.z = THREE.MathUtils.lerp(6.2, 3.4, localP);
        camera.lookAt(-0.5, 0.25, 0.3);

        hoodie.position.x = THREE.MathUtils.lerp(1.1, -0.6, localP);
        hoodie.position.y = Math.sin(time * 1.5) * 0.04;
        hoodie.position.z = 0;
        hoodie.rotation.x = THREE.MathUtils.lerp(0.12, 0.18, localP);
        hoodie.rotation.y = THREE.MathUtils.lerp(Math.PI * 2.45, Math.PI * 2.05, localP);
        hoodie.scale.setScalar(1.1);
      }
      // ==========================================
      // PHASE 5: ARCHIVAL PACKAGING (0.67 -> 0.84)
      // Hoodie folds itself flat, slides into presentation box, lid shuts!
      // ==========================================
      else if (p < 0.84) {
        const localP = (p - 0.67) / 0.17;

        if (boxGroup) boxGroup.visible = true;
        hoodie.visible = true;

        // Elevated 3D perspective
        camera.position.x = THREE.MathUtils.lerp(-0.15, 0, localP);
        camera.position.y = THREE.MathUtils.lerp(0.45, 2.5, localP);
        camera.position.z = THREE.MathUtils.lerp(3.4, 5.8, localP);
        camera.lookAt(0.3, -0.3, 0);

        // Box position & lid animation
        if (boxGroup) {
          boxGroup.position.set(0.3, -0.55, 0);
          boxGroup.rotation.set(0.28, -0.15, 0);
        }

        if (boxLidPivot) {
          if (localP < 0.45) {
            boxLidPivot.rotation.x = -Math.PI * 0.55; // Lid open
          } else {
            // Lid swings shut!
            const closeP = (localP - 0.45) / 0.55;
            boxLidPivot.rotation.x = THREE.MathUtils.lerp(-Math.PI * 0.55, 0, closeP);
          }
        }

        // Hoodie folds flat and slides into box tray
        const foldP = Math.min(1.0, localP * 1.8);

        if (leftSleeve && rightSleeve && leftCuff && rightCuff) {
          leftSleeve.rotation.z = THREE.MathUtils.lerp(-0.54, 0.75, foldP);
          leftSleeve.position.x = THREE.MathUtils.lerp(-1.62, -0.4, foldP);
          rightSleeve.rotation.z = THREE.MathUtils.lerp(0.54, -0.75, foldP);
          rightSleeve.position.x = THREE.MathUtils.lerp(1.62, 0.4, foldP);

          leftCuff.position.set(
            THREE.MathUtils.lerp(-2.18, -0.1, foldP),
            THREE.MathUtils.lerp(-0.84, -0.6, foldP),
            0.15
          );
          rightCuff.position.set(
            THREE.MathUtils.lerp(2.18, 0.1, foldP),
            THREE.MathUtils.lerp(-0.84, -0.6, foldP),
            0.15
          );
        }

        if (torsoMesh && hemMesh && pocketMesh) {
          torsoMesh.scale.set(
            THREE.MathUtils.lerp(1.0, 0.85, foldP),
            THREE.MathUtils.lerp(1.0, 0.55, foldP),
            0.4
          );
          torsoMesh.position.y = THREE.MathUtils.lerp(-0.1, -0.3, foldP);
        }

        if (hoodOuter && hoodInner) {
          const hoodFold = THREE.MathUtils.lerp(1.0, 0.4, foldP);
          hoodOuter.scale.set(1.05 * hoodFold, 1.18 * hoodFold, 0.96 * hoodFold);
          hoodInner.scale.set(1.02 * hoodFold, 1.15 * hoodFold, 0.94 * hoodFold);
          hoodOuter.position.y = THREE.MathUtils.lerp(1.48, 0.35, foldP);
          hoodInner.position.y = THREE.MathUtils.lerp(1.48, 0.35, foldP);
        }

        hoodie.scale.setScalar(THREE.MathUtils.lerp(1.1, 0.58, foldP));
        hoodie.position.set(
          THREE.MathUtils.lerp(-0.6, 0.3, foldP),
          THREE.MathUtils.lerp(0, -0.42, foldP),
          THREE.MathUtils.lerp(0, 0.05, foldP)
        );
        hoodie.rotation.set(
          THREE.MathUtils.lerp(0.18, Math.PI * 0.48, foldP),
          0,
          0
        );

        // Flash magnetic latch as lid closes
        if (boxLatch && localP > 0.85) {
          boxLatch.material.emissiveIntensity = 1.4;
        } else if (boxLatch) {
          boxLatch.material.emissiveIntensity = 0.85;
        }
      }
      // ==========================================
      // PHASE 6: BATCH 01 ALLOCATION & DISPATCH (0.84 -> 1.00)
      // Sealed luxury box floats in hero angle on left, configuration card on right
      // ==========================================
      else {
        const localP = (p - 0.84) / 0.16;

        if (boxGroup) boxGroup.visible = true;
        hoodie.visible = false; // Neatly sealed inside the box

        if (boxLidPivot) boxLidPivot.rotation.x = 0; // Fully locked

        camera.position.set(0, 0.4, 6.2);
        camera.lookAt(-0.4, 0, 0);

        // Floating hero box presentation
        if (boxGroup) {
          boxGroup.position.set(
            THREE.MathUtils.lerp(0.3, -1.15, localP),
            THREE.MathUtils.lerp(-0.55, 0.1, localP) + Math.sin(time * 1.5) * 0.05,
            THREE.MathUtils.lerp(0, 0.4, localP)
          );
          boxGroup.rotation.set(
            THREE.MathUtils.lerp(0.28, 0.38, localP),
            THREE.MathUtils.lerp(-0.15, 0.46, localP) + Math.sin(time * 0.8) * 0.04,
            -0.06
          );
        }
      }

      particles.rotation.y = time * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!holder || !renderer || !camera) return;
      camera.aspect = holder.clientWidth / holder.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(holder.clientWidth, holder.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && holder.contains(renderer.domElement)) {
        holder.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Dynamically update outer shell fabric color on colorway change
  useEffect(() => {
    if (!outerShellRef.current) return;
    const newColor = new THREE.Color(selectedColorway.colorHex);
    outerShellRef.current.traverse((child) => {
      if (child.isMesh && child.material) {
        if (!child.material.emissiveIntensity) {
          child.material.color = newColor;
        }
      }
    });
  }, [selectedColorway]);

  const activeChapter = CHAPTERS[currentChapterIndex] || CHAPTERS[0];

  const scrollToOrder = () => {
    soundManager.playClick(650, 0.04);
    const el = document.getElementById('pre-order');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="scrollExperienceWrapper" ref={containerRef}>
      {/* 1. STICKY 3D VIEWPORT */}
      <div className="stickyCanvasStage">
        <div className="threeCanvasHolder" ref={canvasHolderRef}></div>

        {/* Floating Telemetry HUD */}
        <div className="hudTelemetryBar top-left">
          <div className="hudRow">
            <span className="hudLabel">BRAND:</span>
            <span className="hudVal cyan">{brandName} // {subtitle}</span>
          </div>
          <div className="hudRow">
            <span className="hudLabel">FABRIC SPEC:</span>
            <span className="hudVal">450 GSM DWR TERRY</span>
          </div>
          <div className="hudRow">
            <span className="hudLabel">PHASE:</span>
            <span className="hudVal amber">{activeChapter.step}</span>
          </div>
        </div>

        <div className="hudTelemetryBar top-right">
          <div className="hudRow">
            <span className="hudLabel">COLORWAY:</span>
            <span className="hudVal cyan">{selectedColorway.name}</span>
          </div>
          <div className="hudRow">
            <span className="hudLabel">SIZE SELECTED:</span>
            <span className="hudVal green">{selectedSize} (DROP SHOULDER)</span>
          </div>
        </div>

        {/* Exploded Mode Hotspot Annotation Pins (Active during Chapter 3) */}
        {currentChapterIndex === 2 && (
          <div className="scrollExplodedPins">
            <div className="pinItem pinTop">
              <span className="pinDot"></span>
              <div className="pinCard">
                <strong>Layer 01: 450 GSM Cotton Shell</strong>
                <p>Hydrophobic DWR fluorocarbon-free finish</p>
              </div>
            </div>
            <div className="pinItem pinCore">
              <span className="pinDot"></span>
              <div className="pinCard">
                <strong>Layer 02: Graphene Thermo-Matrix</strong>
                <p>37°C body heat conduction & moisture exhaust</p>
              </div>
            </div>
            <div className="pinItem pinBase">
              <span className="pinDot"></span>
              <div className="pinCard">
                <strong>Layer 03: Silver-Ion French Terry</strong>
                <p>Anti-microbial, zero odor, ultra-soft loop lining</p>
              </div>
            </div>
          </div>
        )}

        {/* Left-side Step Indicator */}
        <div className="scrollTrackIndicator">
          {CHAPTERS.map((ch, idx) => (
            <div
              key={ch.id}
              className={`trackStep ${currentChapterIndex === idx ? 'active' : ''}`}
              title={ch.title}
            >
              <span className="stepNum">0{idx + 1}</span>
              <span className="stepLine"></span>
            </div>
          ))}
        </div>

        {/* Scroll Prompt */}
        {scrollProgress < 0.08 && (
          <div className="scrollPrompt">
            <span>SCROLL DOWN TO WITNESS THE FULL JOURNEY</span>
            <ArrowDown size={14} className="bounceArrow" />
          </div>
        )}
      </div>

      {/* 2. SCROLLABLE NARRATIVE TRACK */}
      <div className="scrollNarrativeTrack">
        {CHAPTERS.map((chapter, idx) => {
          const isActive = currentChapterIndex === idx;
          return (
            <section
              key={chapter.id}
              className={`narrativeChapter ${isActive ? 'active' : ''} ${
                idx % 2 === 1 ? 'alignRight' : 'alignLeft'
              }`}
            >
              <div className="chapterCard">
                <div className="chapterStepTag">
                  <span className="dot"></span>
                  <span>{chapter.step}</span>
                </div>

                <span className="chapterBadge">{chapter.badge}</span>
                <h2 className="chapterTitle">{chapter.title}</h2>
                <p className="chapterDesc">{chapter.desc}</p>

                <div className="chapterFooter">
                  <div className="metricCol">
                    <span className="metricVal">{chapter.metric}</span>
                    <span className="metricLbl">{chapter.metricLabel}</span>
                  </div>

                  {idx === CHAPTERS.length - 1 ? (
                    <button className="glow-btn chapterCta" onClick={scrollToOrder}>
                      <Zap size={16} />
                      <span>অর্ডার করুন (৳{settings?.sale_price || '2,150'})</span>
                    </button>
                  ) : (
                    <div className="scrollNextHint">
                      <span>Keep scrolling</span>
                      <ArrowDown size={12} />
                    </div>
                  )}
                </div>

                {/* Colorway & Size Selector in Final Chapter */}
                {idx === CHAPTERS.length - 1 && (
                  <div className="hoodieConfigBlock">
                    <div className="configRow">
                      <span className="configLabel">SELECT COLORWAY:</span>
                      <div className="colorPillsRow">
                        {colorways.map((c) => (
                          <button
                            key={c.id}
                            className={`colorPill ${selectedColorway.id === c.id ? 'active' : ''}`}
                            onClick={() => setSelectedColorway(c)}
                            title={c.name}
                          >
                            <span
                              className="colorDot"
                              style={{ backgroundColor: c.colorHex, borderColor: c.edgeHex }}
                            ></span>
                            <span>{c.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="configRow">
                      <span className="configLabel">SELECT SIZE (DROP SHOULDER):</span>
                      <div className="sizePillsRow">
                        {sizes.map((s) => (
                          <button
                            key={s.size}
                            className={`sizePill ${selectedSize === s.size ? 'active' : ''}`}
                            onClick={() => setSelectedSize(s.size)}
                          >
                            <span>{s.size}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
