//使用mongoose连接mongodb,并建立用户模型
const mongoose=require('mongoose');
let moment=require('moment');

let StatisticSchema=new mongoose.Schema({
    phone:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    roomNumber:{
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
});


StatisticSchema.pre('save', function (next) {
    if (this.isNew) {
        this.updateDate = this.creation = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    } else {
        this.updateDate = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    }
    next()
});

let StatisticModel=mongoose.model('statistic',StatisticSchema);

module.exports=StatisticModel;