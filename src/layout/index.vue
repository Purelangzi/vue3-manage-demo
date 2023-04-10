<template>
  <div class="home_container">
    <div class="home_menu" :style="isCollapse?'width:56px;':''">
      <el-menu active-text-color="#ffd04b" background-color="#545c64" class="el-menu-vertical-demo" :collapse-transition="false"
        :default-active="route.path" unique-opened text-color="#fff" :router="true" :collapse="isCollapse">
        <el-menu-item index="/home">
          <el-icon><Grid /></el-icon>
          <template #title>
            <span>首页</span>
          </template>
        </el-menu-item>
        <el-sub-menu :index="item.id + ''" v-for="item in newMenus" :key="item.id">
          <template #title>
            <el-icon><Grid /></el-icon>
            <span>{{ item.title }}</span>
          </template>
          <template v-for="child in item.children" :key="child.id">
            <el-menu-item v-if="!child.hidden" :index="`/${item.name}/${child.name}`">{{ child.title }}</el-menu-item>
          </template>

        </el-sub-menu>

      </el-menu>
    </div>
    <div class="home_content" :style="isCollapse?'left:70px;':''">
      <div class="home_header">
        <el-card shadow="always" :body-style="{ padding: '20px' }">
          <div class="home-breadcrumb">
            <el-icon size="26" @click="isCollapse=!isCollapse"><Menu /></el-icon>
            <el-breadcrumb separator="/" style="margin-left: 20px;">
              <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item v-if="route.path!=='/home'" :to="{path:'/'+route.path.split('/')[1]}">{{route.path.split('/')[1]}}</el-breadcrumb-item>
              <el-breadcrumb-item v-if="route.path!=='/home'">{{route.name}}</el-breadcrumb-item>

            </el-breadcrumb>
          </div>
            
        </el-card>
      </div>
      <div class="content-view">
        <router-view></router-view>
      </div>
      
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

</script>
<style lang='less' scoped>
.home_container {
  position: relative;
  height: 100%;
  width: 100%;

  .home_header {
    height: 70px;
    background-color: #fff;
    margin-bottom: 15px;
    .home-breadcrumb{
      display: flex;
      align-items: center;
    }
  }

  .home_menu {
    position: absolute;
    top: 0px;
    left: 0;
    bottom: 0;
    width: 250px;
    overflow-y:auto;
    background-color: #545c64;
    &::-webkit-scrollbar {
      display: none;
    }
  }
 
  .home_content {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 250px;
    transition:all .2s ease-in-out;
    overflow-y:auto;
    .content-view{
      padding-left: 10px;
    }
  }
}
</style>
<style></style>