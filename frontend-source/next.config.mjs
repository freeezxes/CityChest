/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'
const BASE = '/mini-app'; // <-- ЗДЕСЬ НАЗВАНИЕ ТВОЕЙ ПОДПАПКИ

const nextConfig = {
    output: 'export',
    trailingSlash: true,
    basePath: isProd ? BASE : '',
    assetPrefix: isProd ? BASE + '/' : '',
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        unoptimized: true,
    },
}

export default nextConfig
