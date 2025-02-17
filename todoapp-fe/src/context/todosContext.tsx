import { useState, createContext, useContext, useEffect, type ReactNode, useCallback } from "react";
import { API_URL, useAuth } from "./userContext";
import type { Group, ToDo } from "../models/todos";

export enum PageContentType {
    HOME = -4,
    ALL,
    PERFIL,
    LOADING
};
interface ToDoContextType {
    groups: Group[];
    toogleGroupMenu: () => void;
    isMenuOpen: boolean;
    selectedGroup: number;
    setGroup: (index: number) => void;
    getGroup: () => Group | null;
    loadAllTodos: (groups: Group[]) => Promise<void>;
    loadTodos: () => Promise<void>;
    isLoadingTodos: boolean;
    isLoadingGroups: boolean;
    createGroup: (group: Group) => Promise<void>;
    updateGroup: (group: Group) => Promise<void>;
    deleteGroup: (group: Group) => Promise<void>;
    createToDo: (toDo: ToDo) => Promise<void>;
    updateToDo: (toDo: ToDo) => Promise<void>;
    deleteToDo: (toDo: ToDo) => Promise<void>;
}

const ToDosContext = createContext<ToDoContextType | undefined>(undefined);

interface ToDosProviderProps {
    children: ReactNode;
}

export const ToDosProvider = ({ children }: ToDosProviderProps) => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [selectedGroup, setSelectedGroup] = useState(PageContentType.HOME);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoadingTodos, setIsLoadingTodos] = useState(true);
    const [isLoadingGroups, setIsLoadingGroups] = useState(true);
    const { user } = useAuth();


    const toogleGroupMenu = useCallback(() => {
        setIsMenuOpen(!isMenuOpen);
    }, [isMenuOpen]);

    const setGroup = useCallback((index: number) => {
        if (index < PageContentType.HOME || index >= groups.length) {
            throw new Error("Groups Index Out Of Bounds!");
        }
        setSelectedGroup(index);
    }, [groups]);
    const getGroup = useCallback((): Group | null => {
        if (selectedGroup === -1) return null;
        return groups[selectedGroup];
    }, [selectedGroup, groups]);

    const loadGroups = useCallback(async (): Promise<Group[]> => {
        const response = await fetch(`${API_URL}/groups`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        }
        );
        if (response.ok) {
            const data: Group[] = await response.json();
            const groupsWithTodos = data.map(g => ({ ...g, todos: g.todos || [] }));
            setGroups(groupsWithTodos);
            return groupsWithTodos;
        } else {
            throw new Error("Failed to fetch user groups");
        }
    }, []);

    const loadAllTodos = useCallback(async (groups: Group[]) => {
        const response = await fetch(`${API_URL}/todos`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        }
        );
        if (response.ok) {
            const data: ToDo[] = await response.json();
            data.map(todo => todo.due_date = new Date(todo.due_date));
            const updatedGroups = groups.map(group => ({
                ...group,
                todos: data.filter(todo => todo.group_id === group.id)
            }));
            setGroups(updatedGroups);
        } else {
            throw new Error("Failed to fetch all user to dos");
        }
    }, []);
    const loadTodos = useCallback(async () => {
        const group = getGroup();
        if (!group) return;

        const response = await fetch(`${API_URL}/todos?group_id=${group.id}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            const data: ToDo[] = await response.json();
            data.map(todo => todo.due_date = new Date(todo.due_date));

            setGroups(prevGroups =>
                prevGroups.map((g, index) =>
                    index === selectedGroup
                        ? { ...g, todos: data } // ✅ New object
                        : g
                )
            );
        } else {
            throw new Error("Failed to fetch user to dos");
        }
    }, [getGroup, selectedGroup]);


    const createGroup = useCallback(async (group: Group) => {
        const response = await fetch(`${API_URL}/groups`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: group.name,
                description: group.description,
                color: group.color
            })
        });
        if (response.ok) {
            const data: Group = await response.json();
            data.todos = [];
            setGroups(prevGroups => [...prevGroups, data]);
        } else {
            throw new Error("Failed to create group");
        }
    }, []);

    const updateGroup = useCallback(async (group: Group) => {
        const response = await fetch(`${API_URL}/groups`, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: group.id,
                name: group.name,
                description: group.description,
                color: group.color
            })
        });
        if (response.ok) {
            const data: Group = await response.json();
            data.todos = group.todos;
            setGroups(prevGroups => prevGroups.map(g => (g.id === data.id ? data : g)));
        } else {
            throw new Error("Failed to update group");
        }
    }, []);

    const deleteGroup = useCallback(async (group: Group) => {
        const response = await fetch(`${API_URL}/groups`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: group.id })
        });
        if (response.ok) {
            setGroups(prevGroups => prevGroups.filter(g => g.id !== group.id));
        } else {
            throw new Error("Failed to delete group");
        }
    }, []);

    const createToDo = useCallback(async (toDo: ToDo) => {
        const response = await fetch(`${API_URL}/todos`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: toDo.name,
                is_complete: toDo.is_complete,
                due_date: toDo.due_date,
                group_id: toDo.group_id
            })
        });
        if (response.ok) {
            const data: ToDo = await response.json();
            data.due_date = new Date(data.due_date);
            setGroups(prevGroups => prevGroups.map(group =>
                group.id === data.group_id
                    ? { ...group, todos: [...group.todos, data] }
                    : group
            ));
        } else {
            throw new Error("Failed to create to do");
        }
    }, []);

    const updateToDo = useCallback(async (toDo: ToDo) => {
        const response = await fetch(`${API_URL}/todos`, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(toDo)
        });
        if (response.ok) {
            const data: ToDo = await response.json();
            data.due_date = new Date(data.due_date);
            setGroups(prevGroups => prevGroups.map(group =>
                group.id === data.group_id
                    ? {
                        ...group,
                        todos: group.todos.map(todo => todo.id === data.id ? data : todo)
                    }
                    : group
            ));
        } else {
            throw new Error("Failed to update to do");
        }
    }, []);

    const deleteToDo = useCallback(async (toDo: ToDo) => {
        const response = await fetch(`${API_URL}/todos`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: toDo.id })
        });
        if (response.ok) {
            setGroups(prevGroups => prevGroups.map(group =>
                group.id === toDo.group_id
                    ? {
                        ...group,
                        todos: group.todos.filter(todo => todo.id !== toDo.id)
                    }
                    : group
            ));
        } else {
            throw new Error("Failed to delete to do");
        }
    }, []);

    useEffect(() => {
        const initProvider = async () => {
            const loadedGroups = await loadGroups();
            setIsLoadingGroups(false);

            await loadAllTodos(loadedGroups);
            setIsLoadingTodos(false);

        };

        initProvider();

    }, [user, loadAllTodos, loadGroups]);

    return (
        <ToDosContext.Provider value={{
            toogleGroupMenu,
            isMenuOpen,
            selectedGroup,
            setGroup,
            getGroup,
            groups,
            loadAllTodos,
            loadTodos,
            isLoadingTodos,
            isLoadingGroups,
            createGroup,
            updateGroup,
            deleteGroup,
            createToDo,
            updateToDo,
            deleteToDo

        }}>
            {children}
        </ToDosContext.Provider>
    );
};

export const useToDos = () => {
    const context = useContext(ToDosContext);
    if (!context) {
        throw new Error("useToDos must be used within an ToDosProvider");
    }
    return context;
};