import json
import random
from http.server import BaseHTTPRequestHandler


class handler(BaseHTTPRequestHandler):

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)

        try:
            data = json.loads(post_data.decode('utf-8'))
        except Exception:
            data = {}

        user_msg = data.get('message', '').lower()

        # Mocked RAG logic based on keywords
        if 'physics' in user_msg or 'quantum' in user_msg:
            reply = "Based on the Physics curriculum materials in your RAG state, Quantum Superposition means a particle can be in multiple states at once. Let's do a practice problem?"
        elif 'math' in user_msg or 'algebra' in user_msg:
            reply = "I see you're studying linear algebra. Let's break down matrix multiplication step-by-step."
        elif 'schrodinger' in user_msg or 'equation' in user_msg:
            reply = "The Schrödinger equation tells us how the quantum state changes in time. Based on your learning curve, maybe we should review partial derivatives first?"
        elif 'chemistry' in user_msg:
            reply = "Great question on Chemistry! Let me retrieve the relevant curriculum module for atomic orbitals and electron configuration."
        elif 'history' in user_msg:
            reply = "I've pulled up curriculum-aligned content on Historical Analysis. Your performance on recent quizzes shows strength in modern history!"
        else:
            responses = [
                "I analyzed your past performance. You usually do better with visual aids. Would you like me to generate a diagram?",
                "That's a great question! I've linked a specific curriculum section to your dashboard for review.",
                "Correct! You're making excellent progress on this topic today.",
                "Based on your learning history, I recommend reviewing the prerequisite concepts first. Shall we start there?",
                "Interesting approach! Let me cross-reference this with your knowledge graph to find connected concepts."
            ]
            reply = random.choice(responses)

        response_body = json.dumps({'reply': f"[RAG Tutor]: {reply}"}).encode('utf-8')

        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-Length', str(len(response_body)))
        self.end_headers()
        self.wfile.write(response_body)
