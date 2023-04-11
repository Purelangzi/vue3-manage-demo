<template>
  <div class="layout_menu" :style="isCollapse ? 'width:56px;' : ''">
    <el-menu active-text-color="#ffd04b" background-color="#545c64" :collapse-transition="false"
      :default-active="route.path" unique-opened text-color="#fff" :router="true" :collapse="isCollapse">
      <el-menu-item index="/home">
        <el-icon>
          <Grid />
        </el-icon>
        <template #title>
          <span>首页</span>
        </template>
      </el-menu-item>
      <el-sub-menu :index="item.id + ''" v-for="item in newMenus" :key="item.id">
        <template #title>
          <el-icon>
            <Grid />
          </el-icon>
          <span>{{ item.title }}</span>
        </template>
        <template v-for="child in item.children" :key="child.id">
          <el-menu-item v-if="!child.hidden" :index="`/${item.name}/${child.name}`">{{ child.title }}</el-menu-item>
        </template>
      </el-sub-menu>
    </el-menu>
  </div>
</template>
<script setup lang="ts">
import type { Menus } from '@/stores/model/userModel'
interface SideBarProps {
  isCollapse:boolean,
  newMenus:Menus[]
}
const route = useRoute()
defineProps<SideBarProps>()

</script>
<style lang='less' scoped>
.layout_menu {
  position: absolute;
  top: 0px;
  left: 0;
  bottom: 0;
  width: 210px;
  overflow-y:auto;
  background-color: #545c64;
  transition: width .28s;
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
