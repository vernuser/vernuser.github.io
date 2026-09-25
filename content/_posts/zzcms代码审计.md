---
title: zzcms代码审计
date: 2024年10月13日
updated: 2024年10月13日
tags:
  - 代码审计
categories: 代码审计
keywords:
description: 代码审计

---

## 框架目录

```
/install 安装程序目录（安装时必须有可写入权限）
/admin 默认后台管理目录（可任意改名）
/user 注册用户管理程序存放目录
/skin 用户网站模板存放目录;
/template 系统模板存放目录;
/inc 系统所用包含文件存放目录
/area 各地区显示文件存放目录
/zhaoshang 招商程序文件存放目录
/daili 代理
/zhanhui 展会
/company 企业
/job 招聘
/zixun 资讯
/special专题
/pinpai 品牌
/wangkan 网络刊物
/zhanting 注册用户展厅页程序
/one 专存放单页面，如公司简介页，友情链接页，帮助页都放在这个目录里了
/ajax ajax程序处理页面
/reg 用户注册页面
/3 第三方插件存放目录
  /3/ckeditor CK编缉器程序存放目录
  /3/alipay 支付宝在线支付系统存放目录
  /3/tenpay 财富通在线支付系统存放目录
  /3/qq_connect2.0 qq登陆接口文件
  /3/ucenter_api discuz论坛用户同步登陆接口文件
  /3/kefu 在线客服代码
  /3/mobile_msg 第三方手机短信API
  /3/phpexcelreader PHP读取excel文件组件
/cache 缓存文件放目录
/html 生成的静态页存放目录
/uploadfiles 上传文件存放目录
/daili_excel 要导入的代理信息excel表格文件上传目录
/image 程序设计图片,swf文件存放目录
/flash 展厅用透明flash装饰动画存放目录
/js js文件存放目录
/web.config 伪静态规则文件适用于 iis7服务器(万网比较常用)
/httpd.ini 伪静态规则文件适用于 iis6服务器
/.htaccess 伪静态规则文件适用于Apache 服务器
/nginx.conf 伪静态规则文件适用Nginx服务器


```


## 前台任意文件写入

使用Fortify自动审计工具时发现可能存在一个xxe漏洞，

![](https://pic.imgdb.cn/item/670bd341d29ded1a8c22360b.png)

`xml_parse`解析xml文档，搜索他的方法`parse`

![](https://pic.imgdb.cn/item/670be4bdd29ded1a8c316f6f.png)

发现`xml_unserialize`对`parse()`函数进行了调用，再去搜索

![](https://pic.imgdb.cn/item/670ca7d5d29ded1a8cb97562.png)

这里是从post中获取原始的数据流

上面的ertu`parse_Str`是将解码后的字符串解析为变量并存储在`$get`中，而上面的`$code`可控，而`$code`经过`_authcode`的处理，跟进一下发现大概是加解密字符串的,`$string`是需要加解密的字符串，也就是`$code`，$operation 默认为DECODE也就是解密字符串，而 $key 则为加解密的秘钥。

 > 他说这里的默认密钥是123456，我真没看出来那里说了是123456

![](https://pic.imgdb.cn/item/670cb03bd29ded1a8cbfbc47.png)

因为`code`可控，所以下面的`$time,$action`可控

59行判断传入的`$action`是否在数组中,是的话继续运行并讲`$get,post`以参数形式传输，所以`$get,post`也可控

![](https://pic.imgdb.cn/item/670cb021d29ded1a8cbfab99.png)

所以我们可以去数组中找找有没有危险操作的

`updateapps`里面有一个`fwrite`,接收的`UC-API`可控，而且下面的fwrite是将我们输入的信息进行正则匹配进行替换，所以可以实现任意文件读写

![](https://pic.imgdb.cn/item/670cb35ed29ded1a8cc1fae5.png)

### 测试

因为这里的东西限制了我们两条

![](https://pic.imgdb.cn/item/670cf31fd29ded1a8c04ac38.png)

1. `$timestamp - $get['time'] > 3600`
2. `$get['action']=updateapps;`

并且要经过_authcode（）解码，所以我们要先讲`$code`编码

这里我也找到了`UC-KEY`---他在配置文件中说是默认为123456，也就解释了上面的123456的默认

![](https://pic.imgdb.cn/item/670cfc0bd29ded1a8c0e4d6e.png)

![](https://pic.imgdb.cn/item/670d0d19d29ded1a8c270940.png)

这里说明了要按照xml的格式进行编写，所以就有了

![](https://pic.imgdb.cn/item/670cfc81d29ded1a8c0edb68.png)

![](https://pic.imgdb.cn/item/670cfc9bd29ded1a8c0ef622.png)


## 任意文件删除

全局搜索`unlink`的时候发现这么一个东西

![](https://pic.imgdb.cn/item/670d1e79d29ded1a8c3cc9bb.png)

追踪一下`unlink`的`file`发现`action`和`mlname`可控

![](https://pic.imgdb.cn/item/670d1fb3d29ded1a8c3ddba1.png)

![](https://pic.imgdb.cn/item/670d202fd29ded1a8c3e5137.png)

这里的`mlname`可控，他传入文件夹名给`ml`然后遍历整个文件夹下的文件，最将文件名赋值给`file`然后通过`unlink`删除

当文件夹下的文件全部被删除后再通过`rmdir`删除传入的文件夹

payload：
```
/admin/uploadfile_nouse.php?action=del&mlname=..\文件夹名字

```

## 前端xss漏洞

该系统没有按照mvc开发模式进行开发，导致大部分前后端代码都在一个php文件中，

![](https://pic.imgdb.cn/item/670def3bd29ded1a8cd10b09.png)

这里的两个参数`imgid`和`noshuiyin`参数可控，

![](https://pic.imgdb.cn/item/670dfa34d29ded1a8cd9de07.png)

## sql注入

这里的`classname`是可控的，从上面要求`action=modify`是一个条件，

![](https://pic.imgdb.cn/item/6710c0a3d29ded1a8c00f6b5.png)

从这php开头可以看到`dowhat`是可控的

![](https://pic.imgdb.cn/item/6710c098d29ded1a8c00ed73.png)

所以应该还有个条件是`dowhat=modifybigclass`

![](https://pic.imgdb.cn/item/6710c13dd29ded1a8c016c12.png)

```
payload=classname= xxxxxxx（自己填写sql语句）
```



## 总结：
1. 如果限制了登录失败次数像是10次这种，可以看源码中是否通过ip来进行限制的，如果是的话可以在爆破的时候将ip的第一位也爆破一下
2. sql注入的相关漏洞可以看`select *`这种的东西，后面看是否传入的参数可控
3. 还是危险函数
4. 在正常的使用中可能有些不是传统的mvn框架所以我们要对目事先录框架进行分析
5. 可以使用Fortify以及seay等工具对参数先进行分析，这样方便我们后期的审计