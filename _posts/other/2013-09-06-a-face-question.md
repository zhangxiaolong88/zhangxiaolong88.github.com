---
layout: post
title: 一道面试题
categories: [other]
tags: [趣题]
---

题目大致如下：

###假设某国的货币有若干面值，现给一张大面值的货币要兑换成零钱，问有多少种兑换方式。

这个问题经常被各大公司作为一道面试题，不知难倒了多少同学。

下面给出该问题的递归解法：

```javascript
function countChange(money, coins){

    if(money == 0){
        return 1;
    } else if(money < 0 || coins.length == 0){
        return 0;
    }

    var newMoney = money - coins[0];
    var newCoins = [];
    for(var i=0;i<coins.length;i++){
        if(i!=0){
            newCoins.push(coins[i]);
        }
    }

    return countChange(money, newCoins) + countChange(newMoney, coins);
}

console.log(moneyChangeMehotds(100,[1,5])); // 21
```

####思路：

首先确定边界条件，如果要兑换的钱数为 0，那么返回 1，即只有一种兑换方法。

这里要注意的是该问题计算所有的兑换方法，兑换的钱数为0表示这次换零钱的行为结束，即这个方案结束，所以返回 1。

如果零钱种类为 0 或钱数小于 0，没有表示这个方案不成立，所以返回 0。

我们可以把找零的方法分为两类：使用不包含第一枚硬币（零钱）所有的零钱进行找零，使用包含第一枚硬币（零钱）的所有零钱进行找零，两者之和即为所有的找零方式。

第一种找零方式总共有 countChange(money, newCoins)种；  
第二种找零方式等价为对于 money – conins[0]进行同样的兑换，则这种兑换方式有 countChange(money – conins[0], coins)种；  
两者之和即为所有的零钱兑换方式。