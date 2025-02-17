import type { User } from "../models/user";
import { AuthService } from "../services/auth"

export class UserHandler {
    private auth: AuthService;
    constructor(auth: AuthService) {
        this.auth = auth;
    }

    //AUTH
    async handleMe(req: Request, user: User | null): Promise<Response> {
        if (!user) {
            return new Response("You are not logged in", { status: 401 });
        }

        return new Response(JSON.stringify(user), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }
    async handleLogin(req: Request, user: User | null): Promise<Response> {
        try {
            const { email, password } = await req.json();

            const token: string = await this.auth.login(email, password);

            const expires = new Date();
            expires.setHours(expires.getHours() + 24);

            return new Response(JSON.stringify({ message: "Logged in" }), {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    "Set-Cookie": `user_token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Expires=${expires.toUTCString()}`,
                },
            });
        } catch (error) {
            console.error("Login failed:", error);

            return new Response(JSON.stringify({ error: "Error logging in" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }
    }
    async handleLogout(req: Request, user: User | null): Promise<Response> {
        const expires = new Date();
        expires.setHours(expires.getHours() - 24);

        return new Response(JSON.stringify({ message: "Logged in" }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Set-Cookie": `user_token=; Path=/; HttpOnly; Secure; SameSite=Strict; Expires=${expires.toUTCString()}`,
            },
        });

    }
    async handleRefresh(req: Request, user: User | null): Promise<Response> {
        if (!user) {
            return new Response("You are not logged in", { status: 401 });
        }
        try {
            const token: string = await this.auth.refresh(user);

            const expires = new Date();
            expires.setHours(expires.getHours() + 24);

            return new Response(JSON.stringify({ message: "Logged in" }), {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    "Set-Cookie": `user_token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Expires=${expires.toUTCString()}`,
                },
            });
        } catch (error) {
            console.error("Login failed:", error);

            return new Response(JSON.stringify({ error: "Error logging in" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }
    }


    //User CRUD
    async handleGet(req: Request, user: User | null): Promise<Response> {
        try {
            let resBody: any;
            const url = new URL(req.url);
            const id = url.searchParams.get('id');
            const email = url.searchParams.get('email');

            if (!id && !email) {
                resBody = await this.auth.getAll()
            } else {
                resBody = await this.auth.get({
                    id: (!id) ? -1 : parseInt(id),
                    email: (!email) ? "" : email,
                    password: "",
                    groups: [],
                });
            }


            return new Response(JSON.stringify(resBody), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            console.error("Get User failed:", error);

            return new Response(JSON.stringify({ error: "Error Getting user" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }
    }
    async handleDelete(req: Request, user: User | null): Promise<Response> {
        try {

            const { id }: { id: number | undefined, email: string | undefined } = await req.json();
            if (!id) {
                return new Response(JSON.stringify({ error: "No user id provided to delete" }), {
                    status: 402,
                    headers: { "Content-Type": "application/json" },
                });
            }
            if (!user || user.id !== id) {
                return new Response(JSON.stringify({ error: "Not allowed to delete this user" }), {
                    status: 401,
                    headers: { "Content-Type": "application/json" },
                });
            }
            let deletedUser: User = await this.auth.delete({
                id: id,
                email: "",
                password: "",
                groups: [],
            });

            return new Response(JSON.stringify(deletedUser), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            console.error("Get User failed:", error);

            return new Response(JSON.stringify({ error: "Error Getting user" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }
    }

    authMiddleware(req: Request): User | null {
        const cookies = req.headers.get("Cookie");
        if (!cookies) {
            return null;
        }

        const cookieObj = Object.fromEntries(cookies.split("; ").map(cookie => cookie.split("=")));
        const token = cookieObj["user_token"];

        if (!token) {
            return null;
        }

        try {
            return this.auth.me(token);
        } catch (e) {
            return null;
        }
    }

}