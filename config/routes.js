let Router = require('koa-router');
let User = require('../app/controllers/user');
let Movie = require('../app/controllers/movies');
let Codetemplate = require('../app/controllers/codetemplateController');
let Middlewares = require('../app/middlewares/middleware');
let Qiniu = require('../app/controllers/qiniu');
let Song = require('../app/controllers/songs');
let Album = require('../app/controllers/albums');
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
    router.get('/user/list', User.getList)
    router.post('/user/login', User.userLogin)
    router.post('/user/signin', User.addUser)
    router.get('/user/logout', User.UserLogout)
    router.post('/user/update', User.UserUpodate)
    router.get('/user/current', User.getCurrentUser)

    router.post('/movie/add', Movie.addMovie)
    router.get('/movie/list', Movie.queryList)

    router.post('/codetemplate/add', Codetemplate.addTemplate)
    router.post('/codetemplate/update', (ctx, next) => Middlewares.findRecord(ctx, next, 'codetemplate'), Codetemplate.updateTemplate)
    router.get('/codetemplate/list', Middlewares.optionRequest, Codetemplate.queryList)

    router.post('/song/add', Song.addSong)
    router.get('/song/list', Song.songList)

    router.get('/uptoken', Qiniu.uptoken)

    //相册
    router.post('/album/add', Album.addAlbum)
    router.get('/album/list', Album.getAlbumList)

    //还可以是用ReadStream，更简单
    router.get('/', (ctx, next) => {
        ctx.type = 'html';
        ctx.body = fs.createReadStream('/index.html');

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
    });
    router.get('/currentUser', (ctx, next) => {
        let code = ctx.query.code;
        let tokenURL = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + WX.AppID + '&secret=' + WX.AppSecret + '&code=' + code + '&grant_type=authorization_code';
        axios.get(tokenURL).then((res)=>{
            ctx.status = 200;
            ctx.body = res;
        }).catch((err)=>{
            console.error(e);
            ctx.status = 400;
            ctx.body = {
                message: '获取用户信息失败'
            };
        })

    });
    return router
}