import { uploadImage } from './api/upload'
import { checkLogin } from './utils/auth'
App({
  onLaunch() {
    const updateManager = wx.getUpdateManager()

    updateManager.onUpdateReady(function () {
      // 直接应用新版本，不询问用户
      wx.clearStorage() // 清空本地存储
      updateManager.applyUpdate() // 应用新版本并重启
    })

    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      wx.showModal({
        title: '更新失败',
        content: '新版本下载失败，请检查网络设置。',
      })
    })

    const obj = {
      develop: 'dev',
      trial: 'test',
      release: 'prod',
    }
    this.globalData.env = obj[wx.getAccountInfoSync().miniProgram.envVersion]
    // this.globalData.env = 'prod'
    checkLogin()
  },
  globalData: {},
})
