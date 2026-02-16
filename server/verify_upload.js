const fs = require('fs');
const path = require('path');
const http = require('http');

// Helper to create multipart form data body manually since we don't have form-data package
function createMultipartBody(fields, file, boundary) {
    let body = [];

    // Add fields
    for (const [key, value] of Object.entries(fields)) {
        body.push(`--${boundary}\r\n`);
        body.push(`Content-Disposition: form-data; name="${key}"\r\n\r\n`);
        body.push(`${value}\r\n`);
    }

    // Add file
    if (file) {
        body.push(`--${boundary}\r\n`);
        body.push(`Content-Disposition: form-data; name="${file.fieldname}"; filename="${file.filename}"\r\n`);
        body.push(`Content-Type: ${file.mimetype}\r\n\r\n`);
        body.push(file.content);
        body.push('\r\n');
    }

    body.push(`--${boundary}--\r\n`);
    return Buffer.concat(body.map(part => Buffer.from(part)));
}

const boundary = '--------------------------' + Date.now().toString(16);
const fileContent = fs.readFileSync('test_image.jpg');

const postData = createMultipartBody({
    name: 'Test User',
    email: `testuser_${Date.now()}@example.com`,
    password: 'password123'
}, {
    fieldname: 'profilePic',
    filename: 'test_image.jpg',
    mimetype: 'image/jpeg',
    content: fileContent
}, boundary);

const options = {
    hostname: 'localhost',
    port: 5001,
    path: '/api/auth/signup',
    method: 'POST',
    headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': postData.length
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        console.log('BODY:', data);
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.write(postData);
req.end();
