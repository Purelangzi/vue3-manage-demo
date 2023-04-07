<template>
  <div class="home_container">
    <div class="home_header">
      <!-- <div class="home_icon" @click="isCollapse=!isCollapse">
        <el-icon v-model="isCollapse" ><icon-menu /></el-icon>
      </div> -->
    </div>
    <div class="home_menu">
      <el-menu active-text-color="#ffd04b" background-color="#545c64" class="el-menu-vertical-demo"
        :default-active="route.path" unique-opened text-color="#fff" :router="true" @open="handleOpen"
        @close="handleClose" :collapse="isCollapse">
        <!-- <el-submenu index="1">
          <template #title>
            <span>{{ route.meta.title }}</span>
          </template>
        </el-submenu> -->

        <el-sub-menu :index="item.id + ''" v-for="item in newMenus" :key="item.id">
          <template #title>
            <span>{{ item.title }}</span>
          </template>
          <div v-for="child in item.children" :key="child.id">
            <el-menu-item v-if="!child.hidden" :index="`${item.name}/${child.name}`">{{ child.title }}</el-menu-item>
          </div>

        </el-sub-menu>

      </el-menu>
    </div>
    <div class="home_content">
      <router-view></router-view>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Menus } from '@/stores/model/userModel'
import { useUserStore } from '@/stores/user'
const isCollapse = ref(false)
const userStore = useUserStore()
const route = useRoute()


const newMenus = computed<Menus[]>(() => userStore.getNewMenus)
const handleOpen = (key: string, keyPath: string[]) => {
  // console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
/* onMounted(()=>{
  defaultActive.value = route.path
  console.log(1);
  
}) */


</script>
<style lang='less' scoped>
.home_container {
  position: relative;
  height: 100%;

  .home_header {
    height: 70px;
  }

  .home_menu {
    position: absolute;
    top: 70px;
    left: 0;
    bottom: 0;
    width: 250px;
  }

  .home_content {
    position: absolute;
    margin-top: 60px;
    padding: 10px 20px;
    top: 70px;
    right: 0;
    left: 250px;
    bottom: 0;
  }
}
</style>
<style></style>