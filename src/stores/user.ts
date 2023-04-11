import {StoreNames} from './name-space/' 
import Cookies from 'js-cookie'
import type {UserState,Menus} from './model/userModel'


const cookiesStorage: Storage = {
    setItem(key, state:any) {
        let myState = JSON.parse(state)
        return Cookies.set(key, myState[key], { expires: 3 })
    },
    getItem(key) {
        return JSON.stringify({
            [key]: Cookies.get(key),
        })
    },
    length,
    clear:()=>{},
    key:(index)=>null,
    removeItem:()=>{}
}


export const useUserStore = defineStore(StoreNames.UserInfo,{
    state:():UserState=>({
        userInfo:{} ,
        token:'',
        menus:[],
    }),
    getters:{
        getNewMenus:(state)=>{
            return state.menus.filter((el:Menus)=>{
                if(el.parentId===0){
                    el.children = []
                    state.menus.forEach((item:Menus)=>{
                        if(item.parentId === el.id){
                            el.children!.push(item)
                        }
                    })
                    return el
                }
            })
        }
    },
    actions:{
        logOut(){
            this.resetTokenMenus()
        },
        resetTokenMenus(){
            Cookies.remove('token')
            localStorage.removeItem('menus')
        }
    },
    persist:{
        enabled:true,
        strategies:[
            {key:"token",storage:cookiesStorage,paths:["token"]}, //cookiesStorage只能用于token
            {key:"menus",storage:localStorage,paths:["menus"]}
        ]
    }
})