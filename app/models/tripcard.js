//使用mongoose连接mongodb,并建立用户模型
const mongoose=require('mongoose');
let moment=require('moment');

let TripCardSchema=new mongoose.Schema({
    desc:String,
    imgurl:String,
    creator:Object,
    creation:{
        type:String,
        default:moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
    },
    updateDate:{
        type:String,
        default:moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
    }
});
TripCardSchema.add({
    yearLastTag:Boolean,
    creationDesc:{
        type:String,
        default:moment(Date.now()).format('M')+'月'+moment(Date.now()).format('D')+'日'
    },
    year:{
        type:String,
        default:moment(Date.now()).format('YYYY')
    }
});

TripCardSchema.pre('save', function (next) {
    if (this.isNew) {
        this.updateDate = this.creation = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    } else {
        this.updateDate = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    }
    next()
});

let TripCardSchemaModel=mongoose.model('tripcard',TripCardSchema);

module.exports=TripCardSchemaModel;