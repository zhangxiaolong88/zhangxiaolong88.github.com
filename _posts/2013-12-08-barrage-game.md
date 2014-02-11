---
layout: game
title: "弹幕游戏"
description: "还没写完，找时间写完，先凑合这样吧..."
category: html5
tags: [html5, javascript, canvas]
---
{% include JB/setup %}

<!-- more -->

<div id="barrage">

  <canvas id="myCanvas" width="500" height="500">
  </canvas>

  <div id="buttons">
      <h4>您已经坚持了：<span id="gametime">0 s</span></h4>
      <footer>
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

