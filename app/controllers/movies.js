
let mongoose=require('mongoose')

let Movie=mongoose.model('movie')
let xss=require('xss')

exports.addMovie=async (ctx,next)=>{
    //post方法
    let body=ctx.request.body;
    if(!body.name || !body.releaseTime || !body.imgurl || !body.score || !body.downloadurl || !body.desc || !body.tag){
        ctx.status=400;
        ctx.body={
            message:'缺少必填字段'
        }
        return
       
    }else{
        let movie=null;
        try {
            movie=await new Movie({
                name:body.name,
                releaseTime:body.releaseTime,
                imgurl:body.imgurl,
                score:body.score,
                downloadurl:body.downloadurl,
                tag:body.tag,
                desc:body.desc
            }).save();
            ctx.status=200;
            ctx.body={
                data:movie
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
    }else{
        ctx.status=400;
        ctx.body={
            message:'缺少请求参数'
        }
        return
    }
    let movieList=null;
    try {
        movieList=await Movie.find().limit(pageSize).skip((page-1)*pageSize);
        ctx.status=200;
        ctx.body={
            data:movieList
        }
        return
    } catch (e) {
        console.log(e.message)
        ctx.throw(500,e.message)
        
    }
}