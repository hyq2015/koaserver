//使用mongoose连接mongodb,并建立用户模型
const mongoose=require('mongoose');
let moment=require('moment');

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
        type:String,
        default:moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
    },
    updateDate:{
        type:String,
        default:moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
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
        this.updateDate=moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
    }
    next()
})

let CodetemplateModel=mongoose.model('codetemplate',CodetemplateSchema);

module.exports=CodetemplateModel