import { getCategories, postReceive } from '../../api/item'
import { uploadImageByPolicy } from '../../api/upload'
import { updateUserInfo } from '../../api/user'
import { phoneRegex, nameRegex, gradeRegex } from '../../utils/regex'
import Dialog from '@vant/weapp/dialog/dialog'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    realName: '',
    grade: '',
    phone: '',
    itemId: '',
    number: 1,
    categories: [],
    categoryId: '',
    fileList: [],
    isLoading: false,
    selectedItem: '',
    env: getApp().globalData.env,
  },

  async onLoad(options) {
    const { realName, grade, phone } = wx.getStorageSync('userInfo')
    this.setData({ realName, grade, phone })
    try {
      const categories = await getCategories()
      this.setData({ categories })
    } catch (error) {
      console.error('获取分类失败:', error)
      this.showToast('分类加载失败，请重试')
    }
  },

  onShow() {
    const selectedItem = wx.getStorageSync('current')
    const categoryId = selectedItem.categoryId
    this.setData({ selectedItem, categoryId })
  },

  // 选择分类后导航到选择物品页面
  chooseRadio(e) {
    const categoryId = e.detail
    this.setData({ categoryId })
    wx.navigateTo({ url: `../category/category?categoryId=${categoryId}` })
  },

  //步进器
  stepChange(e) {
    this.setData({ number: e.detail })
  },

  // 选择图片后上传oss
  async afterRead(e) {
    const { file } = e.detail
    wx.showLoading({ title: '图片上传中', mask: true })
    try {
      const uploadedUrl = await uploadImageByPolicy(file.url)
      const fileList = [...this.data.fileList, { ...file, url: uploadedUrl }]
      this.setData({ fileList })
    } catch (error) {
      console.error('图片上传失败:', error)
      wx.showToast({ title: '图片上传失败', icon: 'error' })
    } finally {
      wx.hideLoading()
    }
  },

  // 删除所选择的图片
  deleteClick(e) {
    const { index } = e.detail
    const fileList = this.data.fileList.filter((_, i) => i !== index)
    this.setData({ fileList })
  },

  //校验不通过的弹窗
  showToast(title) {
    wx.showToast({ title, icon: 'none' })
  },

  // 页面卸载时移除缓存
  onUnload() {
    wx.removeStorageSync('current')
  },

  // 校验表单
  validateForm() {
    const { realName, grade, phone, number, selectedItem, fileList } = this.data
    if (!realName) return this.showToast('请填写您的姓名~')
    if (!nameRegex.test(realName)) return this.showToast('请输入正确的姓名~')
    if (!grade) return this.showToast('请填写您的年级专业~')
    if (!gradeRegex.test(grade)) return this.showToast('请输入正确的年级专业~')
    if (!phone) return this.showToast('请填写您的手机号~')
    if (!phoneRegex.test(phone)) return this.showToast('手机号格式错误!')
    if (!selectedItem) return this.showToast('请选择您所要领取的物品~')
    if (selectedItem.number < number) return this.showToast('领取数量不能超过当前物品库存数量哦~')
    if (fileList.length === 0) return this.showToast('请拍个照哦~')
    return true
  },

  // 提交领取物品记录
  async submit() {
    if (this.data.isLoading) return
    if (!this.validateForm()) return

    const userInfo = wx.getStorageSync('userInfo')
    const { realName, grade, phone, selectedItem, number, fileList } = this.data
    const userId = userInfo.userId
    const userInfoChanged = realName !== userInfo.realName || grade !== userInfo.grade || phone !== userInfo.phone
    if (userInfoChanged) {
      // 更新用户信息
      try {
        await updateUserInfo({ userId, realName, grade, phone })
        // 更新本地缓存中的用户信息
        wx.setStorageSync('userInfo', { ...userInfo, realName, grade, phone })
      } catch (error) {
        console.error('更新用户信息失败:', error)
        this.showToast('用户信息更新失败，请重试')
        return
      }
    }
    const receive = {
      userId,
      itemId: selectedItem.itemId,
      number,
      picture: fileList[0]?.url,
    }
    this.setData({ isLoading: true })
    try {
      await postReceive(receive)
      this.showSuccessDialog()
    } catch (error) {
      console.error('捐赠失败:', error)
      this.showToast('捐赠失败，请重试')
    } finally {
      this.setData({ isLoading: false })
    }
  },

  // 显示成功弹窗
  showSuccessDialog() {
    Dialog.alert({
      title: '领取成功',
      message: '请爱惜好它哦~',
      showCancelButton: true,
      cancelButtonText: '继续领取',
    })
      .then(() => {
        wx.switchTab({ url: '../index/index' })
      })
      .catch(() => {
        this.resetForm()
      })
  },

  // 重置表单
  resetForm() {
    wx.removeStorageSync('current')
    this.setData({
      number: 1,
      fileList: [],
      categoryId: '',
      selectedItem: '',
    })
  },
})
