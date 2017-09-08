//使用mongoose连接mongodb,并建立用户模型
const mongoose=require('mongoose');
let UserSchema=new mongoose.Schema({
    mobile:{
        type:String,
        required:true
    },
    nickname:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    bgmusic:String,
    creation:{
        type:Date,
        default:Date.now()
    },
    updateDate:{
        type:Date,
        default:Date.now()
    }
})
//添加新的属性
UserSchema.add({
    avatar:{
        type:String
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