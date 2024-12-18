import { redirect } from "@sveltejs/kit";

export const load = async (event) => {
    if (!event.locals.user) {
        return redirect(302, "/login");
    }

    const userId = event.locals.user.id;
    const sessionId = event.locals.session.id;

    const response = await fetch(`http://localhost:3001/genfeed?user_id=${userId}&session_id=${sessionId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    console.log("user id", event.locals.user.id);
    console.log("session id", event.locals.session.id);
    
    if (response.status !== 200) {
        try {
            const errorData = await response.json();
            return {
                user: event.locals.user,
                message: 'Feed server failed',
                error: errorData
            };
        } catch (e) {
            // Ignore JSON parsing error
        }
        return {
            user: event.locals.user,
            message: 'Feed server failed',
            
        };
    }
    
    const data = await response.json();

    return {
        user: event.locals.user,
        message: JSON.stringify(data)
    };
};