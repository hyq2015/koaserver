let Router = require('koa-router');
let User = require('../app/controllers/user');
let Movie = require('../app/controllers/movies');
let Codetemplate = require('../app/controllers/codetemplateController');
let Middlewares = require('../app/middlewares/middleware');
let Qiniu = require('../app/controllers/qiniu');
let Song = require('../app/controllers/songs');
let Album = require('../app/controllers/albums');
let Dog = require('../app/controllers/dog');
let Statistic = require('../app/controllers/statistics');
let AppUser = require('../app/controllers/appuser');
const fs = require('fs');
let crypto = require('crypto');
let WX = require('./wx');
let axios = require('axios')

module.exports = function () {
    // let router = new Router({
    //     prefix: '/api'
    // });
    let router = new Router();
    // router.get('/user/list',Middlewares.hasToken,User.getList)
    router.get('/api/user/list', User.getList)
    router.post('/api/user/login', User.userLogin)
    router.post('/api/user/signin', User.addUser)
    router.get('/api/user/logout', User.UserLogout)
    router.post('/api/user/update', User.UserUpodate)
    router.get('/api/user/current', User.getCurrentUser)

    router.post('/api/movie/add', Movie.addMovie)
    router.get('/api/movie/list', Movie.queryList)

    router.post('/api/codetemplate/add', Codetemplate.addTemplate)
    router.post('/api/codetemplate/update', (ctx, next) => Middlewares.findRecord(ctx, next, 'codetemplate'), Codetemplate.updateTemplate)
    router.get('/api/codetemplate/list', Middlewares.optionRequest, Codetemplate.queryList)

    router.post('/api/song/add', Song.addSong)
    router.get('/api/song/list', Song.songList)

    router.get('/api/uptoken', Qiniu.uptoken)
    router.get('/app/api/uptoken', Qiniu.uptoken)

    //相册
    router.post('/api/album/add', Album.addAlbum)
    router.get('/api/album/list', Album.getAlbumList)

    //狗狗
    router.post('/api/dog/add', Dog.addDog)
    router.post('/api/dog/remove', Dog.removeDog)
    router.post('/api/dog/update', Dog.updateDog)

    //维权统计
    router.post('/statistic',Statistic.addAuthUser)

    //还可以是用ReadStream，更简单
    router.get('/baiyue', (ctx, next) => {
        console.log('进入我的这个应用了')
        ctx.type = 'html';
        ctx.body = fs.createReadStream('./dist/index.html');//以根目录为根路径

    })
    router.get('/wechat', (ctx, next) => {

        // 获取微信的请求,注意是 get
        let signature = ctx.query.signature;
        let echostr = ctx.query.echostr;
        let timestamp = ctx.query.timestamp;
        let nonce = ctx.query.nonce;

        // 这里的token 要和你表单上面的token一致
        let token = 'fighterapp';

        // 根文档上面的,我们需要对这三个参数进行字典序排序
        let arr = [token, timestamp, nonce];
        arr.sort();
        let tmpStr = arr.join('');

        // 排序完成之后,需要进行sha1加密, 这里我们使用node.js 自带的crypto模块
        let sha1 = crypto.createHash('sha1');
        sha1.update(tmpStr);
        let resStr = sha1.digest('hex');
        console.log('进入了微信服务器验证!');
        console.log(signature, 'resStr: ', resStr);

        // 开发者获得加密后的字符串可与signature对比，标识该请求来源于微信,
        // 如果匹配,返回echoster , 不匹配则返回error
        if (resStr === signature) {
            ctx.body = echostr;
        } else {
            return false;
        }
    })
    router.get('/api/currentuser',async function (ctx, next){
        console.log('进入获取用户接口了')
        let code = ctx.query.code;
        console.log(code)
        let url='https://api.weixin.qq.com/sns/jscode2session?appid='+WX.AppID+'&secret='+WX.AppSecret+'&js_code='+code+'&grant_type=authorization_code';
        let res=await axios.get(url);
        console.log(res.data)
        ctx.status = 200;
        ctx.body = res.data;
        // axios.get(tokenURL).then((res)=>{
        //     ctx.status = 200;
        //     ctx.body = res;
        // }).catch((err)=>{
        //     console.error(err);
        //     ctx.status = 400;
        //     ctx.body = {
        //         message: '获取用户信息失败'
        //     };
        // })

    });
    router.get('/app/login',AppUser.userLogin);
    router.get('/app/currentUser',AppUser.currentUser);
    router.post('/app/userUpdate',AppUser.updateUser);
    //小程序
    return router
};