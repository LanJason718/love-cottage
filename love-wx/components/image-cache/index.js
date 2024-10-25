import { getCacheImage } from './imageCache.js'
Component({
  properties: {
    src: {
      type: String,
      default: '',
    },
    mode: {
      type: String,
      value: 'scaleToFill',
    },
    showMenuByLongpress: {
      type: Boolean,
      value: false,
    },
    fadeIn: {
      type: Boolean,
      value: false,
    },
    webp: {
      type: Boolean,
      value: false,
    },
    lazyLoad: {
      type: Boolean,
      value: false,
    },
  },

  data: {
    imageSrc: '',
  },

  methods: {
    error(e) {
      this.triggerEvent('error', e)
    },
    load(e) {
      this.triggerEvent('load', e)
    },
  },
  lifetimes: {
    async attached() {
      const imageUrl = this.data.src
      const cachedUrl = await getCacheImage(imageUrl)
      this.setData({
        imageSrc: cachedUrl,
      })
    },
  },
})
