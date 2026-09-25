---
title: markdown语法简述&ai_agent
datas: 2026.2.7
updated: 2026年2月7日
tags:
  - markdown
  - ai
categories:
  - markdown
  - ai
keywords:
description:
  - markdown & ai
top_img:
comments:
cover:
toc:
toc_number:
toc_style_simple:
copyright:
copyright_author:
copyright_author_href:
copyright_url:
copyright_info:
mathjax:
katex:
aplayer:
highlight_shrink:
aside:
swiper_index: 1
---

# markdown
~~恭喜markdown成为世界上最好的语言(bushi)~~

简述一下markdown的语法

## markdown 标题
要创建标题，请在单词或短语前面添加井号 (#) 。# 的数量代表了标题的级别。例如，添加三个 # 表示创建一个三级标题 (``<h3>``)
例如：`### My Header`

## Markdown 段落
markdown的分段和正常的不一样，他需要额外空出一段才是分段
```
I really like using Markdown.

I think I'll use it to format all of my documents from now on.
```
对应的是html的
```
<p>I really like using Markdown.</p>

<p>I think I'll use it to format all of my documents from now on.</p>
```

## Markdown 换行
在一行的末尾加上两个或者多个空格，然后按回车，就可以创建一个`<br>`

(实际上，在编译器中很少能看见两个空格或者多个空格，并且多数人都会下意识的添加两个空格，所以我更建议你采用``<br>``的格式，再不济令起一个段落也是可以的)

## Markdown 强调
fleet里面`*`是表示加强，`_`是表示倾斜，其他的markdown编译器可能是两个`*`强调一个`*`倾斜

## Markdown 引用
要创建块引用，请在段落前添加一个 > 符号
> Dorothy followed her through many of the beautiful rooms in her castle.

多个的话就直接在每一段前面以及中间的空白行之间添加>就行
> Dorothy followed her through many of the beautiful rooms in her castle.
>
> The Witch bade her clean the pots and kettles and sweep the floor and keep the fire fed with wood.

嵌套块引用

块引用可以嵌套。在要嵌套的段落前添加一个 >> 符号
> Dorothy followed her through many of the beautiful rooms in her castle.
>
>> The Witch bade her clean the pots and kettles and sweep the floor and keep the fire fed with wood.

块引用可以包含其他 Markdown格式的元素。

并非所有元素都可以使用，你需要进行实验以查看哪些元素有效。

> #### The quarterly results look great!
>
> - Revenue was off the chart.
> - Profits were higher than ever.
>
>  *Everything* is going according to **plan**.

## Markdown 列表
有序的话就是1.2.3.这种，比如说
1. hello
2. world

无序的话则是----的形式,qishi *,+也都可以
- hello
- world
* hello（*）
+ world（+）

要在保留列表连续性的同时在列表中添加另一种元素，请将该元素缩进**四个空格或一个制表符**，如下例所示
*   This is the first list item.
*   Here's the second list item.

    I need to add another paragraph below the second list item.

*   And here's the third list item.

中间插入图片，代码段什么的也都可以，格式也是缩进**四个空格或一个制表符**

## Markdown 代码
三个转义反引号

## Markdown 分隔线

要创建分隔线，请在单独一行上使用三个或多个星号 (***)、破折号 (---) 或下划线 (___) ，并且不能包含其他内容

***

---

_________________

## Markdown 链接

### 基操
链接文本放在中括号内，链接地址放在后面的括号中，链接title可选。

超链接Markdown语法代码：``[超链接显示名](超链接地址 "超链接title")``

对应的HTML代码：``<a href="超链接地址" title="超链接title">超链接显示名</a>``


### 给链接加title
链接title是当鼠标悬停在链接上时会出现的文字，这个title是可选的，它放在圆括号中链接地址后面，跟链接地址之间以空格分隔

`这是一个链接 [Markdown语法](https://markdown.com.cn "最好的markdown教程")。`

渲染效果如下

这是一个链接 [Markdown语法](https://markdown.com.cn "最好的markdown教程")。

### 网址和Email地址
使用尖括号可以很方便地把URL或者email地址变成可点击的链接
`<https://markdown.com.cn>`

`<fake@example.com>`

<https://markdown.com.cn>

<fake@example.com>

### 带格式化的链接
强调链接, 在链接语法前后增加星号。 要将链接表示为代码，请在方括号中添加反引号

```
I love supporting the **[EFF](https://eff.org)**.
This is the *[Markdown Guide](https://www.markdownguide.org)*.
See the section on [`code`](#code).
```

I love supporting the **[EFF](https://eff.org)**.

This is the *[Markdown Guide](https://www.markdownguide.org)*.

See the section on [`code`](#code).

### 引用类型链接
#### 第一部分格式
引用类型的链接的第一部分使用两组括号进行格式设置。第一组方括号包围应显示为链接的文本。第二组括号显示了一个标签，该标签用于指向您存储在文档其他位置的链接。

```效果相同
[hobbit-hole][1]
[hobbit-hole] [1]
```

#### 第二部分格式
引用类型链接的第二部分使用以下属性设置格式：

1. 放在括号中的标签，其后紧跟一个冒号和至少一个空格（例如``[label]``:）。
2. 链接的URL，可以选择将其括在尖括号中。
3. 链接的可选标题，可以将其括在双引号，单引号或括号中

可以将链接的第二部分放在Markdown文档中的任何位置。有些人将它们放在出现的段落之后，有些人则将它们放在文档的末尾

```效果相同
[1]: https://en.wikipedia.org/wiki/Hobbit#Lifestyle
[1]: https://en.wikipedia.org/wiki/Hobbit#Lifestyle "Hobbit lifestyles"
[1]: https://en.wikipedia.org/wiki/Hobbit#Lifestyle 'Hobbit lifestyles'
[1]: https://en.wikipedia.org/wiki/Hobbit#Lifestyle (Hobbit lifestyles)
[1]: <https://en.wikipedia.org/wiki/Hobbit#Lifestyle> "Hobbit lifestyles"
[1]: <https://en.wikipedia.org/wiki/Hobbit#Lifestyle> 'Hobbit lifestyles'
[1]: <https://en.wikipedia.org/wiki/Hobbit#Lifestyle> (Hobbit lifestyles)
```

## Markdown 图片
要添加图像，请使用感叹号 (!), 然后在方括号增加替代文本，图片链接放在圆括号里，括号里的链接后可以增加一个可选的图片标题文本。

插入图片Markdown语法代码：``![图片alt](图片链接 "图片title")。``

对应的HTML代码：``<img src="图片链接" alt="图片alt" title="图片title">``

## Markdown 转义字符
[![pZo5G5j.png](https://s41.ax1x.com/2026/02/07/pZo5G5j.png)](https://imgchr.com/i/pZo5G5j)

特殊字符自动专业，在 HTML 文件中，有两个字符需要特殊处理： < 和 & 。 < 符号用于起始标签，& 符号则用于标记 HTML 实体，如果你只是想要使用这些符号，你必须要使用实体的形式，像是 &lt; 和 &amp;。

& 符号其实很容易让写作网页文件的人感到困扰，如果你要打「AT&T」 ，你必须要写成「AT&amp;T」 ，还得转换网址内的 & 符号
```
http://images.google.com/images?num=30&q=larry+bird
```

你必须改成
```
http://images.google.com/images?num=30&amp;q=larry+bird
```

才能放到链接标签的 href 属性里。不用说也知道这很容易忘记，这也可能是 HTML 标准检查所检查到的错误中，数量最多的。

Markdown 允许你直接使用这些符号，它帮你自动转义字符。如果你使用 & 符号的作为 HTML 实体的一部分，那么它不会被转换，而在其它情况下，它则会被转换成 &amp;。

所以你如果要在文件中插入一个著作权的符号，你可以这样写：
`&copy;`,Markdown 将不会对这段文字做修改，但是如果你这样写`AT&T`,Markdown 就会将它转为：`AT&amp;T`,(但是我在fleet中测试却是不会，奇了怪了)

## Markdown 内嵌 HTML 标签
对于 Markdown 涵盖范围之外的标签，都可以直接在文件里面用 HTML 本身。如需使用 HTML，不需要额外标注这是 HTML 或是 Markdown，只需 HTML 标签添加到 Markdown 文本中即可。

比如`This **word** is bold. This <em>word</em> is italic.`

可以被解析为

This **word** is bold. This <em>word</em> is italic.


区块元素──比如`` <div>、<table>、<pre>、<p>`` 等标签，必须在前后加上空行，以便于内容区分。而且这些元素的开始与结尾标签，不可以用 tab 或是空白来缩进。Markdown 会自动识别这区块元素，避免在区块标签前后加上没有必要的 ``<p>`` 标签

```
This is a regular paragraph.

<table>
    <tr>
        <td>Foo</td>
    </tr>
</table>

This is another regular paragraph.
```
会被解析为

This is a regular paragraph.

<table>
    <tr>
        <td>Foo</td>
    </tr>
</table>

This is another regular paragraph.


# ai
先来一点感慨

&emsp;坦白说，这几年的ai进化速度超出我的想像，23年的时候，chatgpt-3横空出世，那时的gpt比起说人工智能，更像是人工智障，当时的ai只适用于检索，如果你丢给他一大段代码，他会给你的代码改的面目全非，像极了一个有着最顶级信息库的小孩对你的作品肆意涂鸦。有个笑话是23-24年对ai最流行的几句话是
 **"不要动我的代码"**，**“你只需要提建议”**，**“恢复我之前的代码”**，（~~卧槽用户怒了.jpg~~）

&emsp;但是短短两年间，除了openai的chatgpt，还涌现了Gemini,Grol,Claude,GLM，Deepseek等如此多的模型，他们在语言，音频，图片，ppt生成，甚至是视频等领域喷涌而出，仿佛一夜之间，整个世界进入了ai加速发展的新时代。我曾经看影视飓风的一期节目，讲的是ai与他们公司的，印象最深的地方是，Tim他们公司5个建模师用了几个月才完成的事，ai只需要短短的30分钟就完整了，这是一件很恐怖的事。

&emsp;
作为一个消费者，我能明确的感受到在如今的生活中，方方面面都是ai，所有的应用的描述中都有ai，更新中都是采用了xxxai模型的最新款，就好像，没有使用ai已经是一件让人羞耻的事情一样。笔者写下这篇碎碎念的时间是26.2.7，这个时候国内，腾讯的元宝刚结束二轮撒钱，只需要占用你短短的十分钟时间帮他们进行图片/文本的生成就可以得到几块几角几分钱，而千问也开始了agent的免费奶茶环节，与此同时，其他的国产模型也在疯狂撒钱占有用户....整个市场都在进行一场ai狂欢。

&emsp;
作为一个计算机专业学生，vibe coding的出现给我身边页带来了很多不同。愈来愈多的学生开始使用vibe coding,以前的编译器只有jet brains和vscode这两种，但是呢，这短短的半年，我身边愈来愈多的同学开始尝试trae,antigravity,cursor等等vibe coding完成一些我以前或想过但是因为一些原因未能尝试或未曾想想到的事情，ai的普及很大程度上降低了知识的传播速度，**只要你想，只要你问**，你就可以轻而易举的获得想要的知识点以及延申。同样的,ai也很大程度上节省了人力，以前需要的手工测试，现在只需要编译好agent，编译好skill，编译好workflows，就可以让ai一键进行，前几日我看到一篇消息，big sleep,一款ai驱动的安全工具，挖出了20+的网络漏洞。这意味着，手工的时代已经过去，现在的网络安全比拼的是各自的ai，网安已经从人工的时代转向ai对抗的时代。

&emsp;
与此同时，ai的普及也很大程度上对人进行了筛选，我身边的朋友用ai完成一份很不错的课设作业，但是当我问他某个地方是怎么做的的时候，他反而疑惑的问：“这啥？ai写的我不知道啊”。现在有些中年人，没事就问豆包元宝等等ai，将其解决方案视为圣旨一样的，我们不可否认,ai提出的建议确实有时候是可行的，但是，ai终究是工具，他不能也不可以代替人类去思考。

&emsp;
我一直坚信ai是一个工具，也只能是一个工具，无论他有多么方便多么强大，他终究只能是一个工具助理，他无法替代你，无法给予你无与伦比的创造力，无法取代你的独立思考大脑，他只能在一旁提示你，引导你，但是做决定做思考的人，只能是你，当你失去独立思考的能力的时候，当你全盘依赖ai的时候，你还能称之为一个独立的个体吗？

&emsp;
有时候，我们也会去横向对比各个厂商的llm，也会看到各种营销号在疯狂鼓吹国内llm模型，说是“白宫吓傻了“，”gpt就图一乐“，”国产模型才是最牛x的“...不可否认，国内ai在某一时间段确实得到了国际的认可，比如25年初的deepseek，但是这并不代表他们一直走在大模型的前列，自家人知自家事，ds在某些程度上确实很厉害，但是人外有人，这是一个飞速进化的时代，正确认知自己，不断发展超越才是追赶或者说超越的唯一路径。

&emsp;
当你将眼光放向国外你就会发现一点，中国的路是"AI+赋能"，走的是ai贴近民生的路子，而美国确实”先进模型“为核心，不断追求更高程度的ai，目前来说，我们很难说哪一个更加正确，ai现在还只是开始，大家都处于慢开始阶段，究竟是美国先依靠先进的芯片不断训练出更强，功能更多的模型，吸引更多国际用户，实现良性循环的方针正确，还是中国依靠本身强大的制造业体量，加速提高生产力，在基建，民生，医药等领域上不断加码，实现AI赋能产业的路更完善，这一点只有时间能回答。

&emsp;
23年注定是不平凡的一年，这一年有gpt-3的横空出世，而ai也因为gpt-3的出现注定不平凡。他正在重塑传统的社会模式，从手工到自动，从想象到落地，ai时代最重要的，我认为是想象力，当手工被机器代替，当方法被算法取代，人类剩下的，只有对星空的恐惧和无限的想象力。AI时代，每个人都可以参与进来，与这场狂欢共舞。但是，我们，是否能够从中获得足够的利益？下一场的“AI热潮”还会出现吗？AI是否会取代人类？AI是否可以是一种新的物种？...

&emsp;
一个又一个的问题不断涌现，但是能回答的，只有时间。

最后，用正在听的歌作结吧。

<center>

“_去见证破晓前的奇遇_”

”_去更新文明后的航迹_“

“_让温柔归还天地_”

”_让终章化作序曲_“

”_延续广阔的意义_“

”_让星炬不熄_“

</center>