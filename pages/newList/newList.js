
//获取应用实例
var common = require('../template/getCode.js')
var app = getApp()
var that;
Page({
  data:{
      newList:[],
      limit: 12,
      windowHeight: 0,
      windowWidth: 0
  },
  onLoad: function(options) {
      this.setData({
        loading: false
      })  
      
  },
  onReady:function(){
     
  },
  onShow: function() {
    
      that=this;
      
      var myInterval=setInterval(getReturn,500);
      function getReturn(){
          wx.getStorage({
            key: 'session_key',
            success: function(ress) {
              if(ress.data){
                clearInterval(myInterval);
                wx.request({
                  url: 'https://xinyou.bmob.cn/reminds',
                  header:{
                    "sessionKey":ress.data
                  },
                  data: {
                    "count": that.data.limit
                  },
                  method:"GET",
                  success: function(res) {
                    if(res.data.error_code=="0"){
                      that.setData({
                        newList:res.data.result,
                        loading: true
                      })
                    }
                    else{
                      that.setData({
                        loading: true
                      })
                      common.dataLoading(res.data.error,"loading",function(){
                          
                      });
                    }
                    
                  }
                })
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
  onHide: function() {
      // Do something when hide.
  },
  onUnload:function(event){
    
  },
  pullUpLoad: function(e) {
    var limit = this.data.limit +6
    this.setData({
      limit: limit
    })
    this.onShow()
  },
  toSeeDetail:function(event){
       wx.getStorage({
          key: 'session_key',
          success: function(ress) {
            if(ress.data){
              wx.request({
                url: 'https://xinyou.bmob.cn/remind/'+event.target.dataset.id,
                header:{
                  "sessionKey":ress.data
                },
                method:"POST",
                success: function(res) {
                  if(res.data.error_code=="0"){
                    wx.setStorageSync('reminds_count',wx.getStorageSync('reminds_count')-1)
                    wx.request({
                        url: 'https://xinyou.bmob.cn/feeling/'+event.target.dataset.fid,
                        header:{
                          "sessionKey":ress.data
                        },
                        data: {
                          id: event.target.dataset.fid
                        },
                        method:"GET",
                        success: function(results) {
                          if(results.data.error_code=="0"){
                              if(results.data.result==null){

                              }
                              else if(!results.data.result.content){
                                  common.dataLoading("该心情已经不存在","loading");
                              }
                              else{
                                  wx.navigateTo({
                                    url: '../listDetail/listDetail?moodId='+event.target.dataset.fid
                                  })
                              }
                          }
                          else{
                              common.dataLoading(results.data.error,"loading");
                          }
                            
                        }
                      })
                  }
                  else{
                      common.dataLoading(res.data.error,"loading");
                  }
                }
              })
            }
            
          } 
        })
    
    
  },
  onPullDownRefresh:function(){
    wx.stopPullDownRefresh()
  }
  
})
