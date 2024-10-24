import { checkLogin } from './utils/auth'
App({
  onLaunch() {
    checkLogin()
  },
  globalData: {},
})
