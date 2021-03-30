const path = require('path');
const webpack = require('webpack');
const utils = require('./utils');
const vueConfig = require('./vue-loader.config');
const CompressionPlugin = require('compression-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const isProd = process.env.NODE_ENV === 'production';

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    devtool: isProd ? false : '#cheap-module-source-map',
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/dist/',
        filename: '[name].[chunkhash].js'
    },
    resolve: {
        extensions: ['.js', '.vue', '.json', '.less', '.css'],
        alias: {
            'style.less': resolve('src/assets/css/style.less'),
            'mixin.less': resolve('src/assets/css/_mixin.less'),
            'variable.less': resolve('src/assets/css/_variable.less'),
            'api': resolve('src/api/index.js'),
        }
    },
    module: {
        noParse: /es6-promise\.js$/,
        rules: [{
            test: /\.(js|vue)$/,
            loader: 'eslint-loader',
            enforce: 'pre',
            exclude: [/node_modules/],
            options: {
                formatter: require('eslint-friendly-formatter')
            }
        }, {
            test: /\.vue$/,
            loader: 'vue-loader',
            options: vueConfig
        }, {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: [/node_modules/]
        }, {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: 'url-loader',
            query: {
                limit: 10000,
                name: utils.assetsPath('img/[name].[hash:7].[ext]')
            }
        }, {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url-loader',
            query: {
                limit: 10000,
                name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
            }
        }, ...utils.styleLoaders({
            sourceMap: isProd,
            extract: isProd,
        })],
    },
    performance: {
        maxEntrypointSize: 300000,
        hints: isProd ? 'warning' : false
    },
    plugins: isProd ? [
        new webpack.optimize.UglifyJsPlugin({
            comments: false,
            compress: {
                warnings: false,
                drop_console: true
            },
            sourceMap: true
        }),
        new ExtractTextPlugin({
            filename: 'common.[chunkhash].css'
        }),
        new OptimizeCSSPlugin(),
        new CompressionPlugin({
            asset: "[path].gz[query]",
            algorithm: "gzip",
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0.8
        }),
    ] : [
        new FriendlyErrorsPlugin()
    ]
}
