
//获取应用实例
var app = getApp();
var common = require('../template/getCode.js')
var that;
Page({
  onLoad: function (options) {
    // common.dataLoading("页面加载中","loading");
    that = this;
    that.setData({
      loading: false,
      isdisabled:false
    })
  },
  onReady: function () {
    wx.hideToast()
  },
  onShow: function () {
    
    var myInterval = setInterval(getReturn, 500);
    function getReturn() {
        wx.getStorage({
          key: 'session_key',
          success: function(ress) {
            if(ress.data){
              clearInterval(myInterval)
              that.setData({
                loading: true
              })
            }
            
          } 
        })
    }
  },
  onHide: function () {
  },
  onUnload: function (event) {
  },
  formSubmit: function (e) {//提交建议
    if (e.detail.value.advise == "" || e.detail.value.advise == null) {
      common.dataLoading("建议不能为空", "loading");
    }
    else {
      
      
    }
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  }
})
