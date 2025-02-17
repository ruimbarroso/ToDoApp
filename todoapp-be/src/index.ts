import type { Server, SQL } from "bun";
// import homepage from "../fe/index.html";
import { initPool } from "./db/db";
import { UserHandler } from "./handlers/userhandlers";
import { AuthService } from "./services/auth";
import type { User } from "./models/user";
import { TodosHandler } from "./handlers/todoshandlers";
import { DBService } from "./services/db";

function GetURL(urlToParse: string) {
    let aux = urlToParse;
    if (aux.length > 1 && aux.endsWith("/")) {
        aux = urlToParse.slice(0, urlToParse.length - 1);
    }
    return new URL(aux);
}

async function injectSQL(): Promise<Server> {
    const pool = await initPool();

    if (!pool) {
        console.error("Failed to initialize POSTGRES pool. Exiting...");
        process.exit(1);
    }

    const db = new DBService(pool);
    const auth = new AuthService(pool);
    const userHandler = new UserHandler(auth);
    const todoHandler = new TodosHandler(db);
    const handlers: Record<string, (req: Request, user: User | null) => Promise<Response>> = {
        "GET /users/me": userHandler.handleMe.bind(userHandler),
        "GET /users/refresh": userHandler.handleRefresh.bind(userHandler),
        "GET /users/logout": userHandler.handleLogout.bind(userHandler),
        "POST /users": userHandler.handleLogin.bind(userHandler),
        "GET /users": userHandler.handleGet.bind(userHandler),
        "DELETE /users": userHandler.handleDelete.bind(userHandler),
        "POST /groups": todoHandler.handleCreateGroup.bind(todoHandler),
        "GET /groups": todoHandler.handleGetGroup.bind(todoHandler),
        "PUT /groups": todoHandler.handleUpdateGroup.bind(todoHandler),
        "DELETE /groups": todoHandler.handleDeleteGroup.bind(todoHandler),
        "POST /todos": todoHandler.handleCreateTodo.bind(todoHandler),
        "GET /todos": todoHandler.handleGetTodo.bind(todoHandler),
        "PUT /todos": todoHandler.handleUpdateTodo.bind(todoHandler),
        "DELETE /todos": todoHandler.handleDeleteTodo.bind(todoHandler),
    }

    const handleRequest = async (req: Request): Promise<Response> => {
        const user = userHandler.authMiddleware(req);

        const url = GetURL(req.url);
        try {
            const handlerKey = `${req.method} ${url.pathname}`;
            console.log(`User: ${user ? user.id : "Not login"} Request: ${handlerKey}`);

            const handler = handlers[handlerKey];
            if (handler) {
                let response = await handler(req, user);
                return response;
            } else {
                return new Response("Not Found", { status: 404 });
            }
        } catch (error) {
            console.error("Error querying users:", error);
            let response = new Response("Internal Server Error", { status: 500 });
            return response;
        }
    };
    const corsMidleware = async (req: Request, handleRequest: (req: Request) => Promise<Response>): Promise<Response> => {
        const origin = req.headers.get("origin") ?? "none";

        // List of allowed origins (adjust for your frontend)
        const allowedOrigins = [
            "http://localhost:3000", // Frontend running locally
            "http://frontend:3000", // Frontend in Docker network
        ];

        // Handle preflight (OPTIONS) requests
        if (req.method === "OPTIONS") {
            return new Response(null, {
                headers: {
                    "Access-Control-Allow-Origin": allowedOrigins.includes(origin) ? origin : "",
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization",
                    "Access-Control-Allow-Credentials": "true",
                },
            });
        }

        // Handle actual requests
        const response = await handleRequest(req); // Replace with your logic

        // Add CORS headers to the response
        if (allowedOrigins.includes(origin)) {
            response.headers.set("Access-Control-Allow-Origin", origin);
            response.headers.set("Access-Control-Allow-Credentials", "true");
        }

        return response;
    };
    const server = Bun.serve({
        development: process.env.NODE_ENV === "dev",
        hostname: process.env.HOST,
        port: process.env.PORT,
        async fetch(req) {
            return await corsMidleware(req, handleRequest);
        },
    });

    return server;
}


injectSQL().then((server) => {
    console.log(`Server running at ${server.hostname}:${server.port}...`);
});


