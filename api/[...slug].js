const httpProxy = require('http-proxy');

const TARGET_URL = 'http://cmyam.net:65533'; // 目标服务地址
const proxy = httpProxy.createProxyServer({
    target: TARGET_URL,
    changeOrigin: true, // 修改请求头中的 Origin 为目标地址
});

// CORS 处理函数
const setCORSHeaders = (res) => {
    res.setHeader('Access-Control-Allow-Origin', "https://www.miaogu.top", "https://app.miaogu.top"); // 允许所有源，或替换为特定源
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // 允许的 HTTP 方法
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // 允许的自定义头部
};

module.exports = (req, res) => {
    // 打印请求路径，用于调试
    console.log('Proxying request to:', req.url);

    // 处理预检请求
    if (req.method === 'OPTIONS') {
        setCORSHeaders(res);
        return res.status(204).end(); // 结束预检请求
    }

    // 代理请求
    proxy.web(req, res, (err) => {
        if (err) {
            console.error('Proxy error:', err.message);
            res.status(500).send('Proxy error');
        }
    });

    // 设置 CORS 头部
    proxy.on('proxyRes', (proxyRes, req, res) => {
        setCORSHeaders(res); // 在代理响应中设置 CORS 头部
    });
};

// 错误处理
proxy.on('error', (err) => {
    console.error('Proxy error:', err.message);
});
