---
layout: game
title: "弹幕游戏"
keywords: canvas game JavaScript html5 css3
description: "还没写完，找时间写完，先凑合这样吧..."
category: html5
tags: [html5, javascript, canvas]
---
{% include JB/setup %}

<!-- more -->

<div id="barrage">

  <canvas id="myCanvas" width="500" height="500">
      你使用的浏览器不能支持<b>canvas以及相关功能</b>，使用落后的浏览器可能因为没有技术支持而导致存在安全隐患。
      为了更好地用户体验和财产安全，请你考虑更换下列这些浏览器的最新版本，比如<b>Chrome</b>，<b>Safari</b>或者<b>Firefox</b>！
  </canvas>

  <div id="buttons">
      <h4>您已经坚持了：<span id="gametime">0 s</span></h4>
      <footer>
          <a href="#" class="button button-rounded button-flat-primary" id="start" name="start">&nbsp;&nbsp;开始</a>
          <a href="#" class="button button-rounded button-flat-caution" id="end">&nbsp;&nbsp;结束</a>
          <a href="#" class="button button-rounded button-flat-royal" id="cfg">&nbsp;&nbsp;设置</a>
      </footer>
  </div>

  <div id="configDiv" class="button-rounded button-flat-royal">
      <section id="config">
          <header>
              <h5>游戏设置：</h5>
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
              <input type="button" class="button button-rounded" value="确定" id="confirm" />
              <input type="button" class="button button-rounded" value="重置" id="reset" />
              <input type="button" class="button button-rounded" value="取消" id="cancel" />
          </footer>
      </section>
  </div>

</div>

