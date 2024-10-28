export async function onRequest(context) {
    const url = new URL(context.request.url);
    const token = url.searchParams.get("token");

    // CORS headers for the initial response
    const responseHeaders = new Headers();
    responseHeaders.append("Access-Control-Allow-Origin", "https://authorizer-git-main-abdulkarimbas-projects.vercel.app");
    responseHeaders.append("Access-Control-Allow-Credentials", "true");
    responseHeaders.append("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    responseHeaders.append("Access-Control-Allow-Headers", "Authorization, Content-Type");

    // Check if token is present
    if (!token) {
        console.log('No token found');
        return new Response('No token found', { status: 400, headers: responseHeaders });
    }
    responseHeaders.append("Set-Cookie", `jwt=${token}; HttpOnly; Secure; Path=/`);

    // Create a new response for the redirect
    const redirectResponse = Response.redirect('https://foreign.pages.dev', 303);

    // Create new headers for the redirect response
    const redirectHeaders = new Headers(redirectResponse.headers);
    redirectHeaders.append("Access-Control-Allow-Origin", "https://foreign.pages.dev");
    redirectHeaders.append("Access-Control-Allow-Credentials", "true");

    console.log('JWT set on foreign app, redirecting to homepage...');

    // Create a new Response object for the redirect with the modified headers
    return new Response(redirectResponse.body, {
        status: redirectResponse.status,
        statusText: redirectResponse.statusText,
        headers: redirectHeaders,
    });
}