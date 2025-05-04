"use client"

import { useEffect } from "react"

export function useCosmiCardEffect() {
  useEffect(() => {
    const cards = document.querySelectorAll(".cosmic-card")

    const handleMouseMove = (e: MouseEvent) => {
      const card = e.currentTarget as HTMLElement
      const rect = card.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100

      card.style.setProperty("--x", `${x}%`)
      card.style.setProperty("--y", `${y}%`)
    }

    cards.forEach((card) => {
      card.addEventListener("mousemove", handleMouseMove)
    })

    return () => {
      cards.forEach((card) => {
        card.removeEventListener("mousemove", handleMouseMove)
      })
    }
  }, [])
}

export function CosmicCardEffect() {
  useCosmiCardEffect()
  return null
}
