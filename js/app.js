// 系统全局变量
var globalV = {
  routerSelector: $("#content")
};

Date.prototype.Format = function(fmt) {
  var week = ['日', '一', '二', '三', '四', '五', '六'];
  var o = {
      "M+": this.getMonth() + 1, //月份
      "d+": this.getDate(), //日
      "w+": "星期" + week[this.getDay()], //星期
      "z+": "周" + week[this.getDay()], //星期
      "h+": this.getHours(), //小时
      "m+": this.getMinutes(), //分
      "s+": this.getSeconds(), //秒
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度
      "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
};

/**
 *  {jsonStr} json字符串 eg1: '{"type": "enum", "list": {"a": "234"}}'   eg2: '{"type": "timestamp", "format":""}'
 *  {value} eg1: "a" 与list里匹配的key     eg2: 1472387 时间戳
 *
 */
template.helper("format", function(jsonStr, value) {
  console.log(jsonStr,value)
  var obj = JSON.parse(jsonStr);
  if (obj.type == "format_week") {
    return new Date(value).Format("z");
  } else if (obj.type == "timestring") {
    return new Date(value).Format(obj.format);
  } else if (obj.type == "enum") {
    for (var i in obj.list) {
      if (i == value) {
        return obj.list[i];
      }
    }
  } else if (obj.type == "timestamp") {
    obj.format = obj.format ? obj.format : "yyyy/MM/dd hh:mm:ss";
    return value ? new Date(parseInt(value) * 1000).Format(obj.format) : "";
  } else if (obj.type === "duration") {
    var nowTime = parseInt(new Date().getTime() / 1000);
    return formatterAeduration(value, nowTime);
  }
});

// dom加载完成后的初始化函数
$(function() {
  // 路由配置项
  var routerOptions = {
    "/page/:pageName": {
      on: mainRouter
    }
  };
  var routeInstance = new Router(routerOptions).configure({
    before: function(param = undefined) {
      console.log("before - " + param);
    },
    after: function(param = undefined) {
      console.log("after - " + param);
    }
  });

  routeInstance.init();
  bindSysEvent();
  var hash = window.location.hash;
  if (hash === "" || hash === "#/") {
    window.location.hash = "#/page/test1";
  }
});

// 主路由回调函数
function mainRouter(pageName) {
  console.log(pageName);
  var url = "pages/" + pageName + ".html";
  var curMenuItem = $('[data-href="' + pageName + '"]');
  curMenuItem
    .addClass("active")
    .siblings()
    .removeClass("active");
  loadRouterTemp(url);
}

// 绑定系统默认事件
function bindSysEvent() {
  $(".menu-wrap li")
    .off("click")
    .on("click", function() {
      // alert(1)
      var href = $(this).data("href");
      window.location.hash = "#/page/" + href;
    });
}

// 使用ajax加载html到某个dom元素中
function loadRouterTemp(url, theContainer) {
  theContainer = theContainer || globalV.routerSelector;
  theContainer.empty();
  if (url.indexOf("?") > 0) {
    url = url + "&time=" + new Date().getTime();
  } else {
    url = url + "?time=" + new Date().getTime();
  }
  $.ajax({
    type: "GET",
    url: url,
    dataType: "html",
    cache: false,
    beforeSend: function() {
      theContainer.html(
        '<h3><i class="iconfont icon-loading loading"></i> 正在加载，请稍后...</h3>'
      );
      if (theContainer) {
        $(window).scrollTop(0);
        // theContainer.css({top: 1200, opacity: 0})
        // theContainer.css({left: 1920, opacity: 0.5})
        theContainer.css({ opacity: 0 });
      }
    },
    success: function(data) {
      // theContainer.html(data).animate({
      //   top: 0,
      //   opacity: 1
      // }, 500);
      // theContainer.html(data).animate({
      //   left: 0,
      //   opacity: 1
      // }, 1000, "linear");
      // theContainer.html(data).animate({
      //   left: 0,
      //   opacity: 1
      // }, 1000, "swing");
      theContainer.html(data).animate(
        {
          opacity: 1
        },
        500,
        "swing"
      );
      theContainer = null;
    },
    error: function(xhr, ajaxOptions, thrownError) {
      theContainer
        .html(
          '<h4 style="padding:70px 40px 0 40px; display:block; text-align:left"><i class="iconfont icon-alarm"></i> 出错啦 404！ 没有发现指定的页面。</h4>'
        )
        .animate(
          {
            opacity: 1
          },
          500,
          "swing"
        );
      theContainer = null;
    },
    async: false
  });
}
