import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { Pool } from "pg";
import { type User } from "../models/user";

// Secret key (in a real-world application, store this securely)
const secretKey = "your-secret-key";



export class AuthService {
    private pool: Pool;
    constructor(pool: Pool) { this.pool = pool; }

    me(token: string): User {
        try {
            const payload = jwt.verify(token, secretKey);

            // Ensure the payload is a valid JwtPayload
            if (typeof payload === "string" || !payload) {
                throw new Error("Me: incorrect payload type");
            }

            // Extract user info from the payload
            const user: User = {
                id: payload.id as number,
                email: payload.email as string,
                password: "",
                groups: []
            };

            return user;
        } catch (error) {
            console.error("Invalid token:", error);
            throw new Error("Me failed");
        }
    }
    async login(email: string, password: string): Promise<string> {
        try {
            const res = await this.pool.query(`SELECT * FROM users WHERE email=$1`, [email]);

            let user: User;
            if (res.rows.length === 0) {
                user = await this.create({
                    email: email,
                    password: password,
                    id: 0,
                    groups: []
                });
            } else {
                user = res.rows[0];
                const passwordMatch = await bcryptjs.compare(password, user.password);
                if (!passwordMatch) {
                    throw new Error("Login: passwords don't match");
                }
            }

            const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: "24h" });

            return token;
        } catch (error) {
            console.error("Error logging in:", error);
            throw new Error("Login failed");
        }

    }
    async refresh(user: User): Promise<string> {
        try {
            const res = await this.pool.query(`SELECT * FROM users WHERE email=$1`, [user.email]);

            if (res.rows.length === 0) {
                throw new Error("Login: user not found");
            }

            const dbUser: User = res.rows[0];

            const newToken = jwt.sign({ id: dbUser.id, email: dbUser.email }, secretKey, { expiresIn: "24h" });

            return newToken;
        } catch (error) {
            console.error("Error logging in:", error);
            throw new Error("Refresh failed");
        }
    }

    async create(user: User): Promise<User> {
        try {
            const hashedPassword = await bcryptjs.hash(user.password, 10);

            let res = await this.pool.query(
                `INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email`,
                [user.email, hashedPassword]
            );
            
            if (res.rowCount === 0) {
                throw new Error("Create: error creating user");
            }

            const createdUser: User = res.rows[0];
            return createdUser;

        } catch (error) {
            console.error("Error registering user:", error);
            throw new Error("Registration failed");
        }
    }
    async get(user: User): Promise<User> {
        if (user.id===-1 && user.email==="") {
            throw new Error("Get: At least one condition (id or email) must be provided");
        }

        const conditions: string[] = [];
        const params: any[] = [];

        if (user.id!==-1) {
            conditions.push(`id = $${params.length + 1}`);
            params.push(user.id);
        }
        if (user.email!=="") {
            conditions.push(`email = $${params.length + 1}`);
            params.push(user.email);
        }
        const queryConditions = conditions.join(" AND ");

        const res = await this.pool.query(`SELECT id, email FROM users WHERE ${queryConditions}`, params);

        if (res.rows.length === 0) {
            throw new Error("User not found");
        }

        const dbUser: User = res.rows[0];
        return dbUser;
    }
    async getAll(): Promise<User[]> {
        const res = await this.pool.query(`SELECT id, email FROM users`);
        if (res.rows.length === 0) {
            return [];
        }
        let dbUsers: User[] = res.rows.map((row) => ({
            id: row.id,
            email: row.email,
            password:"",
            groups:[]
        }));
        return dbUsers;
    }
    async delete(user: User): Promise<User> {
        if (!user.id) {
            throw new Error("User ID is required for deletion.");
        }

        const params = [user.id];
        const query = `DELETE FROM users WHERE id = $1 RETURNING *`;

        const res = await this.pool.query(query, params);

        if (res.rows.length === 0) {
            throw new Error("User not found or deletion failed.");
        }

        return res.rows[0] as User;
    }
}

