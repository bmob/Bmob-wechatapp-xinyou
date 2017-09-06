
//获取应用实例
var app = getApp()
var common = require('../template/getCode.js')
var Bmob = require("../../utils/bmob.js");
var Diary = Bmob.Object.extend("Diary");
var query = new Bmob.Query(Diary);
var that;
var molist = new Array();
var iNow=0
Page({
  data: {
    moodList: [],
    limit: 0,
    init: false,
    length:0,
    loading: false,
    windowHeight: 0,
    windowWidth: 0
  },
  onLoad: function (options) {
    that = this;
    that.setData({
      loading: false
    })

   //查询有多少条数据,保存这个值方便页面再次进来的时候进行判断数据库是否更新
    wx.getStorage({
      key: 'user_id',
      success: function (ress) {
        if (ress.data) {
          var isme = new Bmob.User();
          isme.id = ress.data;
          query.equalTo("publisher", isme.id);
          query.find({
            success: function (results) {
                that.setData({
                  length: results.length,
                })
            }
          });
        }
      }
    })
    
    //每一次范围进行更新4条数据
    this.getData()
  },
  onShow: function(){
    that = this
    //判断页面是否是隐藏之后在重新进入的。如果是重新进入则重新读取数据。
    if (this.data.init){
      wx.getStorage({
        key: 'user_id',
        success: function (ress) {
          if (ress.data) {
            var Diary = Bmob.Object.extend("Diary");
            var query = new Bmob.Query(Diary);
            var isme = new Bmob.User();
            isme.id = ress.data;
            query.equalTo("publisher", isme.id);
            
            query.find({
              success: function (results) {
                console.log(that.data.length, results.length)
                if (that.data.length != results.length){
                  iNow = 0;
                  molist = new Array();
                  that.getData()
                  that.setData({
                    init: false,
                    length: results.length,
                  })
                }
              }
            });
          }
        }
      })
    }
  },
  onHide:function(){
    this.setData({
      init:true
    })
  },
  onReachBottom: function () {

    this.getData()
    iNow++
  },
  getData:function(){
    wx.getStorage({
      key: 'user_id',
      success: function (ress) {
        if (ress.data) {
          var isme = new Bmob.User();
          isme.id = ress.data;
          query.equalTo("publisher", isme.id);
          query.descending("createdAt");

          query.skip(iNow * 4);
          query.limit(4);
          
          query.find({
            success: function (results) {
              that.setData({
                loading: true
              });

              for (var i = 0; i < results.length; i++) {
                var jsonA;
                var title = results[i].get("title");
                var content = results[i].get("content");
                var id = results[i].id;
                var created_at = results[i].createdAt;
                var _url;
                var ishide = results[i].get("is_hide");
                var pic = results[i].get("pic");
                if (pic) {
                  jsonA = '{"title":"' + title + '","content":"' + content + '","id":"' + id + '","created_at":"' + created_at + '","attachment":"' + pic._url + '","status":"' + ishide + '"}'
                }
                else {
                  jsonA = '{"title":"' + title + '","content":"' + content + '","id":"' + id + '","created_at":"' + created_at + '","status":"' + ishide + '"}'
                }
                var jsonB = JSON.parse(jsonA);
                molist.push(jsonB)
              }
              that.setData({
                moodList: molist,
                loading: true
              })
              console.log(that.data.moodList)
            },
            error: function (error) {
              common.dataLoading(error, "loading");
              that.setData({
                loading: true
              })
              console.log(error)
            }
          });
        }
      }
    })
    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
  },
  onUnload: function (event) {

  },
  pullUpLoad: function (e) {
    var limit = this.data.limit + 2
    that.setData({
      limit: limit
    })
    this.onShow()
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  }

})
