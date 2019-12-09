const Router=require("koa-router");
const router = new Router();
const bcrypt=require("bcryptjs");
// 引入User
const User=require('./../../models/User');

/*
 @route api/users/test
*/
router.get("/test",async ctx=>{
    ctx.status=200;
    ctx.body={msg:"hello world"}

})

/*
注册接口
*/
router.post('/register',async ctx=>{
    /*
    @  为什么输出ctx.request上没有 body  key 值？
    就是数据从接收到挂在 ctx.request.body 都在 Promise 中执行，
    是因为在接收数据的操作是异步的，整个处理数据的过程需要等待异步完成后，
    再把数据挂在 ctx.request.body 上，可
    以保证我们在下一个 use 的 async 函数中可以在 ctx.request.body 上拿到数据，
    所以我们使用 await 等待一个 Promise 成功后再执行 next。
    */


    //存到database
    const findResult = await User.find({email:ctx.request.body.email})
    console.log(findResult)
    if(findResult.length>0){
        ctx.status = 500;
        ctx.body={email:"邮箱已被占用"};
    }else {
        const newUser=new User({
            name:ctx.request.body.name,
            password:ctx.request.body.password,
            email:ctx.request.body.email
        })

        await bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(newUser.password,salt,(err,hash)=>{
                if(err) throw err;
                newUser.password=hash;
            })
        })
        

        // console.log(newUser)
        // 存到数据库
        await newUser.save().then(user=>{
            ctx.body=user;
        }).catch(err=>{
            console.log(err)
        })
        //返回数据
        // ctx.body=newUser;
    }

})
module.exports=router.routes()