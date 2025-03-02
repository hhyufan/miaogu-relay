const Koa = require('koa');
const proxy = require('koa-proxy');
const app = new Koa();

// 代理配置
app.use(proxy({
    host: 'http://cmyam.net:65533', // 后端服务的地址
}));

// 其他路由处理
app.use(async ctx => {
    ctx.body = 'Hello Vercel';
});

app.listen(3008, () => {
    console.log('3008项目启动');
});
