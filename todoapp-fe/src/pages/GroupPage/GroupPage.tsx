
import ICONS from "../../utils/icons";
import type { Group } from "../../models/todos";
import ToDoList from "../../components/MainContent/ToDoList/ToDoList";
import AddButton from "../../components/PopUps/TooglePopUpButton";
import { PageContentType, useToDos } from "../../context/todosContext";
import { MessageType, usePopUps } from "../../context/popupsContext";
const GroupPage = ({ group }: { group: Group }) => {
    const { deleteGroup, setGroup } = useToDos();

    const { shift } = usePopUps();
    return (
        <div id="group-page">
            <div id="group-header">
                <div className="group-header-section">
                    <h1>{group.name}</h1>
                    <p>{group.description}</p>
                </div>
                <div className="group-header-section">
                    <AddButton toEdit={group} icon={ICONS["edit"]} />
                    <button className="crud-button" style={{ background: "red" }} onClick={async () => {
                        try {
                            await deleteGroup(group);
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        } catch (error) {
                            shift({ message: "The Group was not deleted!", messageType: MessageType.ERROR });
                        }
                        setGroup(PageContentType.HOME);
                    }}>
                        {ICONS["delete"]}
                    </button>
                </div>

            </div>
            <div id="group-add-todo">
                <h1>To Dos</h1>
            </div>
            <ToDoList groups={[group]} />

            <div id="group-add-todo">
                <AddButton toEdit={{
                    id: 0,
                    name: "",
                    is_complete: false,
                    due_date: new Date(Date.now()),
                    group_id: group.id
                }} icon={ICONS["add"]} />
            </div>

        </div>
    );
};

export default GroupPage;