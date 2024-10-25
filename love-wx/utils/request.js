import { toLogin } from './auth'
import { BASE_URL, HEADER, TOKENNAME } from '../config/index.js'

function baseRequest(url, method, data, loading) {
  let header = HEADER
  header[TOKENNAME] = wx.getStorageSync('token') || ''

  if (loading) {
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_URL + '/api/front' + url,
      method,
      data,
      header,
      success(res) {
        const { data } = res
        switch (data.code) {
          case 200:
            resolve(data.data)
            break
          case 401:
            toLogin()
            wx.showToast({
              icon: 'none',
              title: '网络出了差错,请再次尝试',
            })
            break
          default:
            wx.showToast({
              icon: 'none',
              title: data.msg || '请求失败',
            })
            reject(data)
        }
      },
      fail(err) {
        wx.showToast({
          icon: 'none',
          title: '请求失败',
        })
        reject(err)
      },
      complete() {
        if (loading) {
          wx.hideLoading()
        }
      },
    })
  })
}
const request = {}

;['get', 'post', 'put', 'delete'].forEach(method => {
  request[method] = (api, data, opt, loading) => baseRequest(api, method, data, loading || false)
})

export default request
