const redis=require('redis');
let client=redis.createClient();
client.on('connect', function () {
    client.set('REDIS_TEST', 'REDIS存储测试', redis.print)
    client.get('REDIS_TEST', redis.print)
})
client.getKey=function (key) {
    client.get(key,function (err,res) {
        if(err){
            return '没有结果'
        }else{
            return res
        }

    })
};
client.setKey=function (obj) {
    client.set(obj.key,obj.value,function (err,res) {
        if(err){
            return '存储失败'
        }else{
            return res
        }

    })
};
module.exports=client;