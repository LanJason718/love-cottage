import request from '../utils/request.js'

// 图片上传
export const uploadImage = filePath => {
  return new Promise((resolve, reject) => {
    const header = {}
    header[TOKENNAME] = wx.getStorageSync('token')

    wx.uploadFile({
      filePath: filePath,
      name: 'file',
      url: UPLOAD_FILE_PATH,
      header,
      success(res) {
        try {
          const { data: url } = JSON.parse(res.data)
          resolve(url) // 成功时返回图片 URL
        } catch (error) {
          reject('文件上传失败，无法解析返回值')
        }
      },
      fail(error) {
        reject(error)
      },
    })
  })
}

//获取policy 客户端直连oss
export const getPolicy = () => {
  return request.get('/item/upload/policy')
}

//oss前端直传
export function uploadImageByPolicy(tempFilePath) {
  return new Promise(async (resolve, reject) => {
    try {
      const policyData = await getPolicy()
      console.log('policyData已获取')

      const suffix = tempFilePath.substring(tempFilePath.lastIndexOf('.'))
      const randomName = `${Date.now()}${String(Math.random()).substr(3, 6)}${suffix}`
      const uploadedUrl = `${policyData.host}/${policyData.dir}${randomName}`
      const formData = {
        key: `${policyData.dir}${randomName}`,
        OSSAccessKeyId: policyData.ossaccessKeyId,
        signature: policyData.signature,
        policy: policyData.policy,
        success_action_status: 200,
      }

      wx.uploadFile({
        url: policyData.host,
        filePath: tempFilePath,
        name: 'file',
        header: {
          'Content-Type': 'multipart/form-data',
        },
        formData: formData,
        success: () => {
          resolve(uploadedUrl)
        },
        fail: res => {
          reject(new Error('上传失败，状态码: ' + res.statusCode))
        },
      })
    } catch (error) {
      console.error('上传失败:', error)
      reject(error)
    }
  })
}
