import { getRecords } from '../../api/record'
const dayjs = require('dayjs')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    type: 0,
    recordList: [],
    loading: false,
    hasMore: true,
    currentPage: 1, // 当前页码
    pageSize: 10, // 每页的记录数
    totalPages: 0, // 总页数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getRecords()
  },
  onChange(e) {
    this.setData({
      type: e.detail.index,
      currentPage: 1, // 切换 tab 时从第一页重新加载
      recordList: [], // 清空列表
      hasMore: true,
    })
    this.getRecords()
  },

  async getRecords(loadMore = false) {
    if (this.data.loading || !this.data.hasMore) return
    this.setData({ loading: true })
    const userInfo = wx.getStorageSync('userInfo')
    try {
      // 请求分页记录
      const response = await getRecords({
        type: this.data.type,
        userId: userInfo.userId,
        page: this.data.currentPage,
        pageSize: this.data.pageSize,
      })
      let recordList = response.records.map(item => {
        item.createTime = dayjs(item.createTime).format('YYYY年MM月DD日 HH:mm')
        if (item.picture) {
          item.picture = `${item.picture}?x-oss-process=image/resize,w_750/quality,q_80/format,webp`
        }
        return item
      })
      const hasMore = this.data.currentPage < response.pages
      this.setData({
        recordList: loadMore ? [...this.data.recordList, ...recordList] : recordList,
        totalPages: response.pages, // 设置总页数
        hasMore,
      })
    } catch {
      wx.showToast({
        title: '记录获取失败',
        icon: 'none',
      })
    } finally {
      this.setData({ loading: false })
    }
  },
  // 加载更多数据
  async loadMore() {
    if (this.data.hasMore) {
      this.setData({
        currentPage: this.data.currentPage + 1, // 增加页码
      })
      await this.getRecords(true) // 加载更多记录
    }
  },
  preview(e) {
    const { index } = e.detail
    wx.previewImage({
      urls: [this.data.recordList[index]?.picture],
    })
  },
})
