// create web server
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/comments', function (req, res) {
    fs.readFile('comments.json', 'utf8', function (err, data) {
        if (err) {
            console.log(err);
            res.status(500).send('Cannot read comments.json');
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.send(data);
        }
    });
});

app.post('/comments', function (req, res) {
    fs.readFile('comments.json', 'utf8', function (err, data) {
        if (err) {
            console.log(err);
            res.status(500).send('Cannot read comments.json');
        } else {
            var comments = JSON.parse(data);
            comments.push(req.body);
            fs.writeFile('comments.json', JSON.stringify(comments, null, 4), function (err) {
                if (err) {
                    console.log(err);
                    res.status(500).send('Cannot write comments.json');
                } else {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(comments, null, 4));
                }
            });
        }
    });
});

app.listen(3000);
console.log('Server is running on port 3000');
