export async function onRequest(context) {
    const url = new URL(context.request.url);
    const token = url.searchParams.get("token");

    // get request headers
    // console.log(JSON.stringify({
    //     method: context.request.method,
    //     url: context.request.url,
    //     headers: Object.fromEntries(context.request.headers),
    // }, null, 2));
    // const headers = context.request.headers;
    // // get Authorization
    // const authorization = headers.get("Authorization");
    // if (!authorization) {
    //     console.log('No Authorization header found');
    //     return new Response('No Authorization header found', { status: 400 });
    // }

    // // get token from Authorization header
    // const token = authorization.split(" ")[1];
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
    // responseHeaders.append("Set-Cookie", `jwt=${token}; HttpOnly; Secure; Path=/`);

    console.log('JWT set on foreign app. Client will handle redirect to homepage.');

    return new Response(`
        <html>
            <body>
                <script>
                    // Attempt to set the JWT cookie with domain specified
                    document.cookie = "jwt=${token}; path=/; Secure; domain=foreign.pages.dev";
                    // Redirect after setting the cookie
                    window.location.href = '/';
                </script>
                <h1>Setting up your session...</h1>
            </body>
        </html>
    `, {
        headers: {
            'Content-Type': 'text/html',
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Credentials': 'true'
        },
        status: 200,
    });
}