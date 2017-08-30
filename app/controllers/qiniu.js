var qiniu = require("qiniu");
//要上传的空间
const bucket = 'grocery';

var accessKey = 'A3JJR0Mk7IwivsYAbpF1JVAOQbNqE2kRV3GnfEBB';
var secretKey = '9uc6zap2ZafoA8C13ZpSPg7v-YvKJ5meG_mouHMz';

var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

var options = {
    scope: bucket,
    expires: 7200
  };

//需要填写你的 Access Key 和 Secret Key
qiniu.conf.ACCESS_KEY = 'A3JJR0Mk7IwivsYAbpF1JVAOQbNqE2kRV3GnfEBB';
qiniu.conf.SECRET_KEY = '9uc6zap2ZafoA8C13ZpSPg7v-YvKJ5meG_mouHMz';

// qiniu.conf.ACCESS_KEY = 'GbVfDHIxe3lhK08WqKUkvZ-kpKPjKEqzSfZIUzhj';
// qiniu.conf.SECRET_KEY = 'F5ATI5AiToq-ztffL8q_6XPjnW-RrVCkD8oxMaUC';

//构建上传策略函数
//上传到七牛后保存的文件名
const key = 'my-nodejs-logo.txt';
exports.uptoken=function(ctx,next){
    let putPolicy = new qiniu.rs.PutPolicy(options);
    let uploadToken=putPolicy.uploadToken(mac)
    ctx.status=200;
    ctx.body={
        data:{
            token:uploadToken
        }
    }
    return
}
