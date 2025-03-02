const httpProxy = require('http-proxy');

const TARGET_URL = 'http://cmyam.net:65533'; // 目标服务地址
const proxy = httpProxy.createProxyServer({
    target: TARGET_URL,
    changeOrigin: true, // 修改请求头中的 Origin 为目标地址
});

module.exports = (req, res) => {
    // 打印请求路径，用于调试
    console.log('Proxying request to:', req.url);

    // 代理请求
    proxy.web(req, res, (err) => {
        if (err) {
            console.error('Proxy error:', err.message);
            res.status(500).send('Proxy error');
        }
    });
};

// 错误处理
proxy.on('error', (err) => {
    console.error('Proxy error:', err.message);
});
