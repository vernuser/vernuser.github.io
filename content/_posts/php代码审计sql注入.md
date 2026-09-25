---
title: 代码审计sql注入
date: 2024年9月21日
updated: 2024年10月10日
tags:
  - 代码审计
categories: 代码审计
keywords:
description: 代码审计

---


# java代码审计

## codeql安装

从github下载cil文件

[cli文件release地址](https://github.com/github/codeql-cli-binaries/releases)

下载下来以后找一个没有中文的路径解压缩安放

 再从github下载工作车间

[工作车间](https://github.com/github/vscode-codeql-starter)

注意下载的时候不要直接clone，因为他不只有这个还包括其下的子项目


使用vscode的图形化界面的话需要先在vscode安装插件codeql（不是很理解为什么jetbrains的要收费，适用的那个也是乱七八糟的）

在插件设置中配置codeql的二进制文件

![](https://pic.imgdb.cn/item/66ee6ed0f21886ccc00e24bb.png)

再系统环境变量中添加codeql的bin文件地址

这样codeql就配置好了

后面就是创建数据库的过程，我尝试的是这个项目
 [java-sec-code](https://github.com/godzeo/java-sec-code)

执行codeql命令
```
codeql database create /Users/zy/Documents/project/codeql/vscode-codeql-starter-main/database/codeql_java-sec-code  --language="java"  --command="mvn clean install --file pom.xml" --source-root=/Users/zy/Documents/project/sec_java_vul/java-sec-code

```

这里面，
```
codeql database create  /Users/zy/Documents/project/codeql/vscode-codeql-starter-main/database/codeql_java-sec-code

创建一个在/Users/zy/Documents/project/codeql/vscode-codeql-starter-main/database/名为codeql_java-sec-code的数据库

--language="java"  使用的是java的语言

--command="mvnb clean install --file pom.xml"利用命令进行源码编译

--source-root= 设置源码的路径


```

如果能成功的话会输出Successfully created database at xxxxxx的，需要注意的是不是每个项目都可以使用codeql进行审计，codeql是将代码转化成类似数据库的形式，并基于该database进行分析

然后再codeql的插件中选择你刚刚建立的数据库文件夹

![](https://pic.imgdb.cn/item/66ee71e6f21886ccc011bb88.png)

官方制定了一下规则可以使用
```
/ql/java/ql/src/Security                 放着一些官方的规则(java)，可直接用。
/ql/java/ql/src/experimental/Security  一些还在实验中的规则(java)。
```

找到代码的进行运行，跑出来了就是成功了

![](https://pic.imgdb.cn/item/66ee723ff21886ccc01221d8.png)

php手工调试
```
万金油函数
var_dump       将当前变量值或者函数返回结果dump出来

查看上下文内容
- get_defined_functions
- get_defined_vars   获取当前运行php的所有变量
- get_defined_constants
- get_included_files
- get_loaded_extensions
- get_Declared_classes
- get_Declared_interfaces

查看函数调用过程
- debug_backtrace
- debug_print_backtrace

Xdebug手工调试
- xdebug_call_file 获取调用当前函数的文件
- xdebug_call_line 获取调用当前函数文件的行
- xdebug_call_function 获取调用当前函数的函数
- xdebug_dump_superglobals 获取所有超全局变量
- xdebug_get_monitored_functions 监控函数调用


```

影响php安全的全局配置
```
- magic_quote_gpc:5.3后废弃,5.4后移除
将所有变量进行转义

- register_global:4.2后默认false
将用户传入的变量被直接的注册为全局变量直接使用

- allow_url_include:默认false
允许url包括远程文件，可能导致csrf，xss

- allow_url_fopen:默认true
允许url读取远程文件

- request_order:5,3后从gpc改为gp
指定 PHP 在处理 HTTP 请求参数

- show_open_tag：5.4+，无论是够开始<?=...?>都是可以运行的
用于控制是否允许使用短标签

- safe_mode(5.4移除)


- open_basedir
限制 PHP 脚本对文件系统的访问范围

- disable_functions/disable_classes
 PHP 中禁用特定的内置函数\类

- enable_dl（5.2默认false）
是否允许加载拓展

```

![](https://pic.imgdb.cn/item/66ee8818f21886ccc02858ab.png)

## 代码审计的sql注入

- 反向查找流程
  - 通过可控变量（输入点）回溯危险函数
  - 查找危险函数可控变量
  - 传递的过程中触发漏洞
无法挖掘逻辑漏洞等
命中率低
适应性较差：不适合全局过滤的站点


- 正向查找流程
  - 从入口点函数触发
  - 找到控制器，理解url派发规则
  - 跟踪控制器调用，以理解代码为目标进行源码阅读
  - 阅读代码的过程中可能发现漏洞


## php sql注入漏洞技巧
### php+mysql连接方式
PDO
Mysqli
Mysql（废弃）没有预编译

### sql注入常见过滤方法
intval/addslashes/mysql_real_escape
mysqli_escape_string/mysqli_real_escape_string/mysqli::escape_string
PDO::quote
参数化查询

## 常见注入过滤绕过方法
1.
- intval                将变量的值转换为整数
- addslashes            用于对字符串中的特殊字符进行转义，包括单引号 (')、双引号 (")、反斜杠 (\)、NULL 字符等
![](https://pic.imgdb.cn/item/66ef842ef21886ccc018df58.png)
- mysql_real_escape
![](https://pic.imgdb.cn/item/66ef8566f21886ccc019f995.png)

绕过方式:
宽字节注入
寻找字符串转换函数
-  urldecode
- base64_Decode
- iconv
- json_decode
- stripshasles
- simple_xml_loadstring
![](https://pic.imgdb.cn/item/66ef9128f21886ccc024cfe2.png)
这里的'id'如果不加上引号的话，转义就没有意义，因为可以通过数字型

```1 union select xxxx from xxxx```

进行绕过

2.
- mysqli::escape_string /PDO::quote
  - 与addslashes差别：是否会主动加引号包裹
  - 宽字符注入


3.
- 参数化查询
     - 寻找非sql值位置
     - SELECT `name` FROM `user` WHERE `id`=?ORDER BY `login_time` LIMIT 1
上面的中只有?的地方是可以预编译的，其他的可以被用户控制的地方仍然可能存在sql注入漏洞

#### 举例1
贷齐乐header注入
```
function t($text){
$text = nl2br($text);
$text = real_strip_tags($text);
$text = addslashes($text);
$text = trim($text);
return $text;
```

分析
```
nl2br($text):

将文本中的换行符 \n 转换为 HTML 的 <br> 标签，以便在网页上正确显示换行。
real_strip_tags($text):

假设这是一个自定义函数，用于移除文本中的 HTML 标签。通常用来防止XSS攻击和清理输入数据。
addslashes($text):

在特殊字符（如单引号、双引号、反斜杠）前添加反斜杠。通常用于准备将文本插入数据库，防止SQL注入。
trim($text):

移除文本两端的空白字符，包括空格、制表符和换行符。
返回值
```


在整个函数中，只有addslashes函数对sql进行了限制


#### 举例2
metinfo企业网站管理系统SQL注入漏洞
```
if($p){
   $array = explode('.',base64_decode($p));
   $sql="SELECT * FROM $met_admin_table WHERE admin_id='".$array[0]."'";
   $sqlarray = $db->get_one($sql);
```


![](https://pic.imgdb.cn/item/66f0065cf21886ccc09bc433.png)

### 思路总结
开发者容易忽略的注入点
```
· http头
  X-Forwarded-For
  User-Agent
  Referer
· PHP_SELF
· 文件名$_FILES[][name]
· REQUEST_URI
· php：//input

```
![](https://pic.imgdb.cn/item/66f007aff21886ccc09d5834.png)
这个
```PHP_SELF```
是用户可控的
![](https://pic.imgdb.cn/item/66f007eaf21886ccc09d9622.png)


![](https://pic.imgdb.cn/item/66f00835f21886ccc09dded4.png)

和上一个一样，但是是用户可传的完整路径

引入单引号（转义符）的方法

```
stripslashes

base64_decode

urldecode

substr

iconv

str_Replace('0',',$sql')

xml

json_decode
```

## test
1.
![](https://pic.imgdb.cn/item/66f0187af21886ccc0ade027.png)

这个中存在最easy的sql注入，在这个项目中

```
$name = $_GET['name'];
$query = "SELECT name,age,email,country FROM user_details WHERE name='{$name}'";
```

直接获取了get中name的值然后传给query的sql语句中，在这里可以进行sql注入

2.

![](https://pic.imgdb.cn/item/66f029aef21886ccc0c0fd46.png)

除了宽字节基本没啥漏洞，除非用的是GBK


3.
![](https://pic.imgdb.cn/item/66f02c11f21886ccc0c37c5c.png)

可以防御sql，需要设置

![](https://pic.imgdb.cn/item/66f02c6df21886ccc0c3e074.png)

```
ENT_QUOTES是在参数的第二位flag参数设置
```


所以这个其实也是存在sql注入的

4.
![](https://pic.imgdb.cn/item/66f02f2bf21886ccc0c6d136.png)

这个也是存在sql注入的，他虽然做了转义但是没有在后面就行''的处理导致age裸露在外面

5.
![](https://pic.imgdb.cn/item/66f105ccf21886ccc0793660.png)

这个也是存在sql的

![](https://pic.imgdb.cn/item/67075cacd29ded1a8c6161cc.png)


6.
![](https://pic.imgdb.cn/item/66f12e81f21886ccc0a16d88.png)

这个是将字符串变成数字，包没有漏洞

7.
![](https://pic.imgdb.cn/item/66f15b14f21886ccc0cd5101.png)

这个一眼有，这里intval是没用的，他仍然将`$_GET['id']`传入

8.
`id_numeric`判断用户输入是不是输入的数字或数字字符串

![](https://pic.imgdb.cn/item/66f15d35f21886ccc0cf514b.png)

这里其实是存在的

他没有在返回404以后组织运行，后面的还是继续会执行的

把后面的`$wuery`放在else里面会更好一点

9.
就是在8的后面header后面加了个exit，这个就没有了


10.
![](https://pic.imgdb.cn/item/66f15f44f21886ccc0d154ca.png)

我看着像是没有，但是是有的

属于是防了，但没完全防

```
如果我输入这样子的
order=ASC; DROP TABLE user_details; --
他就会变成
SELECT name, age, email, country FROM user_details ORDER BY id ASC; DROP TABLE user_details; --

还是会删除user_details表
```


11.
![](https://pic.imgdb.cn/item/66f16b81f21886ccc0dd681e.png)

这个地方正则不对，他只判断是是否是存在这个`/DESC/ASC/i`而不是只有这个，我们可与i进行sql注入以后在后面接一个desc

```例
union select 1,2,3# DESC
```

想要修改的话，
```
if (!preg_match('/^(DESC|AEC)$/i',$order)){
```
![](https://pic.imgdb.cn/item/66f16d35f21886ccc0df23a4.png)


12.
![](https://pic.imgdb.cn/item/66f16e76f21886ccc0e063b1.png)

没有漏洞，非常标准的预编译的

在SQL语句中使用占位符 ?，并在 execute() 方法中传递参数数组 `[$name]`。这样可以确保用户输入的数据不会直接插入到SQL语句中，从而避免SQL注入攻击。

13.
![](https://pic.imgdb.cn/item/66f16eddf21886ccc0e0ce0b.png)

有sql注入漏洞，他给的评价是，这里的`urldecode,或者base64_Decode会引入新的单引号进行注入使得前面的addslashes无效`

![](https://pic.imgdb.cn/item/66f16ff1f21886ccc0e1e800.png)

至此，sql的php代审结束