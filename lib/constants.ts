export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://codecommons-backend.vercel.app";

// Ensure API_URL is always defined
if (!API_URL) {
  console.error(
    "API_URL is not defined. Please set NEXT_PUBLIC_API_URL environment variable."
  );
}
