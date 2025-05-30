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
    console.log("ThreeJsBackground - Component mounted");
    setThreeLoaded(true);

    return () => {
      console.log("ThreeJsBackground - Component unmounting");
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
    if (!threeLoaded || !containerRef.current) {
      console.log("ThreeJsBackground - Not ready:", {
        threeLoaded,
        container: !!containerRef.current,
      });
      return;
    }

    console.log("ThreeJsBackground - Theme changed:", resolvedTheme);
    const isCosmicMode = resolvedTheme === "cosmic";

    // Clean up previous scene if it exists
    if (sceneRef.current) {
      console.log("ThreeJsBackground - Cleaning up previous scene");
      if (starsRef.current) {
        sceneRef.current.remove(starsRef.current);
        starsRef.current.geometry.dispose();
        (starsRef.current.material as THREE.PointsMaterial).dispose();
      }
      if (rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    }

    if (!isCosmicMode) {
      console.log(
        "ThreeJsBackground - Not in cosmic mode, skipping scene creation"
      );
      return;
    }

    try {
      console.log("ThreeJsBackground - Creating new scene");
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
      camera.position.z = 15;
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

      // Create stars
      const starGeometry = new THREE.BufferGeometry();
      const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 1.0,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true,
      });

      const starVertices: number[] = [];
      const starCount = 10000;
      for (let i = 0; i < starCount; i++) {
        const x = (Math.random() - 0.5) * 1000;
        const y = (Math.random() - 0.5) * 1000;
        const z = (Math.random() - 0.5) * 1000;
        starVertices.push(x, y, z);
      }

      starGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(starVertices, 3)
      );

      const stars = new THREE.Points(starGeometry, starMaterial);
      scene.add(stars);
      starsRef.current = stars;

      console.log("ThreeJsBackground - Scene setup complete");

      // Animation loop
      const animate = () => {
        animationRef.current = requestAnimationFrame(animate);

        if (starsRef.current) {
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
        console.log("ThreeJsBackground - Cleaning up scene");
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
