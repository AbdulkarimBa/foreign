const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
app.use(cookieParser());
app.use(cors());

app.get('/', (req, res) => {
    const cookies = req.headers.cookie;
    const jwt = cookies?.match(/jwt=([^;]+)/)?.[1];

    if (!jwt) {
        console.log('No JWT found, redirecting to authorizer');

        // Serve the HTML page with client-side fetch request to authorizer/checkcookies
        res.set('Content-Type', 'text/html');
        return res.send(`
            <html>
            <body>
                <h1>Welcome to foreign app!</h1>
                <script>
                    fetch('https://authorizer-git-main-abdulkarimbas-projects.vercel.app/checkcookies?redirectUrl=https://foreign-production.up.railway.app', {
                        credentials: 'include' // Cross-site cookies
                    })
                    .then(response => {
                        if (response.ok) {
                            console.log('Response:', response.text());
                        }
                    })
                    .catch(error => console.error('Error fetching from authorizer', error));
                </script>
            </body>
            </html>
        `);
    } else {
        // If JWT exists, show the authenticated page
        res.set('Content-Type', 'text/html');
        return res.send('<h1>Welcome to foreign app! You are authenticated.</h1>');
    }
});

// Endpoint to set cookies on bbb.com
app.get('/setcookies', (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const token = url.searchParams.get("token");

    if (!token) {
        console.log('No token found in Authorization header');
        return res.status(400).send('No token found in Authorization header');
    }

    // CORS headers for the response
    const origin = req.headers.origin;
    if (origin) {
        res.set("Access-Control-Allow-Origin", origin);
        res.set("Access-Control-Allow-Credentials", "true");
    }
    res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Authorization, Content-Type");

    // Set the cookie
    res.cookie("jwt", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: 3600000, // Set to 1 hour
        domain: 'foreign-production.up.railway.app',
    });

    console.log('JWT set on foreign app. Client will handle redirect to homepage.');
    return res.status(200).send('JWT cookie has been set.');
});

app.listen(3001, () => {
    console.log('Cookie Setter (bbb.com) running on port 3001');
});