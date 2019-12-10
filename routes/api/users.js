const Router=require("koa-router");
var gravatar = require('gravatar');
const tools=require('./../../config/tools');
const jwt=require("jsonwebtoken");
const keys=require("./../../config/keys");
// 引入User
const User=require('./../../models/User');

const router = new Router();

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
        const avatar = gravatar.url(ctx.request.body.email, {s: '200', r: 'pg', d: 'mm'});

        const newUser=new User({
            name:ctx.request.body.name,
            avatar:avatar,
            password:tools.enBcrypt(ctx.request.body.password),
            email:ctx.request.body.email
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

/*
登录接口
login
返回的是一个token
*/
router.post('/login',async ctx=>{
    // 查询邮箱 
    const findResult = await User.find({email:ctx.request.body.email});
    const user=findResult[0];
    const password= ctx.request.body.password;
    if(findResult.length===0){
        ctx.status = 404;
        ctx.body= '用户不存在';
    }else {
        //验证密码
        var result= await tools.comparePassword(password,user.password)
        if(result){
            const payload={id:user.id,name:user.name,avatar:user.avatar};
            const token =jwt.sign(payload,keys.screctOrKey,{expiresIn:3600})

            ctx.status=200;
            ctx.body={success:'登录成功',token:"Bearer "+token}
            //返回token
            
        }else {
            ctx.status=400;
            ctx.body={error:"密码错误"}
        }
    }
})
module.exports=router.routes()