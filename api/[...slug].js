const httpProxy = require("http-proxy")

const TARGET_URL = "http://cmyam.net:65533" // 目标服务地址
const proxy = httpProxy.createProxyServer({
    target: TARGET_URL,
    changeOrigin: true, // 修改请求头中的 Origin 为目标地址
})

// CORS 处理函数
const setCORSHeaders = (res) => {
    // 修复: 多个域名需要使用数组形式
    res.setHeader("Access-Control-Allow-Origin", ["https://www.miaogu.top", "https://app.miaogu.top"])
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
    res.setHeader("Access-Control-Allow-Credentials", "true") // 允许携带凭证
}

module.exports = (req, res) => {
    // 打印请求路径，用于调试
    console.log("Proxying request to:", req.url)

    // 确保路径正确传递到目标服务器
    const url = req.url // 保留完整的URL路径

    // 处理预检请求
    if (req.method === "OPTIONS") {
        setCORSHeaders(res)
        return res.status(204).end()
    }

    // 设置 CORS 头部
    proxy.on("proxyRes", (proxyRes, req, res) => {
        setCORSHeaders(res)
    })

    // 代理请求，传递完整路径
    proxy.web(
        req,
        res,
        {
            target: TARGET_URL,
            changeOrigin: true,
            ignorePath: false, // 确保不忽略路径
        },
        (err) => {
            if (err) {
                console.error("Proxy error:", err.message)
                res.status(500).send("Proxy error")
            }
        },
    )
}

// 错误处理
proxy.on("error", (err) => {
    console.error("Proxy error:", err.message)
})

