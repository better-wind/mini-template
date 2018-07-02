import CONFIG from '../config/setting.js'

/**
 *
 * @param options
 */
function showToast (options = {}) {
    wx.showToast(Object.assign({
        title: '成功',
        mask: 'true',
        icon: 'success',
        duration: CONFIG.duration
    }, options))
}

/**
 *
 * @param options
 */
function showModal (options = {}) {
    wx.showModal(Object.assign({}, {
        title: '标题',
        content: '',
        cancelColor: CONFIG.disabledColor,
        confirmColor: CONFIG.primaryColor
    }, options))
}

/**
 *
 */
export default {
    showToast,
    showModal,
    request:wx.request,
    getSystemInfo:wx.getSystemInfo,
    login:wx.login,
    navigateTo:wx.navigateTo,
    redirectTo:wx.redirectTo
}