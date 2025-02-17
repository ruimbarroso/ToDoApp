import { useMemo, type JSX } from "react";
import type { Group, ToDo } from "../../../models/todos";
import ToDoCard from "../ToDoList/ToDoCard";
const sort = (groups: Group[]) => {
    if (groups.length === 0) return [];
    const allTodos = groups.flatMap(group => group.todos);
    return allTodos.sort((todo1, todo2) => todo1.due_date.getTime() - todo2.due_date.getTime());
};
const getOverdues = (sortedTodos: ToDo[]) => {
    if (sortedTodos.length === 0) return [[], []];

    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

    const overdue = sortedTodos.filter(todo => todo && todo.due_date.getTime() < now && !todo.is_complete);

    const nearOverdue = sortedTodos.filter(todo => {
        if (!todo) return false;
        const dueTime = todo.due_date.getTime();
        return dueTime >= now && dueTime - now < sevenDays && !todo.is_complete;
    });

    return [overdue, nearOverdue];
};
const HomeContent = ({groups}:{groups:Group[]}) => {
    const buildList = useMemo(() => {
        const sortedTodos = sort(groups);
        const [overdue, nearOverdue] = getOverdues(sortedTodos)

        if (groups.length === 0) {
            return <p>You have no Groups, create one!</p>;
        }

        const buildCard = (todo: ToDo) => {
            if (!todo) return null;
            const group = groups.find(val => val.id === todo.group_id);
            if (!group) return null;

            return <ToDoCard color={group.color} todo={todo} key={todo.id} />;
        };

        const todosElem: (JSX.Element | null)[] = [];
        if (overdue && overdue.length > 0) {
            todosElem.push(<h1 key="overdueToDos">Overdue To Dos</h1>);

            todosElem.push(...overdue.map(buildCard).filter(Boolean));
        }

        if (nearOverdue && nearOverdue.length > 0) {
            todosElem.push(<h1 key="toDos">To Dos</h1>);
            todosElem.push(...nearOverdue.map(buildCard).filter(Boolean));
        }


        if (todosElem.length === 0) return <p>Hello you have nothing of importace right now!</p>;

        return todosElem;
    }, [groups]);

    return <>{buildList}</>;
};

export default HomeContent;
