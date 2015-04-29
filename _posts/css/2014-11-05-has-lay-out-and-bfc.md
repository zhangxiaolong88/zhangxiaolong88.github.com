---
layout: post
title: "hasLayout 和 Block Formatting Contexts"
keywords: hasLayout BFC
description: "什么是haslayout？什么是Block Formatting Contexts？他们有什么关联，又有什么区别呢？"
category: css
tags: [css, html]
---
{% include JB/setup %}

什么是haslayout？什么是Block Formatting Contexts？他们有什么关联，又有什么区别呢？

<!-- more -->

###1. hasLayout

`Layout` 是 IE 的专有概念，它决定了元素如何对其内容进行定位和尺寸计算，与其他元素的关系和相互作用，以及对应用还有使用者的影响。

**概念说明：**

1） `Layout` 可以被某些 CSS property（特性）不可逆的触发，而某些 HTML 元素本身就具有 layout 。  
2） `Layout` 在 IE 中可以通过 hasLayout 属性来判断一个元素是否拥有 layout ，如 object.currentStyle.hasLayout 。  
3） `Layout` 是 IE 浏览器渲染引擎的一个内部组成部分。在 IE 浏览器中，一个元素要么自己对自身的内容进行组织和计算大小， 要么依赖于包含块来计算尺寸和组织内容。为了协调这两种方式的矛盾，渲染引擎采用了 ‘hasLayout’ 属性，属性值可以为 true 或 false。 当一个元素的 ‘hasLayout’ 属性值为 true 时，我们说这个元素拥有了一个布局（layout），即成功触发hasLayout。

**触发方式：**

默认拥有布局的元素：  

```html
<html>, <body>
<table>, <tr>, <th>, <td>
<img>
<hr>
<input>, <button>, <select>, <textarea>, <fieldset>, <legend>
<iframe>, <embed>, <object>, <applet>
<marquee>
```

可触发 hasLayout 的 CSS 特性:

```css
display: inline-block         /*ALL*/
height: (除 auto 外任何值)    /*仅适用IE6 7*/
width: (除 auto 外任何值)     /*仅适用IE6 7*/
float: (left 或 right)       /*ALL*/
position: absolute           /*ALL*/
writing-mode: tb-rl          /*ALL*/
zoom: (除 normal 外任意值)    /*仅适用IE6 7*/
```

IE7 还有一些额外的属性(不完全列表)可以触发 hasLayout ：  

```css
min-height: (任意值)/*以下适用IE7+*/
min-width: (任意值)
max-height: (除 none 外任意值)
max-width: (除 none 外任意值)
overflow: (除 visible 外任意值，仅用于块级元素)
overflow-x: (除 visible 外任意值，仅用于块级元素)
overflow-y: (除 visible 外任意值，仅用于块级元素)
position: fixed
```

IE6 以前的版本（也包括 IE6 及以后所有版本的混杂模式，其实这种混杂模式在渲染方面就相当于 IE 5.5）， 通过设置任何元素的 ‘width’ 或 ‘height’（非auto）都可以触发 hasLayout ； 但在 IE6 和 IE7 的标准模式中的行内元素上却不行，设置 ‘display:inline-block’ 才可以。

###2. Block Formatting Contexts（BFC）

IE有它自己的hasLayout属性，那么非IE浏览器呢？非IE浏览器采用的就是BFC（块格式化上下文）。

**概念说明：**

1） BFC是 W3C CSS 2.1 规范中的一个概念，它决定了元素如何对其内容进行定位，以及与其他元素的关系和相互作用。  
2） 在创建了 BFC的元素中，其子元素会一个接一个地放置。垂直方向上他们的起点是一个包含块的顶部，两个相邻的元素之间的垂直距离取决于 ‘margin’ 特性。在BFC中相邻的块级元素的垂直边距会折叠（collapse）。  
3） 在BFC 中，每一个元素左外边与包含块的左边相接触（对于从右到左的格式化，右外边接触右边）， 即使存在浮动也是如此（尽管一个元素的内容区域会由于浮动而压缩），除非这个元素也创建了一个新的BFC。  
4、 在CSS3中，对这个概念做了改动：http://www.w3.org/TR/css3-box/#block-level0，CSS3中，将BFC 叫做 flow root。

**触发方式：**

```css
float:(任何值除了none)
overflow:（任何值除了visible）
display:(table-cell/table-caption/inline-block)
position:(任何值除了static/relative)
```

*Tips:我们有时会用overflow:hidden的方法去清除浮动，就是因为触发了元素的块格式化上下文(IE6 7要申明zoom为1)，这个方法的确简单，但很暴力。*

###3. hasLayout 和 BFC 的特点

####3.1 在触发 hasLayout 的元素和创建了 BFC的元素中，浮动元素参与高度的计算

**情况1：没有创建 BFC的块级非替换元素，触发了 IE 的 hasLayout。**

分析以下代码：

```html
<div style="width:300px;">
    <div id="Container" style="background:silver; zoom:1;">
        <span id="SPAN1" style="background:gray;">simple text</span>
        <div id="DIV1" style="width:150px; height:50px; background:dimgray;">in flow</div>
        <div id="DIV2" style="float:left; background:gold;">float:left</div>
    </div>
</div>
```

Container 没有创建 block formatting context。  
Container 的 ‘zoom:1’设置，是为了触发 IE 中的 hasLayout；  
Container 的高度值为 auto，并且 ‘overflow’ 的值为默认的 ‘visible’；  
SPAN1 是一个行内元素， DIV1 是一个处于普通流中的块元素；  
DIV2 是一个浮动的块级元素。

根据 CSS2.1 规范第 10.6.3 部分的高度计算规则，在进行普通流中的块级非替换元素的高度计算时，浮动子元素不参与计算。

所以，在进行 Container 高度计算时，只受 SPAN1 和 DIV1 的影响，应该是它们两个的高度之和，所以最终银色部分不应该包含金色的部分。

这段代码在不同的浏览器环境中表现如下：

<table>
	<tr>
		<th>IE6 IE7 IE8(Q)</th>
		<th>IE8(S) Firefox Chrome Safari Opera</th>
	</tr>
	<tr>
		<td><img src="/assets/images/hasLayout&BFC/01.png" /></td>
		<td><img src="/assets/images/hasLayout&BFC/02.png" /></td>
	</tr>
</table>

去掉 Container 的 ‘zoom:1′ 后，各浏览器表现一致：

<img src="/assets/images/hasLayout&BFC/02(1).png" />

可见，IE 浏览器中，触发 hasLayout 的元素在进行高度计算的时候，其浮动的子元素也会参与运算。

**情况2：创建了 BFC的块级非替换元素，未触发 IE 的 hasLayout。**

分析以下代码：

```html
<div style="width:300px;">
    <div id="Container" style="background:silver; overflow:hidden;">
        <span id="SPAN1" style="background:gray;">simple text</span>
        <div id="DIV1" style="width:150px; height:50px; background:dimgray;">in flow</div>
        <div id="DIV2" style="float:left; background:gold;">float:left</div>
    </div>
</div>
```

Container 的 ‘overflow:hidden;’ 创建了BFC；  
Container 的 ‘overflow:hidden;’，在 IE6 中未触发 hasLayout，但在 IE7(S) 中触发了 hasLayout；  
Container 的高度值为 ‘auto’；  
SPAN1 是一个行内元素，DIV1 是一个处于普通流中的块元素；  
DIV2 是一个浮动的块级元素。  

根据 CSS2.1 规范第10.6.7部分的高度计算规则，在计算生成了 BFC的元素的高度时，其浮动子元素应该参与计算。

所以，在进行 Container 高度计算时，DIV2 也应该参与计算，所以最终银色部分应该包含金色的部分。

这段代码在不同的浏览器环境中表现如下：( 注意 IE7(S) 此时触发了 hasLayout )

<table>
	<tr>
		<th>IE6 IE7(Q) IE8(Q)</th>
		<th>IE7(S) IE8(S) Firefox Chrome Safari Opera</th>
	</tr>
	<tr>
		<td><img src="/assets/images/hasLayout&BFC/02(2).png" /></td>
		<td><img src="/assets/images/hasLayout&BFC/01(1).png" /></td>
	</tr>
</table>

可见，只要 Container 创建了 BFC，其浮动子元素就会参与其高度计算（IE7(S) 是由于 hasLayout 导致与其他浏览器的效果相同）。

####3.2 与浮动元素相邻的、触发了 hasLayout 的元素或创建了 BFC 的元素，都不能与浮动元素相互覆盖

如果浮动元素的两侧有足够的空间放置该元素，则元素会紧邻浮动元素放置，必要时，该元素的宽度将会被压缩。否则它们可 能会定位到浮动元素的下方。

**情况1：没有创建 BFC 的块级非替换元素，触发了 IE 的 hasLayout。**

分析以下代码：

```html
<div id="Container" style="border:2px solid gold; width:300px; height:150px;<strong> background:url("grid2a.png") repeat;</strong>">
    <div id="DIV1" style="background-color:gold; width:100px; height:100px; float:left; filter:alpha(opacity=50); opacity: 0.5;">
        Float Block
    </div>
    <div id="DIV2" style="background-color:green; zoom:1;">
        If I had a single flower for every time I think about you, I could walk forever in my garden.
    </div>
</div>
```

DIV1 是一个浮动元素，背景是 50% 的透明；  
DIV2 的 ‘zoom:1′ 触发了 IE 中的 hasLayout。

其中，grid2a.png 背景是 100px * 100px 的图片：

<img src="/assets/images/hasLayout&BFC/grid2a.png" />

根据 CSS 2.1 9.5 Floats 中的描述，浮动元素会覆盖普通流中的块容器。所以，DIV2 应该有一部分呢被 DIV1 覆盖。

这段代码在不同的浏览器环境中表现如下：(忽略 IE 中 3px BUG 的影响)

<table>
	<tr>
		<th>IE6 IE7 IE8(Q)</th>
		<th>IE8(S) Firefox Chrome Safari Opera</th>
	</tr>
	<tr>
		<td><img src="/assets/images/hasLayout&BFC/03.png" /></td>
		<td><img src="/assets/images/hasLayout&BFC/04.png" /></td>
	</tr>
</table>

**情况2：创建了 BFC的块级非替换元素，未触发 IE 的 hasLayout。**

分析以下代码：

```html
<div id="Container" style="border:2px solid gold; width:300px; height:150px;<strong> background:url("grid2a.png") repeat;</strong>">
    <div id="DIV1" style="background-color:gold; width:100px; height:100px; float:left; filter:alpha(opacity=50); opacity: 0.5;">
        Float Block
    </div>
    <div id="DIV2" style="background-color:green; overflow:hidden;">
        If I had a single flower for every time I think about you, I could walk forever in my garden.
    </div>
</div>
```

DIV1 是一个浮动元素，背景是50%的透明；  
DIV2 的 ‘overflow:hidden;’ 在 IE6 中未触发 hasLayout，但在 IE7(S) 中触发了 hasLayout。

根据 CSS 2.1 9.5 Floats 中的描述，创建了BFC的元素不能与浮动元素重叠， 所以，DIV2 应该有一部分被 DIV1 覆盖。

这段代码在不同的浏览器环境中表现如下：( 注意 IE7(S) 此时触发了 hasLayout )

<table>
	<tr>
		<th>IE6 IE7(Q) IE8(Q)</th>
		<th>IE7(S) IE8(S) Firefox Chrome Safari Opera</th>
	</tr>
	<tr>
		<td><img src="/assets/images/hasLayout&BFC/04(1).png" /></td>
		<td><img src="/assets/images/hasLayout&BFC/03(1).png" /></td>
	</tr>
</table>

####3.3 触发 hasLayout 的元素和创建了 BFC的元素不会与它们的子元素发生外边距折叠

**情况1：没有生成BFC的块级非替换元素，触发了 IE 的 hasLayout。**

分析以下代码：

```html
<div id="Container" style="width:300px; border:1px solid gold;">
    <div id="DIV1" style="zoom:1; background:darkgray;">
        <div id="DIV2" style="margin:30px 0; width:60px;">content</div>
    </div>
</div>
```

Container 是宽度为300px，含有 border 的块元素，根据标准，它不会与子元素的 margin 发生空白边折叠。  
DIV1 的宽度没有设置，所以宽度等于 Container 的宽度。  
DIV1 的高度也没有设置，所以其高度取决于其内容的高度。  
DIV1 设置了 ‘zoom:1’，在 IE 中触发了 hasLayout。

根据 CSS 2.1 8.3.1 Collapsing margins 第一条，两个相邻的普通流中的块框在垂直位置的空白边会发生折叠现象。

DIV1 和 DIV2 应该发生空白边折叠，深灰色的 DIV1 应该刚好包含 ‘content’ 文本。

这段代码在不同的浏览器环境中表现如下：

<table>
	<tr>
		<th>IE6 IE7 IE8(Q)</th>
		<th>IE8(S) Firefox Chrome Safari Opera</th>
	</tr>
	<tr>
		<td><img src="/assets/images/hasLayout&BFC/05.png" /></td>
		<td><img src="/assets/images/hasLayout&BFC/06.png" /></td>
	</tr>
</table>

可见，在 IE 中，触发 hasLayout 的元素，阻止了它自身与子元素间的空白边折叠。

**情况2：生成 BFC的块级非替换元素，未触发 IE 的 hasLayout。**

分析以下代码：

```html
<div id="Container" style="width:300px; border:1px solid gold;">
    <div id="DIV1" style="overflow:hidden; background:darkgray;">
        <div id="DIV2" style="margin:30px 0; width:60px;">content</div>
    </div>
</div>
```

Container 是宽度为300px，含有 border 的块元素，根据标准，它不会与子元素的 margin 发生空白边折叠。  
DIV1 的宽度没有设置，所以宽度等于 Container 的宽度。  
DIV1 的高度也没有设置，所以其高度取决于其内容的高度。  
DIV1 设置了 ‘overflow:hidden’，在 IE6 中未触发 hasLayout，但在 IE7(S) 中触发了 hasLayout。  
根据 CSS 2.1 8.3.1 Collapsing margins 第三条，生成BFC 的元素不会和在流中的子元素发生空白边折叠。

DIV1 和 DIV2 不应该发生空白边折叠，深灰色的 DIV1 应该撑满 Container 。

这段代码在不同的浏览器环境中表现如下：( 注意IE7(S) 此时触发了 hasLayout )

<table>
	<tr>
		<th>IE6 IE7(Q) IE8(Q)</th>
		<th>IE7(S) IE8(S) Firefox Chrome Safari Opera</th>
	</tr>
	<tr>
		<td><img src="/assets/images/hasLayout&BFC/06(1).png" /></td>
		<td><img src="/assets/images/hasLayout&BFC/05(1).png" /></td>
	</tr>
</table>

可见，在 IE 中，创建了 BFC，未触发 hasLayout 的元素，它自身与子元素间的空白边折叠还是会发生。

### hasLayout 和 BFC 的异同及可能产生的问题

**区别**

在 IE8(S) 之前的版本中，没有规范中提及的 block formatting context 和 Inline formatting context 概念，而是用 hasLayout 来达到相似的目的。  
在 IE 中可通过设置 ‘width’、’height’、’min-width’、’min-height’、’max-width’、’max-height’、 ‘zoom’、’writing-mode’ 来触发 hasLayout，而这些特性值的设置不能够使元素创建 BFC。  
在 IE 中很多元素默认就是拥有布局的，如 IPUNT, BUTTON, SELECT, TEXTAREA 等，但是这些元素在标准中会形成 Inline formatting context （本博客后面会介绍）。  

**共同点**

两者都是决定了对内容如何定位及大小计算的规则。  
两者都决定了与其他元素的相互作用的规则。  
‘table-cell’ 和 ‘table-caption’ 既是 hasLayout 的元素，又是可以创建 BFC 的元素。  
浮动元素，绝对定位元素，inline-block 元素以及除 ‘visible’ 外任意值的 overflow(IE7) 在 IE 中可以触发 hasLayout，同时在标准中，又可以创建BFC。  

**可能产生的兼容性问题:**
由于 hasLayout 和 BFC是对一类事物的不同理解，并且他们的启用条件不尽相同，因此如果一个元素设计时，在 IE 早期版本中触发了 hasLayout ，但在其他浏览器中又没有创建BFC，或者相反，一个元素在 IE 早期版本中没有触发 hasLayout ，在其他浏览器中却创建了 BFC（如设置了 ‘overflow:hidden’ ），将导致页面布局的重大差异。

### 解决方案

仅当一个元素即在 IE 早期版本中触发了 hasLayout，又在其他浏览器中创建了BFC时，才能避免上述问题的发生。即同时启用上述两者以保证各浏览器的兼容，或者相反，两者皆不启用。

1）使元素即生成了BFC，又触发了 hasLayout
对于触发 hasLayout 的元素，通过 CSS 设置，使它产生BFC；  
2）生成 BFC但是没有触发 hasLayout 的元素，通过设置 ‘zoom:1’，使其触发 hasLayout。
使元素即没有触发 hasLayout，又没有创建 BFC。