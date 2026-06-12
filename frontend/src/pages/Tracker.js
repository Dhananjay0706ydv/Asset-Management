import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function Tracker() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  const fetchBookings = useCallback(async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get('http://localhost:8000/api/bookings', config);
      setBookings(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleReturnAsset = async (booking) => {
    // Detects whether the database uses 'id' or '_id' automatically
    const bookingId = booking.id || booking._id; 
    
    if (!bookingId) {
        alert("Error: Could not identify this booking's ID.");
        return;
    }

    const confirmReturn = window.confirm("Return this asset? This will clear the record and update inventory.");
    if (!confirmReturn) return;

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`http://localhost:8000/api/bookings/${bookingId}`, config);
      
      // Update UI
      setBookings(bookings.filter((b) => (b.id || b._id) !== bookingId));
      alert("Asset returned successfully!");
    } catch (error) {
      console.error("DEBUG ERROR:", error.response?.data || error.message);
      alert("Failed to return asset. Check console for details.");
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#2c3e50' }}>Issued Assets Tracker</h1>
      
      {loading ? (
        <h3>Loading ledger...</h3>
      ) : bookings.length === 0 ? (
        <p>No assets are currently issued.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <thead>
            <tr style={{ backgroundColor: '#2c3e50', color: 'white', textAlign: 'left' }}>
              <th style={{ padding: '12px' }}>Asset ID</th>
              <th style={{ padding: '12px' }}>Borrower</th>
              <th style={{ padding: '12px' }}>Roll / ID</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id || booking._id} style={{ borderBottom: '1px solid #ddd', backgroundColor: 'white' }}>
                <td style={{ padding: '12px', fontWeight: 'bold', color: '#2980b9' }}>
                  {booking.assetId?.substring(0, 8) || 'N/A'}...
                </td>
                <td style={{ padding: '12px' }}>{booking.borrowerName}</td>
                <td style={{ padding: '12px' }}>{booking.borrowerId}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <button 
                    onClick={() => handleReturnAsset(booking)} 
                    style={{ padding: '8px 12px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                  >
                    Return Asset
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Tracker;