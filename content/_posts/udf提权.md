---
title: mysql提权
date: 2023年3月19日19:47:01
updated: 2023年3月19日
tags:
  - 手法
categories: 提权
keywords:
description: udf提权
---
mysql的udf提权

## 先决条件
- 已经获得mysql数据库的控制权限（即已经知道mysql的数据库账号密码
，但是不知道数据库所在服务器的权限，并且可以远程连接数据库
- mysql具有写入文件的权力即```show global variables like
'%secure%'```为空
## 使用情况
- 在拿到mysql权限的情况下，但是没拿到mysql所在服务器的权限，
通过在mysql提权，将mysql权限提升到操作系统权限

（mysql提权获得的权限和mysql所在的服务武器登陆的账号权限
相关，如果是普通用户权限启动的mysql那就是普通用户权限
但是如果以管理员权限就是管理员权限的）

```
show global variables like '%secure%';
```

查看mysql是否具有读写的权限

- secure_file_priv值为NULL，说明不允许导入导出
- secure_file_priv值为/tmp/,说明mysql的导入导出之限制在/tmp/目录下
- secure_file_priv值为空说明允许导入导出

这是不允许的
![](https://pic.imgdb.cn/item/667e79d0d9c307b7e9760312.png)

这是允许输入输出的
![](https://pic.imgdb.cn/item/667e79d0d9c307b7e976033a.png)

如果secure_file_priv的值不是的话，我们可以在mysql/my.ini中查看时候有更改secure_file_priv的参数为''然后重启
mysql和apache服务即可生效

## 上传动态链接库
动态链接库就是实现共享函数库的一种方式，在windows下叫dll，在linux环境下就是so，我们要把它放到固定的一些目录中

- 在mysql>5.1中,udf.dll必须在mysql的bin\plugin文件夹下，plugin文件夹默认不存在需要创建
- mysql<5.1
- - 如果是 win 2000 的服务器，我们则需要将 udf.dll 文件导到 C:\Winnt\udf.dll 下。
  - 如果是 win2003 服务器，我们则要将 udf.dll 文件导出在 C:\Windows\udf.dll 下。

我已经创建了所以直接使用
```
show variables like "plugin%";
```
查看位置

然后使用

```
select @@version_compile_os.@@version_compile_machine
```
查看当前数据库以及操作系统的架构


在linux中我们需要编写一个udf.cpp的文件在执行编译的命令

```
#include <mysql.h>
 extern "C" long long testadd(UDF_INIT *initid, UDF_ARGS *args, char *is_null, char *error)
{
int a = *((long long *)args->args[0]);
int b = *((long long *)args->args[1]);
return a + b;
}
extern "C" my_bool testadd_init(UDF_INIT *initid, UDF_ARGS *args, char *message)
{
return 0;
}


```

g++ -shared -fPIC -I /usr/include/mysql -o udf.so udf.cpp

然后需要将我们编译好的udf.so下载到mysql相应的目录中，
记得```select version();```
查看版本，然后就是创建函数
```
create function函数名 returns string soname "udf.so"
```
函数名必须和源码的一样

```

select * frome mysql.func
```
执行函数
select 函数名



# 总结

UDF提权就是MYSQL的服务端由谁运行就可以获得谁的权限,UDF提的是系统的权而不是数据库用户的

在Linux下5.7版本之后，默认运行时MySQL的是mysql用户，所以在MySQL 5.7版本之后，UDF提权基本上来讲算是失效了，
除非管理员手动用root身份去运行MYSQL，5.7之前MySQL运行时默认是以root身份去运行的


~~所以我昨天那个靶机问题应该是在我提权的函数名不一样，但我懒的再改了/ww~~