import { useToDos, PageContentType } from "../../context/todosContext";
import PerfilCard from "./Perfil/Perfil";
import ToDoList from "./ToDoList/ToDoList";
import type { Group } from "../../models/todos";
import HomeContent from "./Home/Home";
import LoadingCircle from "../LoadingCircle/LoadingCircle";
import { useMemo } from "react";
import GroupPage from "../../pages/GroupPage/GroupPage";


const MainPage = () => {
    const { selectedGroup, getGroup, groups, isLoadingGroups, isLoadingTodos } = useToDos();

    const buildPage = useMemo(() => {
        switch (selectedGroup) {
            case PageContentType.PERFIL:
                return <PerfilCard />;
            case PageContentType.HOME:
                return (isLoadingGroups)?<LoadingCircle/>: <HomeContent groups={groups}/>;
            case PageContentType.ALL:
                return <><h1>All To Dos</h1><ToDoList groups={groups} /></>;
            default:
                {
                    const group: Group | null = getGroup();
                    return group ? <GroupPage group={group} /> : <h1>No Group</h1>;
                }
        }
    }, [selectedGroup, isLoadingGroups, groups, getGroup]);
    return <div id="main-content">
        {(isLoadingGroups || isLoadingTodos) ? LoadingCircle() : buildPage}
    </div>;
};

export default MainPage;