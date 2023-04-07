export interface UserList{
    [key:string]:string|number|boolean,
}
export interface UserStatusChange{
    (x:boolean,y:number):void
}