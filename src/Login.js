import React, { useState } from "react";

function Login({ onLogin }) {
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="password"
        placeholder="Heslo"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Přihlásit se</button>
    </form>
  );
}

export default Login;
