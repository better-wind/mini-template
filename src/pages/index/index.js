import regeneratorRuntime from '../../libs/regenerator'
Page({
    onLoad(){
        this.getUser()
    },
    getUser:async function(){
        var res = await getApp().wxPromise(wx.getUserInfo)()
        console.log(res)
    }
})