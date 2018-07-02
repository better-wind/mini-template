

// var freport = require('./utils/report.js');
import Tools from './utils/tools'
import WPT from './utils/global'
import Request from './utils/request'
import ENV from './config/env'
import wxPrimise from './utils/wxPromise'
import wxAPI from './utils/wxAPI'
import regeneratorRuntime from './libs/regenerator'

App({
    Tools:new Tools,
    WPT:new WPT,
    Request:new Request,
    ENV:ENV.production ? ENV.pro : ENV.dev,
    wxAPI:wxAPI,
    wxPromise:wxPrimise,

    async onLaunch(options){
        try {
            this.sysinfo = await wxPrimise(wxAPI.getSystemInfo)()
        } catch (e) {
            
        }
        this.getopenId()
    },
    /**
     * 登录获取openid
     * @param cb
     * @returns {Promise<void>}
     */
    async getopenId(cb){
        let login = this.requestLogin()
        if(!login) return
        this.requestToken({
            url:'/v1.0/token/to-code',
            data:{code:login.code}
        },cb)

    },
    /**
     *
     * @returns {Promise<*>}
     */
    async requestLogin(){
        let login
        try {
            login = await wxPrimise(wxAPI.login)()
        } catch (e) {
            console.log('登陆失败')
            // console.log(e)
        }
        return login
    },
    /**
     *
     * @param perams
     * @param cb
     * @returns {Promise<void>}
     */
    async requestToken(perams,cb){
        let token
        try{
            token = await this.Request.get(perams)
            if (token.data.code == 0) {
                this.changeData(token)
                cb && cb(token.data.data.session_token);

            }
        } catch (e) {

        }
    },
    /**
     * 在接口如果是900的时候，会吊起重新登录模式在一次获取信息 去webview时要有登录信息
     * @param cb
     */
    getrequestcode(cb) {
        this.getopenId(cb)
    },
    /**
     * 改变全局的变量和登录信息
     * @param token
     */
    changeData(token){
        this.globalData.sessionToken = token.data.data.sessionToken||'';
        this.globalData.nickname = token.data.data.nickname||'';
        this.globalData.headimgurl = token.data.data.headimgurl||'';
        this.globalData.hasTelephone = token.data.data.hasTelephone||'';
        this.globalData.buyerLevel = token.data.data.buyerLevel||'';
        this.globalData.userinfoUri = token.data.data.userinfoUri||'';
        this.globalData.xToken= token.data.data.xToken||'';
        this.globalData.openid = token.data.data.openid||'';
        this.globalData.isLogin = token.data.data.isLogin||'';
        this.globalData.isSubscribe = token.data.data.isSubscribe||'';
        this.globalData.memberLevel = token.data.data.memberLevel||'';
        this.globalData.memberTime = token.data.data.memberTime||'';
        this.globalData.sellerLevel = token.data.data.sellerLevel||''
    },
    /**
     * 页面刚进来时的验证  ，如果第一个页面需要登录才能判定时，通过这个回调
     * @param cb
     */
    checksessionToken(cb){
        if(this.globalData.sessionToken!=''){
            typeof cb == "function" && cb(this.globalData.sessionToken);
            return
        }
        this.getopenId(cb)
    },
    /**
     * 所有授权的页面  在页面中需要按钮授权时点取这个方法
     * @param info
     * @param cb
     */
    pageUserinfo(info,cb){
        if(this.globalData.sessionToken){
            typeof cb == "function" && cb();
        }else{
            let login = this.requestLogin()
            if(!login) return
            this.requestToken({
                url:'/v1.0/token/get',
                data: { code: login.code, encryptedData: info.encryptedData, iv: info.iv, rawData: info.rawData, signature: info.signature },
            },cb)
        }
    },
    /**
     * 收集formid 的请求
     * @param id
     */
    getFormid(id) {
        this.Request.get({
            url:'/v1.0/affair/get-form-id',
            data:{ formId:id ,openid:this.globalData.openid },
        }).then((rs)=>{

        })
    },

    /**
     * 到小程序原生页面
     * @param url
     */
    goMiniurl(url){
        var pagesnum = getCurrentPages().length;
        if(pagesnum<5){
            wxAPI.navigateTo({
                url: url
            })
        }else{
            wxAPI.redirectTo({
                url: url
            })
        }
    },
    /**
     * 去webview
     * @param url
     */
    gowebView(url) {
      var xToken = this.globalData.xToken;
      var host = this.ENV.webHost;
      if(xToken==""){
        this.getrequestcode(()=>{
            var weburl = host+url;
            this.goMiniurl('/pages/home/index?path=' + encodeURIComponent(weburl))
        })
      }else{
        var weburl = host+url;
        this.goMiniurl('/pages/home/index?path=' + encodeURIComponent(weburl))
      }
    },

    data: {
        session_token: ''
    },
    shareData:{
        fr:''
    },
    globalData: {
        sessionToken:'',
        nickname:'',
        headimgurl:'',
        hasTelephone:'',
        buyerLevel:'',
        userinfoUri:'',
        xToken:'',
        openid:'',
        isLogin:'',
        isSubscribe:'',
        memberLevel:'',
        memberTime :'',
        sellerLevel:''
    },
    // 手机系统信息
    sysinfo: {},
    //需要的page中的全局属性，助于页面跳转
    pageConfig: {}
})