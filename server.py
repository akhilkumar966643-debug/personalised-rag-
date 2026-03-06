import http.server
import socketserver
import json
import random

PORT = 8000

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Adding CORS headers for testing
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def do_POST(self):
        if self.path == '/api/chat':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            user_msg = data.get('message', '').lower()
            
            # Simple mocked RAG logic based on keywords
            if 'physics' in user_msg or 'quantum' in user_msg:
                reply = "Based on the Physics curriculum materials in your RAG state, Quantum Superposition means a particle can be in multiple states at once. Let's do a practice problem?"
            elif 'math' in user_msg or 'algebra' in user_msg:
                reply = "I see you're struggling with linear algebra. Let's break down matrix multiplication step-by-step."
            else:
                responses = [
                    "I analyzed your past performance. You usually do better with visual aids. Would you like me to generate a diagram?",
                    "That's a great question! I've linked a specific curriculum section to your dashboard for review.",
                    "Correct! You're making excellent progress on this topic today."
                ]
                reply = random.choice(responses)
                
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'reply': f"[RAG Tutor]: {reply}"}).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
    print(f"Serving Lumina RAG Tutor App at http://localhost:{PORT}")
    httpd.serve_forever()
