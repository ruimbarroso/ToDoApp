import { type JSX } from "react";
const COLOR_WHITE = "FFFFFF";

/**
 * A utility function that wraps a child element in a `div` with a customizable background color.
 * If no color is provided, it defaults to white (`#FFFFFF`).
 *
 * @function
 *
 * @param {string} color - The background color in hexadecimal format (without the `#` prefix).
 * @param {JSX.Element | null} child - The child element to render inside the `div`. If `null`, nothing is rendered.
 * @returns {JSX.Element} - A `div` element with the specified background color and the child element (if provided).
 */
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