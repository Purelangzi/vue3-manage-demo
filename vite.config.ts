import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),
    AutoImport({
      resolvers:[ElementPlusResolver()],
      imports:["vue","vue-router"],//自动引入vue的ref、toRefs、onmounted等，无需在页面中再次引入
      dts:'src/auto-import.d.ts'    // 路径下自动生成文件夹存放全局指令
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  /* server:{
    // 本地开发环境通过代理实现跨域
    proxy:{
      '/api':{
        target:'http://120.24.64.5:8088/mall-admin/',
        changeOrigin: true, //开启代理
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  } */
})
