/*
 * fullScroll 0.1
 *
 * kjzew
 * Copyright 2016, MIT License
 *
 */

function fullScroll(container, options) {

  "use strict";

  $("head").append(`<style>
      .slider {
        position: absolute;
        top: 50%;
        right: 100px;
        display: inline-block;
        padding: 6px;
        background-color: #FFF;
        opacity: 0.3;
        border-radius: 11px;
      }
      .slider li {
        width: 10px;
        height: 10px;
        margin: 5px 0;
        border-radius: 50%;
        background-color: #999;
        list-style-type: none;
      }
      .slider li.active {
        background-color: #000;
      }
    </style>`)

  // 默认参数设定
  let opt = {
    // 起始序号
    index: 1,
    // 动画时间
    animationTime: "400ms",
    // 动画延迟时间
    animationDelayTime: 100
  }

  // 设置
  $.extend(opt, options);

  // 判断浏览器
  let isFF = navigator.userAgent.toLowerCase().indexOf("firefox") >= 0;

  // 记录滚动方向
  let upOrDown = "";
  // 定时器id
  let time = 0;
  // 窗体高度
  let windowHeight = $(window).height();
  // 设置起始序号
  let index = opt.index;
  // 获取页面个数
  let length = $(container).children().length;
  // 设置高度事件
  $(container).children().height(windowHeight);

  //设置父级
  $(container).parent().css("overflow", "hidden");
  // 设置动画窗体css属性
  $(container).css("position", "relative").css("top", -windowHeight * (index - 1)).css("transition", "top " + opt.animationTime + " linear")

  // 侧边导航
  var slider = $('<ul class="slider"></ul>');

  for (var i = 0; i < length; i++) {
    slider.append($("<li></li>"));
  }

  slider.find("li").eq(index - 1).addClass("active");

  $(container).parent().append(slider);

  slider.css("margin-top", -slider.height() / 2);

  $(document).on("click", ".slider li", function() {
    index = $(this).index() + 2;
    scrollHander();
  })

  // 事件绑定
  if (isFF) {
    document.addEventListener('DOMMouseScroll', function(e) {
      console.log(e.detail)
      if (Math.abs(e.detail) < 5) {
        return false;
      }
      upOrDown = e.detail < 0 ? "up" : "down";
      scrollHander();

      if (e.preventDefault) //disable default wheel action of scrolling page
        e.preventDefault();
      else
        return false;
    }, false);
  } else {
    document.onmousewheel = function(e) {
      console.log(new Date())
      e = e || window.event;
      if (e.wheelDelta == 0) {
        return false;
      }
      upOrDown = e.wheelDelta > 0 ? "up" : "down";
      scrollHander();

      if (e.preventDefault) //disable default wheel action of scrolling page
        e.preventDefault();
      else
        return false;
    }
  }

  // 需要去除鼠标点击事件
  // function stopDefaultAndBubble(e) {
  //   console.log(1)
  //   e = e || window.event;
  //   Stops the Default Browser Action
  //   if (e.preventDefault) {
  //     e.preventDefault();
  //   }
  //   e.returnValue = false;

  //   //Stops the event bubbling up to the body element
  //   if (e.stopPropagation) {
  //     e.stopPropagation();
  //   }
  //   e.cancelBubble = true;
  // }

  // document.onmousedown = function(e) {
  //   console.log(1)
  //   //mouse middle button
  //   if ((e.which == 2)) {
  //     stopDefaultAndBubble(e);
  //     //bugfix 搜狗浏览器的ie内核只有在定时器触发这个函数才生效。。
  //     setTimeout(function() {
  //       stopDefaultAndBubble(e);
  //     }, 10);
  //   }
  // }

  function scrollHander() {
    clearTimeDown();
    time = setTimeout(function() {
      console.log(upOrDown)
      if (upOrDown == "down") {
        if (index < length) {
          index++
        }
      } else {
        if (index > 1) {
          index--
        }
      }
      $(container).css("top", windowHeight * (1 - index))
      slider.find(".active").removeClass("active")
      slider.find("li").eq(index - 1).addClass("active")
    }, 100)
  }

  function clearTimeDown() {
    clearTimeout(time);
  }

  return {};
}


if (window.jQuery || window.Zepto) {
  (function($) {
    $.fn.fullScroll = function(params) {
      return this.each(function() {
        $(this).data('fullScroll', new fullScroll($(this)[0], params));
      });
    }
  })(window.jQuery || window.Zepto)
} else {
  console.log("jQuery or Zepto")
}