export async function onRequest(context) {
    const url = new URL(context.request.url);
    const token = url.searchParams.get("token");

    // CORS headers
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

    // Set the cookie in the redirect response
    const redirectResponse = Response.redirect('https://foreign.pages.dev', 303);
    redirectResponse.headers.append("Set-Cookie", `jwt=${token}; HttpOnly; Secure; Path=/`);

    // Add CORS headers to the redirect response
    redirectResponse.headers.append("Access-Control-Allow-Origin", "https://authorizer-git-main-abdulkarimbas-projects.vercel.app");
    redirectResponse.headers.append("Access-Control-Allow-Credentials", "true");

    console.log('JWT set on foreign app, redirecting to homepage...');

    // Log the redirect response for debugging
    console.log('redirectResponse', redirectResponse);

    // Return the redirect response
    return redirectResponse;
}