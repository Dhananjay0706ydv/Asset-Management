import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  // Store what the user types into the boxes
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  
  // This tool lets us redirect the user to another page
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevents the page from refreshing when you hit submit
    setMessage('Checking credentials...');

    try {
      const response = await axios.post('http://localhost:8000/api/auth/login', {
        email: email,
        password: password
      });
      
      // Success! Save the VIP token to the browser's memory
      localStorage.setItem('token', response.data.token);
      setMessage('Login successful! Redirecting to dashboard...');
      
      // Send them back to the dashboard after a quick 1-second delay
      setTimeout(() => {
        navigate('/');
      }, 1000);

    } catch (error) {
      console.error(error);
      setMessage('Login failed. Please check your email and password.');
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '400px', margin: '40px auto', border: '1px solid #ddd', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
      <h2 style={{ textAlign: 'center', color: '#2c3e50' }}>Admin Login</h2>
      
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        <input 
          type="email" 
          placeholder="Email address" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: '12px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' }}
          required
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: '12px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' }}
          required
        />
        <button 
          type="submit" 
          style={{ padding: '12px', fontSize: '16px', backgroundColor: '#2980b9', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Sign In
        </button>
      </form>

      {/* Show success or error messages here */}
      {message && (
        <p style={{ marginTop: '20px', textAlign: 'center', fontWeight: 'bold', color: message.includes('failed') ? '#c0392b' : '#27ae60' }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default Login;