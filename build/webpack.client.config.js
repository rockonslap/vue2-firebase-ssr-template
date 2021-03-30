const path = require('path');
const webpack = require('webpack');
const utils = require('./utils');
const merge = require('webpack-merge');
const base = require('./webpack.base.config');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

const config = merge(base, {
    entry: {
        app: './src/entry-client.js'
    },
    resolve: {
        alias: {
            'create-api': resolve('src/api/create-api-client.js'),
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.API_ENV': JSON.stringify(process.env.API_ENV || 'development'),
            'process.env.VUE_ENV': '"client"',
            'process.BROWSER_BUILD': true,
            'process.SERVER_BUILD': false,
            'process.browser': true,
            'process.server': false
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jquery: 'jquery',
            'window.jQuery': 'jquery',
            jQuery: 'jquery',
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function(module) {
                return (
                    /node_modules/.test(module.context) &&
                    !/\.css$/.test(module.request)
                )
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest'
        }),
        new VueSSRClientPlugin()
    ]
});

module.exports = config;
