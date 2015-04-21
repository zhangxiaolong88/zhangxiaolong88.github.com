---
layout: post
title: "DOM元素浮动整理"
keywords: dom float element
description: ""
category: css
tags: [css, html, float]
---
{% include JB/setup %}

浮动元素的有哪些特性？

<!-- more -->

### 例子1：浮动元素的特性

html:

```html
<div class="left">left</div>
<div class="right">right</div>
```

css:

```css
.left {
	float: left;
	width: 100px;
	background: red;
}
.right {
	background:blue;
}
```

1）如果right元素不设置宽度，则会跟在left之后且宽度自适应


<img src="/assets/images/yuan-su-fu-dong/float_01.jpg" width="600px" />

2）如果right元素设置宽度，则会换行(IE6.7不会)

css:

```css
.left {
	float: left;
	width: 100px; 
	background: red;
}
.right {
	width:100px; 
	background:blue;
}
```

<img src="/assets/images/yuan-su-fu-dong/float_02.jpg" width="400px" />

### 例子2：“float起源”

html:

```html
<div class="float">float</div>
<div class="content">我是围绕你的文字我是围绕你的文字我是围绕你的文字我是围绕你的文字我是围绕你的文字我是围绕你的文字</div>
```

css:

```css
.float { 
	float:left; 
	width:100px;
	height:100px; 
	background:red;
}
.content { 
	width:200px; 
	height:200px; 
	background:blue;
}
```

<img src="/assets/images/yuan-su-fu-dong/float_03.jpg" width="300px" />

### 例子3：“讨厌的浮动”

html:

```html
<div class="outer">
    <div class="float">float</div>
</div>
```

css:

```css
.outer { 
	padding:20px; 
	background:blue;
}
.float { 
	float:left; 
	width:100px; 
	height:100px; 
	background: red;
}
```

<img src="/assets/images/yuan-su-fu-dong/float_04.jpg" width="600px" />

传说中的高度塌陷

### 清除浮动

方法1：

```css
.outer {
	overflow: hidden; 
	zoom:1; //ie6 trigger haslayout
}
```

方法2：
html:

```html
<div class="outer">
    <div class="float">float</div>
    <div class="clear"></div>
</div>
```

css:

``css
.clear {
	clear:both;
}
```

<img src="/assets/images/yuan-su-fu-dong/float_05.jpg" width="600px" />
