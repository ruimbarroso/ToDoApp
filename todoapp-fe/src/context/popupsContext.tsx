import { createContext, type ReactNode, useContext, useEffect, useState } from "react";
import type { Group, ToDo } from "../models/todos";

interface PupUpsContextType {
    toEdit: Group | ToDo;
    isPopUpFormActive: boolean;
    toggleIsPopUpFormActive: (valueToEdit: Group | ToDo | null) => void;
    isFeedbackMessageActive: boolean;
    nextFeedback: () => { message: string; messageType: MessageType; } | null;
    shift: (feedback: { message: string, messageType: MessageType }) => void;
    unshift: () => void;
}

const PopUpsContext = createContext<PupUpsContextType | undefined>(undefined);
const DEFAULT_VALUE = {
    id: 0,
    name: "",
    description: "",
    color: "",
    todos: [],
    user_id: 0,
};
export enum MessageType {
    SUCCESS = "#19AE22",
    INFO = "#1368D9",
    WARNING = "#D78500",
    ERROR = "#D91313"

}

type FeedbackMessage = { message: string; messageType: MessageType };
export const PopUpsProvider = ({ children }: { children: ReactNode }) => {
    const [toEdit, setToEdit] = useState<Group | ToDo>(DEFAULT_VALUE);
    const [feedbackMessages, setFeedbackMessages] = useState<FeedbackMessage[]>([]);
    const [isPopUpFormActive, setIsPopUpFormActive] = useState(false);
    const [isFeedbackMessageActive, setIsFeedbackMessageActive] = useState(false);
    const [timer, setTimer] = useState<Timer | null>(null);

    const toggleIsPopUpFormActive = (valueToEdit: Group | ToDo | null) => {
        setToEdit(valueToEdit || DEFAULT_VALUE);
        setIsPopUpFormActive((prev) => !prev);
    };

    const nextFeedback = (): FeedbackMessage | null => {
        return feedbackMessages.length > 0 ? feedbackMessages[0] : null;
    };

    const shift = (feedback: FeedbackMessage) => {
        setFeedbackMessages((prevMessages) => {
            const newMessages = [...prevMessages, feedback];

            if (newMessages.length === 1) {
                setIsFeedbackMessageActive(true);
                const newTimer = setTimeout(() => {
                    unshift();
                }, 5000);
                setTimer(newTimer);
            }

            return newMessages;
        });
    };

    const unshift = () => {
        setFeedbackMessages((prevMessages) => {
            if (prevMessages.length <= 1) {
                if (timer) {
                    clearTimeout(timer);
                    setTimer(null);
                }
                setIsFeedbackMessageActive(false);
                return [];
            }

            setTimer(prev => {
                if (prev) clearTimeout(prev);
                return setTimeout(() => {
                    unshift();
                }, 5000);
            });

            return prevMessages.slice(1);
        });
    };

    useEffect(() => {
        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [timer]);
    return (
        <PopUpsContext.Provider value={{
            toEdit,
            isPopUpFormActive,
            toggleIsPopUpFormActive,
            isFeedbackMessageActive,
            nextFeedback,
            shift,
            unshift,
        }}>
            {children}
        </PopUpsContext.Provider>
    );
};

export const usePopUps = () => {
    const context = useContext(PopUpsContext);
    if (!context) {
        throw new Error("usePopUps must be used within an PupUpsProvider");
    }
    return context;
};