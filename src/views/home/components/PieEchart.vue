<template>
  <div ref="pieContainer" style="width: auto; height: 400px;"></div>
</template>
<script setup lang="ts">
// 引入自定义的图像option类型
import type { ECOption } from '@/types/echarts';

interface SalePie{
  value:number,
  name:string
}

interface PieEchartProps {
  salePicData: SalePie[],
}
const props = defineProps<PieEchartProps>()

const echarts = inject<any>('$echarts')

const pieContainer = ref<HTMLElement>()
const saleChart = ref()

const pieEchartInit = () =>{
  if(!saleChart.value){
    saleChart.value = echarts.init(pieContainer.value)
  }
  
  const option:ECOption = {
    tooltip: {
      trigger: 'item'
    },
    
    legend: {
      orient: 'vertical',
      right: '5%',
      height:100
    },
    series: [
      {
        type: 'pie',
        radius: '50%',
        center: ['30%', '35%'],
        data: props.salePicData,/* [
          { value: 1048, name: 'Search Engine' },
          { value: 735, name: 'Direct' },
          { value: 580, name: 'Email' },
          { value: 484, name: 'Union Ads' },
          { value: 300, name: 'Video Ads' }
        ], */
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
  saleChart.value.setOption(option);
}
onMounted(()=>{
  pieEchartInit()
})

watch(()=>props.salePicData,(newVal,oldVal)=>{
  pieEchartInit()
})


</script>
<style lang='less' scoped>

</style>
