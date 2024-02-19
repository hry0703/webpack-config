// module.exports = 'a module'

class B {

}

function * gen(params) {
    yield '1'
    
}
console.log('打印gen',gen().next(),);


let afn = async ()=>{
    let str = await 1
    console.log('222',);
}

afn()

export const a = 'a module'