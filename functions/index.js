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
                const response = fetch(
                    "https://authorizer-git-main-abdulkarimbas-projects.vercel.app/checkcookies",
                    {
                    method: "POST",
                    credentials: "include", // Cross-site cookie setting
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ redirectUrl: "https://foreign.pages.dev" }),
                    }
                )
                    .then((response) => {
                    if (response.ok) {
                        const data = response.json();
                        const token = data.token;
                        const redirectUrl = data.redirectUrl;

                        // Set the token as a cookie
                        document.cookie = "jwt=" + token + "; path=/; HttpOnly; Secure;";
                        // Redirect to the foreign app
                        window.location.href = redirectUrl;
                    } else {
                        console.error("Failed to fetch token");
                    }
                    })
                    .catch((error) => {
                    console.error("Error fetching token", error);
                    });
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
}