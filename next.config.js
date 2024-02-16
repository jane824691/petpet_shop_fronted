/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['via.placeholder.com', 'localhost'],
  },
  env: {
    API_SERVER2: 'http://localhost:3002',
  },
}

module.exports = nextConfig

//後端public/img檔名對應資料庫圖片欄位名稱

// const nextConfig = {
//   reactStrictMode: false,
//   images: {
//     domains: ['via.placeholder.com', 'localhost'],
//   },
// comment for render twice issue
// avoid cors with proxy
// async rewrites() {
//   return [
//     {
//       source: '/api/:path*',
//       destination: 'http://localhost:3005/:path*', // Proxy to Backend
//     },
//   ]
// },
// }

// module.exports = nextConfig
