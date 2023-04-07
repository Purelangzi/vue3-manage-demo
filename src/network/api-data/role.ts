import request from '../request'

export default {
   roleListAll:()=>request.get('/role/listAll'),// 获取所有角色
//    roleUpdateStatus:(id:number,status:number)=>request.post(`/role/updateStatus/${id}?status=${status}`),// 获取所有角色
   roleUpdateStatus:(id:number,status:number)=>request.post(`/role/updateStatus/${id}`,null,{params:{status}}),// 获取所有角色
} 