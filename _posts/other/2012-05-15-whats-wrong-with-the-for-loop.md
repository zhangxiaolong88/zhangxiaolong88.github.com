---
layout: post
title: for 循环 有什么问题？
description: 不久前，出版过数十本编程书籍的大作家发表了对Java中闭包的价值的质疑。尤其是他问道“for 循环为何可恨？”
keywords: for, 闭包
category : other
tags : [for, 闭包]
type: porter
---

Java 的闭包(Closure)特征最近成为了一个热门话题。
一些精英正在起草一份议案，要在 Java 将来的版本中加入闭包特征。
然而，提议中的闭包语法以及语言上的这种扩充受到了众多 Java 程序员的猛烈抨击。

不久前，出版过数十本编程书籍的大作家[Elliotte Rusty Harold(英文)](http://www.elharo.com/)发表了对 Java 中闭包的价值的质疑。
尤其是他问道“for 循环为何可恨？”：

> 我不知道，有些人这么着急的要把 for 循环消灭掉，他们反对的究竟是什么？
> 这已经不是第一次或第二次计算机学界的理论家们起来反对 for 循环(或类似的东西)了。

如果只说 Elliotte 质疑不起眼的闭包的价值，这是不公平的。
他主要抱怨是，在读了另一位著名人物、获得过 Jolt 大奖并创造过最高销售记录的《Better, Faster, Lighter Java》的
作者 Bruce Tate 的最近的关于此[主题(英文)](http://www-128.ibm.com/developerworks/java/library/j-cb01097.html)的专题后，
他看不出闭包在 Java 中有什么价值。

(Bruce 用 Ruby 做的例证)：

**表 1. 最简单的闭包**

    3.times {puts "Inside the times method."}

    结果：
    Inside the times method.
    Inside the times method.
    Inside the times method.
    
times 是 3 这个对象上的一个方法。
它把闭包中的代码执行了 3 次。`{puts "Inside the times method."}` 是闭包。
它是一个匿名函数，把它传入 times 方法，打印出静态句子。
相比起传统的 for 循环语句，这样的代码显得更紧凑，更简单，如表 2 中所示：

**表 2: 非闭包的循环**

    for i in 1..3
      puts "Inside the times method."
    end

由于这种毫无生气的对闭包的介绍，我也很难看出它的真正价值。
这首个比较，充其量也就能体现出一种微妙的差别。
Bruce 在 developerWorks 上的文章里的其它的例子也大多是价值不大的，要么含糊不清，要么缺乏启发意义。

对于这种 Ruby 风格的闭包给 Elliotte 带来的困惑，我不打算进一步评论；
对这种问题过于挑剔毫无意义。

我也不想讨论目前的关于 Java 中的闭包的语法的提议的争论，包括 Java 中是否应该有闭包这样的大问题。
在这样的争论中我没有立场，说实话，我是不在乎这些问题如何或何时被解决。

虽然如此，Elliotte 却提出了一个重要的问题：「for 循环为什么可恨？」

下面是一个常见的例子：

    double sum = 0;
    for (int i = 0; i < array.length; i++) {
      sum += array[i];
    }

这有什么问题？
我编了很多年的程序，我对这种语法一眼扫过去很舒服；很显然，它是把一个数组里的值加到一起。

但当去真正的阅读这段代码时，这四行代码里大概散布着 30 多个标记符号需要我去分析处理。
不错，有些字符可以通过语法简写方式来缩减。
但为了这样一个简单的加法，你需要写出一堆东西，还要保证写的正确。

凭什么这样说？下面是 Elliotte 的文章里另外一个例子，原文拷贝：

    String s = "";
    for (int i = 0; i < args.length; i++) {
      s += array[i];
    }

看见了里面的错误吗？
如果这代码编译通过，并通过的代码审查，你可能需要数周才会发现这样的 bug，再数周才能制作出补丁。
这些只是简单的 for 循环。

想象一下，当 for 循环体变得越来越大，甚至有嵌套时，事情会变得多么的复杂。
(如果你仍旧不担心这样的 bug，认为这只是拼写错误，那么你就想想有多少次在 for 循环里你是这样的。)

如果你能够把一个简单的 for 循环写成一行，带有更少的重复和更少的字符，这样不仅更容易阅读，也更容易书写。
因为这样更简洁，引入 bug 的机会就更少，当 bug 出现时，也更容易被发现。

那闭包对此有何帮助？下面是第一个例子，用 Haskell 语言写成的：

    total = sum array

哈哈，我是在说谎。sum 函数并没有使用闭包。
它是按照 fold 的方式定义的，而 fold 是接受闭包的：

    total = foldl (+) 0 array

下面是第二个例子，很常见，而且使用了闭包：

    s = concat array
    s = foldr (++) [] array

我承认，使用这些叫做 foldl 和 foldr 样子古怪的函数来解释闭包的作用，这对那些更熟悉 for 循环的程序员来说没有多大意义。
但是，这几个函数却能突出 for 循环的关键弊端：它把三种独立不同的操作合并到一起了——过滤，归纳和转换。

上面的这两种 for 循环，它们的目标是接收一个数值列表，把它们归纳成一个值。
函数式编程的程序员称这些操作为 “folds(合并)”。

一个 fold 运算的过程是，首先要有一个操作(一个闭包)和一个种子值，还有使用 list 里的第一个元素。
这个操作被施加到种子值和 list 里的第一个元素上，产生出一个新的种子值。
fold 运算然后把这个操作运用到新种子值和 list 里的下一个元素上，一直这样，直到最后一个值，最后一次操作的结果成为 fold 运算的结果。

下面是一个演示：

    s = foldl (+) 0       [1, 2, 3]
      = foldl (+) (0 + 1) [2, 3]
      = foldl (+) 1       [2, 3]
      = foldl (+) (1 + 2) [3]
      = foldl (+) 3       [3]
      = foldl (+) (3 + 3) []
      = foldl (+) 6       []
      = 6
  
Haskell 语言里提供了很多 fold 函数；
foldl 函数从 list 的第一位开始运算，依次反复到最后一个，而 foldr 函数，它从 list 的最后一个函数开始运算，从后往前。
还有很多其它相似的函数，但这两个是最基本的。

当然，folds 是一些非常基本的运算，如果抛弃 for 循环而以各种形式的 foldl 和 foldr 咒符来替换，你会很困惑。

事实上，更高级的操作，例如 sum, prod 和 concat 都是以各种 folds 定义的。
当你的代码以这种高级的归纳操作运算来编写时，代码会变得更简洁，更易读，更易写，更易懂。

当然，并不是所有的 for 循环都是归纳操作。看看下面这个：

    for (int i = 0; i < array.length; i++) {
      array[i] *= 2;
    }

这是一个转换操作，函数式编程的程序员称之为 map 操作：

    new_array = map (*2) array

map 函数的工作方式是，它会检查 list 里的每个元素，将一个函数应用到每个元素上，形成一个新的 list，里面是新的元素。
（有些语言里的这种操作是原位替换）。
这是一个很容易理解的操作。sort 函数的功能相似，它接受一个 list，返回(或修改)一个 list。

第三种类型的 for 循环是过滤。

下面是个例子。

    int tmp[] = new int[nums.length];
    int j = 0;
    for (int i = 0; i < nums.length; i++) {
      if ((nums[i] % 2) == 1) {
        tmp[j] = nums[i];
        j++;
      }
    }

这是一个非常简单的操作，但使用了 for 循环和两个独立的计数器后，毫无必要的复杂表现把事实真相完全掩盖了。
如果过滤是一种基本的操作，它应该像一个 fold 或一个 map 那样，而事实上，它是的：

    odds = filter (\i => (i `mod` 2) == 1) nums
    odds = filter isOdd nums -- 更常用的形式

从核心上讲，这就是为什么 for 循环有问题：它把(至少)三种独立的操作合并到了一起，
但重点却关注了一个次要细节问题：遍历一系列的值。

而事实上，fold，map 和 filter 是处理一个数据 list 的三种不同的操作，它们应该被分别处理。
采用把闭包传入循环内的方式，我们能更容易的把 what 从 how 中分离出来。
每次遍历一个 list 时我都会使用一个匿名函数，或复用通用的函数(例如 isOdd, (+) 或 sqrt)。

虽然闭包并不是一个很深奥的概念，但当它深深的烙进了一种语言和它的标准库中时，我们不需要使用这些低级的操作搞的代码混乱不堪。
相反，我们可以创建更高级的运算，做我们想要的事，比如 sum 和 prod。

更重要的，以这些概念思考问题会使我们更容易思考更复杂的操作，比如变换一个 tree，过滤一个 vector，或把一个 list 合并成一个 hash。

在最后，Elliotte 还提到了一些关于在多核处理器上并行执行的问题，说像 `3.times {...}` 这样的代码会比 for 循环效率“差”。

不幸的是，我想他没说到点上。不错，有一些运算需要序列化，有一些可以并行。
但是如果你只基于一个 for 循环，很难判断出哪些归为哪类，这是一个复杂的编译器优化问题。
如果你把一个可能进行并行运算的操作(例如 map 和 filter)分解成连续的运算(例如 foldl 和 foldr)，编译器更容易从中做出判断。

不仅如此，如果你比编译器更了解你的数据，你可以显式的要求一个 map 操作被顺序执行或并行执行。

本文英文原文链接：[What's Wrong with the For Loop](http://notes-on-haskell.blogspot.com/2007/02/whats-wrong-with-for-loop.html)