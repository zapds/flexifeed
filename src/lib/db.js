import Database from "better-sqlite3";

const db = new Database('database.db');

export function execute(query, params = []) {
    const stmt = db.prepare(query);
    return stmt.run(params);
}

export function fetch(query, params = []) {
    const stmt = db.prepare(query);
    return stmt.all(params);
}

export function fetchOne(query, params = []) {
    const stmt = db.prepare(query);
    return stmt.get(params);
}
