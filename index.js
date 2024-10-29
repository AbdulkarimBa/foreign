const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());
const cors = require('cors');

app.get('/', (req, res) => {
    const cookies = req.headers.get('cookie');
    const jwt = cookies?.match(/jwt=([^;]+)/)?.[1];

    if (!jwt) {
        console.log('No JWT found, redirecting to authorizer');

        // Serve the HTML page with client-side fetch request to authorizer/checkcookies
        return new Response(`
            <html>
            <body>
                <h1>Welcome to foreign app!</h1>
                <script>
                    fetch('https://authorizer-git-main-abdulkarimbas-projects.vercel.app/checkcookies?redirectUrl=https://foreign-production.up.railway.app', {
                        credentials: 'include' // Cross-site cookies
                    })
                    .then(response => {
                        if (response.ok) {
                            window.location.href = '/';
                        }
                    })
                    .catch(error => console.error('Error fetching from authorizer', error));
                </script>
            </body>
            </html>
        `, { headers: { 'Content-Type': 'text/html' } });
    }
    const responseHeaders = new Headers();
    // redirectHeaders.append("Access-Control-Allow-Origin", "https://foreign.pages.dev");
    // redirectHeaders.append("Access-Control-Allow-Credentials", "true");
    responseHeaders.append("Content-Type", "text/html");
    // If JWT exists, show the authenticated page
    return new Response('<h1>Welcome to foreign app! You are authenticated.</h1>', { headers: responseHeaders });
});

// Endpoint to set cookies on bbb.com
app.get('/setcookies', (req, res) => {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    if (!token) {
        console.log('No token found in Authorization header');
        return new Response('No token found in Authorization header', { status: 400 });
    }
    // CORS headers for the response
    const origin = req.headers.get("Origin");
    const responseHeaders = new Headers();
    if (origin) {
        responseHeaders.append("Access-Control-Allow-Origin", origin);
        responseHeaders.append("Access-Control-Allow-Credentials", "true");
    }
    responseHeaders.append("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    responseHeaders.append("Access-Control-Allow-Headers", "Authorization, Content-Type");


    // Check if token is present
    if (!token) {
        console.log('No token found');
        return new Response('No token found', { status: 400, headers: responseHeaders });
    }

    // Set the cookie
    responseHeaders.append("Set-Cookie", `jwt=${token}; HttpOnly; Secure; Path=/`);

    console.log('JWT set on foreign app. Client will handle redirect to homepage.');

    return new Response(null, {
        status: 200,
        headers: responseHeaders,
    });
});

app.listen(3001, () => {
    console.log('Cookie Setter (bbb.com) running on port 3001');
});