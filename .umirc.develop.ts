import { defineConfig } from "umi";

export default defineConfig({
  define: {
    'process.env': {
        BASE_URL: '/api',
    },
  }
});
