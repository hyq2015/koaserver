
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
    if(!body.password || !body.mobile || !body.nickname){
        ctx.status=400;
        ctx.body={
            message:'缺少必填字段'
        }
        return
       
    }
    let mobile=body.mobile;
    let password=body.password;
    let nickname=body.nickname;
    let returnBody={};
    if(mobile){
        returnBody=await User.findOne({
            mobile:xss(mobile),
            password:xss(password),
            nickname:xss(nickname)
        })
        if(returnBody && returnBody.mobile){
            ctx.session.user=body;
            ctx.status=200;
            ctx.body={
                message:'登录成功'
            }
            return
            
        }else{
            let user=null;
            try {
                user=await new User({
                    mobile:mobile,
                    password:body.password,
                    nickname:body.nickname
                }).save();
                ctx.session.user=user;
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

exports.UserLogout=async function(ctx,next){
    let user=ctx.session.user;
    console.log('当前用户:'+JSON.stringify(user))
    
    if(user){
        ctx.session.user=null;
        ctx.status=200;
        ctx.body={
            message:'退出成功'
        }
        return
    }else{
        ctx.status=400;
        ctx.body={
            message:'你还没登录呢'
        }
        return
    }
}