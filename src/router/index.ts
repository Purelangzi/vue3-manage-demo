import {createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import {useUserStore} from '@/stores/user'
import { ElMessage } from 'element-plus'




const routes:RouteRecordRaw[] = [
  
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/index.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})


let is = false
// 全局前置路由守卫：登录拦截 本地没有存token,请重新登录
router.beforeEach((to,from,next)=>{
  const store = useUserStore()
  if(!store.token){
    if(to.name ==='login'){
      next()
    }else{
      ElMessage.warning('请登录')
      next('/login')
    }
  }else{
    if(to.name === 'login'){
      next(from)
    }
    if(is){
      // 缓存路由，因为动态添加路由后会重新进入路由前置守卫，此时就放行，也解决了刷新页面路由表不生效
      next()
    }else{
      console.log('动态添加路由')
      store.getNewMenus.forEach((el) => {
        const routerMenus: RouteRecordRaw = {
          path: `/${el.name}`,
          name: el.name,
          component: () => import('../layout/index.vue'),
          children: [],
          redirect:''
        }
        el.children?.forEach((item) => {
          if (item.hidden) return
          routerMenus.children.push({
            name: item.name,
            path: item.name,
            component: () => import(`@/views/${el.name}/${item.name}.vue`)
          })
          routerMenus.redirect = `${routerMenus.path}/${routerMenus.children[0].name as string}`
        })
        router.addRoute(routerMenus)
      })
      // 向动态路由添加首页
      router.addRoute({
        path: '/',
        name: 'layout',
        redirect:'/home',
        component: () => import('../layout/index.vue'),
        children:[
         {
          path:'home',
          name:'home',
          component:()=> import('../views/home/index.vue'),
          meta:{title:'首页'}
          }
        ]
      })
      // 向动态路由添加404页面
      router.addRoute({
        path: '/404',
        name: '404',
        component: () => import('@/views/404.vue'),
        meta: {
          title: '路径错误'
        }
      })
      router.addRoute({
        path: "/:pathMath(.*)", // 此处需特别注意置于最底部
        redirect: "/404"
      })
      is=true
      next({...to,replace:true})
    }
    
  }
})


export default router
