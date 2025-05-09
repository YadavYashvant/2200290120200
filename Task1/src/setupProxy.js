const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/evaluation-service',
    createProxyMiddleware({
      target: 'https://20.244.56.144',
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        '^/evaluation-service': '/evaluation-service',
      },
      onProxyRes: function(proxyRes, req, res) {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
      },
      onError: function(err, req, res) {
        console.error('Proxy Error:', err);
        res.writeHead(500, {
          'Content-Type': 'text/plain',
        });
        res.end('Something went wrong with the proxy.');
      },
      logLevel: 'debug',
      ssl: {
        rejectUnauthorized: false
      }
    })
  );
}; 