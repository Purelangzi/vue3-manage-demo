<template>
  <div class="user table-search">
    <el-card shadow="always" :body-style="{ padding: '18px'}">
      <div class="card-body">
        <span><el-icon><Search /></el-icon>&nbsp;筛选搜索</span>
        <div class="title-btn">
          <el-button :type="isSearch?'success':''" size="default" @click="resetSearchOrReturn">{{isSearch?'返回':'重置'}}</el-button>
          <el-button type="primary" size="default" @click="handleSearch">查询搜索</el-button>
        </div>
      </div>
      <div class="searchInput">
        <span>账号/姓名：</span>
        <el-input v-model="state.queryInfo.keyword" placeholder="请输入账号或姓名" style="width: 140px;"></el-input>
      </div>
    </el-card>
    
  </div>
  <div class="user table-title">
    <el-card shadow="always">
      <div class="card-body" style="display:flex; justify-content: space-between;">
        <span><el-icon><Tickets /></el-icon>&nbsp;数据列表</span>
        <el-button type="primary" size="small" @click="addDialog">添加</el-button>
      </div>
    </el-card>
  </div>
  <div class="table-user">
    <el-table :data="state.tableData" border style="width: 100%" size="small">
      <el-table-column v-for="item in state.columns" :prop="item.prop" :label="item.label" :width="item.width" :key="item.prop" align="center">
        <template #default="{row,$index}" v-if="item.isSlot">
          <el-switch v-model="row.status" inline-prompt active-text="启用" inactive-text="未启用" @change="userStatusChange(row.status,$index)">
          </el-switch>
          
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div class="table-pagination">
    <el-pagination
      v-model:current-page="state.queryInfo.pageNum"
      :page-sizes="[10, 20, 30, 50]"
      v-model:page-size="state.queryInfo.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="state.totalNum" background>
      >
    </el-pagination>
    
  </div>
</template>
<script setup lang="ts">
import type { UserList,UserStatusChange} from './ts/data'
import {formatDate} from '@/utils/date'
const { proxy } = getCurrentInstance() as any
const api = proxy.$api

const state = reactive({
  tableData:[] as UserList[],
  columns:[
    {isSlot:false,label:'编号',prop:'id',width:50},
    {isSlot:false,label:'账号',prop:'username',width:'auto'},
    {isSlot:false,label:'姓名',prop:'nickName',width:'auto'},
    {isSlot:false,label:'邮箱',prop:'email',width:'auto'},
    {isSlot:false,label:'添加时间',prop:'createTime',width:'atuo'},
    {isSlot:false,label:'最后登录',prop:'loginTime',width:'auto'},
    {isSlot:true,label:'状态',prop:'status',width:'auto'}
  ],
  queryInfo:{
    pageNum:1,
    pageSize:10,
    keyword:''
  },
  totalNum:0,
  roleListAll:[],
})
const isSearch = ref(false)

const addDialog = () =>{

}
onMounted(()=>{
  getUserList()
  getRoleListAll()
})



const getUserList = async() =>{
  const {pageNum,pageSize} = state.queryInfo
  const {code,data,message} = await api.userList({pageNum,pageSize})
  if(code === 200){
    state.tableData = data.list
    state.tableData.forEach((el)=>{
      el.status = el.status ?true:false
      el.createTime = formatDate(el.createTime as string)
      if(el.loginTime){
        el.loginTime =  formatDate(el.loginTime as string)
      }
    })
    state.totalNum = data.total
  }else{
    ElMessage.warning(message)
  }
}
// 获取所有角色
const getRoleListAll = async()=>{
  const {code,data,message} = await api.roleListAll()
  if(code === 200){
    state.roleListAll = data
  }else{
    ElMessage.warning(message)
  }
}

// 更改用户状态
const userStatusChange:UserStatusChange = async(user_status,index) =>{
  state.tableData[index].status = user_status?true:false
  const {id,status} = state.tableData[index]
  const {code,message} = await api.roleUpdateStatus(id,status?1:0)
  if(code===200){
    ElMessage.success(message)
  }else{
    ElMessage.warning(message)
  }
}

const resetSearchOrReturn =() =>{

}
const handleSearch = () =>{
  
}

watch(()=>state.queryInfo.pageNum,(newPage)=>{
  state.queryInfo.pageNum = newPage
  getUserList()
  
})
watch(()=>state.queryInfo.pageSize,(newSize)=>{
  state.queryInfo.pageSize = newSize
  getUserList()
})


</script>
<style lang='less' scoped>
.user{
  margin-bottom: 20px;
  .card-body{
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    align-items: center;
  }
  .title span{
    margin-left: 10px;
    font-size: 14px;
  }
}
.table-search{
  .searchInput{
    padding: 20px 0 20px 40px;
    span{
      font-size: 14px;
    }
  }

}
.table-title{

  
  .addBtn{
    margin-right: 20px;
  }
}
.table-pagination{
  float: right;
  margin-top: 20px;
}
</style>
