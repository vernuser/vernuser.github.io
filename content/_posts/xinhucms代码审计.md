---
title: xinhucms代码审计
date: 2024年11月8日
updated: 2024年11月8日
tags:
  - 代码审计
categories: 代码审计
keywords:
description: 代码审计
---

信呼cms将后端代码都放置在webmain目录下，而且访问方式都是
```

index.php?a=文件名&d=文件对应名&m=模块
```

## shell

![](https://pic.imgdb.cn/item/673af490d29ded1a8c6e292a.png)
在这个地方我们发现可以看到一个上传文档点

![](https://pic.imgdb.cn/item/673af4c2d29ded1a8c6e55a2.png)

抓包发现在`upload`文件下`upload`文件的`public`模块

追踪到`uploadAction.php`里面的`upfileAjax`

![](https://pic.imgdb.cn/item/673af651d29ded1a8c6fc8f5.png)

主要是对上传文件的限制，使得他按照要求进行上传，里面调用了c函数，跳转到C函数中发现包含了`uploadchajian.php`

![](https://pic.imgdb.cn/item/673b06a0d29ded1a8c80f1f7.png)

回到原来的代码中发现第49行调用了up函数，跳转查看

![](https://pic.imgdb.cn/item/673b12a0d29ded1a8c8f6af3.png)

`issavefile()`方法是用来进行后缀判断的

![](https://pic.imgdb.cn/item/673b14e6d29ded1a8c92087f.png)

![](https://pic.imgdb.cn/item/673b14a3d29ded1a8c91b1b2.png)


白名单绕过，如果不在的话调用`filesave`函数

![](https://pic.imgdb.cn/item/673b15c5d29ded1a8c92f750.png)

这段是读取我们上传的文件内容并保存为base64编码格式，然后将代码保存为uptemp文件，最后进行删除，

![](https://pic.imgdb.cn/item/673b16bdd29ded1a8c941bf8.png)

![](https://pic.imgdb.cn/item/673b1708d29ded1a8c947201.png)

回到 `upfileAciton()` 方法中， `$upses` 接收 `up()` 方法返回的数据并将数据通过 `downChajian.php` 中`uploadback()` 方法备份到数据库，并以json形式返回

![](https://pic.imgdb.cn/item/673b179ad29ded1a8c953457.png)

我们发现这里上传到的.php文件后缀会被替换为 .uptemp 后缀的文件，并返回了上传路径

但是我们在进行关键函数的检索的时候发现了一个可以解密base64的地方，并且可以通过控制id来还原`.uptemp`后缀文件为之前上传的后缀


![](https://pic.imgdb.cn/item/673b1a42d29ded1a8c988212.png)

从这一段可以看出是上面上传处理的一个反向操作，并且通过`fileid`来控制

![](https://pic.imgdb.cn/item/673b1a8bd29ded1a8c98daf3.png)

![](https://pic.imgdb.cn/item/673dba0fd29ded1a8ce74350.png)


联系上面是fileid参数来控制上传的文件使其还原

所以我们可以通过更改fileid来控制

### 渗透测试

将fileid替换为我们上传的文件的id

![](https://pic.imgdb.cn/item/673b1b16d29ded1a8c99869b.png)

发现之前的.uptemp确实是可以被替换为.php文件后缀

![](https://pic.imgdb.cn/item/673b1b38d29ded1a8c99b1da.png)


## 文件包含

在`include_once`的时候发现一个`mpathname`可控，

![](https://pic.imgdb.cn/item/673ca031d29ded1a8cffcf11.png)

所以我们尝试跟踪这个发现他在上面被赋值了，就是71行的`$tplpaths.$tplname`
下面我们发现`tplname`的后缀是限制限制死的只能为html

![](https://pic.imgdb.cn/item/673ca045d29ded1a8cffdeea.png)

我们跟踪另外一个`mpathname`，他的代码说明是检查`$xhrock->displayfile`是否不为空，检查文件是否存在，然后重点关注这个`xhrock`,回溯到上面的是新建一个实例，然后接着回溯这个返现是可以通过控制`$m`来控制的

![](https://pic.imgdb.cn/item/673ca15dd29ded1a8c00d7b1.png)

而这里的$m是通过前端传入的

![](https://pic.imgdb.cn/item/673ca241d29ded1a8c01a37e.png)

但这里想要进入34行的if判断必须存在 $actfile 文件,而这里的 $actfile 变量是通过代码30行进行处理的。我们跟进 strformat() 函数

![](https://pic.imgdb.cn/item/673ca299d29ded1a8c01ec8a.png)

![](https://pic.imgdb.cn/item/673ca6e5d29ded1a8c059644.png)

这两个的大概内容是找到对应的php文件，而上述代码30行的` $m `是可控的,所以回到`xhrock`看`displayfile`可控的地方

![](https://pic.imgdb.cn/item/673ca7c2d29ded1a8c077d5b.png)

找到这个

`indexAction.php`的 `getshtmlAction` 函数中的 `displayfile` 变
量是通过 `$file` 进行赋值的，而 `$file` 中的 `$surl`参数是前端可控的，所以这里可以包含任意的php后缀文件。
（记得base64编码）

而`View.php`中这里我们可以控制`$m`来调用`indexAction.php`文件并且实例化文件中的`indexClassAction` 类，并且可以任意调用该类下的方法，也就是可以调用 `indexClassAction` 类下的`getshtmlAction` 方法

![](https://pic.imgdb.cn/item/673ca9acd29ded1a8c0b53f6.png)

### 渗透测试

![](https://pic.imgdb.cn/item/673ca9dbd29ded1a8c0b8fc0.png)


##