import SideMenu from "../../components/SideMenu/SideMenu";
import TopBar from "../../components/TopBar/TopBar";
import "./HomePage.css"
import MainPage from "../../components/MainContent/MainPage";
import { MessageType, usePopUps } from "../../context/popupsContext";
const HomePage = () => {
    const { shift } = usePopUps();
    
    try {
        return <>
            <TopBar />
            <div id="home-page">
                <SideMenu />
                <MainPage />
            </div>

        </>;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        shift({ message: "Something went wrong!", messageType: MessageType.ERROR });
    }
};

export default HomePage;