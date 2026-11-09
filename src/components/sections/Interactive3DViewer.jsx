'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useProduct } from '@/context/ProductContext';
import { soundManager } from '@/lib/audio';
import {
  RotateCcw,
  Layers,
  Thermometer,
  Grid,
  Maximize2,
  Sparkles,
  Cpu,
  Shield,
  Zap,
} from 'lucide-react';

export default function Interactive3DViewer() {
  const containerRef = useRef(null);
  const {
    selectedFinish,
    viewMode,
    setViewMode,
    thermalScanPos,
    finishes,
    setSelectedFinish,
  } = useProduct();

  const [fps, setFps] = useState(60);
  const [isDragging, setIsDragging] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState(null);

  // References to 3D objects for dynamic animation
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const productGroupRef = useRef(null);
  const topPlateRef = useRef(null);
  const coreMatrixRef = useRef(null);
  const bottomBaseRef = useRef(null);
  const ledRingRef = useRef(null);
  const particleSystemRef = useRef(null);
  const targetRotationRef = useRef({ x: 0.45, y: -0.6 });
  const currentRotationRef = useRef({ x: 0.45, y: -0.6 });
  const pointerPosRef = useRef({ x: 0, y: 0 });
  const isPointerDownRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. SCENE SETUP
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 3.5, 7.5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 2. LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(6, 10, 8);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimCyanLight = new THREE.DirectionalLight(0x00f5c4, 3.0);
    rimCyanLight.position.set(-8, -4, -6);
    scene.add(rimCyanLight);

    const accentLight = new THREE.PointLight(0x5effdb, 2, 20);
    accentLight.position.set(0, 4, 2);
    scene.add(accentLight);

    // 3. PRODUCT GEOMETRY (Oryzo Autonomous Neural Disc)
    const productGroup = new THREE.Group();
    productGroupRef.current = productGroup;
    scene.add(productGroup);

    // Bottom Aerospace Base
    const baseGeo = new THREE.CylinderGeometry(2.8, 2.6, 0.25, 64);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x111318,
      metalness: 0.9,
      roughness: 0.25,
    });
    const bottomBase = new THREE.Mesh(baseGeo, baseMat);
    bottomBase.position.y = -0.15;
    bottomBase.castShadow = true;
    bottomBase.receiveShadow = true;
    productGroup.add(bottomBase);
    bottomBaseRef.current = bottomBase;

    // Middle NPU / Circuit Core Matrix
    const coreGeo = new THREE.CylinderGeometry(2.6, 2.6, 0.18, 64);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x050608,
      metalness: 0.95,
      roughness: 0.15,
      wireframe: false,
    });
    const coreMatrix = new THREE.Mesh(coreGeo, coreMat);
    coreMatrix.position.y = 0;
    productGroup.add(coreMatrix);
    coreMatrixRef.current = coreMatrix;

    // Concentric circuit traces on core
    for (let r = 0.8; r <= 2.3; r += 0.35) {
      const ringGeo = new THREE.TorusGeometry(r, 0.015, 16, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x00f5c4,
        transparent: true,
        opacity: 0.65,
      });
      const traceRing = new THREE.Mesh(ringGeo, ringMat);
      traceRing.rotation.x = Math.PI / 2;
      traceRing.position.y = 0.095;
      coreMatrix.add(traceRing);
    }

    // Top Acoustic Surface Plate
    const topGeo = new THREE.CylinderGeometry(2.85, 2.8, 0.2, 64);
    const topMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(selectedFinish.colorHex),
      metalness: selectedFinish.metalness,
      roughness: selectedFinish.roughness,
    });
    const topPlate = new THREE.Mesh(topGeo, topMat);
    topPlate.position.y = 0.18;
    topPlate.castShadow = true;
    productGroup.add(topPlate);
    topPlateRef.current = topPlate;

    // Center Hologram Pulsing Core on Top Plate
    const centerGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.05, 32);
    const centerMat = new THREE.MeshStandardMaterial({
      color: 0x05070a,
      emissive: 0x00f5c4,
      emissiveIntensity: 0.6,
      metalness: 0.8,
      roughness: 0.2,
    });
    const centerRing = new THREE.Mesh(centerGeo, centerMat);
    centerRing.position.y = 0.12;
    topPlate.add(centerRing);

    // Micro LED Circumference Ring
    const ledCount = 24;
    const ledGroup = new THREE.Group();
    for (let i = 0; i < ledCount; i++) {
      const angle = (i / ledCount) * Math.PI * 2;
      const ledGeo = new THREE.SphereGeometry(0.035, 12, 12);
      const ledMat = new THREE.MeshBasicMaterial({ color: 0x00f5c4 });
      const led = new THREE.Mesh(ledGeo, ledMat);
      led.position.set(Math.cos(angle) * 2.7, 0.11, Math.sin(angle) * 2.7);
      ledGroup.add(led);
    }
    topPlate.add(ledGroup);
    ledRingRef.current = ledGroup;

    // 4. FLOATING QUANTUM PARTICLES BACKGROUND
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 16;
      positions[i + 1] = (Math.random() - 0.5) * 12;
      positions[i + 2] = (Math.random() - 0.5) * 12;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x00f5c4,
      transparent: true,
      opacity: 0.45,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);
    particleSystemRef.current = particleSystem;

    // 5. MOUSE & TOUCH CONTROLS
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onPointerDown = (e) => {
      isPointerDownRef.current = true;
      setIsDragging(true);
      prevMouseX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      prevMouseY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      soundManager.playClick(440, 0.03);
    };

    const onPointerMove = (e) => {
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

      if (isPointerDownRef.current) {
        const deltaX = clientX - prevMouseX;
        const deltaY = clientY - prevMouseY;
        targetRotationRef.current.y += deltaX * 0.009;
        targetRotationRef.current.x += deltaY * 0.009;
        targetRotationRef.current.x = Math.max(
          -Math.PI / 3,
          Math.min(Math.PI / 3, targetRotationRef.current.x)
        );
      } else {
        // Parallax hover tilt
        const rect = container.getBoundingClientRect();
        const normX = (clientX - rect.left) / rect.width - 0.5;
        const normY = (clientY - rect.top) / rect.height - 0.5;
        pointerPosRef.current = { x: normX, y: normY };
      }

      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerUp = () => {
      isPointerDownRef.current = false;
      setIsDragging(false);
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    domEl.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // 6. ANIMATION LOOP
    let animationId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Idle auto-rotation when not dragging
      if (!isPointerDownRef.current) {
        targetRotationRef.current.y += 0.003;
      }

      // Smooth interpolation (damping)
      currentRotationRef.current.x +=
        (targetRotationRef.current.x + pointerPosRef.current.y * 0.35 - currentRotationRef.current.x) *
        0.06;
      currentRotationRef.current.y +=
        (targetRotationRef.current.y + pointerPosRef.current.x * 0.45 - currentRotationRef.current.y) *
        0.06;

      if (productGroupRef.current) {
        productGroupRef.current.rotation.x = currentRotationRef.current.x;
        productGroupRef.current.rotation.y = currentRotationRef.current.y;
        // Subtle levitation
        productGroupRef.current.position.y = Math.sin(elapsedTime * 1.5) * 0.08;
      }

      // LED Pulse animation
      if (ledRingRef.current) {
        ledRingRef.current.children.forEach((led, idx) => {
          const pulse = Math.sin(elapsedTime * 4 + idx * 0.3) * 0.5 + 0.5;
          led.scale.setScalar(0.8 + pulse * 0.5);
        });
      }

      // Particles slow drift
      if (particleSystemRef.current) {
        particleSystemRef.current.rotation.y = elapsedTime * 0.03;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      domEl.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      domEl.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update materials & positions when viewMode or finish changes
  useEffect(() => {
    if (!topPlateRef.current || !coreMatrixRef.current || !bottomBaseRef.current) return;

    const topMesh = topPlateRef.current;
    const coreMesh = coreMatrixRef.current;
    const baseMesh = bottomBaseRef.current;

    // Apply finishes
    if (viewMode === 'studio') {
      topMesh.material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(selectedFinish.colorHex),
        metalness: selectedFinish.metalness,
        roughness: selectedFinish.roughness,
        wireframe: false,
      });
      coreMesh.material.wireframe = false;
      baseMesh.material.wireframe = false;

      // Animate back together
      topMesh.position.y = 0.18;
      coreMesh.position.y = 0;
      baseMesh.position.y = -0.15;
    } else if (viewMode === 'exploded') {
      topMesh.material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(selectedFinish.colorHex),
        metalness: selectedFinish.metalness,
        roughness: selectedFinish.roughness,
        wireframe: false,
      });
      // Lift top, lower bottom, expose core
      topMesh.position.y = 1.1;
      coreMesh.position.y = 0.05;
      baseMesh.position.y = -0.95;
    } else if (viewMode === 'thermal') {
      // Infrared Thermal False Color
      topMesh.material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0xff2a5f),
        emissive: new THREE.Color(0xff6b00),
        emissiveIntensity: 0.65,
        roughness: 0.1,
        metalness: 0.5,
        wireframe: false,
      });
      coreMesh.material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0x00f5c4),
        emissive: new THREE.Color(0x00b894),
        emissiveIntensity: 0.8,
      });
      topMesh.position.y = 0.18;
      coreMesh.position.y = 0;
      baseMesh.position.y = -0.15;
    } else if (viewMode === 'wireframe') {
      topMesh.material = new THREE.MeshBasicMaterial({
        color: 0x00f5c4,
        wireframe: true,
      });
      coreMesh.material = new THREE.MeshBasicMaterial({
        color: 0x5effdb,
        wireframe: true,
      });
      baseMesh.material = new THREE.MeshBasicMaterial({
        color: 0x94a3b8,
        wireframe: true,
      });
      topMesh.position.y = 0.18;
      coreMesh.position.y = 0;
      baseMesh.position.y = -0.15;
    }
  }, [selectedFinish, viewMode]);

  const resetCamera = () => {
    targetRotationRef.current = { x: 0.45, y: -0.6 };
    soundManager.playClick(580, 0.04);
  };

  return (
    <section className="interactive3DSection" id="3d-experience">
      <div className="container">
        {/* Section Header */}
        <div className="sectionHeaderCenter">
          <div className="section-badge">
            <span className="badge-pulse"></span>
            REAL-TIME WEBGL RENDERING // THREE.JS
          </div>
          <h2 className="title">
            Zero-Latency <span className="text-gradient">Hardware Architecture</span>
          </h2>
          <p className="subtitle">
            Interact with the Oryzo Autonomous Surface. Rotate 360°, inspect the internal
            multi-layer cognitive engine, toggle thermal imaging, or cycle through aerospace finishes.
          </p>
        </div>

        {/* 3D Viewport Box */}
        <div className="canvasWrapper">
          <div className="canvasContainer" ref={containerRef}>
            {/* Live Telemetry Overlay in 3D View */}
            <div className="telemetryOverlay top-left">
              <div className="dataRow">
                <span className="label">SYSTEM:</span>
                <span className="value cyan">ORYZO-OS v4.2</span>
              </div>
              <div className="dataRow">
                <span className="label">NEURAL LATENCY:</span>
                <span className="value">0.12 ms</span>
              </div>
              <div className="dataRow">
                <span className="label">TEMPERATURE:</span>
                <span className="value amber">21.8 °C</span>
              </div>
            </div>

            <div className="telemetryOverlay top-right">
              <div className="dataRow">
                <span className="label">MODE:</span>
                <span className="value cyan">{viewMode.toUpperCase()}</span>
              </div>
              <div className="dataRow">
                <span className="label">SURFACE:</span>
                <span className="value">{selectedFinish.name}</span>
              </div>
              <div className="dataRow">
                <span className="label">FPS:</span>
                <span className="value green">60.0</span>
              </div>
            </div>

            {/* Interactive Drag Hint */}
            <div className={`dragHint ${isDragging ? 'hidden' : ''}`}>
              <RotateCcw size={16} />
              <span>DRAG TO ROTATE 360° // SCROLL TO ZOOM</span>
            </div>

            {/* Exploded Mode Hotspot Annotation Tags */}
            {viewMode === 'exploded' && (
              <div className="explodedAnnotations">
                <div className="hotspotTag topPlate">
                  <div className="dot"></div>
                  <div className="labelCard">
                    <strong>Acoustic Bio-Membrane</strong>
                    <p>Sub-millisecond capacitive sensing</p>
                  </div>
                </div>
                <div className="hotspotTag coreMatrix">
                  <div className="dot"></div>
                  <div className="labelCard">
                    <strong>Quantum Core NPU Matrix</strong>
                    <p>128-core autonomous inference engine</p>
                  </div>
                </div>
                <div className="hotspotTag basePlate">
                  <div className="dot"></div>
                  <div className="labelCard">
                    <strong>Aerospace Titanium Base</strong>
                    <p>Magnetic inductive charging & ground</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Controls Bar Below 3D Canvas */}
          <div className="canvasControlsBar">
            {/* View Mode Switcher */}
            <div className="modeSwitchGroup">
              <button
                className={`modeBtn ${viewMode === 'studio' ? 'active' : ''}`}
                onClick={() => setViewMode('studio')}
                title="Studio View"
              >
                <Sparkles size={16} />
                <span>Studio</span>
              </button>
              <button
                className={`modeBtn ${viewMode === 'exploded' ? 'active' : ''}`}
                onClick={() => setViewMode('exploded')}
                title="Exploded Internals"
              >
                <Layers size={16} />
                <span>Exploded View</span>
              </button>
              <button
                className={`modeBtn ${viewMode === 'thermal' ? 'active' : ''}`}
                onClick={() => setViewMode('thermal')}
                title="Thermal Diagnostic"
              >
                <Thermometer size={16} />
                <span>Thermal Vision</span>
              </button>
              <button
                className={`modeBtn ${viewMode === 'wireframe' ? 'active' : ''}`}
                onClick={() => setViewMode('wireframe')}
                title="CAD Wireframe"
              >
                <Grid size={16} />
                <span>CAD Wireframe</span>
              </button>
            </div>

            {/* Finish Switcher */}
            <div className="finishPillsGroup">
              <span className="finishLabel">FINISH:</span>
              {finishes.map((f) => (
                <button
                  key={f.id}
                  className={`finishPill ${selectedFinish.id === f.id ? 'active' : ''}`}
                  onClick={() => setSelectedFinish(f)}
                  title={`${f.name} - ${f.subtitle}`}
                >
                  <span
                    className="colorCircle"
                    style={{ backgroundColor: f.colorHex, borderColor: f.edgeHex }}
                  ></span>
                  <span className="finishName">{f.name}</span>
                </button>
              ))}
            </div>

            {/* Reset View Button */}
            <button className="resetBtn" onClick={resetCamera} title="Reset 3D Angle">
              <RotateCcw size={16} />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

