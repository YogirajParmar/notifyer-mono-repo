import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/login.css";
import { useLoginMutation } from "../redux/api/auth/authApiSlice";
import React from "react";

export const Login = () => {
  console.log("Login componenet loading..");
  const [email, setEmail] = useState("");
  const [password, setPassWord] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [login, { isLoading }] = useLoginMutation();

  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSubmit = async (e) => {
    setError("");
    e.preventDefault();
    try {
      const result = await login({ email, password }).unwrap();
      console.log("Login success:", result);

      // save token locally
      localStorage.setItem("jwtToken", result.token);

      // redirect to home
      navigate("/home");
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.data.error);
    }
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="avatar"></div>
        <div className="login-card">
          <h2>Sign in</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="input-field"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="password-wrapper">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                className="input-field"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassWord(e.target.value)}
                required
              />
              <span
                className="toggle-password"
                onClick={() => setPasswordVisible((v) => !v)}
                style={{ cursor: "pointer" }}
              >
                {passwordVisible ? "Hide" : "Show"}
              </span>
            </div>

            {error && <div className="error">{error}</div>}
            <button
              className="login-btn"
              type="submit"
              disabled={loading || !email || !password}
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <div className="links">
            <a href="#">Forget your password</a>
          </div>
        </div>

        <div className="divider">New to our community</div>
        <button className="create-btn" onClick={() => navigate("/signup")}>Create an account</button>

        <div className="footer">
          <span>© 2023 Vehicle Document Manager. All rights reserved.n</span>
        </div>
      </div>
    </div>
  );
};
