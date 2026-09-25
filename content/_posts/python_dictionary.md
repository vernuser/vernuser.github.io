---
title: Python--从入门到入土--字典
date: 2023年3月24日
tags:
  - python
categories: python
keywords:
description: python 字典
---

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