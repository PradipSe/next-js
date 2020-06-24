const BrotliPlugin = require('brotli-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true'
})

const options = {
	/**
	 * Change "__next" directory path.
	 */
	poweredByHeader: false,
    assetPrefix: '/entertainment/buzz',
	webpack: (config) => {		
		const isProd = process.env.NODE_ENV === 'production'
		const isDebug = process.env.DEBUG === 'true'

		const customConfig = { ...config }
		const compressionPlugin = new CompressionPlugin({
			filename: '[file].gz',
			test: /\.js$|\.html$|\.css$/,
			threshold: 1024,
			minRatio: 0.9,
			cache: true,
		})
		const brotliConfig = new BrotliPlugin({ minRatio: 0.9 })
		customConfig.performance.hints = isDebug ? 'warning' : false
		if (isProd) {
			customConfig.plugins.push(compressionPlugin)
			customConfig.plugins.push(brotliConfig)
		}

		const { cacheGroups } = customConfig.optimization.splitChunks
		if (cacheGroups && cacheGroups.commons) {
			cacheGroups.commons.maxSize = 300000
		}
		customConfig.optimization.splitChunks.cacheGroups = cacheGroups
		customConfig.output.publicPath = `/entertainment/buzz${customConfig.output.publicPath}`
		return customConfig
	},
}

module.exports = withBundleAnalyzer(options)