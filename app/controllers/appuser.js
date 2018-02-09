let axios = require('axios')
let mongoose=require('mongoose');
let AppUser=mongoose.model('appuser');
let xss=require('xss');
let moment=require('moment');
let WX = require('../../config/wx');
let cache=require('../../config/redis');
const uuidv4 = require('uuid/v4');
exports.userLogin=async(ctx,next)=>{
    let code = ctx.query.code;
    let url='https://api.weixin.qq.com/sns/jscode2session?appid='+WX.AppID+'&secret='+WX.AppSecret+'&js_code='+code+'&grant_type=authorization_code';
    let res=await axios.get(url);
    //查询是否有这个openid对应的记录
    let appUser=null;

    try {
        await AppUser.update({openid:xss(res.data.openid)},{lastLoginTime:moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')},{upsert:true,new:true});
        appUser=await AppUser.findOne({openid:xss(res.data.openid)});
        ctx.session.user=appUser;
        let uuid=uuidv4();
        await cache.setKey(uuid,appUser);
        ctx.status = 200;
        ctx.body ={
            user:appUser,
            token:uuid
        }
    }catch (e){
        ctx.status=500;
        ctx.body={
            message:e.message
        }
    }
};
exports.currentUser=async(ctx,next)=>{
    console.log('当前用户---------------------');
    let currentToken=ctx.cookies.get('SESSION');
    console.log(currentToken)
    let currentUser=await cache.getKey(currentToken);
    console.log(currentUser)
    ctx.status = 200;
    ctx.body ={
        user:currentUser
    }
};
exports.updateUser=async(ctx,next)=>{
    let user = ctx.request.body.user;
    let openid=ctx.request.body.openid;
    //查询是否有这个openid对应的记录
    let appUser=null;
    let updateObj={};
    updateObj.avatarUrl=user.avatarUrl;
    updateObj.city=user.city;
    updateObj.country=user.country;
    updateObj.province=user.province;
    updateObj.nickName=user.nickName;
    updateObj.lastLoginTime=moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    try {
        await AppUser.update({openid:xss(openid)},updateObj,{upsert:true,new:true});
        appUser=await AppUser.findOne({openid:xss(openid)});
        ctx.status = 200;
        ctx.session.user=appUser;
        ctx.body ={
            user:appUser
        }
    }catch (e){
        ctx.status=500;
        ctx.body={
            message:e.message
        }
    }
};

