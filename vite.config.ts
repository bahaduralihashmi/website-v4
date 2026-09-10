import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {defineConfig, type Plugin} from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Protect the production UI from legacy/incomplete Firestore product documents.
// This keeps the current database usable while the records are being normalized.
const hbtRuntimeSafety: Plugin = {
  name: 'hbt-runtime-safety',
  transform(code, id) {
    if (!id.endsWith('/src/App.tsx')) return null;

    const safeCode = code
      .replace('brand: p.brand,', 'brand: p.brand || "Unknown Brand",')
      .replace('name: p.name,', 'name: p.name || "Tyre",')
      .replace('size: p.size,', 'size: p.size || "",')
      .replace('feature: p.feature,', 'feature: p.feature || "",')
      .replace('price: p.price,', 'price: Number(p.price) || 0,')
      .replace('description: p.description || `Premium quality tire from ${p.brand}.`', 'description: p.description || `Premium quality tire from ${p.brand || "Unknown Brand"}.`')
      .replace('tire.brand.toLowerCase() === selectedBrand.toLowerCase()', 'String(tire.brand || "").toLowerCase() === selectedBrand.toLowerCase()')
      .replace('logVisitorInfo(currentPage);', 'void 0;');

    return safeCode === code ? null : {code: safeCode, map: null};
  },
};

export default defineConfig(() => {
  return {
    plugins: [hbtRuntimeSafety, react(), tailwindcss()],
    build: {
      // Keep Vercel production builds clean while retaining the existing bundle structure.
      chunkSizeWarningLimit: 1000,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
