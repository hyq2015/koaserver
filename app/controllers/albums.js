let mongoose=require('mongoose')

let Album=mongoose.model('album')
let xss=require('xss')
exports.addAlbum=async(ctx,next)=>{
    let body=ctx.request.body;
    if(!body.intro || !body.imgurl){
        ctx.status=400;
        ctx.body={
            message:'缺少必填字段'
        }
        return
       
    }else{
        let album=null;
        try {
            album=await new Album({
                intro:body.intro,
                imgurl:body.imgurl,
                author:{
                    mobile:ctx.session.user.mobile,
                    _id:ctx.session.user._id,
                    nickname:ctx.session.user.nickname
                }
            }).save();
            ctx.status=200;
            ctx.body={
                data:album
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

exports.getAlbumList=async (ctx,next)=>{
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
    let albumList=null;
    try {
        albumList=await Album.find().limit(pageSize).skip((page-1)*pageSize);
        ctx.status=200;
        ctx.body={
            data:albumList
        }
        return
    } catch (e) {
        console.log(e.message)
        ctx.throw(500,e.message)
        
    }
}