<template>
  <div class="home-header">
    <el-radio-group v-model="isSale" size="large">
      <el-radio-button label="销量" />
      <el-radio-button label="销售额" />
    </el-radio-group>
    <el-select v-model="saleDay" class="m-2" placeholder="Select" size="large">
      <el-option
        v-for="item in isSale=='销量'?state.saleOptions:state.saleMoneyOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
  <div class="home-echarts">
    <PieEchart :sale-pic-data="resSalePicData" />
  </div>
</template>
<script setup lang="ts">
import {mockHomeSet,mockChinaMap} from '../../../mocks/api'
import PieEchart from './components/PieEchart.vue'
interface SalePie{
  [key:string]:string|number,
  value:number,
  name:string
}
const isSale = ref('销量')
const saleDay = ref('sale_today')
const state = reactive({
  salePieData:[] as SalePie[],
  saleOptions:[
    { value:'sale_yesterday',label:'昨天'},
    { value:'sale_today',label:'今天'},
    { value:'sale_three_days',label:'前三天'},
    { value:'sale_seven_days',label:'前7天'},
    { value:'sale_fourteen_days',label:'前14天'},
  ],
  saleMoneyOptions:[
    { value:'yesterday_money',label:'昨天'},
    { value:'today_money',label:'今天'},
    { value:'three_days_money',label:'前三天'},
    { value:'thirty_days_money',label:'前7天'},
    { value:'fourteen_days_money',label:'前14天'},
  ],
})

mockHomeSet().then(res=>{
  state.salePieData = res.data.salePie
})

const resSalePicData = computed(()=>{
  const newArr=[] as SalePie[]
  state.salePieData.forEach(obj=>{
    for (const key in obj) {
      if(key === saleDay.value){
        newArr.push({
          value:parseInt(obj[key] as string),
          name:obj['name']
        })
      }
    }
  })
  return newArr
})
watch(isSale,(newVal)=>{
  if(newVal === '销量'){
    saleDay.value = 'sale_today'
  }else{
    saleDay.value = 'today_money'
  }
})
const mock = async()=>{
  const chinaMapData = await mockChinaMap()
}
</script>
<style lang='less' scoped>
.home-header{
  display: flex;
  justify-content: space-between;
}
.home-echarts{
  margin-top: 20px;
}
</style>
