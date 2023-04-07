export interface UserList {
    [key:string]:string|number|boolean,
}
export interface UserStatusChange {
    (x:boolean,y:number):void
}
export interface AddUserform {
    email:string,
    nickName:string,
    password:string,
    status:number,
    username:string,
    note:string
}
export interface DivdeRoleform {
    value:string|number,
    label:string
}

export const isSearch = ref(false)

export const searchDisabled = ref(false)

export const dialogFormVisible = ref(false)

export const dialogDivideVisible = ref(false)

export const loading = ref(false)