"use client";

import { useEffect } from "react";

export function useCosmicCardEffect() {
  useEffect(() => {
    const cards = document.querySelectorAll(".cosmic-card");

    const handleMouseMove = (e: Event) => {
      const mouseEvent = e as MouseEvent;
      const card = e.currentTarget as HTMLElement;
      const rect = card.getBoundingClientRect();
      const x = ((mouseEvent.clientX - rect.left) / rect.width) * 100;
      const y = ((mouseEvent.clientY - rect.top) / rect.height) * 100;

      card.style.setProperty("--x", `${x}%`);
      card.style.setProperty("--y", `${y}%`);
    };

    const handleMouseLeave = (e: Event) => {
      const card = e.currentTarget as HTMLElement;
      card.style.setProperty("--x", "50%");
      card.style.setProperty("--y", "50%");
    };

    cards.forEach((card) => {
      card.addEventListener("mousemove", handleMouseMove);
      card.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      cards.forEach((card) => {
        card.removeEventListener("mousemove", handleMouseMove);
        card.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);
}

export function CosmicCardEffect() {
  useCosmicCardEffect();
  return null;
}
