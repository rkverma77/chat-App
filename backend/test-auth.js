import http from 'http';

const options = {
  hostname: '127.0.0.1',
  port: 5001,
  path: '/api/messages/users',
  method: 'GET',
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.end();
