---
title: CISCN2024_canic
dates: 2024年6月20日15:25:56
tags:
  - web
categories: web
keywords:
description: web

---


原型链污染的题

敏感目录提示了是
```
/src
/admin
```
在src里面可以看到源码
```
from sanic import Sanic
from sanic.response import text, html
from sanic_session import Session
import pydash
# pydash==5.1.2


class Pollute:
    def __init__(self):
        pass


app = Sanic(__name__)
app.static("/static/", "./static/")
Session(app)


@app.route('/', methods=['GET', 'POST'])
async def index(request):
    return html(open('static/index.html').read())


@app.route("/login")
async def login(request):
    user = request.cookies.get("user")
    if user.lower() == 'adm;n':
        request.ctx.session['admin'] = True
        return text("login success")

    return text("login fail")


@app.route("/src")
async def src(request):
    return text(open(__file__).read())


@app.route("/admin", methods=['GET', 'POST'])
async def admin(request):
    if request.ctx.session.get('admin') == True:
        key = request.json['key']
        value = request.json['value']
        if key and value and type(key) is str and '_.' not in key:
            pollute = Pollute()
            pydash.set_(pollute, key, value)
            return text("success")
        else:
            return text("forbidden")

    return text("forbidden")


if __name__ == '__main__':
    app.run(host='0.0.0.0')
```

```代码解释
@app.route('/', methods=['GET', 'POST'])
async def index(request):
    return html(open('static/index.html').read())
```
这是一个装饰器.将下面的函数和指定的URL拼接起来，接受的方法为GET,POST

async def 是一个异步函数，函数名字为Index,接受一个request值

return html(open('static/index.html'))读取static/index.html的文件并将其内容作为相应返回给客户端。

解释一下什么是异步，正常的同步就是一个一个的做，做完一个才能进行下一个

但是异步就是比如
```
setTimeout(function cbFn(){
    console.log('learnInPro');
}, 1000);
console.log('sync things');
```
当js执行到的时候发现是一个异步任务，则会先挂起执行后面的，等到1000ms之后，回调函数cbFn才会执行

为什么要异步呢，因为js是单线程，效率至上，呵呵

怎么知道是不是一个异步呢，很简单，看看有么有async def开头，还可通过inspect模块检查一个函数是否异步函数。

inspect.iscoroutinefunction() 函数可以用于判断一个函数是否为协程函数（包括异步函数）。
```

@app.route("/login")
async def login(request):
    user = request.cookies.get("user")
    if user.lower() == 'adm;n':
        request.ctx.session['admin'] = True
        return text("login success")
    return text("login fail")
```
@app.route("/login")表示讲这个异步函数绑定到"/login" 路径上的HTTP请求。当客户端发送到 "/login" 的请求时，该函数将被调用。

user = request.cookies.get("user") 从请求的 Cookie 中获取名为 "user" 的值，并将其赋给 user 变量。

if user.lower() == 'adm;n': 检查用户是否为 "adm;n"。这里使用了 lower() 方法将用户输入的值转换为小写，以进行不区分大小写的比较。

request.ctx.session['admin'] = True 如果用户为 "adm;n"，将在请求上下文（request.ctx）的会话（session）中设置 "admin" 键，并将其值设为 True。

return text("login success") 返回一个响应，其中包含文本内容 "login success"。这将作为登录成功的响应发送给客户端。

return text("login fail") 如果用户不是 "adm;n"，则返回一个响应，其中包含文本内容 "login fail"。这将作为登录失败的响应发送给客户端。


```
@app.route("/src")
async def src(request):
    return text(open(__file__).read())
```
return text(open(__file__).read())打开当前代码文件（__file__ 表示当前文件的路径），并使用 read() 方法读取其内容。

```
@app.route("/admin", methods=['GET', 'POST'])
async def admin(request):
    if request.ctx.session.get('admin') == True:
        key = request.json['key']
        value = request.json['value']
        if key and value and type(key) is str and '_.' not in key:
            pollute = Pollute()
            pydash.set_(pollute, key, value)
            return text("success")
        else:
            return text("forbidden")
```

@app.route("/admin", methods=['GET', 'POST']) 表示将该异步函数绑定到 "/admin" 路径上的HTTP请求，并限定允许的请求方法为 GET 和 POST。当客户端发送到 "/admin" 的 GET 或 POST 请求时，该函数将被调用。

async def admin(request): 定义了一个异步函数 admin，它接收一个 request 参数，表示HTTP请求对象。

if request.ctx.session.get('admin') == True: 检查会话中是否存在 'admin' 键，并且其值为 True。这可能是在某个会话管理器中处理用户登录状态的方式。

key = request.json['key'] 从请求的 JSON 数据中获取名为 'key' 的值，并将其赋给 key 变量。

value = request.json['value'] 从请求的 JSON 数据中获取名为 'value' 的值，并将其赋给 value 变量。

if key and value and type(key) is str and '_.' not in key: 检查条件，确保 'key' 和 'value' 非空，且 'key' 的类型为字符串，并且 'key' 中不包含 '_.'。这是对请求参数的验证。

pollute = Pollute() 创建一个名为 pollute 的对象，可能是某个类的实例化对象。

pydash.set_(pollute, key, value) 使用 pydash 库中的 set_ 函数，将 value 设置到 pollute 对象的 key 属性中。这可能是在操作对象的属性赋值。

return text("success") 返回一个响应，其中包含文本内容 "success"。这将作为成功的响应发送给客户端。

return text("forbidden") 如果条件检查不通过，返回一个响应，其中包含文本内容 "forbidden"。这将作为禁止访问的响应发送给客户端。

所以我们要绕过adm；n的限制，因为这里从session提取，所以会在;进行截断，所以不能直接传，看了师傅的wp说是**RFC2068**

所以我们传cookie:adm\073n即可
![](https://pic.imgdb.cn/item/666ed600d9c307b7e979e2bb.png)

在cookie中找到session，
![](https://pic.imgdb.cn/item/666ed62fd9c307b7e97a3eb3.png)

我们的目的是污染file使它可以在flag所在的文件下，所以我们先尝试污染

```
{"key":".__init__\\\\.__globals__\\\\.__file__","value": "/etc/passwd"}
```

![](https://pic.imgdb.cn/item/666ed6b2d9c307b7e97b35e0.png)


success，访问/src

![](https://pic.imgdb.cn/item/666ed6e8d9c307b7e97b9ff5.png)




![](https://pic.imgdb.cn/item/666edad6d9c307b7e9835301.png)

![](https://pic.imgdb.cn/item/666edafad9c307b7e9839b29.png)

后面是需要本地启动sanic去做，但是显然我不会，等我有时间再来研究这个


~~留个爪~~


