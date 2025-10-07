import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

let lovableTagger = null;
try {
  // Try to import lovable-tagger (exists in Lovable environment)
  lovableTagger = require("lovable-tagger").componentTagger;
} catch {
  // Skip if running outside Lovable (like GitHub Pages)
  lovableTagger = () => null;
}

export default defineConfig(({ mode }) => {
  // Detect if running inside GitHub Actions (Pages)
  const isGitHub = process.env.GITHUB_ACTIONS === "true";

  return {
    base: isGitHub ? "/glam-scan-suite/" : "/", // 👈 important for GitHub Pages
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      mode === "development" && lovableTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});

