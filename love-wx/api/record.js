import request from '../utils/request.js'

//获取物品类别
export const getRecords = data => {
  return request.post('/record/get', data)
}

//获取饼状图数据
export const getPieData = () => {
  return request.get('/record/pie-chart')
}

//获取折线图数据
export const getLineData = () => {
  return request.get('/record/line-chart')
}
