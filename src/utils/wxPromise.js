const Promise = require('../libs/promise')

function wxPromise(fn) {
    return function(options = {}){
        return new Promise((resolve,reject) => {
            options.success = function (e) {
                resolve(e)
            }
            options.fail = function (err) {
                reject(err)
            }
            fn(options)
        })
    }
}
export default wxPromise