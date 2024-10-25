const fs = wx.getFileSystemManager()
let downloadingImages = {}

export async function getCacheImage(imageUrl) {
  const imageCache = wx.getStorageSync('imageCache') || []
  const cachedItem = imageCache.find(item => item.webUrl === imageUrl)
  if (cachedItem) {
    try {
      fs.accessSync(cachedItem.cacheUrl)
      console.log('本地已有图片')
      return cachedItem.cacheUrl
    } catch (e) {
      removeCache(imageCache, imageUrl)
    }
  }
  console.log('本地没有图片，进行下载')
  downloadImage(imageUrl)
  return imageUrl
}

function removeCache(imageCache, imageUrl) {
  const index = imageCache.findIndex(item => item.webUrl === imageUrl)
  if (index > -1) {
    imageCache.splice(index, 1)
    wx.setStorageSync('imageCache', imageCache)
  }
}

function downloadImage(imageUrl) {
  if (downloadingImages[imageUrl]) {
    return new Promise(resolve => {
      downloadingImages[imageUrl].push(resolve)
    })
  }
  downloadingImages[imageUrl] = []
  return new Promise((resolve, reject) => {
    wx.downloadFile({
      url: imageUrl,
      success(res) {
        if (res.statusCode === 200) {
          const filePath = res.tempFilePath
          updateCache(imageUrl, filePath)
          downloadingImages[imageUrl].forEach(r => {
            r(filePath)
          })
          delete downloadingImages[imageUrl]
          resolve(filePath)
        } else {
          reject(`下载失败，状态码: ${res.statusCode}`)
        }
      },
      fail(err) {
        downloadingImages[imageUrl].forEach(r => r(imageUrl))
        delete downloadingImages[imageUrl]
        reject(err)
      },
    })
  })
}

function updateCache(imageUrl, filePath) {
  const imageCache = wx.getStorageSync('imageCache') || []
  const newCacheItem = {
    webUrl: imageUrl,
    cacheUrl: filePath,
  }
  imageCache.push(newCacheItem)
  wx.setStorageSync('imageCache', imageCache)
}
