import { MessageType, usePopUps } from "../../../context/popupsContext";
import { useAuth } from "../../../context/userContext";
import ICONS from "../../../utils/icons";
import "./Perfil.css";

const PerfilCard = () => {
  const { user, remove } = useAuth();
  const { shift } = usePopUps();

  if (user === null) {
    return (
      <h1>No User</h1>
    );
  }
  return (
    <div className="card">
      <div className="img">
        {ICONS["perfil"]}
      </div>
      <span>{"ID:"}</span>
      <p className="info">{user.id}</p>
      <span>{"Email:"}</span>
      <p className="info">{user.email}</p>
      <button onClick={async () => {
        try {
          await remove();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          shift({ message: "The user was not deleted!", messageType: MessageType.ERROR });
        }
      }}>Delete</button>
    </div>
  );
}

export default PerfilCard;
