import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="prose dark:prose-invert max-w-none">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using CodeCommons, you accept and agree to be bound by the terms and provision of this agreement.
        </p>

        <h2>2. Educational Use</h2>
        <p>
          CodeCommons is designed for educational purposes. Users must use the platform responsibly and in accordance with their institution's policies.
        </p>

        <h2>3. User Accounts</h2>
        <p>
          Users are responsible for maintaining the security of their accounts and for all activities that occur under their accounts.
        </p>

        <h2>4. Content Guidelines</h2>
        <p>
          Users must not post content that is offensive, illegal, or violates others' rights. All code and content shared should be appropriate for an educational environment.
        </p>

        <h2>5. Privacy</h2>
        <p>
          Your privacy is important to us. Please review our Privacy Policy to understand how we collect and use your information.
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
