// filepath: /Users/yogirajsinhparmar/Documents/personal/docalert/src/frontend/renderer/pages/reset-password.jsx
import React, { useState } from "react";
import "../assets/css/reset-password.css";

export const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const response = await fetch(
        "http://localhost:3200/auth/reset-password",
        {
          method: "POST",
          body: JSON.stringify({ email, password }),
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.ok) {
        setMessage("Password reset successful.");
      } else {
        const data = await response.json();
        setError(data.message || "Password reset failed.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <div id="titlebar">
        <div id="window-controls">
          <button id="minimize">
            <i className="material-icons">remove</i>
          </button>
          <button id="maximize">
            <i className="material-icons">crop_square</i>
          </button>
          <button id="close">
            <i className="material-icons">close</i>
          </button>
        </div>
      </div>
      <div className="content">
        <div className="email-container">
          <form className="email-form" onSubmit={handleSubmit}>
            <h2>Please enter you email and new password</h2>
            {error && (
              <div
                id="error-message"
                style={{ color: "red", marginBottom: 10 }}
              >
                {error}
              </div>
            )}
            {message && (
              <div
                id="success-message"
                style={{ color: "green", marginBottom: 10 }}
              >
                {message}
              </div>
            )}
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit">Verify</button>
          </form>
        </div>
      </div>
    </>
  );
};
