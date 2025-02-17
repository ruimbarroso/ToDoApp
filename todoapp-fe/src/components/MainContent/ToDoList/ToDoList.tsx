import { useToDos } from "../../../context/todosContext";
import ToDoCard from "./ToDoCard";
import type { Group } from "../../../models/todos";
import LoadingCircle from "../../LoadingCircle/LoadingCircle";


const ToDoList = ({ groups }: { groups: Group[] }) => {
    const { isLoadingTodos } = useToDos();
    const buildList = () => {
        if (isLoadingTodos || groups.length === 0 || !groups[0].todos) {
            return <LoadingCircle />;
        }

        const todosElem = [];

        for (const group of groups) {
            for (const todo of group.todos) {
                todosElem.push(<ToDoCard color={group.color} todo={todo} key={todo.id} />);
            }
        }

        if (todosElem.length === 0) return <p>No To Dos</p>;
        return todosElem;
    };

    return <>{groups.length === 0 ? <p>No To Dos</p> : buildList()}</>;

};

export default ToDoList;