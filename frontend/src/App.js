import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Inventory from './pages/Inventory';
import Login from './pages/Login';
import AddAsset from './pages/AddAsset'; 
import Tracker from './pages/Tracker'; // <-- Tells React the new page exists

function NavigationBar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav style={{ padding: '15px 40px', backgroundColor: '#2c3e50', color: 'white', display: 'flex', gap: '20px', alignItems: 'center' }}>
      <h3 style={{ margin: 0, marginRight: 'auto' }}>IITR Assets</h3>
      
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Dashboard</Link>
      
      {token ? (
        <>
          {/* THIS IS THE MISSING BUTTON! */}
          <Link to="/tracker" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Issued Assets</Link>
          <Link to="/add-asset" style={{ color: '#f1c40f', textDecoration: 'none', fontWeight: 'bold' }}>+ Add Asset</Link>
          <button onClick={handleLogout} style={{ backgroundColor: '#c0392b', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
            Logout
          </button>
        </>
      ) : (
        <Link to="/login" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Login</Link>
      )}
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<Inventory />} />
          <Route path="/login" element={<Login />} />
          <Route path="/add-asset" element={<AddAsset />} />
          <Route path="/tracker" element={<Tracker />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;