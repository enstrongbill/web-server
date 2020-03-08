const http = require('http');
const path = require('path');
const fs = require('fs');

const conf = require('./config/defaultConfig');
const hostname = conf.hostname;
const port = conf.port;
const root = conf.root;

const server = http.createServer((req, res) => {


    const filePath = path.join(root, req.url);
    console.log(filePath);
    fs.stat(filePath, (err, stats) => {
        if(err){
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/html');
            res.end('Nothing in the webserver');
            return; 
        }
        if(stats.isFile()){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            // 这里我们采用流的方式把数据一点点的读入给res
            // 而不是使用fs.readFile回调的方式传递数据
            fs.createReadStream(filePath).pipe(res);
        }else if(stats.isDirectory()){
            fs.readdir(filePath, (err, files) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                res.end(files.join(','));
            });

        }
            
    })

    
})

server.listen(port, hostname, () => {
    console.log(`server running at ${hostname}:${port}`)
})