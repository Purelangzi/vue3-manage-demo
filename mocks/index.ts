import type{ MockMethod } from "vite-plugin-mock"
import homesetJSON from './homeset.json' 
import chinaMapJSON from './china.json'
const mock: Array<MockMethod> = [
    {
        // 接口路径
        url: '/mock-api/homeset',
        // 接口方法
        method: 'get',
        // 返回数据
        response: () => {
            return {
                status: 200,
                message: 'success',
                data: homesetJSON
            }
        }
    },
    {
        url:'/mock-api/chinaMap',
        method: 'get',
        response: () => ({data: chinaMapJSON}
        )
    }
]
 
export default mock