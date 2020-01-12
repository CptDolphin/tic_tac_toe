const http = require('http');
const fs = require('fs');
const path = require('path');

const paths = [
  [/html$/i, path.join(__dirname, '../frontend/index.html'), 'text/html'],
  [/css$/i, path.join(__dirname, '../frontend/styles.css'), 'text/css'],
  [/js$/i, undefined, 'text/javascript']
];
const port = 7000;
const hostname = 'localhost';

http.createServer((request, response) => {
  if(!request.url.includes('favicon.ico')) {
    if(request.url === '/') {
      request.url = '/index.html'
    }
    
    const route = paths.find(elem => elem[0].test(request.url));
  
    if(route[1] === undefined) {
      let not_found_file = path.join(__dirname, '../frontend', request.url);
      fs.readFile(not_found_file, (err, content) => {
        if(err) {
          console.error(err);
          response.end(''); 
        }
        
        response.writeHead(200, {'Content-Type': route[2]});
        response.write(content);
        response.end('');
      });
      return;
    }
  
    const [, filepath, content_type] = route;
    fs.readFile(filepath, (err, content) => {
      if(err) {
        console.error(err);
        response.end('Error reading the file.'); 
      }
  
      response.writeHead(200, {'Content-Type': content_type});
      response.write(content);
      response.end('');
    });
  }
}).listen(port, hostname, () => {
  console.log(`Server running at ${hostname}:${port}`);
});

