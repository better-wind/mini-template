
let reportData={
    requestData:{
        ip: "ipToBeFilled",   
        // referer: "referer_data",   //来源页面
        platform: "wechatApp",
        os: "",      //sysinfo.platform
        oVersion: "",   //sysinfo.system  
        cVersion: "1.1.7",   //当前发布的版本号，代码版本
        userAgent: "",   //this.sysinfo.model
        sessionId: "",    //生成
        href: "href_data",        //当前路径
        screen: "",  
        appId: ""    
    },
    uuri : '',
    type:'',
    time :'timeToBeFilled',

}

let upData={};

let webpagearr=[]
// let requestData = {
//      ip: "ipToBeFilled",   
//         referer: "referer_data",   //来源页面
//         platform: "wechatApp",
//         os: "os_data",      //sysinfo.platform
//         oVersion: "oVersion_data",   //sysinfo.system  
//         cVersion: "cVersion_data",   //当前发布的版本号，代码版本
//         userAgent: "userAgent_data",   //this.sysinfo.model
//         sessionId: "",    //生成
//         href: "href_data",        //当前路径
//         screen: "screen_data",  
//         appId: "appId_data"    
// };

// let uuri = '', //取不到，默认拿openid
// type = '',  //click,visit,realVisit 3秒后的上报,share 分享,uUpdate 用户更新的上报 
// time = 'timeToBeFilled',
// sc ='';//推广渠道，有的话，每次上报带上
var self;
function initData(that){
    self = that;

    reportData.requestData.sessionId = getSessionId();
    reportData.requestData.os = self.sysinfo.platform;
    reportData.requestData.oVersion = self.sysinfo.system.replace(/[^\d\.]/g,'');
    reportData.requestData.userAgent = self.sysinfo.model;
    reportData.requestData.screen = self.sysinfo.screenWidth+'_'+self.sysinfo.screenHeight;
    reportData.uuri = self.globalData.userinfoUri||self.globalData.openid
   

    self.pageshow = pageshow;
    self.ereport = freport;




};

function getSessionId() {
        var  _sessionId = reportData.requestData.sessionId ;
        if (_sessionId != '') {
            return _sessionId.replace(/[\n\s]+/g, '');
        }
        if (_sessionId === '') {
            const date = new Date();
            const nowDate = date.getFullYear() + (`00${date.getMonth() + 1}`).slice(-2) + (`00${date.getDate()}`).slice(-2) + (`00${date.getHours()}`).slice(-2) + (`00${date.getMinutes()}`).slice(-2) + (`00${date.getSeconds()}`).slice(-2);
            const randStr = `${Math.random().toString(36).substr(2, 5)}${Math.random().toString(36).substr(2, 5)}`;
            _sessionId = `${nowDate}_${randStr}`;
        }
        return _sessionId.replace(/[\n\s]+/g, ''); 
    }


function pageshow(page,isHaveshow){
    setTimeout(()=>{
        var pagePathArr = self.pagePathArr;



        if(page.webUrl){
            reportData.requestData.href = 'https://wsc.weipaitang.com'+page.webUrl
        }else{
            reportData.requestData.href = 'https://wsc.weipaitang.com/'+page.route
        }

        if(webpagearr[webpagearr.length-1]!=reportData.requestData.href){
            if(webpagearr[webpagearr.length-2]==reportData.requestData.href){
                self.pagePathArr.pop();
                webpagearr.pop();
            }else{
                webpagearr.push(reportData.requestData.href)
            }
        }

        if(webpagearr[webpagearr.length-2]){
            reportData.requestData.referer = webpagearr[webpagearr.length-2]
        }else{
            delete reportData.requestData.referer
        }
        reportData.uuri = self.globalData.userinfoUri||self.globalData.openid
        if(!isHaveshow||page.visitCont){
            freport('visit',isHaveshow);

        }else{
            page.visitCont = 1;
        }

    },10)
    
}

function freport(type,pageData){
    if(pageData){
        upData = Object.assign(pageData,reportData)

    }else{
        upData = reportData

    }

    upData.uuri = self.globalData.userinfoUri||self.globalData.openid||'apiresponse2slow'
    upData.type = type;
     if(self.loginfo.appid){
        reportData.requestData.fromAppid = self.loginfo.appid;
    }
    if(self.globalData.cpsUserId){
        upData.shopData = {};
        upData.shopData.cpsId = self.globalData.cpsUserId
    }

    wx.request({
            url: 'https://webbi.weipaitang.com/ereport', 
            method:'POST',
            data: JSON.stringify(upData),
            header: {
                'content-type':'application/x-www-form-urlencoded'
            },
            success: function(res) {
            }
        })


}


module.exports={initData:initData,pageshow:pageshow,ereport:freport};
