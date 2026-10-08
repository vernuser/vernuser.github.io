---
title: Python:从入门到入土---基础合集（变量·列表·字典·函数·类）
date: 2023年3月29日
tags:
  - python
categories: python
description: Python 基础学习笔记合集：按学习顺序整理变量与基本数据类型、列表、字典、函数与类五个部分，附示例代码与踩坑记录。
---

Python 基础学习笔记合集：按学习顺序整理变量与基本数据类型、列表、字典、函数与类五个部分，附示例代码与踩坑记录。

> 本篇由 5 篇内容相近的笔记合并整理，**安排如下**（按时间顺序）：

1. **Python:从入门到入土---变量和基本数据类型**（2023年3月19日）
2. **Python:从入门到入土---列表**（2023年3月20日）
3. **Python--从入门到入土--字典**（2023年3月24日）
4. **Pyhton--从入门到入土---函数**（2023年3月27日）
5. **Python--从入门到入土--类**（2023年3月29日）

---

# 1. Python:从入门到入土---变量和基本数据类型（2023年3月19日）

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

---

# 2. Python:从入门到入土---列表（2023年3月20日）

###### 列表是什么？

列表由一些列按照特定顺序排列而成的元素。

在Python中，由[]表示列表，并用“，”分隔开其中的元素

```
bicycle = ['trek','cannondale','redline']
print(bicycle)
```

这样的话会打印

```
['trek','cannondale','redline']
```

没错，他会连着【】一块打印下来，没想到吧

###### 访问列表元素

列表式有序集合，所以要访问列表式只需要将该元素的索引告诉Python就好。

例如

```
bicycle = ['trek','cannondale','redline']
print(bicycle[0])
```

当你请求访问列表元素时，Python只会返回该元素，而不包括【】

```
trek
```

当然你也可以使用之前学习过的方法

```
bicycle = ['trek','cannondale','redline']
print(bicycle[0].title())
```

这样的话会输出

```
Trek
```

值得一提的是

索引是从0开始而并不是1开始

在Python中，第一个列表元素的索引为0而不是1.(这一点 就跟C语言的数组那块一样，都是从0开始的)

```
bicycle = ['trek','cannondale','redline']
print(bicycle[1])
print(bicycle[2])
```

```
cannondale
redline
```

当你想要倒过来访问列表的时候，Python会提供给你一种特殊的语法。通过将索引定位为-1，可让Python返回最后一个列表元素：

```
bicycle = ['trek','cannondale','redline']
print(bicycle[-1])
```

```
redline
```

##### 修改添加和删除元素

###### 修改

很简单，用索引定位就好

```
bicycle = ['trek','cannondale','redline']
print(bicycle)
bicycle[0] = 'baba'
print(bicycle)
```

```
['trek','cannondale','redline']
['baba','cannondale','redline']
```

###### 添加

在列表未添加元素

```
.append
```

这是一个很神奇的东西，他可以让你在列表的末尾添加元素

```
bicycle = ['trek','cannondale','redline']
print(bicycle)
bicycle.append = ('ca')
print(bicycle)
```

```
'trek','cannondale','redline'
'trek','cannondale','redline''ca'
```

当然，如果你足够闲得无聊，你也来可以尝试

```
name = []
name.append=('zgh')
nmae.append=('cjy')
nmae.append=('czm')
nmae.append=('dyf')
nmae.append=('czh')
print(name)
```

```
['cgh','cjy','czm','dlf','czh']
```

有了在末尾添加当然就有在中间添加了

```
bicycle = ['trek','cannondale','redline']
print(bicycle)
bicycle.insect = (1,'ca')
print(bicycle)
```

```
'trek','cannondale','redline'
'trek','ca','cannondale','redline'
```

###### 删除

```
bicycle = ['trek','cannondale','redline']
print(bicycle)
del bicycle[0]
print(bicycle)
```

```
'trek','cannondale','redline'
'cannondale','redline'
```

使用del可以无线删除，当然，前提是你知道这个元素在Python中的索引值

###### 当然你也可以使用方法pop()删除

（我感觉这个列表就像一个栈，pop使用就像弹出这个栈顶）

```
bicycle = ['trek','cannondale','redline']
print(bicycle)
outdate = bicycle.pop()
print(bicycle)
print(outdate)
（这一块本来我打算用popped的，但@一般路过小辉夜给了更好的建议，所以就用outdata了）
```

```
'trek','cannondale','redline'
‘trek’'cannondale'
'redline'
```

###### 弹出任何位置的元素

其实吧，pop这个东西不知能删除最后一个元素，你只要在括号里面填写你想要的元素的索引，他都能给你弹出来

```
bicycle = ['trek','cannondale','redline']
print(bicycle)
outdate = bicycle.pop(1)
print(bicycle)
print(outdate)
```

```
'trek','cannondale','redline'
'trek,'redline'
'cannondale'
```

需要注意的是，当你弹出元素的时候，这个元素就不在列表中了

根据特定的值删除

```
bicycle = ['trek','cannondale','redline']
print(bicycle)
bicycle.remove('cannondale')
print(bicycle)
```

```
['trek','cannondale','redline']
['trek',redline']
```

使用remove的时候也可以照常使用这个值

```
bicycle = ['trek','cannondale','redline']
print(bicycle)
abb = 'cannondale'
bicycle.remove('cannondale')
print(f"{abb.title()}")
```

```
['trek', 'cannondale', 'redline']
Cannondale
```

###### 组织列表

sort（）

###### 使用sort（）可以将列表进行用就行排序（这个是按照字母进行排序的）

```
bicycle = ['trek','cannondale','redline']
bicycle.sort()
print(bicycle)
```

```
['cannondale','redline','trek']
```

当你要逆字母方向时，需要

```
bicycle = ['trek','cannondale','redline']
bicycle.sort(reverse = True)
print(bicycle)
```

```
['trek', 'redline', 'cannondale']
```



###### 使用sorted函数进行临时性的排序

```
bicycle = ['trek','cannondale','redline']
print(bicycle)
print(sorted(bicycle))
print(bicycle)
```

```
['trek', 'cannondale', 'redline']
['cannondale', 'redline', 'trek']
['trek', 'cannondale', 'redline']
```



###### 倒着打印列表

```
bicycle = ['trek','cannondale','redline']
print(bicycle)
bicycle.reverse()
print(bicycle)
```

```
['trek', 'cannondale', 'redline']
['redline', 'cannondale', 'trek']
```

###### 确定列表长度

```
>>>bicycle = ['trek','cannondale','redline']
>>>len(bicycle)
3
```
### 遍历整个列表

##### for循环

```
people = ['ann','bee','c++','dev--c']
for person in people:
	print(person)
```

```
ann
bee
c++
dev--c
```

需要注意的是：

Python中的for循环与C语言中的不一样，C语言中的是

for(中间是循环条件)

但Python的是for (临时变量) in （列表）

而且需要注意的是，Python每次运行循环的时候需要注意在后面添加一个:，这在C语言中是不层出现过的，C语言中，for后面不需要加任何的标点符号。

##### 在for循环中进行更多的操作，比如说

```
people = ['ann','bee','c++','dev--c']
for person in people:
	print(f“{person.title()},you are a good man")
	print(f"i can't meet a better man than you,f{person.title()}")
```

```
Ann,you are a good man
i can't meet a better man than you,Ann
Bee,you are a good man
i can't meet a better man than you,Bee
C++,you are a good man
i can't meet a better man than you,C++
Dev--C,you are a good man
i can't meet a better man than you,Dev--C
```

在for循环中，想要包含多少行代码都是可以的，实际上，你会发现使用for循环对每个元素执行众多不同的操作很有用

###### 注意事项：（一股子翻译腔味道）

1. 注意缩进，切记注意，你永远不知道你会犯下什么样的错误直到有人指出来
2. 注意标点符号，注意冒号，这很重要，你知道的

##### 创建数值列表

###### 使用函数range

```
for value in range(1,5):
	print(value)
```

```
1
2
3
4
```

没错，range(1,5)只打印了1-4，这回死编程语言中常见的差一行为的结果，函数range（）让python从指定的第一个值开始数，并在到达你指定的第二个值时停止。这就是他不输出5的原因。当然，如果你执意要打印1-5，只需要输入range(1,6)

###### 使用range创建数值列表

```
>>>number = list(range(1,6))
>>>print(number)
```

```
[1, 2, 3, 4, 5]
```

需要注意的是，上面的list后面使用的实施（）而不是【】，如果你使用【】的话，那就是输出

```
list[range(1, 6)]
```

使用range时还可以指定步长，比如

```
number = list(range(2,11,2))
print(number)
```

```
[2, 4, 6, 8, 10]
```

使用range（）几乎能够创建任何需要的数集。

```
squares = []
for value in range(1,11):
	square = value ** 2
	squares.append(square)
print(squares)
```

```
[1, 4, 9, 16, 25, 36, 49, 64, 81, 100]
```

可以小小的进行优化

```
squares = []
for value in range(1,11):
	squares.append(square**2)
print(squares)
```

```
[1, 4, 9, 16, 25, 36, 49, 64, 81, 100]
```

当然,python中也有一些库函数可以方便你运算

```
digits = [1,2,3,4,5,6,7,8,9]
print(min(digits))
print(max(digits))
print(sum(digits))
```

```
1
9
45
```

值得注意的是，这里的digits不能使用for循环，原因是不能迭代

###### 列表解析

```
squares = [value**2 for value in range(1,11)]
print(squares)
```

```
[1, 4, 9, 16, 25, 36, 49, 64, 81, 100]
```

这个列表中的意思是首先制定一个描述性的列表名squares，然后制定一个左方括号，并且定义一个表达式，用于生成要存储到列表中的值，接下来，编写一个for循环，用于给表达式提供值，在加上右方括号。

##### 使用列表的一部分

###### 切片

```
player = ['ann','bee','c++','dev']
print(player[0:2])
```

```
['ann', 'bee']
```

上述语言中[:]分号是到的意思，比如说0:2是索引为0的数到索引为1的数的，[1:]是索引为1的数到末尾的，[:2]是索引为0的数到索引为2 的数

当然，如果你要输出在结尾附近的，你可以用这样的形式[-3:]

当然，列表也是可以遍历和复制的

##### 元组

元组看起来很像列表，但其实是不一样的，元组使用的是圆括号而不是方括号

需要注意的是Python是禁止修改元组的值的

所以要想修改元组的值，只能从头重新定义一个元组。

---

# 3. Python--从入门到入土--字典（2023年3月24日）

```
alien_0 = {'color':'green','points':5}
print(alien_0['color'])
print(alien_0['points'])
```

```
green
5
```

###### 这就是一个简单的字典

在Python中，字典是一系列键值对。每个键都有一个值相互关联

###### 访问字典中的值

```
alien_0 = {'color':'green','points':5}
new_point=alien_0['points']
print(f"you have killed {new_point} alien")
```

```
you have killed 5alien
```

###### 添加键值对

```
alien_0 = {'color':'green','points':5}
print(alien_0)
alien_0['x_position']=0
alien_0['y_position']=0
print(alien_0)
```

```
{'color': 'green', 'points': 5}
{'color': 'green', 'points': 5, 'x_position': 0, 'y_position': 0}
```

###### 修改字典中的值

```
alien_0={'color':'green'}
print(alien_0)
alien_0['color']='yellow'
print(f"now it's {alien_0}")
```

```
{'color': 'green'}
now it's {'color': 'yellow'}
```

###### 删除字典中的键值对

```
alien_0={'color':'green','point':5}
print(alien_0)
del alien_0['color']
print(alien_0)
```

```
{'color': 'green', 'point': 5}
{'point': 5}
```

###### 来一个大家伙

```
favorite_language ={
	'edward':'rudy',
	'jen':'python',
	'phil':'python',
	'sarah':'c',
	}
language = favorite_language['sarah'].title()
print(f"sarah's favorite language is {language}")
```

```
sarah's favorite language is C
```

###### 使用方法get来访问值

get（）方法的第一个参数用于指定值，第二个参数为指定的键不存在的时候要返回的值，可省略

```
alien_0 = {'color':'green','speed':'slow'}
point_value = alien_0.get('color','0_o')
print(point_value)
```

```
green
```

但是如果我换一个数值呢

```
alien_0 = {'color':'green','speed':'slow'}
point_value = alien_0.get('spend','0_o')
print(point_value)
```

```
0_o//(好一个杰西卡)
```

###### 遍历字典

```
user = {
	'username': 'admin',
	'first':'enrico',
	'last':'fermi'
}
for key,value in user.items():
	print(f"\nkey:{key}")
	print(f"vale:{value}")
```

```
key:username
vale:admin

key:first
vale:enrico

key:last
vale:fermi
```

这里不是使用keys()和values()方法，只是设了两个局部变量使得key=键，value等于值而已

item（）方法返回一个键值对列表

```
from builtins import print

favorite_languages = {
    'edward': 'rudy',
    'jen': 'python',
    'phil': 'python',
    'sarah': 'c',
}
friends = ['sarah','jen']               //这里的“，”很关键，这是分隔开两个的，										   如果没有的话会默认两个连接在一起输出
for name in favorite_languages.keys():
    print(f"{name.title()}")

    if name in friends:
        language = favorite_languages[name].title()
        print(f"{name.title()},i know you like {language}")
```

```
Edward
Jen
Jen,i know you like Python
Phil
Sarah
Sarah,i know you like C

```

key()方法：返回一个字典所有的键。

###### 按照特定顺序来遍历字典中的所有键

```
from builtins import print

favorite_languages = {
    'jen': 'python',
    'phil': 'python',
    'edward': 'rudy',
    'sarah': 'c',
}
for name in sorted(favorite_languages.keys()):
    print(f"{name.title()},thanks for you ")
```

```
Edward,thanks for you
Jen,thanks for you
Phil,thanks for you
Sarah,thanks for you
```

set()可以找出独一无二的元素

```
from builtins import print

favorite_languages = {
    'jen': 'python',
    'phil': 'python',
    'edward': 'rudy',
    'sarah': 'c',
}
for language in set(favorite_languages.values()):
    print(f"{language.title()}")
```

```
Rudy
Python
C
```

keys() 方法用于返回字典中的所有键；values() 方法用于返回字典中所有键对应的值

###### 嵌套

```
alien_00={'color':'green','points':5}
alien_01={'color':'blue','points':6}
alien_02={'color':'red','points':9}
alien_03={'color':'yellow','points':7}
aliens=[alien_00,alien_01,alien_02,alien_03]
for alien in aliens:
	print(alien)
```

```
{'color': 'green', 'points': 5}
{'color': 'blue', 'points': 6}
{'color': 'red', 'points': 9}
{'color': 'yellow', 'points': 7}
```

大量使用

```
aliens = []
for alien_number in range(20):
	new_alien = {'color':'green','point':5}
	aliens.append(new_alien)

for alien in aliens[:3]:
	if alien['color']=='green':
		alien['color']='yellow'
		alien['point']='10'
	elif alien['color']=='yellow':
		alien['color']='red'
		alien['point']='20'
for alien in aliens[:5]:
	print(alien)
```

```
{'color': 'yellow', 'point': '10'}
{'color': 'yellow', 'point': '10'}
{'color': 'yellow', 'point': '10'}
{'color': 'green', 'point': 5}
{'color': 'green', 'point': 5}
```

###### 在字典中存储列表

```
pizza = {
	'sort':'好好好',
	'materials':['好','好个寂寞好'],
}
print(f"you order a {pizza['sort']} pizza")
for material in pizza['materials']:
	print('\t'+material)
```

```
you order a 好好好 pizza
	好
	好个寂寞好
```

###### 在字典中存储字典

```
users = {
	'admin': {
		'first':'ann',
		'last':'bbaa',
		'location':'A点',
	},								//","切记切记
	'adminstor': {
		'first':'daa',
		'last':'ccaa',
		'location':'B点',
	}
}
for user_name,user_info in users.items():        //items()返回一个键值对，
												   user_name等于前面的键
												   user_info等于后面的值
	print(f"username:{user_name}")
	print(f"full name:{user_info['first']}{user_info['last']}")
	print(f"location:{user_info['location']}")
```

```
username:admin
full name:annbbaa
location:A点
username:adminstor
full name:daaccaa
location:B点
```

这一块挺乱的我感觉，字典跟之前的if和for循环贴在一起了，再加上keys(),values(),items()等等几个方法，多练练吧0_o

---

# 4. Pyhton--从入门到入土---函数（2023年3月27日）

函数

###### 定义函数

开头使用关键字def定义函数，中间添加需要定义的函数的名字，结尾部分别忘了:

```
def greet_user():
	print("Hello a")
greet_user()
```

```
Hello a
```



###### 向函数中传递信息

```
def greet_user(user_name):
	"""表示最简单的问候"""
	print(f"Hello a,{user_name.title()}")
greet_user('jess')
```

```
Hello a,Jess
```

传递实参

```
def describe_pet(animal_type,pet_name):
   print(f"i have a {animal_type}")
   print(f"my {animal_type}'s name is {pet_name}.")
describe_pet('dog','king')
```

```
i have a dog
my dog's name is king.

```

这里将实参dog赋给形参animal_type，而实参king被赋给pet_name，这种基于实参的位置顺序的关联方式称之为位置实参

###### 多次调用函数

```
def describe_pet(animal_type,pet_name):
	print(f"i have a {animal_type}")
	print(f"my {animal_type}'s name is {pet_name}.")
describe_pet('小黑子','真下头')
describe_pet('汪汪队','立大功')
```

```
i have a 小黑子
my 小黑子's name is 真下头.
i have a 汪汪队
my 汪汪队's name is 立大功.
```

###### 关键字实参

```
from builtins import print


def describe_pet(animal_type, pet_name):
    print(f"i have a {animal_type}")
    print(f"my {animal_type}'s name is {pet_name}.")


describe_pet(animal_type='小黑子', pet_name='真下头')

```

```
i have a 小黑子
my 小黑子's name is 真下头.
```

关键字实参的顺序无所谓，但是需要准确制定函数定义中的形参名

###### 默认值

编写函数式，可以给每个形参指定默认值，在调用函数中都给形参提供实参时，Python将使用指定的实参值，否则将会使用形参的默认值

```
from builtins import print


def describe_pet(pet_name,animal_type='dog'):
    print(f"i have a {animal_type}")
    print(f"my {animal_type}'s name is {pet_name}.")


describe_pet(pet_name='汪汪队立大功')

```

```
i have a dog
my dog's name is 汪汪队立大功.
```

###### 返回值

·函数并非是直接显示输出，它还可以处理一些数据，并返回一个或者一组值。函数返回的值称之为返回值。

```
from builtins import print


def name(first_name,last_name):
	full_name=f"{first_name}  {last_name}"
	return full_name.title()
musician = name('a','hahaha')
print(musician)

```

```
A  Hahaha
```

这里的返回值是full.name转换成首字母大写形式

###### 让实参变成可选的

可以使用默认值是实参变成可选的

```
from builtins import print


def name(first_name,last_name,middle_name=''):
	if middle_name:
		full_name=f"{first_name} {middle_name} {last_name}"
	else:
		full_name=f"{first_name} {last_name}"

	return full_name.title()
musician = name('a','hahaha')
print(musician)

```

```
A Hahaha
```

###### 返回字典

```
from builtins import print

def name_in(first_name,last_name):
	person = {'ffirst':first_name,'last':last_name}
	return person
musician = name_in('奥拓','阿波卡利斯')
print(musician)
```

```
{'ffirst': '奥拓', 'last': '阿波卡利斯'}
```

###### 结合使用函数以及while循环

```
from builtins import print

def name_in(first_name,last_name):
	full_name = f"{first_name}{last_name}"
	return full_name.title()
while True:
	print('Hello everybody')
	print('please input your first name and last name')
	f_name = input("Please input your first name:")
	if f_name == 'quit':
		break
	l_name = input("Please input your last name:")
	if l_name == 'quit':
		break
	name_out=name_in(f_name,l_name)
	print(name_out)
```

```
Hello everybody
please input your first name and last name
Please input your first name:a
Please input your last name:a
Aa
Hello everybody
please input your first name and last name
Please input your first name:a
Please input your last name:_a
A_A
Hello everybody
please input your first name and last name
Please input your first name:a
Please input your last name:quit
```

###### 传递列表

```
def greet_user(names):
	for name in names:
		message = f"hello  {name.title()}"
		print(message)
username = ['haah','xixi','wangwang']
greet_user(username)
```

```
hello  Haah
hello  Xixi
hello  Wangwang
```

###### 在函数中修改列表

```
unprint_Designed = ['phone','robot','dodecahedron']
print_designeds = []

while unprint_Designed:
	current_design = unprint_Designed.pop()
	print(f"printing model:{current_design}")
	print_designeds.append(current_design)
print("the following models have been printed:")
for print_designed in print_designeds:
	print(print_designed)
```

```
printing model:dodecahedron
printing model:robot
printing model:phone
the following models have been printed:
dodecahedron
robot
phone
```

使用函数来进行编写

```
def print_model(unprinted_designeds,completed_models):
	while unprinted_designeds:
		current_print = unprinted_designeds.pop()
		print(f"printing models:{current_print}")
		completed_models.append(current_print)
def show_completed(completed_models):
	print("the following models have been printed:")
	for completed_model in completed_models:
		print(completed_model)
unprint_designs = ['phone','computer','robot']
complete_models = []

print_model(unprint_designs,complete_models)
show_completed(complete_models)
```

```
printing models:robot
printing models:computer
printing models:phone
the following models have been printed:
robot
computer
phone
```

###### 切片表示法[:]禁止访问列表

```
from builtins import print


def print_model(unprinted_designeds, completed_models):
    while unprinted_designeds:
        current_print = unprinted_designeds.pop()
        print(f"printing models:{current_print}")
        completed_models.append(current_print)


def show_completed(completed_models):
    print("the following models have been printed:")
    for completed_model in completed_models:
        print(completed_model)



unprint_designs = ['phone', 'computer', 'robot']
complete_models = []
print_model(unprint_designs[:],complete_models)
show_completed(complete_models)
print(unprint_designs)
```

```
printing models:robot
printing models:computer
printing models:phone
the following models have been printed:
robot
computer
phone
['phone', 'computer', 'robot']
```

这个就是在下面调用函数的时候建立一个切片来进行运算，这个切片的话当做中间件就好

###### 传递任意数量的实参

```
def making_pizza(*toppomgs):
	print("\nmaking a pizza whit the ffollowing topping")
	for topping in toppomgs:
		print(f"-{topping}")
making_pizza('pepperoni')
making_pizza('mushrooms','green peppers','extra cheese')

```

```

making a pizza whit the ffollowing topping
-pepperoni

making a pizza whit the ffollowing topping
-mushrooms
-green peppers
-extra cheese
```

在这里的话，*toppings这里的星号定义了一个空元组（元组的话见操作列表）并将所有的值封装到这个空元组中

###### 结合使用位置实参和任意数量实参

```
def making_pizza(size,*toppomgs):
	print(f"making a {size} pizza whit the ffollowing topping")
	for topping in toppomgs:
		print(f"-{topping}")
making_pizza(12,'pepperoni')
making_pizza(16,'mushrooms','green peppers','extra cheese')

```

```
making a 12 pizza whit the ffollowing topping
-pepperoni
making a 16 pizza whit the ffollowing topping
-mushrooms
-green peppers
-extra cheese
```

使用任意数量的关键字实参

**可以创建一个空字典

```
def build_profit(first,last,**user_name):
	user_name['first_name'] = first
	user_name['last_name'] = last
	return user_name
user_profile = build_profit('齐格飞','卡斯兰娜',
							location = '圣芙蕾雅学园',
							says = '我将发动一次nb的攻击')
print(user_profile)
```

```
{'location': '圣芙蕾雅学园', 'says': '我将发动一次nb的攻击', 'first_name': '齐格飞', 'last_name': '卡斯兰娜'}
```

###### 导入整个模块

先建立一个python文件，里面输入写好的def，保存为pizza.py

```
def making_pizza(size,*toppings):
   print(f"making a {size} pizza whit the following topping")
   for topping in toppings:
      print(f"-{topping}")
```

然后再这个文件所在的目录下在新建一个

```
import pizza
pizza.making_pizza(16,'pepperont')
pizza.making_pizza(21,'cheese','huge','mushrooms')
```

使用import让python打开文件pizza.py

，并将其中的线索有的函数都复制到这个程序中，你看不到复制的代码，因为在这个程序运行时，Python在幕后复制了这些代码。要调用被导入模块的函数，可指定被导入模块的名称pizza和函数名making_pizza（），并用句号来分隔开

###### 当然也可以显性的调用函数

```
from pizza import making_pizza
making_pizza(16,'pepperont')
making_pizza(21,'cheese','huge','mushrooms')
```

这样也是可行的，而且这样的话不需要在每一个前面添加句号

###### 使用as来给函数指定别名

```
from pizza import making_pizza as mp
mp(16,'pepperont')
mp(21,'cheese','huge','mushrooms')
```

```
making a 16 pizza whit the following topping
-pepperont
making a 21 pizza whit the following topping
-cheese
-huge
-mushrooms
```

###### 使用as给模块指定别名

```
import pizza as p
p.making_pizza(16,'pepperont')
p.making_pizza(21,'cheese','huge','mushrooms')
```

结果是一样的

###### 导入模块中的所有函数

使用星号（*）可以让Python导入模块中的所有函数

```
from pizza import *
making_pizza(16,'pepperont')
making_pizza(21,'cheese','huge','mushrooms')
```

```
making a 16 pizza whit the following topping
-pepperont
making a 21 pizza whit the following topping
-cheese
-huge
-mushrooms
```

---

# 5. Python--从入门到入土--类（2023年3月29日）

类

##### 创建和使用类以及根据实参来创造事例

```
class Dog:
    def __init__(self,name,age):
        self.name = name
        self.age = age

    def sit(self):
        print(f"{self.name} is now sitting ")

    def roll_over(self):
        print(f"{self.name} rolled over")

my_dog = Dog("willie",6)
print(f"my dog's name is  {my_dog.name}")
print(f"my dog's age is {my_dog.age}")
```

```
my dog's name is  willie
my dog's age is 6
```

这里的”_init_（）“是一种特殊的方法，每当你想要根据Dog类创建新的实例的时候，Python就会自动运行它。在这个方法的名称中，开头和结尾默认都有2个下划线，这是为了避免Python将他和其他的普通的方法名称发生冲突。在这个方法的定义的时候，形参self是必不可少的，而且必须为与其他的形参的前面。因为Python在调用这个函数的时候，将会自动传入实参self，每个与实例相关联的方法调用都自动传递实参self，它起到一个指向实例的作用，让实例能够访问类中的属性和方法。后面的def中变量都有前缀self，以self为前缀的变量可供给类中的所有方法使用，可以通过类的所有实例来访问。可通过实例访问的变量称之为属性。

Dog类还定义了来年各个方法：sit()和roll_over。这些方法执行时不需要额外的信息，因此他们只有一个形参self、



###### 1.访问属性

my_dog.name

###### 2.调用方法

```
class Dog:
    def __init__(self,name,age):
        self.name = name
        self.age = age

    def sit(self):
        print(f"{self.name} is now sitting ")

    def roll_over(self):
        print(f"{self.name} rolled over")

my_dog = Dog("willie",6)
print(f"my dog's name is  {my_dog.name}")
print(f"my dog's age is {my_dog.age}")
my_dog.sit()
my_dog.roll_over()
```

```
my dog's name is  willie
my dog's age is 6
willie is now sitting
willie rolled over
```

###### 3.创造多个实例

```
class Dog:
    def __init__(self,name,age):
        self.name = name
        self.age = age

    def sit(self):
        print(f"{self.name} is now sitting ")

    def roll_over(self):
        print(f"{self.name} rolled over")

my_dog = Dog("willie",6)
your_dog = Dog("annn",2)
print(f"my dog's name is  {my_dog.name}")
print(f"my dog's age is {my_dog.age}")
my_dog.sit()
my_dog.roll_over()

print(f"your dog's name is {your_dog.name}")
your_dog.sit()
print(f"your dog can roll over,{your_dog.name},how old is your dog {your_dog.age}")
your_dog.roll_over()
```

```
my dog's name is  willie
my dog's age is 6
willie is now sitting
willie rolled over
your dog's name is annn
annn is now sitting
your dog can roll over,annn,how old is your dog 2
annn rolled over
```

##### 使用类和实例

```
class car:
    def __init__(self,maek,model,year):
        self.make = maek
        self.model = model
        self.year = year

    def get_descript_name(self):
        long_name = f"{self.year}  {self.model}  {self.make}"
        return long_name.title()
my_new_car = car('Aodi','a4','2019')
print(my_new_car.get_descript_name())
```

```
2019  A4  Aodi
```

###### 给属性指定默认值

创建实例时，有些属性无需通过形参来定义，可以再方法"_init_()"中为其指定默认值。

```
class car:
    def __init__(self,maek,model,year):
        self.make = maek
        self.model = model
        self.year = year
        self.odometer_reading=0

    def read_odometer(self):
        print(f"this car has {self.odometer_reading} mile on it")

    def get_descript_name(self):
        long_name = f"{self.year}  {self.model}  {self.make}"
        return long_name.title()
my_new_car = car('Aodi','a4','2019')
print(my_new_car.get_descript_name())
my_new_car.read_odometer()
```

```
2019  A4  Aodi
this car has 0 mile on it
```

##### 修改属性的值

###### 直接修改

```
class car:
    def __init__(self,maek,model,year):
        self.make = maek
        self.model = model
        self.year = year
        self.odometer_reading=0

    def read_odometer(self):
        print(f"this car has {self.odometer_reading} mile on it")

    def get_descript_name(self):
        long_name = f"{self.year}  {self.model}  {self.make}"
        return long_name.title()

my_new_car = car('Aodi','a4','2019')
print(my_new_car.get_descript_name())
my_new_car.odometer_reading = 23
my_new_car.read_odometer()
```

```
2019  A4  Aodi
this car has 23 mile on it
```

###### 通过方法修改属性的值

```
class car:
    def __init__(self,maek,model,year):
        self.make = maek
        self.model = model
        self.year = year
        self.odometer_reading=0

    def read_odometer(self):
        print(f"this car has {self.odometer_reading} mile on it")

    def undate_odometer(self,milliage):
        self.odometer_reading = milliage

    def get_descript_name(self):
        long_name = f"{self.year}  {self.model}  {self.make}"
        return long_name.title()

my_new_car = car('Aodi','a4','2019')
print(my_new_car.get_descript_name())
my_new_car.undate_odometer(23)
my_new_car.read_odometer()
```

```
2019  A4  Aodi
this car has 23 mile on it
```

###### 通过方法对属性的值进行递增

```
from builtins import print


class car:
    def __init__(self, maek, model, year):
        self.make = maek
        self.model = model
        self.year = year
        self.odometer_reading = 0

    def read_odometer(self):
        print(f"this car has {self.odometer_reading} mile on it")

    def undate_odometer(self, milliage):
        self.odometer_reading = milliage

    def get_descript_name(self):
        long_name = f"{self.year}  {self.model}  {self.make}"
        return long_name.title()

    def increaing_odometer(self, miles):
        self.odometer_reading += miles


my_new_car = car('Aodi', 'a4', '2019')
print(my_new_car.get_descript_name())
my_new_car.undate_odometer(666)
my_new_car.read_odometer()

my_new_car.increaing_odometer(1000)
print(my_new_car.read_odometer())

```

```
2019  A4  Aodi
this car has 666 mile on it
this car has 1666 mile on it
None
```

？这个none是怎么蹦出来的？

###### 继承

子类的方法_init_

在既有类的基础上编写新的类的时候，通常会调用父类的方法_inti_。浙江初始化在父类_init_（）方法来定义的所有属性，从而让子类包含这些属性。

```
from builtins import print


class car:
    def __init__(self, maek, model, year):
        self.make = maek
        self.model = model
        self.year = year
        self.odometer_reading = 0

    def read_odometer(self):
        print(f"this car has {self.odometer_reading} mile on it")

    def undate_odometer(self, milliage):
        self.odometer_reading = milliage

    def get_descript_name(self):
        long_name = f"{self.year}  {self.model}  {self.make}"
        return long_name.title()

    def increaing_odometer(self, miles):
        self.odometer_reading += miles
class electorcar(car):
    def _init_(self,make,model,year):
        super()._init_(maek,model.year)

my_tesia = electorcar('tesla','model s','2020')
print(my_tesia.get_descript_name())
```

```
2020  Model S  Tesla

```

这里super()是一个特殊函数，使得你可以调用弗雷德方法。这一行代码能够使得python调用car类的方法_init_，让electorcar实例能够包含这个方法的所有属性。父类也称之为超类。

###### 给子类定义属性和方法

```
from builtins import print, super


class car:
    def __init__(self, maek, model, year):
        self.make = maek
        self.model = model
        self.year = year
        self.odometer_reading = 0

    def read_odometer(self):
        print(f"this car has {self.odometer_reading} mile on it")

    def undate_odometer(self, milliage):
        self.odometer_reading = milliage

    def get_descript_name(self):
        long_name = f"{self.year}  {self.model}  {self.make}"
        return long_name.title()

    def increaing_odometer(self, miles):
        self.odometer_reading += miles
class electorcar(car):
    def __init__(self,make,model,year):
        super().__init__(make,model,year)
        self.battery_size = 75

    def describe_battery(self):
        print(f"this car has a {self.battery_size} - km battery")

my_tesla = electorcar('tesla','model s',2020)
print(my_tesla.get_descript_name())
my_tesla.describe_battery()
```

```
2020  Model S  Tesla
this car has a 75 - km battery
```

###### 重写父类的方法

对于父类的方法重写，可以在子类中定义一个与要冲写的父类方法同名的方法。

###### 将实例当做属性

```
from builtins import print, super

class car:
    def __init__(self, maek, model, year):
        self.make = maek
        self.model = model
        self.year = year
        self.odometer_reading = 0

    def read_odometer(self):
        print(f"this car has {self.odometer_reading} mile on it")

    def undate_odometer(self, milliage):
        self.odometer_reading = milliage

    def get_descript_name(self):
        long_name = f"{self.year}  {self.model}  {self.make}"
        return long_name.title()

    def increaing_odometer(self, miles):
        self.odometer_reading += miles

class Battery:
    def __init__(self,battery_size=75):
        self.battery_size = battery_size
    def describe_battery(self):
        print(f"this car has a {self.battery_size}-kwh battery.")

class electorcar(car):
    def __init__(self,make,model,year):
        super().__init__(make, model,year)
        self.battery= Battery()


my_tesla = electorcar('tesla','model s',2020)
print(my_tesla.get_descript_name())
my_tesla.battery.describe_battery()
```

```
2020  Model S  Tesla
this car has a 75-kwh battery.
```

###### 导入类

导入所有类的时候

```
from  ()   import *
```

使用别名

```
from () import ()  as ()
```
