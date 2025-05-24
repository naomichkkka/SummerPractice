const http = require('http');
const fs = require('fs');

function onRequest(req, res) {
  let url = req.url;
  if (url === '/') url = '/index.html';

  let contentType = 'text/html; charset=utf-8';
  if (url.endsWith('.css')) contentType = 'text/css; charset=utf-8';
  else if (url.endsWith('.js')) contentType = 'text/javascript; charset=utf-8';

  fs.readFile('.' + url, function(err, data) {
    if (err) {
      // Если файла нет — показываем 404
      fs.readFile('./pages/404.html', function(err404, data404) {
        res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'});
        if (err404) {
          res.end('<h1>404 Not Found</h1>');
        } else {
          res.end(data404);
        }
      });
    } else {
      res.writeHead(200, {'Content-Type': contentType});
      res.end(data);
    }
  });
}

const server = http.createServer(onRequest);

server.listen(3000, '0.0.0.0', function() {
  console.log('Сервер запущен на http://localhost:3000');
});
