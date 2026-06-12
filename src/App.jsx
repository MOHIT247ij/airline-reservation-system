// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";


import ImportPage from "./pages/AirlineImportPage";
import LibraryDashboard from "./pages/AirlineDashboard";

export default function App() {
  return (
    <Router>
      

      <Routes>
        {/* Main Professor Management UI */}
        <Route path="/" element={<LibraryDashboard />} />

        {/* Import XML page */}
        <Route path="/importxml" element={<ImportPage />} />

      
  
      </Routes>
    </Router>
  );
}
