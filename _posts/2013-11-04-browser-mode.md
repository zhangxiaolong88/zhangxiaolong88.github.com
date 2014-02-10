---
layout: post
title: "浏览器的标准模式和怪癖模式"
description: ""
category: browser
tags: [browser, css, javascript]
---
{% include JB/setup %}

浏览器有两种模式：QuirksModel(怪癖模式)、 CSSCompat(strict mode 标准模式)
浏览器解析CSS用哪种模式取决于DTD声明：

- 当浏览器采用HTML4.0以下的DOCTYPE声明时，浏览器采用QuirksModel，其他版本采用CSSCompat；
- 不写DOCTYPE，浏览器采用QuirksModel；浏览器不识别DOCTYPE，采用CSSCompat。

### CSS不同之处（收集中）：
#### 1. 盒子模型

QuirksModel：盒子宽度包括padding和border

CSSCompat：只包括content

<img src="/assets/images/browser-model/bm_01.jpg" width="650px" />

<!-- more -->

#### 2. 水平居中
CSSCompat：

```
margin: 0 auto; //就可以水平居中
```

QuirksModel：

```
text-align:center;
```

#### 3. 百分比高度
css:

```
body {text-align: center;}
div {border:1px solid #000;}
.box {
    height: 20%;
    width: 10%;
    margin:0 auto;
}
.inbox {
    width: 50%;
    height: 20%;
}
```

html:

```
<div class="box">
    <div class="inbox"></div>
</div>
```

QuirksModel：可以设置百分比高度

<img src="/assets/images/browser-model/bm_02.jpg" width="214px" />

CSSCompat：只取决于内容高度

<img src="/assets/images/browser-model/bm_03.jpg" width="201px" />

#### 4. 行内元素

QuirksModel：可以设置height和width都可以生效

#### 5. table字体样式继承

QuirksModel：会继承

### javascript不同之处：

```
alert(document.compatMode); //可以查看当前浏览器使用什么模式
```
