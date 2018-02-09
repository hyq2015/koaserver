var qiniu = require("qiniu");
//要上传的空间
const bucket = 'ricky-cloud';

var accessKey = 'jOBrvqdxKlPuT_lQv5vWrXNBIEmsSdTPBTNrghem';
var secretKey = 'Dbytj5brH5OwyWljaRFWapnvl3RPUVlanxMUF3OD';

var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

var options = {
    scope: bucket,
    expires: 7200
};

//需要填写你的 Access Key 和 Secret Key
qiniu.conf.ACCESS_KEY = 'jOBrvqdxKlPuT_lQv5vWrXNBIEmsSdTPBTNrghem';
qiniu.conf.SECRET_KEY = 'Dbytj5brH5OwyWljaRFWapnvl3RPUVlanxMUF3OD';

// qiniu.conf.ACCESS_KEY = 'GbVfDHIxe3lhK08WqKUkvZ-kpKPjKEqzSfZIUzhj';
// qiniu.conf.SECRET_KEY = 'F5ATI5AiToq-ztffL8q_6XPjnW-RrVCkD8oxMaUC';

//构建上传策略函数
//上传到七牛后保存的文件名
const key = 'my-nodejs-logo.txt';
exports.uptoken=function(ctx,next){
    let putPolicy = new qiniu.rs.PutPolicy(options);
    let uploadToken=putPolicy.uploadToken(mac);
    ctx.status=200;
    ctx.body={
        token:uploadToken
    }
};
