---
layout: post
title: "javascript 运算符（一）"
keywords: JavaScript operation
description: "javascript operators."
category: javascript
tags: [javascript]
---
{% include JB/setup %}

javascript运算中会出现哪些匪夷所思的现象。

<!-- more -->

javascript中的值分为两大类：原始值（primitive）和对象（object）。

**下面的值是原始值:**

1. 字符串

2. 数字

3. 布尔值

4. null

5. undefined

**所有其它的值都是对象（object）**。对象可以进一步划分：

1. 原始值的包装器：`Boolean`, `Number`, `String`。很少直接使用。

2. 日期：new Date("2011-12-24")。

3. 用字面量创建的对象。
下面的字面量产生对象，也可以通过构造函数创建对象。您可以使用字面量创建对象。

```javascript
var a =  [];           // 就是 new Array()
var b = {};            // 就是 new Object()
var c = function() {}; // 就是 new Function()
var d = /\s*/;         // 就是  new RegExp("\\s*")
```

这次要说的运算符，常见的陷阱就在于原始值和对象的相互转换。

###1. 隐式操作

**ECMAScript运行环境会在需要时执行自动类型转换。定义一套关于转换的抽象操作有助于阐明某些结构的语义。这些抽象操作不是语言本身的一部分；它们被定义在这里是为了协助语言的语义规范。这些关于转换的抽象操作是多态的，它们可以接受任何ECMAScript语言类型。**([ES5资料](http://es5.github.io/#x9))

隐式操作的方法有：ToPrimitive、ToBoolean、ToNumber、ToInteger、ToString、ToObject、CheckObjectCoercible、IsCallable等等，下面主要介绍这次会用到的几种：

####ToPrimitive

将值转换为原始值。

```javascript
ToPrimitive(input，PreferredType?);
```
`ToPrimitive`有2个参数，第一个是传入的要转换的值，第二个可选参数是期望转换的类型（但是转换的结果并不一定指定的这个类型）。

转换时按以下操作：

1. 如果 input 是个原始值，则直接返回它。

2. 否则，如果 input 是一个对象。则调用 obj.valueOf() 方法。 如果返回值是一个原始值，则返回这个原始值。

3. 否则，调用 obj.toString() 方法。 如果返回值是一个原始值，则返回这个原始值。

4. 否则，抛出 TypeError 异常。

如果 `PreferredType` 被标志为 String，则转换操作的第二步和第三步的顺序会调换。 如果没有 `PreferredType` 这个参数，则 `PreferredType` 的值会按照这样的规则来自动设置：

* Date 类型的对象会被设置为 String，

* 其它类型的值会被设置为 Number。

####ToNumber

将值转换为数字。

下面的表格解释了 ToNumber() 是如何将原始值转换成数字的:

<table class="table table-bordered">
  <thead>
    <tr>
      <th>参数</th>
      <th>结果</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>undefined</td>
      <td>NaN</td>
    </tr>
    <tr>
      <td>null</td>
      <td>+0</td>
    </tr>
    <tr>
      <td>boolean</td>
      <td>true被转换为1,false转换为+0</td>
    </tr>
    <tr>
      <td>number</td>
      <td>无需转换</td>
    </tr>
    <tr>
      <td>string</td>
      <td>由字符串解析为数字。例如，"324"被转换为324</td>
    </tr>
  </tbody>
</table>

**注意：如果输入的值是一个对象，则会首先会调用 `ToPrimitive(obj, Number)` 将该对象转换为原始值，
然后在调用 `ToNumber()` 将这个原始值转换为数字。**

####ToString

将值转换为字符串。

下面的表格解释了 ToString() 是如何将原始值转换成字符串的:

<table class="table table-bordered">
  <thead>
    <tr>
      <th>参数</th>
      <th>结果</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>undefined</td>
      <td>"undefined"</td>
    </tr>
    <tr>
      <td>null</td>
      <td>"null"</td>
    </tr>
    <tr>
      <td>boolean</td>
      <td>"true"  或者 "false"</td>
    </tr>
    <tr>
      <td>number</td>
      <td>数字作为字符串。比如，"1.765"</td>
    </tr>
    <tr>
      <td>string</td>
      <td>无需转换</td>
    </tr>
  </tbody>
</table>

####ToBoolean

将值转换为字符串。

下面的表格解释了 ToBoolean() 是如何将原始值转换成字符串的:

<table class="table table-bordered">
  <thead>
    <tr>
      <th>参数</th>
      <th>结果</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>undefined</td>
      <td>false</td>
    </tr>
    <tr>
      <td>null</td>
      <td>false</td>
    </tr>
    <tr>
      <td>boolean</td>
      <td>无需转换</td>
    </tr>
    <tr>
      <td>number</td>
      <td>如果参数是空字符串（其长度为零），结果为 false，否则结果为 true。</td>
    </tr>
  </tbody>
</table>

**注意：如果输入的值是一个对象，则返回true。**

###2. 强制转换

许多 JavaScript 里的操作符和函数都要求其参数为特定的类型。
如果不符合预期的类型，它们就会被强制转换成其他的类型。
强制将一个对象转换为一个原始值类型仅需两步: 
首先，该对象被转为一个原始值，
然后，如果必要的话，该原始值会被转成正确的类型。 
要将对象（object）转换为原始值（primitive）就要用到上面所说的隐式操作。

我们可以用下面这个对象来实验一下强制转换:

```javascript
var obj = {
	valueOf: function () {
		console.log("valueOf");
		return '0';
	},
	toString: function () {
		console.log("toString");
		return 1;
	}
};
```
#### 2.1 强制转换为 number

有两种常见的方法可以将一个值强制转换为 number：`+` 一元操作符以及作为函数的 `Number`（而不是作为构造函数）。

    > +obj
    valueOf
    0
    > Number(obj)
    valueOf
    0

两种方法都像预期那样工作：它们都用了`ToNumber`操作。
结果由 `valueOf()` 所返回的结果被转成了 number。

#### 2.2 强制转换为 string

有两种常见的方法可以将一个值强制转换为 string： 
二元 `+` 操作符，且其中一个是 string 类型，以及作为函数的 `String`（而不是作为构造函数）。

    > ''+obj
    valueOf
    '0'
    > String(obj)
    toString
    '1'

String函数用了`ToString`操作，而二元 `+` 操作符使用的是不带第二个参数的`ToPrimitive`操作。

#### 2.3 强制转换为 boolean

有两种方法可以将一个值强制转换为 boolean：
使用两次二元逻辑反操作符`!`（先一次转成 boolean，然后取反） 或使用作为函数的 `Boolean`。

    > !!obj
    true
    > Boolean(obj)
    true

现在我们看到，对象从未被转成原始值。
规则很简单: 任何对象永远是 `true`，
而对于原始值（primitives）来讲，只有以下值才会被转成 `false`，其他所有值都会被转成 `true`。

* undefined
* null
* false
* +0, -0, NaN
* ""

###总结

当对象转换成原始值的过程中，涉及到的隐式操作，有三种转换算法：

1. “Number”: 你期待该值是一个数字

2. “String”: 你期待该值是一个字符串

3. “Default”: 你对该值没有任何期待

number 算法首先会调用 `valueOf()` ，如果返回值是一个原始值（primitive） 就使用它。 
要不然，它会调用 `toString()` ，如果返回值是一个原始值（primitive） 就使用它。如若不然，则抛出异常。   
string 算法则以相反的顺序会调用这些函数。  
default 算法用于非日期型的 “number” 和日期型的 “string”。