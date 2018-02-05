let mongoose=require('mongoose');
let Dog=mongoose.model('dog');
exports.addDog=async(ctx,next)=>{
    let body=ctx.request.body;
    if(!body.intro || !body.type){
        ctx.status=400;
        ctx.body={
            message:'缺少必填字段'
        }

    }else{
        let dog=null;
        try {
            // dog=await new Dog({
            //     intro:body.intro,
            //     type:body.type
            // }).save();
            dog=await Dog.create({
                intro:body.intro,
                type:body.type
            })
            ctx.status=200;
            ctx.body={
                data:dog
            }
        } catch (e) {
            console.log(e.message)
            ctx.status=500;
            ctx.body={
                message:e.message
            }
        }
    }
};
exports.removeDog=async(ctx,next)=>{
    let body=ctx.request.body;
    if(!body.id){
        ctx.status=400;
        ctx.body={
            message:'缺少必填字段'
        }

    }else{
        let dog=null;
        try {
            dog=await Dog.remove({
                _id:body.id,
            })
            ctx.status=200;
            ctx.body={
                data:dog
            }
        } catch (e) {
            console.log(e.message)
            ctx.status=500;
            ctx.body={
                message:e.message
            }
        }
    }
};
exports.updateDog=async(ctx,next)=>{
    let body=ctx.request.body;
    if(!body.id || !body.type){
        ctx.status=400;
        ctx.body={
            message:'缺少必填字段'
        }

    }else{
        let dog=null;
        try {
            dog=await Dog.update({
                _id:body.id,
            },{$set:{type:body.type,intro:body.intro}})
            ctx.status=200;
            ctx.body={
                data:dog
            }
        } catch (e) {
            console.log(e.message)
            ctx.status=500;
            ctx.body={
                message:e.message
            }
        }
    }
};
