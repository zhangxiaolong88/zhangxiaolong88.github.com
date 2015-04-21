---
layout: post
title: "异步模式编程: 观察者模式"
keywords: JavaScript asynchronous
description: "JavaScript asynchronous programming"
category: javascript
tags: [javascript]
---
{% include JB/setup %}

EventProxy是一种观察模式。

<!-- more -->

```javascript
var proxy = new EventProxy();
proxy.assign('A', function(){
	B(function(){
		proxy.trigger('B');
	});
});
proxy.assign('B', function(){
	C(function(){
		proxy.trigger('C');
	});
});
proxy.assign('C', function(){
	D(function(){
		proxy.trigger('D');
	});
});
proxy.assign('D', function(){
	E();
});
A(function(){
	proxy.trigger('A');
});
```

可以看出通过消息来驱动代码可以让异步嵌套被「拉平」了，而如果要描述「当 ABCD 都完成的时候执行 E」这样的流程也很容易了

```javascript
var proxy = new EventProxy();
proxy.assign('A', 'B', 'C', 'D', E);
A(function(){
	proxy.trigger('A');
});
B(function(){
	proxy.trigger('B');
});
C(function(){
	proxy.trigger('C');
});
D(function(){
	proxy.trigger('D');
});
```

除了改善异步编程体验以外，EventProxy 也可以提供一个自定义的事件系统。

EventProxy 很简单，源代码只有 300 多行，非常环保,特别对于移动开发者来说。

由于我自己将 Event 系统拆成了单独的一个模块，而我（目前为止）也不需要 EventProxy 在 trigger 一个消息的时候的参数传递的功能，
对于 some, any, not 这些限定词我也不需要，因此我自己实现了一个简单版的异步流控制工具。

```javascript
(function(export){
var uid = 1;
var Jas = function(){
	this.map = {};
	this.rmap = {};
};
var indexOf = Array.prototype.indexOf || function(obj){
	for (var i=0, len=this.length; i<len; ++i){
		if (this[i] === obj) return i;
	}
	return -1;
};
var fire = function(callback, thisObj){
	setTimeout(function(){
		callback.call(thisObj);
	}, 0);
};
Jas.prototype = {
	waitFor: function(resources, callback, thisObj){
		var map = this.map, rmap = this.rmap;
		if (typeof resources === 'string') resources = [resources];
		var id = (uid++).toString(16); // using hex
		map[id] = {
			waiting: resources.slice(0), // clone Array
			callback: callback,
			thisObj: thisObj
		};

		for (var i=0, len=resources.length; i<len; ++i){
			var res = resources[i],
				list = rmap[res] || (rmap[res] = []);
			list.push(id);
		}
		return this;
	},
	trigger: function(resources){
		if (!resources) return this;
		var map = this.map, rmap = this.rmap;
		if (typeof resources === 'string') resources = [resources];
		for (var i=0, len=resources.length; i<len; ++i){
			var res = resources[i];
			if (typeof rmap[res] === 'undefined') continue;
			this._release(res, rmap[res]); // notify each callback waiting for this resource
			delete rmap[res]; // release this resource
		}
		return this;
	},
	_release: function(res, list){
		var map = this.map, rmap = this.rmap;
		for (var i=0, len=list.length; i<len; ++i){
			var uid = list[i], mapItem = map[uid], waiting = mapItem.waiting,
				pos = indexOf.call(waiting, res);
			waiting.splice(pos, 1); // remove
			if (waiting.length === 0){ // no more depends
				fire(mapItem.callback, mapItem.thisObj); // fire the callback asynchronously
				delete map[uid];
			}
		}
	}
};
export.Jas = Jas; // Jas is JavaScript Asynchronous (callings) Synchronizer
})(window);
```

使用起来也挺简单

```javascript
var flow = new Jas();
flow.waitFor(['A', 'B'], function(){
	// both A and B are done!!
});
 
$.getJSON(url1, function(data){
	// An ajax request
	flow.trigger('A');
});
$.getJSON(url2', function(data){
	// Another ajax request
	flow.trigger('B');
});
```

**小结一下**：

使用消息驱动的方式可以让我们在异步编程中避免一些回调嵌套的噩梦，优化编程体验，在流程有修改的时候也更加灵活，
可以用一种接近「声明」式的方式去描述异步函数流。
