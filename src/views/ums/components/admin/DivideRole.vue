<template>
    <el-dialog :model-value="props.dialogDivideVisible" title="分配角色" width="30%" :before-close="handleCloseDivide">
        <el-select v-model="state.queryRole.roleIds" multiple placeholder="请选择">
            <el-option v-for="item in props.roleListAll" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
        </el-select>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="()=>{rest()}">取消</el-button>
                <el-button type="primary" @click="submitDivideRole">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">

import type{QueryRole,DivdeRoleform} from '../../ts/admin-data'
interface DivdeRoleProps{
    queryRole:QueryRole,
    roleListAll:DivdeRoleform[],
    dialogDivideVisible:boolean
}

interface DivdeRoleEmits {
    (e:'getUserList'):void,
    (e:'update:restQueryRole',val:QueryRole):void,
    (e:'update:roleIds',val:string):void,
    (e:'update:dialogVisible',val:boolean):void
}
const { proxy } = getCurrentInstance() as any
const api = proxy.$api

const props = defineProps<DivdeRoleProps>()
const emit = defineEmits<DivdeRoleEmits>()

const state = reactive({
    queryRole:{} as QueryRole
})

// 用户分配角色
const submitDivideRole = () => {
    ElMessageBox.confirm('此操作将修改当前用户角色, 是否继续?', '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        })
        .then(async () => {
            emit('update:roleIds',(state.queryRole.roleIds as number[]).join())
            // 等子组件接收完父组件更新后的数据
            await new Promise<void>((resolve) => {
                emit('update:roleIds', (state.queryRole.roleIds as number[]).join());
                resolve()
            })
            const { code, message } = await api.userRoleUpdate(state.queryRole)
            ElMessage[code == 200 ? 'success' : 'error'](message)
            rest()
            emit('getUserList')
        }).catch(() => { })
}

const rest = () =>{
    emit('update:dialogVisible',false)
    emit('update:restQueryRole',{ adminId: undefined,roleIds: []})
}

const handleCloseDivide = (done: () => void) => {
    rest()
    done()
}
watch(()=>props.queryRole,(newVal)=>{
    state.queryRole = {...newVal}
},{deep:true})
</script>
<style lang='less' scoped></style>
