import React, { useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";

function Login({ onLogin, onLogout, isLoggedIn }) {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  console.log(isLoggedIn);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(password);
  };
  if (isLoggedIn) {
    navigate("/");
  }
  return (
    <div className="card">
      <h4 className="title">Přihlášení</h4>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <svg className="input-icon" viewBox="0 0 500 500">
            <path d="M80 192V144C80 64.47 144.5 0 224 0C303.5 0 368 64.47 368 144V192H384C419.3 192 448 220.7 448 256V448C448 483.3 419.3 512 384 512H64C28.65 512 0 483.3 0 448V256C0 220.7 28.65 192 64 192H80zM144 192H304V144C304 99.82 268.2 64 224 64C179.8 64 144 99.82 144 144V192z"></path>
          </svg>
          <input
            type="password"
            placeholder="Heslo"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
        </div>
        <button className="btn" type="submit">
          Přihlásit se
        </button>
      </form>
    </div>
  );
}

export default Login;
