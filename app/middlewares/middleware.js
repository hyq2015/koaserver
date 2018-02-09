let mongoose=require('mongoose');
let cache=require('../../config/redis');

exports.hasToken=async (ctx,next)=>{
    if(!ctx.query.token){
        ctx.status=400;
        ctx.body={
            msg:'error',
            data:'缺少token参数'
        }
        return
        
    }
    return next()
}
exports.optionRequest=async(ctx,next)=>{
    console.log('请求方法为:'+ctx.method)
    if(ctx.method=='OPTIONS'){
        ctx.status=200;
        return
    }
    return next()
}

exports.findRecord=async(ctx,next,modelname)=>{
    if(!ctx.request.body.id){
        ctx.status=400;
        ctx.body={
            message:'请传入id'
        }
        return
    }
    console.log('表名称:'+modelname)
    let existedRecord;
    
    try {
        await mongoose.model(modelname).find({_id:ctx.request.body.id},function(err,doc){
            ctx.currentRecord=doc;
            if(err){
                console.log(err.message)
            }else{
                ctx.currentRecord=doc;
                
            }
        })
        return next()
        // console.log(existedRecord.toObject())
        
    } catch (e) {
        ctx.status=500;
        ctx.body={
            message:e.message
        }
        return
        
    }
    
}

exports.validateLogin=async(ctx,next)=>{
    let currentToken=ctx.cookies.get('SESSION');
    if(!currentToken){
        ctx.status=403;
        ctx.body={
            message:'请登录'
        };
    }else{
        let currentUser=await cache.getKey(currentToken);
        ctx.currentUser=currentUser;
        return next()
    }
};