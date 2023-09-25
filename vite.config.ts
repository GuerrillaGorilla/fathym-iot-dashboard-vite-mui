import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default ({ mode }) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};

  return defineConfig({

  plugins: [react()],
  server: {
    proxy: {
      '/api/iot': {
        target: 'https://fathym-cloud-prd.azure-api.net/fcp-iotensemble/',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/iot/, ''),
        configure: (proxy, _options) => {
          proxy.on('proxyReq', function(proxyReq, req, res, options) {
            proxyReq.setHeader('lcu-subscription-key', process.env.VITE_IOT_ENSEMBLE_LCU_SUBSCRIPTION_ID);
          });
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      },
      '/api/habistack': {
        target: 'https://fathym-cloud-prd.azure-api.net/habistack/weather/ground/',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/habistack/, ''),
        configure: (proxy, _options) => {
          proxy.on('proxyReq', function(proxyReq, req, res, options) {
            proxyReq.setHeader('lcu-subscription-key', process.env.VITE_HABISTACK_LCU_SUBSCRIPTION_ID);
          });
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      },
      '/api/geocodio': {
        target: 'https://api.geocod.io/v1.7/',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/geocodio/, ''),
        configure: (proxy, _options) => {
          proxy.on('proxyReq', function(proxyReq, req, res, options) {
            let connect = proxyReq.path.indexOf('?') > 0 ? '&' : '?';
            proxyReq.path = `${proxyReq.path}${connect}api_key=${process.env.VITE_GEOCODIO_API_KEY}`;
          });
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      }
    },
  },
})
}