import piniaPluginPersist from 'pinia-plugin-persist'; // 引入持久化插件
const pinia = createPinia();
pinia.use(piniaPluginPersist);// 使用该插件
export default pinia;
