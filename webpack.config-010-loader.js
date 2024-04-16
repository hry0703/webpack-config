let path = require('path')
let HtmlWebpackPlugin = require('html-webpack-plugin')
let MiniCssExtractPlugin = require('mini-css-extract-plugin')
let OptimizeCss = require('optimize-css-assets-webpack-plugin');
let UglifyJsPlugin = require('uglifyjs-webpack-plugin');
let webpack = require('webpack');
let CleanWebpackPlugin = require('clean-webpack-plugin');
let CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
    entry: {
        index: './src/index-loader.js'
    },
    output: {
        filename: '[name].js', // 打包后的文件名
        path: path.resolve(__dirname, 'dist'), // 路径必须是一个绝对路径
    },
    plugins: [
        // new webpack.DllReferencePlugin({
        //   manifest: path.resolve(__dirname, 'dist', 'manifest.json')
        // }),
        new webpack.IgnorePlugin(/\.\/locale/, /moment/),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            hash: true, // 加上hash值
            minify: {  // html 文件压缩配置
                removeAttributeQuotes: true,// 删除属性双引号
                // collapseWhitespace:true, // 折叠成一行
            }
        }),
        new webpack.NamedModulesPlugin(), // 打印更新的模块路径
        new webpack.HotModuleReplacementPlugin(),// 热更新插件


    ],
    mode: 'development',


    // loader加载配置
    resolveLoader:{
        // 1.别名
        // alias:{
        //     loader1: path.resolve(__dirname , 'loaders', 'loader1.js')
        // }
        // 2：解析路径顺序
        modules: ['node_modules', path.resolve(__dirname, 'loaders')]
    },
    module: {  // 模块
        rules: [
            {
                test: /\.js$/, // normal 普通的loader
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules/,
                // use: path.resolve(__dirname,'loaders','loader1.js'),
                use: ['loader3', 'loader2', 'loader1']
               
            },
        ]
    },

    optimization: { // 优化项  
        minimizer: [  // minimizer项不写时会默认使用UglifyJsPlugin压缩js文件；若需要再压缩css 需要再显式调用UglifyJsPlugin压缩js
            // new UglifyJsPlugin({
            //     cache: true,
            //     parallel: true,
            //     sourceMap: true
            // }),
            new OptimizeCss()  // 压缩打包后的css模块
        ]
    },
    devServer: { // 开发服务器配置、
        hot:true,  // 热更新
        port: 3000,
        progress: true, // 打包进度条
        contentBase: './dist',// 设置静态服务器目录
    },
   
}