/**
 * 格式日期
 * @param date 日期字符串2021-07-16T08:24:31.000+00:00
 * @returns 2021-07-16 08:24:31
 */
export const formatDate = (date:string) =>{
    return date?.split('T').join(' ').split('.')[0]
}
