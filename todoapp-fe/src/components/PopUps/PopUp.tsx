// import { useState } from "react";
import { usePopUps } from "../../context/popupsContext";
import PopUpFeedbackMessage from "./PopUpFeedback/PopUpFeedbackMessage";
import PopUpForm from "./PopUpForm/PopUpForm";


const PopUp = () => {
    const { isFeedbackMessageActive, isPopUpFormActive,nextFeedback } = usePopUps();
    return <div>
        {(isPopUpFormActive) ? <PopUpForm/> : ""}
        {(isFeedbackMessageActive) ? <PopUpFeedbackMessage feedback={nextFeedback()} /> : ""}
    </div>;


};

export default PopUp;