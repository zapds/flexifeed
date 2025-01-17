// import Database from "better-sqlite3";

// const db = new Database('database.db');
import { neon } from '@neondatabase/serverless';
import { DATABASE_URL } from "$env/static/private";

const sql = neon(`${DATABASE_URL}`);

export function execute(query, params = []) {
    return sql(query, params);
}

export function fetch(query, params = []) {
    return sql(query, params);
}

export function fetchOne(query, params = []) {
    return fetch(query, params)[0] || null;
}

