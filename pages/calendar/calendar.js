//create_new.js
Page({
  data: {
    openid:'',
    for_row:[
      // { id: 0, date: 28, day:'一' },
      // { id: 1, date: 29, day:'二' },
      // { id: 2, date: 30, day:'三' },
      // { id: 3, date: 1, day:'四' },
      // { id: 4, date: 2, day:'五' },
      // { id: 5, date: 3, day:'六' },
      // { id: 6, date: 4, day:'日' }
    ],
    for_daytime: [
      { id: 1, time: 'm' },
      { id: 2, time: 'l' },
      { id: 3, time: 'a' },
      { id: 4, time: 'd' },
      { id: 5, time: 'e' },
    ],
    select: {
      // 0: { 'm': 0, 'l': 0, 'a': 0, 'd': 0, 'e': 0 },
      // 1: { 'm': 0, 'l': 0, 'a': 0, 'd': 0, 'e': 0 },
      // 2: { 'm': 0, 'l': 0, 'a': 0, 'd': 0, 'e': 0 },
      // 3: { 'm': 0, 'l': 0, 'a': 0, 'd': 0, 'e': 0 },
      // 4: { 'm': 0, 'l': 0, 'a': 0, 'd': 0, 'e': 0 },
      // 5: { 'm': 0, 'l': 0, 'a': 0, 'd': 0, 'e': 0 },
      // 6: { 'm': 0, 'l': 0, 'a': 0, 'd': 0, 'e': 0 }
    },
    total: {
      // 0: { 'm': 0, 'l': 0, 'a': 0, 'd': 0, 'e': 0 },
      // 1: { 'm': 0, 'l': 0, 'a': 0, 'd': 0, 'e': 0 },
      // 2: { 'm': 0, 'l': 0, 'a': 0, 'd': 0, 'e': 0 },
      // 3: { 'm': 0, 'l': 0, 'a': 0, 'd': 0, 'e': 0 },
      // 4: { 'm': 0, 'l': 0, 'a': 0, 'd': 0, 'e': 0 },
      // 5: { 'm': 0, 'l': 0, 'a': 0, 'd': 0, 'e': 0 },
      // 6: { 'm': 0, 'l': 0, 'a': 0, 'd': 0, 'e': 0 }
    },
    projectId: 'default',
    isempty: true,
  }, 
  submita: function(e){
    var ipid = this.data.projectId;
    var ioid = this.data.openid;
    wx.request({
      url: 'https://mytime.houaa.xyz/submit/?pid=' + ipid+'&openid='+ioid,
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
  result: function (e) {
    var ipid = this.data.projectId;
    wx.navigateTo({ url: "../result/result?pid=" + ipid }) 
  },
  select_slot:function(e){
    var item_id = e.currentTarget.id;
    var i=item_id.slice(1, 2);
    var j=item_id.slice(0, 1);
    var time_slot="",now;
    switch(j){
      case '1': time_slot = 'm'; now = this.data.select[i].m; break;
      case '2': time_slot = 'l'; now = this.data.select[i].l; break;
      case '3': time_slot = 'a'; now = this.data.select[i].a; break;
      case '4': time_slot = 'd'; now = this.data.select[i].d; break;
      case '5': time_slot = 'e'; now = this.data.select[i].e; break;
      default: break;
    }
    var sel = this.data.select;
    sel[i][time_slot] = 1-now;
    var tot = this.data.total;
    tot[i][time_slot] += 1 - now*2;
    this.setData({ select:sel, total:tot })
    // console.log(this.data.select)
  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '告诉我你的空余时间',
      path: '/pages/calendar/calendar?pid=' + this.data.projectId,
      success: function (res) {
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
      success: function(e){
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
                  url: 'https://mytime.houaa.xyz/query/?pid=' + ipid + '&openid=' + ioid,
                  method: 'GET',
                  success: function (res) {
                      that.setData({select: res.data});
                      console.log(res.data);
                  }
                });
                wx.request({
                  url: 'https://mytime.houaa.xyz/total/?pid=' + ipid,
                  method: 'GET',
                  success: function (res) {
                    if (res.data == 'NotExist') { console.log('Nobody filled...') }
                    else {
                      that.setData({ total: res.data.total, for_row:res.data.other })
                      // console.log(res.data.other)
                    }
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
