---
title: 小迪笔记day2--web应用&架构搭建&漏洞&http数据报&代理服务器
date: 2024年7月30日
updated: 2024年7月30日
tags:
  - 小迪安全
  - 渗透
categories: 小迪安全
keywords:
description: 小迪安全

---

# 网站搭建前置

域名，子域名，DNS，HTTP/HTTPS，SSL证书

域名：网站的名字，例如www.baidu.com

DNS：解析域名的

# web应用架构
开发语言:asp,php,aspx,jsp,java,python,ruby,go,html,js

程序源码：开源cms分类，开发语言分类，应用类型分类，开发框架分类

中间件容器：IIS,APACHE,NGINX,TOMENT,WEBLOGIC,JBOOS,GLASSHFISH

第三方软件：phpmyadmin,vs-ftpd,vnc,openssh

数据库类型：access,mysql,mssql,oracle,db2,sybase,redis,mongdb

# web安全漏洞
sql注入，xxe/xml，弱口令，文件安全，rce，csrf/ssrf/crlf，反序列化，逻辑越权，未授权访问等等

# web请求返回过程数据包

https://www.jianshu.com/p/558455228c43

https://www.cnblogs.com/cherrycui/p/10815465.html

[http状态码](https://www.runoob.com/http/http-status-codes.html)

可以用bp简单客串一下扫描器，具体就是用爆破的方法，如果404就没有，403就存在

如果被拉黑了你的ip,上代理池/ww或者你去换一个


