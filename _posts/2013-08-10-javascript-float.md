---
layout: post
title: "javascript 浮点数"
keywords: JavaScript float
description: "javascript float."
category: javascript
tags: [javascript]
---
{% include JB/setup %}

在如Javascript中，为什么浮点型数值运算时会产生误差？ 

<!-- more -->

如：

```javascript
0.1 + 0.2; // 0.30000000000000004;
0.7 + 0.1; // 0.79999999999;
```

由于javascript和很多其他语言一样都是采用二进制浮点数表示法表示浮点数的，所以很多时候出来的结果会跟我们预期的不一样。JS中只有Number类型，并没有细分为 Integer 和 Float, JS中所有数值不管是整数还是浮点数都是以浮点数的形式保存的。

其实，不仅在 JavaScript 中存在这个问题，所有的支持二进制浮点数运算（绝大部分都是 `IEEE 754[1]` 的实现）的系统都存在这个现象。  

其原因就是，在有限的存储空间下，绝大部分的十进制小数都不能用二进制浮点数来精确表示。例如，0.1 这个简单的十进制小数就不能用二进制浮点数来表示。

`计算机浮点数`，其实就是二进制的`科学计数法`。   

在十进制中，科学计数法的形式是： 
<img src="/assets/images/js-float/10.png" />

相应的，二进制的科学计数法就是：  
<img src="/assets/images/js-float/11.png" />

而在有限的存储空间下，十进制小数 0.1 无论如何也不能用这种形式来表示，因此，计算机在存储它时，产生了精度丢失，所以就出现了问题中所描述的现象。

二进制浮点数具体的储存、运算细节，可以查阅现在应用最广的 [IEEE 754](http://zh.wikipedia.org/wiki/IEEE_754)。

解决问题的大概思路就是，先把因数放大为整数，最后再除以相应的倍数，这样就能得到正确的结果了。比如：  

**加法**

```javascript
function floatAdd(arg1,arg2){
	var r1, r2, m;
	try{ r1 = arg1.toString().split(".")[1].length; }catch(e){ r1 = 0; }
	try{ r2 = arg2.toString().split(".")[1].length; }catch(e){ r2 = 0; }
	m = Math.pow(10, Math.max(r1 , r2));
	return (arg1 * m + arg2 * m) / m;
}

Number.prototype.add = function (arg){
	return floatAdd(arg, this);
}

```
