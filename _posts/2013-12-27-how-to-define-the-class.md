---
layout: post
title: "JavaScript如何定义类"
keywords: JavaScript Class Object
description: "javascript当中如何优雅的解决没有类的方案"
category: javascript
tags: [javascript, class]
---
{% include JB/setup %}

### 第一种 this and prototype

```
var Cat = function(){
    this.publicMethod1 = function(){
        alert("公有方法一");
    };
}
Cat .prototype.publicMethod2 = function(){
    alert("公有方法二");
};
var cat = new Cat ();
cat.publicMethod1(); //公有方法一
cat.publicMethod2(); //公有方法二
```

<!-- more -->

一般的实现方法，比较麻烦！！！

### 第二种 Object.create()

为了解决"构造函数法"的缺点，更方便地生成对象，Javascript的国际标准ECMAScript第五版（目前通行的是第三版），提出了一个新的方法Object.create()。

```
var Cat = {
    variable1: "成员属性1",
    method1:function(){
        alert("成员方法1");
    }
};
var cat = Object.create(Cat );
cat.method1(); //成员方法1
```

对于还没有实现Object.create()的浏览器，可以使用以下方法：

```
if(!Object.create){
    Object.create = function(o){
        function F(){}
        F.prototype = o;
        return new F();
    }    
}
var cat = Object.create(Cat);
cat.method1(); //成员方法
```

没有私有属性和方法，实例之间也没有数据共享

### 第三种 极简主义

```
var Obj = {
    publicVar: "公有属性",
    create: function(){
        var privateVar = "私有属性";
        var obj = {};
        obj.setPrivateVar = function(para){
            privateVar = para;
        };
        obj.getPrivateVar = function(){
            return privateVar;
        };
        obj.setPublicVar = function(para){
            Obj.publicVar = para;
        };
        obj.getPublicVar = function(){
            return Obj.publicVar;
        };
        return obj;
    }
};
var obj1 = Obj.create();
alert(obj1.getPrivateVar()); //私有属性
obj1.setPrivateVar("私有属性变了");
alert(obj1.getPrivateVar()); //私有属性变了
obj1.setPublicVar("公有属性变了");
var obj2 = Obj.create();
alert(obj2.getPrivateVar()); //私有属性
alert(obj2.getPublicVar()); //公有属性变了
var child = {
    create: function(){
        var c = new Obj.create(); //继承
        return c;
    }
};
```

perfect!!!!