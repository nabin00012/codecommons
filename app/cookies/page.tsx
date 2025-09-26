import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Cookie Policy</h1>
        <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="prose dark:prose-invert max-w-none">
        <h2>1. What Are Cookies</h2>
        <p>
          Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience.
        </p>

        <h2>2. How We Use Cookies</h2>
        <p>We use cookies for:</p>
        <ul>
          <li>Authentication - to keep you logged in</li>
          <li>Preferences - to remember your theme and settings</li>
          <li>Analytics - to understand how our platform is used</li>
          <li>Security - to protect against malicious activity</li>
        </ul>

        <h2>3. Types of Cookies We Use</h2>
        <ul>
          <li><strong>Essential Cookies:</strong> Required for the platform to function</li>
          <li><strong>Functional Cookies:</strong> Remember your preferences</li>
          <li><strong>Analytics Cookies:</strong> Help us improve our services</li>
        </ul>

        <h2>4. Managing Cookies</h2>
        <p>
          You can control cookies through your browser settings. However, disabling cookies may affect the functionality of our platform.
        </p>

        <h2>5. Third-Party Cookies</h2>
        <p>
          We may use third-party services that set their own cookies. These are governed by their respective privacy policies.
        </p>
      </div>

      <div className="mt-8">
        <Button asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
