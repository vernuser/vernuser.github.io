---
title: 小迪笔记day18-WEB攻防
date: 2024年8月7日
updated: 2024年8月7日
tags:
  - 小迪安全
  - 渗透
categories: 小迪安全
keywords:
description: 小迪安全

---


废了几天事，终于是把信息打点结束了，总的来说就是CDN的绕过，信息收集工具的使用，资产泄露，通过域名等方式获得真是IP地址，端口扫描，泄露的源码进行白盒分析以及黑引擎的使用等等

arl还不开源了，Kunyu的seebug我是半天没瞅到api在哪啊，哪个水泽，python的arl_revelor的是22年的吧，根本用不了，头大了都

总之，一言难尽


迪总下面的PHP开发我给跳过了，直接开始WEB攻防得了，博客的话，，额，你现在看的就是，至于上传什么的太麻烦了等我后面有时间再说吧(bushi)

-----以上来自一个配置环境快炸了的人


# asp

一般都是windows iis asp access(sqlserver)

漏洞主要集中在iis 和 asp

