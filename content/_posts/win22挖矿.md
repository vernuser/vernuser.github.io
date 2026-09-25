---
title: win挖矿
date: 2026年2月2日
updated: 2026年2月2日
tags:
  - 应急响应
categories: 应急响应
keywords:
description: win22挖矿
---

->需要你先配置好环境，要么自己搭建要么用已有的

进来之后是有个弹窗（~~我嫌弃碍事后面关了没截到图~~)

查看任务管理器里面有一个xmrig.exe，搜索发现是一个挖矿

### 攻击时间&ip
未看到服务器部署web服务，优先判断攻击者通过RDP、SMB等方式入侵，eventvwr.msc查看事件管理器，在里面找到登陆失败的

[![pZIp0hV.png](https://s41.ax1x.com/2026/02/04/pZIp0hV.png)](https://imgchr.com/i/pZIp0hV)

如图可以看到

### 攻击端口
知道是rdp方式入侵的话就能知道是rdp的3389了

### 入侵软件的md5

之前在任务管理器看到了xxmrig.exe，定位到文件夹然后直接

```certutil -hashfile xmrig.exe```

就行，md5是A79D49F425F95E70DDF0C68C18ABC564

### 入侵的后门md5

msinfo32查看系统信息，在软件环境的启动程序种看到可以的systems，会执行
C:\Users\Administrator\AppData\systems.bat脚本

打开对应文件发现是恶意脚本

[![pZIpXNt.png](https://s41.ax1x.com/2026/02/04/pZIpXNt.png)](https://imgchr.com/i/pZIpXNt)

然后和上面一样就行

### 矿池地址和钱包地址
之前xmrig的地方有他说的config，大大方方翻


### 攻击者怎么进入的
第一题我们就知道是rdp爆破，所以直接写暴力破解或者密码喷洒都行（其实如果爆破也行，但是知攻善防的解题系统里面只有暴力破解和密码喷洒两个，所以you know）

**附xmrig罗门币**

https://www.4399btc.com/article/20250806385860.html

