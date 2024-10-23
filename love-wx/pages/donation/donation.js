import { getCategories, postDonation } from '../../api/item'
import { uploadImageByPolicy } from '../../api/upload'
import { updateUserInfo } from '../../api/user'
import { phoneRegex, nameRegex, gradeRegex } from '../../utils/regex'
import Dialog from '@vant/weapp/dialog/dialog'

Page({
  data: {
    realName: '',
    grade: '',
    phone: '',
    itemName: '',
    number: 1,
    categoryId: 0,
    categories: [],
    fileList: [],
    isLoading: false,
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
  //步进器
  stepChange(e) {
    this.setData({ number: e.detail })
  },
  // 选择分类
  chooseRadio(e) {
    this.setData({ categoryId: e.detail })
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

  //捐赠前的校验处理
  validateForm() {
    const { realName, grade, phone, itemName, categoryId, fileList } = this.data
    if (!realName) return this.showToast('请填写您的姓名~')
    if (!nameRegex.test(realName)) return this.showToast('请输入正确的姓名~')
    if (!grade) return this.showToast('请填写您的年级专业~')
    if (!gradeRegex.test(grade)) return this.showToast('请输入正确的年级专业~')
    if (!phone) return this.showToast('请填写您的手机号~')
    if (!phoneRegex.test(phone)) return this.showToast('手机号格式错误!')
    if (!itemName) return this.showToast('请填写您的捐赠物品名称~')
    if (!categoryId) return this.showToast('请选择您的捐赠物品分类~')
    if (fileList.length === 0) return this.showToast('请拍个照哦~')
    return true
  },

  // 提交捐赠
  async submit() {
    if (this.data.isLoading) return
    if (!this.validateForm()) return
    const userInfo = wx.getStorageSync('userInfo')
    const { realName, grade, phone, itemName, number, categoryId, fileList } = this.data
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
    const donation = {
      userId,
      itemName,
      number,
      categoryId,
      picture: fileList[0]?.url,
    }
    this.setData({ isLoading: true })

    try {
      await postDonation(donation)
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
      title: '捐赠成功',
      message: '若您觉得该物品有纪念意义,可以在左侧墙壁拿取便签,写上物品的故事或寄语,贴在物品上~',
      showCancelButton: true,
      cancelButtonText: '继续捐赠',
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
    this.setData({
      itemName: '',
      number: 1,
      categoryId: '',
      fileList: [],
    })
  },
})
