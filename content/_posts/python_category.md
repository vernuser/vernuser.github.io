---
title: Python--从入门到入土--类
date: 2023年3月29日
tags:
  - python
categories: python
keywords:
description: python 类

---

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

