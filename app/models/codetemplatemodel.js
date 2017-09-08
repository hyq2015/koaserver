//使用mongoose连接mongodb,并建立用户模型
const mongoose=require('mongoose');
let CodetemplateSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    template:{
        type:String,
        required:true
    },
    creation:{
        type:Date,
        default:Date.now()
    },
    updateDate:{
        type:Date,
        default:Date.now()
    }
})
CodetemplateSchema.add({
    author:{
        type:Object,
        required:true
    }
})
CodetemplateSchema.pre('save',(next)=>{
    if(!this.isNew){
        this.updateDate=Date.now()
    }
    next()
})

let CodetemplateModel=mongoose.model('codetemplate',CodetemplateSchema);

module.exports=CodetemplateModel