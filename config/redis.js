const redis=require('redis');
let redis_config = {
    "host": "",
    "port": 6379
};
let client=redis.createClient(redis_config);
client.on('connect', function () {
    client.set('REDIS_TEST', 'REDIS存储测试', redis.print)
    client.get('REDIS_TEST', redis.print)
});
client.getKey=function (key) {
    return new Promise((resolve,reject)=>{
        client.get(key,function (err,res) {
            if(err){
                reject (err)
            }else{
                resolve(JSON.parse(res))
            }

        })
    })

};
client.setKey=function (key,val) {
    return new Promise((resolve,reject)=>{
        client.set(key,JSON.stringify(val),function (err,res) {
            if(err){
                reject (err)
            }else{
                resolve(res)
            }

        })
    })
};
module.exports=client;