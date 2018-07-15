var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
	entry: './src/main.ts',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			}
		]
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js']
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	watch: true,
	plugins: [
		new HtmlWebpackPlugin({
			title: 'Sample',
			template: 'src/index.html'
		}),
		new BrowserSyncPlugin({
			host: process.env.IP || 'localhost',
			port: process.env.PORT || 3000,
			server: {
				baseDir: ['./', './dist']
			}
		})
	]
};

// FIXME: Remove code blocks below
// module.exports = {
// 	entry: {
// 		app: [path.resolve(__dirname, 'src/main.ts')],
// 		vendor: ['phaser']
// 	},
// 	output: {
// 		pathinfo: true,
// 		path: path.resolve(__dirname, 'dist'),
// 		publicPath: './dist/',
// 		filename: 'bundle.js'
// 	},
// 	watch: true,
// 	plugins: [
// 		new HtmlWebpackPlugin(),

// 	],
// 	module: {
// 		rules: [
// 			{
// 				test: /\.ts$/,
// 				loaders: ['ts-loader'],
// 				exclude: /node_modules/
// 			},
// 			{
// 				test: [/\.vert$/, /\.frag$/],
// 				use: 'raw-loader'
// 			}
// 		]
// 	}
// };

// new BrowserSyncPlugin({
//     host: process.env.IP || 'localhost',
//     port: process.env.PORT || 3000,
//     server: {
//         baseDir: ['./dist']
//     }
// })
