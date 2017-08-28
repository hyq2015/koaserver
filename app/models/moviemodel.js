//使用mongoose连接mongodb,并建立用户模型
const mongoose=require('mongoose');
let MovieSchema=new mongoose.Schema({
    name:String,
    releaseTime:String,
    imgurl:String,
    score:String,
    downloadurl:String,
    desc:String,
    tag:String,
    creation:{
        type:Date,
        default:Date.now()
    },
    updateDate:{
        type:Date,
        default:Date.now()
    }
})
MovieSchema.pre('save',(next)=>{
    if(!this.isNew){
        this.updateDate=Date.now()
    }
    next()
})

let MovieModel=mongoose.model('movie',MovieSchema);

module.exports=MovieModel