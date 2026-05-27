# AgentHub 技术设计文档

## 技术目标

Demo 版本优先满足比赛展示：无需复杂环境即可运行，并完整体现 IM、多 Agent 调度、产物预览、Diff 应用和部署状态。真实产品版本可以在当前架构上替换模拟 Adapter 为真实模型与 Agent 平台接口。

## 当前架构

```text
app/index.html
  ├─ Sidebar：会话列表、Agent 联系人、自建 Agent
  ├─ ChatPanel：消息流、上下文、输入框、消息操作
  └─ Workspace：网页预览、源码查看、版本历史
app/app.js
  ├─ ConversationStore：会话、消息、pinned context
  ├─ AgentRegistry：Agent 元信息与能力标签
  ├─ OrchestratorSimulator：任务拆解和多 Agent 回复
  ├─ ArtifactRenderer：Diff、代码、预览、部署卡片
  └─ WorkspaceController：预览、代码、版本同步
```

## 数据模型

```ts
type Agent = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
  tags: string[];
  prompt: string;
};

type Conversation = {
  id: string;
  title: string;
  type: "single" | "group";
  pinned: boolean;
  archived: boolean;
  members: string[];
  messages: Message[];
  pinnedContext: string[];
};

type Message = {
  id: string;
  sender: string;
  text: string;
  artifact?: Artifact;
  createdAt: string;
};

type Artifact =
  | { type: "preview"; title: string }
  | { type: "code"; title: string; code: string }
  | { type: "diff"; title: string; lines: string[] }
  | { type: "deploy"; title: string; url: string };
```

## 调度流程

```text
用户消息
  ↓
解析 @mention 与任务关键词
  ↓
Orchestrator 生成任务计划
  ↓
按能力标签选择 Agent
  ↓
Agent 产出结构化消息与 artifact
  ↓
消息流渲染 + Workspace 同步
  ↓
用户应用 Diff / 部署 / 继续追问
```

当前 Demo 使用 `simulateAgents()` 模拟多 Agent 顺序回复。真实版本可以替换为统一 Adapter：

```ts
interface AgentAdapter {
  send(input: {
    messages: Message[];
    pinnedContext: string[];
    tools: ToolDefinition[];
  }): Promise<AgentResponse>;
}
```

## 真实接入方案

- `CodexAdapter`：接入 Codex CLI 或 OpenAI API，负责代码生成、Diff、测试建议。
- `ClaudeCodeAdapter`：接入 Claude Code，负责架构、重构和复杂代码解释。
- `OpenCodeAdapter`：接入 OpenCode，负责开源 CLI、本地工程任务和自动化脚本。
- `ArkModelAdapter`：接入火山方舟模型，作为通用对话和 Orchestrator 模型。

建议后端提供以下接口：

| API | 方法 | 说明 |
| --- | --- | --- |
| `/api/conversations` | GET/POST | 读取或创建会话 |
| `/api/conversations/:id/messages` | GET/POST | 消息读取与发送 |
| `/api/agents` | GET/POST | Agent 列表与自建 Agent |
| `/api/orchestrate` | POST | Orchestrator 任务拆解 |
| `/api/artifacts/:id/apply` | POST | 应用 Diff 或产物变更 |
| `/api/deployments` | POST | 创建部署任务 |

## 上下文管理

- 短期上下文：当前会话最近 N 条消息。
- 长期上下文：用户 pin 的关键消息、项目规则、代码结构摘要。
- 产物上下文：当前 artifact 的文件树、版本号、Diff 和部署记录。
- 安全上下文：密钥、私有文件、部署权限不得直接进入模型消息。

## 冲突处理

- 同一文件多个 Agent 生成 Diff 时，先按文件路径分组。
- 无重叠区块可自动合并。
- 重叠区块进入冲突卡片，由 Orchestrator 总结差异，用户选择保留版本。
- 关键变更应用前生成版本快照，便于回滚。

## 部署方案

Demo 中部署为模拟卡片。真实版本可支持三类部署：

1. 静态站点：上传构建产物到对象存储或 Vercel/Netlify。
2. 容器部署：根据 Dockerfile 构建镜像并推送到云服务。
3. 源码打包：生成 zip 包，保留 README、运行脚本和环境变量模板。

## 安全设计

- API Key 只存放在 `.env` 或云端 Secret Manager。
- 前端不得直接暴露模型密钥。
- Agent 调用工具前需要能力白名单和权限检查。
- 文件写入、部署、删除等高风险操作需要用户确认。
- 对外发布前扫描敏感信息。

## 本地运行

```bash
python -m http.server 5173
```

访问：

```text
http://localhost:5173/app/
```

