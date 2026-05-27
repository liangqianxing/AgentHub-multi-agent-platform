const agents = [
  { id: "orchestrator", name: "Orchestrator", role: "主 Agent", avatar: "O", color: "#7c3aed", tags: ["任务拆解", "调度", "冲突处理"], prompt: "理解用户目标，拆解任务并协调其他 Agent。" },
  { id: "codex", name: "Codex", role: "代码 Agent", avatar: "C", color: "#06b6d4", tags: ["代码生成", "Diff", "测试"], prompt: "实现代码改动并输出可应用 Diff。" },
  { id: "claude", name: "Claude Code", role: "架构 Agent", avatar: "CC", color: "#f59e0b", tags: ["架构", "重构", "解释"], prompt: "给出架构设计、边界和工程化建议。" },
  { id: "opencode", name: "OpenCode", role: "开源 Agent", avatar: "OC", color: "#22c55e", tags: ["开源方案", "CLI", "本地执行"], prompt: "偏向开源工具链和本地自动化。" },
  { id: "designer", name: "Designer", role: "体验 Agent", avatar: "D", color: "#ec4899", tags: ["UI", "交互", "动效"], prompt: "设计清晰、美观且可演示的用户体验。" },
  { id: "deployer", name: "Deployer", role: "发布 Agent", avatar: "DP", color: "#14b8a6", tags: ["部署", "监控", "回滚"], prompt: "处理构建、部署状态和预览地址。" },
];

let previewVersion = 0;

function buildArtifactHtml(version = 0) {
  if (version === 0) {
    return `<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"><style>
body{margin:0;font-family:Inter,system-ui;background:#0f172a;color:white}.hero{min-height:100vh;display:grid;place-items:center;padding:48px;background:radial-gradient(circle at 20% 20%,#7c3aed55,transparent 30rem),radial-gradient(circle at 80% 10%,#06b6d455,transparent 26rem),#0f172a}.card{max-width:760px;padding:44px;border:1px solid #ffffff24;border-radius:32px;background:#ffffff12;box-shadow:0 30px 90px #0008}h1{font-size:52px;line-height:1.05;margin:0 0 18px}.pill{display:inline-flex;padding:8px 12px;border-radius:999px;background:#22c55e22;color:#bbf7d0;margin-bottom:18px}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:24px}.item{padding:16px;border-radius:18px;background:#02061788}</style></head><body><section class="hero"><div class="card"><div class="pill">预览 V0 · 初稿</div><h1>用多 Agent 构建你的 AI 作品集</h1><p>Orchestrator 负责拆解任务，Codex 生成代码，Designer 打磨体验，Deployer 一键发布。</p><div class="grid"><div class="item">首页叙事</div><div class="item">项目卡片</div><div class="item">部署状态</div></div></div></section></body></html>`;
  }
  return `<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"><style>
body{margin:0;font-family:Inter,system-ui;background:#020617;color:#0f172a}.page{min-height:100vh;padding:36px;background:linear-gradient(135deg,#e0f2fe,#f5f3ff 46%,#dcfce7)}.nav{display:flex;justify-content:space-between;align-items:center;margin:0 auto 34px;max-width:1040px}.logo{font-weight:900;color:#4c1d95}.deploy{padding:10px 16px;border-radius:999px;background:#111827;color:white}.hero{max-width:1040px;margin:auto;display:grid;grid-template-columns:1.05fr .95fr;gap:28px;align-items:center}.badge{display:inline-flex;padding:8px 12px;border-radius:999px;background:#16a34a;color:white;font-weight:800;margin-bottom:14px}.copy{padding:34px;border-radius:34px;background:white;box-shadow:0 30px 90px #64748b45}h1{font-size:56px;line-height:1.02;margin:0 0 16px;color:#111827;letter-spacing:-.06em}p{font-size:18px;line-height:1.7;color:#475569}.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}.item{padding:18px;border-radius:22px;background:#111827;color:white;min-height:116px}.item strong{display:block;color:#67e8f9;margin-bottom:8px}.side{display:grid;gap:14px}.panel{padding:20px;border-radius:26px;background:#ffffffb8;border:1px solid #fff;box-shadow:0 20px 70px #64748b33}.changed{position:fixed;right:24px;bottom:24px;padding:12px 16px;border-radius:999px;background:#16a34a;color:white;font-weight:900;box-shadow:0 18px 50px #16a34a66}@media(max-width:780px){.hero{grid-template-columns:1fr}h1{font-size:42px}}</style></head><body><main class="page"><nav class="nav"><div class="logo">AgentHub Portfolio</div><div class="deploy">已应用 Diff · V${version}</div></nav><section class="hero"><div class="copy"><div class="badge">✅ 预览已明显更新</div><h1>AI 作品集网站新版首页</h1><p>这不是微调文字，而是应用 Diff 后的新版本：浅色落地页、双栏 Hero、项目卡片、部署 CTA 和版本标识都已更新。</p><div class="grid"><div class="item"><strong>01 首页叙事</strong>讲清楚作品价值和多 Agent 协作方式。</div><div class="item"><strong>02 项目卡片</strong>突出案例、指标、技术栈和预览入口。</div></div></div><div class="side"><div class="panel"><b>部署状态</b><p>构建通过，预览 URL 已生成，可一键回滚。</p></div><div class="panel"><b>Agent 分工</b><p>Designer 优化视觉，Codex 应用 Diff，Deployer 发布版本。</p></div></div></section><div class="changed">Preview V${version} · Diff 已生效</div></main></body></html>`;
}

let artifactHtml = buildArtifactHtml(previewVersion);

let codeText = `function PortfolioHero() {
  return (
    <section className="hero">
      <Badge>AI Portfolio · Live Preview</Badge>
      <h1>用多 Agent 构建你的 AI 作品集</h1>
      <p>Orchestrator 拆解任务，Codex 生成代码，Designer 打磨体验。</p>
    </section>
  );
}`;

let conversations = [
  {
    id: "c1",
    title: "AgentHub 需求评审",
    type: "group",
    pinned: true,
    archived: false,
    members: ["orchestrator", "codex", "claude", "opencode", "designer", "deployer"],
    messages: [
      makeMessage("orchestrator", "我会作为主 Agent 协调任务。你可以 @ 任意 Agent，也可以直接描述目标，我会拆解为产品、代码、设计和部署子任务。"),
      makeMessage("claude", "架构侧建议把项目分为 Adapter、Conversation、Artifact、Deployment 四层。Demo 里先用前端状态模拟，后续替换为真实 API 即可。"),
      makeMessage("codex", "我已准备好输出代码块和 Diff 卡片。你可以发送“做一个作品集网站并部署”，我会把变更放到聊天流里。", { type: "code", title: "Agent 接入接口草案", code: "interface AgentAdapter {\n  send(messages, context, tools): Promise<AgentResponse>;\n}" }),
      makeMessage("designer", "右侧工作台支持实时预览、源码查看和版本历史，适合答辩时展示完整闭环。", { type: "preview", title: "网页预览卡片" }),
      makeMessage("opencode", "本地演示建议保持零依赖：python -m http.server 5173。评委打开地址即可看到完整流程。"),
      makeMessage("deployer", "部署模块会以状态卡片展示：构建、发布、预览 URL、回滚版本。真实版本可接 Vercel、对象存储或容器平台。", { type: "deploy", title: "部署状态卡片", url: "https://agenthub.demo/site/portfolio" }),
    ],
    pinnedContext: ["竞赛目标：产品设计文档 + 技术文档 + 可运行 Demo + AI 协作记录 + 3 分钟 Demo 视频。"],
  },
  {
    id: "c2",
    title: "Codex 单聊：组件实现",
    type: "single",
    pinned: false,
    archived: false,
    members: ["codex"],
    messages: [makeMessage("codex", "把明确的开发任务发给我，我会返回实现计划、代码块和可应用 Diff。")],
    pinnedContext: [],
  },
];

let versions = [
  { title: "v0 初始作品集", desc: "包含 Hero、项目卡片和 Agent 协作说明。", time: "09:30" },
  { title: "v1 应用 Codex Diff", desc: "增强视觉层次并补齐部署 CTA。", time: "09:42" },
];

let activeConversationId = "c1";

const $ = (selector) => document.querySelector(selector);
const conversationList = $("#conversationList");
const agentList = $("#agentList");
const messageList = $("#messageList");
const messageInput = $("#messageInput");

function makeMessage(sender, text, artifact = null) {
  return { id: crypto.randomUUID(), sender, text, artifact, createdAt: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }) };
}

function getAgent(id) {
  return agents.find((agent) => agent.id === id) || { name: "你", avatar: "U", color: "#64748b", role: "用户", tags: [] };
}

function activeConversation() {
  return conversations.find((conversation) => conversation.id === activeConversationId);
}

function render() {
  renderConversations();
  renderAgents();
  renderMessages();
  renderHeader();
  renderMentions();
  renderWorkspace();
}

function renderConversations() {
  const keyword = $("#conversationSearch").value.trim().toLowerCase();
  conversationList.innerHTML = conversations
    .filter((conversation) => !conversation.archived)
    .filter((conversation) => conversation.title.toLowerCase().includes(keyword) || conversation.members.some((id) => getAgent(id).name.toLowerCase().includes(keyword)))
    .sort((a, b) => Number(b.pinned) - Number(a.pinned))
    .map((conversation) => {
      const last = conversation.messages.at(-1)?.text || "暂无消息";
      return `<div class="conversation ${conversation.id === activeConversationId ? "active" : ""}" data-id="${conversation.id}">
        <div class="avatar" style="background:${conversation.type === "group" ? "#7c3aed" : getAgent(conversation.members[0]).color}">${conversation.type === "group" ? "群" : getAgent(conversation.members[0]).avatar}</div>
        <div class="meta"><strong>${conversation.pinned ? "📌 " : ""}${conversation.title}</strong><span>${last.slice(0, 34)}</span></div>
      </div>`;
    }).join("");
}

function renderAgents() {
  agentList.innerHTML = agents.map((agent) => `<div class="agent-card" data-agent="${agent.id}">
    <div class="avatar" style="background:${agent.color}">${agent.avatar}</div>
    <div class="meta"><strong>${agent.name}</strong><span>${agent.role}</span><div>${agent.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div></div>
  </div>`).join("");
}

function renderHeader() {
  const conversation = activeConversation();
  $("#chatMode").textContent = conversation.type === "group" ? "群聊协作" : "单聊模式";
  $("#chatTitle").textContent = conversation.title;
  $("#chatSubtitle").textContent = conversation.members.map((id) => getAgent(id).name).join("、");
  const pinned = $("#pinnedContext");
  pinned.classList.toggle("hidden", conversation.pinnedContext.length === 0);
  pinned.textContent = `已 Pin 上下文：${conversation.pinnedContext.join("；")}`;
}

function renderMentions() {
  const conversation = activeConversation();
  $("#mentionBar").innerHTML = conversation.members.map((id) => `<span class="mention" data-mention="${getAgent(id).name}">@${getAgent(id).name}</span>`).join("");
}

function renderMessages() {
  const conversation = activeConversation();
  messageList.innerHTML = conversation.messages.map((message) => renderMessage(message)).join("");
  messageList.scrollTop = messageList.scrollHeight;
}

function renderMessage(message) {
  const agent = getAgent(message.sender);
  const isUser = message.sender === "user";
  return `<article class="message ${isUser ? "user" : ""}" data-message="${message.id}">
    <div class="avatar" style="background:${agent.color}">${agent.avatar}</div>
    <div class="bubble">
      <div class="message-head"><strong>${agent.name}</strong><span>${message.createdAt}</span></div>
      <div class="message-text">${escapeHtml(message.text)}</div>
      ${message.artifact ? renderArtifact(message.artifact) : ""}
      <div class="message-actions">
        <button class="ghost" data-action="quote">引用</button>
        <button class="ghost" data-action="pin">Pin</button>
        <button class="ghost" data-action="copy">复制</button>
        ${!isUser ? `<button class="ghost" data-action="regen">重新生成</button>` : ""}
      </div>
    </div>
  </article>`;
}

function renderArtifact(artifact) {
  if (artifact.type === "diff") {
    return `<div class="artifact"><div class="artifact-header"><span>${artifact.title}</span><button data-action="apply-diff">应用 Diff</button></div><div class="artifact-body"><pre>${artifact.lines.map((line) => `<span class="diff-line ${line.startsWith("+") ? "diff-add" : line.startsWith("-") ? "diff-del" : ""}">${escapeHtml(line)}</span>`).join("")}</pre></div></div>`;
  }
  if (artifact.type === "deploy") {
    return `<div class="artifact"><div class="artifact-header"><span>${artifact.title}</span><span>Ready</span></div><div class="artifact-body status"><div class="status-row"><span>构建</span><strong>通过</strong></div><div class="status-row"><span>静态发布</span><strong>${artifact.url}</strong></div><div class="progress"><span></span></div></div></div>`;
  }
  if (artifact.type === "code") {
    return `<div class="artifact"><div class="artifact-header"><span>${artifact.title}</span><button data-action="copy-code">复制代码</button></div><div class="artifact-body"><pre><code>${escapeHtml(artifact.code)}</code></pre></div></div>`;
  }
  return `<div class="artifact"><div class="artifact-header"><span>${artifact.title}</span><button data-action="open-preview">展开预览</button></div><div class="artifact-body">右侧工作台已同步最新网页预览。</div></div>`;
}

function renderWorkspace() {
  $("#artifactFrame").srcdoc = artifactHtml;
  $("#previewUrl").textContent = `https://agenthub.demo/site/portfolio?v=${previewVersion}`;
  $("#previewBadge").textContent = previewVersion === 0 ? "V0 初稿" : `V${previewVersion} 已更新`;
  $("#codeViewer").textContent = codeText;
  $("#versionHistory").innerHTML = versions.map((version) => `<div class="history-item"><strong>${version.title}</strong><span>${version.time}</span><p>${version.desc}</p></div>`).join("");
}

function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;
  const conversation = activeConversation();
  conversation.messages.push(makeMessage("user", text));
  messageInput.value = "";
  render();
  simulateAgents(text, conversation);
}

function runDemo() {
  messageInput.value = "@Orchestrator 帮我做一个 AI 作品集网站，包含首页、项目卡片和一键部署。";
  sendMessage();
}

function simulateAgents(text, conversation) {
  const lower = text.toLowerCase();
  const wantsDeploy = text.includes("部署") || lower.includes("deploy");
  const wantsCode = text.includes("代码") || text.includes("网站") || lower.includes("code");
  const plan = [
    ["orchestrator", `我已读取当前会话上下文，并将任务拆成 4 个子任务：\n1. Designer 产出信息架构与视觉方向。\n2. Claude Code 校验组件边界和数据结构。\n3. Codex 生成可应用 Diff 与代码。\n4. Deployer 在产物通过后生成预览地址。`],
    ["designer", "建议采用三栏答辩布局：左侧会话、中间 Agent 协作流、右侧产物工作台。作品集网站使用深色科技风，突出项目卡片、能力标签和部署 CTA。", { type: "preview", title: "设计预览卡片" }],
    ["claude", "架构建议：把 AgentAdapter、ConversationStore、ArtifactRenderer、DeploymentService 分层。真实接入时只替换 adapter.send(messages, tools)，UI 和调度逻辑保持稳定。"],
  ];
  if (wantsCode) {
    plan.push(["codex", "我生成了一个面向作品集首页的 Diff，可直接应用到右侧预览。", { type: "diff", title: "portfolio-home.diff", lines: ["--- app/PortfolioHero.tsx", "+++ app/PortfolioHero.tsx", "- <h1>AI Portfolio</h1>", "+ <h1>用多 Agent 构建你的 AI 作品集</h1>", "+ <ProjectGrid items={featuredProjects} />", "+ <DeployCTA status=\"ready\" />"] }]);
    plan.push(["opencode", "我补充本地运行方案：静态 Demo 可用 python -m http.server 5173 运行；真实版本建议用 Vite + API Router 代理模型调用。", { type: "code", title: "本地启动命令", code: "python -m http.server 5173\n# open http://localhost:5173/app/" }]);
  }
  if (wantsDeploy) {
    plan.push(["deployer", "部署流水线已创建：构建静态产物、生成预览 URL、记录版本并支持回滚。", { type: "deploy", title: "部署状态卡片", url: "https://agenthub.demo/site/portfolio" }]);
  }
  plan.push(["orchestrator", "已聚合各 Agent 结果。下一步你可以点击 Diff 的“应用 Diff”更新预览，或继续要求我局部修改某个模块。"]);
  plan.forEach((item, index) => {
    setTimeout(() => {
      conversation.messages.push(makeMessage(item[0], item[1], item[2] || null));
      render();
    }, 500 + index * 520);
  });
}

function applyDiff() {
  previewVersion += 1;
  artifactHtml = buildArtifactHtml(previewVersion);
  codeText += `\n\nconst featuredProjects = ["AgentHub", "AI Portfolio", "Deploy Board"];`;
  versions.unshift({ title: `v${versions.length} 应用 Diff`, desc: "从聊天流一键应用代码变更，并刷新网页预览。", time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }) });
  activeConversation().messages.push(makeMessage("codex", "Diff 已应用，右侧预览和版本历史已更新。", { type: "preview", title: "更新后的网页预览" }));
  render();
}

function deploy() {
  activeConversation().messages.push(makeMessage("deployer", "收到部署指令，已完成静态构建并生成预览 URL。", { type: "deploy", title: "部署状态卡片", url: "https://agenthub.demo/site/portfolio" }));
  render();
}

function escapeHtml(value) {
  return value.replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
}

document.addEventListener("click", (event) => {
  const conversationEl = event.target.closest(".conversation");
  if (conversationEl) { activeConversationId = conversationEl.dataset.id; render(); }
  const mention = event.target.closest(".mention");
  if (mention) { messageInput.value += `${messageInput.value ? " " : ""}@${mention.dataset.mention} `; messageInput.focus(); }
  const action = event.target.dataset.action;
  const messageEl = event.target.closest(".message");
  const message = messageEl ? activeConversation().messages.find((item) => item.id === messageEl.dataset.message) : null;
  if (action === "apply-diff") applyDiff();
  if (action === "open-preview") document.querySelector('[data-tab="preview"]').click();
  if (action === "copy" && message) navigator.clipboard?.writeText(message.text);
  if (action === "copy-code") navigator.clipboard?.writeText(codeText);
  if (action === "quote" && message) { messageInput.value = `> ${message.text.slice(0, 80)}\n`; messageInput.focus(); }
  if (action === "pin" && message) { activeConversation().pinnedContext.push(message.text.slice(0, 80)); render(); }
  if (action === "regen" && message) { activeConversation().messages.push(makeMessage(message.sender, `${message.text}\n\n（重新生成版本：补充了边界条件和下一步建议。）`, message.artifact)); render(); }
});

$("#sendButton").addEventListener("click", sendMessage);
$("#demoButton").addEventListener("click", runDemo);
$("#guideButton").addEventListener("click", () => $("#guidePanel").classList.toggle("hidden"));
$("#closeGuideButton").addEventListener("click", () => $("#guidePanel").classList.add("hidden"));
document.querySelectorAll(".preset").forEach((button) => button.addEventListener("click", () => {
  messageInput.value = button.dataset.prompt;
  messageInput.focus();
}));
messageInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); sendMessage(); }
});
$("#conversationSearch").addEventListener("input", renderConversations);
$("#deployButton").addEventListener("click", deploy);
$("#refreshPreviewButton").addEventListener("click", renderWorkspace);
$("#pinSummaryButton").addEventListener("click", () => {
  const conversation = activeConversation();
  conversation.pinnedContext.push(`会话摘要：共 ${conversation.messages.length} 条消息，成员 ${conversation.members.map((id) => getAgent(id).name).join("、")}。`);
  render();
});
document.querySelectorAll(".tab").forEach((tab) => tab.addEventListener("click", () => {
  document.querySelectorAll(".tab, .workspace-panel").forEach((el) => el.classList.remove("active"));
  tab.classList.add("active");
  $(`#${tab.dataset.tab}Panel`).classList.add("active");
}));
$("#newChatButton").addEventListener("click", () => $("#chatDialog").showModal());
$("#newAgentButton").addEventListener("click", () => $("#agentDialog").showModal());
$("#createChatConfirm").addEventListener("click", () => {
  const type = $("#chatTypeInput").value;
  const id = crypto.randomUUID();
  conversations.unshift({ id, title: $("#chatNameInput").value || "新的 Agent 任务", type, pinned: false, archived: false, members: type === "group" ? ["orchestrator", "codex", "designer", "deployer"] : ["codex"], messages: [makeMessage(type === "group" ? "orchestrator" : "codex", "对话已创建，请描述你的目标。")], pinnedContext: [] });
  activeConversationId = id;
  render();
});
$("#createAgentConfirm").addEventListener("click", () => {
  const name = $("#agentNameInput").value || "Custom Agent";
  const id = name.toLowerCase().replace(/\W+/g, "-") + Date.now();
  agents.push({ id, name, role: "自定义 Agent", avatar: name.slice(0, 2).toUpperCase(), color: "#64748b", tags: $("#agentTagsInput").value.split(/[,，]/).map((tag) => tag.trim()).filter(Boolean), prompt: $("#agentPromptInput").value });
  activeConversation().members.push(id);
  render();
});

render();
