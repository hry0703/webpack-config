// console.log('index');


// class Log{
//     constructor(){
//         console.log('出错了111111111');
//     }
// }

// let log = new Log()

// let xhr = new XMLHttpRequest();

// // http://localhost:8080   webpack-dev-server的服务 -> 3000

// // http-proxy
// xhr.open('GET','/api/user',true);

// xhr.onload = function(){
//   console.log(xhr.response);
// }

// xhr.send();


// if(DEV){
//     console.log('dev变量', DEV);
// }else{
//     console.log('非dev变量');
// }



// import jQuery from "jquery";
// import moment from "moment";
// import 'moment/locale/zh-cn'
// moment.locale('zh-cn')
// console.log(moment().endOf('day').fromNow());


// import React from "react";
// import {render} from 'react-dom'
// render(<h1>jsx</h1>,window.root)

// import './a.js'
// import './b.js'
// import $ from "jquery";

// console.log('$ ', $);

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