---
title: php命令执行
date: 2024年11月15日
updated: 2024年11月15日
tags:
  - 代码审计
categories: 代码审计
keywords:
description: php命令执行
---

PHP命令执行函数
```

system：执行外部程序并显示输出

passthru：执行外部程序并显示原始输出

exec：执行外部程序并分会输出的最后一行

shell_exec：通过shell执行外部命令并分会完整的处处作为字符串

popen：打开一个管道执行fork命令

proc_open：类似鱼popen

pcntl_exec：在当前进程空间执行一个程序

dl：在运行时加载一个php扩展

`xx`

```
```
<?php
// system: 执行外部程序并显示输出
echo "system:\n";
system('dir', $retval);
if ($retval !== 0) {
    echo "Error executing system command\n";
}

// passthru: 执行外部程序并显示原始输出
echo "\npassthru:\n";
passthru('dir', $retval);
if ($retval !== 0) {
    echo "Error executing passthru command\n";
}

// exec: 执行外部程序并返回输出的最后一行
echo "\nexec:\n";
$output = [];
exec('dir', $output, $retval);
if ($retval !== 0) {
    echo "Error executing exec command\n";
} else {
    print_r($output);
}

// shell_exec: 通过shell执行命令并返回完整的输出作为字符串
echo "\nshell_exec:\n";
$output = shell_exec('dir');
if ($output === null) {
    echo "Error executing shell_exec command\n";
} else {
    echo $output;
}

// popen: 打开一个管道，执行fork的命令
echo "\npopen:\n";
$handle = popen('dir', 'r');
if ($handle === false) {
    echo "Error executing popen command\n";
} else {
    while (!feof($handle)) {
        echo fread($handle, 1024);
    }
    pclose($handle);
}

// proc_open: 类似于popen，但提供了更多的进程控制
echo "\nproc_open:\n";
$descriptorspec = [
    0 => ["pipe", "r"],  // 标准输入
    1 => ["pipe", "w"],  // 标准输出
    2 => ["pipe", "w"]   // 标准错误
];
$process = proc_open('dir', $descriptorspec, $pipes);
if (is_resource($process)) {
    while ($s = fgets($pipes[1])) {
        echo $s;
    }
    fclose($pipes[0]);
    fclose($pipes[1]);
    fclose($pipes[2]);
    proc_close($process);
} else {
    echo "Error executing proc_open command\n";
}
?>
```


![](https://pic.imgdb.cn/item/673d7b53d29ded1a8ca2d0bc.png)

## 命令执行漏洞特点
· 没有给命令传入参数的方法

· 字符串拼接

## 命令执行过滤函数

· escapeshellcmd

· escapeshellarg

上面两个的作用都是转义，但是详细还是不一样的，比如说

`escapeshellcmd`更多的是转义字符串中的特殊字符，以确保整个命令字符串的安全。它主要用于转义完整的命令行。
只要有shell命令就会被反引号转义

`escapeshellarg`义单个命令参数，以确保参数被正确处理，即使参数中包含空格或其他特殊字符。它主要用于转义单个参数


![](https://pic.imgdb.cn/item/673dab51d29ded1a8cd1016f.png)

在`escapeshellcmd`中是可以进行前者的`tail -n 5 /etc/passwd`的命令执行，但是不可以执行`tail -n 5 /etc/passwd;id`，因为id会在后面被反引号注释掉，但是在`escapeshellarg`中是不可以的

[PHPMailer 代码执行漏洞](https://www.leavesongs.com/PENTTRATION/PHPMailer-CVE-2016-10033.html)

他的问题是`mail`函数调用了系统的mail命令，但是他用用户传给mail函数的第4个参数`$params=escapeshellcmd($params)；`拼接到mail中，

但是mail函数的-x命令后面可以指定一个输出的文件名，将mail的日志输出到这个文件中，当我们传入`params="-X /var/www/html/webshell.php"；`的时候虽然有转义但是不妨碍我内部的文件的结果，这就导致了命令执行

![](https://pic.imgdb.cn/item/673dad83d29ded1a8cd3bbbe.png)

但是实际上`escapeshellcmd`和`escapeshellarg`都是不安全的，因为他们都是基于黑名单的，所以我们都可以通过绕过黑名单来进行命令执行

[谈escapeshellarg绕过与参数注入漏洞](https://www.leavesongs.com/PENTTRATION/escapeshellarg-and-parameter-injection.html)

```ABAP
public function searchTree($query, $branch)
{
    if (empty($query)) {
        return null;
    }

    $query = escapeshellarg($query);

    try {
        $results = $this->getClient()->run($this, "grep -i --line-number {$query} $branch");
    } catch (\RuntimeException $e) {
        return false;
    }
```

`escapeshellarg`只能对你的单引号逃逸等做限制，但是他并没有对你的参数做限制，所以我们可以通过`grep -i --line-number 'test' /etc/passwd;id`,`--open-files-in-pager=id`来进行命令执行，
就是说只能限制单双引号等符号但是不能限制你的函数原本就有的参数

修复方法就是在参数前面加`--`，这样就可以避免参数注入，因为lunux将会把`--`后面的参数当做参数而不是命令

如果你想读取只需要在前面加上`--`或者`./`就可以

![](https://pic.imgdb.cn/item/673db1b1d29ded1a8cd8f9a5.png)

### PHP中xml实体注入漏洞
xml解析函数
```ABAP
simplexml_load_file
simpxml_load_string
Simplexmlelement
domdocument
xml_parse
```

但是现在xxe漏洞逐渐减少
- PHP XML操作以来libxml库
- libxml2.9.0默认关闭xml外部实体解析开关

```ABAP
<php
libxml_disable_entity_loader(true);
>
```
禁用外部实体加载


挖掘的时候可以通过搜索核心函数就行暴力查找

![](https://pic.imgdb.cn/item/673db438d29ded1a8cdd0f47.png)

如果无实际的输入输出点的话

我们要通过blind_xxe
- 利用外部实体功能读取文件
- 利用外部实体发送http请求
- 利用http协议传递文件内容

像是这种的

![](https://pic.imgdb.cn/item/673db4ded29ded1a8cde1813.png)

就是通过http协议进行文件的读取


[php函数命令解释](https://explainshell.com/)

