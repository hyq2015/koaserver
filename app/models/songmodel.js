//使用mongoose连接mongodb,并建立用户模型
const mongoose=require('mongoose');
let SongSchema=new mongoose.Schema({
    name:String,
    url:String,
    singer:String,
    creation:{
        type:Date,
        default:Date.now()
    },
    updateDate:{
        type:Date,
        default:Date.now()
    }
})
SongSchema.pre('save',(next)=>{
    if(!this.isNew){
        this.updateDate=Date.now()
    }
    next()
})

let SongModel=mongoose.model('song',SongSchema);

module.exports=SongModel