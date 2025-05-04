"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import * as THREE from "three";

// This component will ONLY be rendered on the client
export default function ThreeJsBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const animationRef = useRef<number | null>(null);
  const [threeLoaded, setThreeLoaded] = useState(false);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const starsRef = useRef<THREE.Points | null>(null);

  // Create the container DIV through useEffect to ensure client-only rendering
  useEffect(() => {
    let mounted = true;
    setThreeLoaded(true);

    return () => {
      mounted = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (containerRef.current?.firstChild) {
        containerRef.current.innerHTML = "";
      }
    };
  }, []);

  // Initialize the scene once THREE is loaded
  useEffect(() => {
    if (!threeLoaded || !containerRef.current) return;

    const isDarkMode = resolvedTheme === "dark";
    const isCosmicMode = resolvedTheme === "cosmic";

    if (!isDarkMode && !isCosmicMode) return;

    try {
      // Create scene
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      // Create camera
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 30;
      cameraRef.current = camera;

      // Create renderer
      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setClearColor(0x000000, 0);
      rendererRef.current = renderer;

      containerRef.current.appendChild(renderer.domElement);

      // Only create stars in cosmic mode
      if (isCosmicMode) {
        const starGeometry = new THREE.BufferGeometry();
        const starMaterial = new THREE.PointsMaterial({
          color: 0xffffff,
          size: 0.1,
          transparent: true,
          opacity: 0.8,
        });

        const starVertices: number[] = [];
        for (let i = 0; i < 10000; i++) {
          const x = (Math.random() - 0.5) * 2000;
          const y = (Math.random() - 0.5) * 2000;
          const z = (Math.random() - 0.5) * 2000;
          starVertices.push(x, y, z);
        }

        starGeometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(starVertices, 3)
        );

        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);
        starsRef.current = stars;
      }

      // Animation loop
      const animate = () => {
        animationRef.current = requestAnimationFrame(animate);

        if (isCosmicMode && starsRef.current) {
          starsRef.current.rotation.x += 0.0001;
          starsRef.current.rotation.y += 0.0001;
        }

        renderer.render(scene, camera);
      };

      animate();

      // Handle window resize
      const handleResize = () => {
        if (camera && renderer) {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        }
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }

        if (containerRef.current?.contains(renderer.domElement)) {
          containerRef.current.removeChild(renderer.domElement);
        }

        // Clean up Three.js objects
        if (starsRef.current) {
          scene.remove(starsRef.current);
          starsRef.current.geometry.dispose();
          (starsRef.current.material as THREE.PointsMaterial).dispose();
        }
        sceneRef.current = null;
        cameraRef.current = null;
        rendererRef.current = null;
      };
    } catch (error) {
      console.error("Error in Three.js setup:", error);
    }
  }, [threeLoaded, resolvedTheme]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[-1] pointer-events-none"
      aria-hidden="true"
    />
  );
}
