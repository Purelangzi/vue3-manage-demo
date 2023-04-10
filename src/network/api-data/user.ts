import request from '../request'

export default {
    userLogin:(data:object) =>request.post('/admin/login',data),
    userInfo:() =>request.get('/admin/info'),
    userLogout:()=>request.post('/admin/logout'),
    userRegist:(data:object)=>request.post('/admin/register',data),
    userList:(params:object)=>request.get('admin/list',{params}),
    userRole:(id:number)=>request.get(`admin/role/${id}`),
    userUpdate:(id:number,data:object)=>request.post(`admin/update/${id}`,data),
    userRoleUpdate:(data:object) =>request.post('admin/role/update',null,{params:data}),
    // userUpdateStatus:(id:number,status:number)=>request.post(`/role/updateStatus/${id}?status=${status}`),
    userUpdateStatus:(id:number,status:number)=>request.post(`/admin/updateStatus/${id}`,null,{params:{status}}),
    userDelete:(id:number)=>request.post(`/admin/delete/${id}`)
} 