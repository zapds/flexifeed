import { execute, fetch, fetchOne } from "./db.js";
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";



export function setSessionTokenCookie(event, token) {
    console.log("Setting session token cookie", token);
    event.cookies.set("session", token, {
        // httpOnly: true,
        // // sameSite: "lax",
        // expires: expiresAt * 1000,
        path: "/"
    });
}

export function deleteSessionTokenCookie(event) {
    console.log("Deleting session token cookie");
    event.cookies.set("session", "", {
        // httpOnly: true,
        // sameSite: "lax",
        // maxAge: 0,
        path: "/"
    });
}

export function generateSessionToken() {
    const bytes = new Uint8Array(20);
    crypto.getRandomValues(bytes);
    const token = encodeBase32LowerCaseNoPadding(bytes);
    return token;
}

export function createSession(token, userId) {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const session = {
        id: sessionId,
        userId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
    };
    execute(
        "INSERT INTO session (id, user_id, expires_at) VALUES (?, ?, ?)",
        [session.id, session.userId, Math.floor(session.expiresAt.getTime() / 1000)]
    );
    return session;
}

export function validateSessionToken(token) {
    console.log("Validating session token: ", token);
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    console.log("checking session id", sessionId);
    const rows = fetch("SELECT * FROM session WHERE id = ?", [sessionId]);
    console.log("rows", rows);
    const row = fetchOne(
        "SELECT session.id, session.user_id, session.expires_at, user.id, user.name FROM session INNER JOIN user ON user.id = session.user_id WHERE session.id = ?",
        [sessionId]
    );
    if (!row) {
        console.log("invalid session, returning null");
        return { session: null, user: null };
    }
    console.log("got row", row);
    const session = {
        id: row.id,
        userId: row.user_id,
        expiresAt: new Date(row.expires_at * 1000)
    };
    const user = {
        id: row.user_id,
        name: row.name
    };
    console.log("valid session, returning session and user, ", session, user);
    if (Date.now() >= session.expiresAt.getTime()) {
        console.log("session expired, deleting session and returning null");
        execute("DELETE FROM session WHERE id = ?", [session.id]);
        return { session: null, user: null };
    }
    if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
        console.log("session expires in less than 15 days, updating session");
        session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
        execute(
            "UPDATE session SET expires_at = ? WHERE id = ?",
            [Math.floor(session.expiresAt.getTime() / 1000),
            session.id]
        );
    }
    return { session, user };
}

export function invalidateSession(sessionId) {
    execute("DELETE FROM session WHERE id = ?", [sessionId]);
}
