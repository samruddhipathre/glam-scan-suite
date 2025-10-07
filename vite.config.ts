import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

let lovableTagger = null;
try {
  // Try importing lovable-tagger only if it exists (for Lovable)
  lovableTagger = require("lovable-tagger").componentTagger;
} catch {
  // Skip if not available (for GitHub)
  lovableTagger = () => null;
}

export default defineConfig(({ mode }) => {
  // Detect if running on GitHub Pages
  const isGitHub = process.env.GITHUB_ACTIONS === "true";

  return {
    base: isGitHub ? "/Aavatar/" : "/", // 👈 change "Aavatar" if repo name differs
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      // Only enable the tagger in development if it exists
      mode === "development" && lovableTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
