import axios from 'axios'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import "@/assets/font/iconfont.css"
import "@/assets/css/global.less"
// 设置请求基准路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api'//后端数据请求路径

Vue.config.productionTip = false
// 将echarts挂载vue的原型上面 便于组件操作
Vue.prototype.$echarts = window.echarts
// 将axios挂载到vue的原型

Vue.prototype.$http = axios
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')