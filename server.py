import os
import SocketServer
import SimpleHTTPServer
import urllib
import logging
import httplib2

PORT = int(os.environ.get("PORT", 5000))

h = httplib2.Http()

class Proxy(SimpleHTTPServer.SimpleHTTPRequestHandler):
    def do_POST(self):
        contentType = self.headers.getheader('content-type')
        length = int(self.headers.getheader('content-length'))
        data_string = self.rfile.read(length)
        logging.error(self.headers)
        logging.error(length)
        logging.error(data_string)
        logging.error(contentType)
        headers = {'Content-Type': 'application/json'}
        resp, content = h.request("http://vcard-share.herokuapp.com/", "POST", body=data_string, headers=headers)
        logging.error(resp)
        logging.error(content)
        self.send_response(int(resp['status']))
        self.send_header('content-type', resp['content-type'])
        self.send_header('content-length', resp['content-length'])
        self.end_headers()
        self.wfile.write(content)

httpd = SocketServer.ForkingTCPServer(('', PORT), Proxy)
print "Listending on port ", PORT
httpd.serve_forever()
