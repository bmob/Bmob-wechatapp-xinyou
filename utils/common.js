function dataLoading(txt,icon,fun){
  wx.showToast({
    title: txt,
    icon: icon,
    duration: 500,
    success:fun
  })
}
function showModal(c,t,fun) {
    if(!t)
        t='提示'
    wx.showModal({
        title: t,
        content: c,
        showCancel:false,
        success: fun
    })
}

module.exports.showModal = showModal;
module.exports.dataLoading = dataLoading;