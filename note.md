## webpack安装
- 安装本地的webpack
- yarn add webpack webpack-cli -D

## webpack可以进行0配置
- 打包工具 -> 输出后的结果（js模块）
- 打包 支持js的模块化

## 手动配置webpack
默认配置文件的名称是webpack.config.js
手动修改默认配置文件 npx webaock --config webpack.config.my.js 

"scripts": {
    "build": "webpack --config webpack.config.js",
    "test": "webpack"
},
// 命令行中使用npm 加参数时 需要在参数前多加 --  yarn 不需要
npm run test -- --config webpack.config.js 

## dev开发服务
yarn add webpack-dev-server -D
webpack-dev-server 开启本地静态服务器

## 
yarn add html-webpack-plugin -D

yarn add style-loader css-loader -D

yarn add less-loader less  -D  // less-loader 会自动引用less 

## 将css抽离成文件
yarn add min-css-min-css-extract-plugin  -D 

## 自动添加css的浏览器前缀 需要postcss-loader
yarn add postcss-loader autoprefixer  -D 
## 需要配置 postcss.config.js
先使用postcss-loader 再使用css-loader

## optimize-css-assets-webpack-plugin 压缩css
## uglifyjs-webpack-plugin  压缩js


## 配置babel
es6转成es5

yarn add babel-loader @babel/core  @babel/preset-env  -D

@babel/core babel核心语法 
@babel/preset-env 把js标准语法转换成低级语法 es6转成es5


## @babel/plugin-transform-runtime和@babel/runtime

yarn add @babel/plugin-transform-runtime  -D
yarn add @babel/runtime 
博客[https://www.cnblogs.com/zhansu/p/13339745.html]

在我们用Babel做语法转换的时候（注意，这里是单纯的做语法转换，暂时不使用polyfill补齐API），
需要Babel在转换后的代码里注入一些辅助函数才能正常工作
比如使用类语法会添加_classCallCheck、使用gen函数会添加_regeneratorRuntime 
@babel/preset-env在做语法转换的时候，注入了这些函数声明，以便语法转换后使用。


但样这做存在一个问题。在我们正常的前端工程开发的时候，少则几十个js文件，多则上千个。如果每个文件里都使用了class类语法，那会导致每个转换后的文件上部都会注入这些相同的函数声明。这会导致我们用构建工具打包出来的包非常大。

那么怎么办？一个思路就是，我们把这些函数声明都放在一个npm包里，需要使用的时候直接从这个包里引入到我们的文件里。这样即使上千个文件，也会从相同的包里引用这些函数。通过webpack这一类的构建工具打包的时候，我们只会把使用到的npm包里的函数引入一次，这样就做到了复用，减少了体积。

@babel/runtime就是上面说的这个npm包，@babel/runtime把所有语法转换会用到的辅助函数都集成在了一起。(node_modules/@babel/runtime/helpers/esm文件夹下)

@babel/plugin-transform-runtime有三大作用，其中之一就是自动移除语法转换后内联的辅助函数（inline Babel helpers），使用@babel/runtime/helpers里的辅助函数来替代。这样就减少了我们手动引入的麻烦。

```javascript
// 在函数申明前加上辅助函数 /*#__PURE__*/_regeneratorRuntime() 
// @babel/plugin-transform-runtime 来使用@babel/runtime内集成的_regeneratorRuntime方法
var A = log(_class = /*#__PURE__*/_createClass(function A() {
  _classCallCheck(this, A);
  _defineProperty(this, "a", '1');
})) || _class;
```

## @babel/polyfill
yarn add @babel/polyfill
```javascript
// 在main.js 中引用 
require('@babel/polyfill')
```

Babel中默认只转换新的 JavaScript 句法，例如箭头函数、扩展运算符等。但是不会转换新的 API，像是Set、Maps、Iterator、Generator 、Symbol、Reflect 等全局对象，以及一些定义在全局对象上的方法都不会进行转译。如果想使用这些新的对象和方法，则需要为当前环境提供一个 polyfill 垫片。

举一个例子，例如 ES6 在 Array 对象上有一个新增的 Array.from 方法，因为这个方法是全局对象上的方法，所以 Babel 就不会对这个方法进行转译。如果想让这个方法运行，就要使用 @babel/polyfill 为当前环境提供一个垫片。



## 配置eslint 校验代码
yarn add eslint eslint-loader -D


## 全局变量引入问题---三种方法
yarn add expose-loader -D
```javascript
// 在main.js 中引用 
import $ from 'jquery' // $变量默认不会暴露在全局的window上  每处用到的地方都需要引入
实现依赖全局使用的方法：
方法1:暴露到全局的window上 import $ from 'expose-loader?$!jquery'  // expose-loader 暴露全局的loader 内联的loader
方法2:暴露到全局的window上  wepack.config.js中:
rules: [ 
    {
        test:require.resolve('jquery'),
        use:'expose-loader?$'
    },
}
方法3:在每个模块中注入$对象  wepack.config.js中:
let webpack = require('webpack');
plugins:[
    new webpack.ProvidePlugin({ // 在每个模块中注入$对象 
        jquery:'$'
    })
]
方法4:外部引入但不打包(externals)
1.html文件中通过script文件引入 不打包
2. wepack.config.js中:
 externals: {
        jquery: "$"
    },
```

## webpack使用图片 打包图片 
1. js中创建图片来引入  需要file-loader
2. css中引入 background-url  不需要处理直接引用
3. <img src="">  "html-withimg-loader": "^0.1.16",
  rules: [ 
            {
                test: /\.html$/,
                use: 'html-withimg-loader'
            },

一般不直接使用file-loader 而是使用url-loader 

file-loader与url-loader区别：
file-loader是单独引入图片文件
url-loader可以控制文件大于多少时像file-loader一样单独引入 小于多少K时以base64格式转化到js文件中


## 多页应用
```javascript
mode: "production",
entry: {
    home: './src/index.js',
    other: './src/other.js',
},
output: {
    filename: '[name].js', // 打包后的文件名 name表示 home/other
    // filename: 'bundle.[hash:8].js', // 打包后的文件名 + hash 限制八位
    path: path.resolve(__dirname, 'dist'), // 路径必须是一个绝对路径
},
plugins: [
    new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'home.html',
        chunks: ['home'] // 允许您只添加需要的代码块 [home,other]
    }),
    new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'other.html',
        chunks: ['other']  // 

    }),
],
```

## source-maps
1) 源码映射 会单独生成一个sourcemap文件 出错了 会标识 当前报错的列和行 大 和 全
devtool:'source-map', // 增加映射文件 可以帮我们调试源代码
2) 不会产生单独的文件 但是可以显示行和列
devtool:'eval-source-map',
3)  不会产生列 但是是一个单独的映射文件
devtool:'cheap-module-source-map', // 产生后你可以保留起来
4) 不会长生文件 集成在打包后的文件中 不会产生列
devtool: 'cheap-module-eval-source-map',



## watch的用法
yarn dev 无法查看生成的文件 
yarn build 无法实时更新 这时需要配置watch选项
watch: true,
watchOptions: { // 监控的选项
    poll: 1000, // 每秒 问我 1000次
    aggregateTimeout: 500, // 防抖 我一直输入代码 
    ignored: /node_modules/ // 不需要进行监控哪个文件
},


## webpack小插件应用
1) cleanWebpackPlugin 
2) copyWebpackPlugin
3) bannerPlugin  内置

"clean-webpack-plugin": "^1.0.0",
"copy-webpack-plugin": "^4.6.0"

```javascript
let CleanWebpackPlugin = require('clean-webpack-plugin');
let CopyWebpackPlugin = require('copy-webpack-plugin');


new CleanWebpackPlugin('./dist'),
new CopyWebpackPlugin([ // 拷贝插件
    {from:'doc',to:'./'}
]),
new webpack.BannerPlugin('make 2019 by jw')
```

## webpack 跨域问题

```javascript
 devServer: { // 开发服务器配置
    port: 3000,
    progress: true, // 打包进度条
    contentBase: './build',// 设置静态服务器目录
    // open:true, // 自动打开浏览器
    // compress:true, // gzip？ 压缩

    


    //2） 我们前端只想单纯来模拟数据
    // before(app){ // 提供的方法 钩子
    //   app.get('/user',(req,res)=>{
    //     res.json({name:'珠峰架构-before'})
    //   })
    // }
    // 1）
    proxy:{ // 重写的方式 把请求代理到express服务器上
        '/api':{
            target:'http://localhost:3080',
            pathRewrite:{'/api':''}
        }// 配置了一个代理
    }
},

// express serve.js
 //3) 有服务端 不用用代理来处理 能不能再服务端中启动webpack 端口用服务端端口 这样后端前端一起用一个端口启动就不会跨域
 yarn add webpack webpack-dev-middleware -D

let express = require('express');
let app = express();
let webpack = require('webpack');

// 中间件
let middle = require('webpack-dev-middleware');  // 需要安装
let config = require('./webpack.config.js');
let compiler = webpack(config);

app.use(middle(compiler));

app.get('/user', (req, res) => {
    res.json({ name: '珠峰架构1' })
})

app.listen(3080);
```


## resolve属性的配置


```javascript

resolve:{ // 解析 第三方包 common
    modules:[path.resolve('node_modules')],
    extensions:['.js','.css','.json','.vue'], // 实现自动添加引入文件后缀

    // 实现只引入bootstrap样式文件！！！！！
    // 方法1: import bootstrap/dist/css/bootstrap.css 
    // 方法2: 使用webpack resolve配置里的mainFields或者alias 实现 import bootstrap 引入的是css文件而不是js文件
    // mainFields:['style','main']  // 主入口的字段 默认是第三方包的package.json里的main字段 这里设置优先为style字段 没有再main
    // mainFiles:[], // 入口文件的名字 默认index.js
    // alias:{ // 别名 vue vue.runtime
    //   bootstrap:'bootstrap/dist/css/bootstrap.css'
    // }
},
```


## 定义环境变量
// index.js中可直接使用变量DEV 值为'dev1111'
plugins: [
    new webpack.DefinePlugin({
        DEV:"'dev1111'",
        FLAG:'true',  // 值为boolean true
        EXPORESSION:'1+1'  // 值为number 2
    }),
    
],


## 区分不同环境 dev pro
yarn add webpack-merge -D  "webpack-merge": "^4.1.5"

// webpack.dev.js
let { smart } = require('webpack-merge');
let base = require('./webpack.base.js');

module.exports = smart(base, {
    mode: 'development',
    devServer: {

    },
    devtool: 'source-map'
})

## webpack的优化
### no-parse
// webpack.config.js
module:{
    noParse:/jquery/ , // 不去解析jquery中的依赖库
}

### IgnorePlugin
```javascript
// 忽略依赖中引用的某些文件 减少包体积
 plugins: [
    // momemt中默认引入各种语言文件 IgnorePlugin可以设置不全部引入 然后在业务文件中按需引入语言 
    new webpack.IgnorePlugin(/\.\/locale/, /moment/), 
],
// index.js
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
console.log(moment().endOf('day').fromNow());

```

### dllPlugin 动态连接库
```javascript
import React from "react";
import {render} from 'react-dom'
render(<h1>jsx</h1>,window.root)

// React和react-dom库比较大且不会更改 可以独立的先打包 然后开发时再引用这个打包好的文件
// webpack.config.react.js
let path = require('path');
let webpack = require('webpack');
module.exports = {
    mode: 'development',
    entry: {
        react: ['react', 'react-dom'],
    },
    output: {
        filename: '_dll_[name].js', // 产生的文件名
        path: path.resolve(__dirname, 'dist'),
        library: '_dll_[name]', // _dll_react
        //libraryTarget:'var' // commonjs var this ....
    },
    plugins: [
        new webpack.DllPlugin({ // name == library
            name: '_dll_[name]',
            path: path.resolve(__dirname, 'dist', 'manifest.json')
        })
    ]
}

// 执行打包命令 npx webpack  --config webpack.config.react.js
// 生成 _dll_react.js文件和manifest.json文件 在dist/index.html中引用
 <script src="./_dll_react.js"></script>

// 在webpack.config.js中配置
plugins: [
    new webpack.DllReferencePlugin({
        manifest: path.resolve(__dirname, 'dist', 'manifest.json')
    }),
]
// 这样项目中使用的依赖react和react-dom可预先在manifest.json清单中找到不需要打包进来减少主包的体积
```

### happypack 多线程打包
```javascript
let Happypack = require('happypack')
plugins: [
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
```

## webpack自带的优化

### tree-sharking
import 在生产环境下会自动去除掉没有用的代码
require 不会

### scope hosting 作用域提升
let a= 1
let b =2
let c= 3
let d = a+b+c
console.log(d) // webpack生产环境打包会自动简化代码成console.log(6)


## 抽离公共代码
optimization: { // 优化项  
    splitChunks:{
        cacheGroups:{
            common:{
                chunks:'initial',
                // miniSize:0,
                minChunks:2
            },
            vendor:{
                priority:1,
                test:/node_modules/,
                chunks: 'initial',
                // miniSize:0,
                minChunks: 2
            }
        }
    }
}

## 懒加载
// source.js
export default "source"

// index.js
let button = document.createElement('button');
button.innerHTML = 'hello';
// vue的懒加 react懒加载
button.addEventListener('click',function () {
  // es6 草案中的语法 jsonp实现动态加载文件
  import('./source.js').then(data=>{
    console.log(data.default);
  })
});
document.body.appendChild(button);

## 热更新
plugins: [
    new webpack.NamedModulesPlugin(), // 打印更新的模块路径
    new webpack.HotModuleReplacementPlugin(),// 热更新插件
],
devServer: { // 开发服务器配置、
    hot:true,  // 热更新
    
},

