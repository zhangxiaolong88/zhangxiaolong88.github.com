---
layout: effect
title: "web颜色代码浅析与应用"
keywords: JavaScript css color
description: "web color code."
category: javascript
tags: [javascript, css, color]
---
{% include JB/setup %}

web颜色可以用代码表示，常见于以下几种形式，以黑色为例：<br>
（1）#000000<br>
（2）#000<br>
（3）RGB(0, 0, 0)

以上三种颜色均代码黑色。

000000分成3个部分，00,00,00，第一部分代表R（红色），第二部代表G（绿色），第三部分代表B（蓝色）,每个部分用2位16进制数表示，所以范围在0-255（（16^2-1）。
比如，红色可以用#FF0000、RGB(255，0，0)，绿色可以用#00FF00、RGB(0, 255, 0)，蓝色可以用#0000FF、RGB(0, 0, 255)来表示。

（2）则是（1）的简写，比如#FF00FF 可以简写为#F0F， #CC3366可以简写为#C36。

<!-- more -->

一个颜色渐变的例子（见页面底部）：

color.js

```
var ColorGrads = function(options){
    this.SetOptions(options);
    this.StartColor = this.options.StartColor;
    this.EndColor = this.options.EndColor;
    this.Step = Math.abs(this.options.Step);
};
ColorGrads.prototype = {
  //设置默认属性
  SetOptions: function(options) {
    this.options = {//默认值
        StartColor: "#fff",//开始颜色
        EndColor:   "#000",//结束颜色
        Step:       100//渐变级数
    };
    Extend(this.options, options || {});
  },
  //获取渐变颜色集合
  Create: function() {
    var colors = [],
        startColor = this.GetColor(this.StartColor),
        endColor = this.GetColor(this.EndColor),
        stepR = (endColor[0] - startColor[0]) / this.Step,
        stepG = (endColor[1] - startColor[1]) / this.Step,
        stepB = (endColor[2] - startColor[2]) / this.Step;
    //生成颜色集合
    for(var i = 0, n = this.Step, r = startColor[0], g = startColor[1], b = startColor[2]; i < n; i++){
        colors.push([r, g, b]); r += stepR; g += stepG; b += stepB;
    }
    colors.push(endColor);
    //修正颜色值
    return Map(colors, function(x){ return Map(x, function(x){
        return Math.min(Math.max(0, Math.floor(x)), 255);
    });});
  },
  //获取颜色数据
  GetColor: function(color) {
    if(/^#[0-9a-f]{6}$/i.test(color))
    {//#rrggbb
        return Map([color.substr(1, 2), color.substr(3, 2), color.substr(5, 2)],
            function(x){ return parseInt(x, 16); }
        )
    }
    else if(/^#[0-9a-f]{3}$/i.test(color))
    {//#rgb
        return Map([color.substr(1, 1), color.substr(2, 1), color.substr(3, 1)],
            function(x){ return parseInt(x + x, 16); }
        )
    }
    else if(/^rgb(.*)$/i.test(color))
    {//rgb(n,n,n) or rgb(n%,n%,n%)
        return Map(color.match(/\d+(\.\d+)?\%?/g),
            function(x){ return parseInt(x.indexOf("%") > 0 ? parseFloat(x, 10) * 2.55 : x, 10); }
        )
    }
    else
    {//color
        var mapping = {"red":"#FF0000"};//略
        color = mapping[color.toLowerCase()];
        if(color){
            return Map([color.substr(1, 2), color.substr(3, 2), color.substr(5, 2)],
                function(x){ return parseInt(x, 16); }
            )
        }
    }
  }
};
```
需要用到的工具函数如下：

```
var Extend = function(destination, source) {
    for (var property in source) {
        destination[property] = source[property];
    }
    return destination;
}

var Map = function(array, callback, thisObject){
    if(array.map){
        return array.map(callback, thisObject);
    }else{
        var res = [];
        for (var i = 0, len = array.length; i < len; i++) { res.push(callback.call(thisObject, array[i], i, array)); }
        return res;
    }
}
```

只要执行以下代码，就可以拿到一个渐变的颜色数组：

```
var colors = new ColorGrads({
	StartColor: "#9111c0",
	EndColor: "#f3d3ff"
}).Create();
```

开始颜色：<input type="text" id="startColor" value="#000000" />
结束颜色：<input type="text" id="endColor" value="#ffffff" />
<button id="colorPicker">确定</button>

<div id="colorShow"></div>