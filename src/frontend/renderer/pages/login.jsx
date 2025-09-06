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
  console.log("Login Page - Component is rendering");
  const [email, setEmail] = useState("");
  const [password, setPassWord] = useState("");
  const [token, setToken] = useState(localStorage.getItem("jwtToken"));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    console.log("Form submitted with email:", email);

    try {
      const response = await fetch("http://localhost:3200/auth/sign-in", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        localStorage.setItem("jwtToken", data.token);
        // Redirect to home page or handle successful login
        window.location.hash = "#/home";
      } else {
        setError(data.error || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f0f2f5', 
      display: 'flex', 
      flexDirection: 'column',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
    }}>
      <div id="titlebar" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '32px',
        background: '#f0f0f0',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        zIndex: 9999
      }}>
        <div id="window-controls" style={{ display: 'flex' }}>
          <button id="minimize" style={{
            width: '46px',
            height: '32px',
            background: 'transparent',
            border: 'none',
            color: '#333',
            fontSize: '10px',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <i className="material-icons">remove</i>
          </button>
          <button id="maximize" style={{
            width: '46px',
            height: '32px',
            background: 'transparent',
            border: 'none',
            color: '#333',
            fontSize: '10px',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <i className="material-icons">crop_square</i>
          </button>
          <button id="close" style={{
            width: '46px',
            height: '32px',
            background: 'transparent',
            border: 'none',
            color: '#333',
            fontSize: '10px',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <i className="material-icons">close</i>
          </button>
        </div>
      </div>
      <div className="content" style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '32px'
      }}>
        <div className="login-container" style={{
          backgroundColor: 'white',
          padding: '2.5rem',
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
          width: '100%',
          maxWidth: '350px'
        }}>
          <form
            className="login-form"
            onSubmit={(e) => {
              handleSubmit(e);
            }}
          >
            <h2 style={{
              marginTop: 0,
              marginBottom: '1.5rem',
              textAlign: 'center',
              color: '#333',
              fontSize: '1.8rem',
              fontWeight: 600
            }}>Login</h2>
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
            <div
              id="error-message"
              // style="color: red; display: none; margin-bottom: 10px"
            ></div>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="email" style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#555',
                fontWeight: 500
              }}>E-mail</label>
              <input
                type="text"
                id="email"
                name="email"
                required
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
            </div>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="password" style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#555',
                fontWeight: 500
              }}>Password</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                onChange={(e) => setPassWord(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
            </div>
            <button type="submit" style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: loading ? '#ccc' : '#333',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer'
            }} disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>
            <p className="login-switch" style={{
              textAlign: 'center',
              marginTop: '1rem',
              fontSize: '0.9rem',
              color: '#555'
            }}>
              Don't have an account?{" "}
              <Link to="/signup" style={{
                color: '#333',
                textDecoration: 'none',
                fontWeight: 600
              }}>Create new account</Link>
            </p>
            <p className="forgot-password" style={{
              textAlign: 'center',
              marginTop: '1rem',
              fontSize: '0.9rem',
              color: '#555'
            }}>
              Forgot password? <Link to="/reset-password" style={{
                color: '#333',
                textDecoration: 'none',
                fontWeight: 600
              }}>Reset password</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

//   </body>
// </html>
