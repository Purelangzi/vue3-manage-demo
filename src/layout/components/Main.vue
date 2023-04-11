<template>
    <div class="layout_content" :style="isCollapse ? 'left:56px;' : ''">
        <NavBar/>
        <div class="content-view">
            <router-view></router-view>
        </div>
    </div>
</template>
<script setup lang="ts">
import NavBar from './NavBar.vue';
interface TopBarProps {
    isCollapse: boolean
}
const route = useRoute()
defineProps<TopBarProps>()
defineEmits<{
    (e: 'update:changeCollapse', val: boolean): void
}>()

</script>
<style lang='less' scoped>
.layout_content {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 210px;
    transition: left .28s;
    overflow-y: auto;

    

    .content-view {
        padding: 15px;
    }
}</style>
