let mongoose=require('mongoose')
let Tripcard=mongoose.model('tripcard')
let xss=require('xss');
exports.addCard=async(ctx,next)=>{
    let body=ctx.request.body;
    if(!body.desc || !body.imgurl){
        ctx.status=400;
        ctx.body={
            message:'缺少必填字段'
        };

    }else{
        let card=null;
        try {
            let currentUser=ctx.currentUser;
            console.log('当前用户---------------')
            console.log(currentUser)
            /*
            * 存储卡片的时候,先要去查询这条卡片是不是当年的最后一条,如果是,需要打上标签 yearLastTag=>true
            * 每一年的最后一条记录才打上标签
            * */
            let year=new Date().getFullYear();
            let oldCardList=await Tripcard.update({year:year,yearLastTag:true},{$set:{yearLastTag:false}},{multi:true});
            console.log('老记录------------')
            console.log(oldCardList)
            let saveObj={
                desc:body.desc,
                imgurl:body.imgurl,
                creator:currentUser,
                yearLastTag:true
            };
            card=await new Tripcard(saveObj).save();
            ctx.status=200;
            ctx.body={
                data:card
            }
        } catch (e) {
            ctx.status=500;
            ctx.body={
                message:e.message
            }

        }
    }
};

exports.getCardList=async (ctx,next)=>{
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
        };
        return
    }
    let cardList=null;
    let currentUser=ctx.currentUser;
    try {
        /*
        * 逆序查询,时间最近的最先返回
        * **/
        // let totalCount=await Tripcard.count();
        // skip((page-1)*pageSize)
        cardList=await Tripcard.find({'creator._id':currentUser._id})
            .skip((page-1)*pageSize)
            .sort({creation:-1})
            .limit(pageSize);

        ctx.status=200;
        ctx.body={
            data:cardList
        }
    } catch (e) {
        console.log(e.message)
        ctx.throw(500,e.message)

    }
}

