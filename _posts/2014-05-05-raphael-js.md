---
layout: post
title: "Raphael JS矢量图形工具库"
keywords: JavaScript Raphael SVG
description: "Raphael JS."
category: javascript
tags: [javascript, raphael, svg]
---
{% include JB/setup %}

最近公司要做各种自定义的统计图表，终于找到了Raphael JS这样一个优秀的矢量图形解决方案，它是一个低调的库，仔细研究后也发现它很强大。

Raphael Javascript 是一个 Javascript的矢量库。

它可以处理SVG、VML格式的矢量图，它使用SVG W3C推荐标准和VML作为创建图形的基础，你可以用Javascript 操作Dom 很容易的创建出复杂的柱状图、走势图、曲线图等各种图表，可以画图，可以画出任意复杂度的图像，以及图表或图像裁剪和旋转等复杂操作。

同时它是跨浏览器的，完全支持 Internet Explorer 6.0+、Firefox 3.0+、Chrome 3.0+、Safari 3.0+、Opera 9.5+。

<!-- more -->

简单介绍一下Raphael的用法：

#### 创建画布

```
// 每个示例都创建一个画布
// 画布的尺寸是：宽 320px x 高 200px.
// 画布开始于 10,50 .
var paper = Raphael(10, 50, 320, 200);

// 画布开始于  左上角，并且在 id=“notepad” 的元素里面创建
// (注意：当节点有属性： dir="rtl"，会从右上角开始创建)
var paper = Raphael(document.getElementById("notepad"), 320, 200);

// 同上
var paper = Raphael("notepad", 320, 200);
```

#### 画图

```
//画圆 
var crl = paper.circle(50, 50, 40); //圆心坐标(50, 50)，半径40

//矩形
var ret = paper.rect(10, 10, 50, 50, 10); //左上角的坐标(10, 10)，宽50，高50，圆角半径10(默认为0)

//文字
var txt = paper.text(50, 50, "张小龙!\n http://blog.zhangxiaolong.me"); //中心坐标(50, 50)，文字为"张小龙!\n http://blog.zhangxiaolong.me"

//自定义路径
var c = paper.path("M10 10L90 90"); //从(10, 10)开始，划线到(90, 90)
```

#### 元素

```
//修改元素样式，并给元素绑定点击事件
for (var i = 0, i < 5, i++) {
    paper.circle(10 + 15 * i, 10, 10)
        .attr({fill: "#000"})
        .data("i", i)
        .click(function () {
            alert(this.data("i"));
        });
}

//元素变换
var el = paper.rect(10, 20, 300, 200);
// 转换 100, 100, 旋转 45°, 转换 -100, 0
el.transform("t100,100r45t-100,0");
// 可以追加，或者预先转换
el.transform("...t50,50");
el.transform("s2...");
// 或者包裹
el.transform("t50,50...t-50-50");
// 重置转换
el.transform("");
// 获取不带参数的当前值
console.log(el.transform());

//元素动画
Element.animate(params, ms, easing, callback); //最终属性 动画持续时间 缓动类型 回调函数
```

#### 工具方法

```
//取字体
paper.getFont("Times");

//取颜色
Raphael.getColor(0.75); //默认亮度0.75 每次调用返回色谱中的下一个颜色。要重置回红色，调用Raphael.getColor.reset()

//监听
eve.once("login", f); //绑定一个一次性事件处理程序
eve("login"); // 触发 f
eve("login"); // 没有监听
```

以上仅简单介绍Raphael API，更多详情，请访问 **[Raphael 官方网站](http://raphaeljs.com/)**







