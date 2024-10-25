export async function onRequest(context) {
    const { request } = context;
    const cookies = request.headers.get('cookie');
    const jwt = cookies?.match(/jwt=([^;]+)/)?.[1];

    if (!jwt) {
        console.log('No JWT found, redirecting to aaa.com');

        // Serve the HTML page with client-side fetch request to aaa.com/checkcookies
        return new Response(`
            <html>
            <body>
                <h1>Welcome to bbb.com!</h1>
                <script>
                    fetch('http://aaa.com:3000/checkcookies', {
                        credentials: 'include'  // Cross-site cookies
                    })
                    .then(response => {
                        if (response.ok) {
                            const jwtToken = response.headers.get('Authorization').split(' ')[1];
                            document.cookie = 'jwt=' + jwtToken + '; path=/; HttpOnly; Secure';
                            window.location.href = '/';
                        }
                    })
                    .catch(error => console.error('Error fetching from aaa.com:', error));
                </script>
            </body>
            </html>
        `, { headers: { 'Content-Type': 'text/html' } });
    }

    // If JWT exists, show the authenticated page
    return new Response('<h1>Welcome to bbb.com! You are authenticated.</h1>', { headers: { 'Content-Type': 'text/html' } });
}