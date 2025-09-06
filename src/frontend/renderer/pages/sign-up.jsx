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
  const [token, setToken] = useState(localStorage.getItem("jwtToken"));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3200/auth/sign-up", {
        method: "POST",
        body: JSON.stringify({ firstName, lastName, email, password }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        localStorage.setItem("jwtToken", data.token);
        // Redirect to home page or handle successful signup
        window.location.hash = "#/home";
      } else {
        setError(data.error || "Sign-up failed. Please try again.");
      }
    } catch (error) {
      console.error("Sign-up error:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
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
        <div className="signup-container">
          <form
            className="signup-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
          >
            <h2>Sign Up</h2>
            {error && (
              <div style={{
                color: 'red',
                marginBottom: '1rem',
                textAlign: 'center',
                padding: '0.5rem',
                backgroundColor: '#fee',
                borderRadius: '4px',
                border: '1px solid #fcc'
              }}>
                {error}
              </div>
            )}
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
            <button type="submit" disabled={loading} style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: loading ? '#ccc' : '#333',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}>
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
            <p className="signup-switch">
              Already have an account? <Link to="/">log in</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};
