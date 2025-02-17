import "./ToDoCard.css"
import type { ToDo } from "../../../models/todos";
import ICONS from "../../../utils/icons";
import { groupColor } from "../../../utils/components";
import AddButton from "../../PopUps/TooglePopUpButton";
import { useToDos } from "../../../context/todosContext";
import { MessageType, usePopUps } from "../../../context/popupsContext";



const ToDoCard = ({ todo, color }: { todo: ToDo, color: string }) => {
    const {deleteToDo, updateToDo} = useToDos();
    
      const { shift } = usePopUps();
    return (
        <div className="todo-card">
            {groupColor(color,
                <div className="todo-edit">
                    <AddButton toEdit={todo} icon={ICONS["edit"]} />
                </div>
            )}

            <div className="todo-content">
                <div className="todo-name">
                    {todo.name}
                </div>
                <div className="todo-time" style={{ color: (isToDoDue(todo.due_date)) ? "red" : "white" }}>
                    {todo.due_date.toDateString()}
                </div>
                <div className="todo-status">
                    <button onClick={async() => {
                        todo.is_complete = !todo.is_complete;
                        try {
                            await updateToDo(todo);
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        } catch (error) {
                            shift({ message: "The To Do was not updated!", messageType: MessageType.ERROR });
                        }
                    }}>
                        {todo.is_complete ? ICONS["complete"] : ICONS["incomplete"]}
                    </button>

                </div>
            </div>
            <div className="todo-control">
                <div className="todo-delete">
                    <button onClick={async () => {
                        try {
                            await deleteToDo(todo);
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        } catch (error) {
                            shift({ message: "The To Do was not deleted!", messageType: MessageType.ERROR });
                        }
                    }}>
                        {ICONS["delete"]}
                    </button>

                </div>

            </div>
        </div>
    );
};

const isToDoDue = (date: Date): boolean => {
    if (isNaN(date.getTime())) {
        throw new Error("Invalid date provided");
    }
    return date.getTime() <= Date.now();
};
export default ToDoCard;