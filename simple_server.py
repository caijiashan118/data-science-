#!/usr/bin/env python3
import http.server
import socketserver
import os
import mimetypes
from urllib.parse import urlparse

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def do_GET(self):
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # Remove leading slash and handle empty path
        if path == '/':
            path = '/index.html'
        
        # Try to serve the requested file
        file_path = os.path.join('dist', path.lstrip('/'))
        
        if os.path.exists(file_path) and os.path.isfile(file_path):
            # File exists, serve it
            self.path = path
            return super().do_GET()
        else:
            # File doesn't exist, serve index.html for SPA routing
            self.path = '/index.html'
            return super().do_GET()

    def guess_type(self, path):
        """Guess the type of a file."""
        base, ext = os.path.splitext(path)
        if ext in ['.js', '.mjs']:
            return 'application/javascript'
        elif ext == '.css':
            return 'text/css'
        elif ext == '.html':
            return 'text/html'
        elif ext == '.json':
            return 'application/json'
        elif ext == '.png':
            return 'image/png'
        elif ext == '.jpg' or ext == '.jpeg':
            return 'image/jpeg'
        elif ext == '.svg':
            return 'image/svg+xml'
        elif ext == '.ico':
            return 'image/x-icon'
        else:
            return mimetypes.guess_type(path)[0] or 'application/octet-stream'

PORT = 8080

# Change to the directory containing this script
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# Create server
with socketserver.TCPServer(("", PORT), SPAHandler) as httpd:
    print(f"🚀 AI城建系统服务器启动成功!")
    print(f"📱 本地访问地址: http://localhost:{PORT}")
    print(f"🌐 网络访问地址: http://127.0.0.1:{PORT}")
    print(f"🔗 如果在服务器上运行，请使用服务器IP地址访问")
    print(f"⚡ 按 Ctrl+C 停止服务器")
    print("-" * 50)
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 服务器已停止")
        httpd.shutdown()