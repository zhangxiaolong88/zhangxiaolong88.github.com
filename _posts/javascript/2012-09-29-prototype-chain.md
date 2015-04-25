---
layout: post
title: "原型链解析（二）"
keywords: JavaScript prototype __proto__
description: ""
category: javascript
tags: [javascript, prototype, __proto__]
---
{% include JB/setup %}

原型链的个人总结。

<!-- more -->

###一个函数fn

**作为实例**

有`__proto__`属性 = Function.prototype，里面还有`constructor`属性 = Function；  
有`constructor`属性 = Function；  

**作为构造函数**

有`prototype`属性，里面还有`constructor`属性 = 自身fn，由于是对象，里面还有`__proto__`属性 = Object.prototype；  

###一个对象f = new fn()

**作为实例**

有`__proto__`属性 = fn.ptototype，里面还有`constructor`属性 = fn；  
有`constructor`属性 = fn；

没有`prototpye`属性；

###Function

**作为实例**

有`__proto__`属性 = Function.prototype，里面还有`constructor`属性 = Function；  
有`constructor`属性 = Function；

**作为构造函数**

有`prototype`属性，里面还有`construtor`属性 = Function，由于是对象里面还有`__proto__`属性 = Object.prototype；  

###Object

**作为实例**

有`__proto__`属性 = Function.prototype，里面还有`constructor`属性 = Function；  
有`constructor`属性 = Function；  

###一个对象{}或者new Object()

**作为实例**

有`__proto__`属性 = Object.prototype，里面还有`constructor`属性 = Object；  
有`constructor`属性 = Object；

没有`prototype`属性；

**文中的 `=` 意义等价于 js中的 `===`。**

###总结###

一个对象  

1.  如果可以做作为**构造函数**：  

通常有`prototype`属性，`prototype`对象中的属性可通过`实例.属性名`来访问，并且`prototype`对象本身也会被实例的`__proto__`所引用。  

2. 如果本身是一个**实例**:  

通常有`constructor`属性，且该属性指向自己的**构造函数**；  

通常有`__proto__`属性，且该属性指向构造函数的`prototype`对象。
