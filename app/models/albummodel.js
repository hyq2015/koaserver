//使用mongoose连接mongodb,并建立用户模型
const mongoose=require('mongoose');
let moment=require('moment');

let AlbumSchema=new mongoose.Schema({
    intro:String,
    imgurl:String,
    author:Object,
    creation:{
        type:String,
        default:moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
    },
    updateDate:{
        type:String,
        default:moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
    }
});
AlbumSchema.add({
    author:{
        type:Object,
        required:true
    }
});

AlbumSchema.pre('save', function (next) {
    if (this.isNew) {
        this.updateDate = this.creation = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    } else {
        this.updateDate = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    }
    next()
});

let AlbumSchemaModel=mongoose.model('album',AlbumSchema);

module.exports=AlbumSchemaModel;