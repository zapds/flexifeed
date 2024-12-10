CREATE TABLE user (
    id INTEGER NOT NULL PRIMARY KEY,
    google_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL
);


CREATE TABLE session (
    id TEXT NOT NULL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES user(id),
    expires_at INTEGER NOT NULL
);

