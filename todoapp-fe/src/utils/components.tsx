import { type JSX } from "react";
const COLOR_WHITE = "FFFFFF";

export const groupColor = (color: string, child: JSX.Element | null) => {
    return (
        <div
            className="group-color"
            style={{
                backgroundColor: `#${color || COLOR_WHITE}`,
            }}
        >
            {(!child) ? "" : child}
        </div>
    );
};