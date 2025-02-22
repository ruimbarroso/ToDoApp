import { useState } from "react";
import type { Group, ToDo } from "../../../models/todos";
import "./PopUpForm.css"
import { SketchPicker } from "react-color";
import { MessageType, usePopUps } from "../../../context/popupsContext";
import { useToDos } from "../../../context/todosContext";

const PopUpForm = () => {
    const { toEdit } = usePopUps();
    const isGroup = (item: Group | ToDo): item is Group => {
        return 'color' in item;
    };
    return <div id="popup-form-container">
        <div id="popup-form">
            {isGroup(toEdit) ? <CreateGroupForm toEdit={toEdit} /> : <CreateToDoForm toEdit={toEdit} />}
        </div>
    </div>;

};

export default PopUpForm;



const CreateGroupForm = ({ toEdit }: { toEdit: Group }) => {
    const { toggleIsPopUpFormActive } = usePopUps();
    const [newGroup, setNewGroup] = useState<Group>(toEdit);
    const { createGroup, updateGroup } = useToDos();
    const { shift } = usePopUps();

    const submit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!newGroup.name || !newGroup.description || !newGroup.color) {
            shift({ message: "You need to provide a Name a Description and a Color!", messageType: MessageType.WARNING });
            return;
        }
        try {
            if (newGroup.id === 0) {
                await createGroup(newGroup);
            } else {
                await updateGroup(newGroup);
            }

            toggleIsPopUpFormActive(null);
            shift({ message: `${newGroup.name} ${(newGroup.id === 0) ? "Created" : "Updated"}!`, messageType: MessageType.SUCCESS });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            shift({ message: `Error ${(newGroup.id === 0) ? "Creating" : "Updating"} Group!`, messageType: MessageType.ERROR });
        }

    };

    return (
        <form className="group-form" onSubmit={submit}>
            <p className="form-title">{newGroup.id === 0 ? "Create Group" : "Edit Group"}</p>

            <div className="group-input-container">
                <input
                    placeholder="Enter Name"
                    type="text"
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                />
            </div>

            <div className="group-input-container">
                <input
                    placeholder="Enter description"
                    type="text"
                    value={newGroup.description}
                    onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                />
            </div>
            <SketchPicker width={null}
                color={`#${newGroup.color}`}
                onChange={(updatedColor) => setNewGroup({ ...newGroup, color: updatedColor.hex.replace('#', '') })}
            />



            <button className="group-submit" type="submit">
                {newGroup.id === 0 ? "Create" : "Edit"}
            </button>
            <button className="group-cancel" type="button" onClick={() => toggleIsPopUpFormActive(null)}>
                Cancel
            </button>
        </form>
    );
}

const CreateToDoForm = ({ toEdit }: { toEdit: ToDo }) => {
    const { toggleIsPopUpFormActive, shift } = usePopUps();
    const [newToDo, setNewToDo] = useState<ToDo>(toEdit);
    const { createToDo, updateToDo } = useToDos();

    const submit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!newToDo.name || !newToDo.due_date) {
            shift({ message: "You need to provide a Name and a Due Date!", messageType: MessageType.WARNING });
            return;
        }
        try {
            if (newToDo.id === 0) {
                await createToDo(newToDo);
            } else {
                await updateToDo(newToDo);
            }

            shift({ message: `${newToDo.name} ${(newToDo.id === 0) ? "Created" : "Updated"}!`, messageType: MessageType.SUCCESS });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            shift({ message: `Error ${(newToDo.id === 0) ? "Creating" : "Updating"} To Do!`, messageType: MessageType.ERROR });
        }
    };

    return (
        <form className="group-form" onSubmit={submit}>

            <p className="form-title">{newToDo.id === 0 ? "Create To Do" : "Edit To Do"}</p>

            <div className="group-input-container">
                <input
                    placeholder="Enter Name"
                    type="text"
                    value={newToDo.name}
                    onChange={(e) => setNewToDo({ ...newToDo, name: e.target.value })}
                />
            </div>

            <div className="group-input-container">
                <div className="input-checkbox">
                    <label>
                        Completed:
                    </label>
                    <input
                        type="checkbox"
                        checked={newToDo.is_complete}
                        onChange={(e) => setNewToDo({ ...newToDo, is_complete: e.target.checked })}
                    />
                </div>


            </div>

            <div className="group-input-container">
                <input
                    type="date"
                    value={newToDo.due_date.toISOString().split("T")[0]}
                    onChange={(e) => setNewToDo({ ...newToDo, due_date: new Date(e.target.value) })}
                />
            </div>



            <button className="group-submit" type="submit">
                {newToDo.id === 0 ? "Create" : "Edit"}
            </button>
            <button className="group-cancel" type="button" onClick={() => toggleIsPopUpFormActive(null)}>
                Cancel
            </button>
        </form>
    );
}