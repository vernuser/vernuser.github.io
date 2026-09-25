---
title: IBOScms代码审计
date: 2024年10月7日
updated: 2024年10月7日
tags:
  - 代码审计
categories: 代码审计
keywords:
description: 代码审计

---

## 命令执行

![](https://pic.imgdb.cn/item/6703e174d29ded1a8c971ad2.png)

在这里的只有这个地方可以修改，猜测可能存在文件读取，命令执行，sql注入等 漏洞，抓包查看路由以及传参

![](https://pic.imgdb.cn/item/6703e12ad29ded1a8c96be55.png)

![](https://pic.imgdb.cn/item/6703f031d29ded1a8ca66be2.png)


这里使用了`dbSubmit`，这个在数据包中发现是1，这里的作用是检查表单是否已经提交

在第33行调用了`database`的`databaseBackup()`方法，跟进一下

![](https://pic.imgdb.cn/item/6703f31cd29ded1a8ca95c5a.png)

这里235行通过控制`filename`参数来控制我们上传的文件名，236行对一些后缀进行了过滤


> getRequest()方法则是获取我们不同类型的请求参数，getQuery、getPost、getParam这些方法是YII框
架下封装好的一些获取请求参数的方法这些方法可直接调用

![](https://pic.imgdb.cn/item/6703f5f1d29ded1a8cac3899.png)

我们知道`filename`可控，那我们就跟踪`$filename`

![](https://pic.imgdb.cn/item/6703f5dbd29ded1a8cac1ebc.png)

这里是将`/  \\  .  '`替换成了空进行了第二次过滤后赋值给`$backupFileName`

下面设置`$method=multivol`，并将`$backupFileName`赋值给`$dumpFile`

![](https://pic.imgdb.cn/item/6703f6e6d29ded1a8cad3602.png)

else的话也是经过分支拼接到`dumpFile`,但是这里的`dumpFile`后续会被拼接到这里

![](https://pic.imgdb.cn/item/6703f7c1d29ded1a8cae729e.png)

这里用到了反引号并且`dumpfile`可控，所以我们可以传入
```
&whoami>demo1&
```

进行命令执行

## sql注入

在标签页

![](https://pic.imgdb.cn/item/67052812d29ded1a8ca9d268.png)

里面的汇报中

![](https://pic.imgdb.cn/item/6705282dd29ded1a8ca9ea51.png)

存在sql的报错

![](https://pic.imgdb.cn/item/6705282cd29ded1a8ca9ea16.png)

抓包看看

![](https://pic.imgdb.cn/item/6705285dd29ded1a8caa1698.png)

通过api控制器调用了module层的getlist类，跟进查看

![](https://pic.imgdb.cn/item/670529ecd29ded1a8cab7f41.png)

结合数据包我们可以发现存在问题的是`keyword`的`subject`

跟踪一下发现

![](https://pic.imgdb.cn/item/67052a9dd29ded1a8cac1bb9.png)

30行判断`keyword`是否存在，32行将他带入到`getListCondition`里面,`getListCondition`是进行sql拼接查询的，将结果带入到33行的`getListCondition`方法进行的sql参数执行的操作


这里教程是用的debug的方式查看参数的传递过程，但是不知道为什么我的xdebug每次一调试就是

![](https://pic.imgdb.cn/item/67061b80d29ded1a8c654eb0.png)

导致我调试不了


教程是说

这里经过调试最后返回的结果是完整的没对特殊字符进行过滤的完整sql语句

![](https://pic.imgdb.cn/item/67061ca1d29ded1a8c66e26d.png)


原因是YII框架的DB类库没有对sql进行处理兵器开发人员在二次开发的过程中没对报错进行异常捕获导致产生错误


## 文件上传

![](https://pic.imgdb.cn/item/67066381d29ded1a8c9f7e82.png)

这里可以自定义上传的文件类型，所以我们可以通过修改这个来进行文件上传，发现定义了.php还是不能上传

![](https://pic.imgdb.cn/item/67066494d29ded1a8ca04bc2.png)

抓包分析路由

![](https://pic.imgdb.cn/item/6706944ed29ded1a8cc5fe75.png)

这里是调用的file文件夹下面的personal的add，所以我们能找到`actionadd`
方法，这个方法是通过op参数帮助我们进行功能定位，但是他会先调用`actionindex`方法获取后台配置参数

![](https://pic.imgdb.cn/item/670697c6d29ded1a8cc8f23e.png)

在 `actionIndex` 方法中调用了`getUploadConfig`获取上传配置参数

![](https://pic.imgdb.cn/item/67069809d29ded1a8cc924e4.png)

跟踪发现进行了一些过滤

![](https://pic.imgdb.cn/item/6706984bd29ded1a8cc95c17.png)

他107的`dangerTags`中如果存在变量就要unset

![](https://pic.imgdb.cn/item/670698a6d29ded1a8cc9a039.png)


所以我们的php没法上传

但是我们真正上传的类中还包含着过滤

![](https://pic.imgdb.cn/item/670698f1d29ded1a8cc9dd34.png)

它调用了`CommonAttach`类下的方法，这里面封装着所有用于上传的方法


![](https://pic.imgdb.cn/item/67069948d29ded1a8cca21ff.png)

这里的`checkExt`就是第二处过滤的地方了

![](https://pic.imgdb.cn/item/67069973d29ded1a8cca4268.png)

所以我们可以用
```
gif

.htaccess
```

等等进行文件上传


## 任意文件读取

查找危险函数unlink，发现这个

![](https://pic.imgdb.cn/item/67069b02d29ded1a8ccbd4b9.png)


这里通过post获取`kety`，然后判断是不是文件就进行了删除


所以可以抓一个删除包然后进行`../`的返回，类似这样

![](https://pic.imgdb.cn/item/67069b7ad29ded1a8ccc479d.png)

至此，结束iboscms

总结：

yii框架有明显的过滤但是在module层没有封装好导致可能存在sql漏洞

unlink危险函数

