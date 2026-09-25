---
title: csrf
date: 2024年9月19日
updated: 2024年9月19日
tags:
  - web
categories: csrf
keywords:
description: csrf

---


# CSRF漏洞

csrf跨站请求伪造,也成为one-click attack或session riding

## 攻击流程图

![](https://pic.imgdb.cn/item/66ed163ff21886ccc0d2f060.png)

## 常见伪造请求

GET 类型：

```
<link href='evilurl'>
<img src="evilurl">
<script src="evilurl">
<meta http-equiv="refresh" content="0";url="evilurl">
<video src="evilurl">
<audio src="evilurl">
<a href="evilurl">
<table background="evilurl">
```

上述中evilurl都是可以替换成恶意csrf蕴含的url

在dvwa中
```
<?php

if( isset( $_GET[ 'Change' ] ) ) {
    // Get input
    $pass_new  = $_GET[ 'password_new' ];
    $pass_conf = $_GET[ 'password_conf' ];

    // Do the passwords match?
    if( $pass_new == $pass_conf ) {
        // They do!
        $pass_new = ((isset($GLOBALS["___mysqli_ston"]) && is_object($GLOBALS["___mysqli_ston"])) ? mysqli_real_escape_string($GLOBALS["___mysqli_ston"],  $pass_new ) : ((trigger_error("[MySQLConverterToo] Fix the mysql_escape_string() call! This code does not work.", E_USER_ERROR)) ? "" : ""));
        $pass_new = md5( $pass_new );

        // Update the database
        $insert = "UPDATE `users` SET password = '$pass_new' WHERE user = '" . dvwaCurrentUser() . "';";
        $result = mysqli_query($GLOBALS["___mysqli_ston"],  $insert ) or die( '<pre>' . ((is_object($GLOBALS["___mysqli_ston"])) ? mysqli_error($GLOBALS["___mysqli_ston"]) : (($___mysqli_res = mysqli_connect_error()) ? $___mysqli_res : false)) . '</pre>' );

        // Feedback for the user
        echo "<pre>密码已更改.</pre>";
    }
    else {
        // Issue with passwords matching
        echo "<pre>密码不匹配.</pre>";
    }

    ((is_null($___mysqli_res = mysqli_close($GLOBALS["___mysqli_ston"]))) ? false : $___mysqli_res);
}

?>

```
并没验证referer和session等等，所以就存在csrf漏洞


如果遇到csrf的referer验证
### 法一
直接在流量包中修改referer，前提是你知道人家的referer是啥

### 法二
使用burpsuite生成csrf漏洞poc，在本地报错成他的referer名字，使用python启一个服务器，访问这个poc的文件地址，感觉就是url带有referer，他正则匹配的时候匹配到了就成了

## jsonp hijacking攻击

