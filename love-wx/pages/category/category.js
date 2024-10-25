import { getCategories, getItemByCateId } from '../../api/item'

const dayjs = require('dayjs')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    categories: [],
    activeKey: 0,
    itemList: [],
    env: getApp().globalData.env,
  },

  showToast(title) {
    wx.showToast({ title, icon: 'none' })
  },

  async onLoad(options) {
    //获取分类
    const categoryId = options.categoryId
    let categories
    try {
      categories = await getCategories()
      this.setData({ categories })
    } catch (error) {
      console.error('获取分类失败:', error)
      this.showToast('分类加载失败，请重试')
    }
    //sidebar选中
    const activeKey = categories.findIndex(item => item.categoryId == categoryId)
    this.setData({ activeKey })
    //获取数据
    this.getItemByCateId(categoryId)
  },

  async getItemByCateId(categoryId) {
    try {
      let itemList = await getItemByCateId(categoryId)
      itemList = itemList.map(item => {
        item.createTime = dayjs(item.createTime).format('YYYY年MM月DD日')
        return item
      })
      this.setData({ itemList })
    } catch {
      console.error('获取数据失败:', error)
      this.showToast('获取数据失败，请重试')
    }
  },

  onChange(e) {
    const index = e.detail
    const categoryId = this.data.categories[index].categoryId
    this.getItemByCateId(categoryId)
  },

  //预览图片
  preview(e) {
    console.log(e)
    const index = e.currentTarget.dataset.index
    const current = this.data.itemList[index]
    wx.previewImage({
      urls: [current.picture],
    })
  },

  //确定选择
  confirm(e) {
    const index = e.currentTarget.dataset.index
    const current = this.data.itemList[index]
    wx.setStorageSync('current', current)
    wx.navigateBack()
  },
})
