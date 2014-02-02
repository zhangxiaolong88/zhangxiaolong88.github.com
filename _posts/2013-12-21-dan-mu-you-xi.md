---
layout: post
title: "弹幕游戏"
description: "还没写完，找时间写完，先凑合这样吧..."
category: html5
tags: [html5, javascript, canvas]
---
{% include JB/setup %}

<style>
  #myCanvas {
    border: 1px solid #cccccc;
  }
  #configDiv{
    position: absolute;
    border: 1px solid #000000;
    background: #cccccc;
    text-align: left;
    display: none;
  }
  #buttons {
    margin: 0 auto;
    text-align: left;
  }
  #ownBody {
    clear: both;
  }
  .item {
    margin:10px 20px 10px 0px;
    float:left;
    display:inline;
  }
  #ownSpeed{
    width:30px;
    text-align: right;
  }
  #actionBtn {
    clear: both;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }
</style>

<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js" type="text/javascript"></script>
<script src="" type="text/javascript">
 
</script>

<canvas id="myCanvas" width="500" height="500">
    你的浏览器不支持canvas，敢不敢换一个高级点的浏览器！！！
</canvas>

<section id="buttons">
    <header>
        <h1>您已经坚持了：<span id="gametime">0 s</span></h1>
    </header>
    <footer>
        <input type="button" value="开始" id="start" />
        <input type="button" value="暂停" id="pause" />
        <input type="button" value="结束" id="end" />
        <input type="button" value="设置" id="cfg" />
    </footer>
</section>

<div id="configDiv">
    <section id="config">
        <header>
            <h1>游戏设置：</h1>
        </header>
        <div id="ownBody">
            <div class="item">
                <span id="ownSpeedText">①速度</span>
                <input type="text" id="ownSpeed" value="5" />
                <span id="ownSpeedDescription">（0-9档）</span>
            </div>
            <div class="item">
                <span id="ownColorText">②颜色</span>
                <select id="ownColor">
                    <option value="red">红色</option>
                    <option value="blue">蓝色</option>
                    <option value="green">绿色</option>
                </select>
            </div>
        </div>
        <footer id="actionBtn">
            <input type="button" value="确定" id="confirm" />
            <input type="button" value="重置" id="reset" />
            <input type="button" value="取消" id="cancel" />
        </footer>
    </section>
</div>
    