<template>
    <div class="layout_header">
        <el-card shadow="always" :body-style="{ padding: '20px' }">
            <div class="home-breadcrumb">
                <div class="left">
                    <el-icon size="26" @click="nav?.update()">
                        <Menu />
                    </el-icon>
                    <el-breadcrumb separator="/" style="margin-left: 20px;">
                        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                        <el-breadcrumb-item v-if="route.path !== '/home'" :to="{ path: '/' + route.path.split('/')[1] }">{{
                            route.matched[0].meta.title }}</el-breadcrumb-item>
                        <el-breadcrumb-item v-if="route.path !== '/home'">{{ route.matched[1].meta.title }}</el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
                <div class="right">
                    <el-dropdown >
                        <span class="el-dropdown-link">
                            admin
                        <el-icon class="el-icon--right">
                            <arrow-down />
                        </el-icon>
                        </span>
                        <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="router.push('/')">首页</el-dropdown-item>
                            <el-dropdown-item @click="logOut">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </div>
            
        </el-card>
    </div>
</template>
<script setup lang="ts">
import {isCollapseKey} from '../ts/bar'
import {useUserStore} from '@/stores/user'

const route = useRoute()
const router = useRouter()
const nav =inject(isCollapseKey)

const userStore = useUserStore()
const logOut = () =>{
    userStore.resetTokenMenus()
    userStore.$reset()
    ElNotification.success({message:'退出成功',showClose:false,duration:2000})
    router.push('/login')
}
</script>
<style lang='less' scoped>
.layout_header {
    height: 70px;
    background-color: #fff;
    margin-bottom: 15px;

    .home-breadcrumb {
        overflow:hidden;
        .left{
            float: left;
            display: flex;
            align-items: center;
        }
        .right{
            float: right;
        }
       
    }
}
</style>
