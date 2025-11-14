import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Notes from "./pages/Notes";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Whenever token in localStorage changes (login/register), update state
  useEffect(() => {
    const handleStorageChange = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Default route */}
        <Route
          path="/"
          element={token ? <Navigate to="/notes" replace /> : <Navigate to="/register" replace />}
        />

        {/* Auth routes */}
        <Route path="/register" element={<Register setToken={setToken} />} />
        <Route path="/login" element={<Login setToken={setToken} />} />

        {/* Protected route */}
        <Route path="/notes" element={token ? <Notes /> : <Navigate to="/login" replace />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
