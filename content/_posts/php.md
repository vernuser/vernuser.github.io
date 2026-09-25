---
title: PHP学习
date: 2023年7月1日13:50:12
updated: 2023年7月1日
tags:
  - php
categories: php
keywords:
description: php
---

# **php学习**

## **echo函数**

**echo是一个语言结构，使用的时候可以不用加括号，也可以加上括号、**

##### **用法**

```
echo""
echo("")
```



```php
<?
echo "<h2>这是一个PHP！<h2>";
echo("我要学php<br>");
echo "PHP很好玩<br>"
?>
```

**标准输出**

```
这是一个PHP！
我要学php
PHP很好玩
```

**在上面的语言中**

```
<br>换行
<h2>二级标题
```

**当然也可以不用这样**

```
<?php
$txt1="学习 PHP";
$txt2="RUNOOB.COM";
$cars=array("Volvo","BMW","Toyota");

echo $txt1;
echo "<br>";
echo "在 $txt2 学习 PHP ";
echo "<br>";
echo "我车的品牌是 {$cars[0]}";
?>
```

**标准输出**

```
学习 PHP
在 RUNOOB.COM 学习 PHP
我车的品牌是 Volvo
```

**array[]是数组函数**

**[Array - JavaScript | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array)**

## **print函数**

**print同样是一个语言结构，可以使用括号，也可以不使用**

**用法**

```
print""
print("")
```

**具体用法和echo一样，就不过多叙述**

## **PHP-EOF（[*heredoc*](http://www.baidu.com/link?url=2Z7us7hFWorCxCSjhpGbWyu4bidI37Qp0Q5CrhXk6rLlnwKsO72h3GE1TjfCxsE0)**

**PHP-EOF是一种定界符**

**是一种在命令行shell（如sh、csh、ksh、bash、PowerShell和zsh）和程序语言（像Perl、PHP、Python和Ruby）里定义一个字符串的方法。**

#### **条件：**

- **必须后面衔接分号，否则编译不通过**

- **EOF可以用其他的字符代替，只需要保证结束表示和开始表示一致即可**

- **结束标识必须独自占一行（即必须从行首开始，前后不能衔接多余空白*且前后不能空格**

- **开始标识可以不带引号或带单双引号，不带引号与带双引号效果一致，解释内嵌的变量和转义符号，带单引号则不解释内嵌的变量和转义符号。**

- **内容需要内嵌引号（单引号或双引号）时，不需要加转义符，本身对单双引号转义，此处相当与q和qq的用法。**

  ```
  <?php
  echo <<<EOF
  		<p>哈哈</p>
  		<p>你猜</p>
  		哈哈哈<br>
  		你猜我让你猜什么<br>
  EOF
  ?>

  ```

  **在这里的时候**

  ```
  <br>是换行的
  <p>是便是一段的
  ```

  **![202371144329.png](https://s2.loli.net/2023/07/01/LPev5w7u8BhXzga.png)**

#### **注意：**

- **以<<<EOF为开始标记开始，以EOF结束标记结束，结束标语必须顶头写，不能有任何的缩进和空格，且在结束标记末尾要有分号**

- **开始标记和结束标记相同，不局限于EOF,EOO,EOD,EOT什么的也可以，只要保证结束标记和开始标记不出现在正文中皆可以了**

- **于开始标记和结束标记之间的变量可以被正常解析，但是函数则不可以。在 heredoc 中，变量不需要用连接符 . 或 , 来拼接**

- **后面的好像解析的时候自己解析乱了了，如果想继续看的话可以转（算是光明正得的水一波自己的笔记**

- **https://note.youdao.com/s/74MKWr93**

- ```
  <?php
  $a="歪比";
  $name= <<<EOF
  	"abc"$a
  	"123"<br>
  EOF;

  echo $name;
  ?>
  ```

  **![202371144653.png](https://s2.loli.net/2023/07/01/IyLY5JsgKfHeDZE.png)**

## **PHP数据类型**

**PHP变量存储不同的数据类型，支持**

- **String（字符串）**
- **Integer（整型）**
- **Float（浮点型）**
- **Boolean（布尔型）**
- **Array（数组）**
- **Object（对象）**
- **NULL（空值）**
- **Resource（资源类型）**

#### **PHP字符串**

**一个字符串就是一串字符的序列**

```
<?php
$x = "Helloworld!";
echo $x;
echo "<br>";
$x = 'Helloworld!';
echo $x;
?>
```

**标准输出**

```
Helloworld!
Helloworld!
```

#### **PHP整型**

**没有小数点的整数**

- **整数必须至少有一个数字 (0-9)**
- **整数不能包含逗号或空格**
- **整数是没有小数点的**
- **整数可以是正数或负数**
- **整型可以用三种格式来指定：十进制， 十六进制（ 以 0x 为前缀）或八进制（前缀为 0）。**

```
<?php
$x = 5985;
var_dump($x);
echo "<br>";
$x = -345; // 负数
var_dump($x);
echo "<br>";
$x = 0x8C; // 十六进制数
var_dump($x);
echo "<br>";
$x = 047; // 八进制数
var_dump($x);
?>
```

**var_dump（）函数打印输入的字符和其数据类型，**

```
int(5985)
int(-345)
int(140)
int(39)
```

**上面四种都是int所以都输出int**

```
<?php
$b = 3.1;
$c = true;
var_dump($b, $c);
?>
```

```
float(3.1) bool(true)
```

#### **PHP 浮点型**

**浮点数是带小数部分的数字，或是指数形式。**

**具体来说和上面的整型差不多**

#### **PHP布尔型**

**布尔型就是TRUE和FALSE**

**布尔型常用语条件判断**

#### **PHP数组**

**数组可以在一个变量中存储多个值**

```
<?php
$cars=array("Volvo","BMW","Toyota");
var_dump($cars);
?>
```

```
array(3) { [0]=> string(5) "Volvo" [1]=> string(3) "BMW" [2]=> string(6) "Toyota" }

```

**这里的话应该是array数组类型，里面存有三个值，**

**【0】位置也就是正常的第一个里面是一个有五个字符的字符串volvo，**

**以此类推**

#### **PHP对象**

**对象数据类型也可以用于存储数据**

**在PHP中，对象必须声明**

**首先你要用class函数声明类对象。类是可以包含属性和方法的结构。**

**然后定义数据类型并在实例化的类中使用数据类型。**

```
<?php
class Car
{
    var $color;
    function __construct($color="green") {
      $this->color = $color;
    }
    function what_color() {
      return $this->color;
    }
}

function print_vars($obj) {
   foreach (get_object_vars($obj) as $prop => $val) {
     echo "\t$prop = $val\n";
   }
}

// 实例一个对象
$herbie = new Car("white");

// 显示 herbie 属性
echo "\therbie: Properties\n";
print_vars($herbie);

?>

</body>
</html>
```

```
class：定义一个类。
Car：类名为 Car。
var：定义一个变量。
$color：一个名为 $color 的变量。
__construct：构造函数，用于创建类的实例时自动执行的方法。
function：定义一个函数。
what_color：函数名为 what_color。
return：函数返回值的关键字。
$this：指向当前对象的引用。
print_vars：函数名为 print_vars。
$obj：一个名为 $obj 的变量。
foreach：循环结构用于遍历数组或对象的每个元素。
get_object_vars：返回对象的属性和值的关联数组。
$prop：一个在循环过程中用来存储属性名的变量。
$val：一个在循环过程中用来存储属性值的变量。
echo：输出函数用于打印文本。
new：创建一个新的对象实例。
Car("white")：用 Car 类创建一个新的对象，并将颜色参数设置为 “white”。
herbie：变量名为 herbie。
Properties：文本字符串 " Properties"。
print_vars($herbie)：调用 print_vars 函数，并将 herbie 传递给它作为参数。
```

**测试结果**

```
herbie: Properties color = white
```

#### **PHP-NULL值**

**NULL表示变量没有值。NULL是数据类型为NULL的值。**

**NULL值表示一个变量是否为空值。同样可以用于数值空值和NULL值的区别。**

**可以通过设置变量值为NULL来清空变量数据。**

```
<?php
$x="Hello world!";
$x=null;
var_dump($x);
?>
```

**测试结果**

```
NULL
```

#### **PHP资源类型**

**PHP 资源 resource 是一种特殊变量，保存了到外部资源的一个引用。**

**常见资源数据类型有打开文件、数据库连接、图形画布区域等。**

**由于资源类型变量保存有为打开文件、数据库连接、图形画布区域等的特殊句柄，因此将其它类型的值转换为资源没有意义。**

**使用 get_resource_type() 函数可以返回资源（resource）类型：**

**get_resource_type(resource $handle): string**
**此函数返回一个字符串，用于表示传递给它的 resource 的类型。如果参数不是合法的 resource，将产生错误。**

**简单来说,php资源类型变量就是用来打开文件、数据库连接、图形化部区域等的一种特殊变量。**

## **PHP类型比较**

**PHP是弱类型语言，但是也要进行比较**

**松散比较：==的比较，只比较值不比较类型**

**严格比较：===的比较，比较值和类型**

```
<?php
if(66=="66"){
	echo "1.值相等";
}
echo PHP_EOL;

if(66==="66"){
	echo "2.类型相等";
}else{
	echo"3.类型不相等";
}
?>
```

**这里面的PHP_EOL是换行符，后面应该会写的**

**测试结果**

```
1.值相等 3.类型不相等
```

**PHP中比较0、false、null**

```
<?php
echo '0 == false: ';
var_dump(0 == false);
echo '0 === false: ';
var_dump(0 === false);
echo PHP_EOL;
echo '0 == null: ';
var_dump(0 == null);
echo '0 === null: ';
var_dump(0 === null);
echo PHP_EOL;
echo 'false == null: ';
var_dump(false == null);
echo 'false === null: ';
var_dump(false === null);
echo PHP_EOL;
echo '"0" == false: ';
var_dump("0" == false);
echo '"0" === false: ';
var_dump("0" === false);
echo PHP_EOL;
echo '"0" == null: ';
var_dump("0" == null);
echo '"0" === null: ';
var_dump("0" === null);
echo PHP_EOL;
echo '"" == false: ';
var_dump("" == false);
echo '"" === false: ';
var_dump("" === false);
echo PHP_EOL;
echo '"" == null: ';
var_dump("" == null);
echo '"" === null: ';
var_dump("" === null);
```

**测试输出**

```
0 == false: bool(true)
0 === false: bool(false)

0 == null: bool(true)
0 === null: bool(false)

false == null: bool(true)
false === null: bool(false)

"0" == false: bool(true)
"0" === false: bool(false)

"0" == null: bool(false)
"0" === null: bool(false)

"" == false: bool(true)
"" === false: bool(false)

"" == null: bool(true)
"" === null: bool(false)
```

**PHP中比较图**

**https://www.runoob.com/wp-content/uploads/2019/05/xxxxphp.png**

## **PHP常量**

**常量是一个简单值的标识符，该数值在脚本中不能改变**

**一个常来那个使用英文字幕，下划线和数字组成，但数字不能作为首字母出现。（常量名不需要加 $ 修饰符)。**

**常量在整个脚本中都可以使用。**

**语法**

```
bool define ( string $name , mixed $value [, bool $case_insensitive = false ] )
```

- **name：必选参数，常量名称，即标志符。**

- **value：必选参数，常量的值。**

- **case_insensitive ：可选参数，如果设置为 TRUE，该常量则大小写不敏感，默认是大小写敏感的。**

  **注意：自 PHP 7.3.0 开始，定义不区分大小写的常量已被弃用。从 PHP 8.0.0 开始，只有 false 是可接受的值，传递 true 将产生一个警告。**



```
<?php
define("aha","有意思捏");
echo aha;
echo '<br>';
echo greeting；
?>
```

**这里的话定义了一个常量aha=有意思捏**

**greeting没有被定义应该会给出警告但还是会出现**

**测试结果**

```
有意思捏

Warning: Use of undefined constant greeting； - assumed 'greeting；' (this will throw an Error in a future version of PHP) in D:\Ctf\phpStudy_64\phpstudy_pro\WWW\php\测试.php on line 5
greeting；
```

#### **常量一经定义就是全局的**

```
<?php
define("GREETING", "欢迎访问 Runoob.com");

function myTest() {
    echo GREETING;
}

myTest();    // 输出 "欢迎访问 Runoob.com"
?>
```

```
欢迎访问 Runoob.com
```

## **PHP字符串变量**

**字符串变量用来包含有字符串的值**

**在创建字符串之后，我们就可以对其进行操作，直接使用或者存储起来。**

```
<?php
$txt="Hello World";
echo $txt;
?>
```

**测试输出:**

```
Hello World
```

#### **PHP并置运算符**

**并置运算符.将两个字符串值连接起来**

```
<?php
$txt1="Hello World";
$txt2="hello 个锤子";
echo $txt1 . " " . $txt2;
?>
```

**测试输出**

```
Hello World hello 个锤子
```

#### **PHP strlen()函数**

**strlen函数返回字符串的长度（字节数）**

```
<?php
$txt1="Hello World<br>";
$txt2="hello 个锤子<br>";
echo $txt1 . " " . $txt2;
echo strlen($txt1);
?>
```

**测试输出**

```
Hello World
hello 个锤子
15
```

#### **PHP strpos函数**

**strpos函数用于在字符串中查找一段指定的文本或者一个字符**

**如果找到了就会返回第一个匹配的字符位置。如果没找到就会返回FALSE**

```
<?php
$txt1="Hello World<br>";
$txt2="hello 个锤子<br>";
echo strpos($txt1,$txt2);

?>
```

**测试结果**

```

```

**（上面没有忘了写，就是空白**

## **PHP运算符**

#### **PHP算术运算符**

**+-*/%加减乘除取余**

**-x设置负数和取反**

```
<?php
$x=100;
$y=6;
echo($x+$y);
echo("<br>");

echo($x-$y);
echo("<br>");


echo($x*$y);
echo("<br>");


echo($x/$y);
echo("<br>");


echo($x%$y);
echo("<br>");


echo(-$y);
?>
```

**测试输出**

```
106
94
600
16.666666666667
4
-6
```



#### **PHP 赋值运算符**

**在 PHP 中，基本的赋值运算符是 =。它意味着左操作数被设置为右侧表达式的值。也就是说，$x = 5 的值是 5。**

#### **PHP 递增/递减运算符**

| **运算符** | **名称**   | **描述**                |
| :--------- | :--------- | :---------------------- |
| **++ x**   | **预递增** | **x 加 1，然后返回 x**  |
| **x ++**   | **后递增** | **返回 x，然后 x 加 1** |
| **-- x**   | **预递减** | **x 减 1，然后返回 x**  |
| **x --**   | **后递减** | **返回 x，然后 x 减 1** |

#### **PHP 比较运算符**

**比较操作符可以比较两个值：**

| **运算符**  | **名称**       | **描述**                                           | **实例**               |
| :---------- | :------------- | :------------------------------------------------- | :--------------------- |
| **x == y**  | **等于**       | **如果 x 等于 y，则返回 true**                     | **5==8 返回 false**    |
| **x === y** | **绝对等于**   | **如果 x 等于 y，且它们类型相同，则返回 true**     | **5==="5" 返回 false** |
| **x != y**  | **不等于**     | **如果 x 不等于 y，则返回 true**                   | **5!=8 返回 true**     |
| **x <> y**  | **不等于**     | **如果 x 不等于 y，则返回 true**                   | **5<>8 返回 true**     |
| **x !== y** | **不绝对等于** | **如果 x 不等于 y，或它们类型不相同，则返回 true** | **5!=="5" 返回 true**  |
| **x > y**   | **大于**       | **如果 x 大于 y，则返回 true**                     | **5>8 返回 false**     |
| **x < y**   | **小于**       | **如果 x 小于 y，则返回 true**                     | **5<8 返回 true**      |
| **x >= y**  | **大于等于**   | **如果 x 大于或者等于 y，则返回 true**             | **5>=8 返回 false**    |
| **x <= y**  | **小于等于**   | **如果 x 小于或者等于 y，则返回 true**             | **5<=8 返回 true**     |

#### **PHP 逻辑运算符**

| **运算符**   | **名称** | **描述**                                         | **实例**                                 |
| :----------- | :------- | :----------------------------------------------- | :--------------------------------------- |
| **x and y**  | **与**   | **如果 x 和 y 都为 true，则返回 true**           | **x=6 y=3 (x < 10 and y > 1) 返回 true** |
| **x or y**   | **或**   | **如果 x 和 y 至少有一个为 true，则返回 true**   | **x=6 y=3 (x==6 or y==5) 返回 true**     |
| **x xor y**  | **异或** | **如果 x 和 y 有且仅有一个为 true，则返回 true** | **x=6 y=3 (x==6 xor y==3) 返回 false**   |
| **x && y**   | **与**   | **如果 x 和 y 都为 true，则返回 true**           | **x=6 y=3 (x < 10 && y > 1) 返回 true**  |
| **x \|\| y** | **或**   | **如果 x 和 y 至少有一个为 true，则返回 true**   | **x=6 y=3 (x==5 \|\| y==5) 返回 false**  |
| **! x**      | **非**   | **如果 x 不为 true，则返回 true**                | **x=6 y=3 !(x==y) 返回 true**            |

#### **PHP 数组运算符**

| **运算符**  | **名称**   | **描述**                                                     |
| :---------- | :--------- | :----------------------------------------------------------- |
| **x + y**   | **集合**   | **x 和 y 的集合**                                            |
| **x == y**  | **相等**   | **如果 x 和 y 具有相同的键/值对，则返回 true**               |
| **x === y** | **恒等**   | **如果 x 和 y 具有相同的键/值对，且顺序相同类型相同，则返回 true** |
| **x != y**  | **不相等** | **如果 x 不等于 y，则返回 true**                             |
| **x <> y**  | **不相等** | **如果 x 不等于 y，则返回 true**                             |
| **x !== y** | **不恒等** | **如果 x 不等于 y，则返回 true**                             |

#### **三元运算符**

**另一个条件运算符是"?:"（或三元）运算符 。**

##### **语法格式**

```
(expr1) ? (expr2) : (expr3)
```

**对 expr1 求值为 TRUE 时的值为 expr2，在 expr1 求值为 FALSE 时的值为 expr3。**

**自 PHP 5.3 起，可以省略三元运算符中间那部分。表达式 expr1 ?: expr3 在 expr1 求值为 TRUE 时返回 expr1，否则返回 expr3。**

#### **组合比较符(PHP7+)**

**PHP7+ 支持组合比较符（combined comparison operator）也称之为太空船操作符，符号为 <=>。组合比较运算符可以轻松实现两个变量的比较，当然不仅限于数值类数据的比较。**

**语法格式如下：**

```
$c = $a <=> $b;
```

**解析如下：**

- **如果 $a > $b, 则 $c 的值为 1。**
- **如果 $a == $b, 则 $c 的值为 0。**
- **如果 $a < $b, 则 $c 的值为 -1。**

#### **运算符优先级**

**下表按照优先级从高到低列出了运算符。同一行中的运算符具有相同优先级，此时它们的结合方向决定求值顺序。**

**说明：左 ＝ 从左到右，右 ＝ 从右到左。**

| **结合方向** | **运算符**                                                   | **附加信息**                 |
| :----------- | :----------------------------------------------------------- | :--------------------------- |
| **无**       | **clone new**                                                | **clone 和 new**             |
| **左**       | **[**                                                        | **array()**                  |
| **右**       | **++ -- ~ (int) (float) (string) (array) (object) (bool) @** | **类型和递增／递减**         |
| **无**       | **instanceof**                                               | **类型**                     |
| **右**       | **!**                                                        | **逻辑运算符**               |
| **左**       | *** / %**                                                    | **算术运算符**               |
| **左**       | **+ – .**                                                    | **算术运算符和字符串运算符** |
| **左**       | **<< >>**                                                    | **位运算符**                 |
| **无**       | **== != === !== <>**                                         | **比较运算符**               |
| **左**       | **&**                                                        | **位运算符和引用**           |
| **左**       | **^**                                                        | **位运算符**                 |
| **左**       | **\|**                                                       | **位运算符**                 |
| **左**       | **&&**                                                       | **逻辑运算符**               |
| **左**       | **\|\|**                                                     | **逻辑运算符**               |
| **左**       | **? :**                                                      | **三元运算符**               |
| **右**       | **= += -= *= /= .= %= &= \|= ^= <<= >>= =>**                 | **赋值运算符**               |
| **左**       | **and**                                                      | **逻辑运算符**               |
| **左**       | **xor**                                                      | **逻辑运算符**               |
| **左**       | **or**                                                       | **逻辑运算符**               |
| **左**       | **,**                                                        | **多处用到**                 |

## IF-ELSE

if 语句：在条件成立时执行代码

if...else语句：在条件成立时执行一块代码，条件不成立时执行另一块

if...else...else语句：在若干条件之一成立时执行一个代码块

switch语句：在若干条件之一成立时执行一个代码块

#### if语句

```
if (条件)
{
条件成立时执行的代码;
}
```

#### if-else语句

```
if (条件)
{
条件成立时执行的代码;
}
else
{
条件不成立实质性的代码;
}
```

#### if-elseif-else语句

```
if (条件)
{
    if 条件成立时执行的代码;
}
elseif (条件)
{
    elseif 条件成立时执行的代码;
}
else
{
    条件不成立时执行的代码;
}
```

## switch语句

有选择的执行若干代码块之一

```
<?php
switch(n)
{
case label1:
	执行的语句
	break;
case label2:
	执行的语句
	break;
	default:
	如果 n 既不等于 label1 也不等于 label2，此处代码将执行;
}
?>
```

## PHP数组

在PHP中，array()函数用来创建数组：

在PHP中，有三种类型的数组：

- 数值数组-带有数字ID的数组
- 关联数组-带有指定的键的数组，每个键关联一个值
- 多维数组-包含一个或者多个数组 的数组
