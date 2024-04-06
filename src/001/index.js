
require('@babel/polyfill')
require('./index.css');
require('./index.less');

console.log('hello world');
let str = require('./a')
console.log(str.a);

let fn = ()=>{
    console.log('es6代码');
}

fn()

@log
class A {
    a = '1'
}

function log (params) {
    console.log('log', params);
    
}

let aaa = new A();
console.log(aaa.a,);


console.log('实例上的方法babel转换测试','aaa'.includes('a'))