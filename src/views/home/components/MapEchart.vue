<template>
    <div ref="mapContainer" style="width: auto; height: 400px;"></div>
</template>
<script setup lang="ts">
// 引入自定义的图像option类型
import type { ECOption } from '@/types/echarts';
import china from '../../../../mocks/china.json'
interface SalePie {
   [key:string]:string|number
}
interface MapEchartProps {
    saleMapData: SalePie[],
}
const props = defineProps<MapEchartProps>()
const echarts = inject<any>('$echarts')

const mapContainer = ref<HTMLElement>()
const saleChart = ref()
echarts.registerMap('China', china)

const mapEchartInit = () => {
    const seriesData = props.saleMapData.map(el=>({ name:el.areaName,value:el.saleNum }))
    
    if (!saleChart.value) {
        saleChart.value = echarts.init(mapContainer.value as HTMLElement)
    }

    const option: ECOption = {
        title: {
            text: '全国销量分布图',
            left: '50%'
        },
        tooltip: {
            show: true,
            formatter:'{b0} <br />销量： {c0}',
            backgroundColor: 'rgba(50,50,50,0.7)',
            textStyle:{
                color:'#fff'
            }
        },
        series: [
            {
                type: 'map',
                map: 'China',
                emphasis: {
                    label: {
                        show: false
                    },
                    itemStyle: {
                        areaColor: '#8884d8'
                    }
                },
                itemStyle: {
                    borderColor: '#fff',
                    borderWidth:1
                },
                data:seriesData as any
            }
        ],
        visualMap: {
            type:'continuous',
            left: 'left',
            min: 0,
            max: 1000000,
            calculable: true,
            inRange:{
                color:['#fdc6c0','#fca79e','#fb7258','#fd6136','#ff4806']
            }
        },
        
    }
    saleChart.value.setOption(option);
}
onMounted(() => {
    mapEchartInit()
})

watch(() => props.saleMapData, (newVal, oldVal) => {
    mapEchartInit()
})
</script>

<style lang='less' scoped></style>
