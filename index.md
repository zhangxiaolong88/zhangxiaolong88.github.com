---
layout: index
title: 张 小龙的博客
tagline: 一个程序员的自我修养
---
{% include JB/setup %}

<a href="/html5/2013/12/21/barrage-game">先来娱乐一下？</a>

## 文章列表

<ul class="posts">
  {% for post in site.posts %}
    <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>