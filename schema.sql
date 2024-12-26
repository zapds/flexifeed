CREATE TABLE user (
    id INTEGER NOT NULL PRIMARY KEY,
    google_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    picture TEXT
);


CREATE TABLE session (
    id TEXT NOT NULL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES user(id),
    expires_at INTEGER NOT NULL
);

CREATE TABLE user_settings (user_id INTEGER NOT NULL REFERENCES user(id), country TEXT, topics TEXT, PRIMARY KEY (user_id));