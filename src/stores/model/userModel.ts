export type UserState = {
    userInfo:{
        username?:string,
        password?:string
    },
    token:string,
    menus:Menus[],
}
export interface Menus{
    createTime:string,
    hidden:number,
    icon:string,
    id:number,
    level:number,
    name:string,
    parentId:number,
    sort:number,
    title:string,
    children?:Menus[]
}