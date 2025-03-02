const Koa = require('koa');
const proxy = require('koa-proxy');
const cors = require('@koa/cors');
const app = new Koa();

// 配置CORS中间件
app.use(cors({
    origin: (ctx) => {
        const allowedOrigins = [
            'https://www.miaogu.top',
            'https://app.miaogu.top'
        ];
        const requestOrigin = ctx.get('Origin');

        // 如果请求包含Origin头且存在于白名单中
        if (allowedOrigins.includes(requestOrigin)) {
            return requestOrigin;
        }
        // 非浏览器请求或不在白名单中的域名
        return '';
    },
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400, // 预检请求缓存时间（秒）
}));

// 代理配置（必须在CORS之后）
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
