import request from '../request'

export default {
    userLogin:(data:object) =>request.post('/admin/login',data),
    userInfo:() =>request.get('/admin/info'),
    userLogout:()=>request.post('/admin/logout'),
    userRegist:(data:object)=>request.post('/admin/register',data),
    userList:(params:object)=>request.get('admin/list',{params}),
    userRole:(id:number)=>request.get(`admin/role/${id}`),
    userRoleUpdate:(data:object) =>request.post('admin/role/update',null,{params:data})


} 