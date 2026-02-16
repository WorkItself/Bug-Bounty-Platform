import React, { useState } from 'react';

const AddProject = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to a backend server
    alert(`Project Submitted!
Title: ${title}
Description: ${description}
Budget: $${budget}`);
    setTitle('');
    setDescription('');
    setBudget('');
  };

  const formStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
    background: 'linear-gradient(145deg, #1e2a3a, #101822)',
    borderRadius: '12px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
  };

  const inputStyle = {
    width: '100%',
    padding: '0.8rem 1rem',
    marginBottom: '1.5rem',
    background: '#101822',
    border: '1px solid #333',
    borderRadius: '8px',
    color: '#e0e0e0',
    fontSize: '1rem',
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '150px',
    resize: 'vertical',
  };

  const buttonStyle = {
    width: '100%',
    padding: '1rem',
    background: 'linear-gradient(90deg, #00C9FF 0%, #92FE9D 100%)',
    border: 'none',
    borderRadius: '8px',
    color: '#101822',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
  };

  return (
    <div style={{ padding: '2rem', color: '#e0e0e0' }}>
      <h1 style={{ textAlign: 'center', fontSize: '3rem', fontWeight: 'bold', marginBottom: '2rem' }}>
        Create a New Bounty Program
      </h1>
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="title" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Project Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={inputStyle}
            placeholder="e.g., 'E-commerce Platform Security Audit'"
            required
          />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="description" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={textareaStyle}
            placeholder="Provide a detailed description of the scope, rules, and rewards."
            required
          />
        </div>
        <div style={{ marginBottom: '2rem' }}>
          <label htmlFor="budget" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Total Budget (USD)</label>
          <input
            type="number"
            id="budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            style={inputStyle}
            placeholder="e.g., '10000'"
            required
          />
        </div>
        <button 
          type="submit" 
          style={buttonStyle}
          onMouseOver={e => {
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.boxShadow = '0 0 20px #00C9FF88';
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Launch Program
        </button>
      </form>
    </div>
  );
};

export default AddProject;
