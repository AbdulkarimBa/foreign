export async function onRequest(context) {
    const { request } = context;
    const cookies = request.headers.get('cookie');
    const jwt = cookies?.match(/jwt=([^;]+)/)?.[1];

    if (!jwt) {
        console.log('No JWT found, redirecting to authorizer');

        // Redirect to authorizer if JWT is missing
        return Response.redirect('https://authorizer-git-main-abdulkarimbas-projects.vercel.app/checkcookies?redirectUrl=https://foreign.pages.dev', 302);
    }

    // Serve authenticated content if JWT is present
    const responseHeaders = new Headers();
    responseHeaders.append("Content-Type", "text/html");
    return new Response('<h1>Welcome to foreign app! You are authenticated.</h1>', { headers: responseHeaders });
}