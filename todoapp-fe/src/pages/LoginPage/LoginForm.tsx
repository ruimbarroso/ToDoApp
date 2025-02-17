import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';
import { useAuth } from '../../context/userContext';
import { MessageType, usePopUps } from '../../context/popupsContext';

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const { shift } = usePopUps();
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await login(email, password);
      navigate("/");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      shift({ message: "Wrong Password! You are not Login", messageType: MessageType.ERROR });
    }
    
    
    
  };

  return (
    <form className="form" onSubmit={submit}>
      <p className="form-title">Sign in to your account</p>

      <div className="input-container">
        <input
          placeholder="Enter email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="input-container">
        <input
          placeholder="Enter password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button className="submit" type="submit">
        Sign in
      </button>
    </form>
  );
}

export default LoginForm;
