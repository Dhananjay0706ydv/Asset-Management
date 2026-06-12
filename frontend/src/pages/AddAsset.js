import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddAsset() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [totalQuantity, setTotalQuantity] = useState('');
  const [message, setMessage] = useState('');
  
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // If someone tries to visit this page without being logged in, kick them out
  if (!token) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Saving to database...');

    try {
      await axios.post('http://localhost:8000/api/assets', {
        name,
        category,
        description,
        totalQuantity: parseInt(totalQuantity) // Ensure it's a number, not text
      });

      setMessage('Asset added successfully!');
      
      // Clear the form for the next item
      setName('');
      setCategory('');
      setDescription('');
      setTotalQuantity('');

      // Clear success message after 3 seconds
      setTimeout(() => setMessage(''), 3000);

    } catch (error) {
      console.error(error);
      setMessage('Failed to add asset. Check your connection.');
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '40px auto', border: '1px solid #ddd', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
      <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '20px' }}>Add New Equipment</h2>
      
      {message && (
        <div style={{ padding: '10px', marginBottom: '20px', backgroundColor: message.includes('Failed') ? '#f8d7da' : '#d4edda', color: message.includes('Failed') ? '#721c24' : '#155724', borderRadius: '5px', textAlign: 'center', fontWeight: 'bold' }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Asset Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }} placeholder="e.g., Studio Microphone" />
        </div>

        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}>
            <option value="" disabled>Select a category...</option>
            <option value="DSLR Cameras">DSLR Cameras</option>
            <option value="Audio Systems">Audio Systems</option>
            <option value="Lighting">Lighting</option>
            <option value="Stage Props">Stage Props</option>
          </select>
        </div>

        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows="3" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }} placeholder="Provide key details..."></textarea>
        </div>

        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Total Quantity</label>
          <input type="number" min="1" value={totalQuantity} onChange={(e) => setTotalQuantity(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }} placeholder="e.g., 5" />
        </div>

        <button type="submit" style={{ padding: '12px', marginTop: '10px', backgroundColor: '#2980b9', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
          Save to Inventory
        </button>
      </form>
    </div>
  );
}

export default AddAsset;