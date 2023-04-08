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
        <el-button type="primary" size="small" @click="dialogFormVisible = true;isEditUser = false">添加</el-button>
      </div>
    </el-card>
  </div>
  <div class="table-user">
    <el-table v-loading="loading" :data="state.tableData" border style="width: 100%" size="small">
      <el-table-column v-for="item in state.columns" :prop="item.prop" :label="item.label" :width="item.width"
        :key="item.prop" align="center">
        <template #default="{ row, $index }" v-if="item.isSlot">
          <el-switch v-model="row.status" inline-prompt active-text="启用" inactive-text="未启用" :active-value="1" :inactive-value="0"
            @change="userStatusChange($index)">
          </el-switch>

        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="{row}">
          <el-button type="primary" link size="small" @click="divideRole(row.id)">分配角色</el-button>
          <el-button type="primary" link size="small" @click="editUser(row)">编辑</el-button>
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
  <el-dialog v-model="dialogFormVisible" :title="`${isEditUser?'修改':'添加'}用户`" width="50%" :before-close="handleCloseDialogForm">
    <el-form :model="state.addUserform" ref="ruleFormRef" :rules="userformRules">
      <el-form-item label="账号：" prop="username" :label-width="formLabelWidth">
        <el-input v-model="state.addUserform.username" placeholder="请输入账号" />
      </el-form-item>
      <el-form-item label="姓名：" prop="nickName" :label-width="formLabelWidth">
        <el-input v-model="state.addUserform.nickName" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="邮箱：" prop="email" :label-width="formLabelWidth">
        <el-input v-model="state.addUserform.email" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item label="密码：" prop="password" :label-width="formLabelWidth">
        <el-input v-model="state.addUserform.password" placeholder="请输入密码" />
      </el-form-item>
      <el-form-item label="备注：" prop="note" :label-width="formLabelWidth">
        <el-input type="textarea" :rows="3" v-model="state.addUserform.note" maxlength="450" placeholder="请输入备注" />
      </el-form-item>
      <el-form-item label="状态：" prop="status" :label-width="formLabelWidth">
        <el-radio-group v-model="state.addUserform.status">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">未启用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelAddUser(ruleFormRef)">取消</el-button>
        <el-button type="primary" @click="submitAddOrUpdateUser(ruleFormRef)">确定</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog
    v-model="dialogDivideVisible"
    title="分配角色"
    width="30%"
    :before-close="handleCloseDivide"
  >
    <el-select v-model="state.queryRole.roleIds" multiple  placeholder="请选择">
      <el-option v-for="item in state.roleListAll"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelDivideRole">取消</el-button>
        <el-button type="primary" @click="submitDivideRole">确定</el-button>
      </span>
    </template>
  </el-dialog>
  
</template>
<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { UserList, isSearch, searchDisabled, AddUserform, 
  dialogFormVisible, loading,dialogDivideVisible,DivdeRoleform,isEditUser} from './ts/admin-data'
import { formatDate } from '@/utils/date'
const { proxy } = getCurrentInstance() as any
const api = proxy.$api

const validateEmail = (rule: any, value: any, callback: any) => {
  const reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
  if (value === '') {
    callback(new Error('输入不能为空'))
  } else if (!reg.test(value)) {
    callback(new Error("email格式不对"))
  } else {
    callback()
  }
}



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
  queryRole:{
    adminId:0,
    roleIds:[] as number[]|string
  },
  rowId:0,
})
const ruleFormRef = ref<FormInstance>()
const userformRules = reactive<FormRules>({
  username: [
    { required: true, message: '输入不能为空', trigger: 'blur' },
    { min: 1, max: 10, message: '长度在1~10', trigger: 'blur' },
  ],
  nickName: [
    { required: false,message: '输入不能为空', trigger: 'blur' },
    { min: 1, max: 10, message: '长度在1~10', trigger: 'blur' },
  ],
  email: [
    { required: true,validator: validateEmail, trigger: 'blur' }
  ],
  password: [
    { required: true, message: '输入不能为空', trigger: 'blur' },
    { min: 5, max: 15, message: '长度在5~15', trigger: 'blur' },
  ],
})
const formLabelWidth = '110px'


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
    data.forEach((el: { id: number; name: string; })=>{
      state.roleListAll.push({
        value:el.id,
        label:el.name
      })
    })
  } else {
    ElMessage.warning(message)
  }
}

// 更改用户状态
const userStatusChange = async (index:number) => {
  const { id, status } = state.tableData[index]
  const { code, message } = await api.userUpdateStatus(id, status ? 1 : 0)
  if(code == 200){
    ElMessage.success(message)
  }else{
    ElMessage.error(message)
    state.tableData[index].status = state.tableData[index].status?0:1
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
// 添加或修改用户
const submitAddOrUpdateUser = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      ElMessageBox.confirm(`此操作将${!isEditUser.value?'添加':'修改'}当前用户信息, 是否继续?`, '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .then(async () => {
          const options:Promise<any> = !isEditUser.value?api.userRegist(state.addUserform):api.userUpdate(state.rowId,state.addUserform)
          
          const { code, message } = await options
          ElMessage[code == 200 ? 'success' : 'error'](message)
          cancelAddUser(formEl)
          getUserList()
        }).catch(()=>{})
        
    } else {
      return false
    }
  })
}
// 编辑用户按钮
const editUser = async(row:AddUserform) =>{
  isEditUser.value = true
  state.rowId = row.id as number
  delete row.icon
  delete row.loginTime
  row.status = row.status?1:0
  
  nextTick(()=>{
    state.addUserform = {...row}
  })
  dialogFormVisible.value = true
  
}

const cancelAddUser = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  console.log(state.tableData);
  
  dialogFormVisible.value = false
  formEl.resetFields()

  nextTick(()=>{
    formEl.clearValidate()
  })
  
}

// 用户分配角色
const submitDivideRole = ()=>{
  ElMessageBox.confirm('此操作将修改当前用户角色, 是否继续?', '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(async () => {
      state.queryRole.roleIds = (state.queryRole.roleIds as number[]).join()
      const {code,message} = await api.userRoleUpdate(state.queryRole)
      ElMessage[code == 200 ? 'success' : 'error'](message)
      dialogDivideVisible.value = false
      state.queryRole.roleIds = []
      getUserList()
    }).catch(()=>{})
  

}
const cancelDivideRole = () =>{
  state.queryRole.roleIds = []
  dialogDivideVisible.value = false
}

const handleCloseDialogForm = (done: () => void) => {

  cancelAddUser(ruleFormRef.value)
  state.addUserform = {} as AddUserform
  done()
}
const handleCloseDivide = (done: () => void) => {
  state.queryRole.roleIds = []
  done()
}

// 分配角色按钮
const divideRole = async(id:number) => {
  state.queryRole.adminId = id
  const {data,code} = await api.userRole(id)
  if(code == 200){
    data.forEach((el: { id: number})=>{
      (state.queryRole.roleIds as number[]).push(el.id)
    })
  }
  dialogDivideVisible.value = true
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
