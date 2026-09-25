---
title: AI agent
datas: 2026.7.7
updated: 2026年7月7日
tags:
  - ai
categories:
  - ai
keywords:
description:
  - functions describe the world
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
swiper_index:
---
# 什么是agent
AI Agent（智能体） 是一个具备以下三大能力的智能系统：
1. 自主感知：能够理解当前环境和任务需求
2. 自主决策：能够制定执行计划并动态调整
3. 自主执行：能够调用工具完成实际任务

# Agent核心架构
整个架构可以分为四个核心层：
## 第一层：感知层
- 作用：理解并接收用户输入
- 组件：用户输入->大模型理解
## 第二层：认知层
- 作用：分析，推理，规划
- 组件：推理引擎+规划模块+LLM Brain
## 第三层：执行层（Execution Layer）
- 作用：调用各种工具完成任务
- 组件：工具集（搜索、代码、API等）
## 第四层：记忆层（Memory Layer）
- 作用：存储和检索信息
- 组件：短期记忆 + 长期记忆

用一个例子说明数据在架构中怎么流转的：

***任务：找到2024年诺贝尔物理学奖获得者并总结他们的主要贡献***
```

步骤1: 用户输入
   → 进入规划模块：识别需要「搜索」和「总结」两个步骤

步骤2: 规划完成
   → 进入推理引擎（ReAct框架）

步骤3: 第一轮思考-行动-观察循环
   Thought: "我需要搜索2024年诺贝尔物理学奖获得者"
   Action: 调用搜索工具search("2024 Nobel Prize Physics")
   Observation: 获得搜索结果→ "John Hopfield和Geoffrey Hinton"

步骤4: 第二轮思考-行动-观察循环
   Thought: "我需要了解他们的贡献"
   Action: 调用搜索工具search("Hopfield Hinton 神经网络贡献")
   Observation: 获得详细信息→ "人工神经网络和机器学习基础"

步骤5: 综合信息
   → LLM整合所有观察结果
   → 生成结构化答案
   → 存入记忆模块（长期记忆）

步骤6: 输出结果
   → 返回完整答案给用户

```

在这个过程中，agent不是一次性生成答案，而是通过多轮思考-行动-观察的循环，逐渐接近答案。

# 组成模块
## planning：
两种主流规划方法
### react框架：边想边做
[![pmDFGzn.png](https://s41.ax1x.com/2026/07/07/pmDFGzn.png)](https://imgchr.com/i/pmDFGzn)
优点：
- 灵活，可以随时根据中间结果调整计划
- 适合探索性任务
缺点：
- Token消耗大

### Plan-and-Execute
[![pmDFNLV.png](https://s41.ax1x.com/2026/07/07/pmDFNLV.png)](https://imgchr.com/i/pmDFNLV)

优点：
- 高效：只需要调用一次LLM
- 可并行处理多个任务

缺点：
-  不灵活：难以根据中间结果调整

实际代码对比：
```ReAct
from langchain.agents import create_react_agent, AgentExecutor
from langchain.tools import Tool

# 定义工具
search_tool = Tool(
    name="Search",
    func=search_function,
    description="搜索信息"
)

# 创建ReAct Agent
agent = create_react_agent(llm, [search_tool])
agent_executor = AgentExecutor(agent=agent, tools=[search_tool], verbose=True)

# 执行任务
result = agent_executor.invoke({
    "input": "找出DeepSeek-R1的训练成本，并与GPT-4对比"
})

# 输出过程（verbose=True会显示）：
# Thought: 我需要搜索DeepSeek-v4的信息
# Action: Search("DeepSeek-v4 training cost")
# Observation: [搜索结果]
# Thought: 接下来需要搜索GPT-5的成本
# Action: Search("GPT-5 training cost")
# Observation: [搜索结果]
# Thought: 现在可以进行对比了
# Final Answer: [对比结果]
```

```Plan-and-Execute
from langchain.agents import Plan, Execute

# 第一步：规划
planner = create_planner(llm)
plan = planner.plan("分析2026年AI Agent市场趋势")

# 输出的计划：
# Task 1: 搜索2026年AI Agent市场报告
# Task 2: 提取市场规模数据
# Task 3: 识别主要参与者
# Task 4: 总结趋势和预测

# 第二步：执行
executor = create_executor(tools)
results = executor.execute(plan)  # 按计划依次执行
```

## 记忆模块
agent的记忆分为两类
### Short-term Memory短期记忆
用以保存当前任务的上下文