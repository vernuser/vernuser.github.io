---
title: 'Python:从入门到入土---变量和基本数据类型'
date: 2023年3月19日
tags:
  - python
categories: python
keywords:
description: python 变量
---
###### 第一个python代码

无疑是永远の
    ·Hello,world
与C语言不同の是，python使用の是print而非printf,其次，python中不需要像C语言那样频繁地输入;结束，Python中换行即是结束语句
运行

```
print("Hello,world")
```

输出の结果就是

```
Hello,world
```

当然你也可以选择设置一个变量来指向“Hello,world”这个值
比如

```
message="Hello,world"
print("message")
```

运行这个程序就会输出

```
Hello,world
```

下面来拓展这个程序：使得message指向另外一个值

```
·message = hello world
·print("message")
·message = goodbye world
 ·print("message")
```

这样の话就会打印输出两行

```
hello world
goodbye world
```

在程序中可以随时修改变量の值，但是python将始终记录变相の最新值

###### 变量的使用和命名原则

变量的使用，需要遵循一些原则

> 变量名只能包含数字，下划线，字母。变量名只能以字母或者下划线打头，但不能以数字打头。
>
> 例如：
>
> 你可以以message_1为变量名，但是你不可以以1_message为变量名
>
> 变量名不可以是空格，需要用到的时候以下划线来分割其中的单词
>
> 例如：
>
> message_1是可以的，但是message 1是不可行的
>
> 有些Python关键字和函数名是不鞥用作变量名的，查询的话是使用
>
> ```
> import keyword
> print(keyword.kwlist)
> print(len(keyword.kwlist))
> ```

###### 字符串

字符串就是一连串的字符。在Pyhthon中，用括号括起来的都是字符串，

“this is a string”

'this is also a string'

###### 方法：Python对数据进行的操作

例如：

```
name = "anaconda"
print(name.title())
```

这个语句的输出就是

```
anaconda
```

其中title()就是方法，而name后面的.就是让Pyhon对变量name执行方法title（）指定的操作

方法title()已首字母大写的方式显示每个单词，即将每个单词的首字母都大写（所以叫title标题么）

此外还有几个大小写处理方法

.upper()全字母大写

.lower()全字母小写

在字符串中使用变量

```
first_name = "ada"
lase_name = "lovelace"
full_name = f"{first_name}{last_name}"
print(full_name)
```

要在字符串中插入变量的值，可在牵引号前加入字母f，再将要插入的变量放在花括号内。这种字符串称之为f（format）字符串

上述代码输出结果如下

```
ada lovelace
```

比如

```
first_name = "ada"
lase_name = "lovelace"
full_name = f"{first_name}{last_name}"
print(f"hello,{full_name.title()}!")
```

上述语句会变成一段友好的问候

```
hello,Ada Lovelace!
```

当然，还可以将整个这一段赋值给一个变量，zheyangdehuazuihouzaiprint调用的话时候会简单很多

###### 制表符或者换行符来添加空白

```
print("language:\n\ttPyhton\n\tC\n\tJavaScript")
	输出结果如下
	language:
		Python
		C
		JavaScript
```

###### 删除空白

```
>>>favorite_language = "Pyhotn "
>>>favorite_language
”python “
>>>favorite_language = "Pyhotn "
>>>favorite_language.rstrip()
”python“
```

但是这种删除只是短暂的，当你再次访问这个favorite_language的变量的值的时候，可看见末尾的空格。

要永久的删除这个地方的空白，就要将删除操作的结果关联到变量

```
>>>favorite_language = "Pyhotn "
>>>favorite_language = favorite_language.rstrip()
>>>favorite_language
"python"
```

当然，你还可以删除开头的空白

```
>>>favorite_language = " Pyhotn "
》》》favorite_language.lstrip()
"Python "
```

###### 使用字符串的时候要避免语法错误

比如

```
message = 'Python's strength is its diverse community'
```

这是一个错误的，单引号之内不能有单引号，但是双引号可以

```
message = “Python's strength is its diverse community”
```

整数Int浮点数float也和C语言一样，这里就不多说了

有一点，整数不管怎么和浮点数运算，结果永远是浮点数。

书写很大的整数的时候，可以用_来进行分割，当你打印这种使用下划线定义的数的时候，Python不会打印其中的下划线

###### 同时给过个变量赋值

```
x,y,z=0,1,2
```

这样的话x=0,y=1,z=2

同时复制的话记得中间用,隔开就行

在python中，要指出特定的变量为常亮可已将其全部大写，方便辨认。

###### 注释

#跟C语言的/一样性质