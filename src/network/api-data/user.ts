import request from '../request'

export default {
    userLogin:(data:object) =>request.post('/admin/login',data),
    userInfo:() =>request.get('/admin/info'),
    userLogout:()=>request.post('/admin/logout'),
    userList:(params:object)=>request.get('admin/list',{params})
} 