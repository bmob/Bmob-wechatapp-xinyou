
//获取应用实例
var app = getApp()
var common = require('../template/getCode.js')
var Bmob=require("../../utils/bmob.js");
var that;
var molist= new Array();
Page({
  data: {
    moodList: [],
    limit: 6,
    loading: false,
    windowHeight: 0,
    windowWidth: 0
  },
  onLoad: function (options) {
    that = this;
    that.setData({
      loading: false
    })
  },
  onReady: function () {


  },
  onShow: function () {
    var myInterval = setInterval(getReturn, 500);
    function getReturn() {
    wx.getStorage({
              key: 'user_id',
              success: function(ress) {
                  if(ress.data){
                    clearInterval(myInterval)
                      var Diary = Bmob.Object.extend("Diary");
                      var query = new Bmob.Query(Diary);
                      var isme = new Bmob.User();
                      isme.id=ress.data;
                      query.equalTo("publisher", isme);
                      if(that.data.limit==6){
                        query.limit(that.data.limit); 
                      }
                      
                      if(that.data.limit>6){
                        query.limit(2); 
                        query.skip(that.data.limit-2);
                        console.log(that.data.limit)
                      }  
                      query.descending("createdAt");
                      query.find({
                        success: function(results) {
                          that.setData({
                              loading: true
                            });
                          for (var i = 0; i < results.length; i++) {
                            var jsonA;
                            var title=results[i].get("title");
                            var content=results[i].get("content");
                            var id=results[i].id;
                            var created_at=results[i].createdAt;
                            var _url;
                            var ishide=results[i].get("is_hide");
                            var pic=results[i].get("pic");
                            if(pic){
                                jsonA='{"title":"'+title+'","content":"'+content+'","id":"'+id+'","created_at":"'+created_at+'","attachment":"'+pic._url+'","status":"'+ishide+'"}'
                            }
                            else{
                              jsonA='{"title":"'+title+'","content":"'+content+'","id":"'+id+'","created_at":"'+created_at+'","status":"'+ishide+'"}'
                            }
                            var jsonB=JSON.parse(jsonA);
                            molist.push(jsonB)
                            that.setData({
                              moodList:molist,
                              loading: true
                            })
                            
                                            
                          }
                        },
                        error: function(error) {
                            common.dataLoading(error,"loading");
                            that.setData({
                              loading: true
                            })
                            console.log(error)
                        }
                      });
                  }
              }
            }) 
    }
    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
  },
  onHide: function () {
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
