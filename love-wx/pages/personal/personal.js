let timer = null
Page({
  /**
   * 页面的初始数据
   */
  data: {},

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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
})
