import { wxLogin } from '../api/user'

export const toLogin = () => {
  wx.removeStorageSync('token')
  wx.removeStorageSync('userInfo')
  wx.login({
    success: async (res) => {
      const resp = await wxLogin(res.code)
      console.log(resp)
      wx.setStorageSync('token', resp.token)
      wx.setStorageSync('userInfo', resp.user)
    }
  })
}

export const checkLogin = () => {
  wx.checkSession({
    success() {
      let token = wx.getStorageSync('token')
      if (!token) toLogin()
      else console.log('存在token')
    },
    fail() {
      toLogin()
    }
  })
}
