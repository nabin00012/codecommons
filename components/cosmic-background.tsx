"use client";

import dynamic from "next/dynamic";

// Create a completely static placeholder for SSR
const StaticPlaceholder = () => null;

// Dynamically import the Three.js component with strict no-SSR
const NoSSRThreeJsBackground = dynamic(() => import("./three-js-background"), {
  ssr: false,
  loading: StaticPlaceholder,
});

// Export a component that only returns the dynamic import
export function CosmicBackground() {
  return <NoSSRThreeJsBackground />;
}
