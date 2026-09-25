---
title: hadcms代码审计
date: 2024年10月26日
updated: 2024年10月26日
tags:
  - 代码审计
categories: 代码审计
keywords:
description: 代码审计
---

## 任意文件写入

全局搜索`file_put_contents`的时候发现

![](https://pic.imgdb.cn/item/671ca80fd29ded1a8c0310e4.png)

往上回溯发现它是通过weitch..case来控制`file_put_contentts`的，而下面的path也就是我们通过POST传入的

23-35行对路径真实性进行了检验

如果不存在弹出路径不存在的提示并返回JSON响应,并且限制了不能创建新的文件夹

![](https://pic.imgdb.cn/item/671cadc7d29ded1a8c09fc8a.png)

所以我们确定了传入的内容`type=save`

path要求是必须真实存在的路径，

![](https://pic.imgdb.cn/item/671cb670d29ded1a8c148588.png)

suffixs一开始就限制了类型

![](https://pic.imgdb.cn/item/671cb69cd29ded1a8c14aa09.png)

这里只是判断了一下是否符合格式，但是没过滤php文件

所以可以通过nkdire来创建新测目录文件

![](https://pic.imgdb.cn/item/671cb729d29ded1a8c152efd.png)

### 测试

![](https://pic.imgdb.cn/item/671dedc5d29ded1a8c05f16c.png)

![](https://pic.imgdb.cn/item/671dedc5d29ded1a8c05f18e.png)


## 任意文件删除

在上面的基础上这里有一个

![](https://pic.imgdb.cn/item/671dee46d29ded1a8c065c5e.png)

由于上面的分析可知path和type是可控的，所以构成任意文件删除漏洞

## 任意文件删除+rce

存在任意文件删除的时候，我们可以进行locked锁文件的删除以重装，而且在重装界面我们能看到我们的数据库信息会记录到config.php中

![](https://pic.imgdb.cn/item/671f525dd29ded1a8c0b4516.png)

当我们安装的时候，就会对配置文件进行写入，但是写入的时候没有过滤，这就导致我们可以进行rce

![](https://pic.imgdb.cn/item/671f5398d29ded1a8c0d5e37.png)

后面是对数据库进行连接，创建等操作,但是不能随意输入，如果数据库执行期间报错会导致后面安装不成功，config,php无法写入


![](https://pic.imgdb.cn/item/671f5472d29ded1a8c0e1924.png)


最上面的代码限制了我们不能随意访问该文件，但是`$_G`中内容可控，经过尝试发现只有这里的 `mysql_prefix` 参数也就是数据库前缀这里是可以完全控制的，其他参数如果拼接特殊字符会导致数据库语句执行报错

config.php中可知，必须定义puyuetian常量才能正常访问该文件，所以显然不能直接访问而要通过特定路由，但是index.php中包含了puyueyian.php，所以只要能正常安装成功就能进行rce

![](https://pic.imgdb.cn/item/671f620ed29ded1a8c1e8584.png)

![](https://pic.imgdb.cn/item/671f621cd29ded1a8c1e9593.png)

### 测试

![](https://pic.imgdb.cn/item/671f6f15d29ded1a8c2c0f57.png)


```payload地方
/*!'; phpinfo();//
```

## 任意文件读取

![](https://pic.imgdb.cn/item/6725e7f7d29ded1a8c813f59.png)

注意一下前置，`suffixs`允许的尾缀是这个，前面我们分析了path可控

而且在下面发现了回显

![](https://pic.imgdb.cn/item/67262db0d29ded1a8cb7b5ec.png)

![](https://pic.imgdb.cn/item/67262db0d29ded1a8cb7b621.png)

![](https://pic.imgdb.cn/item/67262dd6d29ded1a8cb7d756.png)

## 模板上传绕过getshell

在`/app/superadmin/phpscript/app.php`中

![](https://pic.imgdb.cn/item/672739c5d29ded1a8c70d1ea.png)

有一个`		if (!InArray('hsa,zip', $suffix)) {`检查尾缀是否为.zip文件，然后在下面用到了`ziparchive::extractTo()`

![](https://pic.imgdb.cn/item/67273aa0d29ded1a8c718402.png)

```
ziparchive 部分使用方法
<?php
/******** ziparchive 可选参数 *******/
/*
1.ZipArchive::addEmptyDir
添加一个新的文件目录
2.ZipArchive::addFile
将文件添加到指定zip压缩包中。
3.ZipArchive::addFromString
添加的文件同时将内容添加进去
4.ZipArchive::close
关闭ziparchive
5.ZipArchive::extractTo
将压缩包解压
6.ZipArchive::open
打开一个zip压缩包
7.ZipArchive::getStatusString
返回压缩时的状态内容，包括错误信息，压缩信息等等
8.ZipArchive::deleteIndex
删除压缩包中的某一个文件，如：deleteIndex(0)删除第一个文件
9.ZipArchive::deleteName
删除压缩包中的某一个文件名称，同时也将文件删除。
?>

```
