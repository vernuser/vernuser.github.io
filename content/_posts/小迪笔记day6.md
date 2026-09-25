---
title: 小迪笔记day67891011--信息打点
date: 2024年8月2日
updated: 2024年8月2日
tags: 
  - 小迪安全
  - 渗透
categories: 小迪安全
keywords: 
description: 小迪安全

---

# 信息点：
基础信息，系统信息，应用信息，防护信息，人员信息，其他信息等

# 技术点：
CMS 识别，端口扫描，CDN 绕过，源码获取，子域名查询，WAF 识别，负载均衡识别等

# 资产收集


## ttl判断操作系统

linux的数是64或255

windows nt/2000/xp 是128

windows98 是32

unix是255

ping一下看距离哪一个更近就可以判断是那个（）

也可以直接上nmap等端口扫描开干

## 数据库判断

组合 or 端口扫描

mysql 3306

mssql 1433

redis 6379

Oracle 1521

DB2 5000

postgresql 5432

## 源码

互站  网上搜  fofa搜

（例：不知道还存不存在 面具约会）

### 源码泄露

composer.json(类似版权和声明的文件，一种php特性)

git 源码泄露

svn 源码泄露

hg 源码泄漏

网站备份压缩文件

WEB-INF/web.xml 泄露   [RoarCTF 2019]Easy Java

DS_Store 文件泄露

SWP 文件泄露

CVS 泄露

Bzr 泄露

GitHub 源码泄漏
```
GITHUB 资源搜索：
in:name test               #仓库标题搜索含有关键字
in:descripton test         #仓库描述搜索含有关键字
in:readme test             #Readme 文件搜素含有关键字
stars:>3000 test
#stars 数量大于 3000 的搜索关键字
stars:1000..3000 test      #stars 数量 大 于 1000 小于 3000 的搜 索 关 键 字 forks:>1000 test
#forks 数量大于 1000 的搜索关键字
forks:1000..3000 test      #forks 数量 大 于 1000 小于 3000 的搜 索 关 键 字 size:>=5000 test
#指定仓库大于 5000k(5M)的搜索关键字 pushed:>2019-02-12 test    #发布时间大于 2019-02-12 的
搜索 关 键 字 created:>2019-02-12 test   # 创建 时 间 大 于 2019-02-12 的搜 索 关 键 字 user:test
#用户名搜素
license:apache-2.0 test    #明确仓库的 LICENSE 搜索关键字 language:java test         #在 java 语
言的代码中搜索关键字
user:test in:name test     #组合搜索,用户名 test 的标题含有 test 的
关键字配合谷歌搜索：
site:Github.com smtp
site:Github.com smtp @qq.com
site:Github.com smtp @126.com
site:Github.com smtp @163.com
site:Github.com smtp @sina.com.cn
site:Github.com smtp password
site:Github.com String password smtp
```



## 域名

可以看域名是否已经被注册，买域名

## 备案

 beianx

## 操作系统


## cdn
超级ping一下就可以

https://ping.chinaz.com/

https://www.17ce.com/

https://tools.ipip.net/ping.php

### cdn绕过
一把梭
[git-site-ip](https://get-site-ip.com/)

#### 子域名入手

#### 利用网站漏洞

#### 历史DNS记录

#### cdn本身
获取控制面板，这个纯粹靠运气

#### mx记录和邮件

找回的地方发送邮件到你的邮箱，在qq邮箱中查看邮件原文就可以了
![](https://pic.imgdb.cn/item/66b0880ad9c307b7e93f5424.png)

配合备案配合ip查询配合网站能得到真实ip

#### 国外请求：
可能仅针对国内进行了cdn加速，绕到国外就可以尝试了

https://tools.ipip.net/cdn.php

（阿里云CDN有个业务类型是
![](https://pic.imgdb.cn/item/66b0814bd9c307b7e935c9ac.png)

超级ping:https://ping.chinaz.com/

17ce.com

#### 超级ping

####  扫描探针

# ### zmap
44分大法（）

#### 黑暗引擎
zoomeye,fofa,shadon



## 服务器负载均衡

lbd--kali也有

### app
app的抓包封包监听等等的我跳了，目前用不上，后面用上了再加