import { invalidateSession, deleteSessionTokenCookie } from "$lib/session.js";

export async function GET(event) {
        if (event.locals.session === null) {
            return new Response(null, {
                status: 302,
                headers: {
                    Location: "/"
                }
            });
        }
        await invalidateSession(event.locals.session.id);
        deleteSessionTokenCookie(event);
        return new Response(null, {
        status: 302,
        headers: {
            Location: "/"
        }
    });
};
