// 系统全局变量
var globalV = {
    routerSelector: $("#content")
}

// dom加载完成后的初始化函数
$(function() {
    // 路由配置项
    var routerOptions = {
        "/page/:pageName": {
            on: mainRouter
        },
    };
    var routeInstance = new Router(routerOptions).configure({
        before: function(param = undefined) {
            console.log('before - ' + param);
        },
        after: function(param = undefined) {
            console.log('after - ' + param);
        }
    });

    routeInstance.init();
    bindSysEvent()
    var hash = window.location.hash;
    if(hash === '' || hash === '#/') {
        window.location.hash = '#/page/test1';
    }
})

// 主路由回调函数
function mainRouter(pageName) {
    console.log(pageName)
    var url = 'pages/'+pageName+".html";
    var curMenuItem = $('[data-href="'+pageName+'"]');
    curMenuItem.addClass("active").siblings().removeClass("active");
    loadRouterTemp(url)
}

// 绑定系统默认事件
function bindSysEvent() {
    $(".menu-wrap li").off("click").on("click", function() {
        // alert(1)
        var href = $(this).data("href");
        window.location.hash = '#/page/'+href;
    })
}

// 使用ajax加载html到某个dom元素中
function loadRouterTemp(url, theContainer) {
    theContainer  = theContainer || globalV.routerSelector;
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