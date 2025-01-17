import { fetchOne } from "$lib/db";
import { redirect } from "@sveltejs/kit";

export const load = async (event) => {
    if (!event.locals.user) {
        return redirect(302, "/login");
    }

    const userId = event.locals.user.id;
    const sessionId = event.locals.session.id;
    const settings = fetchOne("SELECT * FROM user_settings WHERE user_id = $1", [event.locals.user.id]);
    // let response;
    // try {
    //     response = await fetch(`http://localhost:3001/genfeed?user_id=${userId}&session_id=${sessionId}`, {
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //     });
    // } catch (error) {
    //     return {
    //             user: event.locals.user,
    //             message: 'Server down',
    //             error: true
    //         };
    // };
    // console.log("user id", event.locals.user.id);
    // console.log("session id", event.locals.session.id);
    
    // if (response.status !== 200) {
    //     try {
    //         const errorData = await response.json();
    //         return {
    //             user: event.locals.user,
    //             message: errorData.message ?? 'Feed server failed',
    //             error: true
    //         };
    //     } catch (e) {
    //         // Ignore JSON parsing error
    //     }
    //     return {
    //         user: event.locals.user,
    //         message: 'Feed server failed',
    //         error: true
            
    //     };
    // }
    
    // const data = await response.json();

    return {
        user_id: event.locals.user.id,
        session_id: event.locals.session.id,
        topics: settings?.topics ? JSON.parse(settings.topics) : [],
        // message: JSON.stringify(data),
        // error: false,
        // data: data
    };
};