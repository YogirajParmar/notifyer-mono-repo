import { useState } from "react";
import { HomePage } from "./home";
import React from "react";
import { Link } from "react-router-dom";
import "../assets/css/signup.css";

export const SignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3200/auth/sign-up", {
      method: "POST",
      body: JSON.stringify({ firstName, lastName, email, password }),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error:", errorData);
    }

    const data = await response.json();
    setToken(data.token);
    localStorage.setItem("token", data.token);
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
        <div className="signup-container">
          <form
            className="signup-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
          >
            <h2>Sign Up</h2>
            <div className="form-group">
              <label htmlFor="firstname">First Name</label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                required
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                required
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
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
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit">Sign Up</button>
            <p className="signup-switch">
              Already have an account? <Link to="/">log in</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};
