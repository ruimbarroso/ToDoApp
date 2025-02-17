import "./MenuButton.css"

const MenuButton = ({ onButtonClick }: { onButtonClick: () => void }) => {
    function handleOnChange() {
        onButtonClick();
    }
    return (
        <label className="burger" htmlFor="burger">
            <input type="checkbox" id="burger" onChange={handleOnChange} />
            <span></span>
            <span></span>
            <span></span>
        </label>
    );
}

export default MenuButton;