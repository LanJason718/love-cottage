import request from '../utils/request.js'

//获取物品类别
export const getCategories = () => {
  return request.get('/item/category')
}
//捐赠提交
export const postDonation = data => {
  return request.post('/item/post/donation', data)
}
//领取提交
export const postReceive = data => {
  return request.post('/item/post/receive', data)
}
//根据物品类别id获取捐赠的物品
export const getItemByCateId = data => {
  return request.get('/item/get/category/' + data)
}
