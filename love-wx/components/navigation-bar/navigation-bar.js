
Component({
  properties: {
    navActiveIndex: {
      type: Number,
      value: 0,
    },
    isCheck: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    navBarHeight: '',
    menuRight: '',
    menuTop: '',
    menuHeight: '',
  },
  lifetimes: {
    ready() {
      const systemInfo = wx.getWindowInfo()
      const menuButtonInfo = wx.getMenuButtonBoundingClientRect()
      this.setData({
        navBarHeight: systemInfo.statusBarHeight + 44,
        menuTop: systemInfo.screenWidth - menuButtonInfo.right,
        menuTop: menuButtonInfo.top,
        menuHeight: menuButtonInfo.height,
      })
    },
  },
  methods: {
    backHome() {
      wx.switchTab({
        url: '../../pages/personal/personal',
      })
    },
    onChange(event) {
      this.triggerEvent('onchange', { navActiveIndex: event.detail.name })
    },
  },
})
