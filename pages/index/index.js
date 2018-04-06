var app = getApp();
var util = require('../../utils/util-d.js'); 
Page({
  data: {
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    date: '2018-04-01',
    delete_item: false,
    itemIdList: [],
    isempty: true,
    proj_name: '',
    proj_code: '',
    openid: '',
  },
  // 滚动切换标签样式
  switchTab: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
    this.checkCor();
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    this.setData({ delete_item: false })
    var cur = e.currentTarget.dataset.current;
    if (this.data.currentTaB == cur) { return false; }
    else {
      this.setData({
        currentTab: cur
      })
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  creatProj: function(e){
    var that=this;
    var aid = this.data.openid;
    console.log(aid);
    wx.request({
      url: 'https://mytime.houaa.xyz/new/',
      method: 'GET',
      data: {
        ownerid: aid,
        name: that.data.proj_name,
        date: that.data.date,
      },
      success: function (res) {
        wx.showToast({
          title: '创建成功',
        })
        wx.navigateTo({
          url: '../calendar/calendar?itemid='+res.data,
        })
        console.log(res.data)
      }
    })
  },
  detail: function(e) {
    // console.log(e.currentTarget.id);
    wx.navigateTo({
      url: "../calendar/calendar?itemid=" + e.currentTarget.id,
    })
  },
  mytextInput: function (e) {
    this.setData({
      proj_name: e.detail.value,
      isempty: false,
    })
  },
  mycodeInput: function (e) {
    this.setData({
      proj_code: e.detail.value,
      isempty: false,
    })
  },
  delete_item:function(e){
    var that = this;
    var list = this.data.itemIdList
    var pname, index;
    for (var i = 0; i < list.length; i++) {
      if (list[i].hex == e.currentTarget.id){
        pname = list[i].name;
        index = i;
        break;
      }
    }
    wx.showModal({
      content: '真的要删除“' + pname + '”吗？',
      cancelText: '点错打扰',
      success: function (res) {
        if (res.confirm) {
          // console.log(e.currentTarget.id)
          list.splice(index, 1);
          that.setData({
            itemIdList: list
          });
          var ipid = e.currentTarget.id;
          wx.request({
            url: 'https://mytime.houaa.xyz/delete/?pid=' + ipid,
            method: 'GET',
          })
        }
      }
    })
  },
  onLoad: function (options) {
    // 调用函数时，传入new Date()参数，返回值是日期和时间  
    var time = util.formatTime(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据  
    this.setData({
      date: time
    });
    
    if (options.currentTab){
      this.setData({
        currentTab: options.currentTab
      })
    }
    var that = this;
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR;
        that.setData({
          winHeight: calc
        });
      }
    });
    wx.login({
      //获取code
      success: function (res) {
        var code = res.code; //返回code
        wx.request({
          url: 'https://mytime.houaa.xyz/wxcode/?code=' + code,
          method: 'GET',
          success: function (res) {
            // that.data.openid = res.data;
            // console.log(res.data);
            that.setData({
              openid: res.data
            });
            wx.request({
              url: 'https://mytime.houaa.xyz/plist/?openid=' + res.data,
              method: 'GET',
              success: function (res) {
                that.setData({
                  itemIdList: res.data
                });
              }
            })
          }
        })
      }
    });
  },
  footerTap: app.footerTap
})