let Router=require('koa-router')
let User=require('../app/controllers/user')
let Movie=require('../app/controllers/movies')
let Codetemplate=require('../app/controllers/codetemplateController')
let Middlewares=require('../app/middlewares/middleware')
let Qiniu=require('../app/controllers/qiniu')
module.exports=function(){
    let router = new Router({
        prefix: '/api'
    });
    // router.get('/user/list',Middlewares.hasToken,User.getList)
    router.get('/user/list',User.getList)
    router.post('/user/add',User.addUser)
    router.post('/movie/add',Movie.addMovie)
    router.get('/movie/list',Movie.queryList)
    router.post('/codetemplate/add',Codetemplate.addTemplate)
    router.get('/codetemplate/list',Codetemplate.queryList)
    router.get('/uptoken',Qiniu.uptoken)
    return router
}