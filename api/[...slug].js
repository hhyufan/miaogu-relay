// 目标服务器配置
const TARGET_URL = "http://cmyam.net:65533"

// CORS 头部处理函数
const setCORSHeaders = (res) => {
    const headers = {
        "Access-Control-Allow-Origin": ["https://www.miaogu.top", "https://app.miaogu.top"],
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": "true",
    }

    for (const [key, value] of Object.entries(headers)) {
        res.setHeader(key, Array.isArray(value) ? value : [value])
    }
}

// 处理请求体
async function readRequestBody(req) {
    const buffers = []
    for await (const chunk of req) {
        buffers.push(chunk)
    }
    return Buffer.concat(buffers).toString()
}

// 主处理函数
export default async function handler(req, res) {
    // 处理 OPTIONS 请求
    if (req.method === "OPTIONS") {
        setCORSHeaders(res)
        return res.status(204).end()
    }

    try {
        // 构建目标 URL
        const targetPath = req.url.replace("/api", "") // 移除 /api 前缀
        const targetUrl = `${TARGET_URL}${targetPath}`

        // 准备请求头
        const headers = {
            ...req.headers,
            host: new URL(TARGET_URL).host,
        }

        // 删除一些不需要的头部
        delete headers["if-none-match"]
        delete headers["if-modified-since"]

        // 读取请求体（如果有）
        let body
        if (["POST", "PUT", "PATCH"].includes(req.method)) {
            body = await readRequestBody(req)
        }

        // 发送代理请求
        const proxyRes = await fetch(targetUrl, {
            method: req.method,
            headers: headers,
            body: body,
            redirect: "follow",
        })

        // 设置响应头
        setCORSHeaders(res)

        // 复制响应头
        for (const [key, value] of proxyRes.headers) {
            // 跳过某些响应头以避免冲突
            if (!["content-length", "content-encoding", "transfer-encoding"].includes(key.toLowerCase())) {
                res.setHeader(key, value)
            }
        }

        // 获取响应体
        const responseData = await proxyRes.text()

        // 发送响应
        res.status(proxyRes.status).send(responseData)
    } catch (error) {
        console.error("Proxy error:", error)
        res.status(500).json({ error: "Proxy request failed" })
    }
}

// 配置导出
export const config = {
    api: {
        bodyParser: false, // 禁用默认的 body 解析
        externalResolver: true, // 表明这是一个外部解析器
    },
}

