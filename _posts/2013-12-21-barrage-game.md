---
layout: post
title: "弹幕游戏"
description: "还没写完，找时间写完，先凑合这样吧..."
category: html5
tags: [html5, javascript, canvas]
---
{% include JB/setup %}

<div id="barrage">

  <canvas id="myCanvas" width="500" height="500">
      你的浏览器不支持canvas，敢不敢换一个高级点的浏览器！！！
  </canvas>

  <section id="buttons">
          <h3>您已经坚持了：<span id="gametime">0 s</span></h3>
      <footer>
          <input type="button" class="button button-rounded button-flat-primary" value="开始" id="start" />
          <input type="button" class="button button-rounded button-flat-highlight" value="暂停" id="pause" />
          <input type="button" class="button button-rounded button-flat-caution" value="结束" id="end" />
          <input type="button" class="button button-rounded button-flat-royal" value="设置" id="cfg" />
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

</div>
<script src="{{ ASSET_PATH }}the-minimum/js/barrageGame.js" type="text/javascript"></script>