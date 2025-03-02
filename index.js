
const { get } = require('@vercel/edge-config');

const http = require('http');
const httpProxy = require('http-proxy');

// 创建一个代理服务器
const proxy = httpProxy.createProxyServer({});

function fetchData(key) {
    // 使用 get 函数
    get(key).then(value => {
        console.log(value);
    }).catch(error => {
        console.error('Error fetching data:', error);
    });
}

// 创建一个 HTTP 服务器
const server = http.createServer((req, res) => {
    // 目标服务器
    const targetUrl = fetchData('API_URL') || 'http://cmyam.net:65533'
    // 将请求转发到目标服务器
    proxy.web(req, res, { target: targetUrl }, (error) => {
        console.error('Proxy error:', error);
        res.writeHead(502, { 'Content-Type': 'text/plain' });
        res.end('Bad Gateway');
    });
});

// 启动服务器
const PORT = 3008; // 代理服务器的端口
server.listen(PORT, () => {
    console.log(`Proxy server is running on http://localhost:${PORT}`);
});
