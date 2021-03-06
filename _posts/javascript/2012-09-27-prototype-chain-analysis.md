---
layout: post
title: "原型链解析（一）"
keywords: JavaScript prototype __proto__
description: ""
category: javascript
tags: [javascript, prototype, __proto__]
---
{% include JB/setup %}

原型链的解释以及推导过程。

<!-- more -->

<img src="/assets/images/yuan-xing-lian-jie-xi/chain.jpg" width="650px" />

### 原型链：

```javascript
var father = function() {
};
father.prototype.say = function() {
    alert("Hello");
}
var child = function() {
};
child.prototype = new father();

var c = new child();
c.say(); // Hello
```

当我们从c中寻找say这个属性时，如果c中不存在这个属性，就从_proto_属性中寻找，这个__proto__又会有自己的__proto__，于是就这样一直找下去，也就是我们平时所说的原型链的概念。

### 结论：

```javascript
c.__proto__ == child.prototype;
c.__proto__.__proto__ == father.prototype;
```

证明过程如下：

已知：

```javascript
//条件1:
child.prototype = new father();
//条件2:
var c = new child();
```

推导(1)：
要达到(1)的继承效果，也可以如下方式：

```javascript
var f = new father(); 
child.prototype = f; 
```

又 f 是 father的实例，所以

```javascript
f.__proto__ = father.prototype;
```

最终(1)推导出：

```javascript
child.prototype.__proto__ = father.prototype;
```

推导(2)推导出：

```javascript
c.__proto__ = child.prototype;
```

### 综合上面两个结论：

```javascript
c.__proto__.__proto__ = father.prototype;
```

所以原型链就这样形成了。