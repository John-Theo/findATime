//create_new.js
Page({
  data: {
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    select:[
      { morning: false, lunch: false, afternoon: false, dinner: false, evening: false },
      { morning: false, lunch: false, afternoon: false, dinner: false, evening: false },
      { morning: false, lunch: false, afternoon: false, dinner: false, evening: false },
      { morning: false, lunch: false, afternoon: false, dinner: false, evening: false },
      { morning: false, lunch: false, afternoon: false, dinner: false, evening: false },
      { morning: false, lunch: false, afternoon: false, dinner: false, evening: false },
      { morning: false, lunch: false, afternoon: false, dinner: false, evening: false },
      ]
  }, 
  select_slot:function(e){
    var item_id = e.currentTarget.id;
    var i=item_id.slice(1, 2);
    var j=item_id.slice(0, 1);
    var time_slot="",now;
    switch(j){
      case '1': time_slot = 'morning'; now = this.data.select[i].morning; break;
      case '2': time_slot = 'lunch'; now = this.data.select[i].lunch; break;
      case '3': time_slot = 'afternoon'; now = this.data.select[i].afternoon; break;
      case '4': time_slot = 'dinner'; now = this.data.select[i].dinner; break;
      case '5': time_slot = 'evening'; now = this.data.select[i].evening; break;
      default: time_slot = 'morning'; now = this.data.select[i].morning; break;
    }
    var x = "select[" + i + "]."+time_slot;
    this.setData({[x]:!now})
  },
  onLoad: function () {
  }
})
