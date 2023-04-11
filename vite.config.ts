import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { viteMockServe } from "vite-plugin-mock";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),
    AutoImport({
      resolvers:[ElementPlusResolver()],
      imports:["vue","vue-router","pinia"],//自动引入vue、vuer-router和pinia的方法属性等，无需在页面中再次引入
      dts:'src/types/auto-import.d.ts'    // 路径下自动生成文件夹存放全局指令
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts:'src/types/components.d.ts' 
    }),
    //启动mock服务
    viteMockServe({
      supportTs: false,
      logger: false,
      mockPath: "./mocks/" //指向mock下的文件
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
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
