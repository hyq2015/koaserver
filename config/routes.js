let Router=require('koa-router')
let User=require('../app/controllers/user')
module.exports=function(){
    let router = new Router({
        prefix: '/app'
    });
    router.get('/user',User.getList)
    return router
}