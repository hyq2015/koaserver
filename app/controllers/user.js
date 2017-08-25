
let mongoose=require('mongoose')

let User=mongoose.model('user')
let xss=require('xss')


exports.getList=async function(ctx,next){
    ctx.body={
        user:'ricky'
    }
}
exports.addUser=async function(ctx,next){
    let openid=ctx.query.openid;
    let returnBody={};
    if(openid){
        User.findOne({
            openid:xss(openid)
        },(err,doc)=>{
            console.log(err)
            if(!doc){
                console.log('没找到')
                let user=new User({
                    openid:'1234567'
                })
                user.save(function(err1,newuser){
                    if(err1){
                        console.log('出错啦')
                        returnBody={
                            msg:'error'
                        }
                    }else{
                        console.log('保存成功')
                        returnBody={
                            msg:'ok'
                        }
                    }
                    return returnBody
                })
                
                
            }else{
                console.log('找到了')
                returnBody={
                    msg:'存在相同用户'
                }
                return returnBody
                
            }
        })

    }
   
    
    
}