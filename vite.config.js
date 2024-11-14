const Path = require("path");
const vuePlugin = require("@vitejs/plugin-vue");
const { defineConfig } = require("vite");

/**
 * https://vitejs.dev/config
 */
const config = defineConfig({
  root: Path.join(__dirname, "src", "renderer"),
  publicDir: "public",
  server: {
    port: 8080,
  },
  open: false,
  build: {
    outDir: Path.join(__dirname, "build", "renderer"),
    emptyOutDir: true,
    rollupOptions: {
      external: ["electron"],
    },
  },
  resolve: {
    alias: {
      "path": "path-browserify",
      "fs": "browserify-fs",
      '@components': Path.resolve(__dirname, 'src/renderer/components'),
      '@pages': Path.resolve(__dirname, 'src/renderer/pages'),
      '@layouts': Path.resolve(__dirname, 'src/renderer/layouts'),
      '@assets': Path.resolve(__dirname, 'src/renderer/assets'),

    },
  },
  plugins: [vuePlugin()],
});

module.exports = config;
