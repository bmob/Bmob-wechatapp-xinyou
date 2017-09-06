
//获取应用实例
var common = require('../template/getCode.js')
var Bmob = require("../../utils/bmob.js");
var app = getApp()
var that;
Page({
  data: {
    newList: [],
    limit: 12,
    windowHeight: 0,
    windowWidth: 0
  },
  toSeeDetail: function (e) {
    console.log(e);
    var id = e.target.dataset.wid;
    wx.redirectTo({
      url: '/pages/listDetail/listDetail?moodId=' + id
    })
  },
  onLoad: function (options) {
    this.setData({
      loading: true
    })

    var that = this;
    var Diary = Bmob.Object.extend("reply");
    var query = new Bmob.Query(Diary);

    // var currentUser = Bmob.User.current();
    // console.log(currentUser);
    // if (currentUser) {
    //   var isme = new Bmob.User();
    //   isme.id = currentUser.id;
    //   query.equalTo("uid", isme.id);
    // }
    var user_id = wx.getStorageSync('user_id')

    query.equalTo("fid", user_id);


    // 查询所有数据
    query.find({
      success: function (results) {
        console.log("共查询到 " + results.length + " 条记录", results);
        // 循环处理查询到的数据
        for (var i = 0; i < results.length; i++) {
          var object = results[i];
          results[i].set("ids", 22);
          results[i].ids = 32;
          console.log(object.id + ' - ' + object.get('title'));
        }
        console.log("共查询到 " + results.length + " 条记录", results);
        that.setData({
          newList: results
        })
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });

  },
  onReady: function () {

  },
  onShow: function () {
    this.onLoad();
  },



  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  }

})
