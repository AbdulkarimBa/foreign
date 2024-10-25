export async function onRequest(context) {
    const url = new URL(context.request.url);
    const token = url.searchParams.get("token");

    if (!token) {
        console.log('No token found');
        return new Response('No token found', { status: 400 });
    }

    const headers = new Headers();
    headers.append("Set-Cookie", `jwt=${token}; HttpOnly; Secure; Path=/`);

    console.log('JWT set on bbb.com, redirecting to homepage...');

    // Redirect to homepage after setting the cookie
    return Response.redirect('/', 303, { headers });
}