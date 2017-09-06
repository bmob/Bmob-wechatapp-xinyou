//index.js
//获取应用实例
var common = require('../../utils/common.js')
var app = getApp()
var Bmob = require("../../utils/bmob.js");
var that;

Page({
  data: {
    moodList: [],
    limit: 0,
    page: 3,//当前请求的页数
    currentPage: 0,//当前请求的页数
    isload: false,
    isEmpty: true,
    pageSize: 5,//每次加载多少条
    // limit: 2,//跟上面要一致
    loading: false,
    windowHeight1: 0,
    windowWidth1: 0,
    count: 0,
    scrollTop: {
      scroll_top1: 0,
      goTop_show: false
    }
  },

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    console.log('输入了', e.detail.value);

    this.setData({
      inputVal: e.detail.value
    });
    getReturn(this, e.detail.value);
  },
  onLoad: function (t) {

    if (!t) {
      that = this;
      getReturn(that);
    }
  },
  onSetData: function (data) {
    console.log(data.length);
    let page = this.data.currentPage = this.data.currentPage + 1;

    //设置数据
    data = data || [];

    this.setData({
      moodList: page === 1 || page === undefined ? data : this.data.moodList.concat(data),
      isEmpty: data.length === 0 ? false : true,
      isload: true
    });
    console.log(this.data.moodList, page);

  },
  onShow: function (e) {
    var molist = new Array();
    // var myInterval = setInterval(getReturn, 500);

    if (e) {
      that.setData({
        currentPage: 0,
        page: 3,
      })

    }

    this.onLoad();





    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          windowHeight1: res.windowHeight,
          windowWidth1: res.windowWidth
        })
      }
    })
  },

  onShareAppMessage: function () {
    return {
      title: '心邮',
      desc: '倾诉烦恼，邮寄心情，分享快乐',
      path: '/pages/index1/index1'
    }
  },
  // onReachBottom: function (e) {
  //   var limit = that.data.limit
  //   console.log("上拉加载更多...." + that.data.limit)
  //   that.setData({
  //     limit: limit + that.data.pageSize,

  //   });
  //   this.onShow()
  // },
  onReachBottom: function () {
    this.onShow();
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
    var limit = that.data.limit
    console.log("下拉刷新....." + that.data.limit)
    that.setData({
      limit: that.data.pageSize,

    })
    that.onShow(1)
  },
  scrollTopFun: function (e) {
    if (e.detail.scrollTop > 300) {
      this.setData({
        'scrollTop.goTop_show': true
      });
    } else {
      this.setData({
        'scrollTop.goTop_show': false
      });
    }
  },

})


function getReturn(that, value) {

  if (that.data.isEmpty == false) {
    return;
  }


  that.setData({
    loading: false
  });
  var molist = new Array();

   
        // clearInterval(myInterval)
        var Diary = Bmob.Object.extend("Diary");
        var query = new Bmob.Query(Diary);



        query.limit(that.data.page);
        query.skip(that.data.page * that.data.currentPage);


        //条件查询
        query.equalTo("is_hide", "1");

        if (value) {
          query.equalTo("title", { "$regex": "" + value + ".*" });
        }

        query.descending("createdAt");
        query.include("publisher");
        // 查询所有数据
        query.find({
          success: function (results) {

            for (var i = 0; i < results.length; i++) {
              var publisherId = results[i].get("publisher").id;
              var title = results[i].get("title");
              var content = results[i].get("content");
              var id = results[i].id;
              var createdAt = results[i].createdAt;
              var _url;
              var likeNum = results[i].get("likeNum");
              var commentNum = results[i].get("commentNum");
              var pic = results[i].get("pic");
              if (pic) {
                _url = results[i].get("pic")._url;
              }
              else {
                _url = null;
              }
              var name = results[i].get("publisher").get("nickname");
              var userPic = results[i].get("publisher").get("userPic");
              var liker = results[i].get("liker");
              var isLike = 0;
              // for (var j = 0; j < liker.length; j++) {
              //   if (liker[j] == ress.data) {
              //     isLike = 1;
              //     break;
              //   }
              // }
              var jsonA;
              if (pic) {
                jsonA = {
                  "title": title || '',
                  "content": content || '',
                  "id": id || '',
                  "avatar": userPic || '',
                  "created_at": createdAt || '',
                  "attachment": _url || '',
                  "likes": likeNum,
                  "comments": commentNum,
                  "is_liked": isLike || '',
                  "username": name || ''
                }
              }
              else {
                jsonA = {
                  "title": title || '',
                  "content": content || '',
                  "id": id || '',
                  "avatar": userPic || '',
                  "created_at": createdAt || '',
                  "attachment": _url || '',
                  "likes": likeNum,
                  "comments": commentNum,
                  "is_liked": isLike || '',
                  "username": name || ''
                }
              }

              molist.push(jsonA)
              // that.setData({
              //   moodList: molist,
              //   // loading: true
              // })
            }
            that.onSetData(molist, that.data.currentPage);

          },
          error: function (error) {
            common.dataLoading(error, "loading");
            // that.setData({
            //   loading: true
            // })
            console.log(error)
          }
        });

      


}