---
layout: post
title: "垂直居中常用方案"
keywords: vertical center
description: ""
category: css
tags: [css, html]
---
{% include JB/setup %}

常见的居中方案整理。

<!-- more -->

### 前提：

```css
body {text-align: center;}
div {border:1px solid #000;}
```

### 1. 单行文字
html:

```html
<div class="box">现在我们要使这段文字垂直居中显示！</div>
```

box有固定高度：

css:

```css
.box {
    width:500px;
    height:200px;
    line-height:200px; /*与高度相同就可以实现单行文字居中*/
}
```

box没有固定高度：

css:

```css
.box {
    padding: 25px;
}
```

### 2. 多行文字
box有固定高度：
#### 第一种方法 设置table属性
html:

```html
<div class="outbox">
<div class="box">
<div class="inbox">
这是一段文字。
这是一段长文字。
这是一段为了测试居中布局的文字。
这是一段为了测试多行文字局中布局的文字。
</div>
</div>
</div>
```

css:

```css
.outbox {
    width:500px;
    height:200px;
    display:table;
}
.box {
    display:table-cell;
    vertical-align: middle;
}
```

- 优点： inbox的内容可以动态改变高度 <br>
- 缺点：可惜这种方法IE无效！！！

#### 第二种方法 定位
html:

```html
<div class="box">
<div class="inbox">
这是一段文字。
这是一段长文字。
这是一段为了测试居中布局的文字。
这是一段为了测试多行文字局中布局的文字。
</div>
<!--img src="test.png" width="120" height="60" /-->
</div>
```

css:

```css
.box {
    height: 300px;
    width:600px;
    position:relative;
}
.inbox{
    position:absolute;
    top:50%;
    left:0px;
    height:100px; /*由于只能保证inbox垂直居中，所以这个高度要根据内容来设置，才能保证内容看起来居中*/
    margin-top:-50px;
}
img { /*同理：如果图片设置高度也可以用这种方法*/
    position:absolute;
    top:50%;
    left:50%;
    height:57px;
    width:117px;
    margin-top:-30px; /*高度的一半*/
    margin-left:-60px; /*宽度的一半*/
}
```

- 优点：适用于所有浏览器不需要嵌套标签 <br>
- 缺点：内容的高度要设置，不够灵活；没有足够空间时，inbox会消失

#### 第三种方式 插入float元素
html:

```html
<div class="box">
<div id="floater"></div>
<div class="inbox">
这是一段文字。
这是一段长文字。
这是一段为了测试居中布局的文字。
这是一段为了测试多行文字局中布局的文字。
</div>
</div>
```

css:

```css
.box {
    height: 300px;
    width:600px;
}
#floater {
    float:left;
    height:50%;
    margin-bottom:-50px; /*为内容高度的一半*/
}
.inbox{
    clear:both;
    height:100px;  /*与第二种方法一样，需要根据内容设置高度*/
    position:relative;
}
```

- 优点：适用于所有浏览器; 没有足够空间时(例如：窗口缩小) content 不会被截断，滚动条出现 
- 缺点：要增加一个额外的元素

### 特殊情况，未知高度的内容居中：
html:

```html
<div class="outer">
        <div class="inner">
            <img src="images/bg.jpg" width="50">
        </div>
</div>
```

css:

```css
.outer {
    border:1px solid #ccc;
    width:200px;
    height:200px;
    display: table;            /* 表格显示 主要针对非IE 和 高版本IE*/
    *position: relative;       /* IE6.7 */
}
.inner {
    display: table-cell;      

    text-align: center;       /* 水平居中 */
    width:200px;              /* 水平居中 宽度与outer相同 */

    vertical-align: middle;   /* 垂直居中 */
    *position: absolute;    
    *top: 50%;
}
img {
    *position: relative;
    *top:-50%;
}
```
