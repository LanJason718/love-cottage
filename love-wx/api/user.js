import request from '../utils/request.js'

//微信登陆
export const wxLogin = code => {
  return request.get('/user/login', { code })
}

export const updateUserInfo= data=>{
  return request.post('/user/info/update', data)
}