"use client"

import Link from "next/link"
import { Code } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t py-8 bg-muted/30">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Code className="h-5 w-5 text-primary" />
          <span className="font-semibold">CodeCommons</span>
        </div>
        <p className="text-sm text-muted-foreground text-center md:text-left">
          © {currentYear} CodeCommons. Created by Nabin Chapagain. All rights reserved.
        </p>
        <div className="flex gap-6">
          <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Terms
          </Link>
          <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Privacy
          </Link>
          <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  )
}
