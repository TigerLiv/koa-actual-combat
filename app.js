const koa=require("koa");
const Router=require("koa-router")
const mongoose=require("mongoose")
const bodyParser = require('koa-bodyparser')

//实例化koa
const app=new koa();
const router=new Router();
app.use(bodyParser())
// 引入user.js
const users=require('./routes/api/users');

//链接数据库
const db =require('./config/keys').mongooseUrl
mongoose.connect(db,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("database connected")
}).catch((error)=>{
    console.log(error)
})



//路由

router.get("/",async ctx=>{
    ctx.body={mgs:"Hello world"}
})


// 配置路由地址

router.use('/api/users',users);

//配置路由

app.use(router.routes()).use(router.allowedMethods());

const port=process.env.PORT || 5000;

app.listen(port,()=>{
    console.log(`运行在${port}端口...`)
})