export async function onRequest(context) {
    const url = new URL(context.request.url);
    const token = url.searchParams.get("token");

    const responseHeaders = new Headers();

    // CORS headers
    responseHeaders.append("Access-Control-Allow-Origin", "https://authorizer-git-main-abdulkarimbas-projects.vercel.app");
    responseHeaders.append("Access-Control-Allow-Credentials", "true");
    responseHeaders.append("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    responseHeaders.append("Access-Control-Allow-Headers", "Authorization, Content-Type");

    if (!token) {
        console.log('No token found');
        return new Response('No token found', { status: 400, headers: responseHeaders });
    }


    console.log('JWT set on foreign app, redirecting to homepage...');
    const redirectResponse = Response.redirect('https://foreign.pages.dev');
    responseHeaders.append("Set-Cookie", `jwt=${token}; HttpOnly; Secure; Path=/`);
    // Redirect to homepage after setting the cookie
    console.log('redirectResponse', redirectResponse);
    return redirectResponse;
}