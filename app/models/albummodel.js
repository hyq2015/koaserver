//使用mongoose连接mongodb,并建立用户模型
const mongoose=require('mongoose');
let AlbumSchema=new mongoose.Schema({
    intro:String,
    imgurl:String,
    author:Object,
    creation:{
        type:Date,
        default:Date.now()
    },
    updateDate:{
        type:Date,
        default:Date.now()
    }
})
AlbumSchema.pre('save',(next)=>{
    if(!this.isNew){
        this.updateDate=Date.now()
    }
    next()
})

let AlbumSchemaModel=mongoose.model('album',AlbumSchema);

module.exports=AlbumSchemaModel