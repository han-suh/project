import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:4775', // 백엔드 포트
    //     changeOrigin: true,
    //     secure: false
    //   }
    // }
  },
  build:{
    emptyOutDir:true,
    outDir: 'C:\\Users\\tjoeun\\project\\src\\main\\resources\\static',
  }
})