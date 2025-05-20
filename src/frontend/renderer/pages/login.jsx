// <!doctype html>
// <html lang="en">
//   <head>
//     <meta charset="UTF-8" />
//     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//     <title>Login</title>
//     <link rel="stylesheet" href="../assets/css/login.css" />
//     <link rel="stylesheet" href="../assets/css/window-controls.css" />
//     <link
//       rel="stylesheet"
//       href="https://fonts.googleapis.com/icon?family=Material+Icons"
//     />
//   </head>
//   <body>

import React, { useState } from "react";
import "../assets/css/login.css";
import { HomePage } from "./home";
import { Link } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassWord] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleSubmit = async () => {
    const response = await fetch("http://localhost:3200/auth/sign-in", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.status === 200) {
      const data = await response.json();
      setToken(data.token);
      localStorage.setItem("token", data.token);
    }
  };
  return token ? (
    <HomePage />
  ) : (
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
        <div className="login-container">
          <form
            className="login-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
          >
            <h2>Login</h2>
            <div
              id="error-message"
              // style="color: red; display: none; margin-bottom: 10px"
            ></div>
            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <input
                type="text"
                id="email"
                name="email"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                onChange={(e) => setPassWord(e.target.value)}
              />
            </div>
            <button type="submit">Log In</button>
            <p className="login-switch">
              Don't have an account?{" "}
              <Link to="/signup">Create new account</Link>
            </p>
            <p className="forgot-password">
              Forgot password? <Link to="/reset-password">Reset password</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

//   </body>
// </html>
