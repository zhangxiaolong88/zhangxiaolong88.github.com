---
layout: post
title: "移动端开发（二）"
keywords: JavaScript mobile development
description: "JavaScript mobile development"
category: mobile
tags: [mobile]
---
{% include JB/setup %}

一张200 * 200的图片，且css中规定长宽各位200，在非视网膜屏幕中清晰显示，但是在视网膜屏幕中由于一个像素被分为四个像素，导致取色只能近似选取，于是图片是模糊的，因此，要想让视网膜下图片清晰显示，我们需要的图片大小是400 * 400，css依然设置为200 * 200，这样可以清晰的显示该图片，但是在非视网膜屏幕下图片资源浪费。

<!-- more -->

###像素密度查询  

**1) css media queries**

关键属性`device-pixel-ratio`或者其扩展属性`min-device-pixel-ratio`和`max-device-pixel-ratio`。  

```css
.icon {
	background: url('example.png');
}
```

```css
@media only screen and (-webkit-min-device-pixel-ratio: 1.5),
	only screen and (-moz-min-device-pixel-ratio: 1.5),
	only screen and (min-device-pixel-ratio: 1.5) {
	.icon {
		background: url("example@2x.png");
	}
}
```

retina和普通屏

```css
@media only screen and (-min-width: 320px) {
	/* smal screen, non-retian */
	...
}]
@media only screen and (-webkit-min-device-pixel-ratio: 2) and (min-width: 320px),
	only screen and (-moz-min-device-pixel-ratio: 2) and (min-width: 320px),
	only screen and (min-device-pixel-ratio: 2) and (min-width: 320px) {
	/* small screen, retina, stuff to overide above media query */
	...
}
```

将320px 换成 768px、1024px 等，扩充不同分辨率的样式。

**优点：**

只有对应的目标元素才会下载图片资源；  
跨浏览器兼容； 
像素可以精确控制。 

**缺点：**

过多的适配代码；  
只能通过html元素的背景图片来实现。

**2) js**

使用js 对window.devicePixelRatio进行判断，选择对应图像。

if(window.devicePixelRatio > 1){
	var $images = $("img");
	$images.each(function(){
		var src = $(this).attr("src");
		$(this).attr("src", src.replace(".", "@2x."));
	});
}

**优点：**

易于实施。  

**缺点：**  

retina要下载两种资源；  
兼容性； 

**2) 可缩放的矢量图**

使用html的img标签调用svg；css中调用svg；伪元素的"content"调用。

**优点：**

一个资源适配所有设备； 
易于维护； 

**缺点：**  

由于文件大小，不适合复杂图形；  
不支持IE早期版本； 