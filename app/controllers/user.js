
let mongoose=require('mongoose')

let User=mongoose.model('user')
let xss=require('xss')


exports.getList=async function(ctx,next){
    let pageSize=10;
    let page=1;
    console.log(ctx.query);//获取GET方法请求参数
    if(ctx.query.pageSize && ctx.query.pageNo){
        pageSize=Number(ctx.query.pageSize)
        page=Number(ctx.query.pageNo)
    }else{
        
        ctx.status=400;
        ctx.body={
            message:'缺少请求参数'
        }
        return
    }
    let userList=null;
    try {
        userList=await User.find().limit(pageSize).skip((page-1)*pageSize);
        ctx.status=200;
        ctx.body={
            data:userList
        }
        return
    } catch (e) {
        console.log(e.message)
        ctx.throw(500,e.message)
        
    }
}
exports.addUser=async function(ctx,next){
    console.log(ctx.request.body);//获取POST请求参数
    let body=ctx.request.body;
    if(!body.openid || !body.mobilePhone || !body.nickname){
        ctx.status=400;
        ctx.body={
            message:'缺少必填字段'
        }
        return
       
    }
    let openid=ctx.request.body.openid;
    let returnBody={};
    if(openid){
        returnBody=await User.findOne({
            openid:xss(openid)
        })
        if(returnBody && returnBody.openid){
            ctx.status=400;
            ctx.body={
                message:'此用户已经存在'
            }
            return
            
        }else{
            let user=null;
            try {
                user=await new User({
                    openid:openid,
                    mobilePhone:body.mobilePhone,
                    nickname:body.nickname
                }).save();
                ctx.status=200;
                ctx.body={
                    data:user
                }
                return
            } catch (e) {
                console.log(e.message)
                ctx.status=500;
                ctx.body={
                    message:e.message
                }
                return
                
            }
        }
    }
   
    
    
}