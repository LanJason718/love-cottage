// pages/opinion/opinion.js
import { postFeedback } from '../../api/feedback'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    value: '',
    loading: false,
  },
  async submit() {
    const content = this.data.value
    if (content == '') {
      wx.showToast({
        title: '内容不能为空哦~',
        icon: 'none',
      })
    } else {
      if (this.data.loading) return
      this.setData({ loading: true })
      const userId = wx.getStorageSync('userInfo').userId
      try {
        const res = await postFeedback({ content, userId })
        wx.showToast({
          title: '提交成功,感谢您宝贵的建议',
          icon: 'none',
        })
        setTimeout(() => {
          this.setData({ loading: false })
          wx.navigateBack()
        }, 1500)
      } catch {
        this.setData({ loading: false })
        wx.showToast({
          title: '提交失败',
          icon: 'none',
        })
      }
    }
  },
})
