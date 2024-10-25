const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());
const cors = require('cors');

app.get('/', (req, res) => {
    const jwt = req.cookies?.jwt;

    if (!jwt) {
        console.log('No JWT found, making client-side request to aaa.com/checkcookies');

        // Serve HTML that makes a client-side fetch request to aaa.com/checkcookies
        res.send(`
            <html>
            <body>
                <h1>Welcome to bbb.com!</h1>
                <script>
                    // Client-side request using Fetch API
                    fetch('http://aaa.com:3000/checkcookies', {
                        credentials: 'include'  // Important for cross-site cookies
                    })
                    .then(response => {
                        if (response.ok) {
                            // Get the JWT from the response header
                            const jwtToken = response.headers.get('Authorization').split(' ')[1];

                            // Set the JWT as a cookie
                            document.cookie = 'jwt=' + jwtToken + '; path=/; HttpOnly; Secure';

                            // Redirect to the main page after setting the cookie
                            window.location.href = '/';
                        }
                    })
                    .catch(error => console.error('Error fetching from aaa.com:', error));
                </script>
            </body>
            </html>
        `);
    } else {
        // If JWT exists, render the authenticated page
        res.send('<h1>Welcome to bbb.com! You are authenticated.</h1>');
    }
});

// Endpoint to set cookies on bbb.com
app.get('/setcookies', (req, res) => {
    const { token } = req.query;

    if (!token) {
        console.log('No token found in query');
        return res.status(400).send('No token found');
    }

    // Set the cookie received from aaa.com
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: false,  // Set to true when using HTTPS
    });

    console.log('JWT set on bbb.com, redirecting to homepage...');

    // After setting the cookie, redirect to the homepage
    return res.redirect('/');
});

app.listen(3001, () => {
    console.log('Cookie Setter (bbb.com) running on port 3001');
});