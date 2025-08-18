import React, { useState,useRef  } from 'react';
import '../styles/Login.css'
export default function BuyerCreateRFP() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [documents, setDocuments] = useState([]);
  const [message, setMessage] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setDocuments(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('deadline', deadline);

    for (let i = 0; i < documents.length; i++) {
      formData.append('documents', documents[i]);
    }

    try {
      const res = await fetch('/api/rfp/create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('RFP created successfully!');
        // Clear form fields
        setTitle('');
        setDescription('');
        setDeadline('');
        setDocuments([]); // assuming documents is an array state

        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
        } else {
        setMessage(data.error || 'Failed to create RFP');
        }
    } catch (err) {
      setMessage('Server error');
    }
  };

  return (
    <div className="container mt-4 mx-0 form-mod p-3">
      <h3 className='form-title-sm mb-1'>Create New Proposal</h3>
      <p className='mb-4 form-subtitle mb-3'>Sign in to track proposals and responses.</p>

      {message && <div className="alert alert-info">{message}</div>}
      <form  onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className='mb-1'>Title</label>
          <input
            type="text" className="form-control" required
            value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className='mb-1'>Description</label>
          <textarea
            className="form-control" rows="3"
            value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className='mb-1'>Deadline</label>
          <input
            type="date" className="form-control" required
            value={deadline} onChange={e => setDeadline(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className='mb-1'>Upload Documents</label>
          <input
            type="file" className="form-control" ref={fileInputRef} multiple
            onChange={handleFileChange} />
        </div>
        <button className="btn btn-primary submit-btn" type="submit">Create RFP</button>
      </form>
    </div>
  );
}
