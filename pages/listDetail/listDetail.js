
//获取应用实例
var app = getApp()
var that;
var optionId;
var common = require('../template/getCode.js')
var Bmob=require("../../utils/bmob.js");
var commentlist;
Page({
  data:{
      limit:5,
      showImage:false ,
      loading:false,
      isdisabled:false,
      commentLoading:false,
      isdisabled1:false,
      recommentLoading:false,
      commentList:[]
  },
  
  onLoad: function(options) {   
      that=this;
      optionId=options.moodId;
      
  },
  onReady:function(){
     wx.hideToast() 
     
  },
  onShow: function() {
     
      var myInterval=setInterval(getReturn,500);
      function getReturn(){
          wx.getStorage({
            key: 'user_id',
            success: function(ress) {
              if(ress.data){
                clearInterval(myInterval)
                var Diary = Bmob.Object.extend("Diary");
                var query = new Bmob.Query(Diary);
                query.equalTo("objectId", optionId);
                query.find({
                    success: function(result) {
                      var title=result[0].get("title");
                      var content=result[0].get("content");
                      var publisher=result[0].get("publisher");
                      var agreeNum=result[0].get("likeNum");
                      var commentNum=result[0].get("commentNum");
                      var ishide=result[0].get("is_hide");
                      var isPublic;
                      that.getPushliserInfo(publisher.id);
                      
                      var url;
                      if(result[0].get("pic")){
                        url=result[0].get("pic")._url;
                      }
                      else{
                        url=null;
                      }
                      if(publisher.id==ress.data){
                        that.setData({
                          isMine:true
                        })
                      }
                      if(ishide==0){
                        isPublic=false;
                      }
                      else{
                        isPublic=true;
                      }
                      that.setData({
                        listTitle:title,
                        listContent:content,
                        listPic:url,
                        agreeNum:agreeNum,
                        commNum:commentNum,
                        ishide:ishide,
                        isPublic:isPublic
                      })
                      that.setData({
                          loading: true
                      });
                      that.likeQuery(result[0]);
                      that.commentQuery(result[0]);

                    },
                    error: function(error) {
                        // common.dataLoading(error,"loading");
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

  },
  commentQuery:function(mood){
      // 查询评论
      commentlist=new Array();
      var Comments = Bmob.Object.extend("Comments");
      var queryComment = new Bmob.Query(Comments);
      queryComment.equalTo("mood", mood);
      queryComment.descending("createdAt");
      queryComment.find({
          success: function(result) {
            for(var i=0;i<result.length;i++){
              var id=result[i].id;
              var pid=result[i].get("olderComment");
              var uid=result[i].get("publisher").id;
              var content=result[i].get("content");
              var created_at=result[i].createdAt;
              var olderUserName;
              if(pid){
                pid=pid.id;
                olderUserName=result[i].get("olderUserName");
              }
              else{
                pid=0;
                olderUserName="";
              }
              that.commentUserQuery(id,pid,uid,content,created_at,olderUserName);

            }
          },
          error: function(error) {
              // common.dataLoading(error,"loading");
              console.log(error)
          }
        }); 

  },
  commentUserQuery:function(id,pid,uid,content,created_at,olderUserName){
    var user = Bmob.Object.extend("_User");
    //创建查询对象，入口参数是对象类的实例
    var userquery = new Bmob.Query(user);
    //查询单条数据，第一个参数是这条数据的objectId值
    userquery.get(uid, {
      success: function(result) {
        var a;
          a='{"id":"'+id+'","content":"'+content+'","pid":"'+pid+'","uid":"'+uid+'","created_at":"'+created_at+'","pusername":"'+olderUserName+'","username":"'+result.get("username")+'","avatar":"'+result.get("userPic")+'"}'; 
        var b=JSON.parse(a);
        commentlist.push(b)
        that.setData({
          commentList:commentlist,
          loading: true
        })
      },
      error: function(object, error) {
        // 查询失败
      }
    });
  },
  likeQuery:function(mood){
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
                 that.setData({
                   agree:isLike
                 })
              },
              error: function(error) {

              }
            });
        }
    })
    
  },
  getPushliserInfo:function(userid){
    var user = Bmob.Object.extend("_User");
    //创建查询对象，入口参数是对象类的实例
    var userquery = new Bmob.Query(user);
    //查询单条数据，第一个参数是这条数据的objectId值
    userquery.get(userid, {
      success: function(result) {
        var userNick=result.get("username");
        var userPic_url;
        var userPic=result.get("userPic");
        if(userPic){
            userPic_url=userPic;
        }     
        else{
            userPic_url=null;
        }
        that.setData({
          userPic:userPic_url,
          userNick:userNick
        })
      },
      error: function(object, error) {
        // 查询失败
      }
    });
  },
  onShareAppMessage: function () {
    if(that.data.isPublic==true){
      return {
        title:that.data.listTitle,
        desc: that.data.listContent,
        path: '/pages/listDetail/listDetail?moodId='+optionId,
      }
    }
    else if(that.data.isPublic==false){
        wx.showToast({
          title: "私密心情不支持分享",
          icon: "loading",
          duration:1000
        })
        return {
          title:"心邮",
          desc: "倾诉烦恼，邮寄心情，分享快乐",
          path: '/pages/mail/mail',
        }
    }
    
  },
  changeLike:function(event){//点赞
    var isLike=that.data.agree
    var likeNum=parseInt(this.data.agreeNum)
    if(isLike=="0"){
      likeNum=likeNum+1;
      that.setData({
        agree:1,
        agreeNum:likeNum
      })
      
    }
    else if(isLike=="1"){
      
      likeNum=likeNum-1;
      that.setData({
        agree:0,
        agreeNum:likeNum
      })
    }
    wx.getStorage({
        key: 'user_id',
        success: function(ress) {
            var Likes = Bmob.Object.extend("Likes");
            var queryLike = new Bmob.Query(Likes);
            var Diary = Bmob.Object.extend("Diary");
            var diary = new Diary();
            diary.id=optionId;
            var me = new Bmob.User();
            me.id=ress.data;
            queryLike.equalTo("moodId", diary);
            queryLike.equalTo("praiser", me);
            queryLike.find({
              success: function(likeData) {
                if(likeData.length<=0){
                  var Likes_new = new Likes();
                  Likes_new.set("moodId", diary);
                  Likes_new.set("praiser", me);
                  Likes_new.save(null, {
                    success: function(res) {
                      var queryDiary = new Bmob.Query(Diary);
                          //查询单条数据，第一个参数是这条数据的objectId值
                      queryDiary.get(optionId, {
                        success: function(object) {
                          object.set('likeNum',object.get("likeNum")+1);
                          object.save();
                        },
                        error: function(object, error) {
                          // 查询失败
                        }
                      });
                    },
                    error: function(gameScore, error) {
                     
                    }
                  });
                }
                else if(likeData.length>0){
                    likeData[0].destroy({
                      success: function(myObject) {
                        // 取消点赞成功
                        
                        //减少点赞的数量
                          var queryDiary = new Bmob.Query(Diary);
                          //查询单条数据，第一个参数是这条数据的objectId值
                          queryDiary.get(optionId, {
                            success: function(object) {
                              object.set('likeNum',object.get("likeNum")-1);
                              object.save();
                            },
                            error: function(object, error) {
                              // 查询失败
                            }
                          });
                      },
                      error: function(myObject, error) {
                        // 取消点赞失败
                        common.dataLoading(res.data.error,"loading");
                        console.log(error);
                      }
                    });
                }
                
                
              },
              error: function(error) {

              }
            });
        }
    })



  },
  changeComment:function(){
    that.setData({
      autoFo:true
    })
  },
  changeFocus:function(){
    that.setData({
      autoFo:true
    })
  },
  toResponse:function(event){//去回复
    var commentId=event.target.dataset.id;
    var userId=event.target.dataset.uid;
    var name=event.target.dataset.name;
    if(!name){
      name="";
    }
    if(userId==wx.getStorageSync('user_id')){
      common.dataLoading("不能对自己的评论进行回复","loading");
    }
    else{
      var toggleResponse;
      if(that.data.isToResponse=="true"){
        toggleResponse=false;
      }
      else{
        toggleResponse=true;
      }
      that.setData({
        pid:commentId,
        isToResponse:toggleResponse,
        plaContent:"回复"+name+":",
        resopneName:name
      })
    }
    
  },
  hiddenResponse:function(){
      this.setData({
        isToResponse:false
      })
  },
  deleteThis:function(){//删除心情
    wx.showModal({
      title: '是否删除该心情？',
      content: '删除后将不能恢复',
      showCancel:true,
      confirmColor:"#a07c52",
      cancelColor:"#646464",
      success: function(res) {
        if (res.confirm) {
          // 删除此心情后返回上一页
            var Diary = Bmob.Object.extend("Diary");
            var queryDiary = new Bmob.Query(Diary);
            queryDiary.get(optionId, {
                success: function(result) {
                  result.destroy({
                    success: function(myObject) {
                      // 删除成功
                      common.dataLoading("删除成功","success",function(){
                          wx.navigateBack({
                              delta: 1
                          })
                      });
                    },
                    error: function(myObject, error) {
                      // 删除失败
                      console.log(error)
                      // common.dataLoading(error,"loading");
                    }
                  });
                },
                error: function(object, error) {

                }
            });
          
        }
        else{
        }
      }
    })
  },
  publicThis:function(){//修改心情公开
    var isp=this.data.isPublic;
    var title,content,modifyMood;
    var hide;
    if(isp==true){
      title="退回心情";
      content="确定要将该心情退回吗？（退回的心情将在信箱模块消失，不再显示）";
      hide="0";
      
    }
    else{
      title="邮寄心情";
      content="确定要将该心情邮寄出去吗？（邮寄出去的心情将在信箱模块显示，任何人都可看到）";
      hide="1";
    }
    modifyMood=function(){
      var Diary = Bmob.Object.extend("Diary");
      var query = new Bmob.Query(Diary);
      // 这个 id 是要修改条目的 id，你在生成这个存储并成功时可以获取到，请看前面的文档
      query.get(optionId, {
          success: function(mood) {
            console.log(mood.id);
            // 回调中可以取得这个 GameScore 对象的一个实例，然后就可以修改它了
            mood.set('is_hide', hide);
            mood.save();

          },
          error: function(object, error) {

          }
      });
    }
    wx.showModal({//模态窗口显示隐藏切换
      title: title,
      content: content,
      showCancel:true,
      confirmColor:"#a07c52",
      cancelColor:"#646464",
      success: function(res) {
        if (res.confirm) {
          modifyMood();
          that.setData({  
            isPublic:!isp
          })
        }
        
      }
    })
  },
publishComment:function(e){//评论心情
  if(e.detail.value.commContent==""){
    common.dataLoading("评论内容不能为空","loading");
  }
  else{
      that.setData({
        isdisabled:true,
        commentLoading:true
      })


      wx.getStorage({
          key: 'user_id',
          success: function(ress) {
            that.setData({
              commentLoading:false
            })
            var queryUser = new Bmob.Query(Bmob.User);
            //查询单条数据，第一个参数是这条数据的objectId值
            queryUser.get(ress.data, {
              success: function(userObject) {
                // 查询成功，调用get方法获取对应属性的值
                
                
                var Comments = Bmob.Object.extend("Comments");
                var comment = new Comments();       
                var Diary = Bmob.Object.extend("Diary");
                var diary = new Diary();
                diary.id=optionId;
                var me = new Bmob.User();
                me.id=ress.data;
                comment.set("publisher",me);
                comment.set("mood", diary);
                comment.set("content", e.detail.value.commContent);
                if(that.data.isToResponse){
                  var olderName=that.data.resopneName;
                  var Comments1 = Bmob.Object.extend("Comments");
                  var comment1 = new Comments1();
                  comment1.id=that.data.pid;
                  comment.set("olderUserName",olderName);
                  comment.set("olderComment",comment1);
                }
                //添加数据，第一个入口参数是null
                comment.save(null, {
                  success: function(res) {
                    var queryDiary = new Bmob.Query(Diary);
                          //查询单条数据，第一个参数是这条数据的objectId值
                    queryDiary.get(optionId, {
                      success: function(object) {
                        object.set('commentNum',object.get("commentNum")+1);
                        object.save();
                        that.onShow();
                      },
                      error: function(object, error) {
                        // 查询失败
                      }
                    });
                    that.setData({
                      publishContent:"",
                      isToResponse:false,
                      responeContent:"",
                      isdisabled:false,
                      commentLoading:false
                    })
                  },
                  error: function(gameScore, error) {
                      common.dataLoading(error,"loading");
                      that.setData({
                        publishContent:"",
                        isToResponse:false,
                        responeContent:"",
                        isdisabled:false,
                        commentLoading:false
                      })
                  }
                });

              },
              error: function(object, error) {
                // 查询失败
              }
            });  
         
          } 
        })
    
  }
},
bindKeyInput:function(e){
  this.setData({
    publishContent: e.detail.value
  })
},
  onHide: function() {
      // Do something when hide.
  },
  onUnload:function(event){
    
  },
  onPullDownRefresh:function(){
    wx.stopPullDownRefresh()
  }
  // seeBig:function(e){
  //   wx.previewImage({
  //     current: that.data.listPic, // 当前显示图片的http链接
  //     urls: [ that.data.listPic] // 需要预览的图片http链接列表
  //   })
  // }
})
