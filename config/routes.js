let Router=require('koa-router')
let User=require('../app/controllers/user')
let Movie=require('../app/controllers/movies')
let Codetemplate=require('../app/controllers/codetemplateController')
let Middlewares=require('../app/middlewares/middleware')
let Qiniu=require('../app/controllers/qiniu')
let Song=require('../app/controllers/songs')
module.exports=function(){
    let router = new Router({
        prefix: '/api'
    });
    // router.get('/user/list',Middlewares.hasToken,User.getList)
    router.get('/user/list',User.getList)
    router.post('/user/add',User.addUser)
    router.get('/user/logout',User.UserLogout)
    router.post('/user/update',User.UserUpodate)
    router.get('/user/current',User.getCurrentUser)

    router.post('/movie/add',Movie.addMovie)
    router.get('/movie/list',Movie.queryList)

    router.post('/codetemplate/add',Codetemplate.addTemplate)
    router.post('/codetemplate/update',(ctx,next)=>Middlewares.findRecord(ctx,next,'codetemplate'),Codetemplate.updateTemplate)
    router.get('/codetemplate/list',Middlewares.optionRequest,Codetemplate.queryList)

    router.post('/song/add',Song.addSong)
    router.get('/song/list',Song.songList)

    router.get('/uptoken',Qiniu.uptoken)
    return router
}