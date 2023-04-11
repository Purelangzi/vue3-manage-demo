import axios from 'axios'

declare module 'axios' {
    interface AxiosInstance {
        (config:AxiosRequestConfig):Promise<any>
    }
}

const instance = axios.create({
    baseURL:'/mock-api'
});


instance.interceptors.request.use(config=>{
    return config
},error=>{
    return Promise.reject(error)
})

instance.interceptors.response.use(result=>{

    return result.data
},error=>{
    return Promise.reject(error)
})

export default instance