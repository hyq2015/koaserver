'use strict'
//加载所有表,在mongodb中建模
// let port='8989';
// let port='80';
let port='443';
const fs=require('fs')
const path=require('path')
const mongoose=require('mongoose')
const DB='mongodb://localhost/gen_db'
//连接数据库
mongoose.Promise=require('bluebird')
mongoose.connect(DB,{useMongoClient:true})
const enforceHttps = require('koa-sslify');
let db = mongoose.connection;
db.on('error', function(){
    console.log('connection error:')
});
db.once('open', function() {
    console.log("we're connected!")
  // we're connected!
});

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


const http=require('http');
const https=require('https');
const koa=require('koa')
const logger=require('koa-logger')
const session=require('koa-session')
const bodyParser=require('koa-bodyparser')
const cors=require('koa-cors')
let app=new koa();
// let server = require('http').Server(app.callback());
// let io = require('socket.io')(server);
// let serve = require('koa-static');
// app.use(serve('/'));

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
app.use(enforceHttps());
//配置静态资源请求路径
app.use(require('koa-static')(__dirname+'/dist/'));
const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/www.r1992.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/www.r1992.com/cert.pem')
};
app.use(async (ctx,next) => {
    let user=ctx.session.user;
    let url=ctx.request.url;
    console.log(url)
    // if(url.indexOf('/baiyue/statistic')!=-1){
    //     return next()
    // }else
    // if(url.indexOf('/user/login')==-1 && url.indexOf('/user/logout')==-1 && url.indexOf('/user/signin')==-1 && url.indexOf('/currentuser')==-1 && url.indexOf('statistic')==-1){
    //     if(!user){
    //         console.log('未登录')
    //         ctx.status=403;
    //         ctx.body={
    //             message:'请登录'
    //         };
    //         // ctx.type = 'html';
    //         // ctx.status=403;
    //         // ctx.body = fs.createReadStream('./dist/index.html');
    //         return
    //     }
    // }
    if(url.indexOf('/app/login')==-1 && url.indexOf('/app/currentUser')==-1){
        if(!user){
            ctx.status=403;
            ctx.body={
                message:'请登录'
            };
            return
        }
    }
    return next()
});
app.use(router.routes())
    .use(router.allowedMethods())


http.createServer(app.callback()).listen(80,()=>{
    console.log('http is listening at 80')
});
https.createServer(options,app.callback()).listen(port,()=>{
    console.log('https is listening at'+port)
});
// app.listen(port,()=>{
//     console.log('app is listening at'+port)
// })
