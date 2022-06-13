// 读取某个JSON文件 响应给前端的中间件 第三层 
// 读取文件内容 http://127.0.0.1:8888/api/seller
// 获取请求的路径 拼接文件路径 再将文件设置到响应中
const fileUtils = require('../utils/file_utils')
const path = require('path')//获取绝对路径
module.exports = async (ctx, next) => {
    // 根据请求的url 进行文件的读取 从而获取数据
    const url = ctx.request.url//端口之后的路径  /api/seller    数据文件data/seller.json
    let filePath = url.replace('/api', '')
    filePath = '../data' + filePath + '.json'
    filePath = path.join(__dirname, filePath)
    // 通过try catch处理请求失败的情况
    try {
        // 通过Utils中的函数处理数据
        const res = await fileUtils.getFileJsonData(filePath) //通过await直接获取promise包裹的对象
        ctx.response.body = res
    } catch (error) {
        const errorMsg = {
            message: '读取文件内容失败，文件资源找不到',
            status: 404
        }
        ctx.response.body = JSON.stringify(errorMsg)//转为JSON对象数据
    }
    console.log(filePath)
    await next()
}