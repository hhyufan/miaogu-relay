const httpProxy = require('http-proxy');

const TARGET_URL = 'http://cmyam.net:65533';
const proxy = httpProxy.createProxyServer({
    target: TARGET_URL,
    changeOrigin: true,
});

// 处理所有路径请求
module.exports = (req, res) => {
    proxy.web(req, res, (err) => {
        if (err) {
            console.error('Proxy error:', err);
            res.status(500).send('Proxy error');
        }
    });
};

proxy.on('error', (err) => {
    console.error('Proxy error:', err);
});
