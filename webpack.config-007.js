let path = require('path')
let HtmlWebpackPlugin = require('html-webpack-plugin')
let MiniCssExtractPlugin = require('mini-css-extract-plugin')
let OptimizeCss = require('optimize-css-assets-webpack-plugin');
let UglifyJsPlugin = require('uglifyjs-webpack-plugin');
let webpack = require('webpack');
let CleanWebpackPlugin = require('clean-webpack-plugin');
let CopyWebpackPlugin = require('copy-webpack-plugin');
// 多线程打包
let Happypack = require('happypack')
module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js', // 打包后的文件名
        // filename: 'bundle.[hash:8].js', // 打包后的文件名 + hash 限制八位
        path: path.resolve(__dirname, 'dist'), // 路径必须是一个绝对路径
    },
    plugins: [
        new webpack.DllReferencePlugin({
          manifest: path.resolve(__dirname, 'dist', 'manifest.json')
        }),
        new webpack.IgnorePlugin(/\.\/locale/, /moment/),
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: 'index.html',
            hash: true, // 加上hash值
            minify: {  // html 文件压缩配置
                removeAttributeQuotes: true,// 删除属性双引号
                // collapseWhitespace:true, // 折叠成一行
            }
        }),
        new Happypack({
            id:'js',
            use: [{
                loader: 'babel-loader',
                options: { // 用babel-loader 
                    presets: [
                        '@babel/preset-env', // 把es6 - es5
                        '@babel/preset-react', // 解析react语法
                    ],
                    plugins: [
                        ["@babel/plugin-proposal-decorators", { "legacy": true }],  // 支持🥱的装饰器写法
                        ["@babel/plugin-proposal-class-properties", { "loose": true }],  // 支持转换class类型写法  babel已支持？
                        "@babel/plugin-transform-runtime" // 避免babel转换语法时内联的辅助函数的重复申明； 配合使用@babel/runtime 自动移除语法转换后内联的辅助函数（inline Babel helpers），使用@babel/runtime/helpers里的辅助函数来替代。这样就减少了我们手动引入的麻烦。
                    ]
                }
            }]
        }),
        new Happypack({
            id: 'css',
            use: ['style-loader','css-loader']
        })

    ],
    mode: 'development',
    module: {  // 模块
        // loaders 
        rules: [
            {
                test: /\.js$/, // normal 普通的loader
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules/,
                use: "Happypack/loader?id=js"
               
            },
            {
                test: /\.css$/, // normal 普通的loader
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules/,
                use: "Happypack/loader?id=css"

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
    devServer: { // 开发服务器配置
        port: 3000,
        progress: true, // 打包进度条
        contentBase: './dist',// 设置静态服务器目录
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
   
}