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