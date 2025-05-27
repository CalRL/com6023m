import database from "../src/config/database.js";

export async function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function clean() {
    await delay(500);
    console.log('Cleanup start');
    await database`DELETE FROM posts`;
    await database`DELETE FROM profiles`;
    await database`DELETE FROM users`;
    console.log('Cleanup end');
}