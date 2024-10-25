Component({
  properties: {
    item: Object,
    index: '',
  },
  data:{
    env: getApp().globalData.env,
  },
  methods: {
    showPop(event) {
      this.triggerEvent('showPop', { index: event.currentTarget.dataset.index })
    },
    preview(event) {
      this.triggerEvent('preview', { index: event.currentTarget.dataset.index })
    },
  },
})
