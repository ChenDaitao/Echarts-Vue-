// 设置响应头的中间件 第二层中间件
// 获取mime媒体类型的数据  设置响应头和响应体的编码 告诉浏览器数据的格式和响应体
module.exports = async (ctx, next) => {
    const contentType = 'application/json;charset=utf-8'
    ctx.set('Content-Type', contentType)
    // 允许跨域请求
    ctx.set("Access-Control-Allow-Origin","*")
    ctx.set("Access-Control-Allow-Methods","OPTIONS,GET,POST,DELETE")
    // ctx.response.body = '{"success":true}'
    await next()
}