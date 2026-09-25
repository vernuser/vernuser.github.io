---
title: bosscms代码审计
date: 2024年10月5日
updated: 2024年10月5日
tags:
  - 代码审计
categories: 代码审计
keywords:
description: 代码审计

swiper_index:
---

先分析路由

![](https://pic.imgdb.cn/item/6700e7d8d29ded1a8cc33f37.png)

上面是对一些常量进行定义，并且在下面引入了
```
system/enter.php
```
文件，


![](https://pic.imgdb.cn/item/6700fb52d29ded1a8cd5cddd.png)


在这里的时候依旧是定义了一些常量，但在最后包含了into.class.php的into类下面的load()方法，跟进

在load()方法中，调用了同类下的load_class()方法，这里我们看到的bosscms_type就是在enter.php里面的常量，后面传入的三个参数
```
defined('BOSSCMS_TYPE') ? BOSSCMS_TYPE : null 检查常量 BOSSCMS_TYPE 是否定义，如果定义了则使用其值，否则使用 null。
BOSSCMS_MOLD、BOSSCMS_PART 和 BOSSCMS_FUNC 是预定义的常量，分别表示模块、部分和函数。

```
在`load_class()`方法中需要传入四个参数，第一个参数 $type 是判断该功能点是前台功能点还是后台功能
点，也就是决定代码19行的$type路径是在哪个文件夹下，由于SYSTEM_PATH常量定义为system目录
下，所以系统的功能性代码都放在了该目录下。 $mold 参数定位功能目录， `$part` 决定调用目录下哪个
php文件， `$func` 则是定位文件下调用的方法。
在代码第20行如果上面的 $file 不存在则尝试加载plugin文件下的php文件用来加载插件。在代码第30
行包含 `$file` 。32-35行代码使用 `call_user_func()` 回调函数实现类中方法的调用。

![](https://pic.imgdb.cn/item/6701012fd29ded1a8cdb1b9b.png)

## udritor编辑器文件上传漏洞


![](https://pic.imgdb.cn/item/6701f303d29ded1a8cbf102c.png)

在安全设置中发现可以添加上传文件的后缀名，（这个PHP是我添加的）

然后在上传logo文件上传php的时候却被提示该文件拓展名不允许上传

抓包找到路由

![](https://pic.imgdb.cn/item/6701f371d29ded1a8cbf6bbf.png)

也是定义了一些常量，10行通过包含enter.php进行路由的选择

![](https://pic.imgdb.cn/item/6701f3ebd29ded1a8cbfda2e.png)

抓包里面是`action=uploadimage`，

对应的选择是uploadimage方法上传图片，case的使用方法和c语言的case类似,其中使用的config来读取分支``config[`imageActionName`]``


![](https://pic.imgdb.cn/item/6701fc8fd29ded1a8cc6fe44.png)


而config在上面也获得了

![](https://pic.imgdb.cn/item/6702020cd29ded1a8ccc3c11.png)

`$this->config = into::load_json("config.json"); 调用 into 类的 load_json 方法加载 config.json 文件，并将其内容赋值给 $this->config 属性。`


![](https://pic.imgdb.cn/item/6702081ad29ded1a8cd213c9.png)


上面那个action传入的，在这里成了imageActionName，对应上了上面的那个的case中的

![](https://pic.imgdb.cn/item/67022cc9d29ded1a8cf2e096.png)

```
查文件上传：

if(isset($_FILES[$this->config['imageFieldName']])){

检查是否有文件通过表单上传，表单名称为 imageFieldName。

获取上传文件：

$file = $_FILES[$this->config['imageFieldName']]; 获取上传的文件信息。

检查文件大小：

if($file['size'] <= $this->config['imageMaxSize']){

检查文件大小是否在允许的最大值 imageMaxSize 之内。

上传文件：

if(upload::files($file, $this->config['imagePathFormat'], 'photo')){
调用 upload::files 方法上传文件，路径格式为 imagePathFormat，文件类型为
photo。

上传成功：

如果上传成功，返回 JSON 编码的成功信息，包括文件的 URL、标题和原始名称。

上传失败：

如果上传失败，返回 JSON 编码的错误信息，错误状态为 upload::$msg。

文件大小超限：

如果文件大小超过限制，返回 JSON 编码的错误信息，状态为 超过ueditor的图片上传大小限制。
```
这里的关键是upload::files函数

跟踪files，在第60行发现我们刚才被限制的

![](https://pic.imgdb.cn/item/67022fd0d29ded1a8cf553c6.png)

向上追溯发现有两个限制条件，

第一个是检查我们上传的文件拓展名`$ext`是否在允许的扩展名列表中`$extension`

第二个是判断`$type`是否为空，如果为空的话表示不需要进一步检查文件类型，如果不为空且`$in`为false的话，说明需要检查文件类型，但文件类型不在指定的类型中

从第一个我们追溯extension可以得到

![](https://pic.imgdb.cn/item/67023967d29ded1a8cfe85ae.png)

他取决与upload_extension的，全局搜索以后发现这个是我们自己设置的那个，所以这个天然成立

另一个的话我们如果想满足前面的`!type=true`就需要使得程序运行到第36行`$type=NULL`，所以要满足`$k`在`$tarr`里面，`tarr`是我们上传的files的第三个参数photo
而这里的`$k`是从`$G[extension]`获取的，

这里应该是调试，但是不知道为什么我调试环境一直不对，从教程来看的话是说这里的`.php`后缀在code类型而该功能点传入的类型为photo所以这里应该是不满足第二个条件导致的不能实现文件上传

在`extension.json`里面看到了`externsion`里面的东西

所以想要实现php的文件上传，我们必须要满足type的类型为code才行

![](https://pic.imgdb.cn/item/670282dcd29ded1a8c42769d.png)

全局搜索`files()`方法调用，发现该功能点的传入类型有code，所以可以实现文件上传

![](https://pic.imgdb.cn/item/67028361d29ded1a8c42eba0.png)

## 任意文件删除

在`超过ueditor.class.php`里面还有一个delete()方法，可以对文件进行删除

![](https://pic.imgdb.cn/item/67032e82d29ded1a8cc3afbf.png)

这里也是进行了两个判断

- 判断post参数里面是否包含path参数
- 判断传入的path参数是否以upload开头

都满足的话进下面的`store_type`判断，判断是否是为空，如果不为空的话调用oss类的delete，如果为空的话调用dir类的delete()

所以关键是在`store_type`，全局搜索发现是一个存储的，默认为0

![](https://pic.imgdb.cn/item/6703307dd29ded1a8cc4eceb.png)

跟进dir类下的delete()方法查看该方法：

![](https://pic.imgdb.cn/item/670330c0d29ded1a8cc515ea.png)

经过`replace`函数方法后使用`id_files`函数检查路径是否执行一个文件，使得若进行`unlink`删除，我们跟进`replace`看是否存在过滤

![](https://pic.imgdb.cn/item/670331d1d29ded1a8cc5c454.png)

他这里并没有进行过滤，只是 对`//,///`的路径进行了省略优化，所以可以直接调用路由

payload:`path=upload/../xxxx`(删除的是根目录下的)

![](https://pic.imgdb.cn/item/670331bed29ded1a8cc5b91e.png)


## 目录遍历漏洞

同样在`uedirot.class.php`下的还有list方法，在327行的`$folder`是GET传入的没有任何过滤就拼接到了`$path`中

![](https://pic.imgdb.cn/item/670364c3d29ded1a8cf5ffd7.png)

在里面有一个read()方法，这里的332,335行都调用了这个方法，从上面的审计中我们可以知道这个地方是选择远程oss读取还是本地读取，所以是二选一必须走一个

oss的是远程读取的，我们选择对dir的本地读取的read下手

分析可得，这个方法使用opendir函数打开目录句柄，readdir函数读取目录内容，在这个文件最上面的replace函数之前分析过是进行路径优化的，而且132行的`$is_dir`是判断是目录还是文件，所以说如果这里的`$path`可控的话就可以导致目录遍历

![](https://pic.imgdb.cn/item/67037606d29ded1a8c085ef6.png)

回到lists方法，全局搜索找到

![](https://pic.imgdb.cn/item/67037985d29ded1a8c0cd47d.png)

这李通过lists传入了一个``config[`fileMangerListPath`]``

全局搜索发现使用一个列出文件目录的东西

![](https://pic.imgdb.cn/item/67037a06d29ded1a8c0d786c.png)

找到该值是upload/路径，也就是说上面要读取的文件是upload目录下的文件，我们从上面的分析中可以知道lists()方法中传入的 $folder 参数没有进行过滤就拼接到 `$path`中所以这里是存在目录遍历的。

所以我们要找在哪调用了`listfile`方法

由之前的可以知道，我们调用路由是通过改目录文件下的，在最开始的时候我们调用里init方法，在里面通过传输action参数实现类中方法的实行


![](https://pic.imgdb.cn/item/67037d90d29ded1a8c11852b.png)

![](https://pic.imgdb.cn/item/67037e1bd29ded1a8c120533.png)

我们可以构造路由
```
/system/extend/ueditor/php/controller.php?action=listfile&folder=../../../
```

![](https://pic.imgdb.cn/item/67037e7fd29ded1a8c127277.png)


## 任意文件下载

在这里存在一个sql的任意文件下载漏洞

![](https://pic.imgdb.cn/item/6703b698d29ded1a8c5f5009.png)

我们抓包看看

![](https://pic.imgdb.cn/item/6703b714d29ded1a8c5ff255.png)

可以看到路由是safe下的backup

![](https://pic.imgdb.cn/item/6703b7dcd29ded1a8c60db40.png)

这里直接`get`了一个`id`，然后直接拼接路径中

这里的sql是上面已经定义的路径

而后在第73行使用readfile函数进行文件读取，中间没有做任何过滤，所以可以通过

`../`实现目录跳转来读取文件


![](https://pic.imgdb.cn/item/6703b8a4d29ded1a8c61cc93.png)


![](https://pic.imgdb.cn/item/6703b83bd29ded1a8c614c00.png)


## 权限校验处存在逻辑缺陷

在第一个`ueditor.class.php`中，有这么两条

![](https://pic.imgdb.cn/item/6703ba76d29ded1a8c6412c2.png)

`ueditor`类继承了`admin`类,最上面通过`basic_class()`来加载`admin.class.php`文件，，跟进这个方法

![](https://pic.imgdb.cn/item/6703bad4d29ded1a8c6491e1.png)

这里设置了`$func`参数，如果没有就默认设置成`init`，而且在最下面调用`load_class`加载类文件，再通过类加载`admin`的`init()`方法，

这里通过`init`调用`session`get一个session，如果为空的话判断是否定义了`IS_LOGIN`，如果未定义的话就重定向刀登陆界面，但是跳转结束以后代码没有`die`，他就会继续调用init导致上面的鉴权无效

![](https://pic.imgdb.cn/item/6703bcf0d29ded1a8c6739f8.png)


至此结束bosscms