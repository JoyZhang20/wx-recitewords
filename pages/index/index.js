// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    plainText: '',
    index: 0,
    arrLen: 0,
    enArr: [],
    zhArr: [],
    enShow: 'en',
    chShow: 'zh',
    failedWords: '',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  shuffle: function (a) {
    return a.concat().sort(function (a, b) {
      return Math.random() - 0.5;
    });
  },
  initWord: function (e) {
    var pointer = this
    wx.getClipboardData({
      success(res) {
        var tempText = res.data
        var arr = tempText.split("\n")
        arr = pointer.shuffle(arr)
        var enList = []
        var zhList = []
        for (var i = 0; i < arr.length; i++) {
          var mapItem = arr[i].split(" ");
          enList.push(mapItem[0])
          zhList.push(mapItem[1])
        }
        pointer.enArr = enList
        pointer.zhArr = zhList
        pointer.setData({
          index: 0,
          enShow: pointer.enArr[0],
          chShow: pointer.zhArr[0],
          arrLen: pointer.enArr.length,
          plainText: ''
        })
      }
    })

  },
  clickButton: function () {
    var temp = (this.data.index) % this.data.arrLen
    if (temp == 0) {
      temp = this.data.arrLen - 1
    }
    this.data.index = ((this.data.index + 1) % this.data.arrLen)
    // console.log(this.data.index)
    this.setData({
      enShow: this.enArr[this.data.index],
      chShow: this.zhArr[temp],
      index: this.data.index
    })
  },
  backIndex: function () {
    if (this.data.index >= 1) {
      this.data.index--
      var temp = this.data.index - 1
      this.setData({
        enShow: this.enArr[this.data.index],
        chShow: this.zhArr[temp],
        index: this.data.index
      })
    }
  },
  markWord: function () {
    this.data.plainText += (this.enArr[this.data.index] + " " + this.zhArr[this.data.index] + "\n")
    this.setData({
      plainText: this.data.plainText
    })
    this.clickButton();
  },
  copyWords: function () {
    var pointer=this
    wx.setClipboardData({
      data: this.data.plainText.substr(0, this.data.plainText.length - 1),
      success: function (res) {
        wx.showToast({
          title: '复制成功'
        }),
        pointer.setData({
          plainText: ''
        })
      }
    })
  }

})
