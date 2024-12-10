import { generateState, generateCodeVerifier } from "arctic";
import { google } from "$lib/auth.js";


export async function GET(event) {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const url = google.createAuthorizationURL(state, codeVerifier, ["openid", "profile"]);

    event.cookies.set("google_oauth_state", state, {
        path: "/",
        httpOnly: true,
        maxAge: 60 * 10, // 10 minutes
        sameSite: "lax"
    });
    event.cookies.set("google_code_verifier", codeVerifier, {
        path: "/",
        httpOnly: true,
        maxAge: 60 * 10, // 10 minutes
        sameSite: "lax"
    });

    return new Response(null, {
        status: 302,
        headers: {
            Location: url.toString()
        }
    });
}