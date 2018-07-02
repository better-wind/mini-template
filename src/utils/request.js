import Promise from '../libs/promise'
import wxAPI from './wxAPI'
import CONFIG from '../config/env'

const STATUS_CODE = {
    SUCCESS: 200
}

function requestUrl (url) {
    const key = CONFIG.production ? 'pro' : 'dev'
    const basePath = CONFIG[key].domain + CONFIG[key].pathType
    return basePath + url

}

function requestHeader (headers) {
    return Object.assign({},{
        'content-type': 'application/json'
    },headers)
}
function requestData (data) {
    return Object.assign({},
        data)
    // {
    //     sessionToken:this.globalData.sessionToken
    // }
}


class Request {
    constructor (args) {
        this.get = this.init('GET')
        this.post = this.init('POST')
    }

    init (method) {
        return ({url, data, header}) => {
            return new Promise((resolve, reject) => {
                wxAPI.request({
                    url: requestUrl(url),
                    data: requestData(data),
                    method: method,
                    header: requestHeader(header),
                    success ({ statusCode, data }) {
                        if (statusCode === STATUS_CODE.SUCCESS) {
                            resolve(data)
                        } else {
                            reject(data)
                        }
                    },
                    fail (err) {
                        reject(err)
                    }
                })
            })
        }
    }
}

export default Request
