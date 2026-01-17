import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";

// --- Protected Route Wrapper ---
// This checks if a token exists. If not, it kicks the user to /login.
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("jwtToken");
  
  if (!token) {
    // 'replace' prevents the user from clicking Back to return to a protected page
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- Protected Routes --- */}
        <Route
          path="/assets"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* --- Default Redirect --- */}
        {/* If user goes to "/", send them to "/assets" (which handles the auth check) */}
        <Route path="/" element={<Navigate to="/assets" replace />} />
        
        {/* Catch-all for 404s - Send back to home */}
        <Route path="*" element={<Navigate to="/assets" replace />} />
      </Routes>
    </Router>
  );
}

export default App;