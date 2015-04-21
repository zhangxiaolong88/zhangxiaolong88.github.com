---
layout: post
title: "javascript 运算符（二）"
keywords: JavaScript operation
description: "javascript operators."
category: javascript
tags: [javascript]
---
{% include JB/setup %}

上一节主要解释了数据类型转换中的操作步骤和原理，下面将用到这些方法做一些实践检测。

<!-- more -->

####1. 一元操作符 `+`

**1) +false**

一元操作符`+`会强制转化为数字，结果为+0。

**2) +[]**

调用ToNumber()隐式操作：  
第一步：调用`ToPrimitive([], Number)`操作，首先执行[].valueOf()，结果为[]，结果不为原始值，所以继续执行[].toString()，结果为"";  
第二步：将结果""转为数字，最终结果为0。

####2. 二元操作符 `+`

**1) false + []**

二元操作符`+` 会按照default算法。    
第一步：false + "" // 调用`ToPrimitive([], Number)`操作，[]最终结果为""。  
第二步："false"。

**2) [] + []**

两个[]，都调用`ToPrimitive([], Number)`操作，变成""+""，最终结果为""。

**3) 5 + Number(7)**

Number(7)调用ToNumber()操作，结果为7，最终结果为12。

**4) '6' + {valueOf: function(){ return 2;}}**

后半部分调用`ToPrimitive({}, Number)`操作，结果为2，最终结果为62。

**5) [] + {}**

[]变成"";  
{}调用`ToPrimitive({}, Number)`操作，首先执行{}.valueOf()，结果为{}，结果不为原始值，所以继续执行{}.toString()，结果为"[object Object]";  
原式变成"" + "[object Object]"，最终结果为"[object Object]"。

**6) {} + {}**

由于第一个{}被当成了代码快，所以原式等价于+{}。  
也就是对{}执行ToNumber()操作：  
第一步：`ToPrimitive({}, Number)`，结果为"[object Object]"；  
第二部：将"[object Object]" 转化为数字，最终结果为NaN。

**7) ({} + {})**

结果为 "[object Object][object Object]"。

**8) {} + []**

结果为0。

####3. 比较 `==`

同理，javascript不同类型对象比较规则如下：

<table class="table table-bordered">
  <thead>
    <tr>
      <th>x</th>
      <th>y</th>
      <th>结果</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>undefined</td>
      <td>null</td>
      <td>true</td>
    </tr>
    <tr>
      <td>Number</td>
      <td>String</td>
      <td>x == ToNumber(y)</td>
    </tr>
    <tr>
      <td>Boolean</td>
      <td>(any)</td>
      <td>ToNumber(x) == y</td>
    </tr>
    <tr>
      <td>String or Number</td>
      <td>Object</td>
      <td>x == ToPrimitive(y)</td>
    </tr>
  </tbody>
</table>
