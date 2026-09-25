---
title: lodash
date: 2024年8月15日
updated: 2024年8月15日
tags:
  - 渗透
categories: 渗透
keywords:
description: loadsh
---


今天打网站的时候无意中发现awvs报了一个lodash的漏洞，所以来记录一下

现在前端大多数是vue和react框架的，所以就少不了引入依赖，而lodash是一个流行的npm库，
检测方法很简单，在前端控制器输入

```
const payload = '{"constructor": {"prototype": {"lodash": true}}}'
_.defaultsDeep({}, JSON.parse(payload))
if({}.lodash === true){ alert("Bad news :(\nYou're (still) vulnerable to Prototype Pollution") } else { alert("All Good! :)\nYou're NOT vulnerable (anymore) to Prototype Pollution") }

```

如果弹窗

![](https://pic.imgdb.cn/item/66e2a05ad9c307b7e9af7070.png)

说明没问题,lodash是最新的，如果没有的花说明存在漏洞

漏洞原理：

[这篇写得好](https://blog.csdn.net/qq_34761385/article/details/136799101)

(主要是我还没学完原型链...)