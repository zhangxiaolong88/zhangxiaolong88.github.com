---
layout: post
title: "JavaScript数据类型"
description: ""
category: javascript
tags: [javascript]
---
{% include JB/setup %}

你是否常常听到这些问题？<br>
- JavaScript有几种基本数据类型？
- typeof一共有多少种结果？结果中为什么没有array？
- Object,Function,String,Number,Array有没有什么关系，是什么关系？

很基础的问题，却又很难说清楚。<br>
如果你需要做一次JavaScript数据类型的培训，你有信心吗？

<!-- more -->

其实，要说清楚**弱类型的语言**的数据类型一直都是相对复杂的问题，尽管ECMAScript（以下简称ES）规范中清楚的规定了JavaScript有多少种数据类型，但是与其他具有严格规范的语言不同，它具有一些特性，而在一些殊的情况下结果也让人难以理解，这些都让JavaScript初学者经常摔跟头，甚至一些有JavaScript开发经验的人也没有明白其中机制。

与许多其他语言类似，JavaScript中的数据类型主要分为两大类：
- **基本数据类型**（也叫“原始数据类型”）：字符型(String)、数值型(Number)、布尔型(Boolean)、空(Null)、undefined(Undefined)；
- **引用类型**（也叫“复合类型”）：对象(String对象、Number对象、Boolean对象)、函数(Function)、数组(Array)、JSON、正则表达式、DOM对象等非基本数据类型。

当然，本文的重点不是要在这里介绍各种数据类型，本文的主要目的旨在说明那些年我们掉过的坑，以及说明（有些是猜测）这门语言这样设计的原因（或者说“失误”）。<br>
如果你想了解ES规范，我会推荐你仔细阅读**[W3Cschool ECMAScript系列](http://www.w3school.com.cn/js/pro_js_primitivetypes.asp)**。

JavaScript中有一个函数常用于判断数据类型：**typeof**。<br>
尽管这门语言的创造者想让大家使用此函数来判断数据类型，然而这个函数的表现给开发者特别是初学者造成了很多的误解，看下面的几个例子：

### 基本数据类型

一般情况：

```
typeof(123);   //"number"
typeof("123"); //"string"
typeof(true);  //"boolean"
typeof(undefined); //"undefined"
```

在基本数据类型中，有几个常见的陷阱，看下面几个例子：

#### Null类型

Null类型只有一个值：null。

```
typeof(null); //"object"
```

也许你早就知道这个结果，但是 typeof 函数为什么要这样处理呢？
这实际上是最初实现的一个错误，然后 ES 也沿用了，后来人们为了解释这一矛盾提出：null 是对象的占位符。

#### Undefinded类型

Undefined 类型也只有一个值：undefined。

undefined 是声明变量时未初始化的默认值，undefined 的类型就是 Undefinded，关于 undefined 还有一些奇怪的现象：

```
var a;
var b;
typeof(a); //"undefined"
typeof(b); //"undefined"
typeof(c); //"undefined"
console.log(a == b); //true
console.log(a == c); //false
```

由此可以看出，值 undefined 并不同于未定义的值。但是 typeof并没有区分它们，都返回 undefined。

下面这个情况就更诡异了，现在大家已经习惯把 undefined 当做关键字，但是在一些古老的浏览器中 undefined 的值是可以改变的。
这段代码在IE6、7、8中执行结果是这样的：

```
undefined = 123；
typeof(undefined); //123
```

所以 jQuery 在某个版本之后，它的源代码是这样子的：

```
(function( window, undefined ) {
...
...
...
})( window );
```

再看看这个不符常理的例子：

```
console.log(null == undefined); //true
```

实际上，值 undefined 实际上是从值 null 派生来的，因此ES把他们定义为相等。<br>
尽管这两个值相等，但他们的含义不同。undefined 是声明了变量但未对其初始化时赋予该变量的值，null 则用于表示尚未存在的 **对象**。

#### Number类型

一个特殊值是 NaN，表示非数（Not a Number）。NaN 是个奇怪的特殊值。一般说来，这种情况发生在类型（String、Boolean 等）转换失败时。

```
alert(NaN == NaN);  //输出 "false"
```

这个问题我找了很多的解释都不够深入，后来我想到由于JS在设计时，很多地方沿用了Java的特点，其实Java中也有类似的问题（比如Double.NaN == Double.NaN return false）。<br>
简单来说，由于NaN的解释是not a Number，所以它可以是任意值，所以不能保证两个NaN是相等的，NaN只是一个API中用来判断逻辑的字面量，并没有实际意义。
出于这个原因，不推荐使用 NaN 值本身。但是函数 isNaN() 却很好用：

```
alert(isNaN("blue"));  //输出 "true"
alert(isNaN("666"));   //输出 "false"
```

### 引用类型

ES并没有类的概念，但是ES定义了**对象**，逻辑上实现了其他语言中的类。

#### 对象

JS中也使用new关键字来创建对象。

```
var s = new String("123");
var n = new Number(123); 
var b = new Boolean(true);
typeof(s); //"object"
typeof(n); //"object"
typeof(b); //"object"
```

这些都是对象，与基本类型有所不同：

```
var s = new String("123");
console.log(s == "123");        //true
console.log(s === "123");       //false
console.log(s == String(123));  //true
console.log(s === String(123)); //false
```

可以看出，值相等，但是类型不同。

下面这些类型也是对象，typeof没有对他们进行区分：

```
typeof([]);           //"object"
typeof(new Array());  //"object"
typeof({});           //"object"
typeof(new Object()); //"object"
```

还有一种特殊的对象，typeof 对它有一个特别的返回值：

```
typeof(function f(){});        //"function"
typeof(new Function("f",""));  //"function"
```

为什么typeof要单独区分object和function呢？

到底函数是不是对象呢？关于这个问题，前人已经引申出了很多的问题（比如Function与Object的关系、function创建的object和{}有什么区别），而且都极易混淆。

下面我们将循序渐进的分析：

我们再来看JS中另一个与数据类型有关的函数：**instanceof**，我们常用来 instanceof 判断他们是不是实例与构造函数的关系，比如：<br>
A instanceof B，用来查看A是不是B的实例，也可以说判断B是不是A的构造函数。

执行下面这段代码：

```
function F(){};
console.log(F instanceof Object);   //true
console.log(F instanceof Function); //true
var f = new F();
console.log(f instanceof Object);   //true
console.log(f instanceof Function); //false
```

这说明F是函数的实例，也是对象的实例，那么事实就是函数就是对象、对象就是函数这么简单吗？

```
console.log(Function instanceof Object);  //true  
console.log(Object instanceof Function);  //true
```

这个结果会让初学者迷惑，下面，我们不得不首先说明这些关于JS继承中常常提到的概念：

如果你已经了解了原型链的概念，你可以略过 *斜体* 部分。

如果你不了解[原型链](http://blog.zhangxiaolong.me/javascript/2013/10/27/prototype-chain-analysis/)，推荐你点击这个链接仔细阅读，因为这个概念将对理解下面的内容非常重要。

- *prototype：为了让JS中有继承概念而设计的这一属性，是构造函数最重要的属性。prototype对象中的所有属性、方法(包括constructor、__proto__)，都会被实例继承。*
- *constructor：有2个地方会出现这个属性：*
*1）构造函数的prototype对象拥有此属性，指向构造函数本身；*
*2）实例拥有此属性，指向它的构造函数。*
- *__proto__：实例拥有此属性，指向构造函数的prototype对象。*

*下面这段代码将用于印证上述理论：*

```
var s = new String("123");
console.log(String.prototype);                         //String{}
console.log(String.prototype.constructor === String);  //true
console.log(s.constructor === String);                 //true
console.log(s.__proto__ === String.prototype)          //true
```

通过上面几段（*斜体*以前）代码，你可以看出instanceof函数并没有这么简单，根据ES的定义，A instanceof B，是从对象（A）的原型链上查找是否存在构造函数（B）的原型，即：

从A.__proto__、A.__proto__.__proto__、A.__proto__.__proto__.__proto__......、Object.__proto__， 中查找有没有 B.prototype 这个对象。

下面有一张图来能够更全面的描述JS中这些构造函数的关系：<br>

<img src="/assets/images/data-type/chain.jpg" width="650px" />

透过这张图，我们不难得出这样一个结论：任何对象的原型链最后都能追溯到 Object.prototype。 所以说 JavaScript 中所有的对象都继承自 Object 。

而所有的构造函数都是 Function 的实例，包括 Function 本身：

```
function F(){};
console.log(F.constructor === Function);         //true
console.log(String.constructor === Function);    //true
console.log(Number.constructor === Function);    //true
console.log(Boolean.constructor === Function);   //true
console.log(Object.constructor === Function);    //true
console.log(Function.constructor === Function);  //true
```

也就是说所有的构造函数都能通过原型链找到创建他们的 Function构造函数的构造原型 Function.protorype对象（包括 Function 自己），所以

```
function F(){};
console.log(F instanceof Function);         //true
console.log(String instanceof Function);    //true
console.log(Number instanceof Function);    //true
console.log(Boolean instanceof Function);   //true
console.log(Object instanceof Function);    //true
console.log(Function instanceof Function);  //true
```

与此同时，又因为 Function.prototype 是一个对象，所以他的构造函数是 Object. 从原型链机制的的角度来说，那就是说所有的函数都能通过原型链找到创建他们的 Object 构造函数的构造原型 Object.prototype对象，所以：

```
console.log(Function instanceof Object);// true
```

#### 结论：在 JavaScript 语言中，一切的一切都是对象，它们全部继承自 Object。或者说所有对象的原型链的根节点都是 Object.prototype
