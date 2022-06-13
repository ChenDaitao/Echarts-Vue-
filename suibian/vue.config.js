const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // 设置端口号 自动打开浏览器
  devServer:{
    port:8999,
    open:true,
    host:'localhost'
  }
})
