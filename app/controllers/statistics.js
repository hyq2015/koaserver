let mongoose=require('mongoose')
let Statistic=mongoose.model('statistic')
let xss=require('xss')

exports.addAuthUser=async(ctx,next)=>{
    let body=ctx.request.body;
    if(!body.phone || !body.name || !body.roomNumber){
        ctx.status=400;
        ctx.body={
            message:'请完善信息'
        }
        return

    }else{
        let phone=body.phone;
        let name=body.name;
        let roomNumber=body.roomNumber;
        try {
            let returnBody=await Statistic.findOne({
                phone:xss(phone),
                name:xss(name),
                roomNumber:xss(roomNumber)
            })
            if(returnBody && returnBody.phone && returnBody.roomNumber && returnBody.name){
                ctx.status=400;
                ctx.body={
                    message:'你的信息已经统计过了,请勿重复提交'
                }
                return
            }

        } catch (e) {
            console.log(e.message)
            ctx.throw(500,e.message)

        }
        let user=null;
        try {
            user=await new Statistic({
                phone:phone,
                name:name,
                roomNumber:roomNumber
            }).save();
            ctx.status=200;
            ctx.body={
                message:'提交成功!',
                user:user
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