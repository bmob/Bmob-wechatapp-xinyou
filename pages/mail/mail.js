//index.js
//获取应用实例
var common = require('../template/getCode.js')
var app = getApp()
var Bmob=require("../../utils/bmob.js");
var that;
var molist;
Page({
  data: {
    moodList: [],
    limit: 6,
    loading: false,
    windowHeight1: 0,
    windowWidth1: 0,
    scrollTop: {  
      scroll_top1: 0,  
      goTop_show: false  
    }  
  },
  onLoad: function (e) {
    that = this;
    that.setData({
      loading: false
    })

  },
  onShow: function () {
    molist = new Array();
    wx.getStorage({
          key: 'user_id',
          success: function(ress) {
              if(ress.data){
                  var Diary = Bmob.Object.extend("Diary");
                  var query = new Bmob.Query(Diary);
                  // query.limit(that.data.limit);
                  // if(that.data.limit>6){
                  //   query.skip(that.data.limit-2); 
                  // }
                  // else if(that.data.limit==6&&that.data.moodList.length>0){
                  //   query.skip(that.data.limit); 
                  // }
                  query.equalTo("is_hide", "1");
                  query.descending("createdAt");
                  // 查询所有数据
                  query.find({
                    success: function(results) {
                      that.setData({
                          loading: true
                        });
                      for (var i = 0; i < results.length; i++) {
                        var publisherId=results[i].get("publisher").id;
                        var title=results[i].get("title");
                        var content=results[i].get("content");
                        var id=results[i].id;
                        var createdAt=results[i].createdAt;
                        var _url;
                        var likeNum=results[i].get("likeNum");
                        var commentNum=results[i].get("commentNum");
                        var pic=results[i].get("pic");
                        if(pic){
                            _url=results[i].get("pic")._url;
                        }
                        else{
                          _url=null;
                        }
                        that.likeQuery(results[i],publisherId,title,content,id,createdAt,_url,likeNum,commentNum)                       
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

    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          windowHeight1: res.windowHeight,
          windowWidth1: res.windowWidth
        })
      }
    })
  },
  likeQuery:function(mood,publisherId,title,content,id,createdAt,_url,likeNum,commentNum){
    wx.getStorage({
        key: 'user_id',
        success: function(ress) {
            // 查询是否我是否点赞了
            var likes = Bmob.Object.extend("Likes");
            var likeQuery = new Bmob.Query(likes);
            var isme = new Bmob.User();
            isme.id=ress.data;
            likeQuery.equalTo("praiser",isme);
            likeQuery.equalTo("moodId",mood);
            likeQuery.find({
              success: function(likeData) {
                  var isLike=0;
                  if(likeData.length>0){
                    isLike=1;
                  }
                  that.getUserInfo(publisherId,title,content,id,createdAt,_url,likeNum,commentNum,isLike);
              },
              error: function(error) {

              }
            });
        }
    })
    
  },
  getUserInfo:function(userid,title,content,moodid,created_at,pic,likeNum,commentNum,isLike){
    var user = Bmob.Object.extend("_User");
    //创建查询对象，入口参数是对象类的实例
    var userquery = new Bmob.Query(user);
    //查询单条数据，第一个参数是这条数据的objectId值
    userquery.get(userid, {
      success: function(result) {
        var a;
        if(pic){
          a='{"title":"'+title+'","content":"'+content+'","id":"'+moodid+'","avatar":"'+result.get("userPic")+'","created_at":"'+created_at+'","attachment":"'+pic+'","likes":"'+likeNum+'","comments":"'+commentNum+'","is_liked":"'+isLike+'"}'
        }
        else{
          a='{"title":"'+title+'","content":"'+content+'","id":"'+moodid+'","avatar":"'+result.get("userPic")+'","created_at":"'+created_at+'","likes":"'+likeNum+'","comments":"'+commentNum+'","is_liked":"'+isLike+'"}'
        }

        var b=JSON.parse(a);
        molist.push(b)
        that.setData({
          moodList:molist,
          loading: true
        })
      },
      error: function(object, error) {
        // 查询失败
      }
    });
  },
  onShareAppMessage: function () {
    return {
      title: '心邮',
      desc: '倾诉烦恼，邮寄心情，分享快乐',
      path: '/pages/index/index'
    }
  },
  // pullUpLoad: function (e) {
  //   var limit = this.data.limit + 2
  //   this.setData({
  //     limit: limit
  //   })
  //   this.onShow()
  // },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  scrollTopFun: function(e){   
    if(e.detail.scrollTop > 300){
      this.setData({  
        'scrollTop.goTop_show': true  
      });  
    }else{  
      this.setData({  
        'scrollTop.goTop_show': false  
      });  
    }  
  },  
  goTopFun: function(e){  
    var _top=this.data.scrollTop.scroll_top1;//发现设置scroll-top值不能和上一次的值一样，否则无效，所以这里加了个判断  
    if(_top==1){  
      _top=0;  
    }else{  
      _top=1;  
    }  
    this.setData({  
      'scrollTop.scroll_top1': _top  
    });  
    this.onShow();
  }  
})
