import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Notes from "./pages/Notes";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/notes" element={token ? <Notes /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/notes" />} />
      </Routes>
    </Router>
  );
}

export default App;
