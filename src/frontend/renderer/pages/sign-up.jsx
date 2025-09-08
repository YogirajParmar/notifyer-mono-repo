import React from "react";
import { useState } from "react";
import "../assets/css/signup.css";
import { Link, useNavigate } from "react-router-dom";
import { useSignupMutation } from "../redux/api/auth/authApiSlice";

export const SignUp = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [signUp, { isLoading }] = useSignupMutation();

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(isLoading);

    try {
      const result = await signUp({
        email,
        password,
        firstName,
        lastName,
      }).unwrap();
      setLoading(isLoading);

      // save auth token
      localStorage.setItem("jwtToken", result.token);

      // navigate to home
      navigate("/home");
    } catch (error) {
      console.log("Error occured: ", error);
      setError(err.data.error);
    }
  };

  console.log({ email, password, firstName, lastName });

  return (
    <div className="signup-page">
      <div class="container">
        <div className="top-right-link">
          <p className="link-text">
            Already have an account?{" "}
            <Link to="/" className="login-link">
              {" "}
              login here
            </Link>
          </p>
        </div>
        <div class="logo-placeholder"></div>
        <div class="signup-card">
          <h1 class="card-title">Create an account</h1>

          <form onSubmit={handleSignUp}>
            <div class="form-group">
              <input
                id="first-name"
                name="first-name"
                type="text"
                required
                class="form-input"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
              />
            </div>

            <div class="form-group">
              <input
                type="text"
                required
                class="form-input"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
              />
            </div>

            <div class="form-group">
              <div class="tooltip">
                <input
                  required
                  class="form-input"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div class="form-group">
              <div class="input-with-icon">
                <input
                  type={passwordVisible ? "text" : "password"}
                  required
                  class="form-input"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  class="input-icon"
                  onClick={() => setPasswordVisible((v) => !v)}
                  style={{ cursor: "pointer" }}
                >
                  {passwordVisible ? "Hide" : "Show"}
                </span>
              </div>
              <div class="password-tooltip">
                <div>
                  <div class="tooltip-icon"></div>
                  <span>Use 8 or more characters</span>
                </div>
                <div>
                  <div class="tooltip-icon"></div>
                  <span>Use upper and lower case letters (e.g. Aa)</span>
                </div>
                <div>
                  <div class="tooltip-icon"></div>
                  <span>Use a number (e.g. 1234)</span>
                </div>
                <div>
                  <div class="tooltip-icon"></div>
                  <span>Use a symbol (e.g. !@#$)</span>
                </div>
              </div>
            </div>

            {error && <div className="error">{error}</div>}

            <button type="submit" class="button-primary">
              Sign up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
