const http = require('http');

const PORT = 5000;
let cookies = [];

// Helper to perform HTTP requests
const makeRequest = (path, method, body = null) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: PORT,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (cookies.length > 0) {
            options.headers['Cookie'] = cookies.join('; ');
        }

        const req = http.request(options, (res) => {
            let data = '';

            // Capture cookies
            if (res.headers['set-cookie']) {
                // Extract just the key=value part for simplicity or keep full string for browser simulation
                // The server sends multiple set-cookie headers
                const newCookies = res.headers['set-cookie'].map(c => c.split(';')[0]);
                // Merge with existing (simple overwrite for now)
                cookies = [...new RegExp('accessToken|refreshToken').exec(newCookies.join('')) ? [] : cookies, ...newCookies];
                // Better: just replace match
                // For verify, we just need to send them back.
                cookies = res.headers['set-cookie'].map(c => c.split(';')[0]);
            }

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    resolve({
                        statusCode: res.statusCode,
                        body: data ? JSON.parse(data) : {},
                        headers: res.headers
                    });
                } catch (e) {
                    resolve({
                        statusCode: res.statusCode,
                        body: data,
                        headers: res.headers
                    });
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (body) {
            req.write(JSON.stringify(body));
        }

        req.end();
    });
};

const runTests = async () => {
    console.log('--- Starting Auth Verification ---');

    const testUser = {
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'password123',
    };

    try {
        //  Signup
        console.log('\n1. Testing Signup...');
        const signupRes = await makeRequest('/api/auth/signup', 'POST', testUser);
        console.log(`Status: ${signupRes.statusCode}`);
        console.log('Body:', signupRes.body);
        if (signupRes.statusCode === 201 && signupRes.headers['set-cookie']) {
            console.log(' Signup Passed: User created and cookies set.');
            console.log('Cookies:', signupRes.headers['set-cookie']);
        } else {
            console.log(' Signup Failed');
        }

        // Access Protected Route (Me)
        console.log('\n2. Testing Protected Route (/me)...');
        const meRes = await makeRequest('/api/auth/me', 'GET');
        console.log(`Status: ${meRes.statusCode}`);
        console.log('Body:', meRes.body);
        if (meRes.statusCode === 200 && meRes.body.email === testUser.email) {
            console.log('Protected Route Passed');
        } else {
            console.log(' Protected Route Failed');
        }

        //  Logout
        console.log('\n3. Testing Logout...');
        const logoutRes = await makeRequest('/api/auth/logout', 'POST');
        console.log(`Status: ${logoutRes.statusCode}`);
        if (logoutRes.statusCode === 200) {
            console.log('Logout Passed');
            // Clear local cookies helper for next test (simulation)
            cookies = [];
        } else {
            console.log(' Logout Failed');
        }

        //  Access Protected Route after Logout (Should Fail)
        console.log('\n4. Testing Protected Route after Logout...');
        const failRes = await makeRequest('/api/auth/me', 'GET');
        console.log(`Status: ${failRes.statusCode}`);
        if (failRes.statusCode === 401) {
            console.log('Blocked Access Passed');
        } else {
            console.log(' Blocked Access Failed (Expected 401)');
        }

        // Signin
        console.log('\n5. Testing Signin...');
        const signinRes = await makeRequest('/api/auth/signin', 'POST', {
            email: testUser.email,
            password: testUser.password
        });
        console.log(`Status: ${signinRes.statusCode}`);
        if (signinRes.statusCode === 200 && signinRes.headers['set-cookie']) {
            console.log('✅ Signin Passed');
            cookies = signinRes.headers['set-cookie'].map(c => c.split(';')[0]);
        } else {
            console.log('❌ Signin Failed');
        }

        // Access Protected Route again
        console.log('\n6. Testing Protected Route after Signin...');
        const meRes2 = await makeRequest('/api/auth/me', 'GET');
        if (meRes2.statusCode === 200) {
            console.log(' Protected Route (2) Passed');
        } else {
            console.log(' Protected Route (2) Failed');
        }

        console.log('\n--- Verification Completed ---');

    } catch (error) {
        console.error('Test Error:', error);
    }
};

runTests();
