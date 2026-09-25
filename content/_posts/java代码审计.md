---
title: 代码审计---java基础
date: 2024年9月19日
updated: 2024年9月19日
tags:
  - 代码审计
categories: 代码审计
keywords:
description: 代码审计

---


# java基本语法

基础语法：

- 对象：对象是类的一个实例，有状态和行为

例如：一条狗是一个对象，他的状态就有：颜色，名字，品种；行为就有了：吃，坐下，叫等

- 类：类是一个模板，他描述一类对象的行为和状态

- 方法：方法就是行为，一个类可以有很多方法，逻辑运算，数据修改以及所有动作都是在方法中完成的
- 实例变量：每个对象都有独特的实例变量，对象的状态由这些实例变量的值决定

第一个java程序
```
public class the_first_java {
    /* 第一个Java程序

  *它将输出字符串 Hello World

   */
    public static void main(String[] args){
        System.out.println("Hello World");
    }
}
```

输出应该是
```
Hello World
```

![](https://pic.imgdb.cn/item/66ec1db4f21886ccc0fb79df.png)

## java对象和类

![](https://pic.imgdb.cn/item/66ec1e60f21886ccc0fc1ded.png)

## java创建对象

对象是根据类创建的。在Java中，使用关键字new来创建一个新的对象。创建对象需要以下三步：

- 声明：声明一个对象，包括对象名称和对象类型。

- 实例化：使用关键字 new 来创建一个对象。

- 初始化：使用 new 创建对象时，会调用构造方法初始化对象。

puppy
```
public class Puppy {
    public Puppy(String name){
        System.out.println("小狗的名字是"+name);

    }
    public static void main(String[] args){
        Puppy myPuppy = new Puppy("tommy");
    }
}

```

输出应该是:
```
小狗的名字是tommy
```

## Java基本类型

![](https://pic.imgdb.cn/item/66ec23eef21886ccc00243ec.png)


```
public class Test {
    static boolean bool;
    static byte by;
    static  char ch;
    static double d;
    static float f;
    static int i;
    static long l;
    static short sh;
    static String str;

    public static void main(String[] args) {
        System.out.println("Bool:"+bool);
        System.out.println("Byte:"+by);
        System.out.println("Char:"+ch);
        System.out.println("Double:"+d);
        System.out.println("Float:"+f);
        System.out.println("Int:"+i);
        System.out.println("Long:"+l);
        System.out.println("Short:"+sh);
        System.out.println("String:"+str);
    }

}
```
输出应该是

```
Bool:false
Byte:0
Char:
Double:0.0
Float:0.0
Int:0
Long:0
Short:0
String:null

进程已结束，退出代码为 0

```


## java循环结构

经典的三种循环方式:
- while 循环
- do...while循环
- for循环

while实例
```
public class cycle {
    public static void main(String[] args) {
        int x=10;
        while(x<20){
            System.out.println("value of x : "+ x);
            x++;
//            System.out.println("\n");
        }
    }
}

```

输出
```
value of x : 10
value of x : 11
value of x : 12
value of x : 13
value of x : 14
value of x : 15
value of x : 16
value of x : 17
value of x : 18
value of x : 19
```
不知道为啥，按理说不应该不会换行的吗，怎么加了个换行符多一行🧐

do-while循环
```
public class text {
        public static void main(String args[]) {

            for(int x = 10; x < 20; x = x+1) {
                System.out.print("value of x : " + x );
                System.out.print("\n");
            }
        }
}

```

输出为
```
value of x : 10
value of x : 11
value of x : 12
value of x : 13
value of x : 14
value of x : 15
value of x : 16
value of x : 17
value of x : 18
value of x : 19
```