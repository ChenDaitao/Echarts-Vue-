const Koa = require('koa')
const app = new Koa()
// 2、绑定中间件
const resDuation = require('./middleware/koa_reponse_duration')
const resHeader=require('./middleware/koa_reponse_header')
const resData=require('./middleware/koa_reponse_data')

// 绑定第一层中间件
app.use(resDuation)
// 绑定第二层中间件
app.use(resHeader)
// 绑定第三层中间件
app.use(resData)
app.listen(8888)