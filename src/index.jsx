import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import SettingPage from "./Page/SettingPage";
import HomePage from "./Page/HomePage";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/setting" element={<SettingPage />} />
    </Routes>
  </BrowserRouter>
);
