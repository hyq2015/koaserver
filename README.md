#### README
##### koa mongodb mongoose koa-router
##### 新建一个schema
```
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

```
##### 路由实例
```
router.get('/api/user/list', User.getList)
exports.getList=async function(ctx,next){
    let pageSize=10;
    let page=1;
    console.log(ctx.query);//获取GET方法请求参数
    if(ctx.query.pageSize && ctx.query.pageNo){
        pageSize=Number(ctx.query.pageSize)
        page=Number(ctx.query.pageNo)
    }else{
        
        ctx.status=400;
        ctx.body={
            message:'缺少请求参数'
        }
        return
    }
    let userList=null;
    try {
        userList=await User.find().limit(pageSize).skip((page-1)*pageSize);
        ctx.status=200;
        ctx.body={
            data:userList
        }
        return
    } catch (e) {
        console.log(e.message)
        ctx.throw(500,e.message)
        
    }
}

```