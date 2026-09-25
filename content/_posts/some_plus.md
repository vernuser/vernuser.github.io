---
title: 入侵检测
date: 2026年1月20日
tags:
  - 入侵检测
categories: 入侵检测
keywords:
description: 入侵检测
---
# 1.入侵排查

## 1.1 windows 入侵排查
常见应急相应事件：
web入侵： 网页挂马，主页篡改，webshell
系统入侵： 病毒木马，勒索软件，远控后门
网络攻击： ddos，dns劫持，arp欺骗

### 1.1.1 检查系统账号安全
1. 查看服务器是否存在弱口令，远程管理端口是否对公网开放
检查方法：咨询服务器管理员
2. 查看服务器是否存在可以账号，新增账号
检查方法： cmd窗口，输入`lusrmrg.msc`（本地用户和组，win11家庭版没有这个），查看是否有新增/可疑账号，如有管理员群组的新增禁用或者删除

需要注意的是，再本地用户群组里面，用户结尾带有$符号的，你再命令行输入net user里面是看不到的，这是隐藏账号，当然你也可以直接在命令框添加隐藏账号`net user add test$`即可

或者使用D盾，直接克隆账号检测

防止万一暴力破解的话，可以用`eventvwr.msc`事件查看器，windows日志-安全
或者使用windows的log parser也可以，微软官方提供，使用sql语句，比如选取前面100就是`select top 100 * from security.evtx`（需要事先将日志文件保存为evtx文件）

### 1.1.2 检查异常端口，进程
1. 检查端口连接情况，是否有远程连接可疑连接
- 试用netstat -ano查看当前网络连接，定义可以established
`established`是建立连接的意思，表示两台机器正在通信
- 试用netstat定位出的pid编号，再用tasklist命令进程定位`tasklist | findstr "PID"`
2. 进程
根据进程名称查看是否有可疑进程
`tasklist /svc`
3. `msinfo32`通过这个也可以查看是否有可疑进程
4. D盾
5. 查看可以的进程以及紫禁城
- 没有签名验证信息的进程
- 没有描述信息的进程
- 进程路径是否合法
- cpu或者内存资源占用是否过高
- 进程的属主

`查看windows服务所对应的端口%systemroot%/system32/drivers/etc/services`

### 1.1.3 检查启动项，计划任务，服务

1. 是否有异常启动项

a. 【开始】-> 【启动】


b. `msconfig`
判断不一样的话打开注册表`regedit`找到
```
HREY_CURRENT_USER\SOftware\microsoft\windows\currentversion\run
```
另一个再
```
HREY_local_machine\software\microsoft\windows\currentversion\run
```

c.本地组策略编辑器中的windows启动的脚本设置

win+r `gpedit.msc`

## 1.2 linux入侵排查
###  1.2.1 账号安全
用户信息文件`/etc/passwd`
root:x:0:0:root:root:/bin/bash
用户名：密码：用户id：组id：用户说明：家目录：登陆之后的shell

影子文件`/etc/shadow`
root:加密密码:密码最后一次修改时间：两次密码的修改时间间隔：密码有效期：密码修改时间到期的警告天数：密码过期之后的宽限天数：账号失效时间：保留

who 查看当前登录用户（tty本地登录 pts远程登陆）

w查看系统信息，想知道某一时刻用户行为

uptime查看登陆多久，多久用户，负载状态

查询特权用户
`awk -F: '$3==0 {print $1}' /etc/passwd`

查询可以远程登陆的账号信息
`awk '/\$1 | \$6/{print $1}' /etc/shadow`

查询sudo权限账号
`more /etc/sudoers | grep -v "^#\|^$" | grep "ALL=(ALL)"`

禁用或删除多余或可疑账号

usermod -L  user禁用账号，账号无法登陆

userdel user 删除user账号

userdel -r user 将删除user用户并且将/home 目录下的user目录一并删除


### 1.2.2 历史命令
通过.bash_history文件查看账号执行过的系统命令
- root 用户`history`
- 打开/home下的`.bash_history`，查看普通账号执行的历史命令

   - 保存1w条命令
`sed -i 's/^HISTSTIZE=1000/HISTSITZE=10000/g' /etc/profile `
   - 或者再etc/profile底部加上如下代码，再source /etc/profile让配置生效
```# 獲取登錄用戶的 IP 地址
USER_IP=`who -u am i 2>/dev/null | awk '{print $NF}' | sed -e 's/[()]//g'`
if [ -z $USER_IP ]; then
USER_IP=`hostname`
fi

# 設置 history 的顯示格式，包括日期、時間、IP 和用戶名
HISTTIMEFORMAT="%F %T $USER_IP:`whoami` "
export HISTTIMEFORMAT
```
清除历史操作命令
history -c

入侵排查：
```
进入用户目录下，到处历史命令
cat .bash_history >> history.txt
```

### 1.2.3 检查异常端口
netstat命令
`netstat -antlp | more`

查看pid对应的进程文件路径
```
ls -l /proc/$pid/exe或file /proc/$pid/exe
```

### 1.2.4 检查异常进程
```
ps aux | grep pid
```

### 1.2.5 检查开机启动项
基本使用：系统运行级别示意图
```
0 关机
1 单用户模式，可以认为windows安全模式，用于系统修复
2 不完全命令行模式，不包含nfs
3 完全命令行模式，标准字符界面
4 系统保留
5 图形模式
6 reboot
```
查看运行级别命令`runlevel`
系统默认允许级别
```
vi /etc/inittab
```
开机启动配置文件
```
/etc/rc.local
/etc/rc[0~6].d
```
当我们需要开自己自动自己的脚本时，只需要将可执行脚本丢在`/etc/init.d`目录下，然后再`/etc/rc.d/rc*.d`文件中建立软连接即可
```
ln -s /etc/init.d/sshd /etc/rc.d/rc3.d/s100ssh
```
其中的sshd是脚本文件,s100ssh是软连接,s开头代表加载时自启动，k开头则是加载时需要关闭

### 1.2.6 检查定时任务
1. 通过crontab创建计划任务
```
crontab -l 列出某个用户cron服务的详细内容
crontab -r 删除每个用户的cront任务
crontab -e 使用编辑器编辑当前crontab文件
```
2. anacron实现异步定时任务调度
```
每天运行/home/backup.sh脚本
vi /etc/anacrontab
@daily 10 example.daily /bin/bash  /home/backup.sh
当机器在backup.sh期望被运行时是关闭的，anacron会在机器开机十分钟后打开它，而不用等待7天
```
重点关注一下目录
```
/var/spool/cron/*
/etc/crontab
/etc/cron.d/*
/etc/cron.daily/*
/etc/cron.hourly/*
/etc/cron.monthly/*
/etc/cron.weekly/
/etc/anacrontab
/var/spool/anacron/*
```
小巧思：
```
more /etc/cron.daily/*   查看目录下所有文件
```
### 1.2.7 检查服务
1. 服务自启动
```
# sudo apt-get install sysv-rc-conf
chkconfig  [--level 运行级别] [地理服务名] [on|off]
chkconfig -level 2345 httpd on 开启自启动
chkconfig httpd on 默认level是2345
```


### 1.2.8 检查异常文件
1. 查看敏感目录，比如/tmp目录下的文件，同时注意`..`开头的隐藏目录
2. 发现webshell，远控木马的创建时间怎么找出同一时间范围内创建的文件
```
find /opt -iname "*" -atime 1 -type f 找到/opt下一天前访问过的文件
```
3. 针对可疑文件可以stat获取修改时间


### 1.2.9 检查系统日志
日志存放地址`/var/log`
日志默认配置情况` more /etc/rsyslog.conf`
[![pZgm80A.png](https://s41.ax1x.com/2026/01/23/pZgm80A.png)](https://imgchr.com/i/pZgm80A)

小巧思
```
grep "Faileed password for root" /var/log/secure | awk '{print $11}' | sort | uniq -c | sort -nr | more
从安全日志中抓取root登录失败的，awk提取11字段也就是ip的，uniq统计次数,sort排序，n按数值r反向


grep "Failed password" /var/log/secure |
grep -oE "(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)" | \
uniq -c
定位有那些ip再爆破

grep "Failed password" /var/log/secure|perl -e 'while($_=<>){/for(.*?) from/; print "$1\n";}'|uniq -c|sort -nr
从日志中提取暴力破解（爆破）尝试中使用的用户名，并统计每个用户名尝试失败的次数，按次数降序排列
while($_=<>) {...}  # 循环读取标准输入（来自前一个命令的输出）
(.*?)非贪婪匹配

grep "Accepted" /var/log/secure | awk '{print $11}' | sort | uniq -c | sort -nr | more
登录成功的IP有哪些

grep "Accepted" /var/log/secure | awk '{print $1,$2,$3,$9,$11}'
登录成功的日期、用户名、IP

grep "useradd" /var/log/secure 增加一个用户kali日志

grep "userdel" /var/log/secure 删除一个用户kali日志
```

### 1.2.10 工具查杀
#### rootkit查杀
- chkrootkit
- rkhunter
#### 病毒查杀clamav
#### webshell
#### rpm check检查
#### linux安全检查脚本
- gscan
- security_check
- /t0xst/linux

## 1.3 常见webshell查杀工具
### 1.3.1 d盾
### 1.3.2 百度webdir+
### 河马
### 1.3.4 web shell detector
### 1.3.5 牧云
### 1.3.6 php malware finder
### 1.3.7 findwebshell

## 1.4 如何发现隐藏的webshell后门
文件完整性验证，对文件进行Md5校验，并与文件发布者的特征值对比
```
import hashlib
import os

def md5sum(file):
    """计算文件或字符串的 MD5 哈希值"""
    m = hashlib.md5()

    if os.path.isfile(file):  # 处理文件
        with open(file, 'rb') as f:  # 使用 with 自动关闭文件
            for chunk in iter(lambda: f.read(4096), b''):  # 分块读取
                m.update(chunk)
    else:  # 处理字符串
        m.update(file.encode('utf-8'))  # 字符串转字节

    return m.hexdigest()
```

### 1.4.2 diff命令
diff可以展示出两个文件的不同

### 1.4.3 文件对比工具


## 1.5 勒索病毒自救
### 1.5.1 勒索病毒搜索引擎
【360】勒索病毒搜索引擎
### 1.5.2 勒索软件解密工具集
【腾讯哈勃】
【金山毒霸】
【火绒】
....

# 2 日志分析
## 2.1 windows日志分析
### 2.1.1 windows事件日志
系统日志

默认位置`%systemroot%\system32\winevt\logs\system.evtx`

应用程序日志

默认位置`%systemroot%\system32\winevt\logs\application.evtx`

安全日志

默认位置`%systemroot%\system32\winevt\logs\security.evtx`

### 2.1.2 审核策略与事件查看器
设置1：开始->管理工具->本地安全阀策略->本地策略->审核策略
或者win+r直接`eventvwr.msc`

### 2.1.3 事件日志分析
```常见安全事件
事件id 说明
4624 登陆成功
4625 登陆失败
4634 注销成功
4637 用户启动注销
4672 超级用户登录
4720 创建用户
```

登录成功的时间有一个登陆类型
[![pZgnDgO.png](https://s41.ax1x.com/2026/01/23/pZgnDgO.png)](https://imgchr.com/i/pZgnDgO)

### 2.1.4 日志分析工具
#### 2.1.4.1 log parser
#### 2.1.4.2 logparser lizard
#### 2。1.4.3 event log explorer

## 2.2 linux日志分析
