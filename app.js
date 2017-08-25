'use strict'
const koa=require('koa')
const logger=require('koa-logger')
const session=require('koa-session')
const bodyParser=require('koa-bodyparser')
let app=new koa()

let router=require('./config/routes')()
app.keys=['genwoshua'];//会话中间件cookie-session加密
app.use(logger())
app.use(session(app))
app.use(bodyParser())

app.use(router.routes())
    .use(router.allowedMethods())
    
app.use(async ctx=>{
    
    ctx.body={
        url:ctx.url
    }
})

app.listen(3000,()=>{
    console.log('app is listening at 3000')
})