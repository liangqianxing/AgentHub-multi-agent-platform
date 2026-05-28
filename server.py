import json
import os
import re
import urllib.error
import urllib.request
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


ROOT = Path(__file__).resolve().parent
ARK_CHAT_URL = os.getenv("ARK_CHAT_URL", "https://ark.cn-beijing.volces.com/api/v3/chat/completions")


def load_env() -> None:
    env_path = ROOT / ".env"
    if not env_path.exists():
        return
    for line in env_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip().lstrip("\ufeff"), value.strip().strip('"').strip("'"))


load_env()


AGENT_IDS = {"orchestrator", "designer", "claude", "codex", "opencode", "deployer"}


class AgentHubHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        path = self.path.split("?", 1)[0].rstrip("/") or "/"
        if path == "/api/health":
            self.write_json({
                "ok": True,
                "model": os.getenv("ARK_ENDPOINT_ID", ""),
                "hasKey": bool(os.getenv("ARK_API_KEY")),
            })
            return
        super().do_GET()

    def do_POST(self):
        path = self.path.split("?", 1)[0].rstrip("/") or "/"
        if path != "/api/agent-chat":
            self.send_error(404, "Not found")
            return
        try:
            payload = self.read_json()
            self.write_json(call_ark(payload))
        except Exception as exc:
            self.write_json({"ok": False, "error": str(exc)}, status=500)

    def read_json(self):
        length = int(self.headers.get("Content-Length", "0"))
        raw = self.rfile.read(length).decode("utf-8")
        return json.loads(raw or "{}")

    def write_json(self, data, status=200):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def call_ark(payload):
    api_key = os.getenv("ARK_API_KEY")
    endpoint_id = os.getenv("ARK_ENDPOINT_ID")
    if not api_key or not endpoint_id:
        raise RuntimeError("缺少 ARK_API_KEY 或 ARK_ENDPOINT_ID，请先配置 .env")

    user_text = str(payload.get("text", "")).strip()
    history = payload.get("history", [])[-12:]
    pinned_context = payload.get("pinnedContext", [])

    system_prompt = """
你是 AgentHub 的真实 Orchestrator。请模拟多 Agent 群聊协作。
你必须只输出 JSON，不要输出 Markdown 代码围栏。
JSON 格式：{"replies":[{"sender":"orchestrator|designer|claude|codex|opencode|deployer","text":"回复内容","artifact":可选}]}
要求：
1. 安排 2 到 4 条短回复。
2. 如需代码/网站/组件/修改，给 codex 回复并带 diff artifact。
3. 如需部署，给 deployer 回复并带 deploy artifact。
4. artifact 可选格式：
   {"type":"diff","title":"xxx.diff","lines":["--- file","+++ file","- old","+ new"]}
   {"type":"code","title":"代码片段","code":"..."}
   {"type":"preview","title":"预览卡片"}
   {"type":"deploy","title":"部署状态卡片","url":"https://agenthub.demo/site/portfolio"}
5. 回复要短、具体、适合展示，不要声称已经访问真实文件系统。
""".strip()

    messages = [{"role": "system", "content": system_prompt}]
    if pinned_context:
        messages.append({"role": "system", "content": "Pinned context:\n" + "\n".join(map(str, pinned_context))})
    for item in history:
        sender = item.get("sender", "user")
        role = "user" if sender == "user" else "assistant"
        name = item.get("senderName", sender)
        text = str(item.get("text", ""))[:500]
        messages.append({"role": role, "content": f"[{name}] {text}"})
    messages.append({"role": "user", "content": user_text})

    request_body = {
        "model": endpoint_id,
        "messages": messages,
        "temperature": 0.4,
        "max_tokens": 800,
    }
    req = urllib.request.Request(
        ARK_CHAT_URL,
        data=json.dumps(request_body, ensure_ascii=False).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="ignore")
        raise RuntimeError(f"火山方舟 API 返回 {exc.code}: {detail[:500]}") from exc

    content = data["choices"][0]["message"]["content"]
    return {"ok": True, "replies": normalize_replies(content), "raw": content}


def normalize_replies(content):
    text = content.strip()
    text = re.sub(r"^```(?:json)?\s*|\s*```$", "", text, flags=re.IGNORECASE | re.DOTALL).strip()
    try:
        parsed = json.loads(text)
    except json.JSONDecodeError:
        return [{"sender": "orchestrator", "text": content}]
    replies = parsed.get("replies", parsed if isinstance(parsed, list) else [])
    normalized = []
    for reply in replies:
        if not isinstance(reply, dict):
            continue
        sender = reply.get("sender", "orchestrator")
        if sender not in AGENT_IDS:
            sender = "orchestrator"
        item = {"sender": sender, "text": str(reply.get("text", "")).strip()}
        artifact = reply.get("artifact")
        if isinstance(artifact, dict) and artifact.get("type"):
            item["artifact"] = artifact
        if item["text"] or item.get("artifact"):
            normalized.append(item)
    return normalized or [{"sender": "orchestrator", "text": content}]


if __name__ == "__main__":
    port = int(os.getenv("PORT", "5173"))
    server = ThreadingHTTPServer(("127.0.0.1", port), AgentHubHandler)
    print(f"AgentHub running at http://127.0.0.1:{port}/app/")
    server.serve_forever()
