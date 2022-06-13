// 计算服务器消耗时长的中间件 (函数)
// 第一层中间件 刚刚开始以及结束的时间 最先开始最后结束的中间件
// 1、一进入服务器即记录时间  所有执行完毕记录时间 最后相减
// 2、设置响应头
module.exports = async (ctx, next) => {
    // 记录开始的时间 让内层的中间件得到执行 
    const start = Date.now()
    await next()//执行下一个中间件
    const end = Date.now()
    const duration = end - start
    // 设置响应头
    ctx.set('X-Response-Time', duration + 'ms')
}
