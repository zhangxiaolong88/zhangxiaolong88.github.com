---
layout: post
title: "移动端开发（一）"
keywords: JavaScript mobile development
description: "JavaScript mobile development"
category: javascript
tags: [mobile]
---
{% include JB/setup %}

移动端开发 名词、概念收集。

<!-- more --> 

**指标名词解释：** 

**1) 设备像素**

屏幕的像素数目，也叫分辨率。有时也叫`物理像素`。  

一般表示用屏幕的像素宽度 * 高度，比如1280 * 720。  

**2) 屏幕密度**

表示单位面积（通常是每英寸）内的像素个数。  

单位是`dpi`（dot per inch），每英寸多少点，或`ppi`（pixel per inch）每英寸多少像素数，针对显示器设计时，`dpi = ppi`。

移动电话 300ppi；  
手持平板类电器、显示器 260ppi；  
苹果移动电脑 210ppi；

**3) css像素**

也叫参照像素。  

用来精确度量web页面的内容，一般情况下，css像素被成为与设备无关的像素（device-independent），简称DIPS，有时也叫独立像素。

在一个标准密度的显示器上，一个css像素对应一个设备像素。

描述这个比值有个属性devicePixelRatio： 设备像素  / css像素。  

**4) 位图像素**

a. 当一个光栅图像在标准设备下全屏显示时，一位图像素对应的就是一个设备像素，这叫做完全保真。  
b. 位图图像质量是由单位长度内像素的多少来决定的，单位长度内像素越多，分辨率越高，图像质量越好。
c. 每一个位图像素被乘以四填补相同物理表面在视网膜屏幕下显示，以保证图像和非视网膜屏幕展示出相同的大小。

