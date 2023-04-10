<template>
  <div class="user table-search">
    <el-card shadow="always" :body-style="{ padding: '18px' }">
      <div class="card-body">
        <span><el-icon>
            <Search />
          </el-icon>&nbsp;筛选搜索</span>
        <div class="title-btn">
          <el-button :type="isSearch ? 'success' : ''" size="default" @click="resetSearchOrReturn">{{ isSearch ? '返回' :
            '重置' }}</el-button>
          <el-button type="primary" size="default" :disabled="searchDisabled" @click="handleSearch">查询搜索</el-button>
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
        <span><el-icon>
            <Tickets />
          </el-icon>&nbsp;数据列表</span>
        <el-button type="primary" size="small" @click="editUser()">添加</el-button>
      </div>
    </el-card>
  </div>
  <div class="table-user">
    <el-table v-loading="loading" :data="state.tableData" border style="width: 100%" size="small">
      <el-table-column v-for="item in state.columns" :prop="item.prop" :label="item.label" :width="item.width"
        :key="item.prop" align="center">
        <template #default="{ row, $index }" v-if="item.isSlot">
          <el-switch v-model="row.status" inline-prompt active-text="启用" inactive-text="未启用" :active-value="1"
            :inactive-value="0" @change="userStatusChange($index)">
          </el-switch>

        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="divideRole(row.id)">分配角色</el-button>
          <el-button type="primary" link size="small" @click="editUser(row)">编辑</el-button>
          <el-button type="primary" link size="small" @click="deleteUser(row)">删除</el-button>

        </template>

      </el-table-column>

    </el-table>
  </div>
  <div class="table-pagination">
    <el-pagination v-model:current-page="state.queryInfo.pageNum" :page-sizes="[10, 20, 30, 50]"
      v-model:page-size="state.queryInfo.pageSize" layout="total, sizes, prev, pager, next, jumper"
      :total="state.totalNum" background>
      >
    </el-pagination>

  </div>

  <EditAdmin 
    :add-userform="state.addUserform" :row-id="state.rowId" :dialog-form-visible="dialogFormVisible"
    @get-user-list="getUserList"
    v-model:user-from="state.addUserform"
    v-model:dialog-visible="dialogFormVisible"
  />

  <DivideRole 
    :query-role="state.queryRole" :role-list-all="state.roleListAll" :dialog-divide-visible="dialogDivideVisible"
    @get-user-list="getUserList"
    v-model:rest-query-role="state.queryRole"
    v-model:role-ids="state.queryRole.roleIds"
    v-model:dialog-visible="dialogDivideVisible" 
  />
  
</template>
<script setup lang="ts">
import {
  UserList, isSearch, searchDisabled, AddUserform,
  dialogFormVisible, loading, dialogDivideVisible, DivdeRoleform,QueryRole
} from './ts/admin-data'
import EditAdmin from './components/admin/EditAdmin.vue';
import DivideRole from './components/admin/DivideRole.vue'
import { formatDate } from '@/utils/date'

const { proxy } = getCurrentInstance() as any
const api = proxy.$api


const state = reactive({
  tableData: [] as UserList[],
  columns: [
    { isSlot: false, label: '编号', prop: 'id', width: 50 },
    { isSlot: false, label: '账号', prop: 'username', width: 'auto' },
    { isSlot: false, label: '姓名', prop: 'nickName', width: 'auto' },
    { isSlot: false, label: '邮箱', prop: 'email', width: 'auto' },
    { isSlot: false, label: '添加时间', prop: 'createTime', width: 'atuo' },
    { isSlot: false, label: '最后登录', prop: 'loginTime', width: 'auto' },
    { isSlot: true, label: '状态', prop: 'status', width: 'auto' },
  ],
  queryInfo: {
    pageNum: 1,
    pageSize: 10,
    keyword: ''
  },
  totalNum: 0,
  roleListAll: [] as DivdeRoleform[],
  addUserform: {} as AddUserform,
  queryRole: {
    adminId: undefined,
    roleIds: []
  } as QueryRole,
  rowId: 0,
})



onMounted(() => {
  getUserList()
  getRoleListAll()
})



const getUserList = async () => {
  loading.value = true
  const { pageNum, pageSize, keyword } = state.queryInfo
  searchDisabled.value = keyword ? true : false
  const { code, data, message } = await api.userList(keyword ? state.queryInfo : { pageNum, pageSize })
  if (code === 200) {
    state.tableData = data.list
    state.tableData.forEach((el) => {
      el.createTime = formatDate(el.createTime as string)
      if (el.loginTime) {
        el.loginTime = formatDate(el.loginTime as string)
      }
    })
    state.totalNum = data.total
  } else {
    ElMessage.warning(message)
  }
  loading.value = false
}
// 获取所有角色
const getRoleListAll = async () => {
  const { code, data, message } = await api.roleListAll()
  if (code === 200) {
    data.forEach((el: { id: number; name: string; }) => {
      state.roleListAll.push({
        value: el.id,
        label: el.name
      })
    })
  } else {
    ElMessage.warning(message)
  }
}

// 更改用户状态
const userStatusChange = async (index: number) => {
  const { id, status } = state.tableData[index]
  const { code, message } = await api.userUpdateStatus(id, status ? 1 : 0)
  if (code == 200) {
    ElMessage.success(message)
  } else {
    ElMessage.error(message)
    state.tableData[index].status = state.tableData[index].status ? 0 : 1
  }
}
// 重置或返回表格
const resetSearchOrReturn = () => {
  state.queryInfo.keyword = ''
  if (isSearch.value) { // 返回
    isSearch.value = false
    searchDisabled.value = false
    getUserList()
  }
}
// 搜索按钮
const handleSearch = () => {
  if (!state.queryInfo.keyword) return
  isSearch.value = true
  getUserList()
}

// 编辑或添加用户按钮
const editUser = (row?: AddUserform) => {
  if(!row){
    state.addUserform = {
      status:1
    } as AddUserform
    dialogFormVisible.value = true
  }else{
    const loadingInstanceEdit = ElLoading.service()
    state.rowId = row.id as number
    delete row.icon
    delete row.loginTime
    nextTick(()=>{
      state.addUserform = row
      setTimeout(() => {
        loadingInstanceEdit.close()
        dialogFormVisible.value = true
      }, 400); 
    }) 
  }
}




// 分配角色按钮
const divideRole = async (id: number) => {
  const loadingInstance = ElLoading.service()
  const query = {
    adminId:id,
    roleIds:[] as number[]
  }
  const { data, code } = await api.userRole(id)
  if (code == 200 && data.length) {
    data?.forEach((el: { id: number }) => {
      query.roleIds.push(el.id)
    })
    state.queryRole = query
  }
  nextTick(()=>{
    loadingInstance.close()
  }) 
  dialogDivideVisible.value = true
}

const deleteUser = (row:AddUserform) =>{
  ElMessageBox.confirm(`此操作将删除用户 ${row.username}, 是否继续?`, '提示',{
    confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning',}
    )
    .then(async () => {
        const { code, message } = await api.userDelete(row.id)
        ElMessage[code == 200 ? 'success' : 'error'](message)
        getUserList()
    }).catch(() => { })
}



watch(() => state.queryInfo.pageNum, (newPage) => {
  state.queryInfo.pageNum = newPage
  getUserList()

})
watch(() => state.queryInfo.pageSize, (newSize) => {
  state.queryInfo.pageSize = newSize
  getUserList()
})


</script>
<style lang='less' scoped>
.user {
  margin-bottom: 20px;

  .card-body {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    align-items: center;
  }

  .title span {
    margin-left: 10px;
    font-size: 14px;
  }
}

.table-search {
  .searchInput {
    padding: 20px 0 20px 40px;

    span {
      font-size: 14px;
    }
  }

}

.table-title {


  .addBtn {
    margin-right: 20px;
  }
}

.table-pagination {
  float: right;
  margin-top: 20px;
}
</style>
