const http = require('http');
const fs = require('fs');
const https = require('https');

function sendFile(res, path, type, errorMsg) {
    fs.readFile(path, (err, content) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end(errorMsg || 'File not found');
            return;
        }
        res.writeHead(200, { 'Content-Type': type });
        res.end(content);
    });
}

function getExternalData(url, cb) {
    https.get(url, (externalRes) => {
        let body = '';
        externalRes.on('data', chunk => body += chunk);
        externalRes.on('end', () => cb(null, body));
    }).on('error', err => cb(err));
}

function handleRequest(req, res) {
    if (req.url === '/' || req.url === '/index.html') {
        sendFile(res, 'index.html', 'text/html; charset=utf-8', 'Ошибка при чтении index.html');
    } 
    else if (req.url === '/style.css') {
        sendFile(res, 'style.css', 'text/css; charset=utf-8', 'Файл style.css не найден');
    }
    else if (req.url === '/script.js') {
        sendFile(res, 'script.js', 'text/javascript; charset=utf-8', 'Файл script.js не найден');
    }
    else if (req.url === '/404.html') {  // Добавляем обработку 404.html
        sendFile(res, '404.html', 'text/html; charset=utf-8', 'Файл 404.html не найден');
    }
    else if (req.url === '/api/products') {
        getExternalData('https://dummyjson.com/products', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Failed to fetch products' }));
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        });
    }
    else if (req.url.startsWith('/api/products/') && !req.url.includes('search')) {
        const id = req.url.split('/')[3];
        getExternalData(`https://dummyjson.com/products/${id}`, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Failed to fetch product' }));
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        });
    }
    else if (req.url.startsWith('/api/products/search')) {
        const urlObj = new URL(req.url, `http://${req.headers.host}`);
        const query = urlObj.searchParams.get('q');
        getExternalData(`https://dummyjson.com/products/search?q=${query}`, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Failed to search products' }));
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        });
    }
    else if (req.url === '/api/filters') {
        const filters = {
            priceRange: { min: 4, max: 20 },
            categories: ['Succulents', 'Window plants', 'Cacti', 'Mini', 'Collectible', 'For beginners']
        };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(filters));
    }
    else {
        // Перенаправление на /404.html вместо встроенной страницы
        res.writeHead(302, { 'Location': '/404.html' });
        res.end();
    }
}

const app = http.createServer(handleRequest);
app.listen(3000, "127.0.0.1", () => {
    console.log("Server is running on http://127.0.0.1:3000");
});