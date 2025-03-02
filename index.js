const httpProxy = require('http-proxy');

// 配置参数
const TARGET_URL = 'http://cmyam.net:65533'; // 目标服务地址

const proxy = httpProxy.createProxyServer({
    target: TARGET_URL,
    changeOrigin: true, // 修改请求头中的 Origin 为目标地址
});

module.exports = (req, res) => {
    // 仅处理目标域名的请求
    proxy.web(req, res, (err) => {
        if (err) {
            console.error('代理错误:', err.message);
            res.status(500).send('代理错误');
        }
    });
};

// 错误处理
proxy.on('error', (err) => {
    console.error('代理错误:', err.message);
});
