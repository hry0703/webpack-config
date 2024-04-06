let { smart } = require('webpack-merge');
let base = require('./webpack.base-006.js');

module.exports = smart(base, {
    mode: 'development',
    devServer: {

    },
    devtool: 'source-map'
})