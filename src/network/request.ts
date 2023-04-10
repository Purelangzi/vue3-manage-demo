import axios from 'axios'

import {useUserStore} from '@/stores/user';

declare module 'axios' {
    interface AxiosInstance {
        (config:AxiosRequestConfig):Promise<any>
    }
}

const instance = axios.create({
    baseURL:'http://120.24.64.5:8088/mall-admin/',
    timeout:15000
});


instance.interceptors.request.use(config=>{
    const {token} = useUserStore()
    if (token) {
        config.headers['Authorization'] = "Bearer "+ token // 请求头添加token和Bearer
    }

    // 配置post的请求头为表单提交，不配置默认是json格式
    // config.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
    return config
},error=>{
    
    return Promise.reject(error)
})

instance.interceptors.response.use(result=>{

    return result.data
},error=>{
    const store = useUserStore()
    switch (error.response.status) {
        case 400:
            ElMessage.error('错误的请求')
            break;
        // 401:表示Token 过期
        case 401:
            ElMessage({
                message: error.response.data.message,
                type: 'error',
                duration: 5 * 1000
            })
            store.logOut()
            location.reload()
            break;
        case 404:
            ElMessage.error('接口请求不存在')
            break;
        default:
            ElMessage.error(error.response.data.message||'error')
            break;
    }

    return Promise.reject(error)
})

export default instance