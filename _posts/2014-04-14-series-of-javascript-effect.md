---
layout: effect
title: "JavaScript特效: 图片边框加载"
keywords: JavaScript effect
description: "I wish I would update this series everyweek."
category: javascript
tags: [javascript, effect]
---
{% include JB/setup %}

<!-- more -->

<ul class="border">
	<li><img src="/assets/images/javascript-effect/IMG_1087.JPG" width="150" height="280" /></li>
	<li><img src="/assets/images/javascript-effect/IMG_0120.PNG" width="150" height="280" /></li>
	<li><img src="/assets/images/javascript-effect/IMG_1088.JPG" width="150" height="280" /></li>
	<li><img src="/assets/images/javascript-effect/IMG_1086.JPG" width="150" height="280" /></li>
	<li><img src="/assets/images/javascript-effect/IMG_1085.JPG" width="150" height="280" /></li>
	<li><img src="/assets/images/javascript-effect/IMG_1091.JPG" width="150" height="280" /></li>
	<li><img src="/assets/images/javascript-effect/IMG_0142.JPG" width="150" height="280" /></li>
	<li><img src="/assets/images/javascript-effect/IMG_1084.JPG" width="150" height="280" /></li>
</ul>

```css
$("img").border({
	speed: "slow",
	color: "pink",
	width: 10
});
```
