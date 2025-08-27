import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svgr({
      svgrOptions: {
        exportType: "named",
        ref: true,
        svgo: false,
        titleProp: true,
      },
      include: "**/*.svg",
    }),
    react(),
  ],
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@mui/material',
      '@mui/icons-material',
      '@emotion/react',
      '@emotion/styled',
      '@reduxjs/toolkit',
      'react-redux',
      'react-hook-form',
      'yup',
      'react-toastify'
    ],
    exclude: [
      'reactjs-social-login'
    ]
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          routing: ['react-router-dom'],
          state: ['@reduxjs/toolkit', 'react-redux'],
          forms: ['react-hook-form', 'yup']
        }
      }
    }
  }
});
