//使用mongoose连接mongodb,并建立用户模型
const mongoose=require('mongoose');
let UserSchema=new mongoose.Schema({
    openid:{
        unique:true,
        type:String
    },
    mobilePhone:String,
    nickname:String,
    headimgurl:String,
    creation:{
        type:Date,
        default:Date.now()
    },
    updateDate:{
        type:Date,
        default:Date.now()
    }
})
UserSchema.pre('save',(next)=>{
    if(!this.isNew){
        this.updateDate=Date.now()
    }
    next()
})

let UserModel=mongoose.model('user',UserSchema);

module.exports=UserModel