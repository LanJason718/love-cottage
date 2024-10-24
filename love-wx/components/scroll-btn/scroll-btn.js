Component({
  options: {
    multipleSlots: true,
  },
  properties: {
    title: {
      type: String,
      value: '提交',
    },
    height: {
      type: Number,
      value: 20,
    },
  },

  data: {
    safeBottom: '0px',
  },
  lifetimes: {
    ready() {
      const systemInfo = wx.getWindowInfo()
      this.setData({
        safeBottom: systemInfo.screenHeight - systemInfo.safeArea.bottom + 'px',
      })
    },
  },
  methods: {
    onSubmit() {
      this.triggerEvent('onSubmit')
    },
  },
})
