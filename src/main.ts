import pinia from './stores'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import echarts from './utils/echarts'
import api from '@/network/apis'
// import './assets/main.css'
import './assets/reset.css'

const app = createApp(App)

//将api接口挂载全局
app.config.globalProperties.$api = api

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(pinia)
app.use(router)

app.mount('#app')

app.provide('$echarts',echarts)