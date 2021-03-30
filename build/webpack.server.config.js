const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const utils = require('./utils');
const base = require('./webpack.base.config');
const nodeExternals = require('webpack-node-externals');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = merge(base, {
    target: 'node',
    devtool: '#source-map',
    entry: './src/entry-server.js',
    output: {
        filename: 'server-bundle.js',
        libraryTarget: 'commonjs2'
    },
    resolve: {
        alias: {
            'create-api': resolve('src/api/create-api-server.js'),
        }
    },
    externals: nodeExternals({
        whitelist: /\.css$/
    }),
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.API_ENV': JSON.stringify(process.env.API_ENV || 'development'),
            'process.env.VUE_ENV': '"server"',
            'process.BROWSER_BUILD': false,
            'process.SERVER_BUILD': true,
            'process.browser': false,
            'process.server': true
        }),
        new VueSSRServerPlugin()
    ]
})
