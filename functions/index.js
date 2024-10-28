export async function onRequest(context) {
    const { request } = context;
    const cookies = request.headers.get('cookie');
    const jwt = cookies?.match(/jwt=([^;]+)/)?.[1];

    if (!jwt) {
        console.log('No JWT found, redirecting to authorizer');

        // Serve the HTML page with client-side fetch request to authorizer/checkcookies
        return new Response(`
            <html>
            <body>
                <h1>Welcome to foreign app!</h1>
                <script>
                    fetch('https://authorizer-git-main-abdulkarimbas-projects.vercel.app/checkcookies?redirectUrl=https://foreign.pages.dev', {
                        credentials: 'include' // Cross-site cookies
                    })
                    .then(response => {
                        if (response.ok) {
                            const jwtToken = response.headers.get('Authorization').split(' ')[1];
                            document.cookie = 'jwt=' + jwtToken + '; path=/; HttpOnly; Secure';
                            window.location.href = '/';
                        }
                    })
                    .catch(error => console.error('Error fetching from authorizer', error));
                </script>
            </body>
            </html>
        `, { headers: { 'Content-Type': 'text/html' } });
    }

    // If JWT exists, show the authenticated page
    return new Response('<h1>Welcome to foreign app! You are authenticated.</h1>', { headers: { 'Content-Type': 'text/html' } });
}