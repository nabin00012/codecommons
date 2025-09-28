// Re-export everything from the auth.config.ts file which has the proper NextAuth setup
export { authConfig } from "./auth.config";
export { default as auth, signIn, signOut } from "./auth.config";

// Re-export types for compatibility
export type { UserRole } from "./auth.config";
