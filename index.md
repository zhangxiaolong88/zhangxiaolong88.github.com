---
layout: index
title: 张 小龙的博客
tagline: 爱生活，爱前端
---
{% include JB/setup %}

<a href="/html5/2013/12/21/barrage-game">先来娱乐一下？</a>

<ul class="posts">
  {% for post in site.posts %}
	<article>
		<header>
			<h5 class="entry-title headline"><a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a> &raquo; <span>{{ post.date | date_to_string }}</span></h5> 
		</header>
		{% if post.content contains "<!-- more -->" %}
		  {{ post.content | split:'<!-- more -->' |first }}
		{% else %}
		  {{ post.content }}
		{% endif %} 

		  <div class="status">
			{% if post.content contains "<!-- more -->" %}
			<a class="btn btn-default btn-sm pull-left" href="{{ BASE_PATH }}{{ post.url }}"><span class="readmore">more &raquo; </span></a>
			{% endif %}
			<div class="clearfix"></div>
		  </div>
	</article>
	<hr/>
  {% endfor %}
</ul>