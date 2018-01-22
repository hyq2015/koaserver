//使用mongoose连接mongodb,并建立用户模型
const mongoose=require('mongoose');
let moment=require('moment');

let MovieSchema=new mongoose.Schema({
    name:String,
    releaseTime:String,
    imgurl:String,
    score:String,
    downloadurl:String,
    desc:String,
    tag:String,
    creation:{
        type:String,
        default:moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
    },
    updateDate:{
        type:String,
        default:moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
    }
});
MovieSchema.add({
    author:{
        type:Object,
        required:true
    }
});


MovieSchema.pre('save', function (next) {
    if (this.isNew) {
        this.updateDate = this.creation = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    } else {
        this.updateDate = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    }
    next()
});

let MovieModel=mongoose.model('movie',MovieSchema);

module.exports=MovieModel;