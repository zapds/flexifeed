import {
    validateSessionToken,
    setSessionTokenCookie,
    deleteSessionTokenCookie
} from "./lib/session.js";


export const handle = async ({ event, resolve }) => {
    const token = event.cookies.get("session") ?? null;
    if (token === null) {
        event.locals.user = null;
        event.locals.session = null;
        return resolve(event);
    }

    const { session, user } = await validateSessionToken(token);
    if (session !== null) {
        setSessionTokenCookie(event, token);
    } else {
        deleteSessionTokenCookie(event);
    }

    event.locals.session = session;
    event.locals.user = user;
    return resolve(event);
};
