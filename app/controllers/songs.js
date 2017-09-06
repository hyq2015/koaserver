
let mongoose=require('mongoose')

let Song=mongoose.model('song')
let xss=require('xss')

exports.addSong=async (ctx,next)=>{
    let body=ctx.request.body;
    if(!body.name || !body.url || !body.singer){
        ctx.status=400;
        ctx.body={
            message:'缺少必填字段'
        }
        return
       
    }else{
        let song=null;
        try {
            song=await new Song({
                name:body.name,
                url:body.url,
                singer:body.singer
            }).save();
            ctx.status=200;
            ctx.body={
                data:song
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

exports.songList=async (ctx,next)=>{
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
    let songList=null;
    try {
        songList=await Song.find().limit(pageSize).skip((page-1)*pageSize);
        ctx.status=200;
        ctx.body={
            data:songList
        }
        return
    } catch (e) {
        console.log(e.message)
        ctx.throw(500,e.message)
        
    }
}