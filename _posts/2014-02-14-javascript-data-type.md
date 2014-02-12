---
layout: post
title: "JavaScript数据类型"
description: ""
category: javascript
tags: [javascript]
---
{% include JB/setup %}

- JavaScript有几种基本数据类型？
- typeof一共有多少种结果？
- Object,Function,String,Number,Array有没有什么关系，是什么关系？

你是不是常常听到上面这些问题？
是不是觉得这些都是很基础的问题？
但是好像又没有完全搞清楚的问题？
搞清楚了？好的，如果让你在你的同事们面前做一场培训课说清楚这个问题，教不会的人完全弄清楚这些问题，你有信心吗？

<!-- more -->

JavaScript的数据类型一直都是一个概念模糊的问题，尽管规范中清楚的规定了JavaScript有多少种数据类型，但是与其他语言的许多不同（比如弱类型）导致了它的一些特性，还有一些极为特殊的情况下结果也让人难以理解，这些都让JavaScript初学者经常摔跟头，甚至一些有JavaScript经验的人也没有完全弄明白其中的机制。要清晰这个问题，我觉得还是要从规范入手，特殊情况下再深入挖掘这门语言的核心。

与许多其他语言类似，JavaScript中的数据类型主要分为两大类：
- 基本数据类型（有人也叫做“原始数据类型”）：字符型(String)、数值型(Number)、布尔型(Boolean)、空(Null)、undefined(Undefined)
- 对象：函数(Function)、数组(Array)、JSON、正则表达式

JavaScript中有一个函数用于判断数据类型：typeof
尽管这门语言的创造者想让大家都使用这个函数来判断数据类型，这其实给开发者特别是初学者造成了很多的不便，还有学习成本，看下面的几个例子：

### 基本数据类型

```
typeof(1); //Number
typeof(Number(1)); //Number
typeof(new Number(1)); //Object 
```

JavaScript中也使用new关键字来创建对象。
可以看到，在一般情况下，该函数有一定可取之处，看下面几个例子：

```
typeof(null); //Object
```

也许你早就知道这个结果，但是typeof函数为什么要这样处理呢？
这实际上是最初实现的一个错误，然后ECMAScript也沿用了，后来人们为了解释这一矛盾提出，null是对象的占位符。

还有一个奇怪的现象：

```
typeof(undefined); //Undefined
```

undefined是声明变量时未初始化的默认值；
undefined的类型就是Undefinded;

而且undefined的值是可以改变的。
这段代码在IE6、7、8中执行结果是这样的：

```
undefined = 123；
typeof(undefined); //123
```

所以jQuery在某个版本之后，它的源代码是这样子的：

```
(function( window, undefined ) {
...
...
...
})( window );
```


