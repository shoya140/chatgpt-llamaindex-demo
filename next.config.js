/** @type {import('next').NextConfig} */

const withInterceptStdout = require('next-intercept-stdout')

const nextConfig = {
  reactStrictMode: true,
}

module.exports = withInterceptStdout(nextConfig, (text) =>
  text.includes('Duplicate atom key') ? '' : text
)
