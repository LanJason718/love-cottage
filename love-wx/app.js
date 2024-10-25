import { checkLogin } from './utils/auth'
App({
  onLaunch() {
    const obj = {
      develop: 'dev',
      trial: 'test',
      release: 'prod',
    }
    this.globalData.env = obj[wx.getAccountInfoSync().miniProgram.envVersion]
    this.globalData.env = 'prod'
    checkLogin()
  },
  globalData: {},
})
