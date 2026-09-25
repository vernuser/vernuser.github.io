---
title: yzmcms代码审计
date: 2024年10月21日
updated: 2024年10月21日
tags:
  - 代码审计
categories: 代码审计
keywords:
description: 代码审计
---

路由蛮清晰的，直接开始

## 可能存在的sql注入

我在

![](https://pic.imgdb.cn/item/67163a01d29ded1a8c4857d5.png)

里面看到他所在的路由地址

![](https://pic.imgdb.cn/item/67163a2dd29ded1a8c48c83c.png)

查看本地原码的时候发现

![](https://pic.imgdb.cn/item/67163a4dd29ded1a8c4916da.png)

这里 仅仅使用了 `strip_tags`提取tablename的值，并且tablename可控，所以就猜测可能存在sql注入

但是下面的这行限制只能存在数字和字母，以及下划线，并且必须是字母开头

![](https://pic.imgdb.cn/item/67163abbd29ded1a8c4a0f0d.png)

但是我一时没想到只有数字和字母的sql语句

## xss and upload?

在后台设置了lv1可发布内容之后，在发布点发现两个功能点，查看xss的发现限制了

![](https://pic.imgdb.cn/item/67176595d29ded1a8c283c0e.png)

其中的`strip_tags`删除`tablename`输入中的所有php标签和html标签

后面使用了`trim`清理`alias`输入的开头和结尾的空格

这里避免了xss漏洞

而另一个

![](https://pic.imgdb.cn/item/6717660bd29ded1a8c292c0f.png)

这里面的通过`handle_upload_types`设置允许伤处啊你的文件类型以及参数

![](https://pic.imgdb.cn/item/67176662d29ded1a8c29e6cf.png)

里面设置了可以传照片视频docxppt以及表格等等，但是不然上传php以及txt

后面使用了

![](https://pic.imgdb.cn/item/671766b2d29ded1a8c2a979b.png)

删除原来的上传文件的地址并设置了新的地址避免目录遍历

我尝试了使用文件包含jpg啥的都不行

![](https://pic.imgdb.cn/item/6717670dd29ded1a8c2b7aab.png)
