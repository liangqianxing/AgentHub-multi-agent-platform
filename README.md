# AgentHub 多 Agent 协作平台

AgentHub 是一个面向挑战赛题目的可运行 Demo：以 IM 聊天为核心交互范式，把 Codex、Claude Code、OpenCode、自定义 Agent 组织成“联系人”和“群聊成员”，通过 Orchestrator 完成任务拆解、Agent 调度、产物预览、Diff 应用与部署状态展示。

## 快速运行

本项目不依赖后端服务，直接启动静态站点即可：

```bash
python -m http.server 5173
```

然后打开：

```text
http://localhost:5173/app/
```

也可以直接双击 `app/index.html` 体验核心流程。

## 已完成能力

- **IM 核心体验**：会话列表、新建单聊/群聊、搜索、置顶、归档、消息发送、引用、复制代码、重新生成。
- **多 Agent 协作**：内置 Orchestrator、Codex、Claude Code、OpenCode、Designer、Deployer，并支持创建自定义 Agent。
- **群聊调度**：输入复杂任务后，Orchestrator 会拆解为产品、前端、代码、部署等子任务并模拟并行协作。
- **富媒体产物**：消息流内联展示网页预览、代码块、Diff 卡片、文档卡片、部署状态卡片。
- **上下文管理**：支持 pin 关键消息，当前会话历史会参与模拟 Agent 回复。
- **产物工作台**：右侧实时预览网页、源码、部署记录和版本历史。
- **AI 协作沉淀**：提供 Spec、Rules、Skills 与开发日志，便于答辩展示协作范式。

## 交付物索引

- 产品设计文档：`docs/product-design.md`
- 技术设计文档：`docs/technical-design.md`
- AI 协作开发记录：`docs/ai-collaboration.md`
- 可运行 Demo：`app/index.html`
- 环境变量示例：`.env.example`

## 演示脚本

1. 打开 Demo 后选择“AgentHub 需求评审”群聊。
2. 点击顶部“一键演示”，或在输入框发送：`@Orchestrator 帮我做一个 AI 作品集网站，包含首页、项目卡片和一键部署。`
3. 观察 Orchestrator 拆解任务，多 Agent 依次返回产品方案、代码 Diff、网页预览与部署卡片。
4. 点击 Diff 卡片的“应用 Diff”，右侧预览更新为新的网页产物。
5. 点击“部署”按钮，消息流出现部署状态卡片和预览 URL。

## 安全说明

真实 API Key 不应提交到仓库。请把挑战赛提供的密钥放在本地 `.env` 或平台密钥管理中，并参考 `.env.example` 命名。
