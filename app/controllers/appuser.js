let axios = require('axios')
let mongoose=require('mongoose');
let AppUser=mongoose.model('appuser');
let xss=require('xss');
let moment=require('moment');
let WX = require('../../config/wx');


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
        console.log(ctx.session.user)
        ctx.status = 200;
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
exports.currentUser=async(ctx,next)=>{
    let user=ctx.session.user;
    ctx.status = 200;
    ctx.body ={
        user:user
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

