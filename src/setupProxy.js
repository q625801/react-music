const {createProxyMiddleware} = require("http-proxy-middleware")
module.exports = function(app){
    app.use(
        createProxyMiddleware('/api',{
            target: 'http://localhost:3000', // 设置调用的接口域名和端口号 ( 设置代理目标)
            changeOrigin: true,
            pathRewrite: {
            '^/api': '' // 这是一个通配符，设置完了之后每个接口都要在前面加上/api（特别注意这一点）
            }
        })
    )
}