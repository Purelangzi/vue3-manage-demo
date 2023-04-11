<template>
  <div class="layout_container">
    <SideBar :isCollapse="isCollapse" :newMenus="newMenus" />
    <Main :isCollapse="isCollapse" v-model:change-collapse="isCollapse"/>
  </div>
</template>
<script setup lang="ts">

import { useUserStore } from '@/stores/user'
import SideBar from './components/SideBar.vue'
import Main from './components/Main.vue'
import {isCollapseKey} from './ts/bar'

const isCollapse = ref(false)
const userStore = useUserStore()
const route = useRoute()


const newMenus = computed(() => {
  // 面包屑处理对应的title
  userStore.getNewMenus.forEach(el=>{
    if(route.matched[0].name === el.name){
      route.matched[0].meta.title = el.title
    }
    el.children?.forEach(item => {
      if(route.matched[1].name === item.name){
        route.matched[1].meta.title = item.title
      }
    });
  })
  return userStore.getNewMenus
})
const update =() =>{
  isCollapse.value = !isCollapse.value
}

provide(isCollapseKey,{update})


</script>
<style lang='less' scoped>
.layout_container {
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
<style></style>