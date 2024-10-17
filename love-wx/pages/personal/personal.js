let timer = null
Page({
  /**
   * 页面的初始数据
   */

  data: { env: getApp().globalData.env },

  // 按下时启动定时器
  handleTouchStart: function () {
    const that = this
    timer = setTimeout(() => {
      that.longpress()
    }, 1000)
  },

  // 松开时清除定时器
  handleTouchEnd: function () {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  },

  // 长按触发的事件
  longpress: function () {
    wx.navigateTo({
      url: '../admin/admin',
    })
  },
  clearCache() {
    wx.clearStorage({
      success: function () {
        wx.showToast({
          title: '清理缓存成功',
          icon: 'none',
          duration: 1000,
        })
      },
      fail: function () {
        wx.showToast({
          title: '清理缓存失败',
          icon: 'none',
          duration: 1000,
        })
      },
    })
  },
})
