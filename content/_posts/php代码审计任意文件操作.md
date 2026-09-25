---
title: 代码审计
date: 2024年9月24日
updated: 2024年9月24日
tags:
  - 代码审计
categories: 代码审计
keywords:
description: 代码审计

---

## 汇总

#### 文件包含
```
include/require/include_once/require_once/sql_autoload

```
#### 文件读取
```
file_get_contents/fread/readfile/file/highlight_file/show_source
```

#### 文件写入
```
file_put_contents/fwrite/mkdir/fputs
```

#### 文件删除
```
unlink/rmdir
```

#### 文件上传
```
move_uploaded_dile/copy/rename
```

### 文件上传漏洞

文件上传流程
1. 检查文件大小，后缀，类型
2. 检查文件内容（图片头）
3. 提取文件后缀
4. 生成新文件名
5. 将上传临时文件拷贝到新文件名位置

### 逻辑常见错误
- 只检查文件类型而不检查后缀，文件头
- 文件后缀黑名单泄露
- 使用原始文件名导致\0截断漏洞

#### 啥都没过滤
https://php.mengsec.com/bugs/wooyun-2015-0125592.html


#### 前端验证
https://php.mengsec.com/bugs/wooyun-2015-0125592.html

文件上传

![](https://pic.imgdb.cn/item/66f40c28f21886ccc002a851.png)

#### 00截断
php的5.4.7之前可以使用`\00截断`

就是当你上传文件名韦`1.php\xoo1.gif`

检测到尾缀就为.gif，但是实际上识别到的文件是1.php，这就导致了文件上传漏洞


### 文件包含漏洞

文件包含漏洞!=文件读取漏洞

文件包含>文件读取

常见位置：
- 模板文件名
- 语言文件名


文件包含漏洞限制
- 寻找可被包含的文件： 上传文件、临时文件、Session文件、日志文件、
- 啥都没过滤，或者利用协议


### 文件删除漏洞

https://paper.seebug.org/411/


- 删除任意文件.dos服务器
- 删除安装所文件，导致目标环境可被重新安装
- 重新安装->任意管理员账号密码重置
