---
title: nuclei模板编写&&yaml学习
date: 2024年6月27日
tags:
  - yaml
categories: yaml
keywords:
description: yaml
---

Nuclei 是一种可快速利用的漏洞扫描程序，旨在探测现代应用程序、基础设施、云平台和网络，帮助
识别和缓解漏洞。

Nuclei的核心是利用模板(表示为简单的 YAML 文件)来描述检测、排名和解决特定安全漏洞的方
法。

每个模板都描述了可能的攻击路线，详细说明了漏洞、其严重性、优先级以及偶尔出现的相关漏洞。
这种以模板为中心的方法确保 Nuclei不仅可以识别潜在威胁，还可以精确定位具有切实现实影响的可
利用漏洞。

## nuclei安装教程

安装nuclei的三种方式

```go环境下
go install -v github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest
```


```直接下载二进制文件
https://github.com/projectdiscovery/nuclei/releases
```


```使用docker拉取
docker pull projectdiscovery/nuclei:latest
```

windows下推荐直接下载二进制文件就行了，简单方便

linux下直接
```
pip install nuclei
```
不需要go环境就能下载完成

验证安装成功与否
```
nuclei -h
```
![](https://pic.imgdb.cn/item/667d4b9dd9c307b7e9a9ba2c.png)
下载以后先更新
```
nuclei -up   #更新nuclei
nuclei -ut   #更新脚本
```

nuclei命令集
```
用法：
  nuclei [命令]

命令：
目标：
   -u, -target string[]                 指定扫描的URL/主机
   -l, -list string                     指定需要扫描的URL/主机文件（一行一个）

模板：
   -t, -templates string[]              指定需要扫描的模板或者模板的路径
   -nt, -new-templates                  只扫描最新版本中添加的模板
   -w, -workflows string[]              指定扫描中的工作流或者工作流目录
   -validate                            验证通过的模板
   -tl                                  列出所有可用的模板

过滤：
   -tags string[]                       执行有标记的模板子集
   -etags, -exclude-tags string[]       执行标记为排除的模板
   -itags, -include-tags string[]       不执行具有攻击性的模板
   -et, -exclude-templates string[]     要排除的模板或者模板目录
   -it, -include-templates string[]     执行默认或配置中排除的模板
   -s, -severity value[]                根据严重性运行模板，允许的值有：info,low,medium,high,critical
   -es, -exclude-severity value[]       根据严重性排除模板，允许的值有：info,low,medium,high,critical
   -a, -author string[]                 执行指定作者的模板

输出：
   -o, -output string                   输出发现的问题到文件
   -silent                              只显示结果
   -nc, -no-color                       禁用输出内容着色（ANSI转义码）
   -json                                输出为jsonL（ines）
   -irr, -include-rr                    在JSONL中输出对应的请求和相应（仅结果）
   -nm, -no-meta                        不显示匹配的元数据
   -nts, -no-timestamp                  不在输出中显示时间戳
   -rdb, -report-db string              本地的Nuclei结果数据库（始终使用该数据库保存结果）
   -me, -markdown-export string         以markdown导出结果
   -se, -sarif-export string            以SARIF导出结果

配置：
   -config string                       指定Nuclei的配置文件
   -rc, -report-config string           指定Nuclei报告模板文件
   -H, -header string[]                 指定报告中的标题：value格式
   -V, -var value                       通过var=value指定var值
   -r, -resolvers string                指定Nuclei的解析文件
   -sr, -system-resolvers               当DNS错误时使用系统DNS
   -passive                             启用被动扫描处理HTTP响应
   -ev, env-vars                        在模板中使用环境变量

交互：
   -inserver, -ineractsh-server string  使用interactsh反连检测平台（默认为"https://interact.sh"）
   -itoken, -interactsh-token string    指定反连检测平台的身份凭证
   -interactions-cache-size int         指定保存在交互缓存中的请求数（默认：5000）
   -interactions-eviction int           聪缓存中删除请求前等待的时间（默认为60秒）
   -interactions-poll-duration int      每个轮询前等待时间（默认为5秒）
   -interactions-cooldown-period int    退出轮询前的等待时间（默认为5秒）
   -ni, -no-interactsh                  禁用反连检测平台，同时排除基于反连检测的模板

限速：
   -r1, -rate-limit int                 每秒最大请求量（默认：150）
   -rlm, -rate-limit-minute int         每分钟最大请求量
   -bs, -bulk-size int                  每个模板最大并行检测数（默认：25）
   -c, -concurrency int                 并行执行的最大模板数量（默认：25）


优化：
   -timeout int                         超时时间（默认为5秒）
   -retries int                         重试次数（默认：1）
   -mhe, -max-host-error int            某主机扫描失败次数，跳过该主机（默认：30）
   -project                             使用项目文件夹避免多次发送同一请求
   -project-path string                 设置特定的项目文件夹
   -spm, -stop-at-first-path            得到一个结果后停止（或许会中断模板和工作流的逻辑）
   -stream                              流模式 - 在不整理输入的情况下详细描述

无界面浏览器：
    -headless                           启用需要无界面浏览器的模板
    -page-timeout int                   在无界面下超时秒数（默认：20）
    -sb, -show-brower                   在无界面浏览器运行模板时，显示浏览器
    -sc, -system-chrome                 不使用Nuclei自带的浏览器，使用本地浏览器

调试：
    -debug                              显示所有请求和响应
    -debug-req                          显示所有请求
    -debug-resp                         显示所有响应
    -proxy, -proxy-url string           使用HTTP代理
    -proxy-socks-url string             使用SOCK5代理
    -tlog, -trace-log string            写入请求日志到文件
    -version                            显示版本信息
    -v, -verbose                        显示详细信息
    -vv                                 显示额外的详细信息
    -tv, -templates-version             显示已安装的模板版本

升级：
    -update                             更新Nuclei到最新版本
    -ut, -update-templates              更新Nuclei模板到最新版
    -ud, -update-directory string       覆盖安装模板
    -duc, -disable-update-check         禁用更新

统计：
    -stats                              显示正在扫描的统计信息
    -sj, -stats-json                    将统计信息以JSONL格式输出到文件
    -si, -stats-inerval int             显示统计信息更新的间隔秒数（默认：5）
    -m, -metrics                        显示Nuclei端口信息
    -mp, -metrics-port int              更改Nuclei默认端口（默认：9092）
```

或者直接使用nuclei给的页面进行

https://cloud.projectdiscovery.io/

## yaml学习

### 基本语法

- 大小写敏感
- 使用缩进表示层次关系（和Python挺像的
- 缩进不能使用TAB制表符，只能是空格
- #表示注释
- 缩进空格数不重要，但是同一层次必须元素左对齐

#### yaml对象
对象键值对
```
简单的可以使用冒号形式
key: value冒号后面需要加一个空格
也可以使用key:{key1:value1,key2:value2}
亦或是
key:
    child-key:value
    child-key2:value2
```

对于相对比较复杂的对象格式，可以使用一个问好加一个空格表示一个
复杂的KEY，配合一个而冒号加一个空格表示一个value

```
?
  - complexkey1
  - complexkey2
:
  - complexvalue1
  - complexvalue2
```
表示对象的属性是一个数组```[complexkey1,complexkey2]```
对象的值也是要给数组```[complexvalue1,complexvalue2]```

#### yaml数组
以```-```开头表示一个数组

```
- a
- b
- c
```
YAML 支持多维数组，可以使用行内表示：
```key: [value1,value2,...]```

数据结构的子成员是一个数组，则可以在该项下面缩进一个空格
```
-
 - a
 - b
 - c

```

举一个相对比较复杂的例子
```
students:
-
  id: 1
  name: creeper
  grade: 100
-
  id: 2
  name: tenurnight
  grade: 120

```
就是流式里面的
```
students: [{id: 1,name: creeper,grade: 100},{id: 2,name: tenurnight,grade: 120}]
```

#### 复合结构
yml的复合结构

```
language:
 - python
 - javascript
 - ruby
 - go
websites:
 yaml: yaml.org
 ruby: ruby.org
 python: python.org
 go: go.org
```
其实就是json的
```
{
 language: ['python','javascript','ruby','go']
 websites:
  {
   yaml: "yaml.org"
   ruby: "ruby.org"
   python: "python.org"
   go: "go.org"
  }
}

```

#### 纯量

纯量是不可分割的，最基本的值

- 字符串
- 布尔值
- 整数
- 浮点型
- NULL
- 时间
- 日期

```例题来自菜鸟
boolean:
    - TRUE  #true,True都可以
    - FALSE  #false，False都可以
float:
    - 3.14
    - 6.8523015e+5  #可以使用科学计数法
int:
    - 123
    - 0b1010_0111_0100_1010_1110    #二进制表示
null:
    nodeName: 'node'
    parent: ~  #使用~表示null
string:
    - 哈哈
    - 'Hello world'  #可以使用双引号或者单引号包裹特殊字符
    - newline
      newline2    #字符串可以拆成多行，每一行会被转化成一个空格
date:
    - 2018-02-17    #日期必须使用ISO 8601格式，即yyyy-MM-dd
datetime:
    -  2018-02-17T15:02:31+08:00    #时间使用ISO 8601格式，时间和日期之间使用T连接，最后使用+代表时区
```

#### 引用
```
defaults: &defaults
  adapter:  postgres
  host:     localhost

development:
  database: myapp_development
  <<: *defaults

test:
  database: myapp_test
  <<: *defaults
```

相当于
```
defaults:
  adapter:  postgres
  host:     localhost

development:
  database: myapp_development
  adapter:  postgres
  host:     localhost

test:
  database: myapp_test
  adapter:  postgres
  host:     localhost

```

就是使用&建立锚点，使用<<表示合并到当前数据，*用来引用锚点

我的理解就是&就是建立一个函数
<<就是告诉你我要在这里引用
*就是调用函数

```
- &showell Steve
- Clark
- Brian
- Oren
- *showell
```
转换成js就是
```
[ 'Steve', 'Clark', 'Brian', 'Oren', 'Steve' ]
```


参考地址：
https://www.runoob.com/w3cnote/yaml-intro.html
https://www.ruanyifeng.com/blog/2016/07/yaml.html
https://www.jianshu.com/p/97222440cd08
https://daihainidewo.github.io/blog/yaml%E6%95%99%E7%A8%8B/