export async function onRequest(context) {
    const url = new URL(context.request.url);

    // log the whole request
    console.table('Request to set cookies on foreign app:', context.request);
    //const token = url.searchParams.get("token");

    // get request headers
    const headers = context.request.headers;
    // get Authorization
    const authorization = headers.get("Authorization");
    if (!authorization) {
        console.log('No Authorization header found');
        return new Response('No Authorization header found', { status: 400 });
    }

    // get token from Authorization header
    const token = authorization.split(" ")[1];
    if (!token) {
        console.log('No token found in Authorization header');
        return new Response('No token found in Authorization header', { status: 400 });
    }
    // CORS headers for the response
    const origin = context.request.headers.get("Origin");
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

    // Return a 200 response with a client-side redirect script
    // const htmlResponse = `
    //     <!DOCTYPE html>
    //     <html>
    //         <head>
    //             <title>Setting JWT</title>
    //             <script>
    //                 // Redirect after setting the cookie
    //                 window.location.href = "https://foreign.pages.dev";
    //             </script>
    //         </head>
    //         <body>
    //             <p>Setting your session. Redirecting...</p>
    //         </body>
    //     </html>
    // `;

    return new Response(null, {
        status: 200,
        headers: responseHeaders,
    });
}