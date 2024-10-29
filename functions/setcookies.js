export async function onRequest(context) {
    const url = new URL(context.request.url);
    const token = url.searchParams.get("token");

    if (!token) {
        console.log('No token found');
        return new Response('No token found in Authorization header', { status: 400 });
    }

    // Get the origin and set CORS headers if it's allowed
    const origin = context.request.headers.get("Origin");
    const allowedOrigins = ["https://foreign.pages.dev", "https://authorizer-git-main-abdulkarimbas-projects.vercel.app"];
    const responseHeaders = new Headers();

    if (allowedOrigins.includes(origin)) {
        responseHeaders.append("Access-Control-Allow-Origin", origin);
        responseHeaders.append("Access-Control-Allow-Credentials", "true");
    }

    responseHeaders.append("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    responseHeaders.append("Access-Control-Allow-Headers", "Authorization, Content-Type");

    // Serve an HTML page with JavaScript to set the cookie and redirect
    const htmlContent = `
        <html>
        <body>
            <script>
                document.cookie = "jwt=${token}; path=/; Secure; HttpOnly; SameSite=None";
                window.location.href = "https://foreign.pages.dev";
            </script>
            <p>Redirecting...</p>
        </body>
        </html>
    `;

    return new Response(htmlContent, {
        status: 200,
        headers: { "Content-Type": "text/html", ...responseHeaders }
    });
}