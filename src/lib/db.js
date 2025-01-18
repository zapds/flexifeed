// import Database from "better-sqlite3";

// const db = new Database('database.db');
import { neon } from '@neondatabase/serverless';
import { DATABASE_URL } from "$env/static/private";

const sql = neon(`${DATABASE_URL}`);

export async function execute(query, params = []) {
    return await sql(query, params);
}

export async function fetch(query, params = []) {
    return await sql(query, params);
}

export async function fetchOne(query, params = []) {
    let data = await fetch(query, params);
    return data[0];
}

