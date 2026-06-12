import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Inventory() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingMessage, setBookingMessage] = useState('');

  // NEW: State variables to control our pop-up form
  const [showModal, setShowModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [borrowerName, setBorrowerName] = useState('');
  const [borrowerId, setBorrowerId] = useState('');

  const token = localStorage.getItem('token');

  const fetchAssets = () => {
    axios.get('http://localhost:8000/api/assets')
      .then((response) => {
        setAssets(response.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError("Failed to connect to the backend.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  // NEW: Function to open the pop-up and remember which item we clicked
  const openIssueModal = (asset) => {
    setSelectedAsset(asset);
    setBorrowerName(''); // Clear old names
    setBorrowerId('');
    setShowModal(true);
  };

  // UPDATED: The function that actually sends the data
  const handleConfirmIssue = async () => {
    // Basic validation
    if (!borrowerName || !borrowerId) {
      alert("Please enter both the Borrower's Name and ID.");
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      // NEW: We now include the borrower details in the package!
      const requestData = {
        assetId: selectedAsset.id,
        requestedQty: 1,
        startDate: new Date().toISOString(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
        borrowerName: borrowerName,
        borrowerId: borrowerId
      };

      await axios.post('http://localhost:8000/api/bookings', requestData, config);
      
      setBookingMessage(`Successfully issued to ${borrowerName}!`);
      setShowModal(false); // Close the pop-up
      fetchAssets(); // Refresh the numbers

      setTimeout(() => setBookingMessage(''), 4000);

    } catch (error) {
      console.error(error);
      setBookingMessage('Issue failed. Please try again.');
      setShowModal(false);
      setTimeout(() => setBookingMessage(''), 4000);
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#2c3e50' }}>IIT Roorkee Asset Management</h1>
      <p style={{ color: '#7f8c8d', fontSize: '18px' }}>Live Inventory Dashboard</p>
      
      <hr style={{ margin: '20px 0', border: '1px solid #eee' }} />

      {loading && <h3>Loading equipment...</h3>}
      {error && <h3 style={{ color: 'red' }}>{error}</h3>}
      
      {bookingMessage && (
        <div style={{ padding: '15px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '5px', marginBottom: '20px', fontWeight: 'bold' }}>
          {bookingMessage}
        </div>
      )}

      <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {assets.map((item) => (
          <div key={item.id} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <h2 style={{ margin: '0 0 10px 0', color: '#2980b9' }}>{item.name}</h2>
            <p><strong>Category:</strong> {item.category}</p>
            <p><strong>Details:</strong> {item.description}</p>
            
            <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ margin: 0, fontWeight: 'bold' }}>
                Availability: <span style={{ color: item.availableQuantity > 0 ? 'green' : 'red' }}>{item.availableQuantity} / {item.totalQuantity}</span>
              </p>
              
              {/* UPDATED: Button now opens the modal instead of booking instantly */}
              {token && item.availableQuantity > 0 && (
                <button 
                  onClick={() => openIssueModal(item)}
                  style={{ padding: '8px 15px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Issue Asset
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* NEW: The Floating Pop-Up Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', width: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h2 style={{ marginTop: 0, color: '#2c3e50' }}>Issue Asset</h2>
            <p style={{ color: '#7f8c8d', marginBottom: '20px' }}>Issuing <strong>{selectedAsset?.name}</strong>.</p>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Student / Borrower Name</label>
              <input 
                type="text" 
                value={borrowerName}
                onChange={(e) => setBorrowerName(e.target.value)}
                placeholder="e.g., John Doe"
                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Roll Number / ID</label>
              <input 
                type="text" 
                value={borrowerId}
                onChange={(e) => setBorrowerId(e.target.value)}
                placeholder="e.g., 24112039"
                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                onClick={() => setShowModal(false)}
                style={{ padding: '10px 15px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmIssue}
                style={{ padding: '10px 15px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Confirm Issue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventory;