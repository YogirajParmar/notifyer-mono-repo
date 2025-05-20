import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./login";
import { SignUp } from "./sign-up";
import { HomePage } from "./home";
import { ResetPassword } from "./reset-password";
import React from "react";

export const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/home" element={<HomePage />} />
    </Routes>
  </Router>
);
