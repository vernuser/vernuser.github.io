---
title: 小迪笔记day1--名词解释&文件下载&反弹shell&文件上传下载&防火墙绕过
date: 2024年7月30日
updated: 2024年7月30日
tags: 
  - 小迪安全
  - 渗透
categories: 小迪安全
keywords: 
description: 小迪安全
---

# 名词解释

poc：概念验证，常指的是一段漏洞证明的代码

（就是根据漏洞的一些信息，比如nuclei使用的yaml中，根据baseurl以及一些的raw http进行访问，再通过dsl,words，等进一步确认漏洞存在）

exp:漏洞利用脚本，不解释

paylaod：exp成功执行的时候，真正在目标系统执行的代码或指令

shellcode：指的是漏洞载荷，免杀经常提到

后门：通称，web网站叫webshell，但是其实还有系统等

木马：针对电脑的控制

病毒：破坏性的程序

反弹：弹shell，将权限转移到其他地方

跳板：中间的机器，A无法连接B，A可以通过连接B来达到连接C的

[参考](https://www.cnblogs.com/sunny11/p/13583083.html)


# 文件上传下载

linux：wget curl ruby perl java python等

windows:powershell certutil bitsadmin msiexec mshta rund1132等

[命令](https://blog.csdn.net/weixin_43303273/article/details/83029138)

[study 棱角社区](https://forum.ywhack.com/infosec.php)

需要注意的是下载的文件夹的权限
# 权限

root or user

提权

前面靶机基本上最后都是提权完成的，我记得以前看了个文章说有100多个提权手法？（忘记了）

# 防火墙

windows默认自带windows defender

linux默认是iptables

入站出站协议

传webshell需要交互式 的，（联想到python的哪个命令）

内外网区分
![](https://pic.imgdb.cn/item/66a8e27ed9c307b7e93458ad.png)

所以说靶机尽量不要搞在线靶机

比如你上fofa搜能找到同行的pikachu，，，还是一堆...

难崩
```fofa语句
"pikachu" && country="CN" && title="Get the pikachu"
```

别干坏事奥