function loader(source){  // loader的参数就是源代码
    console.log('loader1', source);
    return source  
}

module.exports = loader