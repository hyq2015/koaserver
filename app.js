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
let app=new koa()

let router=require('./config/routes')()
app.keys=['genwoshua'];//会话中间件cookie-session加密
app.use(logger())
app.use(session(app))
app.use(bodyParser())

app.use(router.routes())
    .use(router.allowedMethods())



app.listen(3000,()=>{
    console.log('app is listening at 3000')
})