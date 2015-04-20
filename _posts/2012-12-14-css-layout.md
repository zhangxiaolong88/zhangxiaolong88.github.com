---
layout: post
title: "CSS常见首页布局"
keywords: layout html css
description: ""
category: css
tags: [css, html, layout]
---
{% include JB/setup %}

<!-- more -->

### 要求： 两栏布局，左边的固定宽度，右边的自适应宽度
#### 第一种方式：
html:

```html
<div id="left">left</div>
<div id="right">right</div>
```

css:

```css
#left { float:left; width:100px; }
#right { margin-left:100px; }
```

#### 第二种方式：
html:

```html
<div id="right">
	<div id="content">right</div>
</div>
<div id="left">left</div>
```

css:

```css
#left { float:left; width:100px; }
#right { float:right; width:100%; margin-left:-100px;}
#content { margin-left:100px; }
```

### 要求：三栏布局，左边，右边固定宽度，中间的自适应宽度
####第一种方式：
html:

```html
<div id="left">left</div>
<div id="right">right</div>
<div id="main">main</div>
```

css:

```css
#left { float:left; width:200px; }
#right { float:right; width:100px; }
#main {margin:0 100px 0 200px; }
```

#### 第二种方式：
html:

```html
<div id="main">
    <div id="content">main</div>
</div>
<div id="left">left</div>
<div id="right">right</div>
```

css:

```css
#left { float:left; width:100px; margin-left:-100%;}
#right { float:left; width: 200px; margin-left: -200px;}
#main { float:left; width:100%; }
#content {margin:0 200px 0 100px;}
```

### 要求：
<img src="/assets/images/css-layout/layout_01.jpg" width="500" />
html:

```html
<div class="left1">left1</div>
<div class="left2">left2</div>
<div class="right">right</div>
```

css:

```css
.left1 { float:left; width:100px; height:150px;}
.left2 { float:left; clear:left; margin-top:10px; width:100px; height:150px;}
.right { margin-left: 110px; height:310px;}
```
