function getRddSession(){
    // try {//获取缓存中的code
    //   var value = wx.getStorageSync('session_key')
    //   if (value) {
    //       return value;
    //   }
    // } catch (e) {
    //   console.log(e)
    // }
}
module.exports.getRddSession = getRddSession;

// 加载框
function dataLoading(txt,icon,fun){
  wx.showToast({
    title: txt,
    icon: icon,
    duration: 500,
    success:fun
  })
}
module.exports.dataLoading = dataLoading;
