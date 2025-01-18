CREATE TABLE "user" (
    id INTEGER,
    google_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    picture TEXT
);


CREATE TABLE session (
    id TEXT NOT NULL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    expires_at INTEGER NOT NULL
);

CREATE TABLE user_settings (user_id INTEGER NOT NULL, country TEXT, topics TEXT, PRIMARY KEY (user_id));