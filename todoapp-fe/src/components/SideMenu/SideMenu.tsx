import "./SideMenu.css"

import type { JSX } from "react";
import type { Group } from "../../models/todos";
import ICONS from "../../utils/icons";
import { useToDos, PageContentType } from "../../context/todosContext";
import { groupColor } from "../../utils/components";
import AddButton from "../PopUps/TooglePopUpButton";
import { useAuth } from "../../context/userContext";
import { MessageType, usePopUps } from "../../context/popupsContext";

const COLOR_WHITE = "ffffff";
const SideMenu = () => {
    const { user, logout } = useAuth();
    const { isMenuOpen, setGroup, groups, selectedGroup } = useToDos();
    const { shift } = usePopUps();
    const buildMenuOption = (group: Group, index: number): JSX.Element => {
        return createButton(group.color, index, ICONS["todo"], group.name);
    };
    const createButton = (color: string, groupIndex: number, icon: JSX.Element, description: string) => {
        return <div className="input-option" key={groupIndex}>
            {groupColor(color, null)}
            <button className="value" {...(selectedGroup === groupIndex && { id: "active" })} onClick={() => {
                try {
                    setGroup(groupIndex);
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (error) {
                    shift({ message: "You tried to access an non existent page!", messageType: MessageType.ERROR });
                }
            }}>
                {icon}
                {isMenuOpen ? description : ""}
            </button>
        </div>;
    };

    return (
        <div className="input" id={isMenuOpen ? "open-menu" : "closed-menu"}>

            {createButton(COLOR_WHITE, PageContentType.HOME, ICONS["home"], "Home")}
            {createButton(COLOR_WHITE, PageContentType.ALL, ICONS["list"], "All")}

            {groups.map(buildMenuOption)}

            <div className="create-option">
                <AddButton toEdit={{
                    id: 0,
                    name: "",
                    description: "",
                    color: "",
                    todos: [],
                    user_id: user ? user.id : 0
                }} icon={ICONS["add"]} />
            </div>

            {createButton(COLOR_WHITE, PageContentType.PERFIL, ICONS["perfil"], "Public profile")}
            <div className="create-option">
                <button className="crud-button" onClick={() => {
                    try {
                        logout()
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    } catch (error) {
                        shift({ message: "Error Login out!", messageType: MessageType.ERROR });
                    }
                }}>
                    {ICONS["logout"]}
                </button>
            </div>
        </div>
    );
};






export default SideMenu;
