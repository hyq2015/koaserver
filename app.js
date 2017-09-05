'use strict'
//加载所有表,在mongodb中建模

const fs=require('fs')
const path=require('path')
const mongoose=require('mongoose')
const DB='mongodb://localhost/gen_db'
//连接数据库
mongoose.Promise=require('bluebird')
mongoose.connect(DB,{useMongoClient:true})

let models_path=path.join(__dirname,'/app/models')

let walk=function(modelpath){
    fs.readdirSync(modelpath)
    .forEach(function(file){
        let filepath=path.join(modelpath,'/'+file)
        let stat=fs.statSync(filepath)
        // console.log(filepath)
        // console.log(stat)
        if(stat.isFile()){
            if(/(.*)\.js/.test(file)){
                require(filepath)
            }
        }else if(stat.isDirectory()) {
            walk(filepath)
        }
    })
}

walk(models_path)



const koa=require('koa')
const logger=require('koa-logger')
const session=require('koa-session')
const bodyParser=require('koa-bodyparser')
const cors=require('koa-cors')
let app=new koa()

const CONFIG = {
    key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 86400000,
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. default is false **/
  };

let router=require('./config/routes')()
app.keys=['genwoshua'];//会话中间件cookie-session加密
app.use(logger())
app.use(session(CONFIG,app))
app.use(bodyParser())
app.use(cors())

app.use(async (ctx,next) => {
    let user=ctx.session.user;
    let url=ctx.request.url;
    console.log(url)
    if(url.indexOf('/user/add')==-1 && url.indexOf('/user/logout')==-1){
        if(!user){
            ctx.status=403;
            ctx.body={
                message:'请登录'
            }
            return
        }
    }
    return next()
});
app.use(router.routes())
    .use(router.allowedMethods())




app.listen(8989,()=>{
    console.log('app is listening at 8989')
})