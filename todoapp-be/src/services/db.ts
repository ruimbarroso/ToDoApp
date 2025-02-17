import type { Pool } from "pg";

export class DBService {
    private pool: Pool;
    constructor(pool: Pool) { this.pool = pool; }

    async create(table: string, toInsert: Record<string, any>, toReturn: Record<string, any>): Promise<Record<string, any>> {
        if (!table.match(/^[a-zA-Z_]+$/)) {
            throw new Error("Invalid table name");
        }

        const keys = Object.keys(toInsert);
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");


        const keyNamesToReturn = Object.keys(toReturn).length > 0
            ? Object.keys(toReturn).join(", ")
            : "*";

        const query = `INSERT INTO ${table} (${keys.join(", ")}) VALUES (${placeholders}) RETURNING ${keyNamesToReturn}`;

        const res = await this.pool.query(query, Object.values(toInsert));

        return res.rows[0];
    }
    async get(table: string, where: Record<string, any>, toReturn: Record<string, any>): Promise<Record<string, any>[]> {
        if (!table.match(/^[a-zA-Z_]+$/)) {
            throw new Error("Invalid table name");
        }

        const whereKeys = Object.keys(where);
        if (whereKeys.length === 0) {
            throw new Error("WHERE condition is required");
        }

        const whereClause = (whereKeys.length === 0) ? "" : ` WHERE ${whereKeys.map((key, i) => `${key} = $${i + 1}`).join(" AND ")}`;

        const columnsToReturn = Object.keys(toReturn).length > 0
            ? Object.keys(toReturn).join(", ")
            : "*";

        const query = `SELECT ${columnsToReturn} FROM ${table}${whereClause}`;

        const res = await this.pool.query(query, Object.values(where));

        return res.rows;
    }
    async update(table: string, id: number, toUpdate: Record<string, any>, toReturn: Record<string, any>): Promise<Record<string, any>> {
        if (!table.match(/^[a-zA-Z_]+$/)) {
            throw new Error("Invalid table name");
        }

        if (Object.keys(toUpdate).length === 0) {
            throw new Error("At least one column must be updated");
        }

        const setClause = Object.keys(toUpdate)
            .map((key, i) => `${key} = $${i + 1}`)
            .join(", ");

        const columnsToReturn = Object.keys(toReturn).length > 0
            ? Object.keys(toReturn).join(", ")
            : "*";

        const query = `UPDATE ${table} SET ${setClause} WHERE id = $${Object.keys(toUpdate).length + 1} RETURNING ${columnsToReturn}`;

        const values = [...Object.values(toUpdate), id];
        const res = await this.pool.query(query, values);

        return res.rows.length > 0 ? res.rows[0] : null;
    }
    async delete(table: string, ids: number[]): Promise<Record<string, any>[]> {
        if (!table.match(/^[a-zA-Z_]+$/)) {
            throw new Error("Invalid table name");
        }

        if (ids.length === 0) {
            throw new Error("No IDs provided for deletion");
        }

        const placeholders = ids.map((_, i) => `$${i + 1}`).join(", ");
        const query = `DELETE FROM ${table} WHERE id IN (${placeholders}) RETURNING *`;

        const res = await this.pool.query(query, ids);
        return res.rows;
    }
}