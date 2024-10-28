export async function onRequest(context) {
    const url = new URL(context.request.url);

    // get token from Authorsation header
    const auth = context.request.headers.get("Authorization");
    if (!auth) {
        console.log('No Authorization header found');
        return new Response('No Authorization header found', { status: 400 });
    }

    const token = auth.split(" ")[1];

    // CORS headers for the response
    const origin = context.request.headers.get("Origin");
    const responseHeaders = new Headers();
    if (origin) {
        responseHeaders.append("Access-Control-Allow-Origin", origin);
        responseHeaders.append("Access-Control-Allow-Credentials", "true");
    }
    responseHeaders.append("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    responseHeaders.append("Access-Control-Allow-Headers", "Authorization, Content-Type");

    // Set the cookie
    responseHeaders.append("Set-Cookie", `jwt=${token}; HttpOnly; Secure; Path=/`);

    console.log('JWT set on foreign app. Client will handle redirect to homepage.');

    // Return a 200 response with a client-side redirect script
    const htmlResponse = `
        <!DOCTYPE html>
        <html>
            <head>
                <title>Setting JWT</title>
                <script>
                    // Redirect after setting the cookie
                    window.location.href = "https://foreign.pages.dev";
                </script>
            </head>
            <body>
                <p>Setting your session. Redirecting...</p>
            </body>
        </html>
    `;

    return new Response(htmlResponse, {
        status: 200,
        headers: responseHeaders,
    });
}