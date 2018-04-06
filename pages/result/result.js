//create_new.js
Page({
  data: {
    openid: '',
    for_row: [],
    for_daytime: [
      { id: 1, time: 'm' },
      { id: 2, time: 'l' },
      { id: 3, time: 'a' },
      { id: 4, time: 'd' },
      { id: 5, time: 'e' },
    ],
    select: {},
    total: {},
    projectId: 'default',
    ischosen: 'hidden',
    max_time: 1,
    tar_date: '等你长按确定时间哦！',
    ownerid: '',

  },
  submita: function (e) {
    var ipid = this.data.projectId;
    var ioid = this.data.openid;
    wx.request({
      url: 'https://mytime.houaa.xyz/submit/?pid=' + ipid + '&openid=' + ioid,
      method: 'GET',
      data: this.data.select,
      success: function (res) {
        console.log(res.data)
        wx.showToast({
          title: '已提交！',
        })
      }
    })
  },
  result: function (e) { wx.navigateTo({ url: "../result/result?pid=0" }) },
  select_slot: function (e) {
    var info = e.target.id;
    var i = info[0];
    var j = info[1];
    var for_row = this.data.for_row;
    var time = ['上午', '中饭', '下午', '晚饭', '晚上'];
    if (this.data.openid != this.data.owner_id) {
      wx.showModal({
        content: '请问卷的发起者来确定吧！',
      })
    }
    // console.log(this.data.total);
    else {
      this.setData({
        tar_date: '约 ' + for_row[j].date + '号（星期' + for_row[j].day + '）的' + time[i - 1] + ' ！',
        ischosen: 'visible',
      });
      wx.setClipboardData({
        data: '我们就 ' + this.data.tar_date + '投票结果戳链接查看！',
        success: function (res) {
          wx.getClipboardData({
            success: function (res) {
              console.log(res.data) // data
            }
          })
        }
      })
    }

  },

  onShareAppMessage: function (res) {

    console.log(this.name);
    if (res.from == 'button') {
      // console.log(res.target.id);
    }
    return {
      title: this.data.tar_date,
      path: '/pages/result/result?pid=' + this.data.projectId,
      success: function (res) {
        console.log(tmp);
      },
    }
  },

  toNew: function (e) { wx.navigateTo({ url: "../index/index?currentTab=0" }) },
  toHis: function (e) { wx.navigateTo({ url: "../index/index?currentTab=1" }) },

  onLoad: function (options) {
    var that = this;
    this.setData({
      projectId: options.pid,
    });
    // console.log(this.data.select);
    // console.log(this.data.projectId);
    wx.showToast({
      title: '获取数据...',
      icon: 'loading',
      success: function (e) {
        wx.login({
          //获取code
          success: function (res) {
            var code = res.code; //返回code
            wx.request({
              url: 'https://mytime.houaa.xyz/wxcode/?code=' + code,
              method: 'GET',
              success: function (res) {
                var iopenid = res.data;
                that.setData({
                  openid: iopenid
                });
                var ipid = that.data.projectId;
                var ioid = that.data.openid;
                wx.request({
                  url: 'https://mytime.houaa.xyz/owner/?pid=' + ipid,
                  method: 'GET',
                  success: function (res) {
                    that.setData({ owner_id: res.data })
                    // console.log(that.data.owner_id)
                  }
                });
                wx.request({
                  url: 'https://mytime.houaa.xyz/total/?pid=' + ipid,
                  method: 'GET',
                  success: function (res) {
                    if (res.data == 'NotExist') { console.log('Nobody filled...') }
                    else {
                      that.setData({ total: res.data.total, for_row: res.data.other })
                      console.log(res.data)
                    }
                    var max = 0;
                    var list = that.data.total;
                    var dayl = ['e', 'd', 'a', 'l', 'm'];
                    for (var i = 0; i < 7; i++) {
                      for (var j = 0; j < 5; j++) {
                        if (list[i][dayl[j]] > max) {
                          max = list[i][dayl[j]];
                        }
                      }
                    }
                    // console.log(max);
                    that.setData({ max_time: max })
                    wx.hideToast();
                  }
                })
              }
            })
          }
        });
      }
    })
  },
})
