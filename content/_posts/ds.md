---
title: 数据结构
data: 2023年10月24日
tags:
  - 数据结构
categories: 数据结构
keywords:
description: 数据结构

---


# 数据结构

数据结构是一门研究数据组织存储和运算的一般方法的学科。

### 数据结构中有几种类型

- 线性表


​	逻辑特征：一对一

​	直接前驱，直接后驱，开始结点，终端结点

- 树

  逻辑特征：一对多

  有且只有一个根节点，

  除根节点外，每个节点都有且只有一个唯一的前驱

  除叶子结点外，每个节点都有后继结点

- 图

  逻辑结构：多对多

### 数据结构的存储类型分类：

顺序存储：按照给定的顺序进行存储

链式存储：使用链的形式进行存储

散列存储

索引存储



# 算法

一个算法是由若干的指令组成的有序数组

### 性质

- 有穷性：算法在有穷的步数中结束，每一步都在有穷的时间内完成
- 确定性：每条指令的含义都必须明确
- 可行性：能够由机器人或者计算机或者人完成

### 检验一个算法的好坏

- 正确性：能否满足预先的功能和性能要求
- 可读性：算法是够可读，易读
- 健壮性：当输入非法时，算法是否能及时给出反馈
- 时间效率和空间效率：两个复杂度

### 时间复杂度和空间复杂度

时间复杂度：执行当前算法所消耗的时间

空间复杂度：执行当前算法所占用的内存

https://www.yuque.com/vernus-u2vmo/tgvyrt/to9tln8g55kvhl0y?singleDoc#



## 线性表和链表

#### 线性表

基本概念：一个数据元素的有序集，其基本特征

- 集合中存在唯一的一个第一个元素
- 集合中存在唯一的一个最后一个元素
- 除第一个元素外都存在为一个直接前驱
- 除最后一个元素外都存在唯一的一个直接后驱

##### 顺序表的建立

```C语言
#include<stdio.h>
#include<stdlib.h>
typedef int Datatype；
struct List
{
int MAX;
int n;
DataType *elem;
};
typedef struct List*SeqList;
```

##### 顺序表的判空

```C语言
SeqList SetNullList_seq(int m)
{
    SeqList slist=(SeqList)malloc(sizeof(struct List));
    if(slist!=NULL)
    {
        slist->elem=(DataType*)malloc(sizeof(DataType)*m);
        if(slist->elem)
        {
            slist->Max=m;
            slist->n=0;
            return(slist);
        }
        else free(slist);
    }
    printf("ALLoc failure!\n");
    return NULL;
}

```

##### 顺序表的插入

```C语言
int InsertPre_seq(SeqList slist,int p,DataType x)
{
    int q;
    if(slist->n>=slist->Max)
    {
        printf("overflow");
        return 0;
    }
    if(p<0||p>slist->n)
    {
        printf("not exist!\n");
        return 0;
    }
    for(q=slist->n-1;q>=p;q--)
    slist->elem[q+1]=slist->elem[q];
    slist->elem[p]=x;
    slist->n=slist->n+1;
    return 1;
}

```

##### 顺序表的删除

```
int DelIndex_seq(SeqList slist,int p)
{
    int q;
    if(p<0||p>=slist->n)
    {
        printf("Not exist");
        return 0;
     }
     for(q=p;q<slist->n-1;q++)
     {
         slist ->elem[q]=slist ->elem[q+1];
     }
     slist ->n=slist->n-1;
     return 1;
}

```

##### 二分查找

```
int binsearch(SeqList slist,int key,int *pos)
{
    int index=1;int mid;
    int low = 0;int high=slist->n-1;
    while(low<=high)
    {
        if(slist->ekem[mid]==key)
        {
            *pos=mid;
            printf("已经找到，共进行%d次比较\n"，index);
            printf("要找到的数据%d在位置%d上\n"，key,mid);
            return 1;
        }
        else if (slist->elem[mid]>key)
        {
            high = mid -1;
        }
        else low = mid + 1;
        index++;
    }
    *pos = llow;
    printf("没找到，共进行%d次比较\n"，index-1)；
    printf("可以在%d上插入位置\n"，*pos);
}

```

### 栈

#### 特性：

​	后进先出

#### 分类：

​	顺序栈

​	链栈

#### 应用：

前缀中缀表达式

https://www.yuque.com/vernus-u2vmo/tgvyrt/zh4geied5wd2ldpm?singleDoc# 《栈的应用》

计算器

单调栈（例题——洛谷《音乐会的等待》）

### 队列

#### 特性：

先进先出，跟栈相反

#### 分类

##### 单队列

假溢出

##### 循环队列

需要一个闲置的空区

可以解决顺序队列中的假溢出和越界问题
