import * as echarts from 'echarts/core';
import {
  PieChart,
  MapChart,
} from 'echarts/charts';
import {
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  GridComponent,
  VisualMapComponent,
  // 数据集组件
  DatasetComponent,
  // 内置数据转换器组件 (filter, sort)
  TransformComponent
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';



// 注册必须的组件
echarts.use([
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  GridComponent,
  VisualMapComponent,
  DatasetComponent,
  TransformComponent,
  PieChart,
  MapChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
]);

export default echarts