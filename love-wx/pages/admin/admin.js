import { getRecords, getPieData, getLineData } from '../../api/record'
import { getCategories } from '../../api/item'
import { getFeedback } from '../../api/feedback'
import * as echarts from '../../components/ec-canvas/echarts.min'

const dayjs = require('dayjs')
// 初始化饼图配置
const ecPieOption = {
  series: [],
}

// 初始化折线图配置
const ecLineOption = {
  series: [],
}

// 初始化饼图
function initPieChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width,
    height,
    devicePixelRatio: dpr,
  })
  canvas.setChart(chart)
  chart.setOption(ecPieOption)
  return chart
}

// 初始化折线图
function initLineChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width,
    height,
    devicePixelRatio: dpr,
  })
  canvas.setChart(chart)
  chart.setOption(ecLineOption)
  return chart
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    hasMore: true,
    recordList: [],
    currentPage: 1,
    pageSize: 10,
    totalPages: 0,
    navActiveIndex: 0,
    value_dropdown: '全部',
    categoryId: '',
    option1: [
      { text: '全部', value: '全部' },
      { text: '姓名', value: '姓名' },
      { text: '日期', value: '日期' },
      { text: '物品名称', value: '物品名称' },
      { text: '物品类别', value: '物品类别' },
    ],
    option2: [],
    realName_search: '',
    itemName_search: '',
    type: 2,
    recordPopShow: false,
    selected: '',
    dateShow: false,
    date: '',
    start: '',
    end: '',
    minDate: new Date(2023, 11, 7).getTime(),
    maxDate: new Date().getTime(),
    loadingSkeleton: true,
    feedbackList: [],
    ecPie: {
      onInit: initPieChart,
    },
    ecLine: {
      onInit: initLineChart,
    },
  },
  //饼状图
  async pieData() {
    const res = await getPieData()
    const donationNum = res.donationNum
    const receiveNum = res.receiveNum
    const colorPalette = ['#E84545', '#4169E1', '#FFD700']
    ecPieOption.series = [
      {
        type: 'pie',
        radius: '50%',
        data: [
          {
            value: donationNum,
            name: '总捐赠数',
            itemStyle: {
              color: colorPalette[0],
            },
            label: {
              show: true,
              formatter: '{b} : {c} ',
              overflow: 'break',
            },
          },
          {
            value: receiveNum,
            name: '总领取数',
            label: {
              show: true,
              formatter: '{b} : {c} ',
              overflow: 'break',
            },
            itemStyle: {
              color: colorPalette[1],
            },
          },
          {
            value: donationNum - receiveNum,
            name: '库存',
            label: {
              show: true,
              formatter: '{b} : {c} ',
              overflow: 'break',
            },
            itemStyle: {
              color: colorPalette[2],
            },
          },
        ],
      },
    ]
    this.setData(
      {
        ecPieOption,
      },
      () => {
        this.selectComponent('#mychart-dom-pie').init((canvas, width, height, dpr) => {
          const chart = echarts.init(canvas, null, {
            width: width,
            height: height,
            devicePixelRatio: dpr,
          })
          canvas.setChart(chart)

          chart.setOption(ecPieOption)
          return chart
        })
      }
    )
  },
  //折线图
  async lineData() {
    try {
      const res = await getLineData()
      // 确保返回的数据格式正确
      const receivedSeries = []
      const donatedSeries = []
      const dates = []

      // 遍历后端返回的数据
      res.forEach(item => {
        dates.push(item.date) // 获取日期
        receivedSeries.push(item.receiveNum) // 获取领取数
        donatedSeries.push(item.donationNum) // 获取捐赠数
      })
      // 调用方法绘制图表
      this.renderLineChart(dates, receivedSeries, donatedSeries)
    } catch (error) {
      console.error('获取折线图数据失败:', error)
    }
  },
  renderLineChart(dates, receivedSeries, donatedSeries) {
    const lineSeries = [
      {
        name: '领取数',
        type: 'line',
        data: receivedSeries,
        smooth: true,
        itemStyle: {
          color: '#00D2FF',
        },
      },
      {
        name: '捐赠数',
        smooth: true,
        type: 'line',
        data: donatedSeries,
        itemStyle: {
          color: '#FF4F00',
        },
      },
    ]

    const ecLineOption = {
      xAxis: {
        type: 'category',
        data: dates, // 使用从后端获取的日期数据
      },
      yAxis: {
        type: 'value',
        // 可根据需要设置 Y 轴的其他属性
      },
      tooltip: {
        // 添加 tooltip 配置
        trigger: 'axis', // 触发类型，'axis' 表示在坐标轴上触发显示
      },
      legend: {
        data: ['领取数', '捐赠数'],
      },
      dataZoom: [
        {
          type: 'inside', // 放大和缩小
          orient: 'vertical',
        },
        {
          type: 'inside',
        },
      ],
      series: lineSeries,
    }

    this.setData(
      {
        ecLineOption,
      },
      () => {
        this.selectComponent('#mychart-dom-line').init((canvas, width, height, dpr) => {
          const chart = echarts.init(canvas, null, {
            width: width,
            height: height,
            devicePixelRatio: dpr,
          })
          canvas.setChart(chart)

          chart.setOption(ecLineOption)
          return chart
        })
      }
    )
  },
  // 切换导航项
  onchangeNavigation(e) {
    const navActiveIndex = e.detail.navActiveIndex
    this.setData({ navActiveIndex })
    if (navActiveIndex === 1) {
      this.pieData()
      this.lineData()
    } else if (navActiveIndex === 2) {
      this.gotoLookOpinions()
    }
  },
  // 下拉菜单选项改变时调用
  async dropdownChange(e) {
    const value_dropdown = e.detail
    this.setData({
      value_dropdown,
      realName_search: '',
      name_search: '',
      start: '',
      end: '',
      date: '',
      categoryId: '',
    })

    if (value_dropdown === '全部') {
      this.reset()
      this.getRecords()
    } else if (value_dropdown === '物品类别') {
      this.reset()
      this.setData({ categoryId: this.data.option2[0]?.value || '' })
      this.getRecords()
    }
  },
  // 物品类别选项改变时调用
  dropdownChange2(e) {
    const categoryId = e.detail
    this.setData({ categoryId })
    this.reset()
    this.getRecords()
  },
  // 获取记录，支持加载更多
  async getRecords(loadMore = false) {
    if (this.data.loading || !this.data.hasMore) return
    this.setData({ loading: true })
    try {
      const { realName_search, itemName_search, start, end, categoryId } = this.data
      const params = {
        realName: realName_search || '',
        name: itemName_search || '',
        start: start || '',
        end: end || '',
        categoryId: categoryId || '',
      }
      const response = await getRecords({
        type: this.data.type,
        page: this.data.currentPage,
        pageSize: this.data.pageSize,
        ...params,
      })

      let recordList = response.records.map(item => ({
        ...item,
        createTime: dayjs(item.createTime).format('YYYY年MM月DD日 HH:mm'),
      }))
      this.setData({
        recordList: loadMore ? [...this.data.recordList, ...recordList] : recordList,
        totalPages: response.pages, // 设置总页数
        hasMore: this.data.currentPage < response.pages,
        loadingSkeleton: false,
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
  // 搜索确认时调用
  searchConfirm() {
    this.reset()
    this.getRecords()
  },

  recordTypeChange(e) {
    let type = e.detail.name
    this.reset(type)
    this.getRecords()
  },

  reset(type) {
    this.setData({
      type: type ? type : '2',
      currentPage: 1,
      recordList: [],
      hasMore: true,
      loadingSkeleton: true,
    })
  },
  // 打开日期选择框
  dateShoww() {
    this.setData({ dateShow: true })
  },

  // 关闭日期选择框
  dateClose() {
    this.setData({ dateShow: false })
  },

  // 确认日期选择时调用
  async dateConfirm(e) {
    this.reset()
    let [start, end] = e.detail
    // 获取时间戳
    const startTimestamp = dayjs(start).startOf('day').valueOf()
    const endTimestamp = dayjs(end).endOf('day').valueOf()

    this.setData({
      start: startTimestamp,
      end: endTimestamp,
      dateShow: false,
      date: `${dayjs(start).format('YYYY-MM-DD')} ~ ${dayjs(end).format('YYYY-MM-DD')}`,
    })
    this.getRecords()
  },
  preview(e) {
    const { index } = e.detail
    wx.previewImage({
      urls: [this.data.recordList[index]?.picture],
    })
  },
  showPop(e) {
    const { index } = e.detail
    this.setData({
      recordPopShow: true,
      selected: this.data.recordList[index],
    })
  },
  onClose() {
    this.setData({ recordPopShow: false })
  },

  async onLoad(options) {
    this.getRecords()
    const categories = await getCategories()
    const option2 = categories.map(item => ({
      text: item.name,
      value: item.categoryId,
    }))
    this.setData({ option2 })
  },
  //去反馈页面
  async gotoLookOpinions() {
    this.setData({
      navActiveIndex: '2',
    })
    this.getFeedback()
  },
  async getFeedback() {
    let res = await getFeedback()
    res = res.map(item => ({
      ...item,
      createTime: dayjs(item.createTime).format('YYYY年MM月DD日 HH:mm'),
    }))
    this.setData({ feedbackList: res })
  },
})
