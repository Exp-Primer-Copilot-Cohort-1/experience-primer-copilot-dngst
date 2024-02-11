// Create web server
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var path = require('path');

// create server
http.createServer(function (request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if (pathname === '/comment') {
        if (request.method === 'POST') {
            var body = '';
            request.on('data', function (data) {
                body += data;
            });
            request.on('end', function () {
                var post = qs.parse(body);
                console.log(post);
                fs.appendFile('data/comment.txt', post.author + ' : ' + post.description + '\n', 'utf8', function (err) {
                    response.writeHead(302, { Location: '/' });
                    response.end();
                });
            });
        } else {
            response.writeHead(404);
            response.end('Not found');
        }
    } else {
        if (pathname === '/') {
            fs.readFile('data/comment.txt', 'utf8', function (err, data) {
                var title = 'WEB - create';
                var list = '';
                var template = `
                <!doctype html>
                <html>
                <head>
                    <title>WEB1 - ${title}</title>
                    <meta charset="utf-8">
                </head>
                <body>
                    <h1><a href="/">WEB</a></h1>
                    <ul>
                        ${list}
                    </ul>
                    <a href="/create">create</a>
                    <h2>${title}</h2>
                    <p>${data}</p>
                </body>
                </html>
                `;
                response.writeHead(200);
                response.end(template);
            });
        } else {
            response.writeHead(404);
            response.end('Not found');
        }
    }
}).listen(3000);