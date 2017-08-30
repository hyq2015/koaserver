
let mongoose=require('mongoose')

let Codemodel=mongoose.model('codetemplate')
let xss=require('xss')

exports.addTemplate=async (ctx,next)=>{
    //post方法
    let body=ctx.request.body;
    if(!body.name || !body.template){
        ctx.status=400;
        ctx.body={
            message:'缺少必填字段'
        }
        return
       
    }else{
        let template=null;
        try {
            template=await new Codemodel({
                name:body.name,
                template:body.template
            }).save();
            ctx.status=200;
            ctx.body={
                data:template
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

exports.queryList=async (ctx,next)=>{
    let pageSize=10;
    let page=1;
    console.log(ctx.query);//获取GET方法请求参数
    if(ctx.query.pageSize && ctx.query.pageNo){
        pageSize=Number(ctx.query.pageSize)
        page=Number(ctx.query.pageNo)
    }
    let templateList=null;
    try {
        templateList=await Codemodel.find().limit(pageSize).skip((page-1)*pageSize);
        ctx.status=200;
        ctx.body={
            data:templateList
        }
        return
    } catch (e) {
        console.log(e.message)
        ctx.throw(500,e.message)
        
    }
}