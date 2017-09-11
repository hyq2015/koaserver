
let mongoose=require('mongoose')
let moment=require('moment');

let Codemodel=mongoose.model('codetemplate')
let defaultKeys=Codemodel.schema.obj;

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
                template:body.template,
                author:{
                    mobile:ctx.session.user.mobile,
                    _id:ctx.session.user._id,
                    nickname:ctx.session.user.nickname
                }
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

exports.updateTemplate=async(ctx,next)=>{//更新模板
    //post方法
    let returnBody=ctx.currentRecord[0];
    let body=ctx.request.body;
    let template=null;
    let updateObj={};
    for(let key in defaultKeys){
        for(let cominkey in body){
            if(key==cominkey){
                updateObj[key]=body[cominkey]
                returnBody[key]=body[cominkey]
            }
        }
    }
    updateObj.updateDate=moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    returnBody.updateDate=moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    try {
        template=await Codemodel.update({_id:body.id},updateObj)
        ctx.status=200;
        ctx.body={
            data:returnBody
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
        if(!ctx.query.key){
            templateList=await Codemodel.find({'author._id':ctx.session.user._id}).limit(pageSize).skip((page-1)*pageSize);
        }else{
            templateList=await Codemodel.find({name:new RegExp(ctx.query.key),'author._id':ctx.session.user._id}).limit(pageSize).skip((page-1)*pageSize);
        }
        
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
