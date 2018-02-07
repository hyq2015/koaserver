let axios = require('axios')
let mongoose=require('mongoose');
let AppUser=mongoose.model('appuser');
let xss=require('xss');
let moment=require('moment');
let WX = require('../../config/wx');


exports.userLogin=async(ctx,res)=>{
    let code = ctx.query.code;
    let url='https://api.weixin.qq.com/sns/jscode2session?appid='+WX.AppID+'&secret='+WX.AppSecret+'&js_code='+code+'&grant_type=authorization_code';
    let res1=await axios.get(url);
    //查询是否有这个openid对应的记录
    let appUser=null;
    try {
        // appUser=await
        AppUser.update({openid:xss(res1.data.openid)},{lastLoginTime:moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')},{upsert:true,new:true})
            .lean().exec((err,doc)=>{
            if(err){
                ctx.status=500;
                ctx.body={
                    message:err
                }
            }else{
                return res.end(JSON.stringify(doc));
                // ctx.status = 200;
                // ctx.body ={
                //     user:doc
                // }
            }
        });

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
