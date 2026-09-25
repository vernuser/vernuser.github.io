---
title: Pyhton--从入门到入土---函数
date: 2023年3月27日
tags:
  - python
categories: python
keywords:
description: python 函数
---

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