"""Locust load test: N simulated users chatting + using history endpoints.

Run (backend must be running, see backend/README.md):

    pip install -r requirements-loadtest.txt
    locust -f loadtest/locustfile.py --host http://localhost:8000

Then open http://localhost:8089, set Users = 1000, Spawn rate e.g. 50/s.
Headless 5-minute run at 1000 users:

    locust -f loadtest/locustfile.py --host http://localhost:8000 \\
        --headless -u 1000 -r 50 -t 5m

Two useful modes:
- Infra only (no Groq calls, no rate limits):
    locust ... --exclude-tags ai
- Full chat incl. POST /ask (expect HTTP 429/502s on a free Groq key —
  that IS the signal: it tells you where the provider caps you).

Each virtual user keeps a SHORT history (last 3 exchanges) so token usage
stays bounded no matter how long the run lasts.
"""

import random
import time
import uuid

from locust import HttpUser, between, tag, task

PROMPTS = [
    "Explain recursion with a short Python example.",
    "What is the difference between a list and a tuple?",
    "Reply with exactly: load test ok",
    "Summarize REST vs GraphQL in one table.",
    "How does binary search work?",
]

TITLES = ["Load chat", "Quick question", "Debug help"]


class ChatUser(HttpUser):
    wait_time = between(2.0, 6.0)  # think time between actions

    def on_start(self) -> None:
        self.user_id = f"loadtest-{uuid.uuid4().hex[:8]}"
        self.conv_id = f"conv-{uuid.uuid4().hex[:8]}"
        self.client.post(
            "/api/store_user",
            json={
                "user_id": self.user_id,
                "email": f"{self.user_id}@test.local",
                "name": "Load Tester",
            },
            name="/api/store_user",
        )

    @tag("ai")
    @task(3)
    def ask(self) -> None:
        prompt = random.choice(PROMPTS)
        history = [
            {"role": "user", "content": prompt},
        ]
        with self.client.post(
            "/ask",
            json={"messages": history},
            catch_response=True,
            name="/ask",
        ) as resp:
            if resp.status_code == 429:
                resp.success()  # provider rate limit = expected, not app failure

    @task(2)
    def save_and_list(self) -> None:
        ts = int(time.time() * 1000)
        self.client.post(
            "/api/save_conversation",
            json={
                "user_id": self.user_id,
                "conversation_id": self.conv_id,
                "title": random.choice(TITLES),
                "messages": [{"role": "user", "content": "hello"}],
                "timestamp": ts,
            },
            name="/api/save_conversation",
        )
        self.client.get(
            f"/api/get_conversations?user_id={self.user_id}",
            name="/api/get_conversations",
        )

    @task(1)
    def health(self) -> None:
        self.client.get("/health", name="/health")
