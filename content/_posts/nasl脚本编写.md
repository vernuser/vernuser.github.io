---
title: openvas
date: 2025年3月11日
updated: 2025年3月11日
tags:
  - 工具
  - openvas
categories: 工具
keywords:
description: 工具

---
## openvas调研

openvas是nessus项目分支，基于B/S框架进行工作，执行扫描并提供扫描结果

安装的话kali或者ubuntu都可以，

如果我没记错应该是
```
apt-get install gvm
```

检查是
```
gvm-check-setup
```

启动是
```
gvm-start
```
如果出现了

```
[>] Please wait for the GVM services to start.
[>]
[>] You might need to refresh your browser once it opens.
[>]
[>]  Web UI (Greenbone Security Assistant): https://127.0.0.1:9392

● gsad.service - Greenbone Security Assistant daemon (gsad)
     Loaded: loaded (/usr/lib/systemd/system/gsad.service; disabled; preset: disabled)
     Active: active (running) since Mon 2025-03-31 13:42:28 CST; 65ms ago
 Invocation: ecffdcc6ce684dfb907bdb1c0014c502
       Docs: man:gsad(8)
             https://www.greenbone.net
   Main PID: 235214 (gsad)
      Tasks: 1 (limit: 4511)
     Memory: 2M (peak: 2M)
        CPU: 22ms
     CGroup: /system.slice/gsad.service
             ├─235214 /usr/sbin/gsad --foreground --listen 0.0.0.0 --port 9392
             └─235216 /usr/sbin/gsad --foreground --listen 0.0.0.0 --port 9392

3月 31 13:42:28 kawakaze systemd[1]: Starting gsad.service - Greenbone Security Assistant daemon (gsad)...
3月 31 13:42:28 kawakaze systemd[1]: Started gsad.service - Greenbone Security Assistant daemon (gsad).

● gvmd.service - Greenbone Vulnerability Manager daemon (gvmd)
     Loaded: loaded (/usr/lib/systemd/system/gvmd.service; disabled; preset: disabled)
     Active: active (running) since Mon 2025-03-31 13:42:23 CST; 5s ago
 Invocation: a7b7ce4ca6fd433e8abc52934746f188
       Docs: man:gvmd(8)
    Process: 234620 ExecStart=/usr/sbin/gvmd --osp-vt-update=/run/ospd/ospd.sock --listen-group=_gvm (code=exited, status=0/SUCCESS)
   Main PID: 234621 (gvmd)
      Tasks: 1 (limit: 4511)
     Memory: 211.3M (peak: 339.9M)
        CPU: 4.707s
     CGroup: /system.slice/gvmd.service
             └─234621 "gvmd: Waiting " --osp-vt-update=/run/ospd/ospd.sock --listen-group=_gvm

3月 31 13:42:15 kawakaze systemd[1]: Starting gvmd.service - Greenbone Vulnerability Manager daemon (gvmd)...
3月 31 13:42:15 kawakaze systemd[1]: gvmd.service: Can't open PID file /run/gvmd/gvmd.pid (yet?) after start: No such file or directory
3月 31 13:42:23 kawakaze systemd[1]: Started gvmd.service - Greenbone Vulnerability Manager daemon (gvmd).

● ospd-openvas.service - OSPd Wrapper for the OpenVAS Scanner (ospd-openvas)
     Loaded: loaded (/usr/lib/systemd/system/ospd-openvas.service; disabled; preset: disabled)
     Active: active (running) since Mon 2025-03-31 13:42:15 CST; 12s ago
 Invocation: 3052909356974660937e6cc23f5107e1
       Docs: man:ospd-openvas(8)
             man:openvas(8)
    Process: 234594 ExecStart=/usr/bin/ospd-openvas --config /etc/gvm/ospd-openvas.conf --log-config /etc/gvm/ospd-logging.conf (code=exited, status=0/SUCCESS)
   Main PID: 234600 (ospd-openvas)
      Tasks: 5 (limit: 4511)
     Memory: 132.4M (peak: 161.1M)
        CPU: 2.753s
     CGroup: /system.slice/ospd-openvas.service
             ├─234600 /usr/bin/python3 /usr/bin/ospd-openvas --config /etc/gvm/ospd-openvas.conf --log-config /etc/gvm/ospd-logging.conf
             └─234602 /usr/bin/python3 /usr/bin/ospd-openvas --config /etc/gvm/ospd-openvas.conf --log-config /etc/gvm/ospd-logging.conf

3月 31 13:42:14 kawakaze systemd[1]: Starting ospd-openvas.service - OSPd Wrapper for the OpenVAS Scanner (ospd-openvas)...
3月 31 13:42:15 kawakaze systemd[1]: Started ospd-openvas.service - OSPd Wrapper for the OpenVAS Scanner (ospd-openvas).

[>] Opening Web UI (https://127.0.0.1:9392) in: 5... 4... 3... 2... 1...
```

说明启动成功了，（因为我第一次安装的时候不知道为什么安装成功了,check检查没问题，但是就是启动不起来）

接下来就是打开本地的9392端口

更新openvas插件是
```
sudo greenbone-nvt-sync
```

```/var/lib/openvas/plugins```

openvas所有的脚本都在里面，
如果想要找到某一个脚本，可以试一下我这个代码
```
import os
def search_in_file(file_path, search_string):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            for line in file:
                if search_string in line:
                    return True
    except (UnicodeDecodeError, IOError):
        pass
    return False
def search_in_directory(directory, search_string, output_file):
    with open(output_file, 'w', encoding='utf-8') as outfile:
        for root, _, files in os.walk(directory):
            for file in files:
                file_path = os.path.join(root, file)
                if search_in_file(file_path, search_string):
                    outfile.write(f"{file_path}\n")
if __name__ == "__main__":
    current_directory = os.getcwd()
    search_string = input("CVE编号:")
    output_file = search_string + "_search_result.txt"
    search_in_directory(current_directory, search_string, output_file)
    print(f"Search results saved to: {output_file}")

```

编写openvas脚本的时候，有个问题，就是当我编写sql延时注入的时候，回显是.....，而且等很久没有其他输出，就很奇怪