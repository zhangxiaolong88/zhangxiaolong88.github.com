---
layout: post
title: "javascript 动画"
keywords: JavaScript animation
description: "JavaScript animation"
category: javascript
tags: [javascript, animation]
---
{% include JB/setup %}

随着css3的加入，js的江山好像被瓜分了不少。  

js大多从兼容性和复杂度来着手反击，下面对几种传统js实现动画的方案进行了比较。

<!-- more -->

###1. setInterval

setInterval的返回值是一个随机数，这个随机数可以通过传给clearInterval来定点清除。

```javascript
// create
var id = setInterval(fn, time);

// clear
clearInterval(id);
```

setInterval实现起来便捷，但是性能问题也一直被诟病，主要表现在以下2个方面：  

**1) 过度绘制**

<img src="/assets/images/js-animate/frame-lost.png" />

为了能让人眼感觉流畅一般动画实现的频率是60帧，也就是说时间间隔推荐为16.66...毫秒，就是上图第一行的节奏，如果让频率加快，
例如10ms，就会变成下面一行的模样，每第三个图形都无法绘制（红色），表现起来就会出现卡顿，这就是过度绘制带来的问题。

当然，每个浏览器的最小绘制时间表现各不相同，如果设置一个较长的时间，这也导致了为了迁就一些浏览器，牺牲了其他浏览器的性能。

**2) 跳帧**

由于浏览器执行js采用单线程，所以各种异步的回调会自动加入到事件队列的最后，等待返回调用。  

因此setTimeout、setInterval、事件绑定都可以看作是异步的。

<img src="/assets/images/js-animate/setinterval.jpg" />

```
function click() {
	// code block1...
	setInterval(function() {
		// process ...
	}, 200);
	// code block2
}
```

比如onclick要300ms执行完, block1代码执行完, 在5ms时执行setInterval, 以此为一个时间点, 在205ms时插入process代码, click代码顺利结束, process代码开始执行(相当于图中的timer code), 然而process代码也执行了一个比较长的时间, 超过了接下来一个插入时间点405ms, 这样代码队列后又插入了一份process代码, process继续执行着, 而且超过了605ms这个插入时间点, 下面问题来, 可能你还会认为代码队列后面又会继续插入一份process代码...真实的情况是,由于代码队列中已经有了一份未执行的process代码, 所以605ms这个插入时间点将会被"无情"的跳过, 因为js引擎只允许有一份未执行的process代码。

所以，这里可能会出现时间间隔跳过的情况而导致动画不够流畅。

###2. setTimeout

为了解决setInterval的跳帧问题，往往采取下面这种方案：

```
setTimeout(function(){ 
	//processing 
	setTimeout(arguments.callee, time); 
}, time); 
```

但是，仍然没有解决可能过度绘制的问题，这就要提到下面的第三种解决方案requestAnimationFrame。

###3. requestAnimationFrame

requestAnimationFrame翻译过来叫请求动画帧，从名字就可以看出来它是为动画绘制而出现的，而且做的事情很简单，跟着浏览器的绘制走，如果浏览设备绘制间隔是16.7ms，那我就这个间隔绘制；如果浏览设备绘制间隔是10ms, 我就10ms绘制。这样就不会存在过度绘制的问题，动画不会掉帧。

从内部实现来说，这也是一种非常高效的方式：

1) requestAnimationFrame会把每一帧中的所有DOM操作集中起来，在一次重绘或回流中就完成，并且重绘或回流的时间间隔紧紧跟随浏览器的刷新频率，无需设置。

2) 在隐藏或不可见的元素中，requestAnimationFrame将不会进行重绘或回流，这当然就意味着更少的消耗，更绿色环保。

那么兼容性如何呢？

<img src="/assets/images/js-animate/requestAnimateFrame.png" />

Android设备不支持，其他设备基本上跟CSS3动画的支持一模一样。

好在requestAnimationFrame和setTimeout都是单回调，因此实现连续的动画都采用renderLoop就好了。

向下兼容写法：

```javascript
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame    ||
		function( callback ){
		window.setTimeout(callback, 1000 / 60);
		};
})();

window.clearAnimFrame = (function(){
	return window.cancelAnimationFrame ||
		window.clearTimeout;
})();
```