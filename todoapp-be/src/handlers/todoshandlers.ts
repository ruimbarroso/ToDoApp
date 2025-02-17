import type { Group, ToDo } from "../models/todos";
import type { User } from "../models/user";
import type { DBService } from "../services/db";

export class TodosHandler {

    private db: DBService;
    constructor(db: DBService) {
        this.db = db;
    }
    async handleCreateGroup(req: Request, user: User | null): Promise<Response> {
        try {
            if (!user) {
                return new Response(JSON.stringify({ error: "You are not login" }), {
                    status: 401,
                    headers: { "Content-Type": "application/json" },
                });
            }

            let group: Group = await req.json();
            group.user_id = user.id;
            let createdGroup = await this.db.create("groups", group, {});

            return new Response(JSON.stringify(createdGroup), {
                status: 200,
                headers: {
                    "Content-Type": "application/json"
                },
            });
        } catch (error) {
            console.error("Group Creation failed:", error);

            return new Response(JSON.stringify({ error: "Error creating failed" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }
    }
    async handleGetGroup(req: Request, user: User | null): Promise<Response> {
        try {
            if (!user) {
                return new Response(JSON.stringify({ error: "You are not login" }), {
                    status: 401,
                    headers: { "Content-Type": "application/json" },
                });
            }
            let resBody: any;
            const url = new URL(req.url);
            const id = url.searchParams.get('id');
            const name = url.searchParams.get('name');

            if (!id && !name) {
                resBody = await this.db.get("groups", { user_id: user.id }, {})
            } else {
                let whereObj: Record<string, any> = {};
                if (id) whereObj.id = id;
                if (name) whereObj.name = name;

                resBody = await this.db.get("groups", whereObj, {});
            }


            return new Response(JSON.stringify(resBody), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            console.error("Get Group failed:", error);

            return new Response(JSON.stringify({ error: "Error Getting group" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }
    }
    async handleUpdateGroup(req: Request, user: User | null): Promise<Response> {
        try {
            if (!user) {
                return new Response(JSON.stringify({ error: "You are not login" }), {
                    status: 401,
                    headers: { "Content-Type": "application/json" },
                });
            }

            let { id, ...groupData }: {id:number, groupData: Record<string,any>} = await req.json();
            const groupsToUpdate = (await this.db.get("groups", {id: id}, {user_id:true}));
            if(groupsToUpdate.length===0){
                return new Response(JSON.stringify({ error: "Group not found" }), {
                    status: 402,
                    headers: { "Content-Type": "application/json" },
                });
            }

            if (!user || user.id !== groupsToUpdate[0].user_id) {
                return new Response(JSON.stringify({ error: "Not allowed to update this group" }), {
                    status: 401,
                    headers: { "Content-Type": "application/json" },
                });
            }
            
            let updatedGroup = await this.db.update("groups", id, groupData, {});

            return new Response(JSON.stringify(updatedGroup), {
                status: 200,
                headers: {
                    "Content-Type": "application/json"
                },
            });
        } catch (error) {
            console.error("Group Update failed:", error);

            return new Response(JSON.stringify({ error: "Error updating failed" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }
    }
    async handleDeleteGroup(req: Request, user: User | null): Promise<Response> {
        try {

            const { id }: { id: number } = await req.json();
            if (!id) {
                return new Response(JSON.stringify({ error: "No group id provided to delete" }), {
                    status: 402,
                    headers: { "Content-Type": "application/json" },
                });
            }

            const groupsToDelete = (await this.db.get("groups", {id: id}, {user_id:true}));
            if(groupsToDelete.length===0){
                return new Response(JSON.stringify({ error: "Group not found" }), {
                    status: 402,
                    headers: { "Content-Type": "application/json" },
                });
            }

            if (!user || user.id !== groupsToDelete[0].user_id) {
                return new Response(JSON.stringify({ error: "Not allowed to delete this group" }), {
                    status: 401,
                    headers: { "Content-Type": "application/json" },
                });
            }


            let deletedGroup = await this.db.delete("groups", [id]);

            return new Response(JSON.stringify(deletedGroup), {
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

    async handleCreateTodo(req: Request, user: User | null): Promise<Response> {
        try {
            if (!user) {
                return new Response(JSON.stringify({ error: "You are not login" }), {
                    status: 401,
                    headers: { "Content-Type": "application/json" },
                });
            }

            let todo: ToDo = await req.json();

            const groups = await this.db.get("groups", {id:todo.group_id}, {user_id:true})
            if(groups.length===0){
                return new Response(JSON.stringify({ error: "Group not found" }), {
                    status: 402,
                    headers: { "Content-Type": "application/json" },
                });
            }

            if(!user|| user.id !== groups[0].user_id){
                return new Response(JSON.stringify({ error: "Not allowed to add a todo to this group" }), {
                    status: 401,
                    headers: { "Content-Type": "application/json" },
                });
            }

            let createdTodo = await this.db.create("todos", todo, {});

            return new Response(JSON.stringify(createdTodo), {
                status: 200,
                headers: {
                    "Content-Type": "application/json"
                },
            });
        } catch (error) {
            console.error("Todo Creation failed:", error);

            return new Response(JSON.stringify({ error: "Error creating failed" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }
    }
    async handleGetTodo(req: Request, user: User | null): Promise<Response> {
        try {
            if (!user) {
                return new Response(JSON.stringify({ error: "You are not login" }), {
                    status: 401,
                    headers: { "Content-Type": "application/json" },
                });
            }
            let todos = [];
            const url = new URL(req.url);
            const id = url.searchParams.get('id');
            const name = url.searchParams.get('name');
            const group_id = url.searchParams.get('group_id');

            if (!id && !name && !group_id) {
                //All todos from all user groups
                let user_groups = await this.db.get("groups", { user_id: user.id }, {id:true})
                for(let groupId of user_groups.map(v=>v.id)){
                    let groupTodos = await this.db.get("todos", {group_id: groupId},{});
                    todos.push(...groupTodos);
                }
            } else {
                let whereObj: Record<string, any> = {};
                if (id) whereObj.id = id;
                if (name) whereObj.name = name;
                if (group_id) whereObj.group_id = group_id;

                todos.push(... await this.db.get("todos", whereObj, {}));
            }


            return new Response(JSON.stringify(todos), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            console.error("Get Todo failed:", error);

            return new Response(JSON.stringify({ error: "Error Getting todo" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }
    }
    async handleUpdateTodo(req: Request, user: User | null): Promise<Response> {
        try {
            if (!user) {
                return new Response(JSON.stringify({ error: "You are not login" }), {
                    status: 401,
                    headers: { "Content-Type": "application/json" },
                });
            }

            let { id, ...todoData } = await req.json();
            const groupsToUpdate = (await this.db.get("groups", {id: todoData.group_id}, {user_id:true}));
            if(groupsToUpdate.length===0){
                return new Response(JSON.stringify({ error: "Group not found" }), {
                    status: 402,
                    headers: { "Content-Type": "application/json" },
                });
            }

            if (!user || user.id !== groupsToUpdate[0].user_id) {
                return new Response(JSON.stringify({ error: "Not allowed to update this todo" }), {
                    status: 401,
                    headers: { "Content-Type": "application/json" },
                });
            }
            
            let updatedTodo = await this.db.update("todos", id, todoData, {});

            return new Response(JSON.stringify(updatedTodo), {
                status: 200,
                headers: {
                    "Content-Type": "application/json"
                },
            });
        } catch (error) {
            console.error("Todo Update failed:", error);

            return new Response(JSON.stringify({ error: "Error updating failed" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }
    }
    async handleDeleteTodo(req: Request, user: User | null): Promise<Response> {
        try {

            const { id }: { id: number } = await req.json();
            if (!id) {
                return new Response(JSON.stringify({ error: "No group id provided to delete" }), {
                    status: 402,
                    headers: { "Content-Type": "application/json" },
                });
            }

            const todosToDelete = (await this.db.get("todos", {id: id}, {group_id:true}));
            if(todosToDelete.length===0){
                return new Response(JSON.stringify({ error: "Todo not found" }), {
                    status: 402,
                    headers: { "Content-Type": "application/json" },
                });
            }

            const groupsToDelete = (await this.db.get("groups", {id: todosToDelete[0].group_id}, {user_id:true}));
            if(groupsToDelete.length===0){
                return new Response(JSON.stringify({ error: "Group not found" }), {
                    status: 402,
                    headers: { "Content-Type": "application/json" },
                });
            }

            if (!user || user.id !== groupsToDelete[0].user_id) {
                return new Response(JSON.stringify({ error: "Not allowed to delete this group" }), {
                    status: 401,
                    headers: { "Content-Type": "application/json" },
                });
            }

            let deletedTodo = await this.db.delete("todos", [id]);

            return new Response(JSON.stringify(deletedTodo), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            console.error("Delete Todo failed:", error);

            return new Response(JSON.stringify({ error: "Error Deleting Todo" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }
    }
}