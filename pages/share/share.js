//share.js
Page({
  data: {
    winWidth: '',
    winHeight: '',
  },
  onLoad: function () {
    var that = this;
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        console.log(clientWidth);
        var calc = clientHeight * rpxR;
        that.setData({
          winHeight: calc
        });
      }
    });
  }
})
