<template>
    <el-dialog :model-value="props.dialogFormVisible" :title="`${isEdit ? '修改' : '添加'}用户`" width="50%"
        :before-close="handleCloseDialogForm" >
        <el-form :model="state.addUserform" ref="ruleFormRef" :rules="userformRules" :label-width="formLabelWidth">
            <el-form-item label="账号：" prop="username" >
                <el-input v-model="state.addUserform.username" placeholder="请输入账号" />
            </el-form-item>
            <el-form-item label="姓名：" prop="nickName" >
                <el-input v-model="state.addUserform.nickName" placeholder="请输入姓名" />
            </el-form-item>
            <el-form-item label="邮箱：" prop="email">
                <el-input v-model="state.addUserform.email" placeholder="请输入邮箱" />
            </el-form-item>
            <el-form-item label="密码：" prop="password">
                <el-input v-model="state.addUserform.password" type="password" placeholder="请输入密码" />
            </el-form-item>
            <el-form-item label="备注：" prop="note">
                <el-input type="textarea" :rows="3" v-model="state.addUserform.note" maxlength="450" placeholder="请输入备注" />
            </el-form-item>
            <el-form-item label="状态：" prop="status">
                <el-switch v-model="state.addUserform.status"  inline-prompt active-text="启用" inactive-text="未启用" 
                    :active-value="1" :inactive-value="0" @change="">
                </el-switch>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="cancelAddUser(ruleFormRef)">取消</el-button>
                <el-button type="primary" @click="submitAddOrUpdateUser(ruleFormRef)">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import type {AddUserform} from '../../ts/admin-data'
interface EditAdminProps {
    addUserform:AddUserform,
    rowId:number,
    dialogFormVisible:boolean
}
interface EditAdminEmits {
    (e:'getUserList'):void,
    (e:'update:userFrom',val:object):void,
    (e:'update:dialogVisible',val:boolean):void
}

const { proxy } = getCurrentInstance() as any
const api = proxy.$api
const props = defineProps<EditAdminProps>()
const emit = defineEmits<EditAdminEmits>()

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
const ruleFormRef = ref<FormInstance>()
const userformRules = reactive<FormRules>({
    username: [
        { required: true, message: '输入不能为空', trigger: 'blur' },
        { min: 1, max: 10, message: '长度在1~10', trigger: 'blur' },
    ],
    nickName: [
        { required: false, message: '输入不能为空', trigger: 'blur' },
        { min: 1, max: 10, message: '长度在1~10', trigger: 'blur' },
    ],
    email: [
        { required: true, validator: validateEmail, trigger: 'blur' }
    ],
    password: [
        { required: true, message: '输入不能为空', trigger: 'blur' },
        { min: 5, max: 15, message: '长度在5~15', trigger: 'blur' },
    ],
})
const formLabelWidth = '110px'

const state = reactive({
    addUserform:{} as AddUserform
})


const cancelAddUser = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
    formEl.clearValidate()
    emit('update:dialogVisible',false)
    
}
// 添加或修改用户
const submitAddOrUpdateUser = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            ElMessageBox.confirm(`此操作将${!isEdit ? '添加' : '修改'}当前用户信息, 是否继续?`, '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                })
                .then(async () => {
                    const options: Promise<any> = !isEdit ? api.userRegist(state.addUserform) : api.userUpdate(props.rowId, state.addUserform)
                    const { code, message } = await options
                    ElMessage[code == 200 ? 'success' : 'error'](message)
                    cancelAddUser(formEl)
                    emit('getUserList')
                }).catch(() => { })
        } else {
            return false
        }
    })
}
const handleCloseDialogForm = (done: () => void) => {
    cancelAddUser(ruleFormRef.value)
    emit('update:userFrom',{})
    done()
}
watch(()=>props.addUserform,(newVal)=>{
    state.addUserform = {...newVal}
})
const isEdit = computed(()=>{
    return state.addUserform.id?true:false
})

</script>
<style lang='less' scoped></style>
