import os
import SocketServer
import SimpleHTTPServer
import urllib
import httplib
import logging

PORT = int(os.environ.get("PORT", 5000))

class Proxy(SimpleHTTPServer.SimpleHTTPRequestHandler):
    def do_POST(self):
        contentType = self.headers.getheader('content-type')
        length = int(self.headers.getheader('content-length'))
        data_string = self.rfile.read(length)
        headers = {'Content-Type': 'application/json'}
        conn = httplib.HTTPConnection("vcard-share.herokuapp.com")
        conn.request("POST", "/", data_string, headers)
        response = conn.getresponse()
        data = response.read()
        self.send_response(response.status)
        self.send_header('content-type', response.getheader('content-type'))
        self.send_header('content-length', response.getheader('content-length'))
        self.end_headers()
        self.wfile.write(data)

httpd = SocketServer.ForkingTCPServer(('', PORT), Proxy)
print "Listending on port ", PORT
httpd.serve_forever()
