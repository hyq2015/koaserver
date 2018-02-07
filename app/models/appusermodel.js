//使用mongoose连接mongodb,并建立用户模型
const mongoose=require('mongoose');
let moment=require('moment');

let AppUserSchema=new mongoose.Schema({
    avatarUrl:String,
    city:String,
    country:String,
    gender:Number,
    nickName:String,
    province:String,
    creation:{
        type:String,
        default:moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
    },
    updateDate:{
        type:String,
        default:moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
    },
    openid:String,
    lastLoginTime:String
});

AppUserSchema.pre('save', function (next) {
    if (this.isNew) {
        this.updateDate = this.creation = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    } else {
        this.updateDate = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    }
    next()
});

let AppUserSchemaModel=mongoose.model('appuser',AppUserSchema);

module.exports=AppUserSchemaModel;