
import { MessageType, usePopUps } from "../../../context/popupsContext";
import ICONS from "../../../utils/icons";
import "./PopUpFeedbackMessage.css"

const PopUpFeedbackMessage = ({ feedback }: {
    feedback: {
        message: string;
        messageType: MessageType;
    } | null
}) => {
    const { unshift } = usePopUps();
    if (!feedback) { return ""; }
    return <div id="popup-feedback-container">
        {infoMessage(feedback.message, feedback.messageType, unshift)}
    </div>;
};
export default PopUpFeedbackMessage;

const infoMessage = (message: string, messageType: MessageType, closeFunc: () => void) => {

    return <div className="error" style={{ background: messageType }}>
        <div className="error__icon">{ICONS["info"]}</div>
        <div className="error__title">{message}</div>
        <div className="error__close" onClick={closeFunc}>{ICONS["cross"]}</div>
    </div>;
}