import type { JSX } from "react";
import { usePopUps } from "../../context/popupsContext";
import "./TooglePopUpButton.css"
import type { Group, ToDo } from "../../models/todos";

const AddButton = ({icon, toEdit}:{icon:JSX.Element, toEdit: ToDo | Group}) => {
    const { toggleIsPopUpFormActive } = usePopUps();
    
    return <button className="crud-button" onClick={() => {
        toggleIsPopUpFormActive(toEdit);
    }}>
        {icon}
    </button>;
};

export default AddButton;