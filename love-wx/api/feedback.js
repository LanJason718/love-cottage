import request from '../utils/request.js'

export const postFeedback = data => {
  return request.post('/feedback/submit', data)
}
export const getFeedback = () => {
  return request.get('/feedback/all')
}
