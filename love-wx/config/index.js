const dev = 'http://127.0.0.1:8822'
const test = 'https://4tedi4092426.vicp.fun'
const prod = ''
const BASE_URL = dev
const UPLOAD_FILE_PATH = BASE_URL + '/api/front/item/uploadImage'
module.exports = {
  BASE_URL,
  UPLOAD_FILE_PATH,
  HEADER: {
    'content-type': 'application/json',
  },

  TOKENNAME: 'Authori-zation',

  //分页最多显示条数
  LIMIT: 10,
}
