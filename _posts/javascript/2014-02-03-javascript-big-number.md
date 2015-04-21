---
layout: post
title: "javascript 大数相加"
keywords: JavaScript big number
description: "JavaScript big number"
category: javascript
tags: [javascript]
---
{% include JB/setup %}

超大的数和超小的数，如何计算。

<!-- more -->

首先来看一个例子：  

```javascript
parseInt(1000000000000000000000.5, 10); //1
parseInt(0.0000005); //5
```

以前谈到过，JavaScript 的数字系统是采用 IEEE 754，一开始看到这个问题，以为是 IEEE 754 导致的问题。

常见的问题有浮点数比较：

```javascript
console.log((0.1 + 0.2) == 0.3);  // false
console.log((0.1 + 0.2) === 0.3); // false
console.log(0.1 + 0.2); // 0.30000000000000004
```

后来发现这问题并不会导致 `parseInt(0.0000005)` 变成 `5`，那么问题就可能在 `parseInt` 这个函数上。

	## parseInt
	> `parseInt(string, radix)`

`parseInt` 接受两个参数，第一个参数是要转换的字符串（忽略空白）；第二个参数是基数。

例如：

```javascript
parseInt('   12', 10);  // 12
parseInt('12**', 10);   // 12
parseInt('12.34', 10);  // 12
parseInt(12.34, 10);    // 12
```

最后一个例子让我们看到 `parseInt` 可以将数字类型转换成整数，但最好别这么做。

再来看下面第一个例子：

```javascript
parseInt(1000000000000000000000.5, 10); // 1
```

为什么会这样呢？

`parseInt` 的第一个类型是字符串，所以会将传入的参数转换成字符串，也就是 `String(1000000000000000000000.5)` 的结果为 `'1e+21'`。`parseInt` 并没有将 `'e'` 视为一个数字，所以在转换到 `1` 后就停止了。

这也就可以解释 `parseInt(0.0000005) === 5`：

```javascript
String(0.000005);  // '0.000005'
String(0.0000005); // '5e-7'
```

从上面的程式码可以看出，小于 `0.0000001`（1e-7） 的数字转换成 `String` 时，会变成[科学记号法](http://zh.wikipedia.org/wiki/%E7%A7%91%E5%AD%A6%E8%AE%B0%E6%95%B0%E6%B3%95)，再对这个数进行 `parseInt` 操作就会导致这个问题发生。

所以，在可预见的出现极大或者极小的数字时，不要将 `parseInt` 当做转换 `Number` 和 `Integer` 的工具。

再补上可能出现问题的情况：

```javascript
parseInt(1/0, 19);      // 18
parseInt(false, 16);    // 250
parseInt(parseInt, 16); // 15
parseInt("0x10");       // 16
parseInt("10", 2);      // 2
```

如果无法调整单位，必须采用大数相加，则需要自己封装，比如：

```javascript
/**
 * param1 @string
 * param2 @string
*/
function add(x1, x2){
	var length1 = x1.length, length2 = x2.length;
	if(length1 > length2) {
		x2 = new Array(length1 - length2 + 1).join("0") + x2;
	} else {
		x1 = new Array(length2 = length1 + 1).jone("0") + x1;
	}

	var length = x1.length;

	var carry = 0, // 进位
		array = [];
	while(--length >=0 ){
		carry = parseInt(x1.charAt(length)) + parseInt(x2.charAt(length)) + carry;
		if(carry >= 10){
			array.push(carry - 10);
			carry = 1;
		} else {
			array.push(carry);
			carry = 0;
		}
	}

	if(carry == 1){
		array.push(1);
	}

	return array.reverse().join("");
}
```

该函数的缺陷是，必须传入字符串类型的数值，返回仍然是String类型。  


###结论

**1) parseInt**  
使用parseInt时，一定要带第二个参数；

**2) 规避陷入困境**  
如果在项目可预见将会出现极大或极小的数字时，将对所有数值乘以或除以一个公约数，通过调整单位避免陷入困局。