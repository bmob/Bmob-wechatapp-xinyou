//index.js
//获取应用实例
var common = require('../template/getCode.js')
var app = getApp()
var Bmob=require("../../utils/bmob.js");
var that;
var molist= new Array();
Page({
  data: {
    moodList: [],
    limit: 3,
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
    // molist = new Array();
    var myInterval = setInterval(getReturn, 500);
    function getReturn() {
      wx.getStorage({
            key: 'user_id',
            success: function(ress) {
                if(ress.data){
                  clearInterval(myInterval)
                    var Diary = Bmob.Object.extend("Diary");
                    var query = new Bmob.Query(Diary); 
                    if(that.data.limit==3){
                      query.limit(that.data.limit); 
                    }
                    
                    if(that.data.limit>3){
                      query.limit(2); 
                      query.skip(that.data.limit-2);
                      console.log(that.data.limit)
                    }  
                    
                    query.equalTo("is_hide", "1");
                    query.descending("createdAt");
                    query.include("publisher");
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
                          var name=results[i].get("publisher").get("nickname");
                          var userPic=results[i].get("publisher").get("userPic");
                          var liker=results[i].get("liker");
                          var isLike=0;
                          for(var j=0;j<liker.length;j++){
                            if(liker[j]==ress.data){
                                isLike=1;
                                break;
                            }
                          }                                             
                          var jsonA;
                          if(pic){
                             jsonA = {
                              "title" : title || '' ,
                              "content" : content || '',
                              "id" : id || '' ,
                              "avatar" : userPic || '',
                                "created_at": createdAt || '',
                                "attachment":  _url || '',
                                  "likes" : likeNum,
                                  "comments" : commentNum ,
                                  "is_liked" :  isLike || '',
                                    "username" : name || ''
                            }
                          }
                          else{
                             jsonA = {
                              "title" : title || '' ,
                              "content" : content || '',
                              "id" : id || '' ,
                              "avatar" : userPic || '',
                                "created_at": createdAt || '',
                                "attachment":  _url || '',
                                  "likes" : likeNum ,
                                  "comments" : commentNum,
                                  "is_liked" :  isLike || '',
                                    "username" : name || ''
                            }
                          }
                          // var jsonB=JSON.parse(jsonA);
                          molist.push(jsonA)
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
                
              } ,
              fail:function(error){
                console.log("失败")
              }

          })

      }
    
    
    
    
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
      path: '/pages/index/index'
    }
  },
  pullUpLoad: function (e) {
    var limit = that.data.limit + 2
    // console.log("")
    that.setData({
      limit: limit,
      loading: false
    })
    that.onShow()
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
    var context = this;
    var pictures = this.data.pictures;
    pictures.unshift(pictures[Math.round(Math.random()*10%(pictures.length))]);
    setTimeout(function(){
      context.setData({
        pictures:pictures
      })
    },2000)
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
