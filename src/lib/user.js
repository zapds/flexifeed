import { execute, fetch, fetchOne } from "./db";


export function createUser(googleId, name) {
    const row = fetchOne("INSERT INTO user (google_id, name) VALUES (?, ?) RETURNING user.id",
        [googleId, name]);
    if (!row) {
        throw new Error("Unexpected error");
    }
    const user = {
        id: row.id,
        googleId,
        name
    };
    return user;
}

export function getUserFromGoogleId(googleId) {
    const row = fetchOne("SELECT id, google_id, name FROM user WHERE google_id = ?", [googleId]);
    if (!row) {
        return null;
    }
    const user = {
        id: row.id,
        googleId: row.google_id,
        name: row.name
    };
    return user;
}