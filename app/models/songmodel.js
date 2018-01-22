//使用mongoose连接mongodb,并建立用户模型
const mongoose = require('mongoose');
let moment = require('moment');
let SongSchema = new mongoose.Schema({
    name: String,
    url: String,
    singer: String,
    creation: {
        type: String,
        default: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
    },
    updateDate: {
        type: String,
        default: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
    }
});
SongSchema.add({
    author: {
        type: Object,
        required: true
    }
});

SongSchema.pre('save', function (next) {
    if (this.isNew) {
        this.updateDate = this.creation = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    } else {
        this.updateDate = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    }
    next()
});

let SongModel = mongoose.model('song', SongSchema);

module.exports = SongModel;