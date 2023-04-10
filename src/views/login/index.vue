<template>
  <div class="login-box">
    <div class="login-content">
      <h1 style="text-align: center;">后台管理</h1>
      <div class="login-form">
        <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="80px">
          <el-form-item label="账号" prop="username">
            <el-input v-model="ruleForm.username" autocomplete="off" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="ruleForm.password" type="password" autocomplete="off" />
          </el-form-item>


          <el-form-item>
            <el-button type="primary" @click="login(ruleFormRef)">登录</el-button>
            <el-button @click="resetForm(ruleFormRef)">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type{ FormInstance, FormRules } from 'element-plus'
import { useUserStore} from '@/stores/user'


const { proxy } = getCurrentInstance() as any
const api = proxy.$api
const ruleFormRef = ref<FormInstance>()

const router = useRouter()
const userStore = useUserStore()

const validatePassword = (rule: unknown, value: string|undefined, callback: (msg?:Error)=>void) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    if (ruleForm.username !== '') {
      if (!ruleFormRef.value) return
      if (value!.length < 3 || value!.length > 10) {
        callback(new Error("密码长度在3~10!"))
      }
      ruleFormRef.value.validateField('username', () => null)
    }
    callback()
  }
}
const validateUsername = (rule: unknown, value: string|undefined, callback: (msg?:Error)=>void) => {
  if (value === '') {
    callback(new Error('请输入账号'))
  } else if (value!.length < 3 || value!.length > 10) {
    callback(new Error("账号长度在3~10!"))
  } else {
    callback()
  }
}

const ruleForm = reactive({
  password: '123456',
  username: 'admin',
})

const rules = reactive<FormRules>({
  password: [{ validator: validatePassword, trigger: 'blur' }],
  username: [{ validator: validateUsername, trigger: 'blur' }],
})

const login = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async(valid) => {
    if (valid) {
      const {code,data,message} = await api.userLogin(ruleForm)
      if(code !== 200) return ElMessage.error(message)
      userStore.$patch((state)=>{
        console.log('存储token');
        state.token = data.token
      })

      const res = await api.userInfo()
      if(res.code !== 200) return ElMessage.error(res.message)
      userStore.$patch((state)=>{
        console.log('存储菜单');
        state.menus = res.data.menus
      })
      router.push('/')
      
    } else {
      console.log('error submit!')
      return false
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

</script>
<style lang='less' scoped>
.login-box {
  width: 100%;
  height: 100%;
  background: url('../../assets/loginbg.jpeg');
  overflow: hidden;

  .login-content {
    margin: 200px auto;
    width: 500px;
    background-color: #eee;
    padding: 30px;
    border-radius: 20px;
    .login-form{
      margin-top: 40px;
    }
  }
}
</style>
