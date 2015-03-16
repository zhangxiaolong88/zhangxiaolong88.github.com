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
	<li><img src="/assets/images/javascript-effect/IMG_0161.JPG" width="150" height="280" /></li>
	<li><img src="/assets/images/javascript-effect/IMG_0201.JPG" width="150" height="280" /></li>
	<li><img src="/assets/images/javascript-effect/IMG_0263.JPG" width="150" height="280" /></li>
	<li><img src="/assets/images/javascript-effect/IMG_0272.JPG" width="150" height="280" /></li>
	<li><img src="/assets/images/javascript-effect/IMG_0314.JPG" width="150" height="280" /></li>
	<li><img src="/assets/images/javascript-effect/IMG_0190.JPG" width="150" height="280" /></li>
</ul>


	$("img").border({
		speed: "slow",
		color: "pink",
		width: 5
	});

