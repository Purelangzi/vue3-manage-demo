<template>
  <div class="home-header">
    <el-radio-group v-model="selectLabel" size="large" @change="selectChange">
      <el-radio-button label="sale_">销量</el-radio-button>
      <el-radio-button label="_money">销售额</el-radio-button>
    </el-radio-group>
    <el-select v-model="selectDay" class="m-2" placeholder="Select" size="large" @change="selectChange">
      <el-option v-for="item in otptions" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
  </div>
  <div class="home-echarts">
    <PieEchart :sale-pic-data="resSalePicData" />
    <MapEchart :sale-map-data="state.saleMapData" />


  </div>
</template>
<script setup lang="ts">
import { mockHomeSet } from '../../../mocks/api'
import PieEchart from './components/PieEchart.vue'
import MapEchart from './components/MapEchart.vue'
interface SalePie {
  [key: string]: string | number,
  value: number,
  name: string
}

const state = reactive({
  selectLabel: 'sale_',
  selectDay: 'today',
  resSalePicData:[] as any[],
  salePieData: [] as SalePie[],
  saleMapData: [] as SalePie[],
  otptions: [
    { value: 'yesterday', label: '昨天' },
    { value: 'today', label: '今天' },
    { value: 'three_days', label: '前三天' },
    { value: 'seven_days', label: '前7天' },
    { value: 'fourteen_days', label: '前14天' },
  ]
})
const {selectLabel,selectDay,otptions,resSalePicData} = toRefs(state)
mockHomeSet().then(res => {
  state.salePieData = res.data.salePie
  state.saleMapData = res.data.saleMap
})

const selectChange = () =>{
  handleData()
}
const handleData = () =>{
  let key =''
  if(selectLabel.value === '_money'){
    key =selectDay.value + selectLabel.value
  }else{
    key =selectLabel.value + selectDay.value
  }
  resSalePicData.value = state.salePieData.map(el=>({value:el[key],name:el.name}))
}

watch(()=>state.salePieData,()=>{
  handleData()
})


</script>
<style lang='less' scoped>
.home-header {
  display: flex;
  justify-content: space-between;
}

.home-echarts {
  margin-top: 20px;
}
</style>
