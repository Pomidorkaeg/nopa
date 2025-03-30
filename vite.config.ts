import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: "dist",
    // Генерируем ресурсы с постоянными именами (без хешей) для простоты ссылок
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
        // Улучшаем производительность с помощью разделения кода
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-toast', '@radix-ui/react-tooltip', 'lucide-react'],
          'query': ['@tanstack/react-query'],
        }
      }
    },
    // Оптимизируем сборку для быстрой загрузки
    minify: true,
    cssMinify: true,
    target: 'es2015',  // Целевые современные браузеры для уменьшения размера бандла
    // Разделяем код на чанки для оптимизации загрузки
    chunkSizeWarningLimit: 500,
    sourcemap: true,
    reportCompressedSize: false,
    emptyOutDir: true
  },
  plugins: [
    react({
      babel: {
        plugins: [
          ['@babel/plugin-transform-runtime', {
            regenerator: true
          }]
        ]
      }
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // For GitHub Pages, use "./" (relative paths)
  base: '/',
  // Добавляем оптимизации для более быстрой разработки
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['@babel/runtime'],
    esbuildOptions: {
      target: 'es2020',
    }
  },
  esbuild: {
    logLevel: 'info',
    sourcemap: true,
    target: 'es2020',
    supported: {
      'top-level-await': true
    }
  }
}));
