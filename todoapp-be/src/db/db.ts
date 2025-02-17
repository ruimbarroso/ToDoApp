import { Pool } from 'pg'

async function testConnection(pool: Pool): Promise<boolean> {
    try {
        const res = await pool.query('SELECT 1');
        console.log('Database connected successfully!');
    } catch (error) {
        console.error('Database connection failed:', error);
        return false;
    }

    return true;
}



export async function initPool(): Promise<Pool | null | undefined> {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: false
    })

    const isConnected = await testConnection(pool);
    if (!isConnected) {
        await pool.end();
        return null;
    }
    return pool;
}
