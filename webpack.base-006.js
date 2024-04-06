let path = require('path')
let HtmlWebpackPlugin = require('html-webpack-plugin')
let MiniCssExtractPlugin = require('mini-css-extract-plugin')
let OptimizeCss = require('optimize-css-assets-webpack-plugin');
let UglifyJsPlugin = require('uglifyjs-webpack-plugin');
let webpack = require('webpack');
let CleanWebpackPlugin = require('clean-webpack-plugin');
let CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
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
    devServer: { // 开发服务器配置
        port: 3000,
        progress: true, // 打包进度条
        contentBase: './build',// 设置静态服务器目录
        // open:true, // 自动打开浏览器
        // compress:true, // gzip？ 压缩

        //3) 有服务端 不用用代理来处理 能不能再服务端中启动webpack 端口用服务端端口
    
        //2） 我们前端只想单纯来模拟数据
        // before(app){ // 提供的方法 钩子
        //     app.get('/api/user',(req,res)=>{
        //         res.json({name:'珠峰架构-before'})
        //     })
        // },

        // 1）
        // proxy:{ // 重写的方式 把请求代理到express服务器上
        //     '/api':{
        //         target:'http://localhost:3080',
        //         pathRewrite:{'/api':''}
        //     }// 配置了一个代理
        // }
    },
    entry: './src/index.js',
    output: {
        filename: 'bundle.js', // 打包后的文件名
        // filename: 'bundle.[hash:8].js', // 打包后的文件名 + hash 限制八位
        path: path.resolve(__dirname, 'build'), // 路径必须是一个绝对路径
    },
    plugins: [
        new webpack.DefinePlugin({
            DEV:"'dev1111'",
            FLAG:'true',  // 值为boolean true
            EXPORESSION:'1+1'  // 值为number 2
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            hash: true, // 加上hash值
            minify: {  // html 文件压缩配置
                removeAttributeQuotes: true,// 删除属性双引号
                // collapseWhitespace:true, // 折叠成一行
            }
        }),
        // css 抽离成单独模块
        new MiniCssExtractPlugin({
            filename: 'mini.css',
        }),
        // 在每个模块中注入$对象  不需要每个文件中import jquery
        new webpack.ProvidePlugin({
            $: 'jquery'
        }),

        // new CleanWebpackPlugin('./dist'),
        // new CopyWebpackPlugin([ // 拷贝插件
        //     { from: 'doc', to: './' }
        // ]),
        // new webpack.BannerPlugin('make 2019 by jw')
    ],
    module: {  // 模块
        // loaders 
        rules: [
            {
                test: /\.html$/,
                use: 'html-withimg-loader'
            },
            {
                test: /\.(png|jpg|gif)$/,
                // 做一个限制 当我们的图片 小于多少k的时候 用base64 来转化
                // 否则用file-loader产生真实的图片
                use: {
                    // loader: 'file-loader',
                    loader: 'url-loader',
                    options: {
                        limit: 1 * 1024,  //
                        outputPath: '/img/',// 图片输出路径 打包会替换掉文件中原来图片的引入路径
                        // publicPath: 'http://www.zhufengpeixun.cn' // 给图片资源加公共路径 图片需要使用cdn时可用
                    }
                }
            },
            {
                test: /\.js$/, // normal 普通的loader
                use: {
                    loader: 'babel-loader',
                    options: { // 用babel-loader 
                        presets: [
                            '@babel/preset-env', // 把es6 - es5
                        ],
                        plugins: [
                            ["@babel/plugin-proposal-decorators", { "legacy": true }],  // 支持🥱的装饰器写法
                            ["@babel/plugin-proposal-class-properties", { "loose": true }],  // 支持转换class类型写法  babel已支持？
                            "@babel/plugin-transform-runtime" // 避免babel转换语法时内联的辅助函数的重复申明； 配合使用@babel/runtime 自动移除语法转换后内联的辅助函数（inline Babel helpers），使用@babel/runtime/helpers里的辅助函数来替代。这样就减少了我们手动引入的麻烦。
                        ]
                    }
                },
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules/
            },
            // css-loader 解析 @import url 这种语法
            // style-loader 把css插入header的标签中
            // loader 功能单一  默认是从右向左 从下到上执行
            // { 
            //     test: /\.css$/, 
            //     use: ['style-loader', 'css-loader'] 
            // }
            // {
            //     test: /\.css$/,
            //     use: [
            //         {
            //             loader: 'style-loader',
            //             options: {
            //                 // insertAt: 'top'  // css插入header的标签最上方
            //             }
            //         }, 
            //         'css-loader'
            //     ] 
            // },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,  // 替换 style-loader 否则抽出的css会插入header标签内
                    'css-loader',
                    'postcss-loader',
                ]
            },
            // 处理less文件  less-loader 会自动引用less 
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'less-loader', // 把less转换成css
                ]
            }
        ]
    },

}