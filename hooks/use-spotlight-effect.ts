"use client"

import { useEffect } from "react"

export function useSpotlightEffect() {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const cards = document.querySelectorAll(".project-card")

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const isHovering =
          e.clientX > rect.left && e.clientX < rect.right && e.clientY > rect.top && e.clientY < rect.bottom

        const spotlight = card.querySelector(".spotlight-effect") as HTMLElement

        if (spotlight) {
          if (isHovering) {
            spotlight.style.opacity = "1"
            spotlight.style.setProperty("--x", `${x}px`)
            spotlight.style.setProperty("--y", `${y}px`)
          } else {
            spotlight.style.opacity = "0"
          }
        }
      })
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])
}
