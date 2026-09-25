---
title: Python:从入门到入土---列表
date: 2023年3月20日
tags:
  - python
categories: python
keywords:
description: python 列表

---
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


