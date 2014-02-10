---
layout: post
title: "JavaScript作用域和变量声明提升机制"
description: ""
category: javascript
tags: [javascript]
---
{% include JB/setup %}

原文地址: [http://www.adequatelygood.com/JavaScript-Scoping-and-Hoisting.html](http://www.adequatelygood.com/JavaScript-Scoping-and-Hoisting.html)

作者：Ben Cherry

该文详细讲述了JavaScript Hoisting的概念，翻译如下：

你知道下面这段JavaScript执行会弹出什么值吗？

```
var foo = 1;
function bar() {
	if (!foo) {
		var foo = 10;
	}
	alert(foo);
}
bar();
```

<!-- more -->

答案是“10”，如果你对答案感到惊讶，下面这个例子可能真的会让你的大吃一惊！

```
var a = 1;
function b() {
	a = 10;
	return;
	function a() {}
}
b();
alert(a);
```

当然，浏览器会弹出“1”，这是怎么回事呢？虽然这个结果让人看起来很奇怪，也让人赶到迷惑，这其实是JavaScript这门语言强大的表现特征。我不知道有没有一个标准的名字来描述这个特性，但我已经喜欢用“变量声明提升”（hoisting）一词来描述它，本文将试图，揭示这一机制，但是首先，我们有必要先来理解什么是JavaScript的作用域。

### JavaScript中的作用域（Scoping in JavaScript）

对于JavaScript初学者来说，作用域是最容易迷惑的问题之一，实际上，不只是初学者，我见过很多有经验的JavaScript程序员也不能完全理解作用域。JavaScript的作用域之所以看起来如此混乱就是因为它看起来类似于C系列的语言风格，思考下面这段C语言代码：

```
#include <stdio.h>
int main() {
	int x = 1;
	printf("%d, ", x); // 1
	if (1) {
		int x = 2;
		printf("%d, ", x); // 2
	}
	printf("%d\n", x); // 1
}
```

该程序输出为1，2，1。这是因为C以及其他的C系列语言拥有**块级作用域（block-level scope）**，当执行进入一个块级，比如if语句，可以在该作用域内声明新的变量，而不影响外部作用域。但是在JavsScript中情况就不是这样了，请尝试在firebug中执行下面的代码：

```
var x = 1;
console.log(x); // 1
if (true) {
	var x = 2;
	console.log(x); // 2
}
console.log(x); // 2
```

firebug将显示1，2，2。这是因为JavaScript有**函数级作用域函数作用域（function-level scope）**。这和C系列语言是不同的。块级作用域，比如if语句，不会创建一个新的作用域，只有函数才会。

对于许多使用C系列语言（比如C，C++，C#或者Java）的程序员来说，JavaScript语言的这种特性显然不在预期之中，也不受他们的欢迎。幸运的是，因为JavaScript的灵活性，产生了一个解决的方案。如果必须在一个函数中创建一个临时的作用域，请执行以下操作：

```
function foo() {
	var x = 1;
	if (x) {
		(function () {
			var x = 2;
			// some other code
		}());
	}
	// x is still 1.
}
```

这个方法实际上是相当灵活的，而且你可以在任何你需要创建临时作用域的地方使用这种方法，不只是语句块内。不过，我强烈建议你花点时间去真正的理解JavaScript作用域。这是相当有用的，也是我喜欢的语言特性之一。如果你理解了作用域，将会对你理解变量声明提升（hoisting）带来更多帮助。

### 声明，变量名称，变量声明提升（Declarations, Names, and Hoisting）

在JavaScript中，一个变量进入一个作用域有四种基本方法：

- 语言定义：全局作用域，默认情况下，作用域下会定义this、arguments。
- 函数参数：函数命名的参数，参数的作用域就是当前的函数体。
- 函数声明：例如foo(){}
- 变量声明：例如var foo

函数和变量声明经常会被隐式的提升到他们所在作用域的顶部，而函数参数和全局作用域的变量，已经在那里。这意味着像这样的代码：

```
function foo() {
	bar();
	var x = 1;
}
```

实际上被解释成这样：

```
function foo() {
	var x;
	bar();
	x = 1;
}
```

事实证明，包含声明的行将永远被执行，下面两种方式是等价的：

```
function foo() {
	if (false) {
		var x = 1;
	}
	return;
	var y = 1;
}
function foo() {
	var x, y;
	if (false) {
		x = 1;
	}
	return;
	y = 1;
}
```

请注意，该变量赋值的部分不会提升，只有变量名称的部分会提升，这种情况与函数声明不同，函数声明时，函数体也将一起提升。请记住，有两个正常的方式来声明函数，请思考下面的JavaScript:

```
function test() {
	foo(); // TypeError "foo is not a function"
	bar(); // "this will run!"
	var foo = function () { // function expression assigned to local variable 'foo'
		alert("this won't run!");
	}
	function bar() { // function declaration, given the name 'bar'
		alert("this will run!");
	}
}
test();
```

在这种情况下，只有包含函数体的函数声明方式，才会连同函数体一起提升。在执行过程中，名称foo被提升，但是foo的函数体被留下了。

上面的东西涵盖了变量声明提升的一些基本知识，它们看起来也没有那么迷惑，当然，在某些特殊的情况下，会表现的更复杂。

### 名称的解析顺序（Name Resolution Order）

最需要牢记的就是变量解析的顺序。请记住变量有四种情况进入一个作用域。我上面列出的是它们在被解析时候的访问顺序，一般来说，如果一个变量已经被定义了，它永远不会被另一个同名的变量覆盖。这意味着，一个函数声明的优先级高于一个变量声明的优先级。这并不是说赋值的部分不会起作用，只是声明的部分被忽略。下面列举出一些例外：

- 函数的内置变量arguments比较奇怪。它看起来是在普通的函数参数之后才声明，其实是在函数声明之前。如果参数里面有arguments，它会比内置的那个有优先级，即时它是undefined。所以不要使用arguments作为为函数参数的名称。
- 尝试使用this作为标示符的地方都会造成一个语法错误。这是一个很好的功能。
- 如果多个参数具有相同的名字，那么最后一个参数会优先于先前的，即使它是undefined。

### 有函数名的函数表达式（Named Function Expressions）

你可以在函数表达式给中给函数命名，用这样的语法来声明一个函数，不能完成一个函数声明，下面有一些代码来说明我的意思（注意看spam）：

```
foo(); // TypeError "foo is not a function"
bar(); // valid
baz(); // TypeError "baz is not a function"
spam(); // ReferenceError "spam is not defined"

var foo = function () {}; // anonymous function expression ('foo' gets hoisted)
function bar() {}; // function declaration ('bar' and the function body get hoisted)
var baz = function spam() {}; // named function expression (only 'baz' gets hoisted)

foo(); // valid
bar(); // valid
baz(); // valid
spam(); // ReferenceError "spam is not defined"
```

### 编程时应该如何来应对

现在你应该理解了作用域和变量声明提升（hoisting），那么我们在编写JavaScript的时候应该怎么做呢？最重要的事情就是始终用var表达式来声明你的变量。我强烈的建议你每个作用域里面只写一次var来声明变量，而且是在作用域的最顶部。如果你强迫自己做到这一点，你将永远不会遇到任何与变量提升相关的混乱的问题。但是这样做也让我们很难跟踪那些在当前作用域中实际上已经声明的变量。我建议你使用JSLint和声明一次原则来进行实际操作，如果你这样做了，你的代码应该会看起来像这样：

```
/*jslint onevar: true [...] */
function foo(a, b, c) {
    var x = 1,
    	bar,
    	baz = "something";
}
```

### 规范怎么说

我去咨询了ECMAScript标准（PDF格式），直接去了解这些东西是如何工作的，效果不错。这里我不得不说关于变量声明和范围（第12.2.2节）的内容：

*如果在一个函数中声明变量，这些变量就被定义在了在该函数的函数作用域中，见第10.1.3所述。不然它们就是被定义在全局的作用域内（即，它们被创建为全局对象的成员，见第10.1.3所述），当进入执行环境的时候，变量就被创建。一个块级不能定义一个新的作用域。只有一个程序或者函数声明能够产生一个新的作用域。创建变量时，被初始化为undefined。如果变量声明语句里面带有赋值操作，则赋值操作只有被执行到声明语句的时候才会发生，而不是创建的时候。*

我希望这篇文章阐明了对JavaScript程序员来说最常见的迷惑问题，我试图将尽可能的详尽，来避免造成更多的迷惑，如果我说错了或者大的遗漏，请让我知道。