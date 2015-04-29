---
layout: post
title: XSS 之 剑与盾
keywords: javascript, XSS
category : XSS
tags : [javascript, XSS]
---

本文的重心并不是讲解XSS的基本原理，也不是讲解攻击流程，旨在整理 XSS 攻防战的历史长河中 出现过哪些经典的 `剑` 与 `盾`。

本文的讲解顺序，以进攻招式的介绍为主线，每个介绍的最后会出现与之对应的防御招式。

本文预计将会是一个持续更新的工作。

###1. cookie劫持

任何XSS成功后，最后都可以使出cookie劫持这一招，不过，如果如果防住了这将能非常有效的降低敌人的伤害。

cookie劫持，其心法的关键在于获取cookie，发送到攻击者的服务器，攻击者获取cookie后模拟用户登录，直接对用户进行致命打击。

常见招式就是修改页面中的链接，将链接指向攻击者的服务器，当用户点击该链接时，链接地址中带走用户的cookie信息，如果用户不点击链接呢，还有一个更通用的办法，直接加载一个远程脚本，在远程脚本中发送cookie。

防御招式：

**1） HttpOnly**

当服务端给cookie设置了HttpOnly属性后，脚本无法读取本地cookie，这样就直接堵死了其进攻的线路。

然而，就算如此也不能大意，有些用户浏览器安装了第三方插件还是能获取cookie。

**2） Content-Security-Policy**

该属性是一个http响应头，该响应头是防止XSS最有效的解决办法之一。

它是一种允许我们定义从URLS或内容中加载和执行对象的策略，通常也叫` 内容安全策略（CSP） `，CSP将在浏览器上强制执行策略，该策略指定浏览器应该加载哪些资源，浏览器从哪里加载资源。

策略通过指令进行资源定义，指定资源加载行为，指令如下：

<table class="table table-bordered">
<thead>
	<tr>
		<th width="20%">指令</th>
		<th>描述</th>
	</tr>
</thead>
<tbody>
	<tr>
		<td>default-src</td>
		<td>该指令在某种资源类型指定指令没有定义的情况下，指定了所有资源类型的加载策略。</td>
	</tr>
	<tr>
		<td>script-src</td>
		<td>该指令指定了web应用程序可以加载的脚本的域或URL。</td>
	</tr>
	<tr>
		<td>object-src</td>
		<td>该指令指定了web应用程序可以加载的插件，如flash。</td>
	</tr>
	<tr>
		<td>style-src</td>
		<td>... ...可以加载的css样式表的域或URL。</td>
	</tr>
	<tr>
		<td>img-src</td>
		<td>... ...可以加载的图片的域或URL。</td>
	</tr>
	<tr>
		<td>media-src</td>
		<td>... ...可以加载的音视频的域或URL。</td>
	</tr>
	<tr>
		<td>frame-src</td>
		<td>... ...可以加载的框架的域或URL。</td>
	</tr>
	<tr>
		<td>font-src</td>
		<td>... ...可以加载的字体的域或URL。</td>
	</tr>
	<tr>
		<td>connect-src</td>
		<td>... ...可以加载的像XHR、WebSocket以及EventSource等脚本接口。</td>
	</tr>
	<tr>
		<td>plugin-types</td>
		<td>... ...可以加载的MIME类型的插件。</td>
	</tr>
	<tr>
		<td>form-action</td>
		<td>该指令指定了HTML表单可以提交的URLS。</td>
	</tr>
	<tr>
		<td>connect-src</td>
		<td>该指令告诉浏览器开启或关闭任何用于过滤或者阻止反射跨站脚本攻击的启发式算法（相当于 X-XSS-Protection: 1; mode = block; 响应头的效果）。</td>
	</tr>
</tbody>
</table>

四种源表达式：

<table class="table table-bordered">
<thead>
	<tr>
		<th width="20%">源表达式</th>
		<th>描述</th>
	</tr>
</thead>
<tbody>
	<tr>
		<td>none</td>
		<td>什么也不匹配。</td>
	</tr>
	<tr>
		<td>self</td>
		<td>仅从当前域匹配，不包含子域。</td>
	</tr>
	<tr>
		<td>unsafe-inline</td>
		<td>允许内联JavaScript和CSS。你不应该使用这个，除非你确认一个没有清洁过的用户输入数据不会返回到内联。</td>
	</tr>
	<tr>
		<td>unsafe-eval</td>
		<td>允许使用JavaScript的eval()方法。你不应该使用这个，除非你确定一个没有清洁或危险的用户输入不会插入函数eval()。</td>
	</tr>
</tbody>
</table>

一个典型的现代Web应用程序的正常运行需要 unsafe-inline、unsafe-eval源表达式和 script-src 指令。  
 
一个CSP报头(如，Content-Security-Policy: default-src 'self') 不能适用于大多数现代Web应用程序。

这 (default-src 'self') 策略意味着字体，框架，图片，多媒体，对象、脚本以及风格都将从同一个域或源加载，连接将在同源进行。 然而，这对于大多数现代Web应用程序是不可行的，因为例如Web应用程序可能使用谷歌字体，在一个框架中显示幻灯片分享文档，或者包括加载Jquery库或在页面嵌入Twtter或Facebook的插件脚本。所以开发人员倾向于不使用CSP，认为这是一种复杂的方式或者用了错误的方式来实现CSP。    

我们总是覆盖default-src指令，有效地将其用于实时CSP。这与我们的需要相适合，但也容易发生XSS攻击。

**一个CSP例子**
    
	Content-Security-Policy: default-src 'self'; style-src 'unsafe-inline' 'self' http://fonts.googleapis.com http://themes.googleusercontent.com; frame-src http://www.slideshare.net www.youtube.com twitter.com; object-src 'none'; font-src 'self' data: http://themes.googleusercontent.com http://fonts.googleapis.com; script-src 'unsafeeval' 'unsafe-inline' 'self' http://www.google.com twitter.com http://themes.googleusercontent.com; img-src 'self' http://www.google.com data: https://pbs.twimg.com http://img.youtube.com twitter.com 


**分析：**

<table class="table table-bordered">
<thead>
	<tr>
		<th width="20%">策略</th>
		<th>描述</th>
	</tr>
</thead>
<tbody>
	<tr>
		<td>default-src 'self';</td>
		<td>允许字体、框架、图片、媒体、对象、脚本以及风格只从相同的域加载。</td>
	</tr>
	<tr>
		<td>'unsafe-inline' 'self' http://fonts.googleapis.com  http://themes.googleusercontent.com;</td>
		<td>允许使用来自同一个域的内联样式或样式表，以及 http://fonts.googleapis.com and http://themes.googleusercontent. com。</td>
	</tr>
	<tr>
		<td>frame-src</td>
		<td>youtube.com twitter.com; 允许Web应用程序只从 youtube.com 和twitter.com加载框架。</td>
	</tr>
	<tr>
		<td>object-src 'none';</td>
		<td>允许空对象。</td>
	</tr>
	<tr>
		<td>font-src 'self' data:   http://themes.googleusercontent.com</td>
		<td>允许Web应用程序从同一个域和http://themes.googleusercontent. com 加载字体。</td>
	</tr>
	<tr>
		<td>script-src 'unsafe-eval' 'unsafe-inline'  'self' http://www.google.com twitter.com  http://themes.googleusercontent.com;</td>
		<td>允许Web应用程序从同一个域、http://www.google.com, twitter.com和 http://themes.googleusercontent. Com加载脚本。'unsafe-inline' 源表达式允许执行内嵌的JavaScript， 'unsafe-eval' 源表达式允许使用JavaScript中的eval()函数 （危险）。 </td>
	</tr>
	<tr>
		<td>img-src 'self' data:  http://www.google.com https://pbs.twimg.com  http://img.youtube.com twitter.com</td>
		<td> 允许Web应用程序从同一个域、data URI、 http://www.google.com、https://pbs.twimg.com、 http://img.youtube.com和 twitter.com加载图像。 </td>
	</tr>
</tbody>
</table>

CSP能防御跨站脚本的注入，也能阻止内联脚本的执行，非常灵活也非常复杂，这一切取决于你如何使用。
                     

// 未完待续



