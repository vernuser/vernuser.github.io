---
title: 五指cms代码审计
date: 2024年9月31日
updated: 2024年9月31日
tags:
  - 代码审计
categories: 代码审计
keywords:
description: 代码审计

---

在根目录index.php中看到

![](https://pic.imgdb.cn/item/66f8e54ef21886ccc044b327.png)

其中的`./configs/web_config.php`是配置文件，`core.php`是核心框架文件

`load_class("application")`将application这个类实例化了

然后调用$app对象的run方法运行

因为是调用`load_class`加载application类，所以就是`application.class.php`

通过`load_class`来到core.php里面


![](https://pic.imgdb.cn/item/66f8e82df21886ccc047af1b.png)

里面有个`COREFRAME_ROOT`,
```
<?php
defined('WWW_ROOT') or exit('No direct script access allowed');

define('COREFRAME_ROOT',substr(dirname(__FILE__),0,-11).'coreframe'.DIRECTORY_SEPARATOR);
define('CACHE_ROOT',substr(dirname(__FILE__),0,-11).'caches'.DIRECTORY_SEPARATOR);
define('CACHE_EXT','f1q_e');
```

获取文件地址并减去最后11个字符

`COREFRAME_ROOT.'app/'.$m.'/libs/class/'.$class.'.class.php'`

这个实际上就是路径名`app目录下模块名/libs/class/类名.class.php`

实例化wuzhi_application类的时候会调用下面的构造函数将路由信息定义完成

![](https://pic.imgdb.cn/item/66f8f513f21886ccc058d92a.png)

这个是当类的实例被创建时，这个方法会自动调用

也就是说这个是

加载application类的时候，调用load_class获取application.class.php并实例化，
然后通过run获取路由信息

## sql注入

在这里存在sql漏洞

![](https://pic.imgdb.cn/item/66f90a4ff21886ccc07b2b36.png)

bp抓包

![](https://pic.imgdb.cn/item/66f90a1ff21886ccc07ad919.png)

可以定位到
`/coreframe/app/member/admin/group.php`的del()函数

![](https://pic.imgdb.cn/item/66f90f88f21886ccc082612a.png)

这里的第133行是判断groupid是否为空，134行是判断是否是数组，但是这里不管是不是他都执行了delete函数操作数据库

追踪delete函数，（我也不知道他这个追踪是怎么追踪的，我直接control f搜索delete里面好多，但是又没看到php代码审计的插件)

在`db.class.php`里面看到


![](https://pic.imgdb.cn/item/66fe4824a0d098f8981d74e6.png)

其中调用了array2sql,其中的array2sql是

![](https://pic.imgdb.cn/item/66fe49c3a0d098f8981f2334.png)

可以得出是将数组转换成sql语言并移除一些特殊符号防止sql注入

```
if(is_array($data)) {
    $sql = '';
    foreach ($data as $key => $val) {
        $val = str_replace("%20", '', $val);
        $val = str_replace("%27", '', $val);
        $val = str_replace("(", '', $val);
        $val = str_replace(")", '', $val);
        $val = str_replace("'", '', $val);
        $sql .= $sql ? " AND `$key` = '$val' " : " `$key` = '$val' ";
    }
    return $sql;
}
- 如果 $data 是一个数组，则初始化一个空字符串 $sql。
- 遍历数组，将每个键值对转换为 SQL 格式的条件。
- 使用 str_replace 函数移除一些特殊字符（如 %20, %27, (, ), '），以防止 SQL 注入。
- 将每个条件拼接成一个 SQL WHERE 子句，多个条件之间用 AND 连接。

```


只有最下面的那行
```
return $this->master_db->delete($table, $where);
```
是对数据库进行操作的

`$this->master`是对数据库进行连接的

在目录内查找delete，在`mysqli.class.php`中发现是`WUZHI_mysqli`类下的方法

```
public function __construct($config_file = 'mysql_config')
获取www/configs/mysql_config.php中mysql的配置信息
{
		$this->mysql_config = get_config($config_file);
		$this->dbname = $this->mysql_config[$this->db_key]['dbname'];
		$this->tablepre = $this->mysql_config[$this->db_key]['tablepre'];
		$this->dbcharset = $this->mysql_config[$this->db_key]['dbcharset'];

		$this->slave_server = isset($this->mysql_config[$this->db_key]['slave_server']) ? $this->mysql_config[$this->db_key]['slave_server'] : '';

		$class = $this->mysql_config[$this->db_key]['type'];
		require_once(COREFRAME_ROOT.'app/core/libs/class/'.$class.'.class.php');
		$classname = 'WUZHI_'.$class;
		$this->master_db = new $classname($this->mysql_config[$this->db_key]);
		if($this->slave_server) {
			$slave_server = weight_rand($this->slave_server);
			if($slave_server=='default') {
				$this->read_db = $this->master_db;
			} else {
				$this->read_db = new $classname($this->mysql_config[$this->slave_server]);
			}
		} else {
			$this->read_db = $this->master_db;
		}
	}

```


![](https://pic.imgdb.cn/item/66fe78a5335a200d6a9b443b.png)


在mysqli.class.php中，他没有做任何过滤直接将语句拼接到`$sql`并通过query（）执行，所以存在sql漏洞


![](https://pic.imgdb.cn/item/66fe7904335a200d6a9b891f.png)


这里可以进行报错注入

## 任意文件写入


![](https://pic.imgdb.cn/item/66ff6d72d29ded1a8c8b4be0.png)

通过seay审计发现里面有个file_put_content函数可能存在任意文件写入，进去查看发现这里是通过data内容可以控制写入文件的内容

![](https://pic.imgdb.cn/item/66ff6dd7d29ded1a8c8b9b1e.png)

![](https://pic.imgdb.cn/item/66ff6e59d29ded1a8c8c0523.png)

这phpstorm中找到他的funvtion`set_cache`

他只判断是了是否提交了表单但没对提交的内容进行过滤，这就导致`setting `参数也就是上面所说的 `$data` 部分写入造成任意文件写入

![](https://pic.imgdb.cn/item/67076359d29ded1a8c69640b.png)

如果没有提交表单，就会通过`get_cache`读取缓存文件

![](https://pic.imgdb.cn/item/67076392d29ded1a8c699bd2.png)

所以我们可以这么构造文件读写

```
/index.php?
m=attachment&f=index&v=ueditor&_su=wuzhicms&submit=XXX&setting=payload
```

## CSRF

在这里

![](https://pic.imgdb.cn/item/66ff820fd29ded1a8c9c0012.png)

当我们提交的时候发现

![](https://pic.imgdb.cn/item/66ff822dd29ded1a8c9c18e4.png)

提示了账号不存在，说明必须要一个前台账号才能设置为系统管理员账号，

![](https://pic.imgdb.cn/item/66ff84ffd29ded1a8c9ee282.png)

抓包发现添加管理员的路由，找到源码`/coreframe/app/core/admin/power.php`

```
这段代码是一个名为 add 的方法，用于添加管理员。以下是详细分析：
检查是否提交表单：
if(isset($GLOBALS['submit'])) {
检查全局变量 $GLOBALS['submit'] 是否存在，以确定是否提交了表单。
验证用户名：
if(empty($GLOBALS['form']['username'])) MSG(L('parameter error'));
$username = $GLOBALS['form']['username'];
$r = $this->db->get_one('member', array('username' => $username));
if(!$r['uid']) MSG(L('账号不存在，请先管理会员处－添加账号'));
检查表单中的 username 是否为空，如果为空则显示错误消息。
获取表单中的 username 并从 member 表中查找对应的记录。
如果找不到对应的用户 ID (uid)，则显示错误消息。
检查管理员是否已存在：
$rs = $this->db->get_one('admin', array('uid' => $r['uid']));
if($rs) MSG(L('管理员已存在！'));
从 admin 表中查找对应的用户 ID (uid)。
如果找到记录，则显示管理员已存在的消息。
准备表单数据：
$formdata = array();
$formdata['uid'] = $r['uid'];
if(empty($GLOBALS['form']['password'])) {
    $formdata['password'] = '';
} else {
    $factor = substr(random_string('md5'), 0, 6);
    $password = md5(md5($GLOBALS['form']['password']) . $factor);
    $formdata['password'] = $password;
    $formdata['factor'] = $factor;
}
$formdata['role'] = ',' . implode(',', $GLOBALS['form']['role']) . ',';
$formdata['truename'] = remove_xss($GLOBALS['form']['truename']);
初始化一个空数组 $formdata。
将用户 ID (uid) 添加到 $formdata。
检查表单中的 password 是否为空，如果为空则设置为空字符串。
如果不为空，则生成一个随机因子 (factor)，并使用 MD5 加密密码和因子。
将加密后的密码和因子添加到 $formdata。
将角色信息和真实姓名添加到 $formdata。
插入数据并显示成功消息：
$this->db->insert('admin', $formdata);
MSG(L('operation success'));
将 $formdata 插入到 admin 表中。
显示操作成功的消息。
显示添加管理员表单：
} else {
    $show_formjs = 1;
    $form = load_class('form');
    $roles = $this->db->get_list('admin_role', '', '*', 0, 100);
    include $this->template('power_add');
}
如果没有提交表单，则显示添加管理员的表单。
设置 show_formjs 为 1。
加载表单类并获取角色列表。
包含并显示 power_add 模板。
```
在代码38行处根据用户名
从数据库中取出前台账户，如果该前台用户不存在则会提示如下内容，也就是我们上面的提示，在40行代码判断该用户是否已经是管理员，而44-51行代码是判断添加管理员时是否设置密码，这部分操作在上面部分我们添加管理员的时候也可以看得出来，在代码54行将我们的内容插入到数据库中


![](https://pic.imgdb.cn/item/66ff9600d29ded1a8caede21.png)


能看出来这部分没有进行token校验或者其他手段，这就导致我们可以伪造数据包进行csrf

## 目录遍历

glob函数发现存在目录遍历，这里面的`glob()`的$`dir`参数可控,上面的18行做了一些过滤

![](https://pic.imgdb.cn/item/66ff97d7d29ded1a8cb0a8db.png)

29行通过`include $this ->template('listing')`包含并渲染旗下的`listing.tpl.php`文件

```
glob()函数返回一个包含匹配指定模式的文件名或目录的数组

语法：
glob(pattern,flags)
    pattern
    必需。规定检索模式。
    flags
    可选。规定特殊的设定。
返回值：
该函数返回一个包含有匹配文件/目录的数组。如果失败则返回 FALSE。

```

payload

```
index.php?m=template&f=index&v=listing&_su=wuzhicms
```

## 任意文件删除

全局查找危险函数unlink（删除指定文件）

发现my_unlink里面调用了这个函数

![](https://pic.imgdb.cn/item/66ff9ac3d29ded1a8cb349bb.png)

跟踪一下

其中一个位于del()函数内部，

![](https://pic.imgdb.cn/item/66ff9b1fd29ded1a8cb39675.png)


这两个地方需要传入id和url，但是通过`remove_xss`函数过滤了

![](https://pic.imgdb.cn/item/66ff9b73d29ded1a8cb3dcf6.png)

这里是对我们输入的东西进行实体编码，替换了一些文字防止` <IMG SRC=@avascript:alert('XSS')> 的攻击`，下面过滤了一些js的标签


回到del（）函数，他里面是鲜活的一个id，然后从数据库查找这个id对应的path，但是如果没有id的话会直接根据你输入的path进行文件操作，所以我们只需要构造path就可以了



![](https://pic.imgdb.cn/item/6707b1fbd29ded1a8cbd49d9.png)

![](https://pic.imgdb.cn/item/6707b154d29ded1a8cbcb023.png)

所以可以

![](https://pic.imgdb.cn/item/6707651cd29ded1a8c6b20ec.png)

至此,五指cms的审计结束
