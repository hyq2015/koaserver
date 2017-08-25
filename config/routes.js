let Router=require('koa-router')
let User=require('../app/controllers/user')
module.exports=function(){
    let router = new Router({
        prefix: '/app'
    });
    router.get('/user/list',User.getList)
    router.get('/user/add',async (ctx,next)=>{
        let data=await User.addUser(ctx,next);
        console.log(data);
        ctx.body=data;
    })
    return router
}