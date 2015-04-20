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

####1. 一元操作符 '+'

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

###3. 稍复杂的问题

	++[[]][+[]]+[+[]] 

**结果是？**

变形如下：

	++[[]][0] + [0]
	+([]+1) + [0]  //注意++[]会有语法错误
	+"1" + [0]
	1 + [0]
	"10"

基于这个思路，我们可以做出一些好玩的东西。    

**1) 获取"a"**

可以通过 "false"[1] 或 "NaN"[1]；  
"false" 刚才做过，通过 false + []；  
布尔false 可以通过![]获得。

而数字1，刚才也做过，可以通过`++[[]][+[]]`获得。

```javascript
(![]+[])[++[[]][+[]]] === "a";
```

**2) 获取"l"**

同理字母`l`可以通过"false"[2]获得。  

数字2，可以通过`++[1][+[]]`来获取（数字1带入上面的算式）。  
得出数字2之后，数字3同理`++[2][+[]]`，带入数字2的算式，这样就解决了所有数字的算式。

```javascript
(![]+[])[++[++[[]][+[]]][+[]]] === "l";
```

**3) 获取"e"**

字母`e`可以通过"true"[3]获得。

```javascript
(!![]+[])[++[++[++[[]][+[]]][+[]]][+[]]] === "e";
```

**4) 获取"r"**
字母`r`可以通过"true"[1]获得。

```javascript
(!![]+[])[++[[]][0]] === "r";
```

**5) 获取"t"**
"true"[0]

```javascript
(!![]+[])[+[]] === "t";
```

通过以上方法可以拼写出大量的字母，比如利用`[object Object]`、`NaN`等等，这为`XSS`提供了更多的攻击方式。