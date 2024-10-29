
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
    const allowedOrigins = ["https://foreign.pages.dev", "https://authorizer-git-main-abdulkarimbas-projects.vercel.app"];
    const responseHeaders = new Headers();

    // Dynamically set the CORS origin if it matches one of the allowed origins
    if (allowedOrigins.includes(origin)) {
        responseHeaders.append("Access-Control-Allow-Origin", origin);
        responseHeaders.append("Access-Control-Allow-Credentials", "true");
    }

    responseHeaders.append("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    responseHeaders.append("Access-Control-Allow-Headers", "Authorization, Content-Type");

    // Set cookie with the token
    responseHeaders.append("Set-Cookie", `jwt=${token}; HttpOnly; Secure; Path=/; SameSite=None`);

    console.log('JWT set on foreign app. Redirecting to homepage.');

    // Redirect with Location header
    responseHeaders.append("Location", "https://foreign.pages.dev");

    return new Response(null, {
        status: 303,
        headers: responseHeaders,
    });
}