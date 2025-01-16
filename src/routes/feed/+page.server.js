import { fetchOne } from "$lib/db";
import { redirect } from "@sveltejs/kit";
import { HOST_IP } from "$env/static/private";


export const load = async (event) => {
    if (!event.locals.user) {
        return redirect(302, "/login");
    }

    const userId = event.locals.user.id;
    const sessionId = event.locals.session.id;
    // get the urls from the urls argument in URL params 
    const urls = event.url.searchParams.get('urls');
    let response;
    try {
        response = await fetch(`http://${HOST_IP}/summarize?user_id=${userId}&session_id=${sessionId}&urls=${urls}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        return {
                user: event.locals.user,
                message: 'Server down',
                error: true
            };
    };
    console.log("user id", event.locals.user.id);
    console.log("session id", event.locals.session.id);

    if (response.status !== 200) {
        try {
            const errorData = await response.json();
            return {
                user: event.locals.user,
                message: errorData.message ?? 'Feed server failed',
                error: true
            };
        } catch (e) {
            // Ignore JSON parsing error
        }
        return {
            user: event.locals.user,
            message: 'Feed server failed',
            error: true

        };
    }

    const data = await response.json();

    return {
        user_id: event.locals.user.id,
        session_id: event.locals.session.id,
        message: data.summary,
        error: false,
        data: data
    };
};