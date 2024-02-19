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