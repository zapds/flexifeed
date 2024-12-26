import { execute, fetch, fetchOne } from "./db";


export function createUser(googleId, name, picture) {
    const row = fetchOne("INSERT INTO user (google_id, name, picture) VALUES (?, ?, ?) RETURNING user.id",
        [googleId, name, picture]);
    if (!row) {
        throw new Error("Unexpected error");
    }
    const user = {
        id: row.id,
        googleId,
        name,
        picture
    };
    return user;
}

export function getUserFromGoogleId(googleId) {
    const row = fetchOne("SELECT id, google_id, name, picture FROM user WHERE google_id = ?", [googleId]);
    if (!row) {
        return null;
    }
    const user = {
        id: row.id,
        googleId: row.google_id,
        name: row.name,
        picture: row.picture
    };
    return user;
}